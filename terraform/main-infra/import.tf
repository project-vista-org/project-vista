# Import blocks for existing resources
# These blocks tell Terraform how to import existing resources into state
# Uncomment and modify as needed

/*
import {
  # Format: resource_type.resource_name resource_id
  to = aws_security_group.web
  id = "sg-existing-id"
}

import {
  to = aws_budgets_budget.cost_budget
  # Format for budget: account_id:budget_name
  id = "123456789012:project-vista-dev-cost-budget"
}

import {
  to = aws_instance.web
  id = "i-existing-instance-id"
}
*/

# To use these import blocks:
# 1. Uncomment the relevant block
# 2. Replace the ID with your actual resource ID
# 3. Run: terraform init
# 4. Run: terraform plan

# After importing, you can manage these resources with Terraform
# without recreating them.
