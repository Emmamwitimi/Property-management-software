from app import app, db
from models import User
from flask import request, jsonify

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    role = data.get('role', 'user')  # Default role is 'user' if not provided

    if not username or not password:
        return jsonify({'error': 'Username and password are required'}), 400

    existing_user = User.query.filter_by(username=username).first()
    if existing_user:
        return jsonify({'error': 'User already exists'}), 400

    new_user = User(username=username, role=role)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': f'User {username} registered successfully as {role}'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'error': 'Username and password are required'}), 400

    print(f"Login attempt for username: {username}")  # Debugging line

    user = User.query.filter_by(username=username).first()
    if user:
        print(f"User found: {user.username}")  # Debugging line
        if user.check_password(password):
            return jsonify({
                'isLoggedIn': True,
                'user': {
                    'username': user.username,
                    'role': user.role
                }
            }), 200
        else:
            print("Invalid password")  # Debugging line
            return jsonify({'error': 'Invalid credentials'}), 401
    else:
        print("User not found")  # Debugging line
        return jsonify({'error': 'Invalid credentials'}), 401
