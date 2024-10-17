from datetime import datetime, timezone
import re
import subprocess
from flask import Blueprint, jsonify, request
from pytz import timezone as pytz_timezone, utc
import logging
from app.services.problem_service import create_problem_auto, find_problem_id
from app.services.remediation_service import get_script_path_by_prob_id
from app.services.validation_service import (
    get_prevalidation_script_path_by_prob_id,
    get_postvalidation_script_path_by_prob_id
)
from app.services.audit_service import (
    create_audit, quick_check_audit_status, update_audit_status_closed, update_audit_status_to_failed,
    update_audit_pre_validation_status, update_audit_remediation_status,
    update_audit_post_validation_status
)
from app.util.file_store import combine_json_files_s3
from app.util.remote_lambda import lambda_handler
import time

# Create a logger
logger = logging.getLogger(__name__)

webhook_bp = Blueprint('webhook_bp', __name__)

@webhook_bp.route('/webhook', methods=['POST'])
def webhook():
    # Get the JSON data from the request
    data = request.json
    ist_timezone = pytz_timezone('Asia/Kolkata')
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
    pvt_dns = data.get("DNS", "ip-172-31-28-116.ap-southeast-1.compute.internal")

    print(state,"state")
    if state == "OPEN":
        quickCheckResult=quick_check_audit_status(pid, serviceName, problemTitle)
        if quickCheckResult:
            print(quickCheckResult,"quick_check_audit_status")
            return "Already Recorded", 204
        else:
            print(quickCheckResult,"quick_check_audit_status failed")
            if "ImpactedEntityNames" in data and "ProblemID" in data:
                logger.info("Received webhook notification. Service to restart: %s", serviceName)
                result = find_problem_id(problemTitle, serviceName, pvt_dns)
                executedProblemId = None

                if result is None:
                    create_problem_auto(problemTitle, subProblemTitle, serviceName, pvt_dns, "NOT_RESOLVED")
                    create_audit(
                        problemTitle, subProblemTitle, impactedEntity, problemImpact,
                        problemSeverity, problemURL, problemDetectedAt, serviceName, pid,
                        executedProblemId, displayId, actionType="MANUAL", status="OPEN",
                        comments="The new problem was identified", 
                        problemEndAt=None, scriptExecutionStartAt=None
                    )
                    return "Problem Recorded Sucessfully", 201
                
                prob_id = result.get('id', None)
                executedProblemId = prob_id
                private_dns = result.get('pvt_dns', None)

                remediation = get_script_path_by_prob_id(prob_id)
                remediationParametersValues = remediation.parameters
                remediation_script_path = remediation.scriptPath

                if remediation_script_path:
                    # Create audit records

                    # Pre-validation
                    preValidation = get_prevalidation_script_path_by_prob_id(prob_id)
                    if preValidation:
                        create_audit(
                            problemTitle, subProblemTitle, impactedEntity, problemImpact,
                            problemSeverity, problemURL, problemDetectedAt, serviceName, pid,
                            executedProblemId, displayId, actionType="AUTOMATIC", status="IN_PROGRESS",
                            comments="Problem Detected, Rule Picked",
                            problemEndAt=None, scriptExecutionStartAt=None
                        )
                        print("Problem Detected, Rule Picked")
                        preValidationStartedAt = datetime.now(ist_timezone)
                        preValidationParametersValues = remediation.parameters
                        preValidationResult = lambda_handler(preValidation.preValidationScriptPath, preValidationParametersValues, private_dns)
                        
                        if preValidationResult.strip() == "true":
                            print("Successfully Remediated and pre validation success")
                            update_audit_pre_validation_status(pid, serviceName, problemTitle, preValidationStatus=True, preValidationStartedAt=preValidationStartedAt, comments="Pre validation success")
                            scriptExecutionStartAt = datetime.now(ist_timezone)

                            if lambda_handler(remediation_script_path, remediationParametersValues, private_dns):
                                print("Successfully Remediated")
                                update_audit_remediation_status(pid, serviceName, problemTitle, scriptExecutionStartAt, comments="Successfully Remediated", problemEndAt=datetime.now(ist_timezone), status="IN_PROGRESS")
                                
                                # Post-validation with retries
                                postValidation = get_postvalidation_script_path_by_prob_id(prob_id)
                                if postValidation:
                                    postValidationScriptStartedAt = datetime.now(ist_timezone)
                                    postValidationParametersValues = postValidation.parameters

                                    max_retries = 20
                                    for attempt in range(max_retries):
                                        postValidationResult = lambda_handler(postValidation.postValidationScriptPath, postValidationParametersValues, private_dns)
                                        print(postValidationResult,"result")
                                        print(postValidationResult.strip() == "true","result?>")
                                        print("=======================================================")
                                        if postValidationResult.strip() == "true":
                                            print("Successfully Remediated and post validation success")
                                            update_audit_post_validation_status(pid, serviceName, problemTitle, postValidationStatus=True, postValidationStartedAt=postValidationScriptStartedAt, comments="Successfully Remediated and post validation success")
                                            return 'Remediation Script execution success', 200
                                        else:
                                            print(f"Post-validation failed. Attempt {attempt + 1} of {max_retries}. Retrying in 2 minutes...")
                                            update_audit_post_validation_status(pid, serviceName, problemTitle, postValidationStatus=False, postValidationStartedAt=datetime.now(ist_timezone), comments="Successfully Remediated and post validation failed")
                                            time.sleep(15)  # Sleep for 2 minutes
                                    return 'Max retries reached, validation failed', 400
                                else:
                                    print("Successfully Remediated and post validation script not found")
                                    update_audit_post_validation_status(pid, serviceName, problemTitle, postValidationStatus=False, postValidationStartedAt=datetime.now(ist_timezone), comments="Successfully Remediated and post validation script not found")
                                    return 'No validation script found to execute', 200
                            else:
                                print("Script execution unsuccessful!")
                                update_audit_remediation_status(pid, serviceName, problemTitle, scriptExecutionStartAt, comments="Script execution unsuccessful!", problemEndAt=None, status="IN_PROGRESS")
                                return 'Script execution unsuccessful!', 400
                        else:
                            print("Pre validation failed")
                            update_audit_pre_validation_status(pid, serviceName, problemTitle, preValidationStatus=False, preValidationStartedAt=datetime.now(ist_timezone), comments="Pre validation failed")
                            return 'Not a valid alert', 400
                    else:
                        return 'Invalid alert', 400
                        # # If no validations detected, directly execute remediation script
                        # if lambda_handler(remediation_script_path, remediationParametersValues, private_dns):
                        #     update_audit_remediation_status(pid, serviceName, problemTitle, scriptExecutionStartAt, comments="Successfully Remediated", problemEndAt=datetime.now(ist_timezone), status="IN_PROGRESS")
                        # else:
                        #     update_audit_remediation_status(pid, serviceName, problemTitle, scriptExecutionStartAt, comments="Script execution unsuccessful!", problemEndAt=None, status="IN_PROGRESS")
                        #     return 'Script execution unsuccessful!', 400
                else:
                    print("NO script found 2024")
                    logger.warning("No script found in DB")
                    return 'No script specified in DB', 400
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

