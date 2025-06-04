import axios from 'axios';
import Cookies from 'js-cookie';

// Configure the API instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for CSRF token
api.interceptors.request.use((config) => {
  const csrfToken = Cookies.get('csrfToken');
  if (csrfToken && config.headers) {
    config.headers['X-CSRF-Token'] = csrfToken;
  }
  return config;
});

// Add response interceptor for handling auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Instead of redirecting immediately, we'll let the auth context handle it
      console.error('Authentication error:', error);
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const endpoints = {
  auth: {
    google: '/auth/google',
    logout: '/auth/logout',
    me: '/api/auth/me',
    check: '/api/auth/check',
  },
  campaigns: {
    list: '/api/campaigns',
    create: '/api/campaigns',
    get: (id: string) => `/api/campaigns/${id}`,
  },
  segments: {
    list: '/api/segments',
    create: '/api/segments',
    get: (id: string) => `/api/segments/${id}`,
    preview: '/api/segments/preview',
    generateRules: '/api/segments/generate-rules',
  },
  customers: {
    create: '/api/ingest/customers',
    batchCreate: '/api/ingest/customers/batch',
    createOrder: '/api/ingest/orders',
  },
};

// Types
export interface Campaign {
  _id: string;
  name: string;
  segmentId: string;
  message: string;
  status: 'DRAFT' | 'SCHEDULED' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  schedule?: Date;
  stats: {
    totalAudience: number;
    sentCount: number;
    failedCount: number;
    successRate: number;
  };
}

export interface Segment {
  _id: string;
  name: string;
  rules: any; // Flexible structure for rules
  audienceSize: number;
}

export interface Customer {
  customerId: number;
  name: string;
  email: string;
  phone?: string;
  totalSpend: number;
  visitCount: number;
  lastPurchase?: Date;
}

export default api; 