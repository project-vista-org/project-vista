# Terraform Infrastructure

This directory contains Terraform code for provisioning AWS infrastructure for the Vista project.

## Directory Structure

- **`main-infra/`**: Contains the main infrastructure code (VPC, EC2, etc.)
- **`github-actions-role/`**: Contains the GitHub Actions OIDC provider and IAM role setup (separate module)

## Setup Order

1. First, set up the GitHub Actions role:
   ```bash
   cd github-actions-role
   terraform init
   terraform apply
   ```
   See the [GitHub Actions Role README](./github-actions-role/README.md) for detailed instructions.

2. After setting up the GitHub Actions role and configuring the GitHub repository variable, the main infrastructure will be deployed automatically by the CI/CD pipeline when changes are pushed to the main branch.

## Manual Deployment

If you need to deploy the main infrastructure manually:

```bash
cd main-infra
terraform init
terraform plan -var="environment=dev" -var="instance_type=t2.micro"
terraform apply -var="environment=dev" -var="instance_type=t2.micro"
```

## Variables

Common variables used across modules:

- `aws_region`: AWS region to deploy resources (default: "eu-north-1")
- `environment`: Environment name (dev, prod, etc.)
- `project_name`: Project name for resource tagging
- `instance_type`: EC2 instance type (default: "t2.micro")

## Outputs

- `instance_public_ip`: Public IP of the EC2 instance

## Architecture

The infrastructure includes:
- VPC with public subnet in eu-north-1b
- Security groups for web traffic
- EC2 instance for hosting the backend
- Docker for containerization
- Amazon ECR for container registry

## Manual Instance Control

You can manually start or stop your instance when needed:

```bash
# Start instance
aws ec2 start-instances --instance-ids i-1234567890abcdef0

# Stop instance
aws ec2 stop-instances --instance-ids i-1234567890abcdef0
```

Replace `i-1234567890abcdef0` with your actual instance ID.

## Prerequisites

- [Terraform](https://www.terraform.io/downloads.html) installed
- AWS credentials configured
- SSH key pair created in AWS

## CI/CD Pipeline

The project uses GitHub Actions for CI/CD:

1. When code is pushed to main:
   - Tests are run
   - Docker image is built and pushed to Amazon ECR
   - Terraform provisions/updates infrastructure
   - Docker container is deployed to EC2

2. Required GitHub Secrets:
   - `AWS_ACCESS_KEY_ID`: AWS access key
   - `AWS_SECRET_ACCESS_KEY`: AWS secret key
   - `EC2_SSH_KEY`: Private SSH key for EC2 access
   - `DATABASE_URL`: PostgreSQL connection string
   - `SUPABASE_URL`: Supabase project URL
   - `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key

## Infrastructure Updates

To update infrastructure:
1. Modify the Terraform files
2. Commit and push to main
3. GitHub Actions will apply the changes
