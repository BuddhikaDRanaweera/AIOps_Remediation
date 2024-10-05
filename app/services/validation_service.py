from app import db
from app.models.prevalidation_model import PreValidation
from app.models.postvalidation_model import PostValidation
from sqlalchemy.exc import SQLAlchemyError
import logging
from app.models.problem_model import Problem

logger = logging.getLogger(__name__)

def create_prevalidation(comments, script_path_pre, problem_id, parameters):
    try:
        new_validation = PreValidation(
            comments=comments,
            preValidationScriptPath=script_path_pre,
            probId=problem_id,
            parameters=parameters,
        )
        db.session.add(new_validation)
        db.session.commit()
        logger.info("Validation created successfully")
        return new_validation
    except SQLAlchemyError as e:
        db.session.rollback()
        logger.error(f"Error creating validation: {str(e)}")
        return {"error": str(e)}

def create_postvalidation(comments, script_path_post, problem_id, parameters):
    try:
        new_validation = PostValidation(
            comments=comments,
            postValidationScriptPath=script_path_post,
            probId=problem_id,
            parameters=parameters,
        )
        db.session.add(new_validation)
        db.session.commit()
        logger.info("Validation created successfully")
        return new_validation
    except SQLAlchemyError as e:
        db.session.rollback()
        logger.error(f"Error creating validation: {str(e)}")
        return {"error": str(e)}

def get_problem_with_prevalidation(problem_id):
    try:
        problem_with_prevalidation = db.session.query(Problem, PreValidation).join(PreValidation, Problem.id == PreValidation.probId).filter(Problem.id == problem_id).first()
        return problem_with_prevalidation
    except SQLAlchemyError as e:
        logger.error(f"Error fetching problem with validation for problemId {problem_id}: {str(e)}")
        return {"error": str(e)}
    
def get_problem_with_postvalidation(problem_id):
    try:
        problem_with_validation = db.session.query(Problem, PostValidation).join(PostValidation, Problem.id == PostValidation.probId).filter(Problem.id == problem_id).first()
        return problem_with_validation
    except SQLAlchemyError as e:
        logger.error(f"Error fetching problem with validation for problemId {problem_id}: {str(e)}")
        return {"error": str(e)}

def get_prevalidation_script_path_by_prob_id(prob_id):
    try:
        validation = PreValidation.query.filter_by(probId=prob_id).first()
        if validation:
            return validation
        else:
            return None, None
    except SQLAlchemyError as e:
        logger.error(f"Error fetching script path by problem ID: {str(e)}")
        return {"error": str(e)}

def get_postvalidation_script_path_by_prob_id(prob_id):
    try:
        validation = PostValidation.query.filter_by(probId=prob_id).first()
        if validation:
            return validation
        else:
            return None, None
    except SQLAlchemyError as e:
        logger.error(f"Error fetching script path by problem ID: {str(e)}")
        return {"error": str(e)}

def update_validation(validation_id, script_path_pre, script_path_post, comments):
    validation = Validation.query.filter_by(validationId=validation_id).first()
    if validation:
        validation.preValidationScriptPath = script_path_pre
        validation.postValidationScriptPath = script_path_post
        validation.comments = comments
        db.session.commit()
        logger.info(f"Updated Validation for Problem {validation_id} successfully")
        return "Validation successfully updated"
    else:
        return "Validation not found"

def delete_validation(validation_id):
    try:
        # Fetch the validation record by its ID
        validation = Validation.query.get(validation_id)
        
        # If the record does not exist, raise an exception
        if validation is None:
            raise ValueError(f"Validation with ID {validation_id} does not exist.")

        # Delete the record from the database
        db.session.delete(validation)
        db.session.commit()
        
        return {"status": "success", "message": f"Validation with ID {validation_id} deleted successfully."}
    
    except Exception as e:
        # Rollback the session in case of an error
        db.session.rollback()
        
        return {"status": "error", "message": str(e)}

def get_prevalidation_by_id(validation_id):
    try:
        validation = PreValidation.query.get(validation_id)
        return validation
    except SQLAlchemyError as e:
        logger.error(f"Error fetching validation by ID: {str(e)}")
        return {"error": str(e)}

def get_postvalidation_by_id(validation_id):
    try:
        validation = PostValidation.query.get(validation_id)
        return validation
    except SQLAlchemyError as e:
        logger.error(f"Error fetching validation by ID: {str(e)}")
        return {"error": str(e)}

def get_all_prevalidations():
    try:
        validations = PreValidation.query.all()
        return validations
    except SQLAlchemyError as e:
        logger.error(f"Error fetching all validations: {str(e)}")
        return {"error": str(e)}

def get_all_postvalidations():
    try:
        validations = PostValidation.query.all()
        return validations
    except SQLAlchemyError as e:
        logger.error(f"Error fetching all validations: {str(e)}")
        return {"error": str(e)}
