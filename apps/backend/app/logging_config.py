import logging
import logging.config
import os
from typing import Any, Dict

import boto3
from watchtower import CloudWatchLogsHandler


def get_logging_config() -> Dict[str, Any]:
    """Get logging configuration based on environment"""

    # Get environment variables
    environment = os.getenv("ENVIRONMENT", "development")
    aws_region = os.getenv("AWS_REGION", "us-east-1")
    log_group_name = os.getenv("LOG_GROUP_NAME", f"project-vista-{environment}")

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
        },
        "root": {"level": "INFO", "handlers": ["console"]},
    }

    # Add CloudWatch handler for production/staging
    if environment in ["production", "staging"]:
        try:
            # Create CloudWatch handler
            cloudwatch_handler = CloudWatchLogsHandler(
                log_group=log_group_name,
                stream_name=f"{environment}-api",
                boto3_client=boto3.client('logs', region_name=aws_region),
                max_batch_size=10,
                max_batch_count=10000,
            )

            config["handlers"]["cloudwatch"] = {
                "()": cloudwatch_handler,
                "level": "INFO",
                "formatter": "detailed",
            }

            # Add cloudwatch to all loggers
            for logger_name in config["loggers"]:
                config["loggers"][logger_name]["handlers"].append("cloudwatch")

            config["root"]["handlers"].append("cloudwatch")

        except Exception as e:
            print(f"Failed to setup CloudWatch logging: {e}")
            print("Falling back to console logging only")

    return config


def setup_logging():
    """Initialize logging configuration"""
    config = get_logging_config()
    logging.config.dictConfig(config)

    # Get the project logger
    logger = logging.getLogger("project_vista")
    environment = os.getenv("ENVIRONMENT", "development")

    logger.info(f"Logging initialized for environment: {environment}")
    return logger


# Create the main logger instance
logger = setup_logging()
