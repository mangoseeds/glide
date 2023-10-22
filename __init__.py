from flask import Flask

app = Flask(__name__)

# Configuration settings and any app-wide setup can go here

from app import routes
