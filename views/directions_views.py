from flask import Blueprint, render_template, request, url_for, current_app
from werkzeug.utils import redirect

bp = Blueprint('directions', __name__, url_prefix='/directions')

@bp.route('/directions', methods=('POST', ))
def directions(origin, destination):

    # origin = request.form.get('origin')
    # destination = request.form.get('destination')
    #
    current_app.logger.info(origin, destination)
    #
    # # routing here
    #
    # # pass the results to the directions template
    # results = {
    #     'origin': origin,
    #     'destination': destination,
    #     # Add any other calculated data to pass
    # }

    return render_template('directions.html') #, results)
