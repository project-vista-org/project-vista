#!/bin/bash

# Project Vista Backend Deployment Script
# This script deploys the FastAPI backend to AWS Lambda using Zappa

set -e

echo "🚀 Deploying Project Vista Backend to AWS Lambda..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found"
    echo "Please create a .env file with your environment variables"
    exit 1
fi

# Check if zappa is installed
if ! command -v zappa &> /dev/null; then
    echo "📦 Installing Zappa..."
    pip install zappa
fi

# Check if zappa_settings.json exists
if [ ! -f zappa_settings.json ]; then
    echo "📝 Creating Zappa configuration..."
    cat > zappa_settings.json << EOF
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
        }
    }
}
EOF
    echo "⚠️  Please update zappa_settings.json with your actual configuration"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
pip install -r requirements.txt

# Deploy to AWS Lambda
echo "🚀 Deploying to AWS Lambda..."
zappa deploy dev

echo "✅ Deployment completed successfully!"
echo "🌐 Your API is now available at the URL shown above"
echo "📚 API documentation: https://your-api-url/docs"
