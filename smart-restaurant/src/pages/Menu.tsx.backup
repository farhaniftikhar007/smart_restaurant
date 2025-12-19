import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { menuService, MenuItem as APIMenuItem } from '../services/menuService';
import { ShoppingCartIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface CartItem extends APIMenuItem {
  quantity: number;
}

const Menu: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState<APIMenuItem[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    loadMenu();
    // Load cart from localStorage only if user is logged in
    if (user) {
      const savedCart = localStorage.getItem(`cart_${user.id}`);
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    }
  }, [selectedCategory, user]);

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
    // Check if user is logged in
    if (!user) {
      if (window.confirm('Please login to add items to cart. Go to login page?')) {
        window.location.href = '/auth';
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
    localStorage.setItem(`cart_${user.id}`, JSON.stringify(newCart));
    
    // Show notification
    alert(`${item.name} added to cart!`);
  };

  const removeFromCart = (itemId: number) => {
    if (!user) return;
    
    const newCart = cart.filter(item => item.id !== itemId);
    setCart(newCart);
    localStorage.setItem(`cart_${user.id}`, JSON.stringify(newCart));
  };

  const updateQuantity = (itemId: number, change: number) => {
    if (!user) return;
    
    const newCart = cart.map(item => {
      if (item.id === itemId) {
        const newQuantity = item.quantity + change;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }).filter(item => item.quantity > 0);
    
    setCart(newCart);
    localStorage.setItem(`cart_${user.id}`, JSON.stringify(newCart));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const filteredItems = menuItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading menu...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Our Menu</h1>
            
            {/* Cart Button - Only show if logged in */}
            {user && (
              <button
                onClick={() => setShowCart(true)}
                className="relative bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 flex items-center gap-2"
              >
                <ShoppingCartIcon className="w-6 h-6" />
                Cart
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </button>
            )}
            
            {/* Login Button - Show if not logged in */}
            {!user && (
              <button
                onClick={() => navigate('/auth')}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
              >
                Login to Order
              </button>
            )}
          </div>
          
          {/* Search Bar */}
          <div className="relative max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Filter */}
        <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              selectedCategory === null
                ? 'bg-orange-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === category.id
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Menu Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No items found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* Image */}
                <div className="relative h-48 bg-gray-200">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/400x300?text=No+Image';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                  
                  {/* Availability Badge */}
                  <div className="absolute top-2 right-2">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        item.is_available
                          ? 'bg-green-500 text-white'
                          : 'bg-red-500 text-white'
                      }`}
                    >
                      {item.is_available ? 'Available' : 'Unavailable'}
                    </span>
                  </div>

                  {/* Dietary Badges */}
                  <div className="absolute top-2 left-2 flex gap-1">
                    {item.is_vegetarian && (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                        🌱 Veg
                      </span>
                    )}
                    {item.is_spicy && (
                      <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                        🌶️ Spicy
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                    <span className="text-lg font-bold text-orange-500">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {item.description || 'No description available'}
                  </p>

                  {/* Category */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <span className="bg-gray-100 px-2 py-1 rounded">
                      {item.category.name}
                    </span>
                    {item.preparation_time && (
                      <span>⏱️ {item.preparation_time} min</span>
                    )}
                  </div>

                  {/* Calories */}
                  {item.calories && (
                    <div className="text-xs text-gray-500 mb-3">
                      🔥 {item.calories} cal
                    </div>
                  )}

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => {
                      if (!user && item.is_available) {
                        window.location.href = '/auth';
                      } else {
                        addToCart(item);
                      }
                    }}
                    disabled={!item.is_available}
                    className={`w-full py-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                      item.is_available
                        ? 'bg-orange-500 text-white hover:bg-orange-600'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <ShoppingCartIcon className="w-5 h-5" />
                    {item.is_available ? (user ? 'Add to Cart' : 'Login to Order') : 'Unavailable'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cart Sidebar - Only for logged in users */}
      {user && showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
          <div className="bg-white w-full max-w-md h-full overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Your Cart</h2>
                <button
                  onClick={() => setShowCart(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCartIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">Your cart is empty</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map((item) => (
                      <div key={item.id} className="flex gap-4 bg-gray-50 p-4 rounded-lg">
                        <img
                          src={item.image_url || 'https://via.placeholder.com/80'}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold">{item.name}</h3>
                          <p className="text-sm text-gray-600">${item.price.toFixed(2)}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300"
                            >
                              -
                            </button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300"
                            >
                              +
                            </button>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="ml-auto text-red-500 hover:text-red-700 text-sm"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between text-xl font-bold mb-4">
                      <span>Total:</span>
                      <span>${getTotalPrice().toFixed(2)}</span>
                    </div>
                    <button className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 font-semibold">
                      Checkout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
