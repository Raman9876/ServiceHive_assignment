import axios from 'axios';

const api = axios.create({
  // Fallback to the new valid URL if the env var is missing
  baseURL: import.meta.env.VITE_API_URL || "https://servicehive-assignment.onrender.com/api",
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Optionally handle unauthorized access
      // Could redirect to login or clear auth state
    }
    return Promise.reject(error);
  }
);

export default api;
