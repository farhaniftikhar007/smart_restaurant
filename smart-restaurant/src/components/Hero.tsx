import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-r from-gray-900 to-gray-800 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 pattern-bg"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-32">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2 text-white mb-12 lg:mb-0"
          >
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Smart Dining
              <span className="text-orange-500"> Experience</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Scan, Order, and Enjoy. Experience the future of dining with our smart ordering system.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/menu" 
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition duration-300 text-center"
              >
                Start Ordering
              </Link>
              <Link 
                to="/about" 
                className="bg-transparent border-2 border-white hover:bg-white hover:text-gray-900 text-white px-8 py-3 rounded-lg font-semibold transition duration-300 text-center"
              >
                Learn More
              </Link>
            </div>
          </motion.div>

          {/* Image/Illustration */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:w-1/2"
          >
            <img 
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" 
              alt="Smart Restaurant Ordering" 
              className="w-full max-w-lg mx-auto rounded-lg shadow-2xl"
            />
          </motion.div>
        </div>

        {/* Features Section */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20"
        >
          {[
            {
              icon: "📱",
              title: "Digital Menu",
              description: "Browse our menu digitally with real-time updates"
            },
            {
              icon: "⚡",
              title: "Quick Ordering",
              description: "Place orders instantly with our QR system"
            },
            {
              icon: "📊",
              title: "Track Orders",
              description: "Real-time order tracking and status updates"
            }
          ].map((feature, index) => (
            <div 
              key={index}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-white hover:bg-white/20 transition duration-300"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Hero; 