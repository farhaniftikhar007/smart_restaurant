// Mock data for the smart restaurant application
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'staff' | 'customer';
  phone?: string;
  profilePicture?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isAvailable: boolean;
  dietaryInfo: string[];
  preparationTime: number;
  rating: number;
  reviews: number;
}

export interface Order {
  id: string;
  userId: string;
  items: {
    menuItemId: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  createdAt: string;
  tableNumber?: number;
  notes?: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  menuItemId?: string;
}

export interface Reservation {
  id: string;
  userId: string;
  userName: string;
  date: string;
  time: string;
  partySize: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  specialRequests?: string;
  phone: string;
}

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@dastarkhwan.com',
    role: 'admin',
    phone: '+92-300-1234567'
  },
  {
    id: '2',
    name: 'Ahmed Khan',
    email: 'ahmed@example.com',
    role: 'customer',
    phone: '+92-301-2345678'
  },
  {
    id: '3',
    name: 'Fatima Ali',
    email: 'fatima@example.com',
    role: 'customer',
    phone: '+92-302-3456789'
  }
];

// Mock Menu Items - Pakistani Cuisine
export const mockMenuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Biryani (Chicken)',
    description: 'Fragrant basmati rice cooked with tender chicken, aromatic spices, and saffron',
    price: 15.99,
    category: 'Main Course',
    image: '/images/menu/biryani.jpg',
    isAvailable: true,
    dietaryInfo: ['Contains Gluten', 'Contains Dairy'],
    preparationTime: 25,
    rating: 4.8,
    reviews: 156
  },
  {
    id: '2',
    name: 'Nihari',
    description: 'Slow-cooked beef shank in rich, spicy gravy served with naan bread',
    price: 18.99,
    category: 'Main Course',
    image: '/images/menu/nihari.jpg',
    isAvailable: true,
    dietaryInfo: ['Contains Gluten'],
    preparationTime: 30,
    rating: 4.9,
    reviews: 203
  },
  {
    id: '3',
    name: 'Karahi (Chicken)',
    description: 'Spicy chicken curry cooked in a traditional karahi with tomatoes and green chilies',
    price: 16.99,
    category: 'Main Course',
    image: '/images/menu/karahi.jpg',
    isAvailable: true,
    dietaryInfo: ['Contains Dairy'],
    preparationTime: 20,
    rating: 4.7,
    reviews: 189
  },
  {
    id: '4',
    name: 'Seekh Kebab',
    description: 'Grilled minced meat skewers seasoned with traditional spices and herbs',
    price: 12.99,
    category: 'Appetizers',
    image: '/images/menu/seekh-kebab.jpg',
    isAvailable: true,
    dietaryInfo: ['Gluten Free'],
    preparationTime: 15,
    rating: 4.6,
    reviews: 134
  },
  {
    id: '5',
    name: 'Chicken Tikka',
    description: 'Tender chicken pieces marinated in yogurt and spices, grilled to perfection',
    price: 14.99,
    category: 'Appetizers',
    image: '/images/menu/chicken-tikka.jpg',
    isAvailable: true,
    dietaryInfo: ['Contains Dairy'],
    preparationTime: 18,
    rating: 4.5,
    reviews: 167
  },
  {
    id: '6',
    name: 'Daal Chawal',
    description: 'Traditional lentil curry served with steamed basmati rice',
    price: 10.99,
    category: 'Main Course',
    image: '/images/menu/daal-chawal.jpg',
    isAvailable: true,
    dietaryInfo: ['Vegetarian', 'Vegan'],
    preparationTime: 15,
    rating: 4.4,
    reviews: 98
  },
  {
    id: '7',
    name: 'Naan Bread',
    description: 'Freshly baked traditional flatbread, perfect with any curry',
    price: 3.99,
    category: 'Bread',
    image: '/images/menu/naan.jpg',
    isAvailable: true,
    dietaryInfo: ['Vegetarian', 'Contains Gluten'],
    preparationTime: 8,
    rating: 4.3,
    reviews: 89
  },
  {
    id: '8',
    name: 'Raita',
    description: 'Cool yogurt dip with cucumber, mint, and spices',
    price: 4.99,
    category: 'Side Dishes',
    image: '/images/menu/raita.jpg',
    isAvailable: true,
    dietaryInfo: ['Vegetarian', 'Contains Dairy'],
    preparationTime: 5,
    rating: 4.2,
    reviews: 76
  },
  {
    id: '9',
    name: 'Gulab Jamun',
    description: 'Sweet milk dumplings soaked in rose-flavored syrup',
    price: 6.99,
    category: 'Desserts',
    image: '/images/menu/gulab-jamun.jpg',
    isAvailable: true,
    dietaryInfo: ['Vegetarian', 'Contains Dairy'],
    preparationTime: 10,
    rating: 4.7,
    reviews: 145
  },
  {
    id: '10',
    name: 'Kheer',
    description: 'Traditional rice pudding with cardamom, nuts, and saffron',
    price: 5.99,
    category: 'Desserts',
    image: '/images/menu/kheer.jpg',
    isAvailable: true,
    dietaryInfo: ['Vegetarian', 'Contains Dairy'],
    preparationTime: 12,
    rating: 4.6,
    reviews: 112
  },
  {
    id: '11',
    name: 'Pakora',
    description: 'Crispy vegetable fritters made with gram flour and spices',
    price: 8.99,
    category: 'Appetizers',
    image: '/images/menu/pakora.jpg',
    isAvailable: true,
    dietaryInfo: ['Vegetarian', 'Vegan'],
    preparationTime: 12,
    rating: 4.3,
    reviews: 87
  },
  {
    id: '12',
    name: 'Lassi (Sweet)',
    description: 'Refreshing yogurt drink with rose water and cardamom',
    price: 4.99,
    category: 'Beverages',
    image: '/images/menu/lassi.jpg',
    isAvailable: true,
    dietaryInfo: ['Vegetarian', 'Contains Dairy'],
    preparationTime: 3,
    rating: 4.4,
    reviews: 94
  }
];

