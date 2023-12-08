from flask import Flask,render_template, request, jsonify
import pyrebase
import sys
sys.path.append('../../')

import firebase_admin
from firebase_admin import credentials, db

# cd to venv;
firebaseConfig = {
    "type": "service_account",
    "project_id": "glide-cce9b",
    "private_key_id": "8054960fe9df169d6fd578345818940569a15a35",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCzMrGlwD50kLPB\n08EEr8y/EFbwD1D5G1MTAKojQ+UWHhl+kt30roJUf9oo6X9O1dJxWLhfxIX8nqSJ\n993n1w5ES6XntiE/hj0YUM7mm7rrLok/+KD7pyJC3LLHGTS/qI/wKWNb9EpDsckd\ntvh4Lp/Fup4eeoL5RGZKVTbGANPdpFE9wedsjfWzgp9+hvroyHvrewDPNfQWt1Jk\n18oP7alABA46Hunl8BE/Sgt6+Qtii3r9za6us8nlTFQ0cnlvSPjPvBwynE1abs6W\nyKHbA7ylfqxfHSy873VsQrTLgwqFNsNTMudKsQRlpnOFa7A6hFBs7eJ8oJiMBQaZ\nwcyxWLRZAgMBAAECggEAKKVmxJ80u2loEJ64oRjEIxFwes6qkfpn7z8/GDUqBQiK\nRVrIVBvyLXr7j7yY1xeqfnG+jmBr+Nc+IJpTn+b4kjareMGnzHolKPsJVyb7MKWz\nVYqOb05jd9GKDp2RyKhSD8o/gofIgY7VvLL4LIB81pOEEos84o/oeNNX03U0GUlu\nhmHl0oQQ+n14DsGR1iig3gcOhE0VfprvcShvHk0IhOZ30BPK0bhIpf75piczucbH\nRsH1SqCxLkftg1bNz6LzAePjRNm8zfiupDJr/WJX2jIfYZ0iKKm6c1hHt/8jZ35z\nN1naalk1u5N6TFK6g6uDjODwe5WHnDh2Js/NJwFWFQKBgQDyiXmv0qRcyl/N2eA1\nHWCiiRAv77GwU59suwKNWwFuJppVa+bKJNGE3HGXks+OuiZTpvd65EiXCfR1WZBc\nOeIewd5Mdn12wv3thHiwtDvbsLarAm5t2MkH5U6E+TuzV64fHLQyCpThLJYfTKGx\neX6YU10MTnQq12stBJ4zProwNQKBgQC9JSb9RQWLG1ZTxK5W/zZjkOhb5Aoy5iuR\nQoYqLUJBNJR1FgWdk+uJYWaue7EGiWnvnVHcCafpXo9DJukAA91DcXAbzCuw+xWC\nXnW0i1FV7WgaO/dOukUJcIlItuUU1r/I9CuByQJRKiNJnwcOag3OGh31pdCDxTWy\nap2x+5/AFQKBgQCaG3Qwnd1GAGkDeY8W8MW4QPMCIoF7EodYJTOn8c1k2i5yXI9W\nnjJrA09CCkzL2cgEmzDg6zCcl/y2m+Q4Vacx9+lyGE/8KEYEp4mwbbUjEJPg8TiN\nn5OM6s0LfPnMKMhAiJKOwV57/UKePKj5BcPEsiOLcEYr+pjlD+wdj5vqiQKBgQC8\nzfg0exCEgj5TEhJhPxKAouZ+y4wusLmun3QjZ9gqFJ1Ynynt2PkVwodoBop4FvUL\nPcO33F+jQUPKaW3OGQ1mRDb/WHgIiyo2X6opFaSUHI59GXzNNnyxZodzcTYM7iy1\nIJ7JR+grMt/UnozBo7WyFTnwupsA3fuy5GATiTQ23QKBgBG8iKv1hWIkixudvr7Z\nJfK3LazE/EwLiuXTlc+fpt0cjkmiopt2E/Yefzm+g7qbQAfJaJwuFfx3N7f1Jq+y\n3EOU7IlYVs3e87VatBqmFL4I3Skse51IBepN8JEJnf2GOjeqdd3SrVvq4DlWWk+P\nCz0gfXjf66PoI2S5o6TVsHLj\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-gmp64@glide-cce9b.iam.gserviceaccount.com",
    "client_id": "117285932432252289325",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-gmp64%40glide-cce9b.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
}

cred = credentials.Certificate(firebaseConfig)
firebase_admin.initialize_app(cred, {
    "databaseURL" : "https://glide-cce9b-default-rtdb.firebaseio.com"
})

ref = db.reference('buildings')

application = Flask(__name__)
application.config['JSON_AS_ASCII'] = False


@application.route('/')
def index():
    return render_template('index.html')

@application.route('/directions')
def directions():
    org = request.args.get('org')
    dst = request.args.get('dst')
    # route = request.args.get('route')
    # add route when reconfiguring database and route field
    return render_template('directions.html')

@application.route('/get_buildings', methods=['GET'])
def get_buildings():
    buildings = ref.get()
    # print(buildings)
    # all_buildings = [key for key in buildings]
    # print(all_buildings)
    building_names = [key for key in buildings if buildings[key].get("latlng")]
    # print(building_names)
    return jsonify(building_names)

@application.route('/get_accessible_entrance_coordinates', methods=['GET'])
def get_entrance_coordinates_from_db():
    buildings = ref.get()
    entrance_list = []
    for b in buildings.keys():
        entrances = buildings[b].get("entrance", {})
        for value in entrances.values():
            coordinates = value.split(' / ')
            for coord in coordinates:
                entrance_list.append(coord)
    return jsonify(entrance_list)

@application.route('/get_parking_coordinates', methods=['GET'])
def get_parking_coordinates_from_db():
    buildings = ref.get()
    parking_list = []
    for b in buildings.keys():
        if buildings[b].get("parking") is not None:
            parking = buildings[b].get("parking")
            coordinates = parking.split(' / ')
            for coord in coordinates:
                parking_list.append(coord)
    return jsonify(parking_list)

@application.route('/get_building_info', methods=['GET'])
def get_building_info_from_db():
    buildings = ref.get()
    building_info = {}
    for b in buildings.keys():
        info = buildings[b].get("information")
        if info:
            if buildings[b].get("latlng"):
                latlng = buildings[b].get("latlng")
            else:
                latlng = list(buildings[b].get("entrance").values())[0].split(' / ')[0]
            building_info[b] = [ latlng, info ]
    return jsonify(building_info)

@application.route('/coordinates', methods=['GET'])
def get_coordinates_from_db():
    origin_building = request.args.get('org')
    destination_building = request.args.get('dst')

    origin_latlng = ref.child(origin_building).get()['latlng']
    destination_latlng = ref.child(destination_building).get()['latlng']

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

if __name__ == '__main__':
        application.run(host='0.0.0.0', port=80, debug=True)
