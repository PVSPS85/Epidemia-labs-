// lib/api.ts
import axios from 'axios';

const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname.includes('.github.dev')) {
      return `https://${hostname.replace('-3000', '-8000')}`;
    }
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
};

export const apiClient = axios.create({
  baseURL: getBaseUrl(),
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// Attach auth token + refresh dynamic base URL
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('epidemia_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.baseURL = getBaseUrl();
  }
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('API Error:', {
      url:    err.config?.url,
      method: err.config?.method,
      status: err.response?.status,
      data:   err.response?.data,
    });
    return Promise.reject(err);
  }
);

export const api = {
  // Diseases
  getDiseases:     ()         => apiClient.get('/diseases'),
  getDiseaseById:  (id: string) => apiClient.get(`/diseases/${id}`),

  // Simulation
  runSimulation: (data: { beta: number; gamma: number; N: number; I0: number; days: number }) =>
    apiClient.post('/simulate', data),

  // Publications — FormData for file upload
  getPublications:     ()          => apiClient.get('/publications'),
  getPublicationById:  (id: string) => apiClient.get(`/publications/${id}`),
  uploadPublication:   (data: FormData) =>
    apiClient.post('/publications/upload', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  // Analytics
  getAnalytics: () => apiClient.get('/analytics'),

  // AI Chatbot
  chatWithAI: (question: string, context = '') =>
    apiClient.post('/chat', { question, context }),
};
