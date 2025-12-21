import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';
import axios from 'axios';

interface OrderItem {
  menu_item_id: number;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  order_number: string;
  table_number: number | null;
  guest_name: string | null;
  status: string;
  total_amount: number;
  items: OrderItem[];
  created_at: string;
}

const OrderStatus: React.FC = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const location = useLocation();
  const { tableNumber, guestName } = location.state || {};
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (orderNumber) {
      fetchOrder();
      // Poll for updates every 10 seconds
      const interval = setInterval(fetchOrder, 10000);
      return () => clearInterval(interval);
    }
  }, [orderNumber]);

  const fetchOrder = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/orders/track/${orderNumber}`);
      setOrder(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch order');
      console.error('Error fetching order:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status: string) => {
    const statusMap: { [key: string]: { text: string; color: string; icon: string; progress: number } } = {
      pending: { text: 'Order Received', color: 'bg-yellow-500', icon: '📝', progress: 25 },
      confirmed: { text: 'Order Confirmed', color: 'bg-blue-500', icon: '✅', progress: 50 },
      preparing: { text: 'Preparing Your Food', color: 'bg-purple-500', icon: '👨‍🍳', progress: 75 },
      ready: { text: 'Order Ready!', color: 'bg-green-500', icon: '🍽️', progress: 90 },
      delivered: { text: 'Delivered', color: 'bg-gray-500', icon: '✨', progress: 100 },
      cancelled: { text: 'Cancelled', color: 'bg-red-500', icon: '❌', progress: 0 },
    };
    return statusMap[status] || statusMap.pending;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading your order...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'Unable to find your order'}</p>
          <button
            onClick={fetchOrder}
            className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(order.status);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="text-center">
            <div className="text-5xl mb-3">{statusInfo.icon}</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{statusInfo.text}</h1>
            <p className="text-gray-600">Order #{order.order_number}</p>
            {order.table_number && (
              <p className="text-gray-600">Table {order.table_number}</p>
            )}
            {order.guest_name && (
              <p className="text-gray-600">{order.guest_name}</p>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all duration-500 ${statusInfo.color}`}
                style={{ width: `${statusInfo.progress}%` }}
              ></div>
            </div>
          </div>

          {/* Status Steps */}
          <div className="mt-8 grid grid-cols-4 gap-2">
            {['pending', 'confirmed', 'preparing', 'ready'].map((step, index) => {
              const stepInfo = getStatusInfo(step);
              const isActive = ['pending', 'confirmed', 'preparing', 'ready'].indexOf(order.status) >= index;
              const isCurrent = order.status === step;
              
              return (
                <div key={step} className="text-center">
                  <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center text-xl mb-2 ${
                    isActive ? stepInfo.color + ' text-white' : 'bg-gray-200 text-gray-400'
                  } ${isCurrent ? 'ring-4 ring-orange-300' : ''}`}>
                    {stepInfo.icon}
                  </div>
                  <p className={`text-xs ${isActive ? 'text-gray-900 font-semibold' : 'text-gray-400'}`}>
                    {step.charAt(0).toUpperCase() + step.slice(1)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Your Order</h2>
          <div className="space-y-3">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                <div>
                  <p className="font-semibold text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                </div>
                <p className="font-bold text-orange-600">
                  Rs. {(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t-2 flex justify-between items-center">
            <span className="text-xl font-bold text-gray-900">Total</span>
            <span className="text-2xl font-bold text-orange-600">
              Rs. {order.total_amount.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Order Time */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Order Time</p>
              <p className="font-semibold text-gray-900">
                {new Date(order.created_at).toLocaleString()}
              </p>
            </div>
            <button
              onClick={fetchOrder}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-600"
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        {/* Auto-refresh indicator */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            🔄 Auto-refreshing every 10 seconds
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderStatus;
