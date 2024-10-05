from flask import Blueprint, request, jsonify
from app.services.validation_service import (
    create_prevalidation,
    create_postvalidation,
    get_postvalidation_by_id,
    get_prevalidation_by_id,
    get_problem_with_prevalidation,
    get_problem_with_postvalidation
)
import logging

# Set up logging
logger = logging.getLogger(__name__)

# Create a Blueprint for the validation routes
validation_bp = Blueprint('validation', __name__)

@validation_bp.route('/prevalidations', methods=['POST'])
def create_prevalidation_controller():
    data = request.json
    comments = data.get('resolutionScript')
    pre_validation_script_path = data.get('resolutionScript')
    problem_id = data.get('problemId')
    parameters = data.get('parametersValue', None)

    logger.debug(f"Received data for creation: {data}")
    
    if not all([comments, pre_validation_script_path, problem_id]):
        logger.error("Missing required fields in request data for creation")
        return jsonify({"error": "Missing required fields"}), 400

    result = create_prevalidation(comments, pre_validation_script_path, problem_id, parameters)

    if isinstance(result, dict) and 'error' in result:
        logger.error(f"Error creating validation: {result['error']}")
        return jsonify(result), 500

    return jsonify({"validationId": result.validationId}), 201

@validation_bp.route('/postvalidations', methods=['POST'])
def create_postvalidation_controller():
    data = request.json
    comments = data.get('resolutionScript')
    post_validation_script_path = data.get('resolutionScript')
    problem_id = data.get('problemId')
    parameters = data.get('parametersValue', None)

    logger.debug(f"Received data for creation: {data}")
    
    if not all([comments, post_validation_script_path, problem_id]):
        logger.error("Missing required fields in request data for creation")
        return jsonify({"error": "Missing required fields"}), 400

    result = create_postvalidation(comments, post_validation_script_path, problem_id, parameters)

    if isinstance(result, dict) and 'error' in result:
        logger.error(f"Error creating validation: {result['error']}")
        return jsonify(result), 500

    return jsonify({"validationId": result.validationId}), 201

@validation_bp.route('/prevalidations/<int:validation_id>', methods=['GET'])
def get_prevalidation_controller(validation_id):
    validation = get_prevalidation_by_id(validation_id)
    
    if isinstance(validation, dict) and 'error' in validation:
        logger.error(f"Error fetching validation with ID {validation_id}: {validation['error']}")
        return jsonify({"error": "Validation not found"}), 404
    
    if not validation:
        logger.error(f"Validation with ID {validation_id} not found")
        return jsonify({"error": "Validation not found"}), 404

    result = {
        "validationId": validation.validationId,
        "comments": validation.comments,
        "preValidationScriptPath": validation.preValidationScriptPath,
        "postValidationScriptPath": validation.postValidationScriptPath,
        "parameters": validation.parameters,
        "createdAt": validation.createdAt.isoformat(),
        "lastUpdateAt": validation.lastUpdateAt.isoformat()
    }

    logger.info(f"Fetched validation with ID: {validation_id}")
    return jsonify(result), 200

@validation_bp.route('/postvalidations/<int:validation_id>', methods=['GET'])
def get_prevalidation_controller(validation_id):
    validation = get_postvalidation_by_id(validation_id)
    
    if isinstance(validation, dict) and 'error' in validation:
        logger.error(f"Error fetching validation with ID {validation_id}: {validation['error']}")
        return jsonify({"error": "Validation not found"}), 404
    
    if not validation:
        logger.error(f"Validation with ID {validation_id} not found")
        return jsonify({"error": "Validation not found"}), 404

    result = {
        "validationId": validation.validationId,
        "comments": validation.comments,
        "preValidationScriptPath": validation.preValidationScriptPath,
        "postValidationScriptPath": validation.postValidationScriptPath,
        "parameters": validation.parameters,
        "createdAt": validation.createdAt.isoformat(),
        "lastUpdateAt": validation.lastUpdateAt.isoformat()
    }

    logger.info(f"Fetched validation with ID: {validation_id}")
    return jsonify(result), 200

@validation_bp.route('/problems/<int:problem_id>/prevalidations', methods=['GET'])
def get_problem_with_prevalidation_route(problem_id):
    problem_with_validation = get_problem_with_prevalidation(problem_id)

    if isinstance(problem_with_validation, dict) and 'error' in problem_with_validation:
        logger.error(f"Error fetching problem with validation for problemId {problem_id}: {problem_with_validation['error']}")
        return jsonify({"error": "Problem not found"}), 404
    
    if not problem_with_validation:
        logger.error(f"Problem with ID {problem_id} not found")
        return jsonify({"error": "Problem not found"}), 404

    problem, validation = problem_with_validation
    result = {
        "problemId": problem.id,
        "problemTitle": problem.problemTitle,
        "validationId": validation.validationId if validation else None,
        "comments": validation.comments if validation else None,
        "preValidationScriptPath": validation.preValidationScriptPath if validation else None,
        "parameters": validation.parameters if validation else None,
    }

    logger.info(f"Fetched problem with validation for problemId {problem_id} successfully")
    return jsonify(result), 200

@validation_bp.route('/problems/<int:problem_id>/postvalidations', methods=['GET'])
def get_problem_with_postvalidation_route(problem_id):
    problem_with_validation = get_problem_with_postvalidation(problem_id)

    if isinstance(problem_with_validation, dict) and 'error' in problem_with_validation:
        logger.error(f"Error fetching problem with validation for problemId {problem_id}: {problem_with_validation['error']}")
        return jsonify({"error": "Problem not found"}), 404
    
    if not problem_with_validation:
        logger.error(f"Problem with ID {problem_id} not found")
        return jsonify({"error": "Problem not found"}), 404

    problem, validation = problem_with_validation
    result = {
        "problemId": problem.id,
        "problemTitle": problem.problemTitle,
        "validationId": validation.validationId if validation else None,
        "comments": validation.comments if validation else None,
        "postValidationScriptPath": validation.postValidationScriptPath if validation else None,
        "parameters": validation.parameters if validation else None,
    }

    logger.info(f"Fetched problem with validation for problemId {problem_id} successfully")
    return jsonify(result), 200



#not use
# @validation_bp.route('/validations/<int:validation_id>', methods=['PUT'])
# def update_validation_controller(validation_id):
#     data = request.json
#     comments = data.get('comments')
#     pre_validation_script_path = data.get('preValidationScriptPath')
#     post_validation_script_path = data.get('postValidationScriptPath')

#     result = update_validation(validation_id, pre_validation_script_path, post_validation_script_path, comments)

#     if isinstance(result, str) and result == "Validation not found":
#         logger.error(f"Validation with ID {validation_id} not found for update")
#         return jsonify({"error": "Validation not found"}), 404
    
#     logger.info(f"Validation with ID {validation_id} updated successfully")
#     return jsonify({"message": "Validation successfully updated"}), 200

# @validation_bp.route('/validations/<int:validation_id>', methods=['DELETE'])
# def delete_validation_controller(validation_id):
#     result = delete_validation(validation_id)

#     if isinstance(result, dict) and 'error' in result:
#         logger.error(f"Error deleting validation with ID {validation_id}: {result['message']}")
#         return jsonify({"error": result['message']}), 500

#     logger.info(f"Validation with ID {validation_id} deleted successfully")
#     return jsonify({"message": f"Validation with ID {validation_id} deleted successfully."}), 204
