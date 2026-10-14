# Multi-platform Python Image for Django Backend
FROM python:3.12-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend project code
COPY . /app/

# Collect static files
RUN python manage.py collectstatic --noinput || true

# Expose Django port
EXPOSE 8000

# Run entrypoint script or Gunicorn server
CMD ["sh", "-c", "python manage.py migrate && python seed_data.py && gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 3"]
