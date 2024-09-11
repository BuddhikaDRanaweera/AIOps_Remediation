from sqlalchemy import Boolean, Column, DateTime, Integer, PrimaryKeyConstraint, String
from app import db

class Audit(db.Model):
    id = Column(Integer, autoincrement=True)
    problemTitle = Column(String(255), nullable=False)
    subProblemTitle = Column(String(255), default="N/A")
    impactedEntity = Column(String(255))
    problemImpact = Column(String(255))
    problemSeverity = Column(String(255))
    problemURL = Column(String(255))
    serviceName = Column(String(255), nullable=False)
    actionType = Column(String(255))
    status = Column(String(255), nullable=False)
    pid = Column(String(255))
    executedProblemId = Column(String(255))
    scriptExecutionStartAt = Column(DateTime(timezone=True), nullable=True)
    displayId = Column(String(255))
    comments = Column(String(255))
    problemDetectedAt = Column(DateTime(timezone=True), nullable=True)
    problemEndAt = Column(DateTime(timezone=True), nullable=True)
     # New columns
    preValidationStatus = Column(Boolean, nullable=True)
    postValidationStatus = Column(Boolean, nullable=True)
    preValidationStartedAt = Column(DateTime(timezone=True), nullable=True)
    postValidationStartedAt = Column(DateTime(timezone=True), nullable=True)

    __table_args__ = (
        PrimaryKeyConstraint('id', 'serviceName', 'displayId', name='pk_id_serviceName_displayId'),
    )
