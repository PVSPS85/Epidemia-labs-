import { create } from 'zustand';
import { api } from '@/lib/api';
import { Disease } from '@/types';

/* ── Backend → Frontend Disease Transformer ──────────────────────────────
   The backend returns a simple shape: { id, name, description, symptoms, transmission, r0, population }
   The frontend expects the rich Disease type. This transformer bridges the gap.
──────────────────────────────────────────────────────────────────────── */

const DISEASE_IMAGES: Record<string, string> = {
  'COVID-19':            'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=800&q=80',
  'Seasonal Influenza':  'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&q=80',
  'Dengue Fever':        'https://images.unsplash.com/photo-1580309237429-661ea0f7eb10?w=800&q=80',
  'Malaria':             'https://images.unsplash.com/photo-1551076805-e1869033e561?w=800&q=80',
};

const DISEASE_META: Record<string, Partial<Disease>> = {
  'COVID-19': {
    pathogenType: 'virus',
    classification: 'pandemic',
    severity: 'critical',
    status: 'active',
    stats: { totalCases: 704_753_890, activeCases: 34_200, deaths: 7_010_681, recovered: 675_619_800, cfr: 1.0, r0: 2.5 },
    affectedCountries: [
      { iso: 'US', cases: 103_802_702, severity: 'critical' },
      { iso: 'IN', cases: 45_031_726, severity: 'high' },
      { iso: 'BR', cases: 37_728_840, severity: 'high' },
    ],
    hotspots: [
      { lat: 40.7, lng: -74.0, label: 'New York', intensity: 0.9 },
      { lat: 19.1, lng: 72.9, label: 'Mumbai', intensity: 0.85 },
      { lat: -23.5, lng: -46.6, label: 'São Paulo', intensity: 0.8 },
      { lat: 51.5, lng: -0.1, label: 'London', intensity: 0.7 },
    ],
    article: {
      abstract: 'COVID-19 is an infectious disease caused by the SARS-CoV-2 virus. Most people infected with the virus experience mild to moderate respiratory illness and recover without requiring special treatment. However, some will become seriously ill and require medical attention.',
      body: 'COVID-19 spreads primarily through respiratory droplets and aerosols generated when an infected person coughs, sneezes, talks, or breathes. The virus can also spread by touching contaminated surfaces and then touching the eyes, nose, or mouth.\n\nThe incubation period ranges from 1–14 days, with a median of 5–6 days. Common symptoms include fever, dry cough, and tiredness. Severe cases may develop difficulty breathing, chest pain, and loss of speech or mobility.\n\nVaccination remains the most effective preventive measure, with multiple approved vaccines showing significant reduction in severe disease and death. Public health measures including masking, social distancing, and hand hygiene continue to play important roles in transmission control.',
      citations: [
        { id: '1', title: 'Epidemiological characteristics of COVID-19', authors: ['Wu Z', 'McGoogan JM'], url: 'https://doi.org/10.1001/jama.2020.2648' },
        { id: '2', title: 'SARS-CoV-2 transmission dynamics', authors: ['Li Q', 'Guan X'], url: 'https://doi.org/10.1056/NEJMoa2001316' },
      ],
    },
    tags: ['respiratory', 'airborne', 'vaccine-available'],
  },
  'Seasonal Influenza': {
    pathogenType: 'virus',
    classification: 'endemic',
    severity: 'moderate',
    status: 'active',
    stats: { totalCases: 1_000_000_000, activeCases: 12_500, deaths: 500_000, recovered: 999_400_000, cfr: 0.05, r0: 1.5 },
    affectedCountries: [
      { iso: 'US', cases: 35_000_000, severity: 'moderate' },
      { iso: 'CN', cases: 25_000_000, severity: 'moderate' },
    ],
    hotspots: [
      { lat: 38.9, lng: -77.0, label: 'Washington DC', intensity: 0.5 },
      { lat: 35.7, lng: 139.7, label: 'Tokyo', intensity: 0.6 },
    ],
    article: {
      abstract: 'Seasonal influenza is an acute respiratory infection caused by influenza viruses which circulate in all parts of the world. It represents a year-round disease burden.',
      body: 'Influenza viruses are classified into four types: A, B, C, and D. Human influenza A and B viruses cause seasonal epidemics of disease almost every winter. Influenza A viruses are the only influenza viruses known to cause flu pandemics.\n\nThe virus spreads mainly through droplets made when people with flu cough, sneeze, or talk. Annual vaccination is the best way to reduce the risk of seasonal flu and its potentially serious complications.',
      citations: [
        { id: '1', title: 'Global burden of respiratory infections due to seasonal influenza', authors: ['Iuliano AD', 'Roguski KM'], url: 'https://doi.org/10.1016/S0140-6736(17)33293-2' },
      ],
    },
    tags: ['respiratory', 'seasonal', 'vaccine-available'],
  },
  'Dengue Fever': {
    pathogenType: 'virus',
    classification: 'epidemic',
    severity: 'high',
    status: 'active',
    stats: { totalCases: 390_000_000, activeCases: 96_000, deaths: 40_000, recovered: 389_500_000, cfr: 2.5, r0: 4.0 },
    affectedCountries: [
      { iso: 'BR', cases: 16_000_000, severity: 'critical' },
      { iso: 'IN', cases: 8_000_000, severity: 'high' },
      { iso: 'PH', cases: 2_000_000, severity: 'high' },
    ],
    hotspots: [
      { lat: -22.9, lng: -43.2, label: 'Rio de Janeiro', intensity: 0.95 },
      { lat: 13.1, lng: 80.3, label: 'Chennai', intensity: 0.8 },
      { lat: 14.6, lng: 121.0, label: 'Manila', intensity: 0.75 },
    ],
    article: {
      abstract: 'Dengue is a mosquito-borne viral disease that has rapidly spread to all regions of WHO. Dengue virus is transmitted by female mosquitoes mainly of the species Aedes aegypti.',
      body: 'Dengue is caused by a virus of the Flaviviridae family with four distinct serotypes (DEN-1 through DEN-4). Recovery from infection provides lifelong immunity against that serotype but only partial and transient protection against subsequent infection by the other serotypes.\n\nSevere dengue is a leading cause of serious illness and death in tropical and subtropical countries. Vector control remains the primary method for preventing dengue transmission.',
      citations: [
        { id: '1', title: 'Dengue: epidemiology, pathogenesis, and clinical features', authors: ['Guzman MG', 'Harris E'], url: 'https://doi.org/10.1016/S0140-6736(14)60572-9' },
      ],
    },
    tags: ['vector-borne', 'mosquito', 'tropical'],
  },
  'Malaria': {
    pathogenType: 'parasite',
    classification: 'endemic',
    severity: 'critical',
    status: 'active',
    stats: { totalCases: 247_000_000, activeCases: 850_000, deaths: 619_000, recovered: 245_000_000, cfr: 0.25, r0: 15.0 },
    affectedCountries: [
      { iso: 'NG', cases: 68_000_000, severity: 'critical' },
      { iso: 'CD', cases: 30_000_000, severity: 'critical' },
      { iso: 'UG', cases: 16_000_000, severity: 'high' },
    ],
    hotspots: [
      { lat: 6.5, lng: 3.4, label: 'Lagos', intensity: 0.95 },
      { lat: -4.3, lng: 15.3, label: 'Kinshasa', intensity: 0.9 },
      { lat: 0.3, lng: 32.6, label: 'Kampala', intensity: 0.85 },
      { lat: -6.8, lng: 39.3, label: 'Dar es Salaam', intensity: 0.8 },
    ],
    article: {
      abstract: 'Malaria is a life-threatening disease caused by Plasmodium parasites that are transmitted to people through the bites of infected female Anopheles mosquitoes.',
      body: 'Malaria is caused by Plasmodium parasites. The parasites are spread through the bites of infected female Anopheles mosquitoes. There are 5 parasite species that cause malaria in humans, and 2 of these species – P. falciparum and P. vivax – pose the greatest threat.\n\nIn 2022, there were an estimated 247 million cases of malaria worldwide. The estimated number of malaria deaths stood at 619,000 in 2021. The WHO African Region carries a disproportionately high share of the global malaria burden.',
      citations: [
        { id: '1', title: 'Global malaria epidemiology and control', authors: ['WHO', 'World Malaria Report 2023'], url: 'https://www.who.int/teams/global-malaria-programme' },
      ],
    },
    tags: ['vector-borne', 'mosquito', 'parasitic'],
  },
};

