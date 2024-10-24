from marshmallow import Schema, fields, validate

# Tenant schema for input validation and serialization
class TenantSchema(Schema):
    id = fields.Int(dump_only=True)  # Include ID field, dump_only to indicate it’s generated
    tenant_name = fields.String(required=True, validate=validate.Length(min=1, max=100))
    tenant_phone_number = fields.String(required=True, validate=validate.Length(min=1, max=20))
    house_number = fields.String(required=True, validate=validate.Length(min=1, max=10))
    house_type = fields.String(required=True, validate=validate.Length(min=1, max=50))
    property_name = fields.String(required=True, validate=validate.Length(min=1, max=100))
    deposit_paid = fields.Float(required=True)
    rent_amount = fields.Float(required=True)

# Landlord schema
class LandlordSchema(Schema):
    id = fields.Int(dump_only=True)  # Include ID field
    landlord_name = fields.String(required=True, validate=validate.Length(min=1, max=100))
    phone_number = fields.String(required=True, validate=validate.Length(min=1, max=20))

# Property schema
class PropertySchema(Schema):
    id = fields.Int(dump_only=True)  # Include ID field
    property_name = fields.String(required=True, validate=validate.Length(min=1, max=100))
    location = fields.String(required=True, validate=validate.Length(min=1, max=100))
    landlord_id = fields.Integer(required=True)
    house_number = fields.String(required=True, validate=validate.Length(min=1, max=10))
