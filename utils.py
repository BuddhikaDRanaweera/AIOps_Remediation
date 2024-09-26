import subprocess
import logging
import boto3
import os
import time

S3_BUCKET = 'aiops-remediation-scripts'
s3_client = boto3.client('s3')

def download_script_from_s3(script_path):
    """
    Downloads the script from S3 and returns the local file path.
    """
    bucket_name = S3_BUCKET
    local_file_name = os.path.basename(script_path)
    
    try:
        s3_client.download_file(bucket_name, script_path, local_file_name)
        return local_file_name
    except Exception as e:
        logging.error(f"Error downloading script from S3: {str(e)}")
        return None

def execute_script_validation_ssh(script_path, parameters_values):
    """
    Downloads the script from S3, executes it, and deletes the file.
    
    :param script_path: The path to the script in S3.
    :param parameters_values: List of parameters to pass to the script.
    :return: The output of the script execution, or an error message.
    """
    logging.info("Starting script execution...")

    # Download the script from S3
    local_script_path = download_script_from_s3(script_path)
    if not local_script_path:
        return "Failed to download script."

    time.sleep(10)  # Optional delay for demonstration purposes
    logging.info(f"Script path >>>>> {local_script_path}")

    try:
        # Construct the bash command to execute the script
        if parameters_values:
            param_values = ' '.join(str(param) for param in parameters_values)
            bash_command = f"sudo -u ubuntu bash {local_script_path} {param_values}"
        else:
            bash_command = f"sudo -u ubuntu bash {local_script_path}"

        logging.info(f"Bash command >>>>>>>>>>>>>>>>>>>> {bash_command}")

        # Execute the bash script using subprocess
        result = subprocess.run(bash_command, shell=True, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)

        # Print and return the output
        output = result.stdout
        logging.info("Bash script executed successfully.")
        return output

    except subprocess.CalledProcessError as e:
        error_message = e.stderr if e.stderr else str(e)
        logging.error(f"Error executing bash script: {error_message}")
        return f"Error executing script: {error_message}"

    finally:
        # Delete the local script file
        if os.path.exists(local_script_path):
            os.remove(local_script_path)
            logging.info(f"Deleted local script file: {local_script_path}")
