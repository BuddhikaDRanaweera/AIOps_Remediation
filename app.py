from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
import logging
from utils import execute_script_validation_ssh

app = Flask(__name__)

# Enable CORS for all routes
CORS(app)

# Set up logging
logging.basicConfig(level=logging.INFO)

@app.route('/execute-script', methods=['POST'])
def execute_script():
    data = request.json
    script_path = data.get('scriptPath')
    parameters_values = data.get('parametersValues', None)

    if not script_path:
        logging.error("Missing script path in request data.")
        return jsonify({"error": "Missing script path"}), 400

    output = execute_script_validation_ssh(script_path, parameters_values)
    return jsonify({"output": output}), 200

if __name__ == '__main__':
    app.run(debug=True)
