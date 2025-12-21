// src/hooks/useWebSocket.ts
import { useEffect, useState, useCallback } from 'react';
import { wsClient } from '../services/wsClient';
import { authService } from '../services/authService';

export const useWebSocket = () => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Only connect if user is authenticated
    if (authService.isAuthenticated()) {
      const token = localStorage.getItem('token');
      
      if (token) {
        wsClient.connect(token);

        // Set up connection handlers
        const handleOpen = () => setIsConnected(true);
        const handleClose = () => setIsConnected(false);

        wsClient.on('connection_open', handleOpen);
        wsClient.on('connection_close', handleClose);

        // Cleanup on unmount
        return () => {
          wsClient.off('connection_open', handleOpen);
          wsClient.off('connection_close', handleClose);
          wsClient.disconnect();
        };
      }
    }
  }, []);

  const on = useCallback((event: string, callback: (data: any) => void) => {
    wsClient.on(event, callback);
  }, []);

  const off = useCallback((event: string, callback: (data: any) => void) => {
    wsClient.off(event, callback);
  }, []);

  const send = useCallback((data: any) => {
    wsClient.send(data);
  }, []);

  const subscribeToOrder = useCallback((orderId: number) => {
    wsClient.subscribeToOrder(orderId);
  }, []);

  return {
    isConnected,
    on,
    off,
    send,
    subscribeToOrder,
  };
};

// Hook specifically for order updates
export const useOrderUpdates = (onUpdate: (order: any) => void) => {
  const { on, off } = useWebSocket();

  useEffect(() => {
    const handleOrderUpdate = (data: any) => {
      if (data.type === 'order_status_updated' || data.type === 'new_order') {
        onUpdate(data.order);
      }
    };

    on('order_status_updated', handleOrderUpdate);
    on('new_order', handleOrderUpdate);

    return () => {
      off('order_status_updated', handleOrderUpdate);
      off('new_order', handleOrderUpdate);
    };
  }, [on, off, onUpdate]);
};
