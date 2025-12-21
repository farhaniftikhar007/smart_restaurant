import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  status: string;
  total_amount: number;
  items: OrderItem[];
  created_at: string;
}

const MyOrders: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/auth');
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/api/orders/my-orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Orders response:', response.data);
      
      // Check if response is an array
      if (Array.isArray(response.data)) {
        setOrders(response.data);
      } else {
        console.error('Expected array, got:', response.data);
        setError('Invalid response format from server');
      }
      
      setError(null);
    } catch (err: any) {
      console.error('Error fetching orders:', err);
      
      // Handle different error types
      if (err.response) {
        // Server responded with error
        const errorMsg = err.response.data?.detail || 
                        err.response.data?.message || 
                        JSON.stringify(err.response.data);
        setError(`Server error: ${errorMsg}`);
      } else if (err.request) {
        // Request made but no response
        setError('No response from server. Please check your connection.');
      } else {
        // Other errors
        setError(err.message || 'Failed to fetch orders');
      }
    } finally {
      setLoading(false);
    }
  };

  const viewOrderStatus = (orderNumber: string) => {
    navigate(`/order-status/${orderNumber}`);
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      preparing: 'bg-purple-100 text-purple-800',
      ready: 'bg-green-100 text-green-800',
      delivered: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    const icons: { [key: string]: string } = {
      pending: '📝',
      confirmed: '✅',
      preparing: '👨‍🍳',
      ready: '🍽️',
      delivered: '✨',
      cancelled: '❌'
    };
    return icons[status] || '📦';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto mb-4"></div>
          <p className="text-xl">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
          <div className="text-6xl text-center mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Error Loading Orders</h2>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchOrders}
              className="flex-1 bg-orange-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-orange-600"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/menu')}
              className="flex-1 bg-gray-200 text-gray-700 px-4 py-3 rounded-lg font-semibold hover:bg-gray-300"
            >
              Go to Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
            <p className="text-gray-600 mt-1">Track all your orders</p>
          </div>
          <button
            onClick={fetchOrders}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-600"
          >
            🔄 Refresh
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">🍽️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Orders Yet</h2>
            <p className="text-gray-600 mb-6">Start ordering delicious food!</p>
            <button
              onClick={() => navigate('/menu')}
              className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600"
            >
              View Menu
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="p-6">
                  {/* Order Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        Order #{order.order_number}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {new Date(order.created_at).toLocaleString()}
                      </p>
                      {order.table_number && (
                        <p className="text-sm text-gray-600">
                          Table {order.table_number}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${getStatusColor(order.status)} font-semibold`}>
                        <span className="text-xl">{getStatusIcon(order.status)}</span>
                        <span>{order.status.toUpperCase()}</span>
                      </div>
                      <p className="text-2xl font-bold text-orange-600 mt-2">
                        Rs. {order.total_amount.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="border-t pt-4 mb-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Items:</h4>
                    <div className="space-y-2">
                      {order.items && order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-gray-700">
                            {item.quantity}x {item.name}
                          </span>
                          <span className="text-gray-900 font-semibold">
                            Rs. {(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => viewOrderStatus(order.order_number)}
                      className="flex-1 bg-orange-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                    >
                      📍 Track Order
                    </button>
                    {order.status === 'delivered' && (
                      <button
                        onClick={() => navigate('/menu')}
                        className="px-6 py-3 border-2 border-orange-500 text-orange-500 rounded-lg font-semibold hover:bg-orange-50 transition-colors"
                      >
                        Order Again
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
