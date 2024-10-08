from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from app.config.config import Config
from app.util.getSecrets import get_secret
import pymysql

# Use pymysql as MySQLdb
pymysql.install_as_MySQLdb()

db = SQLAlchemy()
migrate = Migrate()

def create_app():
    app = Flask(__name__)

    # Get secrets from AWS Secret Manager or other storage
    # data = get_secret()
    # print(data,"hi")
    # # Provide fallback/defaults in case secrets are not fetched properly
    # mysql_user = data.get('username')
    # mysql_password = data.get('password')
    # mysql_host = data.get('host')
    # mysql_port = data.get('port', '3306')
    # mysql_db = data.get('dbname')

    # # Ensure credentials are provided
    # if not mysql_user or not mysql_password:
    #     raise Exception("Missing required database credentials")

    # Load configuration
    # app.config.from_object(Config(mysql_user, mysql_password, mysql_host, mysql_port, mysql_db))
    app.config.from_object(Config('root', 'Demoadmin!0', '3.1.83.205', '3306', 'aiops'))

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)

    # Register Blueprints
    from app.controllers.webhook_controller import webhook_bp
    from app.controllers.problem_controller import problem_bp
    from app.controllers.audit_controller import audit_bp
    from app.controllers.remediation_controller import remediation_bp
    from app.controllers.remediation_problem_controller import remediation_problem_bp
    from app.controllers.script_controller import script_bp
    from app.controllers.library_controller import libraries_bp
    from app.controllers.validation_controller import validation_bp

    # Register Blueprints
    app.register_blueprint(webhook_bp)
    app.register_blueprint(script_bp)
    app.register_blueprint(problem_bp)
    app.register_blueprint(remediation_bp)
    app.register_blueprint(audit_bp)
    app.register_blueprint(libraries_bp)
    app.register_blueprint(remediation_problem_bp)
    app.register_blueprint(validation_bp)

    # Create the database tables
    with app.app_context():
        db.create_all()

    return app
