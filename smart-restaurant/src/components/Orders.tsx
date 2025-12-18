import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  notes?: string;
}

interface Order {
  id: string;
  tableNumber: number;
  items: OrderItem[];
  status: 'pending' | 'preparing' | 'ready' | 'completed';
  createdAt: Date;
  total: number;
  estimatedTime?: number;
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'preparing' | 'ready'>('all');

  useEffect(() => {
    // Mock data for demonstration
    setOrders([
      {
        id: '1',
        tableNumber: 5,
        items: [
          { id: '1', name: 'Margherita Pizza', quantity: 2, price: 12.99 },
          { id: '2', name: 'Caesar Salad', quantity: 1, price: 8.99 },
        ],
        status: 'pending',
        createdAt: new Date(),
        total: 34.97,
        estimatedTime: 20,
      },
      {
        id: '2',
        tableNumber: 3,
        items: [
          { id: '3', name: 'Chicken Wings', quantity: 1, price: 13.99 },
          { id: '4', name: 'Fries', quantity: 2, price: 4.99 },
        ],
        status: 'preparing',
        createdAt: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
        total: 23.97,
        estimatedTime: 15,
      },
    ]);
  }, []);

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'preparing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'ready':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'completed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const filteredOrders = orders.filter(order => 
    filter === 'all' ? true : order.status === filter
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Orders</h1>
        <div className="flex gap-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
            className="input-field"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="preparing">Preparing</option>
            <option value="ready">Ready</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredOrders.map((order) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-lg font-semibold">Table {order.tableNumber}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(order.createdAt).toLocaleTimeString()}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <span>
                    {item.quantity}x {item.name}
                  </span>
                  <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t dark:border-gray-700 pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold">Total</span>
                <span className="font-bold">${order.total.toFixed(2)}</span>
              </div>

              {order.estimatedTime && (
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <ClockIcon className="w-4 h-4 mr-1" />
                  Est. time: {order.estimatedTime} minutes
                </div>
              )}

              <div className="flex gap-2">
                {order.status === 'pending' && (
                  <button
                    onClick={() => updateOrderStatus(order.id, 'preparing')}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Start Preparing
                  </button>
                )}
                {order.status === 'preparing' && (
                  <button
                    onClick={() => updateOrderStatus(order.id, 'ready')}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                  >
                    Mark Ready
                  </button>
                )}
                {order.status === 'ready' && (
                  <button
                    onClick={() => updateOrderStatus(order.id, 'completed')}
                    className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
                  >
                    Complete Order
                  </button>
                )}
                {order.status !== 'completed' && (
                  <button
                    onClick={() => updateOrderStatus(order.id, 'completed')}
                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Orders; 