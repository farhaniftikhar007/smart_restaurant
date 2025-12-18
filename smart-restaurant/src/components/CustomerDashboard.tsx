import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShoppingCartIcon,
  ClockIcon,
  HeartIcon,
  StarIcon,
  BellIcon,
  MapPinIcon,
  CreditCardIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';

interface Order {
  id: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  status: 'preparing' | 'ready' | 'delivered';
  total: number;
  estimatedTime: number;
  createdAt: Date;
}

interface FavoriteItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

const CustomerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'orders' | 'favorites' | 'profile'>('orders');
  const [orders] = useState<Order[]>([
    {
      id: '1',
      items: [
        { name: 'Margherita Pizza', quantity: 1, price: 12.99 },
        { name: 'Coca Cola', quantity: 2, price: 2.99 }
      ],
      status: 'preparing',
      total: 18.97,
      estimatedTime: 15,
      createdAt: new Date()
    }
  ]);

  const [favorites] = useState<FavoriteItem[]>([
    {
      id: '1',
      name: 'Margherita Pizza',
      price: 12.99,
      image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3',
      category: 'Pizza'
    },
    {
      id: '2',
      name: 'Caesar Salad',
      price: 8.99,
      image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9',
      category: 'Salad'
    }
  ]);

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <ShoppingCartIcon className="w-6 h-6 text-blue-600 dark:text-blue-300" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Active Orders</p>
              <p className="text-2xl font-bold">{orders.length}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
              <HeartIcon className="w-6 h-6 text-red-600 dark:text-red-300" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Favorite Items</p>
              <p className="text-2xl font-bold">{favorites.length}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <StarIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-300" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Reward Points</p>
              <p className="text-2xl font-bold">250</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <BellIcon className="w-6 h-6 text-green-600 dark:text-green-300" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Notifications</p>
              <p className="text-2xl font-bold">3</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('orders')}
              className={`${
                activeTab === 'orders'
                  ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Orders
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`${
                activeTab === 'favorites'
                  ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Favorites
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`${
                activeTab === 'profile'
                  ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Profile
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">Active Orders</h2>
            {orders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border dark:border-gray-700 rounded-lg p-4"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-medium">Order #{order.id}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {order.createdAt.toLocaleString()}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                    {order.status}
                  </span>
                </div>
                <div className="space-y-2 mb-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span>
                        {item.quantity}x {item.name}
                      </span>
                      <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center pt-4 border-t dark:border-gray-700">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <ClockIcon className="w-4 h-4 mr-1" />
                    Est. time: {order.estimatedTime} minutes
                  </div>
                  <span className="font-bold">${order.total.toFixed(2)}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'favorites' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">Favorite Items</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border dark:border-gray-700 rounded-lg overflow-hidden"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      {item.category}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="font-bold">${item.price.toFixed(2)}</span>
                      <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="input-field w-full"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    className="input-field w-full"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    className="input-field w-full"
                    placeholder="+1 234 567 8900"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Delivery Address
                  </label>
                  <textarea
                    className="input-field w-full"
                    rows={3}
                    placeholder="Enter your delivery address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Payment Methods
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center p-3 border dark:border-gray-700 rounded-lg">
                      <CreditCardIcon className="w-5 h-5 text-gray-400 mr-2" />
                      <span>•••• 4242</span>
                    </div>
                    <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">
                      + Add new payment method
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <button className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors">
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard; 