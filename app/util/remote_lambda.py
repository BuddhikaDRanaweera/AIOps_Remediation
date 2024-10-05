import json
import boto3
import time
import logging
from datetime import datetime
 
print('Loading function')
 
# Set up logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)  # You can set the logging level to DEBUG for more verbose output
 
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
        print(instance_id,"instance")
        return instance_id
    else:
        raise Exception(f"No instance found with private DNS: {private_dns}")
 
def convert_datetime(obj):
    if isinstance(obj, datetime):
        return obj.isoformat()  # Convert to ISO 8601 format
    raise TypeError("Type not serializable")

def is_instance_running(instance_id):
    response = ec2.describe_instances(InstanceIds=[instance_id])
    state = response['Reservations'][0]['Instances'][0]['State']['Name']
    print(state,"state")
    return state == 'running'

 
def lambda_handler(script, parametersValues, pvt_dns):
    # Log the start time
    start_time = datetime.now()
    logger.info(f'Lambda function started at {start_time.isoformat()}')
 
    private_dns = 'ip-172-31-36-1.ec2.internal'
    try:
        instance_id = get_instance_id_from_dns(pvt_dns)
 
        # command = "sudo systemctl start httpd"
        command = script
        is_instance_running(instance_id)
        
        response = ssm.send_command(
            InstanceIds=[instance_id],
            DocumentName="AWS-RunShellScript",
            Parameters={'commands': [script]}
        )
 
        command_id = response['Command']['CommandId']
        logger.info(f'Sent command to start httpd on instance: {instance_id}, Command ID: {command_id}')
 
        # Wait for the command to execute
        time.sleep(5)  # Adjust this time as needed
 
        # Check command invocation
        command_invocation = ssm.list_command_invocations(CommandId=command_id, Details=True)
 
        # Convert any datetime objects to strings
        command_invocation_serializable = json.loads(json.dumps(command_invocation, default=convert_datetime))
        logger.info(json.dumps(command_invocation_serializable, indent=4))
 
        return True
    except Exception as e:
        logger.error(f'Error sending command: {str(e)}')
        return False