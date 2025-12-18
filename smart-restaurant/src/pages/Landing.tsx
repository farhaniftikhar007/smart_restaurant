/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DevicePhoneMobileIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  CreditCardIcon,
  QrCodeIcon,
  DocumentTextIcon,
  ShoppingCartIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { QRCodeSVG } from 'qrcode.react';

const Landing: React.FC = () => {
  const [isImageExpanded, setIsImageExpanded] = useState(false);
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (isImageExpanded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isImageExpanded]);

  const handleImageClick = () => {
    setIsImageExpanded(true);
    setScale(1);
    // Smooth scroll to top with easing
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleClose = () => {
    setIsImageExpanded(false);
    setScale(1);
  };

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.2, 2));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.2, 0.5));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-screen">
        <motion.div 
          className="absolute inset-0"
          animate={{
            position: isImageExpanded ? 'fixed' : 'absolute',
            zIndex: isImageExpanded ? 50 : 0,
          }}
        >
          <motion.img
            className="w-full h-full object-cover cursor-pointer"
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3"
            alt="Restaurant interior"
            onClick={handleImageClick}
            animate={{
              scale: isImageExpanded ? scale : 1,
              filter: isImageExpanded ? 'brightness(0.7)' : 'brightness(1)',
            }}
            transition={{ 
              duration: 0.3,
              ease: "easeInOut"
            }}
            drag={isImageExpanded}
            dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
            dragElastic={0.1}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={() => setIsDragging(false)}
            style={{ cursor: isImageExpanded ? (isDragging ? 'grabbing' : 'grab') : 'pointer' }}
          />
          <motion.div 
            className="absolute inset-0 bg-black"
            animate={{
              opacity: isImageExpanded ? 0.6 : 0.4,
            }}
          />
        </motion.div>
        
        <motion.div 
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center"
          animate={{
            y: isImageExpanded ? 100 : 0,
            opacity: isImageExpanded ? 0 : 1,
          }}
          transition={{ 
            duration: 0.4,
            ease: "easeInOut"
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl font-extrabold text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
              Welcome to Smart Restaurant
            </h1>
            <p className="mt-6 text-xl text-gray-200 max-w-3xl mx-auto">
              Order fast. Eat smart. Fully contactless experience.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/menu"
                  className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 md:py-4 md:text-lg md:px-10 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  View Menu
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/menu"
                  className="px-8 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-white hover:text-gray-900 md:py-4 md:text-lg md:px-10 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Start Ordering
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Enhanced controls for expanded image */}
        <AnimatePresence>
          {isImageExpanded && (
            <>
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={handleClose}
                className="fixed top-4 right-4 z-50 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 flex gap-4"
              >
                <motion.button
                  onClick={handleZoomOut}
                  className="bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </motion.button>
                <motion.button
                  onClick={handleZoomIn}
                  className="bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </motion.button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed bottom-4 right-4 z-50 text-white text-sm"
              >
                Drag to pan • Scroll to zoom
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Why Choose Smart Restaurant?
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Experience the future of dining with our innovative features
            </p>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="flex justify-center">
                <DevicePhoneMobileIcon className="h-12 w-12 text-orange-600" />
              </div>
              <h3 className="mt-6 text-lg font-medium text-gray-900">Digital Ordering</h3>
              <p className="mt-2 text-gray-500">No waiters needed. Order from your phone.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <div className="flex justify-center">
                <ClockIcon className="h-12 w-12 text-orange-600" />
              </div>
              <h3 className="mt-6 text-lg font-medium text-gray-900">Real-Time Tracking</h3>
              <p className="mt-2 text-gray-500">Track your food status live.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center"
            >
              <div className="flex justify-center">
                <CheckCircleIcon className="h-12 w-12 text-orange-600" />
              </div>
              <h3 className="mt-6 text-lg font-medium text-gray-900">Error-Free Orders</h3>
              <p className="mt-2 text-gray-500">Direct to kitchen – no mistakes.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center"
            >
              <div className="flex justify-center">
                <CreditCardIcon className="h-12 w-12 text-orange-600" />
              </div>
              <h3 className="mt-6 text-lg font-medium text-gray-900">Online Payments</h3>
              <p className="mt-2 text-gray-500">Pay securely and cashless.</p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* QR Scan Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Scan & Order
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Quick and easy ordering with QR code
            </p>
          </div>

          <div className="mt-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col items-center"
              >
                <div className="bg-white p-8 rounded-lg shadow-xl">
                  <QRCodeSVG 
                    value="https://smartrestaurant.com/menu" 
                    size={256}
                    level="H"
                    includeMargin={true}
                    className="rounded-lg"
                  />
                </div>
                <p className="mt-4 text-sm text-gray-500">
                  Scan this QR code to view our menu
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-6"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-orange-600 text-white">
                      <QrCodeIcon className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Instant Access</h3>
                    <p className="mt-2 text-gray-500">
                      Scan the QR code at your table to instantly access our digital menu
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-orange-600 text-white">
                      <DevicePhoneMobileIcon className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Mobile Friendly</h3>
                    <p className="mt-2 text-gray-500">
                      View menu items, prices, and place orders directly from your phone
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-orange-600 text-white">
                      <ClockIcon className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Real-Time Updates</h3>
                    <p className="mt-2 text-gray-500">
                      Get instant updates on your order status and estimated delivery time
                    </p>
                  </div>
                </div>

                <div className="mt-8">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to="/menu"
                      className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      Start Ordering Now
                      <QrCodeIcon className="ml-2 h-5 w-5" />
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-orange-600">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to experience smart dining?</span>
            <span className="block text-orange-200">Start ordering today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex rounded-md shadow"
            >
              <Link
                to="/menu"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-orange-600 bg-white hover:bg-orange-50 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Start Ordering
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="ml-3 inline-flex rounded-md shadow"
            >
              <Link
                to="/reservation"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-700 hover:bg-orange-800 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Reserve a Table
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Smart Restaurant</h3>
              <p className="text-gray-400">
                Experience the future of dining with our smart restaurant management system.
              </p>
            </div>
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/menu" className="text-gray-400 hover:text-white">Menu</Link></li>
                <li><Link to="/reservation" className="text-gray-400 hover:text-white">Reservations</Link></li>
                <li><Link to="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link to="/terms" className="text-gray-400 hover:text-white">Terms of Service</Link></li>
                <li><Link to="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
                <li><Link to="/faq" className="text-gray-400 hover:text-white">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Contact Us</h3>
              <ul className="space-y-2 text-gray-400">
                <li>123 Restaurant Street</li>
                <li>City, State 12345</li>
                <li>Phone: (123) 456-7890</li>
                <li>Email: info@smartrestaurant.com</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-800 pt-8">
            <p className="text-gray-400 text-center">
              © {new Date().getFullYear()} Smart Restaurant. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing; 