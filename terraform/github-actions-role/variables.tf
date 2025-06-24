variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "eu-north-1"
}

variable "project_name" {
  description = "Name of the project for resource tagging"
  type        = string
  default     = "vista"
}

variable "environment" {
  description = "Environment (dev, prod, etc.)"
  type        = string
  default     = "dev"
}

variable "github_owner" {
  description = "GitHub owner/organization name"
  type        = string
  default     = "alonemanuel" # Replace with your GitHub username or organization
}

variable "github_repo" {
  description = "GitHub repository name"
  type        = string
  default     = "the-vista-project" # Replace with your repository name
}
