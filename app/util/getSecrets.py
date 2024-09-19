from flask import json
import boto3
from botocore.exceptions import ClientError


def get_secret():
    secret_name = "aiops-db-remote"
    region_name = "ap-southeast-1"

     # Create a Secrets Manager client
    client = boto3.client('secretsmanager', region_name=region_name)

    try:
        # Get the secret value
        response = client.get_secret_value(SecretId=secret_name)
        secret = response['SecretString']
        print(secret)
        return json.loads(secret)
    except ClientError as e:
        return {"error": str(e)}
    # Your code goes here.
