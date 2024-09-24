import os
import logging
import stat
import boto3
from botocore.exceptions import NoCredentialsError
from flask import json

# Configure logger
logger = logging.getLogger(__name__)

# S3 configuration
S3_BUCKET = 'aiops-remediation-scripts'
S3_CLIENT = boto3.client('s3')

# Define the relative path (this will be the folder structure in S3)
directory = 'lib_script'

def save_script_to_s3(filename, extension, content):
    s3_path = f"{directory}/{extension}.{filename}"
    try:
        # Replace Windows-style line endings with Unix-style
        content = content.replace('\r\n', '\n').replace('\r', '\n')

        # Save content to the S3 bucket without setting ACL
        S3_CLIENT.put_object(
            Bucket=S3_BUCKET,
            Key=s3_path,
            Body=content,
            # Removed ACL parameter
        )
        logger.info(f"File {filename}.{extension} saved successfully to S3 at {s3_path}")
        return f"s3://{S3_BUCKET}/{s3_path}"  # Return full S3 path
    except NoCredentialsError:
        logger.error("Credentials not available for AWS S3")
        return None
    except Exception as e:
        logger.error(f"Error saving file {filename}.{extension} to S3: {e}")
        return None


def combine_json_files_s3(file_paths):
    combined_data = ""
    for s3_path in file_paths:
        try:
            # Extract the bucket and key from the S3 path
            if s3_path.startswith("s3://"):
                bucket_name = s3_path.split("/")[2]
                key = "/".join(s3_path.split("/")[3:])
            else:
                logger.error(f"Invalid S3 path: {s3_path}")
                continue

            # Log the bucket and key being accessed
            logger.info(f"Accessing S3 at bucket: {bucket_name}, key: {key}")

            # Download and read file from S3
            s3_object = S3_CLIENT.get_object(Bucket=bucket_name, Key=key)
            data = s3_object['Body'].read().decode('utf-8')
            combined_data += data + "\n"  # Add a newline between scripts
        except S3_CLIENT.exceptions.NoSuchKey:
            logger.error(f"Error: The specified key does not exist: {s3_path}")
            continue  # Skip to the next file path
        except Exception as e:
            logger.error(f"Error reading file from S3 at {s3_path}: {e}")
            return None
    
    return combined_data.strip() if combined_data else None  # Strip to remove any trailing newline
