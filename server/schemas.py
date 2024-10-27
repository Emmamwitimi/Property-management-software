# from marshmallow import Schema, fields, validate

# # Tenant schema for input validation and serialization
# class TenantSchema(Schema):
#     id = fields.Int(dump_only=True)
#     tenant_name = fields.String(required=True, validate=validate.Length(min=1, max=100))
#     tenant_phone_number = fields.String(required=True, validate=validate.Length(min=10, max=10))  # Assuming 10-digit numbers
#     house_number = fields.String(required=True, validate=validate.Length(min=1, max=10))
#     house_type = fields.String(required=True, validate=validate.Length(min=1, max=50))
#     deposit_paid = fields.Float(required=True)
#     payment_date = fields.DateTime(dump_only=True)
#     receipt_number_deposit = fields.String(dump_only=True)  # Generated, hence dump_only
#     rent_amount = fields.Float(required=True)
#     due_date = fields.DateTime(dump_only=True)  # Automatically set, hence dump_only
#     rent_receipt_number = fields.String(dump_only=True)
#     rent_paid = fields.Float()
#     amount_due = fields.Float(required=True)

#     # Relationship to Property
#     property_id = fields.Int(required=True)
#     property = fields.Nested('PropertySchema', only=("property_name", "location"), dump_only=True)  # Display basic info only

# # Landlord schema
# class LandlordSchema(Schema):
#     id = fields.Int(dump_only=True)
#     landlord_name = fields.String(required=True, validate=validate.Length(min=1, max=100))
#     phone_number = fields.String(required=True, validate=validate.Length(min=10, max=20))
#     email = fields.String(required=True, validate=validate.Email())

#     # Relationship to Properties
#     properties_owned = fields.Nested('PropertySchema', many=True, only=("id", "property_name"), dump_only=True)

# # Property schema
# class PropertySchema(Schema):
#     id = fields.Int(dump_only=True)  # ID should remain dump_only
#     property_name = fields.String(required=True, validate=validate.Length(min=1, max=100))
#     location = fields.String(required=True, validate=validate.Length(min=1, max=100))
#     landlord_id = fields.Int(required=True)
#     number_of_rooms = fields.Int(required=True)
#     is_occupied = fields.Boolean()  # Remove dump_only to allow updates
#     house_number = fields.String(required=True, validate=validate.Length(min=1, max=10))
#     occupied_rooms = fields.Int()  # Remove dump_only to allow updates
#     price_bedsitter = fields.Float()
#     price_one_bedroom = fields.Float()
#     price_two_bedroom = fields.Float()
#     # Relationship to Tenants
#     tenants = fields.Nested('TenantSchema', many=True, only=("id", "tenant_name", "house_number"), dump_only=True)

#     # Relationship to Landlord
#     landlord = fields.Nested('LandlordSchema', only=("id", "landlord_name"), dump_only=True)
# # User schema for admin and user data
# class UserSchema(Schema):
#     id = fields.Int(dump_only=True)
#     username = fields.String(required=True, validate=validate.Length(min=1, max=100))
#     role = fields.String(validate=validate.OneOf(["admin", "user"]))
#     created_at = fields.DateTime(dump_only=True)

# from marshmallow import Schema, fields, validate

# # Tenant schema for input validation and serialization
# class TenantSchema(Schema):
#     id = fields.Int(dump_only=True)
#     tenant_name = fields.String(required=True, validate=validate.Length(min=1, max=100))
#     tenant_phone_number = fields.String(required=True, validate=validate.Length(equal=10))  # 10-digit numbers
#     house_number = fields.String(required=True, validate=validate.Length(min=1, max=10))
#     house_type = fields.String(required=True, validate=validate.Length(min=1, max=50))
#     deposit_paid = fields.Float(required=True)
#     payment_date = fields.DateTime(dump_only=True)
#     receipt_number_deposit = fields.String(dump_only=True)  # Generated, hence dump_only
#     rent_amount = fields.Float(required=True)
#     due_date = fields.DateTime(dump_only=True)  # Automatically set, hence dump_only
#     rent_receipt_number = fields.String(dump_only=True)
#     rent_paid = fields.Float()
#     amount_due = fields.Float(required=True)
#     property_id = fields.Int(required=True)

#     # Nested relationship to Property
#     property = fields.Nested('PropertySchema', only=("property_name", "location"), dump_only=True)

# # Landlord schema
# class LandlordSchema(Schema):
#     id = fields.Int(dump_only=True)
#     landlord_name = fields.String(required=True, validate=validate.Length(min=1, max=100))
#     phone_number = fields.String(required=True, validate=validate.Length(min=10, max=20))
#     email = fields.String(required=True, validate=validate.Email())

