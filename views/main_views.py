from flask import Blueprint, render_template, request

bp = Blueprint('main', __name__, url_prefix='/')

@bp.route('/hello')
def hello_glide():
    return 'Hello, Glide!'

@bp.route('/')
def index():
    return render_template('index.html')
