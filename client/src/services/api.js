import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for session cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle authentication errors
      console.warn('Authentication error - redirecting to login');
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  // Get current authentication status
  getStatus: () => api.get('/api/auth/status'),

  // Initiate Google OAuth flow
  getGoogleAuthUrl: () => api.get('/api/auth/google'),

  // Logout user
  logout: () => api.post('/api/auth/logout'),
};

export const youtubeAPI = {
  // Get upcoming YouTube Live broadcasts
  getBroadcasts: () => api.get('/api/youtube/broadcasts'),
};

export default api;
