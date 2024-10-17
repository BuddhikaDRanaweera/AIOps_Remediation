import datetime
import logging
from app.models.audit_model import Audit
from app import db
from sqlalchemy.exc import SQLAlchemyError
from pytz import timezone

# Logger setup
logger = logging.getLogger(__name__)

def create_audit(problemTitle, subProblemTitle, impactedEntity, problemImpact, problemSeverity, problemURL, problemDetectedAt, serviceName, pid, executedProblemId, displayId, actionType, status, comments, problemEndAt,scriptExecutionStartAt):
    try:
        new_audit = Audit(
            problemTitle=problemTitle,
            subProblemTitle=subProblemTitle,
            impactedEntity=impactedEntity,
            problemImpact=problemImpact,
            problemSeverity=problemSeverity,
            problemURL=problemURL,
            serviceName=serviceName,
            actionType=actionType,
            status=status,
            pid=pid,
            executedProblemId=executedProblemId,
            displayId=displayId,
            comments=comments,
            problemDetectedAt=problemDetectedAt,
            problemEndAt=problemEndAt,
            scriptExecutionStartAt=scriptExecutionStartAt
        )
        db.session.add(new_audit)
        db.session.commit()
        logger.info("Created audit successfully")
        return True
    except SQLAlchemyError as e:
        db.session.rollback()
        logger.error(f"Error creating audit: {str(e)}")
        return False


def create_audit_preValidation_stage(problemTitle, subProblemTitle, impactedEntity, problemImpact, problemSeverity, problemURL, problemDetectedAt, serviceName, pid, executedProblemId, displayId, actionType, status, comments, problemEndAt,preValidationStartedAt, preValidationStatus):
    try:
        new_audit = Audit(
            problemTitle=problemTitle,
            subProblemTitle=subProblemTitle,
            impactedEntity=impactedEntity,
            problemImpact=problemImpact,
            problemSeverity=problemSeverity,
            problemURL=problemURL,
            serviceName=serviceName,
            actionType=actionType,
            status=status,
            pid=pid,
            executedProblemId=executedProblemId,
            displayId=displayId,
            comments=comments,
            problemDetectedAt=problemDetectedAt,
            problemEndAt=problemEndAt,
            preValidationStartedAt=preValidationStartedAt,
            preValidationStatus=preValidationStatus
        )
        db.session.add(new_audit)
        db.session.commit()
        logger.info("Created audit successfully")
        return True
    except SQLAlchemyError as e:
        db.session.rollback()
        logger.error(f"Error creating audit: {str(e)}")
        return False


def get_all_audits():
    try:
        audits = Audit.query.order_by(Audit.problemDetectedAt.desc()).all()
        return audits
    except SQLAlchemyError as e:
        logger.error(f"Error fetching all audits: {str(e)}")
        return {"error": str(e)}


def update_audit_status_closed(pid, serviceName, problemTitle, new_status):
    try:
        audit = Audit.query.filter_by(pid = pid, status ="IN_PROGRESS" ,serviceName = serviceName, problemTitle = problemTitle).first()
        if audit:
            audit.status = new_status
            db.session.commit()
            logger.info(f"Updated audit status for PID {pid} successfully")
            return {"message": f"Audit with PID {pid} updated successfully"}
        else:
            return {"error": f"Audit with PID {pid} not found"}, 404
    except SQLAlchemyError as e:
        db.session.rollback()
        logger.error(f"Error updating audit status: {str(e)}")
        return {"error": str(e)}

def update_audit_status_closed_appdynamics(pid, serviceName, problemTitle, new_status):
    try:
        ist_timezone = timezone('Asia/Kolkata')
        
        audit = Audit.query.filter_by(pid = pid, status ="IN_PROGRESS" ,serviceName = serviceName, problemTitle = problemTitle, problemEndAt=datetime.datetime.now(ist_timezone).strftime('%Y-%m-%d %H:%M:%S'))
        if audit:
            audit.status = new_status
            db.session.commit()
            logger.info(f"Updated audit status for PID {pid} successfully")
            return {"message": f"Audit with PID {pid} updated successfully"}
        else:
            return {"error": f"Audit with PID {pid} not found"}, 404
    except SQLAlchemyError as e:
        db.session.rollback()
        logger.error(f"Error updating audit status: {str(e)}")
        return {"error": str(e)}

