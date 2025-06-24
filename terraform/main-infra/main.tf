provider "aws" {
  region = var.aws_region
}

# Use data sources to fetch existing VPC and subnet
data "aws_vpc" "existing" {
  id = var.existing_vpc_id != "" ? var.existing_vpc_id : null

  # If no VPC ID is provided, filter by name tag
  dynamic "filter" {
    for_each = var.existing_vpc_id == "" ? [1] : []
    content {
      name   = "tag:Name"
      values = ["default"]
    }
  }
}

data "aws_subnet" "existing" {
  id = var.existing_subnet_id != "" ? var.existing_subnet_id : null

  # If no subnet ID is provided, get the first public subnet from the VPC
  dynamic "filter" {
    for_each = var.existing_subnet_id == "" ? [1] : []
    content {
      name   = "vpc-id"
      values = [data.aws_vpc.existing.id]
    }
  }

  # Prefer a public subnet if available
  dynamic "filter" {
    for_each = var.existing_subnet_id == "" ? [1] : []
    content {
      name   = "map-public-ip-on-launch"
      values = ["true"]
    }
  }
}

# Security group
resource "aws_security_group" "web" {
  name        = "${var.project_name}-web-sg"
  description = "Allow web and SSH traffic"
  vpc_id      = data.aws_vpc.existing.id

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
    Name = "${var.project_name}-web-sg"
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
  # Use region-specific free tier AMIs
  ami                    = data.aws_ami.amazon_linux.id

  instance_type          = var.instance_type
  subnet_id              = data.aws_subnet.existing.id
  vpc_security_group_ids = [aws_security_group.web.id]
  key_name               = var.key_name

  # Free tier eligible EBS volume
  root_block_device {
    volume_size = 8 # 8 GB is within free tier
    volume_type = "gp2"
  }

  tags = {
    Name = "${var.project_name}-backend"
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

# Budget alarm for $1 threshold
resource "aws_budgets_budget" "zero_cost_budget" {
  name              = "${var.project_name}-minimal-cost-budget"
  budget_type       = "COST"
  limit_amount      = "1"  # Minimum allowed is $1
  limit_unit        = "USD"
  time_unit         = "MONTHLY"
  time_period_start = formatdate("YYYY-MM-DD_hh:mm", timestamp())

  notification {
    comparison_operator        = "GREATER_THAN"
    threshold                  = 0.01  # Notify at 1 cent (1% of $1)
    threshold_type             = "PERCENTAGE"
    notification_type          = "ACTUAL"
    subscriber_email_addresses = [var.notification_email]
  }
}

# Output the public IP
output "instance_public_ip" {
  value = aws_instance.web.public_ip
}
