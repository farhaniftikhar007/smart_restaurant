// src/services/orderService.ts
import httpClient from './http';
import { MenuItem } from './menuService';

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';

export interface OrderItem {
  id: number;
  menu_item_id: number;
  quantity: number;
  price: number;
  special_instructions?: string;
  menu_item: MenuItem;
}

export interface Order {
  id: number;
  order_number: string;
  customer_id: number;
  table_number?: string;
  status: OrderStatus;
  total_amount: number;
  notes?: string;
  created_at: string;
  updated_at?: string;
  order_items: OrderItem[];
}

export interface CreateOrderItem {
  menu_item_id: number;
  quantity: number;
  special_instructions?: string;
}

export interface CreateOrderData {
  table_number?: string;
  notes?: string;
  items: CreateOrderItem[];
}

export interface OrderFilters {
  status?: OrderStatus;
  skip?: number;
  limit?: number;
}

class OrderService {
  /**
   * Create a new order
   */
  async createOrder(data: CreateOrderData): Promise<{ success: boolean; message: string; data: Order | null }> {
    try {
      const response = await httpClient.post<Order>('/api/orders', data);
      return {
        success: true,
        message: 'Order placed successfully',
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.detail || 'Failed to place order',
        data: null,
      };
    }
  }

  /**
   * Get all orders (filtered by user role)
   */
  async listOrders(filters?: OrderFilters): Promise<{ success: boolean; message: string; data: Order[] }> {
    try {
      const response = await httpClient.get<Order[]>('/api/orders', { params: filters });
      return {
        success: true,
        message: 'Orders loaded',
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to load orders',
        data: [],
      };
    }
  }

  /**
   * Get single order by ID
   */
  async getOrder(id: number): Promise<{ success: boolean; message: string; data: Order | null }> {
    try {
      const response = await httpClient.get<Order>(`/api/orders/${id}`);
      return {
        success: true,
        message: 'Order loaded',
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.detail || 'Order not found',
        data: null,
      };
    }
  }

  /**
   * Update order status (Admin only)
   */
  async updateOrderStatus(id: number, status: OrderStatus): Promise<{ success: boolean; message: string; data: Order | null }> {
    try {
      const response = await httpClient.patch<Order>(`/api/orders/${id}/status`, { status });
      return {
        success: true,
        message: 'Order status updated',
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.detail || 'Failed to update order status',
        data: null,
      };
    }
  }

  /**
   * Cancel order
   */
  async cancelOrder(id: number): Promise<{ success: boolean; message: string }> {
    try {
      await httpClient.delete(`/api/orders/${id}`);
      return {
        success: true,
        message: 'Order cancelled',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.detail || 'Failed to cancel order',
      };
    }
  }
}

export const orderService = new OrderService();
