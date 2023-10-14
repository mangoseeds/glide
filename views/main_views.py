from flask import Blueprint, render_template, request

bp = Blueprint('main', __name__, url_prefix='/')

@bp.route('/', methods=['POST', 'GET'])
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


@bp.route("/directions", methods=['POST', 'GET'])
def directions():
    results = None

    # if request.method == 'POST':
    #
    #     }
    return render_template('directions.html', results=results)