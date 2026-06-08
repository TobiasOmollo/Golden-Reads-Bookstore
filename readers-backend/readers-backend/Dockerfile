FROM python:3.11-slim

# Set system optimizations for Python inside containers
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /workspace

# Install system dependencies needed for compilation tools (like bcrypt)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libffi-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy the rest of your application code
COPY . .

# Expose FastAPI's default port matching your uvicorn configuration
EXPOSE 8000

# Fire up the server, binding it to intercept incoming traffic safely
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
