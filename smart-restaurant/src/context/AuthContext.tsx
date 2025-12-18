import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, User } from '../services/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (name: string, email: string, password: string, role?: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  updateProfile: (data: { full_name?: string; phone?: string }) => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = authService.getToken();
      if (token) {
        try {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Auth check failed:', error);
          authService.logout();
        }
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      setIsLoading(true);
      const result = await authService.login({ email, password });
      
      if (result.success) {
        setUser(result.data);
        setIsAuthenticated(true);
        return { success: true, message: result.message };
      } else {
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      return { success: false, message: 'Login failed. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role?: string): Promise<{ success: boolean; message: string }> => {
    try {
      setIsLoading(true);
      
      const result = await authService.register({
        email,
        username: name.toLowerCase().replace(/\s+/g, '_'),
        password,
        full_name: name,
      });
      
      if (result.success) {
        const loginResult = await authService.login({ email, password });
        if (loginResult.success) {
          setUser(loginResult.data);
          setIsAuthenticated(true);
          return { success: true, message: 'Registration successful!' };
        }
        return { success: true, message: 'Registration successful! Please login.' };
      } else {
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error('❌ Registration error:', error);
      return { success: false, message: 'Registration failed. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: { full_name?: string; phone?: string }): Promise<{ success: boolean; message: string }> => {
    try {
      const result = await authService.updateProfile(data);
      if (result.success && result.data) {
        setUser(result.data);
        return { success: true, message: result.message };
      }
      return { success: false, message: result.message };
    } catch (error) {
      return { success: false, message: 'Failed to update profile' };
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      login,
      register,
      logout,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};
