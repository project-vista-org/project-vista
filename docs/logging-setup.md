# Logging Setup Guide

This guide explains how to set up and use the logging system in Project Vista, including CloudWatch integration for production environments.

## Overview

The logging system provides:
- **Structured logging** with consistent format across backend and frontend
- **Request/response tracking** with unique request IDs
- **Database operation logging** with detailed context
- **CloudWatch integration** for production monitoring
- **Development-friendly console output**

## Backend Logging

### Features

- **Request Middleware**: Automatically logs all HTTP requests and responses
- **Database Logging**: Tracks all database operations with timing and context
- **Error Handling**: Comprehensive error logging with stack traces
- **CloudWatch Integration**: Automatic log shipping to AWS CloudWatch Logs

### Configuration

#### Environment Variables

Add these to your `.env` file:

```bash
# Logging Configuration
ENVIRONMENT=development  # or staging, production
AWS_REGION=us-east-1
LOG_GROUP_NAME=project-vista-development
```

#### Log Levels

- **DEBUG**: Detailed information for debugging (component lifecycle, etc.)
- **INFO**: General information (requests, database operations)
- **WARN**: Warning conditions (token refresh, etc.)
- **ERROR**: Error conditions (failed requests, exceptions)

### Usage Examples

#### Manual Logging in Routes

```python
from apps.backend.app.logging_config import logger

@router.get("/example")
async def example_route():
    logger.info("Processing example request")

    try:
        # Your logic here
        result = await some_operation()
        logger.info("Operation completed successfully", extra={"result_count": len(result)})
        return result
    except Exception as e:
        logger.error("Operation failed", extra={"error": str(e)}, exc_info=True)
        raise
```

#### Database Logging (Automatic)

Database operations are automatically logged when using the `TracksRepository`:

```python
# These operations are automatically logged:
tracks = await tracks_repository.find_by_user_id(user_id="123", session=session)
# Logs: "Database SELECT on tracks" with user_id context

track = await tracks_repository.create(track=new_track, session=session)
# Logs: "Database INSERT on tracks" with user_id and title context
```

## Frontend Logging

### Features

- **API Request/Response Logging**: Automatic logging of all API calls
- **User Action Tracking**: Log user interactions and navigation
- **Error Handling**: Comprehensive error logging with context
- **Development Console Output**: Logs appear in browser console during development

### Usage Examples

#### Manual Logging

```typescript
import { logger } from '@/lib/logger';

// User actions
logger.logUserAction('track_created', { trackId: '123', title: 'My Track' });

// Component lifecycle
logger.logComponentMount('TrackCard', { trackId: '123' });

// Navigation
logger.logNavigation('/tracks', '/tracks/123');

// General logging
logger.info('Processing user data', { userId: '123' });
logger.error('Failed to save data', { error: 'Network timeout' });
```

#### Automatic API Logging

All API calls through the `apiCall` function are automatically logged:

```typescript
// This request is automatically logged
const tracks = await fetchTracks();
// Logs: API Request GET /api/tracks/ and API Response with timing
```

## CloudWatch Setup

### 1. Create CloudWatch Log Group

```bash
aws logs create-log-group --log-group-name project-vista-development --region us-east-1
aws logs create-log-group --log-group-name project-vista-staging --region us-east-1
aws logs create-log-group --log-group-name project-vista-production --region us-east-1
```

### 2. Set IAM Permissions

Your application needs these CloudWatch permissions:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:PutLogEvents",
                "logs:DescribeLogGroups",
                "logs:DescribeLogStreams"
            ],
            "Resource": "arn:aws:logs:*:*:log-group:project-vista-*"
        }
    ]
}
```

### 3. Environment Configuration

For production deployment, set these environment variables:

```bash
ENVIRONMENT=production
AWS_REGION=us-east-1
LOG_GROUP_NAME=project-vista-production
```

### 4. Viewing Logs in CloudWatch

1. Go to AWS CloudWatch Console
2. Navigate to "Logs" → "Log groups"
3. Select your log group (e.g., `project-vista-production`)
4. View log streams organized by date and instance

## Log Format

### Backend Log Format

```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "level": "INFO",
  "logger": "project_vista.TracksRepository",
  "message": "Database SELECT on tracks",
  "request_id": "abc123",
  "user_id": "user-456",
  "operation": "SELECT",
  "table": "tracks",
  "count": 5
}
```

### Frontend Log Format

```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "level": "INFO",
  "message": "API Response - 200",
  "context": {
    "method": "GET",
    "url": "/api/tracks/",
    "status": 200,
    "duration": 150,
    "requestId": "xyz789",
    "type": "api_response"
  }
}
```

## Monitoring and Alerting

### Key Metrics to Monitor

1. **Error Rate**: 4xx and 5xx HTTP responses
2. **Response Time**: API request duration
3. **Database Errors**: Failed database operations
4. **Authentication Issues**: Token refresh failures

### CloudWatch Alarms

Create alarms for:

```bash
# High error rate
aws cloudwatch put-metric-alarm \
  --alarm-name "HighErrorRate" \
  --alarm-description "High API error rate" \
  --metric-name "ErrorCount" \
  --namespace "ProjectVista" \
  --statistic "Sum" \
  --period 300 \
  --evaluation-periods 2 \
  --threshold 10

# Slow response times
aws cloudwatch put-metric-alarm \
  --alarm-name "SlowResponseTime" \
  --alarm-description "Slow API responses" \
  --metric-name "ResponseTime" \
  --namespace "ProjectVista" \
  --statistic "Average" \
  --period 300 \
  --evaluation-periods 2 \
  --threshold 1000
```

## Development vs Production

### Development Mode
- Logs output to console with colored formatting
- More verbose logging (DEBUG level)
- No CloudWatch integration
- Immediate log visibility

### Production Mode
- Logs sent to CloudWatch Logs
- INFO level and above
- Structured JSON format
- Centralized log aggregation

## Troubleshooting

### Common Issues

1. **CloudWatch permissions**: Ensure IAM role has proper permissions
2. **Log group doesn't exist**: Create log group before deployment
3. **High log volume**: Adjust log levels for production
4. **Missing request IDs**: Check middleware order

### Debug Commands

```bash
# Test logging configuration
python -c "from apps.backend.app.logging_config import logger; logger.info('Test log')"

# Check CloudWatch connectivity
aws logs describe-log-groups --log-group-name-prefix project-vista
```

## Cost Optimization

### CloudWatch Costs
- **Ingestion**: $0.50 per GB (first 5GB free)
- **Storage**: $0.03 per GB per month
- **API requests**: $1.00 per million requests

### Best Practices
1. Use appropriate log levels (avoid DEBUG in production)
2. Set log retention periods (e.g., 30 days for development, 1 year for production)
3. Monitor log volume and costs
4. Use log sampling for high-traffic endpoints if needed

## Next Steps

1. **Set up CloudWatch dashboards** for visual monitoring
2. **Configure log retention policies** to manage costs
3. **Set up alerting** for critical errors
4. **Implement log sampling** for high-volume endpoints
5. **Add custom metrics** for business logic monitoring
