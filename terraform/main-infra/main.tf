terraform {
  backend "s3" {
    bucket         = "project-vista-terraform-state"
    key            = "terraform/state/main-infra"
    region         = "eu-north-1"
    dynamodb_table = "project-vista-terraform-lock"
    encrypt        = true
  }
}

provider "aws" {
  region = var.aws_region
}

locals {
  vpc_id    = var.existing_vpc_id != "" ? var.existing_vpc_id : null
  subnet_id = var.existing_subnet_id != "" ? var.existing_subnet_id : null
  resource_prefix = "${var.project_name}-${var.environment}"
}

# Use data sources to fetch existing VPC
data "aws_vpc" "existing" {
  id = local.vpc_id

  # If no VPC ID is provided, filter by default VPC
  dynamic "filter" {
    for_each = local.vpc_id == null ? [1] : []
    content {
      name   = "isDefault"
      values = ["true"]
    }
  }
}

# Use data source to fetch existing subnet
data "aws_subnet" "existing" {
  vpc_id = data.aws_vpc.existing.id
  id     = local.subnet_id

  # If no subnet ID is provided, get a public subnet from the VPC
  dynamic "filter" {
    for_each = local.subnet_id == null ? [1] : []
    content {
      name   = "map-public-ip-on-launch"
      values = ["true"]
    }
  }

  # Only needed if no subnet ID is provided
  dynamic "filter" {
    for_each = local.subnet_id == null ? [1] : []
    content {
      name   = "availability-zone"
      values = ["${var.aws_region}a"]
    }
  }
}

# Security group - use for_each to prevent recreation
resource "aws_security_group" "web" {
  name        = "${local.resource_prefix}-web-sg"
  description = "Allow web and SSH traffic"
  vpc_id      = data.aws_vpc.existing.id

  # Only create if it doesn't exist
  lifecycle {
    create_before_destroy = true
    # Prevent changes to name to avoid recreation
    ignore_changes = [
      name,
      description
    ]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "${local.resource_prefix}-web-sg"
    Environment = var.environment
    Project     = var.project_name
    ManagedBy   = "terraform"
  }
}

# Use a data source to get the latest Amazon Linux 2 AMI
data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# EC2 instance - using t2.micro which is free tier eligible
resource "aws_instance" "web" {
  ami                    = data.aws_ami.amazon_linux.id
  instance_type          = var.instance_type
  subnet_id              = data.aws_subnet.existing.id
  vpc_security_group_ids = [aws_security_group.web.id]
  key_name               = var.key_name

  # Prevent unnecessary replacements
  lifecycle {
    ignore_changes = [
      ami,            # Allow AMI updates without replacing instance
      user_data      # Allow user_data updates without replacing instance
    ]
  }

  # Free tier eligible EBS volume
  root_block_device {
    volume_size = 8 # 8 GB is within free tier
    volume_type = "gp2"
  }

  tags = {
    Name        = "${local.resource_prefix}-backend"
    Environment = var.environment
    Project     = var.project_name
    ManagedBy   = "terraform"
  }

  user_data = <<-EOF
              #!/bin/bash
              yum update -y
              yum install -y docker
              systemctl start docker
              systemctl enable docker
              curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
              chmod +x /usr/local/bin/docker-compose
              EOF
}

# Output the public IP
output "instance_public_ip" {
  value = aws_instance.web.public_ip
}
