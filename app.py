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


entrance_list = []

buildings = ref.get()
for b in buildings.keys():
    entrances = buildings[b].get("entrance", {})
    for value in entrances.values():
        coordinates = value.split(' / ')
        for coord in coordinates:
            entrance_list.append(coord)

print(entrance_list)

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
    buildings = ref.get()
    building_names = [key for key in buildings]
    # print(jsonify(building_names))
    return jsonify(building_names)

# @app.route('/entrance', methods=['GET'])
# def get_entrance_coordinates_from_db():
#     entrance_list = []
#
#     buildings = ref.get()
#     for building_name, building_data in buildings.item():
#         entrances = building_data.get("entrance", {})
#         coordinates = [entrances[key] for key in entrances]
#         entrance_list[building_name] = coordinates
#     return jsonify(entrance_list)

@app.route('/coordinates', methods=['GET'])
def get_coordinates_from_db():
    origin_building = request.args.get('org')
    destination_building = request.args.get('dst')

    origin_latlng = ref.child(origin_building).get()
    destination_latlng = ref.child(destination_building).get()

    #### data example
    # {'latlng': '(37.5602290, 126.9457357)'}
    # {'latlng': '(37.5602290, 126.9457357)'}
    ####
    olatlng = origin_latlng['latlng']
    olatlng = olatlng[1:-1].split(", ")

    dlatlng = destination_latlng['latlng']
    dlatlng = dlatlng[1:-1].split(", ")

    # print(olatlng)
    # print(origin_latlng)
    # print({'LATITUDE': olatlng[0], 'LONGITUDE': olatlng[1]})

    ### should be
    # {'LATITUDE': 37.56247, 'LONGITUDE': 126.937626}
    # {'LATITUDE': 37.561318, 'LONGITUDE': 126.938262}

    data = {
        "origin": {
            "building_name": origin_building,
            "latlng": {'LATITUDE': olatlng[0], 'LONGITUDE': olatlng[1]}
        },
        "destination": {
            "building_name": destination_building,
            "latlng": {'LATITUDE': dlatlng[0], 'LONGITUDE': dlatlng[1]}
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


#ref = db.reference('buildings')

if __name__ == '__main__':
        app.run(debug=True)
