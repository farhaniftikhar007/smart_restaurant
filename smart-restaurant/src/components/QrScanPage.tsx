import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

interface OrderDetails {
  tableNumber: number;
  totalAmount: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

const QrScanPage: React.FC = () => {
  const [isPaid, setIsPaid] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [orderDetails, setOrderDetails] = useState<OrderDetails>({
    tableNumber: 5,
    totalAmount: 45.99,
    items: [
      { name: 'Margherita Pizza', quantity: 1, price: 12.99 },
      { name: 'Caesar Salad', quantity: 1, price: 8.99 },
      { name: 'Soft Drinks', quantity: 2, price: 4.99 },
    ],
  });

  useEffect(() => {
    // Check if payment status exists in localStorage
    const paymentStatus = localStorage.getItem(`table${orderDetails.tableNumber}Paid`);
    if (paymentStatus === 'true') {
      setIsPaid(true);
    }
  }, [orderDetails.tableNumber]);

  const handlePaymentConfirm = () => {
    // Store payment status in localStorage
    localStorage.setItem(`table${orderDetails.tableNumber}Paid`, 'true');
    setIsPaid(true);
    setShowConfirmation(true);

    // Hide confirmation after 3 seconds
    setTimeout(() => {
      setShowConfirmation(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Scan & Pay
          </h1>
          <p className="mt-4 text-xl text-gray-500">
            Complete your payment using the QR code
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            {/* QR Code and Payment Status */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col items-center"
            >
              <div className="bg-white p-8 rounded-lg shadow-xl">
                <QRCodeSVG 
                  value={`https://smartrestaurant.com/pay?table=${orderDetails.tableNumber}&amount=${orderDetails.totalAmount}`}
                  size={256}
                  level="H"
                  includeMargin={true}
                  className="rounded-lg"
                />
              </div>
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                  Scan this QR code to make your payment
                </p>
                {isPaid && (
                  <div className="mt-4 flex items-center justify-center text-green-600">
                    <CheckCircleIcon className="h-6 w-6 mr-2" />
                    <span>Payment Completed</span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Order Summary
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b">
                  <span className="text-gray-600">Table Number</span>
                  <span className="font-semibold">#{orderDetails.tableNumber}</span>
                </div>

                <div className="space-y-3">
                  {orderDetails.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-medium">${item.price.toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium text-gray-900">Total Amount</span>
                    <span className="text-2xl font-bold text-orange-600">
                      ${orderDetails.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>

                {!isPaid && (
                  <button
                    onClick={handlePaymentConfirm}
                    className="mt-6 w-full bg-orange-600 text-white py-3 px-4 rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors"
                  >
                    I Have Paid
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Payment Confirmation Toast */}
        {showConfirmation && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg"
          >
            <div className="flex items-center">
              <CheckCircleIcon className="h-6 w-6 mr-2" />
              <span>Payment confirmed successfully!</span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default QrScanPage; 