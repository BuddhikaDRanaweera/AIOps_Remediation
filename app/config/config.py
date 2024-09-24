import os

class Config:
    def __init__(self, mysql_user, mysql_password, mysql_host, mysql_port, mysql_db):
        self.MYSQL_USER = mysql_user
        self.MYSQL_PASSWORD = mysql_password
        self.MYSQL_HOST = mysql_host
        self.MYSQL_PORT = mysql_port
        self.MYSQL_DB = mysql_db
        self.SQLALCHEMY_DATABASE_URI = f"mysql+pymysql://{self.MYSQL_USER}:{self.MYSQL_PASSWORD}@{self.MYSQL_HOST}:{self.MYSQL_PORT}/{self.MYSQL_DB}"
        self.SQLALCHEMY_TRACK_MODIFICATIONS = False
        self.SECRET_KEY = os.getenv('SECRET_KEY', os.urandom(24))
