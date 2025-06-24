variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "eu-north-1"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.micro"
}

variable "key_name" {
  description = "Name of the SSH key pair"
  type        = string
  default     = "project-vista-prod-keypair"
}

variable "project_name" {
  description = "Name of the project for resource tagging"
  type        = string
  default     = "project-vista"
}

variable "environment" {
  description = "Environment (dev, prod, etc.)"
  type        = string
  default     = "dev"
}

variable "notification_email" {
  description = "Email address to receive budget notifications"
  type        = string
  default     = "alonemanuel95@gmail.com"  # Replace with your email
}

variable "existing_vpc_id" {
  description = "ID of an existing VPC to use"
  type        = string
  default     = ""
}

variable "existing_subnet_id" {
  description = "ID of an existing subnet to use"
  type        = string
  default     = ""
}