function transformBackendDisease(raw: any): Disease {
  const name = raw.name || 'Unknown Disease';
  const meta = DISEASE_META[name] || {};
  const r0 = raw.r0 || meta.stats?.r0 || 2.0;
  const population = raw.population || 1_000_000;
  const gamma = 1 / 14; // 14-day infectious period
  const beta = r0 * gamma;

  return {
    id: raw.id || String(Math.random()),
    name,
    pathogenType: meta.pathogenType || 'virus',
    classification: meta.classification || 'epidemic',
    severity: meta.severity || 'moderate',
    status: meta.status || 'active',
    stats: meta.stats || {
      totalCases: population,
      activeCases: Math.round(population * 0.01),
      deaths: Math.round(population * 0.001),
      recovered: Math.round(population * 0.8),
      cfr: 1.0,
      r0,
    },
    sirParams: {
      beta,
      gamma,
      N: population,
      I0: 100,
      days: 365,
    },
    affectedCountries: meta.affectedCountries || [],
    hotspots: meta.hotspots || [],
    article: meta.article || {
      abstract: raw.description || 'No abstract available.',
      body: raw.description || 'Detailed information not available.',
      citations: [],
    },
    author: meta.author || {
      id: '0',
      name: 'Epidemia-Labs',
      institution: 'Research Institute',
      avatar: '',
      publications: 0,
      followers: 0,
      verified: true,
    },
    publishedAt: new Date().toISOString(),
    coverImage: DISEASE_IMAGES[name] || '',
    tags: meta.tags || (raw.symptoms || []),
  } as Disease;
}

interface DiseaseState {
  diseases: Disease[];
  selectedDisease: Disease | null;
  isLoading: boolean;
  error: string | null;
  fetchDiseases: () => Promise<void>;
  fetchDiseaseById: (id: string) => Promise<void>;
}

export const useDiseaseStore = create<DiseaseState>((set) => ({
  diseases: [],
  selectedDisease: null,
  isLoading: false,
  error: null,

  fetchDiseases: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.getDiseases();
      const raw = Array.isArray(response.data) ? response.data : [];
      const diseases = raw.map(transformBackendDisease);
      set({ diseases, isLoading: false });
    } catch (err: any) {
      set({
        diseases: [],
        error: err.message || 'Failed to connect to server. Please ensure the backend is running.',
        isLoading: false,
      });
    }
  },

  fetchDiseaseById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.getDiseaseById(id);
      const disease = transformBackendDisease(response.data);
      set({ selectedDisease: disease, isLoading: false });
    } catch (err: any) {
      set({
        selectedDisease: null,
        error: err.message || 'Disease not found or server unavailable.',
        isLoading: false,
      });
    }
  },
}));
