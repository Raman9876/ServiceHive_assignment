import axios from 'axios';

const api = axios.create({
  // Fallback to the new valid URL if the env var is missing
  baseURL: import.meta.env.VITE_API_URL || "https://servicehive-assignment.onrender.com/api",
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add Bearer token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // If login/register response contains token, store it
    if (response.data?.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Clear token on unauthorized (expired or invalid)
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export default api;
