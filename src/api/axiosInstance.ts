import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Base Axios instance configured for DummyJSON API
const axiosInstance = axios.create({
  baseURL: 'https://dummyjson.com',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15s timeout
});

// Request Interceptor: Attach authentication token to every outgoing request
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Centralized error handling
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      // Server responded with non-2xx status code
      const status = error.response.status;

      if (status === 401) {
        // Token expired or invalid credential
        if (typeof window !== 'undefined') {
          // Clear token if it's invalid (but avoid redirecting if already on login page)
          if (!window.location.pathname.includes('/login')) {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');
            window.location.href = '/login?expired=true';
          }
        }
      }
    } else if (error.request) {
      // Network failure or API down
      console.error('Network Error / Server Unreachable:', error.request);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
