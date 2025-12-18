// Simplified API service using mock data
import { 
  mockUsers, 
  mockMenuItems, 
  mockOrders, 
  mockReviews, 
  mockReservations,
  getMenuByCategory,
  getTopRatedItems,
  getOrdersByUser,
  getReviewsByMenuItem,
  getReservationsByUser,
  type User,
  type MenuItem,
  type Order,
  type Review,
  type Reservation
} from './mockData';

// Re-export types for other components
export type { User, MenuItem, Order, Review, Reservation };

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Auth API calls
export const authAPI = {
  register: async (data: { name: string; email: string; password: string; role?: string }): Promise<ApiResponse<{ token: string; user: User }>> => {
    await delay(500);
    
    // Check if user already exists
    const existingUser = mockUsers.find(user => user.email === data.email);
    if (existingUser) {
      return {
        success: false,
        message: 'User already exists',
        data: null as any
      };
    }

    // Create new user
    const newUser: User = {
      id: (mockUsers.length + 1).toString(),
      name: data.name,
      email: data.email,
      role: (data.role as any) || 'customer'
    };

    mockUsers.push(newUser);

    return {
      success: true,
      message: 'User registered successfully',
      data: {
        token: `mock-token-${newUser.id}`,
        user: newUser
      }
    };
  },
  
  login: async (data: { email: string; password: string }): Promise<ApiResponse<{ token: string; user: User }>> => {
    await delay(500);
    
    const user = mockUsers.find(u => u.email === data.email);
    if (!user) {
      return {
        success: false,
        message: 'Invalid credentials',
        data: null as any
      };
    }

    return {
      success: true,
      message: 'Login successful',
      data: {
        token: `mock-token-${user.id}`,
        user
      }
    };
  },
  
  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    await delay(300);
    
    const token = localStorage.getItem('token');
    if (!token) {
      return {
        success: false,
        message: 'No token found',
        data: null as any
      };
    }

    const userId = token.replace('mock-token-', '');
    const user = mockUsers.find(u => u.id === userId);
    
    if (!user) {
      return {
        success: false,
        message: 'User not found',
        data: null as any
      };
    }

    return {
      success: true,
      message: 'User retrieved successfully',
      data: user
    };
  },
  
  logout: async (): Promise<ApiResponse<void>> => {
    await delay(200);
    return {
      success: true,
      message: 'Logged out successfully',
      data: undefined as any
    };
  },
};

// User API calls
export const userAPI = {
  updateProfile: async (data: { name?: string; phone?: string; profilePicture?: string }): Promise<ApiResponse<User>> => {
    await delay(500);
    
    const token = localStorage.getItem('token');
    if (!token) {
      return {
        success: false,
        message: 'No token found',
        data: null as any
      };
    }

    const userId = token.replace('mock-token-', '');
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return {
        success: false,
        message: 'User not found',
        data: null as any
      };
    }

    // Update user data
    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      ...data
    };

    return {
      success: true,
      message: 'Profile updated successfully',
      data: mockUsers[userIndex]
    };
  },
  
  updatePassword: async (data: { currentPassword: string; newPassword: string }): Promise<ApiResponse<void>> => {
    await delay(500);
    return {
      success: true,
      message: 'Password updated successfully',
      data: undefined as any
    };
  },
};

// Menu API calls
export const menuAPI = {
  getMenu: async (): Promise<ApiResponse<MenuItem[]>> => {
    await delay(300);
    return {
      success: true,
      message: 'Menu retrieved successfully',
      data: mockMenuItems
    };
  },
  
  getMenuItem: async (id: string): Promise<ApiResponse<MenuItem>> => {
    await delay(200);
    const item = mockMenuItems.find(item => item.id === id);
    
    if (!item) {
      return {
        success: false,
        message: 'Menu item not found',
        data: null as any
      };
    }

    return {
      success: true,
      message: 'Menu item retrieved successfully',
      data: item
    };
  },

  getMenuByCategory: async (category: string): Promise<ApiResponse<MenuItem[]>> => {
    await delay(200);
    const items = getMenuByCategory(category);
    return {
      success: true,
      message: 'Menu items retrieved successfully',
      data: items
    };
  },

  getTopRatedItems: async (limit: number = 5): Promise<ApiResponse<MenuItem[]>> => {
    await delay(200);
    const items = getTopRatedItems(limit);
    return {
      success: true,
      message: 'Top rated items retrieved successfully',
      data: items
    };
  },
};

