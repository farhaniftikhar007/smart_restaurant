import os
from sqlalchemy import create_engine, text

# Use the value from .env directly or hardcode for testing
DATABASE_URL = "postgresql+psycopg2://postgres:12345678@127.0.0.1:5432/restaurant_db"

print(f"Testing connection to: {DATABASE_URL}")

try:
    engine = create_engine(DATABASE_URL)
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))
        print("Connection successful!")
        print(f"Result: {result.fetchone()}")
except Exception as e:
    print("Connection failed!")
    print(f"Error: {e}")
