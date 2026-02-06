import { API_BASE_URL } from "../config/api";
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

const Checkout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const cart: CartItem[] = location.state?.cart || [];
  const tableId = location.state?.tableId || null;
  const [loading, setLoading] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState('');

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const handlePlaceOrder = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('Please login first!');
      navigate('/auth');
      return;
    }

    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        items: cart.map(item => ({
          menu_item_id: item.id,
          quantity: item.quantity
        })),
        table_number: tableId ? String(tableId) : undefined,
        notes: specialInstructions || undefined
      };

      const response = await axios.post(
        `${API_BASE_URL}/api/orders`,
        orderData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );


      alert(`Order placed successfully! Order #${response.data.order_number}`);
      // Clear cart from local storage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user && user.id) {
        localStorage.removeItem(`cart_${user.id}`);
      }

      // Notify Menu.tsx to clear cart (if mounted/listening)
      window.dispatchEvent(new CustomEvent('clearCart'));

      // Navigate to My Orders page instead of Menu
      navigate('/my-orders');

    } catch (error: any) {
      console.error('Order error:', error);

      if (error.response?.status === 401) {
        alert('Session expired. Please login again.');
        navigate('/auth');
      } else {
        alert(error.response?.data?.detail || 'Failed to place order. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Order Summary</h1>

          {cart.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-gray-600 mb-4">Your cart is empty</p>
              <button
                onClick={() => navigate('/menu')}
                className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
              >
                Go to Menu
              </button>
            </div>
          ) : (
            <>
              {tableId && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-blue-800 font-medium">📍 Table {tableId}</p>
                </div>
              )}

              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="space-y-4">
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between items-center py-2 border-b">
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-medium">Rs. {(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Instructions (Optional)
                  </label>
                  <textarea
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="Any special requests for your order..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    rows={3}
                  />
                </div>

                <div className="mt-6 pt-4 border-t">
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Total</span>
                    <span>Rs. {cartTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => navigate('/menu')}
                  disabled={loading}
                  className="flex-1 py-3 px-6 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
                >
                  Back to Menu
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="flex-1 py-3 px-6 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Placing Order...' : 'Place Order'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