// Mock Orders
export const mockOrders: Order[] = [
  {
    id: '1',
    userId: '2',
    items: [
      { menuItemId: '1', quantity: 1, price: 15.99 },
      { menuItemId: '7', quantity: 2, price: 3.99 },
      { menuItemId: '8', quantity: 1, price: 4.99 }
    ],
    total: 28.96,
    status: 'preparing',
    createdAt: '2024-01-15T12:30:00Z',
    tableNumber: 5,
    notes: 'Extra spicy biryani please'
  },
  {
    id: '2',
    userId: '3',
    items: [
      { menuItemId: '2', quantity: 1, price: 18.99 },
      { menuItemId: '4', quantity: 1, price: 12.99 },
      { menuItemId: '12', quantity: 2, price: 4.99 }
    ],
    total: 41.96,
    status: 'ready',
    createdAt: '2024-01-15T12:15:00Z',
    tableNumber: 3
  }
];

// Mock Reviews
export const mockReviews: Review[] = [
  {
    id: '1',
    userId: '2',
    userName: 'Ahmed Khan',
    rating: 5,
    comment: 'Best biryani in town! The rice was perfectly cooked and the chicken was so tender. Authentic Pakistani taste!',
    createdAt: '2024-01-10T14:30:00Z',
    menuItemId: '1'
  },
  {
    id: '2',
    userId: '3',
    userName: 'Fatima Ali',
    rating: 5,
    comment: 'Nihari was absolutely delicious! The meat was so soft and the gravy was rich and flavorful. Will definitely come back!',
    createdAt: '2024-01-12T16:45:00Z',
    menuItemId: '2'
  },
  {
    id: '3',
    userId: '2',
    userName: 'Ahmed Khan',
    rating: 4,
    comment: 'Chicken karahi was spicy and delicious! Perfect with naan bread. Highly recommended for spice lovers.',
    createdAt: '2024-01-14T19:20:00Z',
    menuItemId: '3'
  },
  {
    id: '4',
    userId: '3',
    userName: 'Fatima Ali',
    rating: 5,
    comment: 'Gulab jamun was the perfect ending to our meal! Sweet, soft, and absolutely divine.',
    createdAt: '2024-01-16T20:15:00Z',
    menuItemId: '9'
  }
];

// Mock Reservations
export const mockReservations: Reservation[] = [
  {
    id: '1',
    userId: '2',
    userName: 'Ahmed Khan',
    date: '2024-01-20',
    time: '19:00',
    partySize: 4,
    status: 'confirmed',
    specialRequests: 'Family dinner, need halal food only',
    phone: '+92-301-2345678'
  },
  {
    id: '2',
    userId: '3',
    userName: 'Fatima Ali',
    date: '2024-01-22',
    time: '18:30',
    partySize: 2,
    status: 'pending',
    phone: '+92-302-3456789'
  }
];

// Helper functions for data manipulation
export const getMenuByCategory = (category: string): MenuItem[] => {
  return mockMenuItems.filter(item => item.category === category);
};

export const getTopRatedItems = (limit: number = 5): MenuItem[] => {
  return [...mockMenuItems]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
};

export const getOrdersByUser = (userId: string): Order[] => {
  return mockOrders.filter(order => order.userId === userId);
};

export const getReviewsByMenuItem = (menuItemId: string): Review[] => {
  return mockReviews.filter(review => review.menuItemId === menuItemId);
};

export const getReservationsByUser = (userId: string): Reservation[] => {
  return mockReservations.filter(reservation => reservation.userId === userId);
};
