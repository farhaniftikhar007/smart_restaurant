from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from typing import List, Dict, Any
import pandas as pd
from datetime import datetime, timedelta

from app.database import get_db
from app.models import Order, OrderItem, MenuItem, User, OrderStatus

router = APIRouter(
    tags=["analytics"]
)

@router.get("/dashboard-stats")
def get_dashboard_stats(db: Session = Depends(get_db)):
    total_orders = db.query(Order).count()
    total_revenue = db.query(func.sum(Order.total_amount)).scalar() or 0.0
    total_customers = db.query(User).filter(User.role == "customer").count()
    
    return {
        "total_orders": total_orders,
        "total_revenue": round(total_revenue, 2),
        "total_customers": total_customers
    }

@router.get("/sales-trends")
def get_sales_trends(days: int = 30, db: Session = Depends(get_db)):
    # Get orders from last N days
    since_date = datetime.now() - timedelta(days=days)
    orders = db.query(Order).filter(Order.created_at >= since_date).all()
    
    if not orders:
        return []
        
    # Convert to dataframe
    data = [{"date": o.created_at.date(), "amount": o.total_amount} for o in orders]
    
    if not data:
        return []

    df = pd.DataFrame(data)
    
    # Group by date
    daily_sales = df.groupby("date")["amount"].sum().reset_index()
    daily_sales["date"] = daily_sales["date"].astype(str)
    
    return daily_sales.to_dict(orient="records")

@router.get("/top-selling")
def get_top_selling(limit: int = 5, db: Session = Depends(get_db)):
    results = db.query(
        MenuItem.name,
        func.sum(OrderItem.quantity).label("total_sold")
    ).join(OrderItem).group_by(MenuItem.id).order_by(desc("total_sold")).limit(limit).all()
    
    return [{"name": name, "value": total_sold} for name, total_sold in results]

@router.get("/recommendations/user/{user_id}")
def get_user_recommendations(user_id: int, db: Session = Depends(get_db)):
    """
    Get personalized recommendations for a user based on their order history.
    1. Identify user's favorite category (most ordered).
    2. Recommend items from that category.
    3. Fallback to global top-sellers if no history.
    """
    # 1. Find user's past orders
    user_orders = db.query(Order.id).filter(Order.customer_id == user_id).all()
    
    if not user_orders:
        # Fallback: Global top sellers
        return db.query(MenuItem).join(OrderItem).group_by(MenuItem.id).order_by(func.count(OrderItem.id).desc()).limit(5).all()

    order_ids = [o.id for o in user_orders]

    # 2. Find favorite category
    favorite_category = db.query(
        MenuItem.category_id,
        func.count(OrderItem.id).label('count')
    ).join(OrderItem).filter(
        OrderItem.order_id.in_(order_ids)
    ).group_by(MenuItem.category_id).order_by(desc('count')).first()

    if favorite_category:
        cat_id = favorite_category.category_id
        # Recommend top rated available items from this category, excluding what they already bought? 
        # For simplicity, suggest items from this category sorted by popularity
        results = db.query(MenuItem).filter(
            MenuItem.category_id == cat_id,
            MenuItem.is_available == True
        ).limit(5).all()
        
        if results:
            return results

    # Fallback
    results = db.query(MenuItem).join(OrderItem).group_by(MenuItem.id).order_by(func.count(OrderItem.id).desc()).limit(5).all()
    return results

@router.get("/recommendations/item/{item_id}")
def get_item_recommendations(item_id: int, db: Session = Depends(get_db)):
    """
    Get items frequently bought with the given item_id.
    """
    # Find orders containing this item
    subquery = db.query(OrderItem.order_id).filter(OrderItem.menu_item_id == item_id).scalar_subquery()
    
    # Find other items in those orders
    results = db.query(
        MenuItem
    ).join(OrderItem).filter(
        OrderItem.order_id.in_(subquery),
        OrderItem.menu_item_id != item_id
    ).group_by(MenuItem.id).order_by(func.count(OrderItem.menu_item_id).desc()).limit(3).all()
    
    # Fallback to top selling if no associations found
    if not results:
        results = db.query(MenuItem).join(OrderItem).group_by(MenuItem.id).order_by(func.count(OrderItem.id).desc()).limit(3).all()

    return results

@router.get("/least-selling")
def get_least_selling(limit: int = 5, db: Session = Depends(get_db)):
    """Get items with the lowest sales volume."""
    # Subquery to get total sold per item
    sold_subquery = db.query(
        OrderItem.menu_item_id,
        func.sum(OrderItem.quantity).label("total_sold")
    ).group_by(OrderItem.menu_item_id).subquery()

    # Left join with all menu items to find those with 0 or low sales
    results = db.query(
        MenuItem.name,
        func.coalesce(sold_subquery.c.total_sold, 0).label("total_sold")
    ).outerjoin(
        sold_subquery, MenuItem.id == sold_subquery.c.menu_item_id
    ).filter(
        MenuItem.is_available == True
    ).order_by("total_sold").limit(limit).all()
    
    return [{"name": name, "value": total_sold} for name, total_sold in results]

@router.get("/peak-hours")
def get_peak_hours(db: Session = Depends(get_db)):
    """Analyze orders to find busiest hours of the day."""
    # Extract hour from created_at
    # PostgreSQL specific function 'extract'
    results = db.query(
        func.extract('hour', Order.created_at).label('hour'),
        func.count(Order.id).label('count')
    ).group_by('hour').order_by(desc('count')).limit(5).all()
    
    return [{"hour": int(h), "count": c} for h, c in results]

@router.get("/insights")
def get_ai_insights(db: Session = Depends(get_db)):
    """Generate textual actionable insights."""
    insights = []
    
    # 1. Check for dead stock (0 sales)
    dead_stock = db.query(MenuItem).outerjoin(OrderItem).group_by(MenuItem.id).having(func.count(OrderItem.id) == 0).limit(3).all()
    if dead_stock:
        names = ", ".join([i.name for i in dead_stock])
        insights.append({
            "type": "warning",
            "message": f"Dead Stock Alert: '{names}' have determined 0 sales. Consider removing or promoting them."
        })
        
    # 2. Check Peak Hours
    peak = db.query(
        func.extract('hour', Order.created_at).label('hour'),
        func.count(Order.id).label('count')
    ).group_by('hour').order_by(desc('count')).first()
    
    if peak:
        hour = int(peak[0])
        insights.append({
            "type": "info",
            "message": f"Peak Business Hour: The busiest time is {hour}:00 - {hour+1}:00. Ensure distinct staffing levels."
        })
        
    # 3. Revenue Trend
    today = datetime.now().date()
    yesterday = today - timedelta(days=1)
    
    rev_today = db.query(func.sum(Order.total_amount)).filter(func.date(Order.created_at) == today).scalar() or 0
    rev_yesterday = db.query(func.sum(Order.total_amount)).filter(func.date(Order.created_at) == yesterday).scalar() or 0
    
    if rev_today > rev_yesterday and rev_yesterday > 0:
        growth = ((rev_today - rev_yesterday) / rev_yesterday) * 100
        insights.append({
            "type": "success",
            "message": f"Revenue Growth: Sales are up {growth:.1f}% compared to yesterday!"
        })
        
    return insights
