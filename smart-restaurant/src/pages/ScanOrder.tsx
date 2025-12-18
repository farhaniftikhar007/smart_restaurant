/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { QrCodeIcon, DevicePhoneMobileIcon, ClockIcon } from '@heroicons/react/24/outline';
import { QRCodeSVG } from 'qrcode.react';

const ScanOrder: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Scan & Order
          </h1>
          <p className="mt-4 text-xl text-gray-500">
            Scan the QR code at your table to start ordering
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* QR Code Display */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
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

            {/* Instructions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  How to Order
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-orange-600 text-white">
                        <QrCodeIcon className="h-6 w-6" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">1. Scan the QR Code</h3>
                      <p className="mt-2 text-gray-500">
                        Use your phone's camera to scan the QR code at your table
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
                      <h3 className="text-lg font-medium text-gray-900">2. Browse Menu</h3>
                      <p className="mt-2 text-gray-500">
                        View our digital menu and select your desired items
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
                      <h3 className="text-lg font-medium text-gray-900">3. Track Order</h3>
                      <p className="mt-2 text-gray-500">
                        Get real-time updates on your order status
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-orange-900 mb-2">
                  Need Help?
                </h3>
                <p className="text-orange-700">
                  If you're having trouble scanning the QR code, please ask our staff for assistance.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScanOrder; 