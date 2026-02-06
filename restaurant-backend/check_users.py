from app.database import SessionLocal
from app.models import User
from sqlalchemy import text

def check():
    try:
        db = SessionLocal()
        # Test connection first
        db.execute(text("SELECT 1"))
        print("Database connected.")
        
        users = db.query(User).all()
        print(f"User count: {len(users)}")
        for user in users:
            print(f" - {user.email} ({user.role})")
        db.close()
    except Exception as e:
        print(f"Error checking users: {e}")

if __name__ == "__main__":
    check()
