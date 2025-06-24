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

## Using Existing VPC and Subnet

The infrastructure is configured to work with existing VPCs and subnets to avoid hitting AWS VPC limits and prevent unnecessary resource creation. You can:

1. **Use an existing VPC and subnet** - Provide the IDs in the GitHub Actions workflow inputs:
   - `existing_vpc_id`: The ID of your existing VPC (e.g., vpc-0123456789abcdef0)
   - `existing_subnet_id`: The ID of an existing public subnet (e.g., subnet-0123456789abcdef0)

2. **Let Terraform find the default VPC** - Leave the VPC ID empty, and Terraform will attempt to use the default VPC

3. **Find your VPCs** using the AWS CLI:
   ```bash
   aws ec2 describe-vpcs --region eu-north-1 --query 'Vpcs[*].{VpcId:VpcId,CidrBlock:CidrBlock,Name:Tags[?Key==`Name`].Value|[0],IsDefault:IsDefault}' --output table
   ```

4. **Find subnets** in a specific VPC:
   ```bash
   aws ec2 describe-subnets --region eu-north-1 --filters "Name=vpc-id,Values=vpc-YOUR_VPC_ID" --query 'Subnets[*].{SubnetId:SubnetId,CidrBlock:CidrBlock,AZ:AvailabilityZone,Public:MapPublicIpOnLaunch}' --output table
   ```

## Resource Management

The infrastructure is designed to:

1. **Reuse existing resources** when possible
2. **Avoid recreation** of resources on subsequent deployments
3. **Use unique names** for resources that can't be updated in-place

This approach minimizes AWS costs and prevents hitting service limits.

## Manual Deployment

If you need to deploy the main infrastructure manually:

```bash
cd main-infra
terraform init
terraform plan -var="environment=dev" -var="instance_type=t2.micro"
terraform apply -var="environment=dev" -var="instance_type=t2.micro"
```

### Using an Existing VPC

If you've hit the VPC limit in your AWS account, you can use an existing VPC instead of creating a new one:

```bash
cd main-infra
terraform init
terraform plan \
  -var="environment=dev" \
  -var="instance_type=t2.micro" \
  -var="existing_vpc_id=vpc-12345678" \
  -var="existing_subnet_id=subnet-12345678"
terraform apply \
  -var="environment=dev" \
  -var="instance_type=t2.micro" \
  -var="existing_vpc_id=vpc-12345678" \
  -var="existing_subnet_id=subnet-12345678"
```

You can also leave `existing_subnet_id` empty to automatically select a public subnet from the VPC:

```bash
terraform apply -var="existing_vpc_id=vpc-12345678"
```

## Variables

Common variables used across modules:

- `aws_region`: AWS region to deploy resources (default: "eu-north-1")
- `environment`: Environment name (dev, prod, etc.)
- `project_name`: Project name for resource tagging
- `instance_type`: EC2 instance type (default: "t2.micro")
- `existing_vpc_id`: ID of an existing VPC to use (optional)
- `existing_subnet_id`: ID of an existing subnet to use (optional)

## Outputs

- `instance_public_ip`: Public IP of the EC2 instance

## Architecture

The infrastructure includes:
- VPC with public subnet in eu-north-1b (or an existing VPC)
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
