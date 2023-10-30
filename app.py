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
app.config['JSON_AS_ASCII'] = False

@app.route('/get_buildings', methods=['GET'])
def get_buildings():
    buildings = ref.get()
    building_names = [key for key in buildings]
    # print(jsonify(building_names))
    return jsonify(building_names)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/coordinates', methods=['GET'])
def get_coordinates_from_db():
    origin = request.args.get('org')
    destination = request.args.get('dst')

    origin_coordinates = ref.child(origin).get()
    dest_coordinates = ref.child(destination).get()
    # print(origin + " = " + str(origin_coordinates))
    # print(destination + " = " + str(dest_coordinates))

    return jsonify( { "org": origin_coordinates,
                      "dst": dest_coordinates })

# @app.route('/directions', methods=['GET'])
# def directions():
#     return render_template('directions.html')


if __name__ == '__main__':
        app.run(debug=True)
