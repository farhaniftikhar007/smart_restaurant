from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from datetime import datetime, timedelta
from app.models import Reservation

# Database connection
DATABASE_URL = "postgresql+psycopg2://postgres:postgres@localhost:5432/restaurant_db"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

db = SessionLocal()

# Clear existing reservations (optional)
db.query(Reservation).delete()

# Add test reservations
test_reservations = [
    {
        "name": "Ahmed Khan",
        "email": "ahmed@example.com",
        "phone": "+92-301-2345678",
        "date": datetime.now().date() + timedelta(days=1),
        "time": "19:00",
        "guests": 4,
        "special_requests": "Window seat preferred",
        "status": "confirmed"
    },
    {
        "name": "Fatima Ali",
        "email": "fatima@example.com",
        "phone": "+92-302-3456789",
        "date": datetime.now().date() + timedelta(days=2),
        "time": "18:30",
        "guests": 2,
        "special_requests": "Anniversary dinner",
        "status": "pending"
    },
    {
        "name": "Hassan Malik",
        "email": "hassan@example.com",
        "phone": "+92-303-4567890",
        "date": datetime.now().date() + timedelta(days=3),
        "time": "20:00",
        "guests": 6,
        "special_requests": "Birthday celebration",
        "status": "confirmed"
    },
    {
        "name": "Ayesha Raza",
        "email": "ayesha@example.com",
        "phone": "+92-304-5678901",
        "date": datetime.now().date() + timedelta(days=1),
        "time": "17:30",
        "guests": 3,
        "special_requests": None,
        "status": "pending"
    },
    {
        "name": "Bilal Ahmed",
        "email": "bilal@example.com",
        "phone": "+92-305-6789012",
        "date": datetime.now().date() + timedelta(days=5),
        "time": "21:00",
        "guests": 8,
        "special_requests": "Corporate dinner",
        "status": "confirmed"
    }
]

for res_data in test_reservations:
    reservation = Reservation(**res_data)
    db.add(reservation)

db.commit()
print(f"✅ Added {len(test_reservations)} test reservations!")

# Verify
count = db.query(Reservation).count()
print(f"📊 Total reservations in database: {count}")

db.close()
