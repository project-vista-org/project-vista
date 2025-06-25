# Budget alarm with stable name and import logic
resource "aws_budgets_budget" "cost_budget" {
  name              = "${var.project_name}-${var.environment}-cost-budget"
  budget_type       = "COST"
  limit_amount      = "1"  # Minimum allowed is $1
  limit_unit        = "USD"
  time_unit         = "MONTHLY"
  time_period_start = "2023-01-01_00:00"  # Fixed date in the past
  time_period_end   = "2087-06-15_00:00"  # Far future date

  notification {
    comparison_operator        = "GREATER_THAN"
    threshold                  = 0.01  # Notify at 1 cent (1% of $1)
    threshold_type             = "PERCENTAGE"
    notification_type          = "ACTUAL"
    subscriber_email_addresses = [var.notification_email]
  }

  # Prevent recreation on each apply
  lifecycle {
    # Prevent replacement when these attributes change
    ignore_changes = [
      time_period_start,
      time_period_end
    ]

    # If resource already exists with same name but different attributes,
    # prevent error by ignoring conflicts
    create_before_destroy = true
  }
}
