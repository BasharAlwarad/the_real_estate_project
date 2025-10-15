import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

/**
 * Auto-Refresh Token Interceptor
 *
 * Teaching points:
 * 1. On 401 error, try to refresh the access token
 * 2. If refresh succeeds, retry the original request
 * 3. If refresh fails, redirect to login
 * 4. Prevent infinite loops by tracking refresh attempts
 */

let isRefreshing = false;

// Add response interceptor to handle auth errors and auto-refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Prevent redirect loop: only redirect if not already on /login
      if (window.location.pathname === '/login') {
        return Promise.reject(error);
      }

      // Mark this request as retried to prevent infinite loops
      originalRequest._retry = true;

      // If already refreshing, wait and retry
      if (isRefreshing) {
        // Wait a bit for the refresh to complete
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return api.request(originalRequest);
      }

      isRefreshing = true;

      try {
        // Try to refresh the access token
        await api.post('/auth/refresh');

        isRefreshing = false;

        // Retry the original request with new access token
        return api.request(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;

        // Refresh failed, redirect to login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
