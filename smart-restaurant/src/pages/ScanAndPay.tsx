import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import QRCodeGenerator from '../components/QRCodeGenerator';

const ScanAndPay: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [amount, setAmount] = useState<number>(0);
  const [tableId, setTableId] = useState<string>('');

  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const table = params.get('table');
    const total = params.get('amount');
    
    if (table) {
      setTableId(table);
    }
    if (total) {
      setAmount(parseFloat(total));
    }
  }, [location]);

  const handlePayment = () => {
    // Here you would typically integrate with a payment gateway
    alert('Payment processed successfully!');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
          Payment Details
        </h2>
        
        <div className="mb-8">
          <QRCodeGenerator 
            tableId={tableId} 
            type="payment"
            amount={amount}
          />
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Table Number
            </label>
            <p className="mt-1 text-lg font-semibold">{tableId}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Amount to Pay
            </label>
            <p className="mt-1 text-lg font-semibold">${amount.toFixed(2)}</p>
          </div>

          <button
            onClick={handlePayment}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Process Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScanAndPay; 