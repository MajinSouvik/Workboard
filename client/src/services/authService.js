import { jwtDecode } from 'jwt-decode';
import { login, logout, refreshAccessToken } from '../redux/authSlice'; // Import Redux actions
import store from '../redux/store'; // Your Redux store
import api from '../utils/api'; // Import the Axios instance with interceptors
import { API } from '../utils/constants';
import axios from 'axios';

// Register a new user
export const registerUser = async (username, email, password) => {
  try {
    const response = await api.post(API + "auth/register/", {
      username,
      email,
      password
    });

    if (response.status === 201) {
      // Registration successful, return true
      return true;
    } else {
      // Any other status indicates failure, return false
      return false;
    }
  } catch (error) {
    console.log("login error-->", error);
    return false; // Return false on error (e.g., network issues or validation errors)
  }
};

// Login the user and store the tokens in Redux
export const loginUser = async (username, password) => {
    try {
    const response = await axios.post(API+"auth/api/token/", {username ,password});
    if (response.status===200){
      console.log("authService-->", response.data)
      store.dispatch(login(response.data));
      return true
    }
  } catch (error) {
    return false
  }
};

// Logout the user
export const logoutUser = () => {
  store.dispatch(logout());
};

// Get access token from Redux store
export const getAccessToken = () => {
  const state = store.getState();
  return state.auth.auth.access_token;
};

// Check if the user is authenticated by verifying the token
export const isAuthenticated = () => {
  const token = getAccessToken();
  if (!token) return false;

  try {
    const decodedToken = jwtDecode(token);
    return decodedToken.exp * 1000 > Date.now(); // Check if the token has expired
  } catch (e) {
    return false;
  }
};

// Get refresh token from Redux store
export const getRefreshToken = () => {
  const state = store.getState();
  return state.auth.auth.refresh_token;
};

// Function to refresh the token
export const refreshToken = async () => {
  try {
    const refresh = getRefreshToken();
    const response = await api.post(API + 'auth/api/token/refresh/', { refresh });
    const { access } = response.data;

    // Update the access token in Redux store
    store.dispatch(refreshAccessToken({ access }));
  } catch (error) {
    throw error;
  }
};
