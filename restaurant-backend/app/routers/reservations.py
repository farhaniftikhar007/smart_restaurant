# app/routers/reservations.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from datetime import datetime, date
import logging

from app.database import get_db
from app.models import Reservation, User
from app.schemas import ReservationCreate

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_reservation(
    reservation_data: ReservationCreate,
    db: Session = Depends(get_db)
):
    """Create a new reservation (no auth required)."""
    logger.info("=" * 50)
    logger.info("📝 NEW RESERVATION REQUEST RECEIVED!")
    logger.info(f"Name: {reservation_data.name}")
    logger.info(f"Email: {reservation_data.email}")
    logger.info(f"Phone: {reservation_data.phone}")
    logger.info(f"Date: {reservation_data.date}")
    logger.info(f"Time: {reservation_data.time}")
    logger.info(f"Guests: {reservation_data.guests}")
    logger.info("=" * 50)
    
    try:
        # Parse date string to date object
        reservation_date = datetime.strptime(reservation_data.date, "%Y-%m-%d").date()
        
        # Check if date is in the past
        if reservation_date < date.today():
            logger.warning("❌ Reservation rejected - date is in the past")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot make reservations for past dates"
            )
        
        # Create reservation without user_id (guest reservation)
        db_reservation = Reservation(
            user_id=None,
            name=reservation_data.name,
            email=reservation_data.email,
            phone=reservation_data.phone,
            date=reservation_date,
            time=reservation_data.time,
            guests=reservation_data.guests,
            special_requests=reservation_data.special_requests,
            status="pending"
        )
        
        db.add(db_reservation)
        db.commit()
        db.refresh(db_reservation)
        
        logger.info(f"✅ Reservation created successfully! ID: {db_reservation.id}")
        
        # Return as dict with string dates
        return {
            "id": db_reservation.id,
            "user_id": db_reservation.user_id,
            "name": db_reservation.name,
            "email": db_reservation.email,
            "phone": db_reservation.phone,
            "date": db_reservation.date.isoformat(),
            "time": db_reservation.time,
            "guests": db_reservation.guests,
            "special_requests": db_reservation.special_requests,
            "status": db_reservation.status,
            "created_at": db_reservation.created_at.isoformat()
        }
        
    except ValueError:
        logger.error("❌ Invalid date format")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid date format. Use YYYY-MM-DD"
        )
    except Exception as e:
        logger.error(f"❌ Failed to create reservation: {str(e)}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create reservation: {str(e)}"
        )


@router.get("/check-availability/{date}/{time}")
async def check_availability(
    date: str,
    time: str,
    guests: int,
    db: Session = Depends(get_db)
):
    """Check if reservation is available for given date/time."""
    logger.info(f"🔍 Checking availability for {date} at {time} for {guests} guests")
    
    try:
        reservation_date = datetime.strptime(date, "%Y-%m-%d").date()
        
        # Count reservations for this date and time
        existing_reservations = db.query(Reservation).filter(
            Reservation.date == reservation_date,
            Reservation.time == time,
            Reservation.status != "cancelled"
        ).count()
        
        # Simple availability check (max 10 tables)
        max_tables = 10
        available = existing_reservations < max_tables
        
        logger.info(f"{'✅ Available' if available else '❌ Not available'} - {existing_reservations}/{max_tables} tables booked")
        
        return {
            "available": available,
            "message": "Table available" if available else "No tables available for this time"
        }
    except Exception as e:
        logger.error(f"❌ Error checking availability: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.get("/")
async def get_all_reservations(db: Session = Depends(get_db)):
    """Get all reservations (for admin)."""
    logger.info("📋 Fetching all reservations")
    
    try:
        reservations = db.query(Reservation).order_by(Reservation.date.desc(), Reservation.time.desc()).all()
        
        logger.info(f"✅ Found {len(reservations)} reservations")
        
        # Return as list of dicts
        return [
            {
                "id": r.id,
                "user_id": r.user_id,
                "name": r.name,
                "email": r.email,
                "phone": r.phone,
                "date": r.date.isoformat(),
                "time": r.time,
                "guests": r.guests,
                "special_requests": r.special_requests,
                "status": r.status,
                "created_at": r.created_at.isoformat()
            }
            for r in reservations
        ]
        
    except Exception as e:
        logger.error(f"❌ Failed to fetch reservations: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch reservations: {str(e)}"
        )


@router.patch("/{reservation_id}/status")
async def update_reservation_status(
    reservation_id: int,
    status_data: dict,
    db: Session = Depends(get_db)
):
    """Update reservation status."""
    logger.info(f"🔄 Updating reservation {reservation_id} status to {status_data.get('status')}")
    
    try:
        reservation = db.query(Reservation).filter(Reservation.id == reservation_id).first()
        
        if not reservation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Reservation not found"
            )
        
        new_status = status_data.get('status')
        if new_status not in ['pending', 'confirmed', 'cancelled', 'completed']:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid status"
            )
        
        reservation.status = new_status
        db.commit()
        db.refresh(reservation)
        
        logger.info(f"✅ Reservation {reservation_id} status updated to {new_status}")
        
        return {
            "id": reservation.id,
            "status": reservation.status,
            "message": f"Reservation status updated to {new_status}"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Failed to update reservation: {str(e)}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update reservation: {str(e)}"
        )
