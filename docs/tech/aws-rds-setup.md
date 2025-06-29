# AWS RDS PostgreSQL Setup Guide

This guide walks you through setting up AWS RDS PostgreSQL for Project Vista and deploying the backend.

## Prerequisites

- AWS Account with appropriate permissions
- AWS CLI configured
- Python 3.9+ installed
- Supabase project for authentication

## Step 1: Create AWS RDS PostgreSQL Instance

### 1.1 Launch RDS Instance

1. Go to AWS RDS Console
2. Click "Create database"
3. Choose "Standard create"
4. Select "PostgreSQL" as engine
5. Choose "Free tier" for development or appropriate tier for production
6. Configure settings:
   - **DB instance identifier**: `project-vista-db`
   - **Master username**: `postgres` (or your preferred username)
   - **Master password**: Create a strong password
   - **DB instance class**: `db.t3.micro` (free tier) or appropriate size
   - **Storage**: 20 GB (minimum)
   - **Storage type**: General Purpose SSD (gp2)

### 1.2 Network Configuration

1. **VPC**: Choose default VPC or create a new one
2. **Subnet group**: Create a new subnet group or use default
3. **Publicly accessible**: **Yes** (for development) or **No** (for production)
4. **VPC security group**: Create a new security group
5. **Availability Zone**: Choose any available zone
6. **Database port**: 5432 (default)

### 1.3 Security Group Configuration

1. Create a new security group named `project-vista-rds-sg`
2. Add inbound rule:
   - **Type**: PostgreSQL
   - **Protocol**: TCP
   - **Port**: 5432
   - **Source**: Your Lambda function's security group or `0.0.0.0/0` (for development)

### 1.4 Database Configuration

1. **Initial database name**: `projectvista`
2. **Backup retention period**: 7 days (recommended)
3. **Enable encryption**: Yes (recommended)
4. **Enable monitoring**: Yes (optional)

## Step 2: Configure Environment Variables

### 2.1 Backend Environment (.env)

Create a `.env` file in `apps/backend/`:

```env
# Supabase Configuration (for authentication only)
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# AWS RDS PostgreSQL Configuration
DATABASE_URL=postgresql://username:password@your-rds-endpoint:5432/projectvista

# Optional: Database connection pool settings
DB_POOL_SIZE=10
DB_MAX_OVERFLOW=20
DB_POOL_TIMEOUT=30
DB_POOL_RECYCLE=3600
```

### 2.2 Frontend Environment (.env)

Create a `.env` file in `apps/frontend/`:

```env
# Supabase Configuration (for authentication only)
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Backend API Configuration
VITE_API_BASE_URL=http://localhost:8000
```

## Step 3: Initialize Database

### 3.1 Install Dependencies

```bash
cd apps/backend
pip install -r requirements.txt
```

### 3.2 Run Database Setup

```bash
python scripts/setup_db.py
```

This will:
- Create the database tables
- Test the connection
- Verify everything is working

## Step 4: Deploy to AWS Lambda

### 4.1 Install Zappa

```bash
pip install zappa
```

### 4.2 Configure Zappa

Create `zappa_settings.json` in `apps/backend/`:

```json
{
    "dev": {
        "app_function": "app.main.app",
        "aws_region": "us-east-1",
        "profile_name": "default",
        "project_name": "project-vista",
        "runtime": "python3.9",
        "s3_bucket": "project-vista-lambda-deployments",
        "environment_variables": {
            "DATABASE_URL": "your_rds_connection_string_here",
            "SUPABASE_URL": "your_supabase_url_here",
            "SUPABASE_SERVICE_ROLE_KEY": "your_supabase_service_key_here"
        },
        "vpc_config": {
            "SubnetIds": ["subnet-xxxxx", "subnet-yyyyy"],
            "SecurityGroupIds": ["sg-xxxxx"]
        }
    }
}
```

### 4.3 Deploy

```bash
./scripts/deploy.sh
```

Or manually:

```bash
zappa deploy dev
```

## Step 5: Update Frontend Configuration

After deployment, update your frontend environment:

```env
VITE_API_BASE_URL=https://your-api-gateway-url.amazonaws.com/dev
```

## Step 6: Test the Setup

### 6.1 Test API Endpoints

1. Visit your API documentation: `https://your-api-url/docs`
2. Test the health endpoint: `GET /api/health`
3. Test authentication: `GET /api/user/profile` (requires JWT)

### 6.2 Test Frontend Integration

1. Start the frontend: `npm run dev`
2. Log in with Supabase Auth
3. Create a new track
4. Verify it persists after logout/login

## Troubleshooting

### Common Issues

1. **Connection Timeout**: Check security group rules and VPC configuration
2. **Authentication Errors**: Verify Supabase credentials and JWT validation
3. **CORS Errors**: Ensure CORS is properly configured in FastAPI
4. **Database Connection**: Verify DATABASE_URL format and credentials

### Security Best Practices

1. **Production**: Use private subnets and restrict security group access
2. **Secrets**: Store sensitive data in AWS Secrets Manager
3. **Encryption**: Enable RDS encryption at rest
4. **Backups**: Configure automated backups
5. **Monitoring**: Set up CloudWatch alarms

### Performance Optimization

1. **Connection Pooling**: Adjust pool settings based on Lambda concurrency
2. **Caching**: Consider Redis for frequently accessed data
3. **Indexing**: Monitor query performance and add indexes as needed
4. **Scaling**: Use RDS read replicas for read-heavy workloads

## Next Steps

1. Set up CI/CD pipeline with GitHub Actions
2. Configure monitoring and alerting
3. Implement backup and disaster recovery
4. Add rate limiting and security headers
5. Set up staging environment

## Support

For issues or questions:
1. Check the FastAPI logs in CloudWatch
2. Verify RDS connection in AWS Console
3. Test database connectivity locally
4. Review security group configurations
