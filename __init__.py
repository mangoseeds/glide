from flask import Flask, render_template, request
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy

import os
import config

db = SQLAlchemy()
migrate = Migrate()

# FLASK_APP=__init__.py flask run
# FLASK_APP=glide.__init__.py flask db init

def create_app():
    app = Flask(__name__)
    app.config.from_object(config)

    # ORM
    db.init_app(app)
    migrate.init_app(app, db)
    from . import models

    # blueprint
    from .views import main_views, directions_views
    app.register_blueprint(main_views.bp)
    app.register_blueprint(directions_views.bp)

    return app
