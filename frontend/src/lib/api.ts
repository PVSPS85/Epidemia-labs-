// lib/api.ts
import axios from 'axios';

// Detect if we're in Codespaces automatically
const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    // If running on a GitHub Codespace, construct the backend URL using the codespace name
    if (hostname.includes('.github.dev')) {
      return `https://${hostname.replace('-3000', '-8000')}`;
    }
  }
  // Default to localhost or env var
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
};

export const apiClient = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercept requests to attach the auth token if the user is logged in
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('epidemia_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Update baseURL dynamically in case it changed
    config.baseURL = getBaseUrl();
  }
  return config;
});

// Intercept responses for robust error logging
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Request Failed:", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

export const api = {
  // Diseases
  getDiseases: () => apiClient.get('/diseases'),
  getDiseaseById: (id: string) => apiClient.get(`/diseases/${id}`),
  
  // Simulation
  runSimulation: (data: { beta: number; gamma: number; N: number; I0: number; days: number }) => 
    apiClient.post('/simulate', data),
    
  // Publications
  getPublications: () => apiClient.get('/publications'),
  getPublicationById: (id: string) => apiClient.get(`/publications/${id}`),
  uploadPublication: (data: any) => apiClient.post('/publications', data),

  // Analytics
  getAnalytics: () => apiClient.get('/analytics'),

  // AI Chatbot
  chatWithAI: (question: string, context: string = "") =>
    apiClient.post('/chat', { question, context }),
};
