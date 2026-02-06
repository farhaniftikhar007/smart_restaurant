# app/websocket.py
from fastapi import WebSocket, WebSocketDisconnect
from typing import Dict, List, Set
import json
import logging

logger = logging.getLogger(__name__)


class ConnectionManager:
    """Manages WebSocket connections for real-time updates."""
    
    def __init__(self):
        # Store active connections by role
        self.active_connections: Dict[str, Set[WebSocket]] = {
            "admin": set(),
            "customer": set(),
            "all": set()
        }
        # Map order IDs to customer connections
        self.order_subscriptions: Dict[int, Set[WebSocket]] = {}
    
    async def connect(self, websocket: WebSocket, role: str = "customer"):
        """Accept and store a new WebSocket connection."""
        await websocket.accept()
        self.active_connections[role].add(websocket)
        self.active_connections["all"].add(websocket)
        logger.info(f"New {role} connection. Total: {len(self.active_connections['all'])}")
    
    def disconnect(self, websocket: WebSocket, role: str = "customer"):
        """Remove a WebSocket connection."""
        self.active_connections[role].discard(websocket)
        self.active_connections["all"].discard(websocket)
        
        # Clean up order subscriptions
        for order_id, subscribers in list(self.order_subscriptions.items()):
            subscribers.discard(websocket)
            if not subscribers:
                del self.order_subscriptions[order_id]
        
        logger.info(f"{role} disconnected. Remaining: {len(self.active_connections['all'])}")
    
    def subscribe_to_order(self, websocket: WebSocket, order_id: int):
        """Subscribe a connection to specific order updates."""
        if order_id not in self.order_subscriptions:
            self.order_subscriptions[order_id] = set()
        self.order_subscriptions[order_id].add(websocket)
    
    async def send_personal_message(self, message: dict, websocket: WebSocket):
        """Send a message to a specific connection."""
        try:
            await websocket.send_json(message)
        except Exception as e:
            logger.error(f"Error sending personal message: {e}")
    
    async def broadcast_to_role(self, message: dict, role: str):
        """Broadcast message to all connections of a specific role."""
        disconnected = set()
        
        for connection in self.active_connections[role]:
            try:
                await connection.send_json(message)
            except Exception as e:
                logger.error(f"Error broadcasting to {role}: {e}")
                disconnected.add(connection)
        
        # Clean up disconnected clients
        for conn in disconnected:
            self.disconnect(conn, role)
    
    async def broadcast_order_update(self, order_id: int, message: dict):
        """Broadcast order updates to subscribed connections and all admins."""
        disconnected = set()
        
        # Send to order subscribers
        if order_id in self.order_subscriptions:
            for connection in self.order_subscriptions[order_id]:
                try:
                    await connection.send_json(message)
                except Exception as e:
                    logger.error(f"Error sending order update: {e}")
                    disconnected.add(connection)
        
        # Always send to admins
        await self.broadcast_to_role(message, "admin")
        
        # Clean up disconnected clients
        for conn in disconnected:
            self.disconnect(conn)
    
    async def broadcast_new_order(self, message: dict):
        """Broadcast new order notification to all admins."""
        await self.broadcast_to_role(message, "admin")
    
    async def broadcast_to_all(self, message: dict):
        """Broadcast message to all connected clients."""
        disconnected = set()
        
        for connection in self.active_connections["all"]:
            try:
                await connection.send_json(message)
            except Exception as e:
                logger.error(f"Error broadcasting to all: {e}")
                disconnected.add(connection)
        
        # Clean up disconnected clients
        for conn in disconnected:
            self.disconnect(conn)


# Global connection manager instance
manager = ConnectionManager()
