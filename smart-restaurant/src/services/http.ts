// src/services/http.ts
import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

// For CRA use process.env.REACT_APP_*
const API_BASE_URL = (process.env.REACT_APP_API_BASE_URL as string) || 'http://localhost:8000';
console.log('🔵 API_BASE_URL:', API_BASE_URL);
// Create axios instance
const httpClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor - attach token
httpClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors
httpClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      
      // Optional: Implement token refresh here
      // const refreshToken = localStorage.getItem('refresh_token');
      // if (refreshToken) {
      //   try {
      //     const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, { refresh_token: refreshToken });
      //     localStorage.setItem('access_token', response.data.access_token);
      //     return httpClient.request(error.config!);
      //   } catch (refreshError) {
      //     window.location.href = '/auth';
      //   }
      // }
      
      // Redirect to login
      if (window.location.pathname !== '/auth') {
        window.location.href = '/auth';
      }
    }
    
    return Promise.reject(error);
  }
);

export default httpClient;

// Helper to get API base URL for WebSocket
export const getApiBaseUrl = () => API_BASE_URL;
export const getWsBaseUrl = () => API_BASE_URL.replace(/^http/, 'ws');
