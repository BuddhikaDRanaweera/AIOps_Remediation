from flask import Blueprint, request, jsonify
import datetime
from app.services.validation_service import create_validation, get_problem_with_validation
from app.services.problem_service import update_status_by_id
from app.services.audit_service import update_to_inprogress_manual_exe, get_audit_record_by_id
from app.util.execute_script import execute_script_ssh
from pytz import timezone
import logging

# Set up logging
logger = logging.getLogger(__name__)

# Create a Blueprint for the validation routes
validation_bp = Blueprint('validation', __name__)

@validation_bp.route('/insert_validation', methods=['POST'])
def create_validation_controller():
    data = request.json
    comments = data.get('comments')
    pre_validation_script_path = data.get('preValidationScriptPath')
    post_validation_script_path = data.get('postValidationScriptPath')
    problem_id = data.get('problemId')
    parameters = data.get('parameters', None)
    parameters_values = data.get('parametersValue', None)
    service_name = data.get('serviceName')
    problem_title = data.get('problemTitle')
    ist_timezone = timezone('Asia/Kolkata')
    
    logger.debug(f"Received data: {data}")
    if not all([comments, pre_validation_script_path, post_validation_script_path, problem_id, service_name, problem_title]):
        logger.error("Missing required fields in request data")
        return jsonify({"error": "Missing required fields"}), 400
    
    script_execution_start_at = datetime.datetime.now(ist_timezone)
    
    # Execute the pre-validation script
    if execute_script_ssh(pre_validation_script_path, parameters_values):
        create_validation(comments, pre_validation_script_path, post_validation_script_path, problem_id, parameters_values)
        update_status_by_id(problem_id)
        update_to_inprogress_manual_exe(service_name, problem_id, problem_title, script_execution_start_at)
        return "Validation Saved Successfully", 201
    else:
        return "Cannot run script", 403

@validation_bp.route('/problem_validations/<int:problem_id>/<string:pid>', methods=['GET'])
def get_problem_with_validation_route(problem_id, pid):
    try:
        problem_with_validation = get_problem_with_validation(problem_id)
        if not problem_with_validation:
            return jsonify({"error": "Problem not found"}), 404
        audit = get_audit_record_by_id(pid)
        problem, validation = problem_with_validation
        result = [
            {
                "problemId": problem.id,
                "problemTitle": problem.problemTitle,
                "subProblemTitle": problem.subProblemTitle,
                "serviceName": problem.serviceName,
                "status": problem.status,
                "validationId": validation.validationId if validation else None,
                "comments": validation.comments if validation else None,
                "preValidationScriptPath": validation.preValidationScriptPath if validation else None,
                "postValidationScriptPath": validation.postValidationScriptPath if validation else None,
                "parameters": validation.parameters if validation else None,
                "createdAt": validation.createdAt if validation else None,
                "lastUpdateAt": validation.lastUpdateAt if validation else None,
                "scriptExecutionStartAt": audit.scriptExecutionStartAt if audit else None,
                "actionType": audit.actionType if audit else None,
                "problemEndAt": audit.problemEndAt if audit else None
            }
        ]

        logger.info(f"Fetched problem with validation for problemId {problem_id} successfully")
        return jsonify(result), 200
    except Exception as e:
        logger.error(f"Error fetching problem with validation for problemId {problem_id}: {str(e)}")
        return jsonify({"error": "Error fetching problem with validation"}), 500
