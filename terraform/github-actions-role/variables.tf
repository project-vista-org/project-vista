variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "eu-north-1"
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

variable "github_owner" {
  description = "GitHub owner/organization name"
  type        = string
  default     = "project-vista-org" # GitHub organization name
}

variable "github_repo" {
  description = "GitHub repository name"
  type        = string
  default     = "project-vista" # Repository name
}

variable "notification_email" {
  description = "Email address to receive budget notifications"
  type        = string
  default     = "your-email@example.com"  # Replace with your actual email
}
