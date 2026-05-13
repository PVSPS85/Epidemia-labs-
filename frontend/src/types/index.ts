// frontend/src/types/index.ts

export interface User {
  id: string;
  email: string;
  role: 'Viewer' | 'Research Publisher';
}

export interface Disease {
  id: string;
  name: string;
  description: string;
  r0: number;
  mortality_rate: number;
  incubation_period_days: number;
  recovery_period_days: number;
  population: number;
  symptoms: string;
  transmission: string;
}

export interface Publication {
  id: string;
  title: string;
  content: string;
  disease_id: string;
  uploaded_by: string;
  created_at: string;
}

export interface SimulationResult {
  day: number;
  susceptible: number;
  infected: number;
  recovered: number;
}
