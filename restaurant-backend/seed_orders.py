from app.database import SessionLocal, engine
from app.models import Order, OrderItem, MenuItem, User, OrderStatus
from datetime import datetime, timedelta
import random

def seed_orders():
    db = SessionLocal()
    try:
        print("Seeding past orders for analytics...")
        
        # Get users and menu items
        customer = db.query(User).filter(User.email == "customer@test.com").first()
        menu_items = db.query(MenuItem).all()
        
        if not customer:
            print("Customer not found. Run seed_data.py first.")
            return
        if not menu_items:
            print("No menu items found. Run seed_data.py first.")
            return

        # Generate orders for last 30 days
        end_date = datetime.now()
        start_date = end_date - timedelta(days=30)
        
        orders_to_create = []
        
        # Create about 50 fake orders distributed over 30 days
        for _ in range(50):
            # Random date between start and end
            days_offset = random.randint(0, 30)
            order_date = end_date - timedelta(days=days_offset)
            
            # Random items
            num_items = random.randint(1, 4)
            selected_items = random.sample(menu_items, num_items)
            
            total_amount = 0
            order_items = []
            
            for item in selected_items:
                qty = random.randint(1, 2)
                price = item.price
                total_amount += price * qty
                order_items.append({
                    "menu_item_id": item.id,
                    "quantity": qty,
                    "price": price
                })
            
            # Create Order
            order = Order(
                order_number=f"ORD-{order_date.strftime('%Y%m%d')}-{random.randint(1000, 9999)}",
                customer_id=customer.id,
                table_number=str(random.randint(1, 10)),
                status=OrderStatus.DELIVERED,
                total_amount=total_amount,
                created_at=order_date,
                updated_at=order_date
            )
            db.add(order)
            db.flush() # get ID
            
            # Create OrderItems
            for item_data in order_items:
                oi = OrderItem(
                    order_id=order.id,
                    menu_item_id=item_data["menu_item_id"],
                    quantity=item_data["quantity"],
                    price=item_data["price"]
                )
                db.add(oi)
                
        db.commit()
        print("Successfully seeded 50 past orders!")
        
    except Exception as e:
        print(f"Error seeding orders: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_orders()
