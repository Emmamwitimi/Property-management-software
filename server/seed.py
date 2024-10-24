import random
from faker import Faker
from database import db
from models import Tenant, Landlord, Property
from app import app

fake = Faker()

# Generate a valid 10-digit phone number
def generate_phone_number():
    return fake.numerify('07########')  # Kenyan phone number format

# Create landlords with a random phone number and email
def create_landlords(num_landlords=4):
    landlords = []
    for _ in range(num_landlords):
        landlord = Landlord(
            landlord_name=fake.name(),
            phone_number=generate_phone_number(),
            email=fake.unique.email()  # Generate a unique email
        )
        db.session.add(landlord)
        landlords.append(landlord)
    db.session.commit()  # Commit after adding all landlords
    return landlords

# Create properties for the landlords with room details and prices
def create_properties(landlords, num_properties=20):
    properties = []
    for _ in range(num_properties):
        landlord = random.choice(landlords)
        total_rooms = random.randint(5, 50)  # Number of rooms between 5 and 50
        occupied_rooms = random.randint(0, total_rooms)  # Ensure occupied_rooms <= total_rooms

        property = Property(
            property_name=fake.company() + " Apartments",
            location=fake.address(),
            landlord_id=landlord.id,
            number_of_rooms=total_rooms,
            is_occupied=occupied_rooms > 0,  # If there's at least one room occupied, mark as occupied
            price_bedsitter=round(random.uniform(5000, 10000), 2),  # Random price for bedsitter
            price_one_bedroom=round(random.uniform(10000, 15000), 2),  # Random price for 1BHK
            price_two_bedroom=round(random.uniform(15000, 25000), 2),  # Random price for 2BHK
            occupied_rooms=occupied_rooms,
            house_number=fake.building_number()  # Ensure house_number is set
        )
        db.session.add(property)
        properties.append(property)
    db.session.commit()  # Commit after adding all properties
    return properties

# Create tenants and ensure each one is associated with a property
def create_tenants(properties, num_tenants=30):
    tenants = []
    for _ in range(num_tenants):
        property = random.choice(properties)
        deposit_paid = round(random.uniform(1000, 5000), 2)
        rent_amount = round(random.uniform(5000, 15000), 2)
        rent_paid = round(random.uniform(0, rent_amount), 2)
        tenant = Tenant(
            tenant_name=fake.name(),
            tenant_phone_number=generate_phone_number(),
            house_number=fake.building_number(),
            house_type=random.choice(["Bedsitter", "1BHK", "2BHK"]),
            deposit_paid=deposit_paid,
            receipt_number_deposit=fake.uuid4(),
            rent_amount=rent_amount,
            rent_paid=rent_paid,
            amount_due=rent_amount - rent_paid,  # Calculate amount due
            rent_receipt_number=fake.uuid4(),
            property_id=property.id  # Associate tenant with property
        )
        db.session.add(tenant)
        tenants.append(tenant)
    db.session.commit()  # Commit after adding all tenants
    return tenants

# Main function to generate fake data and print IDs
def main():
    with app.app_context():
        print("Creating fake data...")

        # Create landlords
        landlords = create_landlords()
        print(f"Created {len(landlords)} landlords.")
        for landlord in landlords:
            print(f"Landlord ID: {landlord.id}, Name: {landlord.landlord_name}")

        # Create properties
        properties = create_properties(landlords)
        print(f"Created {len(properties)} properties.")
        for property in properties:
            print(f"Property ID: {property.id}, Name: {property.property_name}, Landlord ID: {property.landlord_id}")

        # Create tenants
        tenants = create_tenants(properties)
        print(f"Created {len(tenants)} tenants.")
        for tenant in tenants:
            print(f"Tenant ID: {tenant.id}, Name: {tenant.tenant_name}, Property ID: {tenant.property_id}")

        print("Data population complete!")

if __name__ == '__main__':
    main()
