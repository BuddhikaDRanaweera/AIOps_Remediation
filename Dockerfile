# Stage 1: Build the dependencies
FROM python:3.12-slim AS build

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    python3-dev \
    default-libmysqlclient-dev \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

# Copy the requirements file and install dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Stage 2: Create the final Lambda image
FROM public.ecr.aws/lambda/python:3.12

# Copy installed packages from the build stage
COPY --from=build /usr/local/lib/python3.12/site-packages /var/task/

# Copy the rest of your application code
COPY . .

# Specify the CMD to run your Lambda function
CMD ["app.lambda_handler"]
