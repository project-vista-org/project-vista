FROM python:3.11-slim

# Set the working directory to the root
WORKDIR /code

# Install dependencies
COPY requirements.txt /code/
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire backend app structure to preserve imports
COPY . /code/apps/backend/

# Set PYTHONPATH to include the root so apps.* imports work
ENV PYTHONPATH=/code

# Expose port
EXPOSE 8000

# Command to run the application with correct module path
CMD ["uvicorn", "apps.backend.app.main:app", "--host", "0.0.0.0", "--port", "8000"]
