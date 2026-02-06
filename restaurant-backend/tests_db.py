# test_db.py
from app.config import settings
from sqlalchemy import create_engine, text

print(f"Testing connection to: {settings.DATABASE_URL}")

try:
    engine = create_engine(settings.DATABASE_URL)
    with engine.connect() as conn:
        result = conn.execute(text("SELECT version()"))
        print("✅ Database connection successful!")
        print(f"PostgreSQL version: {result.fetchone()[0]}")
except Exception as e:
    print(f"❌ Database connection failed: {e}")
