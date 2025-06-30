import logging
import logging.config
import os
from typing import Any, Dict

import boto3
from botocore.exceptions import ClientError, NoCredentialsError


def get_logging_config() -> Dict[str, Any]:
    """Get logging configuration based on environment"""

    # Get environment variables
    environment = os.getenv("ENVIRONMENT", "dev")
    aws_region = os.getenv("AWS_REGION", "eu-north-1")
    log_group_name = f"project-vista-{environment}"

    # Base logging configuration
    config = {
        "version": 1,
        "disable_existing_loggers": False,
        "formatters": {
            "standard": {
                "format": "%(asctime)s [%(levelname)s] %(name)s: %(message)s",
                "datefmt": "%Y-%m-%d %H:%M:%S",
            },
            "detailed": {
                "format": (
                    "%(asctime)s [%(levelname)s] %(name)s:%(lineno)d - %(funcName)s(): %(message)s"
                ),
                "datefmt": "%Y-%m-%d %H:%M:%S",
            },
            "json": {
                "()": "pythonjsonlogger.jsonlogger.JsonFormatter",
                "format": "%(asctime)s %(name)s %(levelname)s %(message)s",
            },
        },
        "handlers": {
            "console": {
                "class": "logging.StreamHandler",
                "level": "INFO",
                "formatter": "standard",
                "stream": "ext://sys.stdout",
            }
        },
        "loggers": {
            "project_vista": {
                "level": "INFO",
                "handlers": ["console"],
                "propagate": False,
            },
            "fastapi": {"level": "INFO", "handlers": ["console"], "propagate": False},
            "uvicorn": {"level": "INFO", "handlers": ["console"], "propagate": False},
            "sqlalchemy": {
                "level": "WARNING",
                "handlers": ["console"],
                "propagate": False,
            },
            # Suppress watchtower warnings for cleaner local development
            "watchtower": {
                "level": "ERROR",
                "handlers": ["console"],
                "propagate": False,
            },
        },
        "root": {"level": "INFO", "handlers": ["console"]},
    }

    # Add CloudWatch handler for production/staging
    if environment in ["prod", "staging"]:
        # Check if CloudWatch logging should be disabled
        disable_cloudwatch = (
            os.getenv("DISABLE_CLOUDWATCH_LOGGING", "false").lower() == "true"
        )

        if not disable_cloudwatch:
            try:
                # Test AWS credentials first
                logs_client = boto3.client('logs', region_name=aws_region)
                logs_client.describe_log_groups(limit=1)  # Test call

                # Create CloudWatch handler with timeout settings
                config["handlers"]["cloudwatch"] = {
                    "class": "watchtower.CloudWatchLogHandler",
                    "log_group": log_group_name,
                    "stream_name": f"{environment}-api",
                    "boto3_client": logs_client,
                    "level": "INFO",
                    "formatter": "detailed",
                    "max_batch_size": 10,
                    # Add timeout settings to prevent hanging
                    "send_interval": 5,  # Send logs every 5 seconds
                    "max_batch_count": 100,  # Smaller batch size
                    "create_log_group": True,  # Auto-create log group if it doesn't exist
                }

                # Add cloudwatch to all loggers
                for logger_name in config["loggers"]:
                    config["loggers"][logger_name]["handlers"].append("cloudwatch")

                config["root"]["handlers"].append("cloudwatch")

            except (NoCredentialsError, ClientError, Exception) as e:
                print(
                    f"CloudWatch logging disabled - AWS credentials not available or invalid: {e}"
                )
                print("Set DISABLE_CLOUDWATCH_LOGGING=true to suppress this message")
                print("Falling back to console logging only")

    return config


def setup_logging():
    """Initialize logging configuration"""
    config = get_logging_config()
    logging.config.dictConfig(config)

    # Get the project logger
    logger = logging.getLogger("project_vista")
    environment = os.getenv("ENVIRONMENT", "dev")

    logger.info(f"Logging initialized for environment: {environment}")
    return logger


# Create the main logger instance
logger = setup_logging()
