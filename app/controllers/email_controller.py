# app/controllers/problem_controller.py
from flask import Blueprint, jsonify, request
from app.util.send_email import send_email
import logging

email_bp = Blueprint('email_bp', __name__)

# Set up logging
logger = logging.getLogger(__name__)

@email_bp.route('/v1/email', methods=['POST'])
def notify_email():
    try:
        data = request.json
        # Extract relevant data from the payload
        to = data.get("to")
        subject = data.get("subject")
        body = data.get("body")       
        print(to)
        send_email(to, subject, body)
        logger.info("Email sent")
        return jsonify("Email sent"), 200
    except Exception as e:
        logger.error(f"Error sending email: {str(e)}")
        return jsonify({"error": "Error sending email"}), 500
    