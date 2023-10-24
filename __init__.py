from flask import Flask
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
firebase = pyrebase.initialize_app(firebaseConfig)

db = firebase.database()

# Configuration settings and any app-wide setup can go here

from app import routes

if __name__ == '__main__':
        app.run(debug=True)