// Order API calls
export const orderAPI = {
  createOrder: async (data: any): Promise<ApiResponse<Order>> => {
    await delay(500);
    
    const newOrder: Order = {
      id: (mockOrders.length + 1).toString(),
      userId: data.userId,
      items: data.items,
      total: data.items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0),
      status: 'pending',
      createdAt: new Date().toISOString(),
      tableNumber: data.tableNumber,
      notes: data.notes
    };

    mockOrders.push(newOrder);

    return {
      success: true,
      message: 'Order created successfully',
      data: newOrder
    };
  },
  
  getOrders: async (): Promise<ApiResponse<Order[]>> => {
    await delay(300);
    return {
      success: true,
      message: 'Orders retrieved successfully',
      data: mockOrders
    };
  },
  
  getOrder: async (id: string): Promise<ApiResponse<Order>> => {
    await delay(200);
    const order = mockOrders.find(o => o.id === id);
    
    if (!order) {
      return {
        success: false,
        message: 'Order not found',
        data: null as any
      };
    }

    return {
      success: true,
      message: 'Order retrieved successfully',
      data: order
    };
  },
  
  updateOrderStatus: async (id: string, status: string): Promise<ApiResponse<Order>> => {
    await delay(300);
    
    const orderIndex = mockOrders.findIndex(o => o.id === id);
    if (orderIndex === -1) {
      return {
        success: false,
        message: 'Order not found',
        data: null as any
      };
    }

    mockOrders[orderIndex].status = status as any;
    
    return {
      success: true,
      message: 'Order status updated successfully',
      data: mockOrders[orderIndex]
    };
  },

  getOrdersByUser: async (userId: string): Promise<ApiResponse<Order[]>> => {
    await delay(200);
    const orders = getOrdersByUser(userId);
    return {
      success: true,
      message: 'User orders retrieved successfully',
      data: orders
    };
  },
};

// Booking API calls
export const bookingAPI = {
  createBooking: async (data: any): Promise<ApiResponse<Reservation>> => {
    await delay(500);
    
    const newReservation: Reservation = {
      id: (mockReservations.length + 1).toString(),
      userId: data.userId,
      userName: data.userName,
      date: data.date,
      time: data.time,
      partySize: data.partySize,
      status: 'pending',
      specialRequests: data.specialRequests,
      phone: data.phone
    };

    mockReservations.push(newReservation);

    return {
      success: true,
      message: 'Reservation created successfully',
      data: newReservation
    };
  },
  
  getBookings: async (): Promise<ApiResponse<Reservation[]>> => {
    await delay(300);
    return {
      success: true,
      message: 'Reservations retrieved successfully',
      data: mockReservations
    };
  },
  
  getBooking: async (id: string): Promise<ApiResponse<Reservation>> => {
    await delay(200);
    const reservation = mockReservations.find(r => r.id === id);
    
    if (!reservation) {
      return {
        success: false,
        message: 'Reservation not found',
        data: null as any
      };
    }

    return {
      success: true,
      message: 'Reservation retrieved successfully',
      data: reservation
    };
  },
  
  updateBooking: async (id: string, data: any): Promise<ApiResponse<Reservation>> => {
    await delay(300);
    
    const reservationIndex = mockReservations.findIndex(r => r.id === id);
    if (reservationIndex === -1) {
      return {
        success: false,
        message: 'Reservation not found',
        data: null as any
      };
    }

    mockReservations[reservationIndex] = {
      ...mockReservations[reservationIndex],
      ...data
    };
    
    return {
      success: true,
      message: 'Reservation updated successfully',
      data: mockReservations[reservationIndex]
    };
  },

  getReservationsByUser: async (userId: string): Promise<ApiResponse<Reservation[]>> => {
    await delay(200);
    const reservations = getReservationsByUser(userId);
    return {
      success: true,
      message: 'User reservations retrieved successfully',
      data: reservations
    };
  },
};

// Review API calls
export const reviewAPI = {
  createReview: async (data: any): Promise<ApiResponse<Review>> => {
    await delay(500);
    
    const newReview: Review = {
      id: (mockReviews.length + 1).toString(),
      userId: data.userId,
      userName: data.userName,
      rating: data.rating,
      comment: data.comment,
      createdAt: new Date().toISOString(),
      menuItemId: data.menuItemId
    };

    mockReviews.push(newReview);

    return {
      success: true,
      message: 'Review created successfully',
      data: newReview
    };
  },
  
  getReviews: async (): Promise<ApiResponse<Review[]>> => {
    await delay(300);
    return {
      success: true,
      message: 'Reviews retrieved successfully',
      data: mockReviews
    };
  },

  getReviewsByMenuItem: async (menuItemId: string): Promise<ApiResponse<Review[]>> => {
    await delay(200);
    const reviews = getReviewsByMenuItem(menuItemId);
    return {
      success: true,
      message: 'Menu item reviews retrieved successfully',
      data: reviews
    };
  },
};

// Loyalty API calls
export const loyaltyAPI = {
  getPoints: async (): Promise<ApiResponse<{ points: number; level: string }>> => {
    await delay(200);
    return {
      success: true,
      message: 'Loyalty points retrieved successfully',
      data: { points: 150, level: 'Gold' }
    };
  },
  
  getTransactions: async (): Promise<ApiResponse<any[]>> => {
    await delay(300);
    return {
      success: true,
      message: 'Loyalty transactions retrieved successfully',
      data: []
    };
  },
};

// Notification API calls
export const notificationAPI = {
  getNotifications: async (): Promise<ApiResponse<any[]>> => {
    await delay(200);
    return {
      success: true,
      message: 'Notifications retrieved successfully',
      data: []
    };
  },
  
  markAsRead: async (id: string): Promise<ApiResponse<void>> => {
    await delay(200);
    return {
      success: true,
      message: 'Notification marked as read',
      data: undefined as any
    };
  },
}; 