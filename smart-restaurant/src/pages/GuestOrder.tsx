import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { menuService, MenuItem as APIMenuItem } from '../services/menuService';
import { ShoppingCartIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface CartItem extends APIMenuItem {
  quantity: number;
}

const GuestOrder: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const tableNumber = searchParams.get('table');
  
  const [menuItems, setMenuItems] = useState<APIMenuItem[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [showGuestNameModal, setShowGuestNameModal] = useState(false);

  // All hooks must come before any conditional returns
  useEffect(() => {
    if (tableNumber) {
      loadMenu();
      const savedCart = localStorage.getItem(`guest_cart_table_${tableNumber}`);
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
      
      const savedGuestName = localStorage.getItem(`guest_name_table_${tableNumber}`);
      if (savedGuestName) {
        setGuestName(savedGuestName);
      }
    }
  }, [selectedCategory, tableNumber]);

  // NOW we can do conditional rendering
  if (!tableNumber) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid QR Code</h1>
          <p className="text-gray-600">Please scan a valid table QR code</p>
        </div>
      </div>
    );
  }

  const loadMenu = async () => {
    setLoading(true);
    const filters = selectedCategory ? { category_id: selectedCategory } : {};
    
    const [menuResult, categoriesResult] = await Promise.all([
      menuService.getMenu(filters),
      menuService.getCategories(),
    ]);

    if (menuResult.success) {
      setMenuItems(menuResult.data);
    }

    if (categoriesResult.success) {
      setCategories(categoriesResult.data);
    }

    setLoading(false);
  };
  const addToCart = (item: APIMenuItem) => {
    // Ask for name on first add
    if (!guestName) {
      setShowGuestNameModal(true);
      (window as any).pendingCartItem = item;
      return;
    }

    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    
    let newCart: CartItem[];
    if (existingItem) {
      newCart = cart.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      );
    } else {
      newCart = [...cart, { ...item, quantity: 1 }];
    }
    
    setCart(newCart);
    localStorage.setItem(`guest_cart_table_${tableNumber}`, JSON.stringify(newCart));
  };

  const handleGuestNameSubmit = () => {
    if (!guestName.trim()) {
      alert('Please enter your name');
      return;
    }
    
    localStorage.setItem(`guest_name_table_${tableNumber}`, guestName);
    setShowGuestNameModal(false);
    
    const pendingItem = (window as any).pendingCartItem;
    if (pendingItem) {
      addToCart(pendingItem);
      (window as any).pendingCartItem = null;
    }
  };

  const removeFromCart = (itemId: number) => {
    const newCart = cart.filter(item => item.id !== itemId);
    setCart(newCart);
    localStorage.setItem(`guest_cart_table_${tableNumber}`, JSON.stringify(newCart));
  };

  const updateQuantity = (itemId: number, change: number) => {
    const newCart = cart.map(item => {
      if (item.id === itemId) {
        const newQuantity = Math.max(1, item.quantity + change);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(item => item.quantity > 0);
    
    setCart(newCart);
    localStorage.setItem(`guest_cart_table_${tableNumber}`, JSON.stringify(newCart));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    navigate('/guest-checkout', { 
      state: { 
        cart, 
        tableNumber,
        guestName 
      } 
    });
  };

  const filteredItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading menu...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-orange-600">🍽️ Dastarkhwan</h1>
              <p className="text-sm text-gray-600 mt-1">
                🪑 Table {tableNumber} {guestName && `• Welcome, ${guestName}!`}
              </p>
            </div>
            <button
              onClick={() => setShowCart(true)}
              className="relative p-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 shadow-lg"
            >
              <ShoppingCartIcon className="h-7 w-7" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold">
                  {cart.length}
                </span>
              )}
            </button>
          </div>

          {/* Search */}
          <div className="mt-4 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search delicious food..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Categories */}
          <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full whitespace-nowrap font-medium ${
                selectedCategory === null
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-orange-300'
              }`}
            >
              All Items
            </button>
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full whitespace-nowrap font-medium ${
                  selectedCategory === category.id
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-orange-300'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <div key={item.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow border-2 border-transparent hover:border-orange-300">
              {item.image_url && (
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{item.description}</p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-2xl font-bold text-orange-600">
                    Rs. {item.price.toFixed(2)}
                  </span>
                  <button
                    onClick={() => addToCart(item)}
                    disabled={!item.is_available}
                    className={`px-5 py-2 rounded-lg font-semibold text-sm ${
                      item.is_available
                        ? 'bg-orange-500 text-white hover:bg-orange-600 shadow-md'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {item.is_available ? '+ Add' : 'Unavailable'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No items found</p>
          </div>
        )}
      </div>

      {/* Guest Name Modal */}
      {showGuestNameModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold mb-2">Welcome! 👋</h3>
            <p className="text-gray-600 mb-6">Please enter your name to start ordering:</p>
            <input
              type="text"
              placeholder="Your name"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && handleGuestNameSubmit()}
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={handleGuestNameSubmit}
                className="flex-1 bg-orange-500 text-white px-4 py-3 rounded-lg hover:bg-orange-600 font-semibold"
              >
                Continue
              </button>
              <button
                onClick={() => setShowGuestNameModal(false)}
                className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col">
            {/* Cart Header */}
            <div className="p-6 bg-orange-500 text-white flex justify-between items-center">
              <h2 className="text-2xl font-bold">Your Order</h2>
              <button
                onClick={() => setShowCart(false)}
                className="p-2 hover:bg-orange-600 rounded-full"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">Your cart is empty</p>
                  <p className="text-gray-400 text-sm mt-2">Add some delicious items!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map(item => (
                    <div key={item.id} className="flex gap-4 bg-orange-50 p-4 rounded-lg border-2 border-orange-100">
                      {item.image_url && (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">{item.name}</h3>
                        <p className="text-orange-600 font-bold text-lg">Rs. {item.price.toFixed(2)}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-8 h-8 bg-orange-500 text-white rounded-full hover:bg-orange-600 font-bold"
                          >
                            -
                          </button>
                          <span className="font-bold text-lg">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-8 h-8 bg-orange-500 text-white rounded-full hover:bg-orange-600 font-bold"
                          >
                            +
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="ml-auto text-red-500 hover:text-red-700 font-semibold text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Footer */}
            {cart.length > 0 && (
              <div className="border-t-2 p-6 space-y-4 bg-gray-50">
                <div className="flex justify-between text-xl font-bold">
                  <span>Total:</span>
                  <span className="text-orange-600">Rs. {getTotalPrice().toFixed(2)}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-orange-500 text-white py-4 rounded-lg font-bold text-lg hover:bg-orange-600 shadow-lg"
                >
                  Place Order →
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GuestOrder;
