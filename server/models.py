from database import db, bcrypt
from datetime import datetime
from sqlalchemy.orm import validates
from flask_login import UserMixin

class Tenant(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    tenant_name = db.Column(db.String(100), nullable=False)
    tenant_phone_number = db.Column(db.String(20), nullable=False, unique=True)
    house_number = db.Column(db.String(10), nullable=False)
    house_type = db.Column(db.String(50), nullable=False)
    deposit_paid = db.Column(db.Float, nullable=False)
    payment_date = db.Column(db.DateTime, default=datetime.utcnow)
    receipt_number_deposit = db.Column(db.String(100), nullable=True, unique=True)
    rent_amount = db.Column(db.Float, nullable=False)
    due_date = db.Column(db.DateTime, default=lambda: datetime.utcnow().replace(day=5))
    rent_receipt_number = db.Column(db.String(100), nullable=True, unique=True)

    # Relationship to Property
    property_id = db.Column(db.Integer, db.ForeignKey('property.id'), nullable=False)
    property = db.relationship('Property', back_populates='tenants')

    rent_paid = db.Column(db.Float, nullable=True)
    amount_due = db.Column(db.Float, nullable=False)

    def to_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

    @validates('tenant_phone_number')
    def validate_phone(self, key, phone):
        if len(phone) != 10:
            raise ValueError("Phone number must be 10 digits long.")
        return phone


class Landlord(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    landlord_name = db.Column(db.String(100), nullable=False)
    phone_number = db.Column(db.String(20), nullable=False, unique=True)
    email = db.Column(db.String(120), nullable=False, unique=True)

    # Relationship to Properties with cascading delete behavior
    properties_owned = db.relationship('Property', back_populates='landlord', lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        # Adjusted to include properties_owned in serialized output
        landlord_dict = {c.name: getattr(self, c.name) for c in self.__table__.columns}
        landlord_dict['properties_owned'] = [property.to_dict() for property in self.properties_owned]
        return landlord_dict


class Property(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    property_name = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(100), nullable=False)
    landlord_id = db.Column(db.Integer, db.ForeignKey('landlord.id'), nullable=False)
    number_of_rooms = db.Column(db.Integer, nullable=False)
    is_occupied = db.Column(db.Boolean, default=False)
    house_number = db.Column(db.String(10), nullable=False)
    occupied_rooms = db.Column(db.Integer, nullable=False, default=0)
    price_bedsitter = db.Column(db.Float, nullable=True)
    price_one_bedroom = db.Column(db.Float, nullable=True)
    price_two_bedroom = db.Column(db.Float, nullable=True)

    # Relationship to Tenants
    tenants = db.relationship('Tenant', back_populates='property', lazy=True, cascade="all, delete-orphan")

    # Relationship to Landlord
    landlord = db.relationship('Landlord', back_populates='properties_owned')

    def to_dict(self):
        # Adjusted to include tenants in serialized output
        property_dict = {c.name: getattr(self, c.name) for c in self.__table__.columns}
        property_dict['tenants'] = [tenant.to_dict() for tenant in self.tenants]
        return property_dict


class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(10), nullable=False, default='user')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)

    def is_admin(self):
        return self.role == 'admin'