# identified a issue when running on lambda that why this check
def quick_check_audit_status(pid, serviceName, problemTitle):
    try:
        # Execute the query and fetch the result
        audit = Audit.query.filter_by(
            pid=pid,
            status="IN_PROGRESS",
            serviceName=serviceName,
            problemTitle=problemTitle
        ).first()  # Get the first matching record

        if audit:
            db.session.commit()  # Commit changes if any updates were made
            logger.info(f"Updated audit pre_validation status for PID {pid} successfully")
            print(audit,"audit>>>")
            return True
        else:
            print("no audit")
            return False
    except SQLAlchemyError as e:
        db.session.rollback()  # Rollback in case of an error
        logger.error(f"Error updating pre_validation audit status: {str(e)}")
        return {"error": str(e)}

def update_audit_pre_validation_status(pid, serviceName, problemTitle, preValidationStatus, preValidationStartedAt, comments):
    try:
        audit = Audit.query.filter_by(pid = pid, status ="IN_PROGRESS" ,serviceName = serviceName, problemTitle = problemTitle).first()
        print(audit,"AUDIT FOUND")
        if audit:
            audit.preValidationStatus = preValidationStatus
            audit.preValidationStartedAt = preValidationStartedAt
            audit.comments = comments
            db.session.commit()
            logger.info(f"Updated audit pre_validation status for PID {pid} successfully")
            return {"message": f"Audit with PID {pid} updated successfully"}
        else:
            return {"error": f"Audit with PID {pid} not found"}, 404
    except SQLAlchemyError as e:
        db.session.rollback()
        logger.error(f"Error updating pre_validation audit status: {str(e)}")
        return {"error": str(e)}

def update_audit_remediation_status(pid, serviceName, problemTitle, scriptExecutionStartAt, comments, problemEndAt, status):
    try:
        audit = Audit.query.filter_by(pid = pid, status ="IN_PROGRESS" ,serviceName = serviceName, problemTitle = problemTitle).first()
        if audit:
            audit.scriptExecutionStartAt = scriptExecutionStartAt
            audit.comments = comments
            audit.problemEndAt = problemEndAt
            audit.status = status
            db.session.commit()
            logger.info(f"Updated audit pre_validation status for PID {pid} successfully")
            return {"message": f"Audit with PID {pid} updated successfully"}
        else:
            return {"error": f"Audit with PID {pid} not found"}, 404
    except SQLAlchemyError as e:
        db.session.rollback()
        logger.error(f"Error updating pre_validation audit status: {str(e)}")
        return {"error": str(e)}


def update_audit_post_validation_status(pid, serviceName, problemTitle, postValidationStatus, postValidationStartedAt , comments):
    print(postValidationStatus, postValidationStartedAt,">><<<<<---------------------")
    try:
        audit = Audit.query.filter_by(pid = pid, status ="IN_PROGRESS" ,serviceName = serviceName, problemTitle = problemTitle).first()
        
        print(audit.id,"postValidationStatus id AUDIT FOUND")
        if audit:
            audit.postValidationStatus = postValidationStatus
            audit.postValidationStartedAt = postValidationStartedAt
            audit.comments = comments
            db.session.commit()
            logger.info(f"Updated audit post_validation status for PID {pid} successfully")
            return {"message": f"Audit with PID {pid} updated successfully"}
        else:
            return {"error": f"Audit with PID {pid} not found"}, 404
    except SQLAlchemyError as e:
        db.session.rollback()
        logger.error(f"Error updating audit post_validation status: {str(e)}")
        return {"error": str(e)}


def update_audit_status_to_failed(pid):
    try:
        audit = Audit.query.filter_by(pid=pid).first()
        if audit:
            audit.status = "FAILED"
            audit.problemEndAt = None
            db.session.commit()
            logger.info(f"Updated audit status for PID {pid} successfully")
            return {"message": f"Audit with PID {pid} updated successfully"}
        else:
            return {"error": f"Audit with PID {pid} not found"}, 404
    except SQLAlchemyError as e:
        db.session.rollback()
        logger.error(f"Error updating audit status: {str(e)}")
        return {"error": str(e)}


