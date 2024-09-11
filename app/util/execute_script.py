import logging
import subprocess
import time
def execute_script_ssh(script_path, parametersValues):
    print(">>>>>>>>>>>>>>>>>>>>>>>")
    time.sleep(10)  # Add a 10-second delay here
    print("Parameter values >>>>>", parametersValues)
    try:
        if parametersValues:
            # Join the parameters into a single string
            param_values = ' '.join(str(param) for param in parametersValues)
            bash_command = f"sudo -u ubuntu bash {script_path} {param_values}"
            print(bash_command, "Bash >>>>>>>>>>>>>>>>>>>>")
        else:
            bash_command = f"sudo -u ubuntu bash {script_path}"
            print("test2>>>>>>",bash_command)

        # Execute the bash script using subprocess
        subprocess.run(bash_command, shell=True, check=True)

        print("Bash script executed successfully.")
        logging.info("Bash script executed successfully.")
        return True

    except ValueError as ve:
        print("ValueError:", str(ve))
        logging.error("ValueError: %s", str(ve))
        return False

    except subprocess.CalledProcessError as e:
        error_message = e.stderr if e.stderr else str(e)
        print("Error executing bash script:", error_message)
        logging.error("Error happened while executing the script: %s", error_message)
        return False

    except Exception as e:
        print("Unexpected error:", str(e))
        logging.error("Unexpected error: %s", str(e))
        return False
    
def service_state_check_exe(script_path, serviceName):
    try:
        bash_command = f"sudo -u ubuntu bash {script_path} {serviceName}"
        # Execute the bash script using subprocess
        subprocess.run(bash_command, shell=True, check=True)
    
        print("Bash script executed successfully.")
        logging.info("Bash script executed successfully.")
        return True
    except subprocess.CalledProcessError as e:
        error_message = e.stderr if e.stderr else str(e)
        print("Error executing bash script:", error_message)
        logging.error("Error happened while executing the script: %s", error_message)
        return False

def execute_script_validation_ssh(script_path):
    """
    Executes a bash script on the local machine and returns the result.

    :param script_path: The path to the script to execute.
    :return: The output of the script execution, or an error message.
    """
    print(">>>>>>>>>>>>>>>>>>>>>>>")
    print("Script path >>>>>", script_path)
    try:
        # Construct the bash command to execute the script
        bash_command = f"sudo -u ubuntu bash {script_path}"
        print("Bash command >>>>>>>>>>>>>>>>>>>>", bash_command)

        # Execute the bash script using subprocess
        result = subprocess.run(bash_command, shell=True, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)

        # Print and return the output
        output = result.stdout
        print("Bash script executed successfully.")
        logging.info("Bash script executed successfully.")
        return output

    except ValueError as ve:
        print("ValueError:", str(ve))
        logging.error("ValueError: %s", str(ve))
        return f"ValueError: {str(ve)}"

    except subprocess.CalledProcessError as e:
        error_message = e.stderr if e.stderr else str(e)
        print("Error executing bash script:", error_message)
        logging.error("Error happened while executing the script: %s", error_message)
        return f"Error executing script: {error_message}"

    except Exception as e:
        print("Unexpected error:", str(e))
        logging.error("Unexpected error: %s", str(e))
        return f"Unexpected error: {str(e)}"
