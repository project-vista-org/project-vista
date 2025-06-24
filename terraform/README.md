# Project Vista Infrastructure

This directory contains Terraform configurations to provision the AWS infrastructure for Project Vista.

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

## Manual Deployment

1. Initialize Terraform:
   ```bash
   terraform init
   ```

2. Plan the deployment:
   ```bash
   terraform plan
   ```

3. Apply the configuration:
   ```bash
   terraform apply
   ```

4. Get the EC2 instance IP:
   ```bash
   terraform output instance_ip
   ```

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