def get_audit_status():
    try:
        open_count = Audit.query.filter_by(status="OPEN").count()
        in_progress_count = Audit.query.filter_by(status="IN_PROGRESS").count()
        closedCount = Audit.query.filter_by(status="CLOSED").count()

        latest_audits = Audit.query.order_by(Audit.problemDetectedAt.desc()).limit(10).all()

        audit_list = [
            {
                "id": audit.id,
                "problemTitle": audit.problemTitle,
                "subProblemTitle": audit.subProblemTitle,
                "impactedEntity": audit.impactedEntity,
                "problemImpact": audit.problemImpact,
                "problemSeverity": audit.problemSeverity,
                "problemURL": audit.problemURL,
                "serviceName": audit.serviceName,
                "actionType": audit.actionType,
                "status": audit.status,
                "pid": audit.pid,
                "executedProblemId": audit.executedProblemId,
                "displayId": audit.displayId,
                "comments": audit.comments,
                "problemDetectedAt": audit.problemDetectedAt,
                "problemEndAt": audit.problemEndAt
            } for audit in latest_audits
        ]

        response = {
            "count": open_count + in_progress_count,
            "opencount": open_count,
            "InProgressCount": in_progress_count,
            "closedCount": closedCount,
            "activity": audit_list
        }

        return response
    except Exception as e:
        raise e
    
    
def update_in_progress_problems_in_Audit(serviceName, displayId, probId, problemTitle):
    """
    Updates all "IN_PROGRESS" records with the specified serviceName and displayId
    to have their executedProblemId set to probId.

    Args:
        serviceName: The name of the service to update.
        displayId: The display ID associated with the records to update.
        probId: The new executedProblemId value.
    """
    try:
        # Update the records using SQLAlchemy
        db.session.query(Audit).filter(
            Audit.serviceName == serviceName,
            Audit.displayId == displayId,
            Audit.status == "IN_PROGRESS",
            Audit.problemTitle == problemTitle
        ).update({Audit.executedProblemId: probId, Audit.status : "CLOSED"})

        # Commit the changes to the database
        db.session.commit()
        print(f"Successfully updated executedProblemId for 'CLOSED' records with serviceName: {serviceName} and displayId: {displayId}")

    except Exception as e:
        # Rollback the changes in case of errors
        db.session.rollback()
        print(f"An error occurred: {e}")

        
def update_to_inprogress_manual_exe(serviceName, probId, problemTitle, scriptExecutionStartAt):
    ist_timezone = timezone('Asia/Kolkata')
    try:
        # Update the records using SQLAlchemy
        db.session.query(Audit).filter(
            Audit.serviceName == serviceName,
            Audit.status == "OPEN",
            Audit.problemTitle == problemTitle,
            
        ).update({Audit.executedProblemId: probId, Audit.status : "IN_PROGRESS", Audit.problemEndAt:datetime.datetime.now(ist_timezone).strftime('%Y-%m-%d %H:%M:%S'),Audit.executedProblemId : probId, Audit.scriptExecutionStartAt:scriptExecutionStartAt})

        # Commit the changes to the database
        db.session.commit()
        print(f"Successfully updated executedProblemId for 'CLOSED' records with serviceName: {serviceName}")

    except Exception as e:
        # Rollback the changes in case of errors
        db.session.rollback()
        print(f"An error occurred: {e}")


def get_audit_record_by_id(pid):
    try:
        audit = Audit.query.filter_by(pid=pid).first()
        if(audit):
            return audit;
        else:
            None
    except Exception as e:
        # Rollback the changes in case of errors
        db.session.rollback()
        print(f"An error occurred: {e}")


def get_audit_record_by_audit_id(id):
    print(id)
    try:
        audit = Audit.query.filter_by(id=id).first()
        if(audit):
            return audit;
        else:
            None
    except Exception as e:
        # Rollback the changes in case of errors
        db.session.rollback()
        print(f"An error occurred: {e}")


def get_audits_last_6_hours(problemTitle):  
    try:
        six_hours_ago = datetime.datetime.now() - datetime.timedelta(hours=24)
        audits = Audit.query.filter(
            Audit.problemTitle == problemTitle,
            Audit.problemDetectedAt >= six_hours_ago,
            Audit.problemEndAt <= datetime.datetime.now()
        ).order_by(Audit.problemDetectedAt.desc()).all()
        
        return audits
    except Exception as e:
        raise Exception(f"Error fetching audits from the last 24 hours: {str(e)}")