import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { AuthTokens, ApiError } from '@/types';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    const tokens = localStorage.getItem('tokens');
    if (tokens) {
      const { access } = JSON.parse(tokens) as AuthTokens;
      config.headers.Authorization = `Bearer ${access}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const tokens = localStorage.getItem('tokens');
        if (tokens) {
          const { refresh } = JSON.parse(tokens) as AuthTokens;
          const response = await api.post('/token/refresh/', { refresh });
          const newTokens: AuthTokens = response.data;
          
          localStorage.setItem('tokens', JSON.stringify(newTokens));
          api.defaults.headers.common.Authorization = `Bearer ${newTokens.access}`;
          
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newTokens.access}`;
          }
          
          return api(originalRequest);
        }
      } catch (refreshError) {
        // If refresh token is invalid, logout user
        localStorage.removeItem('tokens');
        window.location.href = '/login';
      }
    }

    // Format error response
    const apiError: ApiError = {
      message: error.response?.data?.message || 'An error occurred',
      code: error.response?.data?.code,
      errors: error.response?.data?.errors,
    };

    return Promise.reject(apiError);
  }
);

export default api;
