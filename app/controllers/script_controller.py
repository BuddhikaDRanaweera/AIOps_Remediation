import os
from flask import Blueprint, jsonify, request
import logging
from app.services.problem_service import update_status_by_id
from app.services.library_service import get_library_data, saveScriptToLib
from app.services.audit_service import update_in_progress_records_in_Audit_manual_exe, get_audit_record_by_id
from app.services.remediation_service import create_remediation
from app.util.file_store import save_script_to_directory
from app.util.execute_script import execute_script_ssh
from app.util.file_store import combine_json_files

# Create a logger
logger = logging.getLogger(__name__)
 
script_bp = Blueprint('script_bp', __name__)
 


@script_bp.route('/v2/script', methods=['POST'])
def save_script():
    print(request.json)
    content = request.json.get('content', '')
    fileName = request.json.get('fileName', '')
    extension = request.json.get('extension', '')
    recommendation_text = request.json.get('recommendation')
    service_name = request.json.get('serviceName')
    problem_id = request.json.get('problemId')
    problem_title = request.json.get('problemTitle')
    if content and fileName and extension:
        # Save file
        file_path = save_script_to_directory(fileName, extension, content)
        if file_path:
            if not all([recommendation_text, problem_id, service_name, problem_title]):
                logger.error("Missing required fields in request data")
                return jsonify({"error": "Missing required fields"}), 400
            if(execute_script_ssh(file_path,service_name)):
                result = create_remediation(recommendation_text, file_path, problem_id)
                update_status_by_id(problem_id)
                update_in_progress_records_in_Audit_manual_exe(service_name, problem_id, problem_title)
                return "Remediation Saved Successfully", 201
            else:
                return "Cannot run script", 400
        else:
            return "Cannot save script", 400
    return jsonify({"message": "No content to save or missing file information"}), 400

@script_bp.route('/v2/file', methods=['POST'])
def save_file():
    if 'file' not in request.files:
        return jsonify({"message": "No file part in the request"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"message": "No selected file"}), 400
    if file:
        # Secure the filename
        # file_path = os.path.join(SAVE_DIR, file.filename)
        # save_script_to_directory(file.filename,)
        # file.save(file_path)
        return jsonify({"message": "File saved successfully"}), 200
    return jsonify({"message": "File not saved"}), 400



@script_bp.route('/v2/build_script', methods=['POST'])
def combine_solutions():
    try:
        # Parse the incoming JSON data
        data = request.json
        print(data)
        file_paths = data.get('filePaths', [])
        if not file_paths:
            return jsonify({"status": "error", "message": "No file paths provided"}), 400

        # Prepend SAVE_DIR to each file path if they are relative paths
        # full_file_paths = [os.path.join(SAVE_DIR, file_path) if not os.path.isabs(file_path) else file_path for file_path in file_paths]

        # Combine the data from the provided file paths
        combined_data = combine_json_files(file_paths)
        print(combined_data)
        if combined_data is not None:
            return combined_data, 203
        else:
            return jsonify({"status": "error", "message": "Failed to combine data"}), 500
    except Exception as e:
        logger.error(f"Error processing request: {e}")
        return jsonify({"status": "error", "message": "Error processing request"}), 500

# @script_bp.route('/v2/get_user_combined_script', methods=['POST'])
# def combine_solutions():
#     try:
#         # Parse the incoming JSON data
#         data = request.json
#         print(data)
#         file_paths = data.get('filePaths', [])
#         if not file_paths:
#             return jsonify({"status": "error", "message": "No file paths provided"}), 400

#         # Prepend SAVE_DIR to each file path if they are relative paths
#         # full_file_paths = [os.path.join(SAVE_DIR, file_path) if not os.path.isabs(file_path) else file_path for file_path in file_paths]

#         # Combine the data from the provided file paths
#         combined_data = combine_json_files(file_paths)
#         other_data=get_library_data(file_paths)
#         print(combined_data, other_data)
#         if combined_data is not None:
#             return {combined_data, other_data}, 203
#         else:
#             return jsonify({"status": "error", "message": "Failed to combine data"}), 500
#     except Exception as e:
#         logger.error(f"Error processing request: {e}")
#         return jsonify({"status": "error", "message": "Error processing request"}), 500

@script_bp.route('/v2/save-script', methods=['POST'])
def save_solution():
    try:
        # Parse the incoming JSON data
        data = request.json
        file_name = data.get('fileName', 'default_solution')
        description = data.get('description',"No")
        script = data.get('content')
        parameter = data.get('parameter',None)
        parameterValues = data.get('parameterValues',None)
        print(script)
        # Save the data to a JSON file
        file_path = save_script_to_directory("sh", file_name, script)

        if file_path:
            saveScriptToLib(file_name,description,parameter,parameterValues,scriptPath=file_path,category="User management")
            return "Script Saved Successfully", 201
        else:
            return jsonify({"status": "error", "message": "Failed to save data"}), 500
    except Exception as e:
        logger.error(f"Error processing request: {e}")
        return jsonify({"status": "error", "message": "Error processing request"}), 500

@script_bp.route('/v2/save-script-draft', methods=['POST'])
def save_solution_as_draft():
    try:
        # Parse the incoming JSON data
        data = request.json
        file_name = data.get('fileName', 'default_solution')
        description = data.get('description',"No")
        script = data.get('content')
        parameter = data.get('parameter',None)
        parameterValues = data.get('parameterValues',None)
        print(parameterValues)
        # Save the data to a JSON file
        file_path = save_script_to_directory("sh", file_name, script)

        if file_path:
            saveScriptToLib(file_name,description,parameter,parameterValues,scriptPath=file_path,category="TMP")
            return "Script Saved Successfully", 201
        else:
            return jsonify({"status": "error", "message": "Failed to save data"}), 500
    except Exception as e:
        logger.error(f"Error processing request: {e}")
        return jsonify({"status": "error", "message": "Error processing request"}), 500


@script_bp.route('/v2/save-as-rule-direct', methods=['POST'])
def save_solution_as_rule_direct():
    try:
        # Parse the incoming JSON data
        data = request.json
        file_name = data.get('fileName', 'default_solution')
        description = data.get('description',"No")
        script = data.get('content')
        parameter = data.get('parameter',None)
        parameterValues = data.get('parameterValues',None)
        recommendation_text = data.get('recommendation')
        service_name = data.get('serviceName')
        problem_id = data.get('problemId')
        problem_title = data.get('problemTitle')
        print(script)
        # Save the data to a JSON file
        file_path = save_script_to_directory("sh", file_name, script)

        if file_path:
            saveScriptToLib(file_name,description,parameter,parameterValues,scriptPath=file_path,category="")
            if(execute_script_ssh(file_path, parameterValues)):
                create_remediation(recommendation_text, file_path, problem_id, parameterValues)
                update_status_by_id(problem_id)
                update_in_progress_records_in_Audit_manual_exe(service_name, problem_id, problem_title)
                return "Remediation & Script Saved Successfully", 201
            else:
                return "Cannot run script", 403
        else:
            return jsonify({"status": "error", "message": "Failed to save data"}), 500
    except Exception as e:
        logger.error(f"Error processing request: {e}")
        return jsonify({"status": "error", "message": "Error processing request"}), 500