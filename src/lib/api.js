import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  withCredentials: true, // Important for handling cookies/sessions
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;