#     # Nested relationship to Properties
#     properties_owned = fields.Nested('PropertySchema', many=True, only=("id", "property_name"), dump_only=True)

# # Property schema
# class PropertySchema(Schema):
#     id = fields.Int(dump_only=True)
#     property_name = fields.String(required=True, validate=validate.Length(min=1, max=100))
#     location = fields.String(required=True, validate=validate.Length(min=1, max=100))
#     landlord_id = fields.Int(required=True)
#     number_of_rooms = fields.Int(required=True)
#     is_occupied = fields.Boolean()
#     house_number = fields.String(required=True, validate=validate.Length(min=1, max=10))
#     occupied_rooms = fields.Int()
#     price_bedsitter = fields.Float()
#     price_one_bedroom = fields.Float()
#     price_two_bedroom = fields.Float()

#     # Nested relationships
#     tenants = fields.Nested('TenantSchema', many=True, only=("id", "tenant_name", "house_number"), dump_only=True)
#     landlord = fields.Nested('LandlordSchema', only=("id", "landlord_name"), dump_only=True)

# # User schema for admin and user data
# class UserSchema(Schema):
#     id = fields.Int(dump_only=True)
#     username = fields.String(required=True, validate=validate.Length(min=1, max=100))
#     role = fields.String(validate=validate.OneOf(["admin", "user"]))
#     created_at = fields.DateTime(dump_only=True)

from marshmallow import Schema, fields, validate

# Tenant schema for input validation and serialization
class TenantSchema(Schema):
    id = fields.Int(dump_only=True)
    tenant_name = fields.String(validate=validate.Length(min=1, max=100), required=False)  # Optional
    tenant_phone_number = fields.String(validate=validate.Length(equal=10), required=False)  # Optional
    house_number = fields.String(validate=validate.Length(min=1, max=10), required=False)  # Optional
    house_type = fields.String(validate=validate.Length(min=1, max=50), required=False)  # Optional
    deposit_paid = fields.Float(required=False)  # Optional
    payment_date = fields.DateTime(dump_only=True)  # Automatically set, hence dump_only
    receipt_number_deposit = fields.String(dump_only=True)  # Generated, hence dump_only
    rent_amount = fields.Float(required=False)  # Optional
    due_date = fields.DateTime(dump_only=True)  # Automatically set, hence dump_only
    rent_receipt_number = fields.String(dump_only=True)  # Generated, hence dump_only
    rent_paid = fields.Float(required=False)  # Optional
    amount_due = fields.Float(required=True)  # Still required
    property_id = fields.Int(required=True)  # Still required

    # Nested relationship to Property
    property = fields.Nested('PropertySchema', only=("property_name", "location"), dump_only=True)


# Landlord schema
class LandlordSchema(Schema):
    id = fields.Int(dump_only=True)
    landlord_name = fields.String(validate=validate.Length(min=1, max=100), required=False)  # Optional
    phone_number = fields.String(validate=validate.Length(min=10, max=20), required=False)  # Optional
    email = fields.String(validate=validate.Email(), required=False)  # Optional

    # Nested relationship to Properties
    properties_owned = fields.Nested('PropertySchema', many=True, only=("id", "property_name"), dump_only=True)


# Property schema
class PropertySchema(Schema):
    id = fields.Int(dump_only=True)
    property_name = fields.String(validate=validate.Length(min=1, max=100), required=False)  # Optional
    location = fields.String(validate=validate.Length(min=1, max=100), required=False)  # Optional
    landlord_id = fields.Int(required=True)  # Still required
    number_of_rooms = fields.Int(required=False)  # Optional
    is_occupied = fields.Boolean(required=False)  # Optional
    house_number = fields.String(validate=validate.Length(min=1, max=10), required=False)  # Optional
    occupied_rooms = fields.Int(required=False)  # Optional
    price_bedsitter = fields.Float(required=False)  # Optional
    price_one_bedroom = fields.Float(required=False)  # Optional
    price_two_bedroom = fields.Float(required=False)  # Optional

    # Nested relationships
    tenants = fields.Nested('TenantSchema', many=True, only=("id", "tenant_name", "house_number"), dump_only=True)
    landlord = fields.Nested('LandlordSchema', only=("id", "landlord_name"), dump_only=True)


# User schema for admin and user data
class UserSchema(Schema):
    id = fields.Int(dump_only=True)
    username = fields.String(validate=validate.Length(min=1, max=100), required=False)  # Optional
    password_hash = fields.String(dump_only=True)  # Keep it as dump_only
    role = fields.String(validate=validate.OneOf(["admin", "user"]), required=False)  # Optional
    created_at = fields.DateTime(dump_only=True)  # Automatically set, hence dump_only

