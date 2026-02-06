import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { menuService, MenuItem as APIMenuItem } from '../services/menuService';
import { ShoppingCartIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface CartItem extends APIMenuItem {
  quantity: number;
}

const Menu: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as any;
  const [searchParams] = useSearchParams();

  // Get table number from URL query parameter
  const tableNumber = searchParams.get('table');
  const isGuestMode = !!tableNumber; // Guest mode if table parameter exists

  const [menuItems, setMenuItems] = useState<APIMenuItem[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [showGuestNameModal, setShowGuestNameModal] = useState(false);
  const [recommendations, setRecommendations] = useState<APIMenuItem[]>([]);
  const [showRecommendationsModal, setShowRecommendationsModal] = useState(false);

  // Clear cart after successful order
  useEffect(() => {
    if (location.state?.clearCart) {
      setCart([]);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  useEffect(() => {
    loadMenu();
    // Load cart from localStorage
    const cartKey = isGuestMode ? `guest_cart_table_${tableNumber}` : `cart_${user?.id}`;
    const savedCart = localStorage.getItem(cartKey);
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }

    // Load guest name if exists
    if (isGuestMode) {
      const savedGuestName = localStorage.getItem(`guest_name_table_${tableNumber}`);
      if (savedGuestName) {
        setGuestName(savedGuestName);
      }
    }
  }, [selectedCategory, user, tableNumber, isGuestMode]);

  const loadMenu = async () => {
    setLoading(true);
    const filters = selectedCategory ? { category_id: selectedCategory } : {};

    const [menuResult, categoriesResult] = await Promise.all([
      menuService.getMenu(filters),
      menuService.getCategories(),
    ]);

    if (menuResult.success) setMenuItems(menuResult.data);
    if (categoriesResult.success) setCategories(categoriesResult.data);
    setLoading(false);
  }

  // Fetch User Recommendations if logged in
  useEffect(() => {
    if (!isGuestMode && user) {
      menuService.getUserRecommendations(user.id).then(res => {
        if (res.success) setRecommendations(res.data);
      });
    }
  }, [isGuestMode, user]);





  const addToCart = (item: APIMenuItem) => {
    // For guest mode, ask for name on first add
    if (isGuestMode && !guestName) {
      setShowGuestNameModal(true);
      // Store the item to add after name is provided
      (window as any).pendingCartItem = item;
      return;
    }

    // Check if user is logged in (for non-guest mode)
    if (!isGuestMode && !user) {
      if (window.confirm('Please login to add items to cart. Go to login page?')) {
        navigate('/auth');
      }
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
    const cartKey = isGuestMode ? `guest_cart_table_${tableNumber}` : `cart_${user?.id}`;
    localStorage.setItem(cartKey, JSON.stringify(newCart));

    // Check for recommendations
    if (!item.id) return; // Safety check

    // Only fetch if this is a direct add (not from recommendations list to avoid loops)
    const isRecommendationAdd = (window as any).isRecommendationAdd;
    if (!isRecommendationAdd) {
      menuService.getItemRecommendations(item.id).then(res => {
        if (res.success && res.data.length > 0) {
          setRecommendations(res.data);
          setShowRecommendationsModal(true);
        } else {
          alert(`${item.name} added to cart!`);
        }
      });
    } else {
      alert(`${item.name} added to cart!`);
      (window as any).isRecommendationAdd = false;
    }
  };

  const handleGuestNameSubmit = () => {
    if (!guestName.trim()) {
      alert('Please enter your name');
      return;
    }

    localStorage.setItem(`guest_name_table_${tableNumber}`, guestName);
    setShowGuestNameModal(false);

    // Add the pending item
    const pendingItem = (window as any).pendingCartItem;
    if (pendingItem) {
      addToCart(pendingItem);
      (window as any).pendingCartItem = null;
    }
  };

  const removeFromCart = (itemId: number) => {
    const newCart = cart.filter(item => item.id !== itemId);
    setCart(newCart);
    const cartKey = isGuestMode ? `guest_cart_table_${tableNumber}` : `cart_${user?.id}`;
    localStorage.setItem(cartKey, JSON.stringify(newCart));
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
    const cartKey = isGuestMode ? `guest_cart_table_${tableNumber}` : `cart_${user?.id}`;
    localStorage.setItem(cartKey, JSON.stringify(newCart));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    if (isGuestMode) {
      // For guest orders, navigate to guest checkout
      navigate('/guest-checkout', {
        state: {
          cart,
          tableNumber,
          guestName
        }
      });
    } else {
      // For logged-in users, use regular checkout
      navigate('/checkout', { state: { cart } });
    }
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Menu</h1>
              {!isGuestMode && user && (
                <button
                  onClick={() => navigate('/my-orders')}
                  className="text-sm text-orange-600 hover:text-orange-700 font-semibold"
                >
                  📋 My Orders
                </button>
              )}
              {isGuestMode && (
                <p className="text-sm text-gray-600 mt-1">
                  🪑 Table {tableNumber} {guestName && `• ${guestName}`}
                </p>
              )}
            </div>
            <button
              onClick={() => setShowCart(true)}
              className="relative p-2 bg-orange-500 text-white rounded-full hover:bg-orange-600"
            >
              <ShoppingCartIcon className="h-6 w-6" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
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
              placeholder="Search menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Categories */}
          <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full whitespace-nowrap ${selectedCategory === null
                ? 'bg-orange-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              All
            </button>
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full whitespace-nowrap ${selectedCategory === category.id
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended For You Section */}
      {!isGuestMode && user && recommendations.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 py-8 mb-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>✨</span> Recommended For You
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {recommendations.map(item => (
              <div key={item.id} className="bg-white rounded-xl shadow-md p-4 border border-orange-100 hover:shadow-lg transition-all cursor-pointer" onClick={() => addToCart(item)}>
                {item.image_url && (
                  <img src={item.image_url} alt={item.name} className="w-full h-32 object-cover rounded-lg mb-3" />
                )}
                <h3 className="font-bold text-gray-800 text-sm truncate">{item.name}</h3>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-orange-600 font-bold text-sm">Rs. {item.price.toFixed(0)}</span>
                  <div className="bg-orange-100 p-1 rounded-full text-orange-600">
                    <ShoppingCartIcon className="h-4 w-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Menu Items */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {item.image_url && (
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xl font-bold text-orange-600">
                    Rs. {item.price.toFixed(2)}
                  </span>
                  <button
                    onClick={() => addToCart(item)}
                    disabled={!item.is_available}
                    className={`px-4 py-2 rounded-lg font-medium ${item.is_available
                      ? 'bg-orange-500 text-white hover:bg-orange-600'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                  >
                    {item.is_available ? 'Add to Cart' : 'Unavailable'}
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
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Welcome! 👋</h3>
            <p className="text-gray-600 mb-4">Please enter your name to continue ordering:</p>
            <input
              type="text"
              placeholder="Your name"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-orange-500"
              onKeyPress={(e) => e.key === 'Enter' && handleGuestNameSubmit()}
            />
            <div className="flex gap-2">
              <button
                onClick={handleGuestNameSubmit}
                className="flex-1 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
              >
                Continue
              </button>
              <button
                onClick={() => setShowGuestNameModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
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
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl flex flex-col">
            {/* Cart Header */}
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">Your Cart</h2>
              <button
                onClick={() => setShowCart(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map(item => (
                    <div key={item.id} className="flex gap-4 bg-gray-50 p-3 rounded-lg">
                      {item.image_url && (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-orange-600 font-bold">Rs. {item.price.toFixed(2)}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300"
                          >
                            -
                          </button>
                          <span className="font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300"
                          >
                            +
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="ml-auto text-red-500 hover:text-red-700"
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
              <div className="border-t p-4 space-y-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-orange-600">Rs. {getTotalPrice().toFixed(2)}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Recommendations Modal */}
      {showRecommendationsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">✨ Great Choice! People also ordered...</h3>
              <button onClick={() => setShowRecommendationsModal(false)} className="text-gray-500 hover:text-gray-700">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {recommendations.map(rec => (
                <div key={rec.id} className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
                  {rec.image_url && (
                    <img src={rec.image_url} alt={rec.name} className="w-full h-32 object-cover rounded-md mb-2" />
                  )}
                  <h4 className="font-semibold text-gray-800 truncate">{rec.name}</h4>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-orange-600 font-bold">Rs. {rec.price}</span>
                    <button
                      onClick={() => {
                        (window as any).isRecommendationAdd = true;
                        addToCart(rec);
                      }}
                      className="bg-orange-100 text-orange-600 p-2 rounded-full hover:bg-orange-200"
                    >
                      <ShoppingCartIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowRecommendationsModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Keep Shopping
              </button>
              <button
                onClick={() => {
                  setShowRecommendationsModal(false);
                  setShowCart(true);
                }}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium"
              >
                Go to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
