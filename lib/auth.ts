import api, { endpoints } from './api';

export const checkAuth = async () => {
  try {
    const response = await api.get(endpoints.auth.check);
    return response.data.authenticated;
  } catch (error) {
    console.error('Auth check failed:', error);
    return false;
  }
}; 