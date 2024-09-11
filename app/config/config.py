import os

class Config:
    # MySQL database configuration
    MYSQL_USER = 'root'
    MYSQL_PASSWORD = 'demoadmin'
    MYSQL_DB = 'aiops'
    MYSQL_HOST = '13.213.71.181'
    MYSQL_PORT = 3306
    SQLALCHEMY_DATABASE_URI = f"mysql://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DB}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.urandom(24)