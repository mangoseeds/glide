from flask import Flask,render_template, request, jsonify
import pyrebase
import sys
sys.path.append('../../')
import config
from config import firebaseConfig

import firebase_admin
from firebase_admin import credentials, db

# cd to venv;

cred = credentials.Certificate(firebaseConfig)
firebase_admin.initialize_app(cred, {
    "databaseURL" : "https://glide-cce9b-default-rtdb.firebaseio.com"
})

ref = db.reference('buildings')

##### database structure #####
##### buildings > BUILDING NAME > coordinates   > LATITUDE:
#####                                           > LONGITUDE:
#####                           > other buildings

app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/directions')
def directions():
    org = request.args.get('org')
    dst = request.args.get('dst')
    route = request.args.get('route')
    print(org, dst, route)
    return render_template('directions.html', org=org, dst=dst, route=route)

@app.route('/get_buildings', methods=['GET'])
def get_buildings():
    buildings = ref.get()
    building_names = [key for key in buildings]
    # print(jsonify(building_names))
    return jsonify(building_names)

@app.route('/coordinates', methods=['GET'])
def get_coordinates_from_db():
    origin_building = request.args.get('org')
    destination_building = request.args.get('dst')

    origin_latlng = ref.child(origin_building).get()
    dest_latlng = ref.child(destination_building).get()
    route = []

    data = {
        "origin": {
            "building_name": origin_building,
            "latlng": origin_latlng
        },
        "destination": {
            "building_name": destination_building,
            "latlng": dest_latlng
        },
        "route": route
    }

    return jsonify(data)


if __name__ == '__main__':
        app.run(debug=True)
