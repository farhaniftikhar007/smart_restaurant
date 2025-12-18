import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  items: OrderItem[];
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  total: number;
  estimatedTime: number;
  createdAt: Date;
  customerName: string;
  tableNumber?: string;
}

const OrderTracking: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  useEffect(() => {
    // Fetch initial orders
    fetchOrders();
  }, []);

  useEffect(() => {
    if (selectedOrder) {
      // Start countdown timer
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 0) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        clearInterval(timer);
      };
    }
  }, [selectedOrder]);

  const fetchOrders = async () => {
    // In a real app, this would be an API call
    const mockOrders: Order[] = [
      {
        id: '1',
        items: [
          { id: '1', name: 'Margherita Pizza', quantity: 1, price: 12.99 },
          { id: '2', name: 'Coca Cola', quantity: 2, price: 2.99 },
        ],
        status: 'preparing',
        total: 18.97,
        estimatedTime: 15,
        createdAt: new Date(),
        customerName: 'John Doe',
        tableNumber: 'A1',
      },
      // Add more mock orders as needed
    ];
    setOrders(mockOrders);
  };

  const updateOrderStatus = (orderId: string, status: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: status as any } : order
      )
    );

    if (selectedOrder?.id === orderId) {
      setSelectedOrder((prev) =>
        prev ? { ...prev, status: status as any } : null
      );
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'preparing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'ready':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'delivered':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="w-5 h-5" />;
      case 'preparing':
        return <ClockIcon className="w-5 h-5" />;
      case 'ready':
        return <CheckCircleIcon className="w-5 h-5" />;
      case 'delivered':
        return <CheckCircleIcon className="w-5 h-5" />;
      case 'cancelled':
        return <XCircleIcon className="w-5 h-5" />;
      default:
        return <ExclamationCircleIcon className="w-5 h-5" />;
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Order Tracking</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Active Orders</h2>
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                onClick={() => setSelectedOrder(order)}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedOrder?.id === order.id
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">Order #{order.id}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {order.customerName} - Table {order.tableNumber}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {getStatusIcon(order.status)}
                    {order.status}
                  </span>
                </div>
                <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {order.items.length} items • ${order.total.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Details */}
        {selectedOrder && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Order Details</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Order #{selectedOrder.id}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedOrder.customerName} - Table {selectedOrder.tableNumber}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getStatusColor(
                    selectedOrder.status
                  )}`}
                >
                  {getStatusIcon(selectedOrder.status)}
                  {selectedOrder.status}
                </span>
              </div>

              <div className="border-t dark:border-gray-700 pt-4">
                <h4 className="font-medium mb-2">Items</h4>
                <div className="space-y-2">
                  {selectedOrder.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center"
                    >
                      <span>
                        {item.quantity}x {item.name}
                      </span>
                      <span className="font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t dark:border-gray-700 pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total</span>
                  <span className="font-bold">${selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>

              {selectedOrder.status !== 'delivered' && selectedOrder.status !== 'cancelled' && (
                <div className="border-t dark:border-gray-700 pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ClockIcon className="w-5 h-5 text-gray-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Time Remaining: {Math.floor(timeRemaining / 60)}:
                        {(timeRemaining % 60).toString().padStart(2, '0')}
                      </span>
                    </div>
                    {(user?.role === 'admin' || user?.role === 'staff') && (
                      <div className="flex gap-2">
                        {selectedOrder.status === 'pending' && (
                          <button
                            onClick={() => updateOrderStatus(selectedOrder.id, 'preparing')}
                            className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                          >
                            Start Preparing
                          </button>
                        )}
                        {selectedOrder.status === 'preparing' && (
                          <button
                            onClick={() => updateOrderStatus(selectedOrder.id, 'ready')}
                            className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
                          >
                            Mark Ready
                          </button>
                        )}
                        {selectedOrder.status === 'ready' && (
                          <button
                            onClick={() => updateOrderStatus(selectedOrder.id, 'delivered')}
                            className="px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                          >
                            Mark Delivered
                          </button>
                        )}
                        <button
                          onClick={() => updateOrderStatus(selectedOrder.id, 'cancelled')}
                          className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                        >
                          Cancel Order
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking; 