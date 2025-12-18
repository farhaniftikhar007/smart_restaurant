import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import {
  HomeIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  UserIcon,
  QrCodeIcon,
  ChartBarIcon,
  SunIcon,
  MoonIcon,
  UsersIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  CreditCardIcon,
  BellIcon,
} from '@heroicons/react/24/outline';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { isDarkMode, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Overview', href: '/dashboard/admin', icon: HomeIcon, roles: ['admin'] },
    { name: 'Menu Management', href: '/dashboard/admin/menu', icon: ClipboardDocumentListIcon, roles: ['admin'] },
    { name: 'Order Management', href: '/dashboard/admin/orders', icon: ChartBarIcon, roles: ['admin'] },
    { name: 'Booking Management', href: '/dashboard/admin/bookings', icon: CalendarIcon, roles: ['admin'] },
    { name: 'User Management', href: '/dashboard/admin/users', icon: UsersIcon, roles: ['admin'] },
    { name: 'Staff Management', href: '/dashboard/admin/staff', icon: UserIcon, roles: ['admin'] },
    { name: 'Feedback Management', href: '/dashboard/admin/feedback', icon: ChatBubbleLeftRightIcon, roles: ['admin'] },
    { name: 'QR Generator', href: '/dashboard/admin/qr-generator', icon: QrCodeIcon, roles: ['admin'] },
    { name: 'Analytics', href: '/dashboard/admin/analytics', icon: ChartBarIcon, roles: ['admin'] },
    { name: 'Settings', href: '/dashboard/admin/settings', icon: Cog6ToothIcon, roles: ['admin'] },
  ];

  const filteredNavigation = navigation.filter(item => 
    item.roles.includes(user?.role || '')
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Sidebar */}
      <motion.div
        initial={{ x: -280 }}
        animate={{ x: isSidebarOpen ? 0 : -280 }}
        className="fixed top-0 left-0 h-full w-70 bg-white dark:bg-gray-800 shadow-lg z-50"
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <Link to="/" className="text-2xl font-bold text-orange-500">
              Smart Restaurant
            </Link>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <ArrowLeftOnRectangleIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
            {filteredNavigation.map((item) => (
                <li key={item.name}>
              <Link
                to={item.href}
                    className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  location.pathname === item.href
                        ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.name}
              </Link>
                </li>
            ))}
            </ul>
          </nav>

          {/* User Info & Theme Toggle */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white">
                  {user?.full_name?.charAt(0)}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.full_name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{user?.role}</p>
                </div>
              </div>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {isDarkMode ? (
                  <SunIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              ) : (
                  <MoonIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              )}
            </button>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
      </motion.div>

        {/* Main Content */}
      <div className={`transition-all duration-300 ${isSidebarOpen ? 'ml-70' : 'ml-0'}`}>
        {/* Top Bar */}
        <div className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <HomeIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            </button>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                <BellIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default Layout; 