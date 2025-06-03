import axios from 'axios';

// Configure the API instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:4000', // Use environment variable for backend URL
  withCredentials: true, // Ensure cookies are sent with requests
});

// Optional: Add request or response interceptors if needed (e.g., for error handling, token refresh)

export default api; 