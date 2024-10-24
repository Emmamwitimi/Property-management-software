from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from database import db, bcrypt  # Import db and bcrypt together

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'your-secret-key'

# Initialize the app with the db and bcrypt
db.init_app(app)
bcrypt.init_app(app)
CORS(app)

migrate = Migrate(app, db)  # Initialize Migrate

# Import routes and models after initializing the app to avoid circular imports
from models import *
from routes import *
from auth import *

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # This is usually not needed with migrations
    app.run(debug=True)
