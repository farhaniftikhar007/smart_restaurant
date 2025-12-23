import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  order_number: string;
  customer_id: number;
  table_number: number | null;
  guest_name: string | null;
  status: string;
  total_amount: number;
  created_at: string;
  items?: OrderItem[];
}

const OrdersManagement: React.FC = () => {
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
      const url = `${API_BASE_URL}/api/orders`;
      console.log('Fetching orders from:', url);
      
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch orders');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      const token = localStorage.getItem('token');
      const url = `${API_BASE_URL}/api/orders/${orderId}/status`;
      
      await axios.patch(
        url,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrders();
    } catch (err) {
      console.error('Error updating order status:', err);
      alert('Failed to update order status');
    }
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl">Loading orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 m-4">
        <p className="text-red-800">Error: {error}</p>
        <p className="text-sm text-gray-600 mt-2">API URL: {API_BASE_URL}</p>
        <button 
          onClick={fetchOrders}
          className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Orders Management</h1>
        <button 
          onClick={fetchOrders}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Refresh
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-600 text-lg">No orders found</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold">{order.order_number}</h3>
                  <p className="text-gray-600">
                    {new Date(order.created_at).toLocaleString()}
                  </p>
                  {order.table_number && (
                    <p className="text-gray-600">Table: {order.table_number}</p>
                  )}
                  {order.guest_name && (
                    <p className="text-gray-600">Guest: {order.guest_name}</p>
                  )}
                  {order.guest_name && (
                    <p className="text-gray-600">Guest: {order.guest_name}</p>
                  )}
                  {order.guest_name && (
                    <p className="text-gray-600">Guest: {order.guest_name}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">Rs. {order.total_amount.toFixed(2)}</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${getStatusColor(order.status)}`}>
                    {order.status.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => updateOrderStatus(order.id, 'confirmed')}
                  className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                  disabled={order.status === 'confirmed'}
                >
                  Confirm
                </button>
                <button
                  onClick={() => updateOrderStatus(order.id, 'preparing')}
                  className="bg-purple-500 text-white px-3 py-1 rounded text-sm hover:bg-purple-600"
                  disabled={order.status === 'preparing'}
                >
                  Preparing
                </button>
                <button
                  onClick={() => updateOrderStatus(order.id, 'ready')}
                  className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                  disabled={order.status === 'ready'}
                >
                  Ready
                </button>
                <button
                  onClick={() => updateOrderStatus(order.id, 'delivered')}
                  className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
                  disabled={order.status === 'delivered'}
                >
                  Delivered
                </button>
                <button
                  onClick={() => updateOrderStatus(order.id, 'cancelled')}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                  disabled={order.status === 'cancelled'}
                >
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersManagement;
