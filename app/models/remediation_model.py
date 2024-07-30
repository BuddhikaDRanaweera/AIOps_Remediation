import datetime
from app import db
from sqlalchemy.ext.mutable import MutableList
from sqlalchemy.types import JSON
current_time = datetime.datetime.now()

class Remediation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    recommendationText = db.Column(db.String(255), nullable=False)
    parameters = db.Column(MutableList.as_mutable(JSON), nullable=True)
    scriptPath = db.Column(db.String(255), nullable=False)
    probId = db.Column(db.Integer, db.ForeignKey('problem.id'), nullable=False)
    createdAt = db.Column(db.DateTime, default=current_time, nullable=False)
    lastUpdateAt = db.Column(db.DateTime, default=current_time, onupdate=current_time, nullable=False)
