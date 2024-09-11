from datetime import datetime, timezone
from flask import Blueprint, jsonify, request
from pytz import timezone,utc
import logging
from app.services.problem_service import create_problem_auto, find_problem_id
from app.services.remediation_service import get_script_path_by_prob_id
from app.services.validation_service import get_validation_script_path_by_prob_id
from app.services.audit_service import create_audit, update_audit_status_closed,update_audit_status_to_failed, update_audit_pre_validation_status, update_audit_remediation_status,update_audit_post_validation_status
from app.util.execute_script import execute_script_ssh, service_state_check_exe, execute_script_validation_ssh
from app.util.dateConvertor import convert_timestamp_to_datetime
 
# Create a logger
logger = logging.getLogger(__name__)
 
webhook_bp = Blueprint('webhook_bp', __name__)
 
@webhook_bp.route('/webhook', methods=['POST'])
def webhook():
    # Get the JSON data from the request
    data = request.json
    ist_timezone = timezone('Asia/Kolkata')

    # Extract relevant data from the payload
    pid = data.get("PID")
    displayId = data.get("ProblemID")
    problemTitle = data.get("ProblemTitle")
    subProblemTitle = data.get("SubProblemTitle", "N/A")
    impactedEntity = data.get("ImpactedEntity", "Unknown")
    problemImpact = data.get("ProblemImpact", "Unknown")
    problemSeverity = data.get("ProblemSeverity", "Unknown")
    problemURL = data.get("ProblemURL", "No_URL")
    timestamp = data["ProblemDetailsJSON"]["startTime"] / 1000
    datetime_utc = datetime.fromtimestamp(timestamp, utc)
    problemDetectedAt = datetime_utc.astimezone(ist_timezone)
    serviceName = data.get("ImpactedEntityNames")
    state = data.get("State", "unknown")

    print(serviceName,pid,"pid")
    if state == "OPEN":
        if "ImpactedEntityNames" in data and "ProblemID" in data:
            logger.info("Received webhook notification. Service to restart: %s", serviceName)
            prob_id = find_problem_id(problemTitle, serviceName)
            executedProblemId = prob_id
            # Check it is existing problem or not
            print("Check it is existing problem or not")
            
            if prob_id:
                remediation = get_script_path_by_prob_id(prob_id)
                parametersValues = remediation.parameters
                script_path = remediation.scriptPath
                # pick resolution script
                print("pick resolution script")
                    
                if script_path:
                    # Create audit records
                    print("Create audit records")
                        
                    create_audit(
                        problemTitle, subProblemTitle, impactedEntity, problemImpact,
                        problemSeverity, problemURL, problemDetectedAt, serviceName, pid,
                        executedProblemId, displayId, actionType="AUTOMATIC", status="OPEN",
                        comments="Problem Detacted, Rule Picked",
                        problemEndAt=None, scriptExecutionStartAt=None
                    )
                    print("pre validation rule picking  and execution")
                    # pre validation rule picking  and execution
                    validation = get_validation_script_path_by_prob_id(prob_id)
                    if(validation):
                        preValidation = execute_script_validation_ssh(validation.preValidationScriptPath)
                        if(preValidation):
                            # update audit record
                            print("update audit record")
                            update_audit_pre_validation_status(pid, serviceName, problemTitle, preValidationStatus=True, preValidationStartedAt=datetime.now(ist_timezone))
                            # Run the script
                            print("Run the script")
                            scriptExecutionStartAt = datetime.now(ist_timezone)
                            # check execution of resoluition is success or not
                            print("check execution of resoluition is success or not")

                            if execute_script_ssh(script_path, parametersValues):
                                # Add execution data to the audit table
                                print("Add execution data to the audit table")
                                update_audit_remediation_status(pid, serviceName, problemTitle, scriptExecutionStartAt, comments="Successfully Remediated", problemEndAt=datetime.now(ist_timezone),status="CLOSED")
                                postValidation = execute_script_validation_ssh(validation.postValidationScriptPath)
                                if(postValidation):
                                    print("post validation success")
                                    update_audit_post_validation_status(pid, serviceName, problemTitle, postValidationStatus=True, postValidationStartedAt=datetime.now(ist_timezone))
                                    return 'Remediation Script execution success', 200
                                else:
                                    print("post validation unsuccess")
                                    update_audit_post_validation_status(pid, serviceName, problemTitle, postValidationStatus=False, postValidationStartedAt=datetime.now(ist_timezone))
                            else:
                                # update audit status
                                print("Script execution unsuccessful!")
                                update_audit_remediation_status(pid, serviceName, problemTitle, scriptExecutionStartAt, comments="Script execution unsuccessful!", problemEndAt=None,status="IN_PROGRESS")
                                return 'Script execution unsuccessful!', 400
                        else:
                            # update audit status
                            print("pre validation failed. Not a valida alert")
                            update_audit_pre_validation_status(pid, serviceName, problemTitle, preValidationStatus=False, preValidationStartedAt=datetime.now(ist_timezone))
                            return 'Not a valida alert', 400
                    else:
                        logger.warning("No script found in DB")
                        return 'No script specified in DB', 400
                else:
                    print("new problem detected")
                    create_problem_auto(problemTitle, subProblemTitle, serviceName, "NOT_RESOLVED")
                    create_audit(
                        problemTitle, subProblemTitle, impactedEntity, problemImpact,
                        problemSeverity, problemURL, problemDetectedAt, serviceName, pid,
                        executedProblemId, displayId, actionType="MANUAL", status="OPEN",
                        comments="The new problem will be identified/was identified and the remediation will take /took place with manual instructions", 
                        problemEndAt=None, scriptExecutionStartAt=None
                    )
                    return "Problem Recorded Sucessfully", 201
            else:
                logger.warning("No service found in webhook message")
                return 'No service specified in webhook payload.', 400

    elif state == "RESOLVED":
        logger.info("Dynatrace Resolved notification received. Service up and running")
        update_audit_status_closed(pid, serviceName, problemTitle, "CLOSED")
        return 'Dynatrace Resolved Confirmation', 200

    else:
        logger.info("Dynatrace unknown notification received.")
        update_audit_status_to_failed(pid)
        return 'Dynatrace message', 200

