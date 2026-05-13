// lib/api.ts
import axios from 'axios';

// Point this to your FastAPI server
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
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
