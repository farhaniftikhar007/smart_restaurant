import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
# app/routers/orders.py
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy.orm import joinedload
from typing import List, Optional
from datetime import datetime
import random
import string

from app.database import get_db
from app.utils.auth import get_current_active_user
from app.models import Order, OrderItem, MenuItem, User, OrderStatus
from app.schemas import OrderCreate, OrderResponse, OrderStatusUpdate
from app.utils.auth import get_current_active_user, get_admin_user, get_current_user
from app.websocket import manager

router = APIRouter()


def generate_order_number() -> str:
    """Generate a unique order number."""
    timestamp = datetime.now().strftime("%Y%m%d")
    random_part = ''.join(random.choices(string.digits, k=4))
    return f"ORD-{timestamp}-{random_part}"


@router.post("", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
async def create_order(
    order_data: OrderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Create a new order."""
    if not order_data.items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Order must contain at least one item"
        )
    
    # Calculate total and validate items
    total_amount = 0.0
    order_items_data = []
    
    for item_data in order_data.items:
        menu_item = db.query(MenuItem).filter(MenuItem.id == item_data.menu_item_id).first()
        if not menu_item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Menu item with ID {item_data.menu_item_id} not found"
            )
        if not menu_item.is_available:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Menu item '{menu_item.name}' is not available"
            )
        
        item_total = menu_item.price * item_data.quantity
        total_amount += item_total
        
        order_items_data.append({
            "menu_item_id": menu_item.id,
            "quantity": item_data.quantity,
            "price": menu_item.price,
            "special_instructions": item_data.special_instructions
        })
    
    # Create order
    new_order = Order(
        order_number=generate_order_number(),
        customer_id=current_user.id,
        table_number=order_data.table_number,
        total_amount=total_amount,
        notes=order_data.notes,
        status=OrderStatus.PENDING
    )
    
    db.add(new_order)
    db.flush()  # Get the order ID
    
    # Create order items
    for item_data in order_items_data:
        order_item = OrderItem(order_id=new_order.id, **item_data)
        db.add(order_item)
    
    db.commit()
    db.refresh(new_order)
    
    # Broadcast new order to admins via WebSocket
    await manager.broadcast_new_order({
        "type": "new_order",
        "order": {
            "id": new_order.id,
            "order_number": new_order.order_number,
            "customer_id": new_order.customer_id,
            "table_number": new_order.table_number,
            "total_amount": new_order.total_amount,
            "status": new_order.status.value,
            "created_at": new_order.created_at.isoformat()
        }
    })
    
    return new_order


@router.get("", response_model=List[OrderResponse])
async def get_orders(
    status: Optional[OrderStatus] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get orders. Customers see their own orders, admins see all."""
    query = db.query(Order)
    
    # Regular users only see their own orders
    if current_user.role != "admin":
        query = query.filter(Order.customer_id == current_user.id)
    
    # Filter by status if provided
    if status:
        query = query.filter(Order.status == status)
    
    orders = query.options(joinedload(Order.order_items).joinedload(OrderItem.menu_item)).order_by(Order.created_at.desc()).offset(skip).limit(limit).all()
    return orders




@router.get("/my-orders")
async def get_my_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get all orders for the current logged-in user."""
    logger.info(f"📋 Fetching orders for user: {current_user.email}")
    
    try:
        orders = db.query(Order).filter(
            Order.customer_id == current_user.id
        ).order_by(Order.created_at.desc()).all()
        
        result = []
        for order in orders:
            # Get order items
            order_items = db.query(OrderItem).filter(OrderItem.order_id == order.id).all()
            
            items_data = []
            for item in order_items:
                menu_item = db.query(MenuItem).filter(MenuItem.id == item.menu_item_id).first()
                items_data.append({
                    "menu_item_id": item.menu_item_id,
                    "name": menu_item.name if menu_item else "Unknown Item",
                    "quantity": item.quantity,
                    "price": float(item.price)
                })
            
            result.append({
                "id": order.id,
                "order_number": order.order_number,
                "table_number": order.table_number,
                "status": order.status,
                "total_amount": float(order.total_amount),
                "items": items_data,
                "created_at": order.created_at.isoformat()
            })
        
        logger.info(f"✅ Found {len(result)} orders for user")
        return result
        
    except Exception as e:
        logger.error(f"❌ Failed to fetch user orders: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch orders: {str(e)}"
        )
@router.get("/{order_id}", response_model=OrderResponse)
async def get_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get a specific order by ID."""
    order = db.query(Order).filter(Order.id == order_id).first()
    
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    
    # Check if user has permission to view this order
    if current_user.role != "admin" and order.customer_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this order"
        )
    
    return order


@router.patch("/{order_id}/status", response_model=OrderResponse)
async def update_order_status(
    order_id: int,
    status_update: OrderStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_user)
):
    """Update order status (Admin only)."""
    order = db.query(Order).filter(Order.id == order_id).first()
    
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    
    order.status = status_update.status
    db.commit()
    db.refresh(order)
    
    # Broadcast status update via WebSocket
    await manager.broadcast_order_update(order.id, {
        "type": "order_status_updated",
        "order": {
            "id": order.id,
            "order_number": order.order_number,
            "status": order.status.value,
            "updated_at": datetime.utcnow().isoformat()
        }
    })
    
    return order


@router.delete("/{order_id}", status_code=status.HTTP_204_NO_CONTENT)
async def cancel_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Cancel an order (only if pending)."""
    order = db.query(Order).filter(Order.id == order_id).first()
    
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    
    # Check permissions
    if current_user.role != "admin" and order.customer_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to cancel this order"
        )
    
    # Only pending orders can be cancelled
    if order.status != OrderStatus.PENDING:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only pending orders can be cancelled"
        )
    
    order.status = OrderStatus.CANCELLED
    db.commit()
    return None


@router.get("/track/{order_number}")
async def track_order(order_number: str, db: Session = Depends(get_db)):
    """Track order status by order number (no auth required for guests)."""
    logger.info(f"📍 Tracking order: {order_number}")
    
    try:
        order = db.query(Order).filter(Order.order_number == order_number).first()
        
        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Order not found"
            )
        
        # Get order items
        order_items = db.query(OrderItem).filter(OrderItem.order_id == order.id).all()
        
        items_data = []
        for item in order_items:
            menu_item = db.query(MenuItem).filter(MenuItem.id == item.menu_item_id).first()
            items_data.append({
                "menu_item_id": item.menu_item_id,
                "name": menu_item.name if menu_item else "Unknown Item",
                "quantity": item.quantity,
                "price": float(item.price)
            })
        
        return {
            "id": order.id,
            "order_number": order.order_number,
            "table_number": order.table_number,
            "guest_name": order.guest_name,
            "status": order.status,
            "total_amount": float(order.total_amount),
            "items": items_data,
            "created_at": order.created_at.isoformat()
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Failed to track order: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to track order: {str(e)}"

        )

