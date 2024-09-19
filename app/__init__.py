from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from app.config.config import Config
from app.util.getSecrets import get_secret

db = SQLAlchemy()
migrate = Migrate()

def create_app():
    app = Flask(__name__)
    data=get_secret()
    
    print()
    # Database configuration parameters
    mysql_user = data['username']
    mysql_password = data['password']
    mysql_host = data['host']
    mysql_port = data['port']
    mysql_db = data['dbname']
    
    # Load configuration
    app.config.from_object(Config(mysql_user, mysql_password, mysql_host, mysql_port, mysql_db))
    
    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)

    # Register Blueprints here
    from app.controllers.webhook_controller import webhook_bp
    from app.controllers.problem_controller import problem_bp
    from app.controllers.audit_controller import audit_bp
    from app.controllers.remediation_controller import remediation_bp
    from app.controllers.remediation_problem_controller import remediation_problem_bp
    from app.controllers.script_controller import script_bp
    from app.controllers.library_controller import libraries_bp
    
    app.register_blueprint(webhook_bp)
    app.register_blueprint(script_bp)
    app.register_blueprint(problem_bp)
    app.register_blueprint(remediation_bp)
    app.register_blueprint(audit_bp)
    app.register_blueprint(libraries_bp)
    app.register_blueprint(remediation_problem_bp)

    with app.app_context():
        db.create_all()

    return app
