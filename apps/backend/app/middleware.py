import logging
import time
import uuid
from typing import Callable

from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.types import ASGIApp

# Get the project logger
logger = logging.getLogger("project_vista")


class LoggingMiddleware(BaseHTTPMiddleware):
    """Middleware to log all HTTP requests and responses"""

    def __init__(self, app: ASGIApp):
        super().__init__(app)

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        # Generate request ID for tracing
        request_id = str(uuid.uuid4())[:8]

        # Start timing
        start_time = time.time()

        # Get request details
        method = request.method
        url = str(request.url)
        client_ip = request.client.host if request.client else "unknown"
        user_agent = request.headers.get("user-agent", "unknown")

        # Log incoming request
        logger.info(
            "Request started",
            extra={
                "request_id": request_id,
                "method": method,
                "url": url,
                "client_ip": client_ip,
                "user_agent": user_agent,
            },
        )

        # Add request ID to request state for potential use in routes
        request.state.request_id = request_id

        try:
            # Process request
            response = await call_next(request)

            # Calculate processing time
            process_time = time.time() - start_time

            # Log successful response
            logger.info(
                "Request completed",
                extra={
                    "request_id": request_id,
                    "method": method,
                    "url": url,
                    "status_code": response.status_code,
                    "process_time": round(process_time, 4),
                    "client_ip": client_ip,
                },
            )

            # Add request ID to response headers
            response.headers["X-Request-ID"] = request_id

            return response

        except Exception as e:
            # Calculate processing time for error case
            process_time = time.time() - start_time

            # Log error
            logger.error(
                f"Request failed: {str(e)}",
                extra={
                    "request_id": request_id,
                    "method": method,
                    "url": url,
                    "error": str(e),
                    "error_type": type(e).__name__,
                    "process_time": round(process_time, 4),
                    "client_ip": client_ip,
                },
                exc_info=True,
            )

            # Re-raise the exception
            raise


class DatabaseLoggingMixin:
    """Mixin to add database operation logging to repositories/services"""

    def __init__(self):
        self.logger = logging.getLogger(f"project_vista.{self.__class__.__name__}")

    def log_db_operation(
        self, operation: str, table: str, record_id: str = None, **kwargs
    ):
        """Log database operations"""
        extra_data = {
            "operation": operation,
            "table": table,
            "record_id": record_id,
            **kwargs,
        }

        self.logger.info(f"Database {operation} on {table}", extra=extra_data)

    def log_db_error(self, operation: str, table: str, error: Exception, **kwargs):
        """Log database errors"""
        extra_data = {
            "operation": operation,
            "table": table,
            "error": str(error),
            "error_type": type(error).__name__,
            **kwargs,
        }

        self.logger.error(
            f"Database {operation} failed on {table}: {str(error)}",
            extra=extra_data,
            exc_info=True,
        )
