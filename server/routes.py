from flask import request, jsonify, abort
from flask_restful import Resource, Api
from flask_login import login_required, current_user
from marshmallow import ValidationError
from functools import wraps
from database import db
from models import Tenant, Landlord, Property
from schemas import TenantSchema, LandlordSchema, PropertySchema
from app import app

# Initialize Flask-RESTful API
api = Api(app)

# Helper function to get an object or return a 404 error
def get_object_or_404(model, object_id):
    obj = model.query.get(object_id)
    if obj is None:
        abort(404, description=f"{model.__name__} with ID {object_id} not found")
    return obj

# Helper function for admin role check
def admin_required(f):
    @wraps(f)
    def wrap(*args, **kwargs):
        if not current_user.is_authenticated or current_user.role != 'admin':
            return jsonify({"error": "Admin access required"}), 403
        return f(*args, **kwargs)
    return wrap

# Tenant Resource
class TenantResource(Resource):
    def get(self, id=None):
        if id:
            # Fetch a single tenant by ID
            tenant = get_object_or_404(Tenant, id)
            return TenantSchema().dump(tenant), 200
        
        # Fetch all tenants or filter by landlord_id/property_id
        landlord_id = request.args.get('landlord_id')
        property_id = request.args.get('property_id')
        query = Tenant.query
        
        if landlord_id:
            query = query.filter_by(landlord_id=landlord_id)
        if property_id:
            query = query.filter_by(property_id=property_id)
        
        tenants = query.all()
        return TenantSchema(many=True).dump(tenants), 200

    def post(self):
        data = request.get_json()
        tenant_schema = TenantSchema()
        
        try:
            validated_data = tenant_schema.load(data)
        except ValidationError as err:
            return jsonify(err.messages), 400
        
        tenant = Tenant(**validated_data)
        db.session.add(tenant)
        db.session.commit()
        return tenant_schema.dump(tenant), 201

    def put(self, id):
        tenant = get_object_or_404(Tenant, id)
        data = request.get_json()
        tenant_schema = TenantSchema(partial=True)
        
        try:
            validated_data = tenant_schema.load(data)
        except ValidationError as err:
            return jsonify(err.messages), 400
        
        for key, value in validated_data.items():
            setattr(tenant, key, value)
        
        db.session.commit()
        return tenant_schema.dump(tenant), 200

    def delete(self, id):
        tenant = get_object_or_404(Tenant, id)
        db.session.delete(tenant)
        db.session.commit()
        return jsonify({"message": f"Tenant {id} deleted successfully"}), 200


# Landlord Resource
class LandlordResource(Resource):
    def get(self, id=None):
        if id:
            landlord = get_object_or_404(Landlord, id)
            return LandlordSchema().dump(landlord), 200
        
        landlords = Landlord.query.all()
        return LandlordSchema(many=True).dump(landlords), 200

    def post(self):
        data = request.get_json()
        landlord_schema = LandlordSchema()
        
        try:
            validated_data = landlord_schema.load(data)
        except ValidationError as err:
            return jsonify(err.messages), 400
        
        landlord = Landlord(**validated_data)
        db.session.add(landlord)
        db.session.commit()
        return landlord_schema.dump(landlord), 201

    def put(self, id):
        landlord = get_object_or_404(Landlord, id)
        data = request.get_json()
        landlord_schema = LandlordSchema(partial=True)
        
        try:
            validated_data = landlord_schema.load(data)
        except ValidationError as err:
            return jsonify(err.messages), 400
        
        for key, value in validated_data.items():
            setattr(landlord, key, value)
        
        db.session.commit()
        return landlord_schema.dump(landlord), 200

    def delete(self, id):
        landlord = get_object_or_404(Landlord, id)
        db.session.delete(landlord)
        db.session.commit()
        return jsonify({"message": f"Landlord {id} deleted successfully"}), 200


# Property Resource
class PropertyResource(Resource):
    def get(self, id=None):
        if id:
            property_instance = get_object_or_404(Property, id)
            return PropertySchema().dump(property_instance), 200
        
        properties = Property.query.all()
        return PropertySchema(many=True).dump(properties), 200

    def post(self):
        data = request.get_json()
        property_schema = PropertySchema()
        
        try:
            validated_data = property_schema.load(data)
        except ValidationError as err:
            return jsonify(err.messages), 400
        
        property_instance = Property(**validated_data)
        db.session.add(property_instance)
        db.session.commit()
        return property_schema.dump(property_instance), 201

    def put(self, id):
        property_instance = get_object_or_404(Property, id)
        data = request.get_json()
        property_schema = PropertySchema(partial=True)
        
        try:
            validated_data = property_schema.load(data)
        except ValidationError as err:
            return jsonify(err.messages), 400
        
        for key, value in validated_data.items():
            setattr(property_instance, key, value)
        
        db.session.commit()
        return property_schema.dump(property_instance), 200

    def delete(self, id):
        property_instance = get_object_or_404(Property, id)
        db.session.delete(property_instance)
        db.session.commit()
        return jsonify({"message": f"Property {id} deleted successfully"}), 200


# Admin Dashboard Route
@app.route('/admin/dashboard', methods=['GET'])
@login_required  # Ensure the user is logged in
@admin_required  # Ensure the user has admin privileges
def admin_dashboard():
    tenant_count = Tenant.query.count()
    landlord_count = Landlord.query.count()
    property_count = Property.query.count()

    return jsonify({
        "tenants": tenant_count,
        "landlords": landlord_count,
        "properties": property_count
    }), 200


# Define routes for the API resources
api.add_resource(TenantResource, '/tenants', '/tenants/<int:id>')
api.add_resource(LandlordResource, '/landlords', '/landlords/<int:id>')
api.add_resource(PropertyResource, '/properties', '/properties/<int:id>')
