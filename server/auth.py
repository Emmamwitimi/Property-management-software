from app import app, db  # Import the Flask app instance and the database object
from models import User  # Import the User model from the models module
from flask import request, jsonify  # Import necessary Flask modules for handling HTTP requests and JSON responses

#Auth.py is responsible for handling authentication-related functionalities. 
#It acts as a dedicated module to manage user login, registration, password management,
#  and any authentication checks necessary for the app.


# Route for user registration
#a decorator in Flask, which is a way to map a URL path (like /register)
#  to a specific function that handles requests to that URL.
@app.route('/register', methods=['POST'])
def register():
    # Retrieve the JSON data sent with the request
    data = request.json
    username = data.get('username')  # Get the username from the JSON data
    password = data.get('password')  # Get the password from the JSON data
    role = data.get('role', 'user')  # Get the user role, defaulting to 'user' if not provided

    # Basic validation to ensure username and password are provided
    if not username or not password:
        return jsonify({'error': 'Username and password are required'}), 400

    # Check if a user with the same username already exists in the database
    existing_user = User.query.filter_by(username=username).first()
    if existing_user:
        return jsonify({'error': 'User already exists'}), 400

    # Create a new user object with the provided username and role
    new_user = User(username=username, role=role)
    new_user.set_password(password)  # Hash the password before saving to the database

    # Add the new user to the session and commit the changes to the database
    db.session.add(new_user)
    db.session.commit()

    # Return a success message with the registered user's username and role
    return jsonify({'message': f'User {username} registered successfully as {role}'}), 201

# Route for user login
@app.route('/login', methods=['POST'])
def login():
    # Retrieve the JSON data sent with the request
    data = request.json
    username = data.get('username')  # Get the username from the JSON data
    password = data.get('password')  # Get the password from the JSON data

    # Basic validation to ensure username and password are provided
    if not username or not password:
        return jsonify({'error': 'Username and password are required'}), 400

    # Debugging line to print the attempted username
    print(f"Login attempt for username: {username}")

    # Query the database for a user with the provided username
    user = User.query.filter_by(username=username).first()
    if user:
        # Debugging line to confirm that the user was found
        print(f"User found: {user.username}")
        
        # Check if the provided password matches the stored password hash
        if user.check_password(password):
            # Return a success response with user details if the password is correct
            return jsonify({
                'isLoggedIn': True,
                'user': {
                    'username': user.username,
                    'role': user.role
                }
            }), 200
        else:
            # Debugging line for an invalid password attempt
            print("Invalid password")
            return jsonify({'error': 'Invalid credentials'}), 401
    else:
        # Debugging line if the user is not found in the database
        print("User not found")
        return jsonify({'error': 'Invalid credentials'}), 401
