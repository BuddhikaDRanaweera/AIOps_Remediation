# import json
# import boto3
# import time
# import logging
# from datetime import datetime
 
# print('Loading function')
 
# # Set up logging
# logger = logging.getLogger()
# logger.setLevel(logging.INFO)
 
# ec2 = boto3.client('ec2', region_name='ap-southeast-1')
# ssm = boto3.client('ssm', region_name='ap-southeast-1')

 
# def get_instance_id_from_dns(private_dns):
#     response = ec2.describe_instances(
#         Filters=[
#             {
#                 'Name': 'private-dns-name',
#                 'Values': [private_dns]
#             }
#         ]
#     )
 
#     if response['Reservations']:
#         instance_id = response['Reservations'][0]['Instances'][0]['InstanceId']
#         print(instance_id,"instance")
#         return instance_id
#     else:
#         raise Exception(f"No instance found with private DNS: {private_dns}")
 
# def convert_datetime(obj):
#     if isinstance(obj, datetime):
#         return obj.isoformat()  # Convert to ISO 8601 format
#     raise TypeError("Type not serializable")

# def is_instance_running(instance_id):
#     response = ec2.describe_instances(InstanceIds=[instance_id])
#     state = response['Reservations'][0]['Instances'][0]['State']['Name']
#     print(state,"state")
#     return state == 'running'

# def lambda_handler(script, parametersValues, pvt_dns):
#     # Log the start time
#     start_time = datetime.now()
#     logger.info(f'Lambda function started at {start_time.isoformat()}')
 
#     try:
#         instance_id = get_instance_id_from_dns(pvt_dns)
 
#         is_instance_running(instance_id)
        
#         response = ssm.send_command(
#             InstanceIds=[instance_id],
#             DocumentName="AWS-RunShellScript",
#             Parameters={'commands': [script]}
#         )
#         print(response,"response")
#         command_id = response['Command']['CommandId']
#         logger.info(f'Sent command to start httpd on instance: {instance_id}, Command ID: {command_id}')
 
#         # Wait for the command to execute
#         time.sleep(5)  # Adjust this time as needed
#         while True:
#             invocation_response = ssm.get_command_invocation(
#                 CommandId=command_id,
#                 InstanceId=instance_id
#             )
            
#             # Check the status of the command invocation
#             status = invocation_response['Status']
            
#             if status in ['Success', 'Failed', 'Cancelled', 'TimedOut']:
#                 break
            
#             time.sleep(2)  # Wait before checking the status again
        
#         # Retrieve the output of the command
#         output = invocation_response['StandardOutputContent'].strip()
#         print(f"Command output: {output}")
#         # Check command invocation
#         command_invocation = ssm.list_command_invocations(CommandId=command_id, Details=True)
 
#         # Convert any datetime objects to strings
#         command_invocation_serializable = json.loads(json.dumps(command_invocation, default=convert_datetime))
#         logger.info(json.dumps(command_invocation_serializable, indent=4))
 
#         return output
#     except Exception as e:
#         logger.error(f'Error sending command: {str(e)}')
#         return False

import json
import boto3
import time
import logging
from datetime import datetime

print('Loading function')

# Set up logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

ec2 = boto3.client('ec2', region_name='ap-southeast-1')
ssm = boto3.client('ssm', region_name='ap-southeast-1')

def get_instance_id_from_dns(private_dns):
    response = ec2.describe_instances(
        Filters=[
            {
                'Name': 'private-dns-name',
                'Values': [private_dns]
            }
        ]
    )
    if response['Reservations']:
        instance_id = response['Reservations'][0]['Instances'][0]['InstanceId']
        logger.info(f'Found instance ID: {instance_id}')
        return instance_id
    else:
        raise Exception(f"No instance found with private DNS: {private_dns}")

def is_instance_running(instance_id):
    response = ec2.describe_instances(InstanceIds=[instance_id])
    state = response['Reservations'][0]['Instances'][0]['State']['Name']
    logger.info(f'Instance state: {state}')
    return state == 'running'

def execute_command(instance_id, command):
    response = ssm.send_command(
        InstanceIds=[instance_id],
        DocumentName="AWS-RunShellScript",
        Parameters={'commands': [command]}
    )
    
    command_id = response['Command']['CommandId']
    logger.info(f'Sent command to instance: {instance_id}, Command ID: {command_id}')
    
    # Poll for command completion
    attempts = 0
    while attempts < 10:  # Limit the number of attempts
        time.sleep(2)  # Wait before checking the command status
        try:
            invocation_response = ssm.get_command_invocation(
                CommandId=command_id,
                InstanceId=instance_id
            )
            status = invocation_response['Status']
            if status in ['Success', 'Failed', 'Cancelled', 'TimedOut']:
                break
        except ssm.exceptions.InvocationDoesNotExist:
            logger.warning('Command invocation does not exist yet, retrying...')
        
        attempts += 1
    
    # Retrieve command output
    output = invocation_response.get('StandardOutputContent', '').strip()
    error_output = invocation_response.get('StandardErrorContent', '').strip()
    logger.info(f"Command output: {output}")
    logger.info(f"Command error output: {error_output}")
    
    return output, error_output, status

def lambda_handler(script_path, parameters_values, pvt_dns):
    print(parameters_values,"parameters")
    start_time = datetime.now()
    logger.info(f'Lambda function started at {start_time.isoformat()}')

    try:
        instance_id = get_instance_id_from_dns(pvt_dns)
        if not is_instance_running(instance_id):
            raise Exception(f'Instance {instance_id} is not running')
        
        script_name = script_path.split('/')[-1]
        print(script_name, "name")
        print(script_path, "path")
        
        # Ensure the target directory exists
        create_directory_command = 'mkdir -p /home/ubuntu/scripts'
        output, error_output, status = execute_command(instance_id, create_directory_command)
        if status != 'Success':
            logger.error(f'Failed to create directory: {error_output}')
            return False
        
        # Download script to the new path
        download_command = f'aws s3 cp {script_path} /home/ubuntu/scripts/{script_name}'
        output, error_output, status = execute_command(instance_id, download_command)
        if status != 'Success':
            logger.error(f'Failed to download script: {error_output}')
            return False

        # Give execute permission
        permission_command = f'chmod +x /home/ubuntu/scripts/{script_name}'
        output, error_output, status = execute_command(instance_id, permission_command)
        if status != 'Success':
            logger.error(f'Failed to change permissions: {error_output}')
            return False

        # Execute the script
        execute_command_str = f'/home/ubuntu/scripts/{script_name}'
        output, error_output, status = execute_command(instance_id, execute_command_str)
        
        if status == 'Success':
            return output
        else:
            logger.error(f'Script execution failed: {error_output}')
            return False
            
    except Exception as e:
        logger.error(f'Error executing script: {str(e)}')
        return False
