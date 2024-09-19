# Use an official Python image
FROM python:3.12-slim

# Install system dependencies for mysqlclient
RUN apt-get update && apt-get install -y default-libmysqlclient-dev gcc \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

# Copy the requirements file
COPY requirements.txt ./

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy your application code
COPY . .

# Set the command to run your app
CMD ["python", "run.py"]  # Adjust if your entry point is different
