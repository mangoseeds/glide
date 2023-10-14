from flask import Flask, render_template, request
import os

# FLASK_APP=__init__.py flask run

def create_app():
    app = Flask(__name__)

    @app.route("/", methods=['POST', 'GET'])
    def index():
        results = None

        if request.method == 'POST':
            origin = request.form.get('origin')
            destination = request.form.get('destination')

            # routing here

            # pass the results to the directions template
            results = {
                'origin': origin,
                'destination': destination,
                # Add any other calculated data to pass
            }
        return render_template('index.html', results=results)

    return app
