from datetime import datetime, date
# app/schemas.py
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from app.models import UserRole, OrderStatus

# ============ AUTH SCHEMAS ============
class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: Optional[str] = None
    phone: Optional[str] = None

class UserCreate(UserBase):
    password: str = Field(..., min_length=6)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: int
    role: UserRole
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    email: Optional[str] = None

# User Profile Update Schema
class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None

    class Config:
        from_attributes = True

# ============ MENU SCHEMAS ============
class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None
    image_url: Optional[str] = None

class CategoryCreate(CategoryBase):
    pass

class CategoryResponse(CategoryBase):
    id: int
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class MenuItemBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float = Field(..., gt=0)
    category_id: int
    image_url: Optional[str] = None
    is_vegetarian: bool = False
    is_spicy: bool = False
    preparation_time: Optional[int] = None
    calories: Optional[int] = None

class MenuItemCreate(MenuItemBase):
    pass

class MenuItemUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = Field(None, gt=0)
    category_id: Optional[int] = None
    image_url: Optional[str] = None
    is_available: Optional[bool] = None
    is_vegetarian: Optional[bool] = None
    is_spicy: Optional[bool] = None

class MenuItemResponse(MenuItemBase):
    id: int
    is_available: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    category: CategoryResponse
    
    class Config:
        from_attributes = True

# ============ ORDER SCHEMAS ============
class OrderItemCreate(BaseModel):
    menu_item_id: int
    quantity: int = Field(..., gt=0)
    special_instructions: Optional[str] = None

class OrderItemResponse(BaseModel):
    id: int
    quantity: int
    price: float
    special_instructions: Optional[str] = None
    menu_item: Optional[MenuItemResponse] = None
    
    class Config:
        from_attributes = True

class OrderCreate(BaseModel):
    table_number: Optional[str] = None
    notes: Optional[str] = None
    items: List[OrderItemCreate]

class OrderStatusUpdate(BaseModel):
    status: OrderStatus

class OrderResponse(BaseModel):
    id: int
    order_number: str
    customer_id: Optional[int] = None  # Optional for guest orders
    table_number: Optional[str] = None
    guest_name: Optional[str] = None  # Guest name for non-authenticated orders
    order_type: Optional[str] = None  # Order type: dine_in, takeout, delivery
    status: OrderStatus
    total_amount: float
    notes: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    order_items: List[OrderItemResponse]
    
    class Config:
        from_attributes = True

# ============ RESTAURANT SCHEMAS ============
class RestaurantUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    opening_time: Optional[str] = None
    closing_time: Optional[str] = None
    logo_url: Optional[str] = None
    is_open: Optional[bool] = None

class RestaurantResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    opening_time: Optional[str] = None
    closing_time: Optional[str] = None
    logo_url: Optional[str] = None
    is_open: bool
    
    class Config:
        from_attributes = True

# ============ RESERVATION SCHEMAS ============
class ReservationCreate(BaseModel):
    name: str
    email: str
    phone: str
    date: str  # Format: YYYY-MM-DD
    time: str
    guests: int
    special_requests: Optional[str] = None

class ReservationResponse(BaseModel):
    id: int
    user_id: Optional[int] = None
    name: str
    email: str
    phone: str
    date: str  # Using str to avoid Pydantic issues
    time: str
    guests: int
    special_requests: Optional[str] = None
    table_number: Optional[str] = None  # Added
    status: str
    created_at: str  # Using str to avoid Pydantic issues

    class Config:
        from_attributes = True


# ============ TABLE SCHEMAS ============
class TableCreate(BaseModel):
    number: str
    capacity: int

class TableUpdate(BaseModel):
    number: Optional[str] = None
    capacity: Optional[int] = None
    status: Optional[str] = None

class TableResponse(BaseModel):
    id: int
    number: str
    capacity: int
    status: str
    qr_code: Optional[str] = None
    created_at: str
    updated_at: Optional[str] = None

    class Config:
        from_attributes = True
