# Setting Up the GitHub Actions Role

This guide provides step-by-step instructions for setting up the GitHub Actions role for AWS authentication.

## Prerequisites

- AWS CLI installed and configured with admin access
- Terraform installed on your local machine
- Git repository cloned locally

## Step 1: Configure AWS CLI

Ensure your AWS CLI is configured with admin credentials:

```bash
aws configure
# Enter your AWS Access Key ID
# Enter your AWS Secret Access Key
# Enter default region (e.g., eu-north-1)
# Enter default output format (e.g., json)
```

## Step 2: Update Variables (if needed)

The `variables.tf` file has been updated with the correct GitHub owner and repository name:
- GitHub owner: `the-vista-project`
- GitHub repo: `the-vista-project`

If you need to update the email for budget notifications, edit `terraform/github-actions-role/variables.tf`.

## Step 3: Deploy the GitHub Actions Role

Run the following commands:

```bash
# Navigate to the github-actions-role directory
cd terraform/github-actions-role

# Initialize Terraform
terraform init

# Preview the changes
terraform plan

# Apply the changes
terraform apply
```

When prompted, type `yes` to confirm the deployment.

## Step 4: Note the Role ARN

After successful deployment, Terraform will output the GitHub Actions role ARN. It will look something like:
```
github_actions_role_arn = "arn:aws:iam::123456789012:role/project-vista-github-actions-role"
```

Copy this ARN for the next step.

## Step 5: Add the Role ARN to GitHub Repository Variables

1. Go to your GitHub repository: https://github.com/the-vista-project/the-vista-project
2. Click on "Settings" (top navigation)
3. In the left sidebar, click on "Secrets and variables" → "Actions"
4. Select the "Variables" tab
5. Click "New repository variable"
6. Add a variable:
   - Name: `AWS_ROLE_TO_ASSUME`
   - Value: [paste the role ARN from Step 4]
7. Click "Add variable"

## Step 6: Verify Setup

To verify the setup:
1. Go to the "Actions" tab in your GitHub repository
2. Run the "Deploy Backend" workflow manually
3. Check that the workflow can successfully authenticate with AWS

## Troubleshooting

If you encounter authentication issues:

1. **Trust Relationship Issues**:
   - Verify the trust relationship in the IAM role matches your GitHub repository exactly
   - Check the AWS CloudTrail logs for AssumeRoleWithWebIdentity failures

2. **Permission Issues**:
   - Ensure the role has the necessary permissions for the actions it needs to perform
   - Check the IAM policies attached to the role

3. **GitHub Workflow Issues**:
   - Verify the workflow has the correct permissions:
     ```yaml
     permissions:
       id-token: write
       contents: read
     ```
   - Ensure the variable `AWS_ROLE_TO_ASSUME` is correctly set in the repository
