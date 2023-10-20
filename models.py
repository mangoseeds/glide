from glide import db

class Buildings(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    building_name = db.Column(db.String(20), nullable=False)
    latitude = db.Column(db.Numeric(), nullable=False)
    longitude = db.Column(db.Numeric(), nullable=False)
