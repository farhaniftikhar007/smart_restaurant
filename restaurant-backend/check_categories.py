from app.database import SessionLocal
from app.models import Category
from sqlalchemy import text

def check():
    try:
        db = SessionLocal()
        # Test connection first
        db.execute(text("SELECT 1"))
        print("Database connected.")
        
        categories = db.query(Category).all()
        print(f"Category count: {len(categories)}")
        for cat in categories:
            print(f" - {cat.id}: {cat.name}")
        db.close()
    except Exception as e:
        print(f"Error checking categories: {e}")

if __name__ == "__main__":
    check()
