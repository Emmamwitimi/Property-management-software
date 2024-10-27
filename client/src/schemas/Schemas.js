// validationSchemas.js
import * as Yup from 'yup';

// Tenant validation schema
export const TenantSchema = Yup.object().shape({
  tenant_name: Yup.string()
    .required('Tenant name is required')
    .min(1, 'Tenant name must be at least 1 character long')
    .max(100, 'Tenant name cannot exceed 100 characters'),
  tenant_phone_number: Yup.string()
    .required('Phone number is required')
    .length(10, 'Phone number must be exactly 10 digits'),
  house_number: Yup.string()
    .required('House number is required')
    .min(1, 'House number must be at least 1 character long')
    .max(10, 'House number cannot exceed 10 characters'),
  house_type: Yup.string()
    .required('House type is required')
    .min(1, 'House type must be at least 1 character long')
    .max(50, 'House type cannot exceed 50 characters'),
  deposit_paid: Yup.number()
    .required('Deposit paid is required')
    .min(0, 'Deposit must be at least 0'),
  payment_date: Yup.date().nullable(),
  receipt_number_deposit: Yup.string().nullable(),
  rent_amount: Yup.number()
    .required('Rent amount is required')
    .min(0, 'Rent amount must be at least 0'),
  due_date: Yup.date().nullable(),
  rent_receipt_number: Yup.string().nullable(),
  rent_paid: Yup.number().nullable().min(0, 'Rent paid must be at least 0'),
  amount_due: Yup.number()
    .required('Amount due is required')
    .min(0, 'Amount due must be at least 0'),
  property_id: Yup.number()
    .required('Property ID is required')
    .integer('Property ID must be an integer'),
});

// Landlord validation schema
export const LandlordSchema = Yup.object().shape({
  landlord_name: Yup.string()
    .required('Landlord name is required')
    .min(1, 'Landlord name must be at least 1 character long')
    .max(100, 'Landlord name cannot exceed 100 characters'),
  phone_number: Yup.string()
    .required('Phone number is required')
    .min(10, 'Phone number must be at least 10 characters long')
    .max(20, 'Phone number cannot exceed 20 characters'),
  email: Yup.string()
    .required('Email is required')
    .email('Email must be a valid email address'),
});

// Property validation schema
export const PropertySchema = Yup.object().shape({
  property_name: Yup.string()
    .required('Property name is required')
    .min(1, 'Property name must be at least 1 character long')
    .max(100, 'Property name cannot exceed 100 characters'),
  location: Yup.string()
    .required('Location is required')
    .min(1, 'Location must be at least 1 character long')
    .max(100, 'Location cannot exceed 100 characters'),
  landlord_id: Yup.number()
    .required('Landlord ID is required')
    .integer('Landlord ID must be an integer'),
  number_of_rooms: Yup.number()
    .required('Number of rooms is required')
    .integer('Number of rooms must be an integer')
    .min(1, 'Number of rooms must be at least 1'),
  is_occupied: Yup.boolean().nullable(),
  house_number: Yup.string()
    .required('House number is required')
    .min(1, 'House number must be at least 1 character long')
    .max(10, 'House number cannot exceed 10 characters'),
  occupied_rooms: Yup.number().nullable().integer('Occupied rooms must be an integer'),
  price_bedsitter: Yup.number().nullable().min(0, 'Price must be at least 0'),
  price_one_bedroom: Yup.number().nullable().min(0, 'Price must be at least 0'),
  price_two_bedroom: Yup.number().nullable().min(0, 'Price must be at least 0'),
});

// User validation schema
export const UserSchema = Yup.object().shape({
  username: Yup.string()
    .required('Username is required')
    .min(1, 'Username must be at least 1 character long')
    .max(100, 'Username cannot exceed 100 characters'),
  role: Yup.string()
    .required('Role is required')
    .oneOf(['admin', 'user'], 'Role must be either admin or user'),
});
