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
  timeout: 15000,
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
  // Auth
  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }),
  signup: (email: string, password: string, role: string = 'Viewer') =>
    apiClient.post('/auth/signup', { email, password, role }),

  // Diseases
  getDiseases:     ()           => apiClient.get('/diseases/'),
  getDiseaseById:  (id: string) => apiClient.get(`/diseases/${id}`),

  // Simulation — backend expects { population, r0, days }
  runSimulation: (data: { population: number; r0: number; days: number }) =>
    apiClient.post('/simulate/run', data),

  // Publications
  getPublications:     ()          => apiClient.get('/publications/'),
  getPublicationById:  (id: string) => apiClient.get(`/publications/${id}`),
  uploadPublication:   (data: FormData) =>
    apiClient.post('/publications/upload', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  // AI Chatbot — backend expects POST to /api/chat/
  chatWithAI: (question: string, context = '') =>
    apiClient.post('/api/chat/', { question, context }),

  // Map
  getHeatmap: (diseaseName: string, day: number = 0) =>
    apiClient.get(`/map/heatmap/${encodeURIComponent(diseaseName)}?day=${day}`),
};
