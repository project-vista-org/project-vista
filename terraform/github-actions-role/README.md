# GitHub Actions Role Setup

This Terraform module sets up the GitHub Actions OIDC provider and IAM role for secure authentication between GitHub Actions and AWS.

## Why a Separate Module?

This module is separated from the main infrastructure because:

1. **Circular Dependency**: The GitHub Actions role is used to deploy the infrastructure, so it needs to exist before the infrastructure is deployed.
2. **One-time Setup**: The role only needs to be created once, not on every infrastructure deployment.
3. **Permissions**: Creating IAM roles and OIDC providers requires elevated permissions that we don't want to grant to the CI/CD pipeline.

## Setup Instructions

For detailed step-by-step instructions, see [Setup Instructions](./setup-instructions.md).

### Prerequisites

- AWS CLI configured with admin access
- Terraform installed locally

### Steps

1. Update the variables in `variables.tf` if needed:
   - `github_owner`: Your GitHub username or organization
   - `github_repo`: Your GitHub repository name
   - `project_name`: The name used for AWS resources

2. Initialize and apply the Terraform configuration:

```bash
cd terraform/github-actions-role
terraform init
terraform apply
```

3. Note the output `github_actions_role_arn` - you'll need this for the next step.

4. Add the role ARN as a GitHub repository variable:
   - Go to your GitHub repository
   - Click on "Settings" → "Secrets and variables" → "Actions"
   - Select the "Variables" tab
   - Add a variable named `AWS_ROLE_TO_ASSUME` with the value of the role ARN

## Troubleshooting

If you encounter the error "Could not assume role with OIDC: Not authorized to perform sts:AssumeRoleWithWebIdentity", check:

1. The trust relationship in the IAM role matches your GitHub repository exactly
2. The GitHub repository variable `AWS_ROLE_TO_ASSUME` has the correct role ARN
3. The GitHub workflow has the correct permissions:
   ```yaml
   permissions:
     id-token: write
     contents: read
   ```
