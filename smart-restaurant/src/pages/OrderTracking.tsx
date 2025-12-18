// src/pages/OrderTracking.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { orderService, Order } from '../services/orderService';
import { useWebSocket } from '../hooks/useWebSocket';

export const OrderTracking: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const { on, off, subscribeToOrder } = useWebSocket();

  useEffect(() => {
    if (orderId) {
      loadOrder(parseInt(orderId));
      subscribeToOrder(parseInt(orderId));
    }
  }, [orderId]);

  useEffect(() => {
    const handleOrderUpdate = (data: any) => {
      if (data.order && data.order.id === parseInt(orderId!)) {
        setOrder(prev => prev ? { ...prev, status: data.order.status } : null);
      }
    };

    on('order_status_updated', handleOrderUpdate);

    return () => {
      off('order_status_updated', handleOrderUpdate);
    };
  }, [orderId, on, off]);

  const loadOrder = async (id: number) => {
    const result = await orderService.getOrder(id);
    if (result.success) {
      setOrder(result.data);
    }
  };

  if (!order) return <div>Loading order...</div>;

  return (
    <div className="order-tracking">
      <h2>Order #{order.order_number}</h2>
      <div className="status-badge">{order.status}</div>
      <p>Total: ${order.total_amount.toFixed(2)}</p>
      
      <div className="order-items">
        {order.order_items.map(item => (
          <div key={item.id}>
            {item.quantity}x {item.menu_item.name} - ${(item.price * item.quantity).toFixed(2)}
          </div>
        ))}
      </div>
    </div>
  );
};
