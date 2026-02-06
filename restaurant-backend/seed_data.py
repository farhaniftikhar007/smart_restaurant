from app.database import SessionLocal, engine, Base
from app.models import User
from app.utils.auth import get_password_hash
import traceback
import sys

def seed_db():
    print("Starting seed process...")
    db = SessionLocal()
    try:
        # Create tables
        print("Creating tables...")
        Base.metadata.create_all(bind=engine)
        print("Tables created (or exist).")

        # --- USERS ---
        # Admin
        print("Checking for Admin...")
        admin = db.query(User).filter(User.email == "admin@restaurant.com").first()
        if not admin:
            print("Creating Admin user...")
            admin_user = User(
                email="admin@restaurant.com",
                username="admin",
                full_name="System Admin",
                phone="1234567890",
                hashed_password=get_password_hash("admin123"),
                role="admin",
                is_active=True
            )
            db.add(admin_user)
            db.commit()
            print("Admin user created.")
        
        # Customer
        customer = db.query(User).filter(User.email == "customer@test.com").first()
        if not customer:
            print("Creating Customer user...")
            customer_user = User(
                email="customer@test.com",
                username="customer",
                full_name="Test Customer",
                phone="0987654321",
                hashed_password=get_password_hash("customer123"),
                role="customer",
                is_active=True
            )
            db.add(customer_user)
            db.commit()
            print("Customer user created.")

        # --- CATEGORIES ---
        from app.models import Category
        
        categories_data = [
            {"name": "Appetizers", "description": "Starters to whet your appetite", "image_url": "https://source.unsplash.com/random/300x200?appetizer"},
            {"name": "Main Course", "description": "Hearty main dishes", "image_url": "https://source.unsplash.com/random/300x200?dinner"},
            {"name": "Desserts", "description": "Sweet treats", "image_url": "https://source.unsplash.com/random/300x200?dessert"},
            {"name": "Beverages", "description": "Refreshing drinks", "image_url": "https://source.unsplash.com/random/300x200?drink"},
        ]

        for cat_data in categories_data:
            cat = db.query(Category).filter(Category.name == cat_data["name"]).first()
            if not cat:
                print(f"Creating category: {cat_data['name']}")
                new_cat = Category(
                    name=cat_data["name"],
                    description=cat_data["description"],
                    image_url=cat_data["image_url"],
                    is_active=True
                )
                db.add(new_cat)
                db.commit() # Commit each to get ID for items
            else:
                print(f"Category {cat_data['name']} exists.")

        # --- MENU ITEMS ---
        from app.models import MenuItem
        
        # Get category IDs
        appetizers = db.query(Category).filter(Category.name == "Appetizers").first()
        main_course = db.query(Category).filter(Category.name == "Main Course").first()
        
        if appetizers:
            items_data = [
                {"name": "Spring Rolls", "price": 5.99, "category_id": appetizers.id, "description": "Crispy veggie rolls"},
                {"name": "Garlic Bread", "price": 4.50, "category_id": appetizers.id, "description": "Toasted with herbs"},
            ]
            for item in items_data:
                exists = db.query(MenuItem).filter(MenuItem.name == item["name"]).first()
                if not exists:
                    print(f"Creating menu item: {item['name']}")
                    new_item = MenuItem(
                        name=item["name"],
                        price=item["price"],
                        description=item["description"],
                        category_id=item["category_id"],
                        is_available=True
                    )
                    db.add(new_item)
            db.commit()

        if main_course:
            items_data = [
                {"name": "Cheese Burger", "price": 12.99, "category_id": main_course.id, "description": "Juicy beef burger"},
                {"name": "Pasta Alfredo", "price": 14.50, "category_id": main_course.id, "description": "Creamy white sauce pasta"},
            ]
            for item in items_data:
                exists = db.query(MenuItem).filter(MenuItem.name == item["name"]).first()
                if not exists:
                    print(f"Creating menu item: {item['name']}")
                    new_item = MenuItem(
                        name=item["name"],
                        price=item["price"],
                        description=item["description"],
                        category_id=item["category_id"],
                        is_available=True
                    )
                    db.add(new_item)
            db.commit()
            
    except Exception as e:
        print("ERROR OCCURRED:")
        print(e)
        traceback.print_exc()
        with open("seed_error.txt", "w") as f:
            f.write(str(e) + "\n" + traceback.format_exc())
        db.rollback()
    finally:
        db.close()
        print("Seed process finished.")

if __name__ == "__main__":
    seed_db()
