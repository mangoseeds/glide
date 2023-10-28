from flask import Flask,render_template, request, jsonify
import pyrebase
import firebase_admin
from firebase_admin import credentials, db

from config import firebaseConfig

# cd to venv;

cred = credentials.Certificate(firebaseConfig)
firebase_admin.initialize_app(cred, {
    "databaseURL" : "https://glide-cce9b-default-rtdb.firebaseio.com"
})

ref = db.reference('buildings')
# ref.update({'test': '99999'})

app = Flask(__name__)

@app.route('/get_buildings', methods=['GET'])
def get_buildings():
    buildings = ref.get()
    building_names = [key for key in buildings]
    print(building_names)
    return jsonify(building_names)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/directions', methods=['POST'])
def calculate_route():
    origin = request.form.get('origin')
    destination = request.form.get('destination')

    # route calculation with default google maps api
    calculate_google_maps_route(origin, destination)

    print("origin:", origin)
    print("destination:", destination)

    route = [origin, destination]
    # route calculation with default google maps api
    # calculate_custom_route(origin, destination)

    return jsonify({ 'route': route })


# Define functions for calculating routes using Google Maps API and custom data
# You can import these functions into routes.py

def calculate_google_maps_route(origin, destination):
    # Implement the Google Maps route calculation logic here
    pass

def calculate_custom_route(origin, destination):
    # Implement custom routing logic here
    pass



if __name__ == '__main__':
        app.run(debug=True)
