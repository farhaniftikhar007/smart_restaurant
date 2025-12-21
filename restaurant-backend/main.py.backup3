# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn

from app.database import engine, Base
from app.routers import auth, menu, orders, restaurant, websocket, reservations, tables
from app.config import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Create tables
    Base.metadata.create_all(bind=engine)
    yield
    # Shutdown: cleanup if needed


app = FastAPI(
    title="Smart Restaurant API",
    description="Backend API for Smart Restaurant Management System",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Configuration for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(menu.router, prefix="/api/menu", tags=["Menu"])
app.include_router(orders.router, prefix="/api/orders", tags=["Orders"])
app.include_router(restaurant.router, prefix="/api/restaurant", tags=["Restaurant"])
app.include_router(websocket.router, prefix="/api", tags=["WebSocket"])
app.include_router(reservations.router, prefix="/api/reservations", tags=["Reservations"])
app.include_router(tables.router, prefix="/api/tables", tags=["Tables"])


@app.get("/")
async def root():
    return {
        "message": "Smart Restaurant API",
        "version": "1.0.0",
        "status": "running"
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )

# Serve static files
from fastapi.staticfiles import StaticFiles
app.mount("/static", StaticFiles(directory="static"), name="static")

# Include upload router
from app.routers import upload
app.include_router(upload.router, prefix="/api/upload", tags=["Upload"])
