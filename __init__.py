from flask import Flask, render_template, request
import os

# FLASK_APP=__init__.py flask run

def create_app():
    app = Flask(__name__)

    from .views import main_views
    app.register_blueprint(main_views.bp)

    return app