@webhook_bp.route('/test', methods=['POST'])
def appDynamics():
    # Get the JSON data from the request
    data = request.json
    print(data)
    ist_timezone = pytz_timezone('Asia/Kolkata')
    # Extract relevant data from the payload
    pid = data.get("PID")
    displayId = data.get("ProblemID")
    problemTitle = data.get("ProblemTitle")
    subProblemTitle = data.get("SubProblemTitle", "N/A")
    impactedEntity = data.get("ImpactedEntity", "Unknown")
    problemImpact = data.get("ProblemImpact", "Unknown")
    problemSeverity = data.get("ProblemSeverity", "Unknown")
    problemURL = data.get("ProblemURL", "No_URL")
    # timestamp = data["ProblemDetailsJSON"]["startTime"] / 1000
    timestamp = datetime.now(ist_timezone)
    datetime_utc = timestamp
    problemDetectedAt = datetime_utc
    serviceName = data.get("ImpactedEntityNames","apache tomcat")
    state = data.get("State", "unknown")
    pvt_dns = data.get("DNS", "ip-172-31-28-116.ap-southeast-1.compute.internal")

    print(state,"state")
    if state == "OPEN":
        create_audit(
            problemTitle, subProblemTitle, impactedEntity, problemImpact,
            problemSeverity, problemURL, problemDetectedAt, serviceName, 10000,
            10000, displayId, actionType="AUTOMATIC", status="IN_PROGRESS",
            comments="The new problem was identified", 
            problemEndAt=None, scriptExecutionStartAt=None
        )
        subprocess.run(['ssh', 'ec2-user@3.88.17.233', 'sudo', 'sh', '/opt/apache-tomcat-10.1.31/bin/startup.sh'], check=True)
        return "Problem Recorded Sucessfully", 201
    elif state == "RESOLVED":
        logger.info("Dynatrace Resolved notification received. Service up and running")
        update_audit_status_closed(10000, serviceName, problemTitle, "RESOLVED")
        return 'Dynatrace Resolved Confirmation', 200

    else:
        logger.info("Dynatrace unknown notification received.")
        update_audit_status_to_failed(pid)
        return 'Dynatrace message', 200


