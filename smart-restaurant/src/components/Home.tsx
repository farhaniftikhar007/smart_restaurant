import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ChartBarIcon,
  ClipboardDocumentListIcon,
  QrCodeIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const Home: React.FC = () => {
  const features = [
    {
      title: 'Dashboard',
      description: 'Monitor orders, revenue, and popular items in real-time',
      icon: ChartBarIcon,
      link: '/dashboard'
    },
    {
      title: 'Menu Management',
      description: 'Add, edit, and manage your restaurant menu items',
      icon: ClipboardDocumentListIcon,
      link: '/menu'
    },
    {
      title: 'Order Tracking',
      description: 'Track and manage customer orders efficiently',
      icon: UserGroupIcon,
      link: '/orders'
    },
    {
      title: 'QR Code Generator',
      description: 'Generate QR codes for tables and menu access',
      icon: QrCodeIcon,
      link: '/qr-generator'
    },
    {
      title: 'Settings',
      description: 'Configure restaurant settings and preferences',
      icon: Cog6ToothIcon,
      link: '/settings'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl"
                >
                  <span className="block">Smart Restaurant</span>
                  <span className="block text-indigo-600 dark:text-indigo-400">Management System</span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-3 text-base text-gray-500 dark:text-gray-400 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0"
                >
                  Streamline your restaurant operations with our comprehensive management system. 
                  Monitor orders, manage your menu, and enhance customer experience.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start"
                >
                  <div className="rounded-md shadow">
                    <Link
                      to="/dashboard"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                    >
                      Get Started
                      <ArrowRightIcon className="ml-2 h-5 w-5" />
                    </Link>
                  </div>
                </motion.div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 dark:text-indigo-400 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Everything you need to manage your restaurant
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  <Link to={feature.link} className="block">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <feature.icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                            {feature.title}
                          </h3>
                          <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-base text-gray-500 dark:text-gray-400">
            &copy; 2024 Smart Restaurant Management System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home; 