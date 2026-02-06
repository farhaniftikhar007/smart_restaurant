// src/services/menuService.ts
import httpClient from './http';

export interface Category {
  id: number;
  name: string;
  description?: string;
  image_url?: string;
  is_active: boolean;
  created_at: string;
}

export interface MenuItem {
  id: number;
  name: string;
  description?: string;
  price: number;
  category_id: number;
  image_url?: string;
  is_available: boolean;
  is_vegetarian: boolean;
  is_spicy: boolean;
  preparation_time?: number;
  calories?: number;
  created_at: string;
  category: Category;
}

export interface MenuFilters {
  category_id?: number;
  is_available?: boolean;
  is_vegetarian?: boolean;
  skip?: number;
  limit?: number;
}

class MenuService {
  /**
   * Get all menu items with optional filters
   */
  async getMenu(filters?: MenuFilters): Promise<{ success: boolean; message: string; data: MenuItem[] }> {
    try {
      const response = await httpClient.get<MenuItem[]>('/api/menu', { params: filters });
      return {
        success: true,
        message: 'Menu loaded successfully',
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.detail || 'Failed to load menu',
        data: [],
      };
    }
  }

  /**
   * Get single menu item by ID
   */
  async getMenuItem(id: number): Promise<{ success: boolean; message: string; data: MenuItem | null }> {
    try {
      const response = await httpClient.get<MenuItem>(`/api/menu/${id}`);
      return {
        success: true,
        message: 'Menu item loaded',
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.detail || 'Menu item not found',
        data: null,
      };
    }
  }

  /**
   * Get all categories
   */
  async getCategories(): Promise<{ success: boolean; message: string; data: Category[] }> {
    try {
      const response = await httpClient.get<Category[]>('/api/menu/categories/all');
      return {
        success: true,
        message: 'Categories loaded',
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to load categories',
        data: [],
      };
    }
  }

  /**
   * Create menu item (Admin only)
   */
  async createMenuItem(data: Partial<MenuItem>): Promise<{ success: boolean; message: string; data: MenuItem | null }> {
    try {
      const response = await httpClient.post<MenuItem>('/api/menu', data);
      return {
        success: true,
        message: 'Menu item created',
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.detail || 'Failed to create menu item',
        data: null,
      };
    }
  }

  /**
   * Update menu item (Admin only)
   */
  async updateMenuItem(id: number, data: Partial<MenuItem>): Promise<{ success: boolean; message: string; data: MenuItem | null }> {
    try {
      const response = await httpClient.put<MenuItem>(`/api/menu/${id}`, data);
      return {
        success: true,
        message: 'Menu item updated',
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.detail || 'Failed to update menu item',
        data: null,
      };
    }
  }

  /**
   * Delete menu item (Admin only)
   */
  async deleteMenuItem(id: number): Promise<{ success: boolean; message: string }> {
    try {
      await httpClient.delete(`/api/menu/${id}`);
      return {
        success: true,
        message: 'Menu item deleted',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.detail || 'Failed to delete menu item',
      };
    }
  }

  /**
   * Get item recommendations
   */
  async getItemRecommendations(itemId: number): Promise<{ success: boolean; data: MenuItem[] }> {
    try {
      const response = await httpClient.get<MenuItem[]>(`/api/analytics/recommendations/item/${itemId}`);
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, data: [] };
    }
  }

  /**
   * Get user recommendations
   */
  async getUserRecommendations(userId: number): Promise<{ success: boolean; data: MenuItem[] }> {
    try {
      const response = await httpClient.get<MenuItem[]>(`/api/analytics/recommendations/user/${userId}`);
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, data: [] };
    }
  }
}

export const menuService = new MenuService();
