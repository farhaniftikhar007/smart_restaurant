import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  PlusIcon,
  MinusIcon,
  PencilIcon,
  TrashIcon,
  ShoppingCartIcon,
  ArrowPathIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  ArrowRightOnRectangleIcon,
  DocumentArrowDownIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import Cart from './Cart';
import MenuItemForm from './MenuItemForm';
import MenuItemDetail from './MenuItemDetail';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isAvailable: boolean;
  availableDays: string[];
  preparationTime: number;
  priceList?: {
    size: string;
    price: number;
  }[];
  dietaryRestrictions?: string[];
  isSpecialOffer?: boolean;
  specialOfferDetails?: {
    discount: number;
    validUntil: string;
  };
}

interface CartItem extends MenuItem {
  quantity: number;
  size?: string;
}

const dietaryOptions = [
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'gluten-free', label: 'Gluten Free' },
  { id: 'dairy-free', label: 'Dairy Free' },
  { id: 'halal', label: 'Halal' },
  { id: 'spicy', label: 'Spicy' },
  { id: 'mild', label: 'Mild' }
];

const Menu: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [dietaryFilters, setDietaryFilters] = useState<string[]>([]);
  const [showSpecialOffers, setShowSpecialOffers] = useState<boolean>(false);

  // Pakistani Food Menu with PKR prices
  useEffect(() => {
    setMenuItems([
      {
        id: '1',
        name: 'Biryani (Chicken)',
        description: 'Fragrant basmati rice cooked with tender chicken, aromatic spices, and saffron',
        price: 850,
        category: 'main',
        image: '/images/menu/biryani.jpg',
        isAvailable: true,
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        preparationTime: 25,
        priceList: [
          { size: 'Half Plate', price: 450 },
          { size: 'Full Plate', price: 850 },
          { size: 'Family Pack', price: 1200 }
        ],
        dietaryRestrictions: ['halal']
      },
      {
        id: '2',
        name: 'Nihari',
        description: 'Slow-cooked beef shank in rich, spicy gravy served with naan bread',
        price: 950,
        category: 'main',
        image: '/images/menu/nihari.jpg',
        isAvailable: true,
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        preparationTime: 30,
        dietaryRestrictions: ['halal']
      },
      {
        id: '3',
        name: 'Karahi (Chicken)',
        description: 'Spicy chicken cooked in traditional karahi with tomatoes, onions, and green chilies',
        price: 750,
        category: 'main',
        image: '/images/menu/karahi.jpg',
        isAvailable: true,
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        preparationTime: 20,
        priceList: [
          { size: 'Half', price: 400 },
          { size: 'Full', price: 750 },
          { size: 'Special', price: 950 }
        ],
        dietaryRestrictions: ['halal']
      },
      {
        id: '4',
        name: 'Haleem',
        description: 'Slow-cooked lentils, wheat, and meat with aromatic spices, served with naan',
        price: 650,
        category: 'main',
        image: '/images/menu/haleem.jpg',
        isAvailable: true,
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        preparationTime: 35,
        dietaryRestrictions: ['halal']
      },
      {
        id: '5',
        name: 'Gulab Jamun',
        description: 'Soft milk dumplings soaked in rose-flavored sugar syrup',
        price: 120,
        category: 'dessert',
        image: '/images/menu/gulab-jamun.jpg',
        isAvailable: true,
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        preparationTime: 10,
        priceList: [
          { size: '2 pieces', price: 120 },
          { size: '4 pieces', price: 220 },
          { size: '6 pieces', price: 320 }
        ],
        dietaryRestrictions: ['vegetarian']
      },
      {
        id: '6',
        name: 'Lassi (Sweet)',
        description: 'Traditional yogurt drink with sugar and cardamom',
        price: 150,
        category: 'drinks',
        image: '/images/menu/lassi.jpg',
        isAvailable: true,
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        preparationTime: 5,
        priceList: [
          { size: 'Regular', price: 150 },
          { size: 'Large', price: 250 }
        ],
        dietaryRestrictions: ['vegetarian']
      },
      {
        id: '7',
        name: 'Seekh Kebab',
        description: 'Grilled minced meat skewers with aromatic spices',
        price: 400,
        category: 'main',
        image: '/images/menu/seekh-kebab.jpg',
        isAvailable: true,
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        preparationTime: 15,
        priceList: [
          { size: '2 pieces', price: 200 },
          { size: '4 pieces', price: 400 },
          { size: '6 pieces', price: 550 }
        ],
        isSpecialOffer: true,
        specialOfferDetails: {
          discount: 20,
          validUntil: '2024-03-31'
        },
        dietaryRestrictions: ['halal']
      },
      {
        id: '8',
        name: 'Chana Chaat',
        description: 'Spiced chickpeas with onions, tomatoes, and tamarind chutney',
        price: 180,
        category: 'salad',
        image: '/images/menu/chana-chaat.jpg',
        isAvailable: true,
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        preparationTime: 8,
        dietaryRestrictions: ['vegetarian', 'vegan']
      },
      {
        id: '9',
        name: 'Kheer',
        description: 'Traditional rice pudding with cardamom, nuts, and saffron',
        price: 200,
        category: 'dessert',
        image: '/images/menu/kheer.jpg',
        isAvailable: true,
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        preparationTime: 25,
        dietaryRestrictions: ['vegetarian']
      },
      {
        id: '10',
        name: 'Chicken Tikka',
        description: 'Marinated chicken pieces grilled in tandoor with spices',
        price: 600,
        category: 'main',
        image: '/images/menu/chicken-tikka.jpg',
        isAvailable: true,
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        preparationTime: 20,
        priceList: [
          { size: 'Half', price: 350 },
          { size: 'Full', price: 600 },
          { size: 'Special', price: 800 }
        ],
        isSpecialOffer: true,
        specialOfferDetails: {
          discount: 15,
          validUntil: '2024-03-31'
        },
        dietaryRestrictions: ['halal']
      },
      {
        id: '11',
        name: 'Aloo Paratha',
        description: 'Stuffed flatbread with spiced potato filling, served with yogurt',
        price: 120,
        category: 'main',
        image: '/images/menu/aloo-paratha.jpg',
        isAvailable: true,
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        preparationTime: 12,
        dietaryRestrictions: ['vegetarian']
      },
      {
        id: '12',
        name: 'Mango Lassi',
        description: 'Creamy yogurt drink with fresh mango pulp',
        price: 200,
        category: 'drinks',
        image: '/images/menu/mango-lassi.jpg',
        isAvailable: true,
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        preparationTime: 5,
        priceList: [
          { size: 'Regular', price: 200 },
          { size: 'Large', price: 300 }
        ],
        dietaryRestrictions: ['vegetarian']
      },
      {
        id: '13',
        name: 'Jalebi',
        description: 'Crispy spiral-shaped sweet soaked in sugar syrup',
        price: 100,
        category: 'dessert',
        image: '/images/menu/jalebi.jpg',
        isAvailable: true,
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        preparationTime: 15,
        priceList: [
          { size: '100g', price: 100 },
          { size: '250g', price: 200 },
          { size: '500g', price: 350 }
        ],
        dietaryRestrictions: ['vegetarian']
      },
      {
        id: '14',
        name: 'Daal Chawal',
        description: 'Lentil curry with steamed basmati rice',
        price: 300,
        category: 'main',
        image: '/images/menu/daal-chawal.jpg',
        isAvailable: true,
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        preparationTime: 18,
        dietaryRestrictions: ['vegetarian', 'vegan'],
        isSpecialOffer: true,
        specialOfferDetails: {
          discount: 10,
          validUntil: '2024-03-31'
        }
      }
    ]);
  }, []);

  const categories = ['all', 'main', 'salad', 'dessert', 'drinks'];

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDietary = dietaryFilters.length === 0 ||
      dietaryFilters.every(filter => item.dietaryRestrictions?.includes(filter));
    const matchesSpecialOffers = !showSpecialOffers || item.isSpecialOffer;
    return matchesCategory && matchesSearch && matchesDietary && matchesSpecialOffers;
  });

  // Customer Functions
  const addToCart = (item: MenuItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (itemId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };
  const handlePlaceOrder = () => {
    console.log("🔥 handlePlaceOrder called!");
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    navigate("/checkout", { state: { cart } });
    setIsCartOpen(false);
  };

  // Admin Functions
  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setIsEditing(true);
  };

  const handleDelete = async (itemId: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      // API call would go here
      setMenuItems(prevItems => prevItems.filter(item => item.id !== itemId));
    }
  };

  const handleAddItem = (item: Omit<MenuItem, 'id'>) => {
    const newItem = {
      ...item,
      id: Date.now().toString(), // Temporary ID generation
    };
    setMenuItems(prevItems => [...prevItems, newItem]);
    setIsEditing(false);
  };

  const handleUpdateItem = (item: Omit<MenuItem, 'id'>) => {
    if (!editingItem) return;
    setMenuItems(prevItems =>
      prevItems.map(menuItem =>
        menuItem.id === editingItem.id ? { ...item, id: menuItem.id } : menuItem
      )
    );
    setIsEditing(false);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleExport = () => {
    const menuData = JSON.stringify(menuItems, null, 2);
    const blob = new Blob([menuData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'menu.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'Description', 'Price', 'Category'];
    const csvContent = [
      headers.join(','),
      ...menuItems.map(item => [
        item.id,
        `${item.name}`,
        `${item.description}`,
        item.price,
        item.category
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'menu.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleAddToCart = (item: MenuItem, quantity: number, selectedSize?: string) => {
    const price = selectedSize
      ? item.priceList?.find(p => p.size === selectedSize)?.price || item.price
      : item.price;

    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem =>
        cartItem.id === item.id && cartItem.size === selectedSize
      );

      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id && cartItem.size === selectedSize
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        );
      }

      return [...prevCart, {
        ...item,
        quantity,
        size: selectedSize,
        price
      }];
    });
    setIsCartOpen(true);
  };

  const handleDietaryFilterToggle = (filterId: string) => {
    if (dietaryFilters.includes(filterId)) {
      setDietaryFilters(dietaryFilters.filter(id => id !== filterId));
    } else {
      setDietaryFilters([...dietaryFilters, filterId]);
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        {/* Header Hero Section */}
        <div className="relative mb-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-3xl p-8 shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full transform -translate-x-1/2 translate-y-1/2"></div>

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center text-white">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-2 text-white drop-shadow-md">
                Taste of Pakistan 🌶️
              </h1>
              <p className="text-orange-100 text-lg">Authentic flavors, delivered to your table.</p>
            </div>

            <div className="flex gap-4 mt-6 md:mt-0">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all border border-white/30"
                title="Toggle Theme"
              >
                {isDarkMode ? '🌞' : '🌙'}
              </button>
              {!isAdmin && (
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="flex items-center gap-2 bg-white text-orange-600 px-6 py-3 rounded-full font-bold shadow-lg hover:bg-gray-100 transform hover:scale-105 transition-all"
                >
                  <ShoppingCartIcon className="w-5 h-5" />
                  Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})
                </button>
              )}
              {isAdmin && (
                <button
                  onClick={logout}
                  className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all border border-white/30"
                  title="Logout"
                >
                  <ArrowRightOnRectangleIcon className="w-6 h-6" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="sticky top-4 z-40 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 mb-8 transition-all">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
              <input
                type="text"
                placeholder="Find your craving..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border-none rounded-xl focus:ring-2 focus:ring-orange-500 transition-all text-lg shadow-inner"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-3 rounded-xl capitalize font-medium whitespace-nowrap transition-all duration-300 transform hover:scale-105 ${selectedCategory === category
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/30'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-600'
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map(item => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="group relative bg-white dark:bg-gray-800 rounded-3xl shadow-xl hover:shadow-2xl overflow-hidden cursor-pointer border border-gray-100 dark:border-gray-700 transition-all duration-300"
              onClick={() => setSelectedItem(item)}
            >
              <div className="relative h-56 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                {!item.isAvailable && (
                  <div className="absolute top-4 left-4 z-20 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-md">
                    Sold Out
                  </div>
                )}
                {item.isSpecialOffer && (
                  <div className="absolute top-4 right-4 z-20 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md animate-pulse">
                    {item.specialOfferDetails?.discount}% OFF
                  </div>
                )}
                <div className="absolute bottom-4 left-4 z-20 text-white">
                  <p className="text-sm font-medium bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg inline-block">
                    {item.preparationTime} min soak
                  </p>
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 group-hover:text-orange-500 transition-colors">
                    {item.name}
                  </h3>
                  <span className="text-2xl font-extrabold text-orange-600 bg-orange-50 dark:bg-orange-900/30 px-3 py-1 rounded-lg">
                    {item.isSpecialOffer ? (
                      (item.price * (1 - (item.specialOfferDetails?.discount || 0) / 100)).toFixed(0)
                    ) : (
                      item.price.toFixed(0)
                    )}
                    <span className="text-sm font-normal ml-1">Rs</span>
                  </span>
                </div>

                <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-4 leading-relaxed">
                  {item.description}
                </p>

                <div className="flex items-center justify-between mt-4 border-t border-gray-100 dark:border-gray-700 pt-4">
                  {isAdmin ? (
                    <div className="flex gap-2 w-full justify-end">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleEdit(item); }}
                        className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                        className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedItem(item);
                      }}
                      className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold hover:bg-orange-500 hover:text-white dark:hover:bg-orange-500 dark:hover:text-white transition-all transform active:scale-95 shadow-lg group-hover:shadow-orange-200"
                    >
                      {item.isAvailable ? 'Quick Add +' : 'Notify Me'}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Cart Sidebar */}
        <AnimatePresence>
          {isCartOpen && !isAdmin && (
            <Cart
              items={cart}
              onUpdateQuantity={updateQuantity}
              onRemoveItem={removeFromCart}
              onPlaceOrder={handlePlaceOrder}
              onClose={() => setIsCartOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Menu Item Form Modal */}
        <AnimatePresence>
          {isEditing && (
            <MenuItemForm
              item={editingItem || undefined}
              onSubmit={editingItem ? handleUpdateItem : handleAddItem}
              onCancel={() => {
                setIsEditing(false);
                setEditingItem(null);
              }}
            />
          )}
        </AnimatePresence>

        {/* Menu Item Detail Modal */}
        <AnimatePresence>
          {selectedItem && !isAdmin && (
            <MenuItemDetail
              item={selectedItem}
              onClose={() => setSelectedItem(null)}
              onAddToCart={handleAddToCart}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Menu; 