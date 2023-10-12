from flask import Flask, render_template, request
import os

# FLASK_APP=app.py flask run

app = Flask(__name__)

# @app.route("/static/templates/index.html", methods=("GET", "POST"))
# def serve_static():
#     if request.method == "POST":
#         origin = request.form["origin"]
#         destination = request.form["destination"]
#         print(origin)
#         print(destination)

#         result = request.args.get("result")
#         return render_template("/static/templates/index.html", result=result)

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


@app.route("/directions")
def directions():
    return render_template('directions.html')

if __name__ == '__main__':
    app.run(debug=True)