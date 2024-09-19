from app import create_app
from flask_cors import CORS
from mangum import Mangum

# Create the Flask app
app = create_app()

# Enable CORS
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type: application/json'

# Create the Lambda handler
lambda_handler = Mangum(app)

if __name__ == '__main__':
    # Run the app locally
    app.run(host='0.0.0.0', port=5000, debug=True)
