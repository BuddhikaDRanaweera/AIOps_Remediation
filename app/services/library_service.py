from collections import defaultdict
from app.models.library_model import Library
from app import db
from sqlalchemy.exc import SQLAlchemyError
import logging

logger = logging.getLogger(__name__)


def get_all_libraries_by_category():
    try:
        libraries = Library.query.all()
        grouped_libraries = defaultdict(list)
        for library in libraries:
            grouped_libraries[library.category].append(library.to_dict())
        return grouped_libraries
    except SQLAlchemyError as e:
        logger.error(f"Error fetching libraries: {str(e)}")
        return {"error": str(e)}
    
def get_all_libraries():
    try:
        libraries = Library.query.filter_by(category="Troubleshoot")
        libraries_dict = [library.to_dict() for library in libraries]
        return libraries_dict
    except SQLAlchemyError as e:
        logger.error(f"Error fetching libraries: {str(e)}")
        return {"error": str(e)}

def get_library_data(scriptPath):
    try:
        libraries = Library.query.filter_by(scriptPath=scriptPath)
        libraries_dict = [library.to_dict() for library in libraries]
        return libraries_dict
    except SQLAlchemyError as e:
        logger.error(f"Error fetching libraries: {str(e)}")
        return {"error": str(e)}

def saveScriptToLib(file_name, description, parameters,parameterValues, scriptPath, category):
    try:
        new_script = Library(
            scriptName=file_name,
            description=description,
            parameters=parameters,
            scriptPath=scriptPath,
            parameterValues=parameterValues,
            category=category
        )
        db.session.add(new_script)
        db.session.commit()
        logger.info("new_script created successfully")
        return new_script
    except SQLAlchemyError as e:
        db.session.rollback()
        logger.error(f"Error creating problem: {str(e)}")
        return {"error": str(e)}