from app import db
from sqlalchemy.ext.mutable import MutableList
from sqlalchemy.types import JSON

class Library(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    scriptName = db.Column(db.String(255), nullable=False)
    description = db.Column(db.String(255), default="N/A")
    parameters = db.Column(MutableList.as_mutable(JSON), nullable=True)
    parameterValues = db.Column(MutableList.as_mutable(JSON), nullable=True)
    scriptPath = db.Column(db.String(255), nullable=False)
    category = db.Column(db.String(255), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'scriptName': self.scriptName,
            'description': self.description,
            'parameters': self.parameters,
            'scriptPath': self.scriptPath,
            'category': self.category,
            'parameterValues': self.parameterValues,
        }
