// src/utils/api.js or src/services/axiosInstance.js
import axios from 'axios';
import store from '../redux/store'
import { refreshAccessToken, logout } from '../redux/authSlice';
import { getAccessToken, getRefreshToken } from '../services/authService';
import { API } from './constants';

// Create Axios instance
const api = axios.create({
    baseURL: API, // Set your base API URL
    headers: {
        'Content-Type': 'application/json',
    },
});


api.interceptors.request.use(
    (config) => {
      const state = store.getState();
      const token = state.auth.auth.access_token; // Get access token from the Redux store
  
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
  
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );




// Add response interceptor to handle token expiration and refresh
api.interceptors.response.use(
    (response) => {
        return response;
    },
    
    async (error) => {
        const originalRequest = error.config;
        
        const refreshToken = getRefreshToken(); // Get refresh token from the store
        // If the request fails due to 401 Unauthorized and a refresh token is available
        if (error.response?.status === 401 && refreshToken && !originalRequest._retry) {
            originalRequest._retry = true; // Prevents infinite retries

            try {
                // Attempt to refresh the access token
                const response = await axios.post(API+'auth/api/token/refresh/', { refresh: refreshToken });
                const newAccessToken = response.data.access;

                // Dispatch action to update the access token in the store
                store.dispatch(refreshAccessToken({ access: newAccessToken }));

                // Update the original request's Authorization header with the new access token
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                // Retry the original request with the new token
                return api(originalRequest);
            } catch (refreshError) {
                // If token refresh fails, log the user out
                store.dispatch(logout());
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
