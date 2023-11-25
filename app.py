import collections

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
buildings = ref.get()
print(buildings)

app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/directions')
def directions():
    org = request.args.get('org')
    dst = request.args.get('dst')
    # route = request.args.get('route')
    # add route when reconfiguring database and route field
    return render_template('directions.html')

@app.route('/get_buildings', methods=['GET'])
def get_buildings():
    # print(buildings)
    building_names = [key for key in buildings]

    return jsonify(building_names)

@app.route('/get_accessible_entrance_coordinates', methods=['GET'])
def get_entrance_coordinates_from_db():
    entrance_list = []
    for b in buildings.keys():
        entrances = buildings[b].get("entrance", {})
        for value in entrances.values():
            coordinates = value.split(' / ')
            for coord in coordinates:
                entrance_list.append(coord)

    return (jsonify(entrance_list))


@app.route('/coordinates', methods=['GET'])
def get_coordinates_from_db():
    origin_building = request.args.get('org')
    destination_building = request.args.get('dst')

    origin_latlng = ref.child(origin_building).get()['latlng']
    print(origin_latlng)
    destination_latlng = ref.child(destination_building).get()['latlng']
    print(destination_latlng)

    o = origin_latlng[1:-1].split(", ")
    d = destination_latlng[1:-1].split(", ")

    # {'LATITUDE': 37.56247, 'LONGITUDE': 126.937626}
    # {'LATITUDE': 37.561318, 'LONGITUDE': 126.938262}
    data = {
        "origin": {
            "building_name": origin_building,
            "latlng": {'LATITUDE': o[0], 'LONGITUDE': o[1]}
        },
        "destination": {
            "building_name": destination_building,
            "latlng": {'LATITUDE': d[0], 'LONGITUDE': d[1]}
        }
    }

    return jsonify(data)

# @app.route('/get_directions', methods=['GET'])
# def get_directions_from_db():
#     origin_building = request.args.get('org')
#     destination_building = request.args.get('dst')
#
#     origin_latlng = ref.child(origin_building).get()
#     dest_latlng = ref.child(destination_building).get()
#     route = []
#     data = {
#         "origin": {
#             "building_name": origin_building,
#             "latlng": origin_latlng
#         },
#         "destination": {
#             "building_name": destination_building,
#             "latlng": dest_latlng
#         },
#         "route": route
#     }
#
#     return jsonify(data)



if __name__ == '__main__':
        app.run(debug=True)
