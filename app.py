from flask import Flask,render_template, request, jsonify
import pyrebase

firebaseConfig = {
        "apiKey": "AIzaSyCrpjD8HRk2YFPRWu0YB78By_OH3fyySQg",
        "authDomain": "glide-cce9b.firebaseapp.com",
        "databaseURL": "https://glide-cce9b-default-rtdb.firebaseio.com",
        "projectId": "glide-cce9b",
        "storageBucket": "glide-cce9b.appspot.com",
        "messagingSenderId": "959009446750",
        "appId": "1:959009446750:web:1ed6c30c71b082b6cacdcf"
}

app = Flask(__name__)
# firebase = pyrebase.initialize_app(firebaseConfig)
# db = firebase.database()

# Configuration settings and any app-wide setup can go here

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
