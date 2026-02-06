import os
import uvicorn

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn

from app.database import engine, Base
from app.routers import auth, menu, orders, restaurant, websocket, reservations, tables, upload, analytics
from app.config import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 Starting up...")
    Base.metadata.create_all(bind=engine)
    yield
    print("🔄 Shutting down...")

# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    lifespan=lifespan
)

# Mount static files for uploads
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# CORS Configuration - Allow all origins for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(menu.router, prefix="/api/menu", tags=["Menu"])
app.include_router(orders.router, prefix="/api/orders", tags=["Orders"])
app.include_router(restaurant.router, prefix="/api/restaurant", tags=["Restaurant"])
app.include_router(websocket.router, prefix="/api/ws", tags=["WebSocket"])
app.include_router(reservations.router, prefix="/api/reservations", tags=["Reservations"])
app.include_router(tables.router, prefix="/api/tables", tags=["Tables"])
app.include_router(upload.router, prefix="/api/upload", tags=["Upload"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])

@app.get("/")
async def root():
    return {"message": "Smart Restaurant API", "status": "running"}

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run(app, host="0.0.0.0", port=port)

