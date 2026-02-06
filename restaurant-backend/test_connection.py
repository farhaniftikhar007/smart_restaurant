from sqlalchemy import create_engine, text

DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/restaurant_db"

print(f"Testing connection to: {DATABASE_URL}")

try:
    engine = create_engine(DATABASE_URL)
    with engine.connect() as conn:
        result = conn.execute(text("SELECT version()"))
        version = result.fetchone()[0]
        print(f"✅ Connected successfully!")
        print(f"PostgreSQL version: {version}")
except Exception as e:
    print(f"❌ Connection failed: {e}")
    print("\nTroubleshooting:")
    print("1. Is PostgreSQL running? sudo systemctl status postgresql")
    print("2. Does database exist? sudo -u postgres psql -l")
    print("3. Are credentials correct? Check username/password")
    print("4. Try: sudo -u postgres createdb restaurant_db")
