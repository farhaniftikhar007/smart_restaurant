import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

const GuestCheckout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, tableNumber, guestName } = location.state || {};

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!cart || !tableNumber) {
    navigate('/menu');
    return null;
  }

  const getTotalPrice = () => {
    return cart.reduce((total: number, item: CartItem) => total + (item.price * item.quantity), 0);
  };

  const handlePlaceOrder = async () => {
    console.log('🛒 Placing order...', { cart, tableNumber, guestName });
    setSubmitting(true);
    setError(null);
    
    try {
      const orderData = {
        table_number: parseInt(tableNumber),
        guest_name: guestName,
        items: cart.map((item: CartItem) => ({
          menu_item_id: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        total_amount: getTotalPrice(),
        status: 'pending',
        order_type: 'dine_in'
      };

      console.log('📤 Sending order data:', orderData);

      const response = await axios.post(`${API_BASE_URL}/api/orders/guest`, orderData);

      console.log('✅ Order response:', response.data);

      if (response.data && response.data.order_number) {
        // Clear cart
        localStorage.removeItem(`guest_cart_table_${tableNumber}`);
        
        console.log('🔄 Navigating to order status:', response.data.order_number);
        
        // Navigate to order status page
        navigate(`/order-status/${response.data.order_number}`, {
          state: { tableNumber, guestName },
          replace: true
        });
      } else {
        console.error('❌ No order number in response');
        setError('Order placed but no order number received');
      }
    } catch (error: any) {
      console.error('❌ Error placing order:', error);
      console.error('Error response:', error.response?.data);
      setError(error.response?.data?.detail || error.message || 'Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-6">Confirm Your Order</h1>

          {/* Order Details */}
          <div className="mb-6">
            <div className="flex justify-between text-gray-600 mb-2">
              <span>Table Number:</span>
              <span className="font-semibold">Table {tableNumber}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Name:</span>
              <span className="font-semibold">{guestName}</span>
            </div>
          </div>

          {/* Cart Items */}
          <div className="border-t border-b py-4 mb-6">
            <h2 className="font-semibold text-lg mb-4">Order Items:</h2>
            <div className="space-y-3">
              {cart.map((item: CartItem) => (
                <div key={item.id} className="flex justify-between">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">Rs. {(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-between text-xl font-bold mb-6">
            <span>Total:</span>
            <span className="text-orange-600">Rs. {getTotalPrice().toFixed(2)}</span>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={() => navigate(-1)}
              disabled={submitting}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 disabled:opacity-50"
            >
              Back to Menu
            </button>
            <button
              onClick={handlePlaceOrder}
              disabled={submitting}
              className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestCheckout;
