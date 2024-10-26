from marshmallow import Schema, fields, validate

# Tenant schema for input validation and serialization
class TenantSchema(Schema):
    id = fields.Int(dump_only=True)
    tenant_name = fields.String(required=True, validate=validate.Length(min=1, max=100))
    tenant_phone_number = fields.String(required=True, validate=validate.Length(min=10, max=10))  # Assuming 10-digit numbers
    house_number = fields.String(required=True, validate=validate.Length(min=1, max=10))
    house_type = fields.String(required=True, validate=validate.Length(min=1, max=50))
    deposit_paid = fields.Float(required=True)
    payment_date = fields.DateTime(dump_only=True)
    receipt_number_deposit = fields.String(dump_only=True)  # Generated, hence dump_only
    rent_amount = fields.Float(required=True)
    due_date = fields.DateTime(dump_only=True)  # Automatically set, hence dump_only
    rent_receipt_number = fields.String(dump_only=True)
    rent_paid = fields.Float()
    amount_due = fields.Float(required=True)

    # Relationship to Property
    property_id = fields.Int(required=True)
    property = fields.Nested('PropertySchema', only=("property_name", "location"), dump_only=True)  # Display basic info only

# Landlord schema
class LandlordSchema(Schema):
    id = fields.Int(dump_only=True)
    landlord_name = fields.String(required=True, validate=validate.Length(min=1, max=100))
    phone_number = fields.String(required=True, validate=validate.Length(min=10, max=20))
    email = fields.String(required=True, validate=validate.Email())

    # Relationship to Properties
    properties_owned = fields.Nested('PropertySchema', many=True, only=("id", "property_name"), dump_only=True)

# Property schema
class PropertySchema(Schema):
    id = fields.Int(dump_only=True)  # ID should remain dump_only
    property_name = fields.String(required=True, validate=validate.Length(min=1, max=100))
    location = fields.String(required=True, validate=validate.Length(min=1, max=100))
    landlord_id = fields.Int(required=True)
    number_of_rooms = fields.Int(required=True)
    is_occupied = fields.Boolean()  # Remove dump_only to allow updates
    house_number = fields.String(required=True, validate=validate.Length(min=1, max=10))
    occupied_rooms = fields.Int()  # Remove dump_only to allow updates
    price_bedsitter = fields.Float()
    price_one_bedroom = fields.Float()
    price_two_bedroom = fields.Float()
    # Relationship to Tenants
    tenants = fields.Nested('TenantSchema', many=True, only=("id", "tenant_name", "house_number"), dump_only=True)

    # Relationship to Landlord
    landlord = fields.Nested('LandlordSchema', only=("id", "landlord_name"), dump_only=True)
# User schema for admin and user data
class UserSchema(Schema):
    id = fields.Int(dump_only=True)
    username = fields.String(required=True, validate=validate.Length(min=1, max=100))
    role = fields.String(validate=validate.OneOf(["admin", "user"]))
    created_at = fields.DateTime(dump_only=True)