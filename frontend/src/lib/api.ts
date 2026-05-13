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
  return process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
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

export const api = {
  // Diseases
  getDiseases: () => apiClient.get('/diseases/'),
  getDiseaseById: (id: string) => apiClient.get(`/diseases/${id}`),
  
  // Simulation
  runSimulation: (data: { population: number; r0: number; days: number }) => 
    apiClient.post('/simulate/run', data),
    
  // Publications
  uploadPublication: (formData: FormData) => 
    apiClient.post('/publications/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
};
