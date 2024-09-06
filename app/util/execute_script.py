import logging
import subprocess
 
def execute_script_ssh(script_path, parametersValues):
    print(">>>>>>>>>>>>>>>>>>>>>>>")
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
