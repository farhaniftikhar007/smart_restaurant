import { API_BASE_URL } from "../config/api";
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

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

  if (!cart || !tableNumber) {
    navigate('/menu');
    return null;
  }

  const getTotalPrice = () => {
    return cart.reduce((total: number, item: CartItem) => total + (item.price * item.quantity), 0);
  };

  const handlePlaceOrder = async () => {
    setSubmitting(true);
    
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

      const response = await axios.post(`${API_BASE_URL}/api/orders/guest`, orderData);

      if (response.data) {
        // Clear cart
        localStorage.removeItem(`guest_cart_table_${tableNumber}`);
        
        // Navigate to order status page
        navigate(`/order-status/${response.data.order_number}`, {
          state: { tableNumber, guestName }
        });
      }
    } catch (error: any) {
      console.error('Error placing order:', error);
      alert(error.response?.data?.detail || 'Failed to place order. Please try again.');
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

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50"
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
