import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import LiveOrderTimer from '../components/LiveOrderTimer';
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
  // const location = useLocation();
  // const { tableNumber, guestName } = location.state || {};

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderData = async () => {
      await fetchOrder();
    };

    if (orderNumber) {
      fetchOrder();
      // Poll for updates every 3 seconds (faster updates)
      const interval = setInterval(fetchOrder, 3000);
      return () => clearInterval(interval);
    };

    if (orderNumber) {
      fetchOrderData();
    }
  }, [orderNumber]); // eslint-disable-line react-hooks/exhaustive-deps

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600 font-medium tracking-wide animate-pulse">Tracking your order...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center border border-gray-100">
          <div className="text-7xl mb-6 transform hover:scale-110 transition-transform cursor-default">😕</div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Order Not Found</h2>
          <p className="text-gray-500 mb-8 leading-relaxed">{error || 'We couldn\'t find the order you\'re looking for.'}</p>
          <button
            onClick={fetchOrder}
            className="w-full bg-orange-500 text-white px-6 py-4 rounded-xl font-bold hover:bg-orange-600 transition-all shadow-lg hover:shadow-orange-200 transform active:scale-95"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(order.status);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 font-sans">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Status Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 relative">
          <div className={`absolute top-0 left-0 w-full h-2 ${statusInfo.color}`}></div>

          <div className="p-8 text-center relative z-10">
            <div className="inline-block p-4 rounded-full bg-gray-50 mb-4 shadow-sm">
              <div className="text-6xl transform transition-transform hover:scale-110 duration-300 cursor-default">
                {statusInfo.icon}
              </div>
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">
              {statusInfo.text}
            </h1>
            <div className="flex justify-center items-center gap-2 text-gray-500 font-medium">
              <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">Order #{order.order_number}</span>
              {order.table_number && (
                <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-sm">Table {order.table_number}</span>
              )}
            </div>
          </div>

          {/* Progress Section */}
          <div className="px-8 pb-10">
            <div className="relative pt-4">
              <div className="flex mb-2 items-center justify-between">
                <div className="text-right w-full">
                  <span className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full ${statusInfo.color.replace('bg-', 'text-').replace('500', '600')} bg-opacity-20`}>
                    {statusInfo.progress}% Completed
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-3 mb-4 text-xs flex rounded-full bg-gray-100 shadow-inner">
                <div
                  style={{ width: `${statusInfo.progress}%` }}
                  className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${statusInfo.color} transition-all duration-1000 ease-out`}
                ></div>
              </div>

              {/* Steps */}
              <div className="grid grid-cols-4 gap-2 text-center relative">
                {/* Connector Line */}
                <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-100 -z-10 transform -translate-y-1/2 hidden md:block" />

                {['pending', 'confirmed', 'preparing', 'ready'].map((step, index) => {
                  const stepInfo = getStatusInfo(step);
                  const isActive = ['pending', 'confirmed', 'preparing', 'ready', 'delivered'].indexOf(order.status) >= index;
                  const isCurrent = order.status === step;

                  return (
                    <div key={step} className="flex flex-col items-center group">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg mb-2 transition-all duration-300 z-10 
                          ${isActive ? stepInfo.color + ' text-white shadow-md transform scale-105' : 'bg-white border-2 border-gray-200 text-gray-300 grayscale'}
                          ${isCurrent ? 'ring-4 ring-offset-2 ring-orange-200' : ''}
                        `}>
                        {stepInfo.icon}
                      </div>
                      <p className={`text-xs font-bold transition-colors duration-300 ${isActive ? 'text-gray-800' : 'text-gray-400'}`}>
                        {step.charAt(0).toUpperCase() + step.slice(1)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Details Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span>📜</span> Order Details
          </h2>
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-4 border-b border-gray-50 last:border-b-0 hover:bg-gray-50 transition-colors px-2 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="bg-orange-100 text-orange-600 font-bold w-8 h-8 rounded-lg flex items-center justify-center text-sm">
                    {item.quantity}x
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-lg">{item.name}</p>
                    {/* Placeholder for description if available in future */}
                  </div>
                </div>
                <p className="font-bold text-gray-700">
                  Rs. {(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <span className="text-xl text-gray-500 font-medium">Total Amount</span>
              <span className="text-4xl font-extrabold text-orange-600">
                Rs. {order.total_amount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Order Time */}
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-center border border-gray-50">
            <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold mb-1">Placed At</p>
            <p className="text-lg font-bold text-gray-900">
              {new Date(order.created_at).toLocaleString([], { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}
            </p>
            <div className="mt-2 flex justify-center">
              <LiveOrderTimer createdAt={order.created_at} status={order.status} />
            </div>
          </div>

          <button
            onClick={fetchOrder}
            className="bg-gray-900 text-white rounded-2xl shadow-lg p-6 font-bold text-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-2 group"
          >
            <span className="transform group-hover:rotate-180 transition-transform duration-500">🔄</span>
            Refresh Status
          </button>
        </div>

        {/* Auto-refresh indicator */}
        <div className="text-center py-4">
          <p className="text-xs text-gray-400 font-medium uppercase tracking-widest animate-pulse">
            Live Updates On (3s)
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderStatus;
