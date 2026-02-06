import os
import sys

# Set environment variable for database
os.environ.setdefault('DATABASE_URL', 'postgresql://postgres:postgres@localhost:5432/restaurant_db')

# Add current directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

print("Current directory:", os.getcwd())
print("Python version:", sys.version)
print("Python path:", sys.path[:3])

try:
    print("\n1. Importing SQLAlchemy...")
    from sqlalchemy import create_engine
    from sqlalchemy.orm import sessionmaker, Session
    print("✅ SQLAlchemy imported")
    
    print("\n2. Importing app modules...")
    from app.database import Base, engine, SessionLocal
    print("✅ Database imported")
    
    from app.models import User, Category, MenuItem, Restaurant, UserRole
    print("✅ Models imported")
    
    from app.utils.auth import get_password_hash
    print("✅ Auth utils imported")
    
    print("\n✅ All imports successful!")
    print("\nNow creating database tables...")
    
    Base.metadata.create_all(bind=engine)
    print("✅ Tables created!")
    
    db = SessionLocal()
    
    # Create admin user
    admin = User(
        email="admin@restaurant.com",
        username="admin",
        full_name="Admin User",
        hashed_password=get_password_hash("admin123"),
        role=UserRole.ADMIN,
        is_active=True
    )
    db.add(admin)
    db.commit()
    print("✅ Admin user created!")
    print("\nLogin with: admin@restaurant.com / admin123")
    
    db.close()
    
except ImportError as e:
    print(f"\n❌ Import failed: {e}")
    print("\nChecklist:")
    print("1. Are you in the restaurant-backend directory?")
    print("2. Does app/__init__.py exist?")
    print("3. Did you install requirements? pip install -r requirements.txt")
    print("4. Is PostgreSQL running?")
    sys.exit(1)
except Exception as e:
    print(f"\n❌ Error: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
