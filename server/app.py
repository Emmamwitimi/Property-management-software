from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from database import db, bcrypt  # Import db and bcrypt together for database handling and password hashing
#bcrypt is for password hashing. this improves security by preventing unauthorized access to sensitive data.

# Initialize the Flask application
app = Flask(__name__) # we are creating an app instance of the flask app

# Configure the SQLAlchemy database URI to use a local SQLite database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'

# Disable SQLALCHEMY_TRACK_MODIFICATIONS to avoid unnecessary overhead
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Set a secret key for session management, CSRF protection, etc.
app.config['SECRET_KEY'] = 'your-secret-key'

# Initialize database and password hashing
db.init_app(app)
bcrypt.init_app(app)

# Enable Cross-Origin Resource Sharing (CORS) to allow communication between the front-end and back-end
CORS(app)

# Initialize database migration tool with the Flask app and SQLAlchemy database
migrate = Migrate(app, db)

# Import routes and models after initializing the app to avoid circular imports
from models import *  # Import all database models (tables) from the models module
from routes import *  # Import all routes (API endpoints) from the routes module
from auth import *    # Import authentication logic from the auth module

# Main entry point for the Flask application
if __name__ == '__main__':
    # Within the app context, create all database tables if they don't exist
    with app.app_context():
        db.create_all()  # Note: This line is typically not necessary if you are using Flask-Migrate

    # Start the Flask development server in debug mode (auto-reloads on code changes)
    app.run(debug=True)
