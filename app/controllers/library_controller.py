# app/controllers/problem_controller.py
from flask import Blueprint, jsonify, request
from app.services.library_service import get_all_libraries_by_category, get_all_libraries
from app.util.getSecrets import get_secret
import logging

libraries_bp = Blueprint('libraries_bp', __name__)

# Set up logging
logger = logging.getLogger(__name__)

@libraries_bp.route('/v2/libraries', methods=['GET'])
def get_libraries():
    try:
        libraries = get_all_libraries()
        logger.info("Fetched all libraries successfully")
        return jsonify(libraries), 200
    except Exception as e:
        logger.error(f"Error fetching libraries: {str(e)}")
        return jsonify({"error": "Error fetching libraries"}), 500
    
@libraries_bp.route('/v2/libraries_by_category', methods=['GET'])
def get_libraries_by_category():
    try:
        libraries = get_all_libraries_by_category()
        logger.info("Fetched all libraries successfully")
        return jsonify(libraries), 200
    except Exception as e:
        logger.error(f"Error fetching libraries: {str(e)}")
        return jsonify({"error": "Error fetching libraries"}), 500

