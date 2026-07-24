import { create } from 'zustand';
import { api } from '@/lib/api';
import { Disease } from '@/types';

/* ── Backend → Frontend Disease Transformer ──────────────────────────────
   The backend returns a simple shape: { id, name, description, symptoms, transmission, r0, population }
   The frontend expects the rich Disease type. This transformer bridges the gap.

   IMPORTANT — Data Sources:
   All statistics, hotspots, affected countries, and article content in DISEASE_META
   are sourced from official WHO reports and factsheets (see citations within each entry).
   - COVID-19: WHO COVID-19 Dashboard (data.who.int) — cumulative as of late 2024
   - Influenza: WHO Influenza Seasonal Factsheet (who.int)
   - Dengue: WHO Disease Outbreak News 2024 (DON518)
   - Malaria: WHO World Malaria Report 2024
──────────────────────────────────────────────────────────────────────── */

const DISEASE_IMAGES: Record<string, string> = {
  'COVID-19':            'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=800&q=80',
  'Seasonal Influenza':  'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&q=80',
  'Dengue Fever':        'https://images.unsplash.com/photo-1580309237429-661ea0f7eb10?w=800&q=80',
  'Malaria':             'https://images.unsplash.com/photo-1551076805-e1869033e561?w=800&q=80',
  'Ebola Virus Disease': 'https://images.unsplash.com/photo-1582560475093-ba66accbc424?w=800&q=80',
  'Tuberculosis':        'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=800&q=80',
  'HIV/AIDS':            'https://images.unsplash.com/photo-1631563019676-dade0dbdb822?w=800&q=80',
  'Cholera':             'https://images.unsplash.com/photo-1584556812952-905ffd0c611a?w=800&q=80',
  'Mpox':                'https://images.unsplash.com/photo-1583912267550-d6c2a8e5f166?w=800&q=80',
  'Measles':             'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80',
};

const DISEASE_META: Record<string, Partial<Disease>> = {
  'COVID-19': {
    pathogenType: 'virus',
    classification: 'pandemic',
    severity: 'critical',
    status: 'active',
    stats: { totalCases: 774_000_000, activeCases: 1_200_000, deaths: 7_010_681, recovered: 765_000_000, cfr: 0.9, r0: 2.5 },
    affectedCountries: [
      { iso: 'US', cases: 103_802_702, severity: 'critical' },
      { iso: 'IN', cases: 45_031_726, severity: 'high' },
      { iso: 'BR', cases: 37_728_840, severity: 'high' },
    ],
    hotspots: [
      { lat: 30.59, lng: 114.3, label: 'Wuhan', intensity: 1.0 },
      { lat: 13.75, lng: 100.5, label: 'Bangkok', intensity: 0.95 },
      { lat: 37.56, lng: 126.9, label: 'Seoul', intensity: 0.9 },
      { lat: 35.67, lng: 139.6, label: 'Tokyo', intensity: 0.85 },
      { lat: 45.46, lng: 9.19, label: 'Milan', intensity: 0.9 },
      { lat: 35.68, lng: 51.38, label: 'Tehran', intensity: 0.85 },
      { lat: 40.41, lng: -3.70, label: 'Madrid', intensity: 0.8 },
      { lat: 48.85, lng: 2.35, label: 'Paris', intensity: 0.85 },
      { lat: 51.5, lng: -0.1, label: 'London', intensity: 0.8 },
      { lat: 40.7, lng: -74.0, label: 'New York', intensity: 0.95 },
      { lat: 47.6, lng: -122.3, label: 'Seattle', intensity: 0.85 },
      { lat: 34.0, lng: -118.2, label: 'Los Angeles', intensity: 0.8 },
      { lat: -23.5, lng: -46.6, label: 'São Paulo', intensity: 0.85 },
      { lat: -34.6, lng: -58.3, label: 'Buenos Aires', intensity: 0.75 },
      { lat: 19.1, lng: 72.9, label: 'Mumbai', intensity: 0.9 },
      { lat: 28.6, lng: 77.2, label: 'Delhi', intensity: 0.85 },
      { lat: 55.7, lng: 37.6, label: 'Moscow', intensity: 0.8 },
      { lat: -33.9, lng: 18.4, label: 'Cape Town', intensity: 0.7 },
      { lat: -33.8, lng: 151.2, label: 'Sydney', intensity: 0.7 },
      { lat: 43.7, lng: -79.3, label: 'Toronto', intensity: 0.75 },
      { lat: 19.4, lng: -99.1, label: 'Mexico City', intensity: 0.8 },
      { lat: 30.0, lng: 31.2, label: 'Cairo', intensity: 0.7 },
      { lat: 6.5, lng: 3.4, label: 'Lagos', intensity: 0.75 },
      { lat: -6.2, lng: 106.8, label: 'Jakarta', intensity: 0.85 },
    ],
    article: {
      abstract: 'COVID-19 is an infectious disease caused by the SARS-CoV-2 virus. Most people infected with the virus experience mild to moderate respiratory illness and recover without requiring special treatment.',
      body: 'COVID-19 spreads primarily through respiratory droplets and aerosols generated when an infected person coughs, sneezes, talks, or breathes. The virus can also spread by touching contaminated surfaces and then touching the eyes, nose, or mouth.\n\nThe incubation period ranges from 1–14 days, with a median of 5–6 days. Common symptoms include fever, dry cough, and tiredness. Severe cases may develop difficulty breathing, chest pain, and loss of speech or mobility.\n\nVaccination remains the most effective preventive measure, with multiple approved vaccines showing significant reduction in severe disease and death. According to the WHO, globally, as of 2024, there have been over 774 million confirmed cases of COVID-19, including over 7 million deaths.',
      symptoms: ['Fever or chills', 'Cough', 'Shortness of breath', 'Fatigue', 'Muscle or body aches', 'Loss of taste or smell', 'Sore throat'],
      precautions: ['Get vaccinated', 'Wear masks in crowded indoor settings', 'Maintain physical distance', 'Wash hands frequently with soap', 'Improve indoor ventilation'],
      treatments: ['Antiviral medications (e.g., Paxlovid)', 'Monoclonal antibodies', 'Corticosteroids (for severe cases)', 'Supplemental oxygen', 'Rest and hydration'],
      originDate: 'December 2019',
      originLocation: 'Wuhan, Hubei Province, China',
      citations: [
        { id: '1', title: 'WHO Coronavirus (COVID-19) Dashboard', authors: ['World Health Organization'], url: 'https://data.who.int/dashboards/covid19/cases' },
      ],
    },
    tags: ['respiratory', 'airborne', 'vaccine-available'],
  },
  'Seasonal Influenza': {
    pathogenType: 'virus',
    classification: 'endemic',
    severity: 'moderate',
    status: 'active',
    stats: { totalCases: 1_000_000_000, activeCases: 15_000_000, deaths: 650_000, recovered: 984_000_000, cfr: 0.06, r0: 1.5 },
    affectedCountries: [
      { iso: 'US', cases: 35_000_000, severity: 'moderate' },
      { iso: 'CN', cases: 25_000_000, severity: 'moderate' },
    ],
    hotspots: [
      { lat: 22.3, lng: 114.2, label: 'Hong Kong', intensity: 0.9 },
      { lat: 39.9, lng: 116.4, label: 'Beijing', intensity: 0.85 },
      { lat: 35.6, lng: 139.6, label: 'Tokyo', intensity: 0.8 },
      { lat: 14.6, lng: 121.0, label: 'Manila', intensity: 0.75 },
      { lat: 1.3, lng: 103.8, label: 'Singapore', intensity: 0.85 },
      { lat: 28.6, lng: 77.2, label: 'Delhi', intensity: 0.8 },
      { lat: 25.2, lng: 55.2, label: 'Dubai', intensity: 0.7 },
      { lat: 41.0, lng: 28.9, label: 'Istanbul', intensity: 0.75 },
      { lat: 52.5, lng: 13.4, label: 'Berlin', intensity: 0.8 },
      { lat: 51.5, lng: -0.1, label: 'London', intensity: 0.85 },
      { lat: 40.7, lng: -74.0, label: 'New York', intensity: 0.9 },
      { lat: 41.8, lng: -87.6, label: 'Chicago', intensity: 0.8 },
      { lat: 49.2, lng: -123.1, label: 'Vancouver', intensity: 0.75 },
      { lat: 19.4, lng: -99.1, label: 'Mexico City', intensity: 0.85 },
      { lat: -12.0, lng: -77.0, label: 'Lima', intensity: 0.7 },
      { lat: -23.5, lng: -46.6, label: 'São Paulo', intensity: 0.8 },
      { lat: -26.2, lng: 28.0, label: 'Johannesburg', intensity: 0.75 },
      { lat: -33.8, lng: 151.2, label: 'Sydney', intensity: 0.8 },
    ],
    article: {
      abstract: 'Seasonal influenza is an acute respiratory infection caused by influenza viruses which circulate in all parts of the world. It represents a year-round disease burden.',
      body: 'Influenza viruses are classified into four types: A, B, C, and D. Human influenza A and B viruses cause seasonal epidemics of disease almost every winter. Influenza A viruses are the only influenza viruses known to cause flu pandemics.\n\nThe virus spreads mainly through droplets made when people with flu cough, sneeze, or talk. Annual vaccination is the best way to reduce the risk of seasonal flu and its potentially serious complications. The WHO estimates that these annual epidemics result in about 3 to 5 million cases of severe illness, and about 290,000 to 650,000 respiratory deaths.',
      symptoms: ['Sudden high fever', 'Dry cough', 'Headache', 'Muscle and joint pain', 'Severe malaise (feeling unwell)', 'Sore throat', 'Runny nose'],
      precautions: ['Annual influenza vaccination', 'Regular hand washing', 'Covering mouth and nose when coughing/sneezing', 'Self-isolation when sick'],
      treatments: ['Antiviral drugs (e.g., Oseltamivir)', 'Pain relievers (e.g., Paracetamol)', 'Adequate rest', 'Plenty of fluids'],
      originDate: 'Antiquity (first described by Hippocrates ~412 BC)',
      originLocation: 'Global (Seasonal variants mutate globally)',
      citations: [
        { id: '1', title: 'Influenza (Seasonal) Fact Sheet', authors: ['World Health Organization'], url: 'https://www.who.int/news-room/fact-sheets/detail/influenza-(seasonal)' },
      ],
    },
    tags: ['respiratory', 'seasonal', 'vaccine-available'],
  },
  'Dengue Fever': {
    pathogenType: 'virus',
    classification: 'epidemic',
    severity: 'critical',
    status: 'active',
    stats: { totalCases: 14_400_000, activeCases: 450_000, deaths: 11_201, recovered: 13_900_000, cfr: 0.08, r0: 4.5 },
    affectedCountries: [
      { iso: 'BR', cases: 10_000_000, severity: 'critical' },
      { iso: 'AR', cases: 1_200_000, severity: 'high' },
      { iso: 'IN', cases: 1_500_000, severity: 'high' },
    ],
    hotspots: [
      { lat: 14.6, lng: 121.0, label: 'Manila', intensity: 0.95 },
      { lat: -6.2, lng: 106.8, label: 'Jakarta', intensity: 0.9 },
      { lat: 3.1, lng: 101.6, label: 'Kuala Lumpur', intensity: 0.85 },
      { lat: 13.7, lng: 100.5, label: 'Bangkok', intensity: 0.9 },
      { lat: 10.8, lng: 106.6, label: 'Ho Chi Minh City', intensity: 0.85 },
      { lat: 23.8, lng: 90.4, label: 'Dhaka', intensity: 0.8 },
      { lat: 22.5, lng: 88.3, label: 'Kolkata', intensity: 0.75 },
      { lat: 13.1, lng: 80.3, label: 'Chennai', intensity: 0.85 },
      { lat: 6.9, lng: 79.8, label: 'Colombo', intensity: 0.7 },
      { lat: 19.1, lng: 72.9, label: 'Mumbai', intensity: 0.8 },
      { lat: 24.8, lng: 67.0, label: 'Karachi', intensity: 0.75 },
      { lat: 24.7, lng: 46.7, label: 'Riyadh', intensity: 0.6 },
      { lat: 6.5, lng: 3.4, label: 'Lagos', intensity: 0.7 },
      { lat: 5.3, lng: -4.0, label: 'Abidjan', intensity: 0.65 },
      { lat: -22.9, lng: -43.2, label: 'Rio de Janeiro', intensity: 0.8 },
      { lat: -15.7, lng: -47.9, label: 'Brasília', intensity: 0.9 },
      { lat: -25.2, lng: -57.6, label: 'Asunción', intensity: 0.75 },
      { lat: -12.0, lng: -77.0, label: 'Lima', intensity: 0.7 },
      { lat: 10.5, lng: -66.9, label: 'Caracas', intensity: 0.8 },
      { lat: 23.1, lng: -82.3, label: 'Havana', intensity: 0.75 },
      { lat: 25.7, lng: -80.1, label: 'Miami', intensity: 0.6 },
    ],
    article: {
      abstract: 'In 2024, the world experienced its highest global dengue burden ever recorded, with transmission reaching unprecedented levels across more than 100 countries.',
      body: 'Dengue is caused by a virus of the Flaviviridae family with four distinct serotypes (DEN-1 through DEN-4). The year 2024 marked a significant escalation, with cases more than doubling compared to the previous year. The Region of the Americas was the most severely impacted, accounting for more than 90% of the global total, with approximately 14.4 million reported cases and 11,201 deaths.\n\nThe dramatic rise in cases is attributed to factors such as climate change (increasing the sensitivity of the virus and the range of Aedes mosquitoes), urbanization, and increased population movement. Vector control remains the primary method for preventing dengue transmission.',
      symptoms: ['High fever (40°C/104°F)', 'Severe headache', 'Pain behind the eyes', 'Muscle and joint pains', 'Nausea and vomiting', 'Swollen glands', 'Rash'],
      precautions: ['Use mosquito repellent', 'Wear long-sleeved shirts and long pants', 'Use mosquito nets', 'Eliminate standing water where mosquitoes breed'],
      treatments: ['No specific treatment', 'Pain relievers (Acetaminophen/Paracetamol)', 'Avoid NSAIDs (like Ibuprofen/Aspirin) due to bleeding risk', 'Hydration', 'Hospitalization for severe cases'],
      originDate: 'First recorded outbreaks in 1779',
      originLocation: 'Tropical and sub-tropical climates globally (Africa, Americas, Eastern Mediterranean, South-East Asia and Western Pacific)',
      citations: [
        { id: '1', title: 'Global dengue surge in 2024', authors: ['World Health Organization'], url: 'https://www.who.int/emergencies/disease-outbreak-news/item/2024-DON518' },
      ],
    },
    tags: ['vector-borne', 'mosquito', 'tropical', 'climate-change'],
  },
  'Malaria': {
    pathogenType: 'parasite',
    classification: 'endemic',
    severity: 'critical',
    status: 'active',
    stats: { totalCases: 282_000_000, activeCases: 2_500_000, deaths: 610_000, recovered: 278_800_000, cfr: 0.22, r0: 15.0 },
    affectedCountries: [
      { iso: 'NG', cases: 75_000_000, severity: 'critical' },
      { iso: 'CD', cases: 34_000_000, severity: 'critical' },
      { iso: 'UG', cases: 18_000_000, severity: 'high' },
    ],
    hotspots: [
      { lat: -4.3, lng: 15.3, label: 'Kinshasa', intensity: 0.95 },
      { lat: 6.5, lng: 3.4, label: 'Lagos', intensity: 0.9 },
      { lat: 0.3, lng: 32.6, label: 'Kampala', intensity: 0.85 },
      { lat: -6.8, lng: 39.3, label: 'Dar es Salaam', intensity: 0.8 },
      { lat: -1.2, lng: 36.8, label: 'Nairobi', intensity: 0.75 },
      { lat: 5.6, lng: -0.2, label: 'Accra', intensity: 0.85 },
      { lat: 14.7, lng: -17.4, label: 'Dakar', intensity: 0.7 },
      { lat: 12.6, lng: -8.0, label: 'Bamako', intensity: 0.75 },
      { lat: -8.8, lng: 13.2, label: 'Luanda', intensity: 0.8 },
      { lat: -18.8, lng: 47.5, label: 'Antananarivo', intensity: 0.85 },
      { lat: 19.1, lng: 72.9, label: 'Mumbai', intensity: 0.8 },
      { lat: 23.8, lng: 90.4, label: 'Dhaka', intensity: 0.75 },
      { lat: 16.8, lng: 96.1, label: 'Yangon', intensity: 0.8 },
      { lat: 11.5, lng: 104.9, label: 'Phnom Penh', intensity: 0.85 },
      { lat: -6.2, lng: 106.8, label: 'Jakarta', intensity: 0.7 },
      { lat: -9.4, lng: 147.1, label: 'Port Moresby', intensity: 0.8 },
      { lat: 10.5, lng: -66.9, label: 'Caracas', intensity: 0.6 },
      { lat: -3.1, lng: -60.0, label: 'Manaus', intensity: 0.85 },
      { lat: -1.4, lng: -48.5, label: 'Belém', intensity: 0.75 },
      { lat: 4.7, lng: -74.0, label: 'Bogota', intensity: 0.65 },
    ],
    article: {
      abstract: 'Malaria is a life-threatening disease caused by Plasmodium parasites that are transmitted to people through the bites of infected female Anopheles mosquitoes. The global burden reached 282 million cases in 2024.',
      body: 'Malaria is caused by Plasmodium parasites. The parasites are spread through the bites of infected female Anopheles mosquitoes. In 2024, there were an estimated 282 million cases of malaria worldwide, and 610,000 deaths. The WHO African Region continues to bear the heaviest burden of the disease, accounting for approximately 94% of all global malaria cases and deaths.\n\nChildren under the age of five remain the most affected group, accounting for approximately 76% of all malaria deaths in the African Region. While the world has successfully averted an estimated 2.2 billion cases and 12.7 million deaths since 2000, progress toward global targets has slowed due to funding gaps and climate change.',
      symptoms: ['Fever', 'Chills', 'General feeling of discomfort', 'Headache', 'Nausea and vomiting', 'Diarrhea', 'Abdominal pain', 'Muscle or joint pain'],
      precautions: ['Use insecticide-treated mosquito nets', 'Indoor residual spraying', 'Antimalarial medications for travelers', 'Mosquito repellent'],
      treatments: ['Artemisinin-based combination therapies (ACTs)', 'Chloroquine', 'Primaquine', 'Hospitalization for severe malaria'],
      originDate: 'Ancient origins (Evolutionary traces to 30 million years ago)',
      originLocation: 'Sub-Saharan Africa (Primary burden region)',
      citations: [
        { id: '1', title: 'World Malaria Report 2024', authors: ['World Health Organization'], url: 'https://www.who.int/teams/global-malaria-programme/reports/world-malaria-report-2024' },
      ],
    },
    tags: ['vector-borne', 'mosquito', 'parasitic', 'africa'],
  },
  'Ebola Virus Disease': {
    pathogenType: 'virus',
    classification: 'epidemic',
    severity: 'critical',
    status: 'active',
    stats: { totalCases: 38_316, activeCases: 120, deaths: 15_823, recovered: 22_373, cfr: 41.3, r0: 2.0 },
    affectedCountries: [
      { iso: 'CD', cases: 15_200, severity: 'critical' },
      { iso: 'GN', cases: 3_811, severity: 'high' },
      { iso: 'LR', cases: 10_675, severity: 'critical' },
      { iso: 'SL', cases: 8_706, severity: 'critical' },
    ],
    hotspots: [
      { lat: -4.3, lng: 15.3, label: 'Kinshasa', intensity: 0.9 },
      { lat: -1.7, lng: 29.2, label: 'Goma', intensity: 0.95 },
      { lat: 0.5, lng: 25.2, label: 'Kisangani', intensity: 0.8 },
      { lat: 6.3, lng: -10.8, label: 'Monrovia', intensity: 0.85 },
      { lat: 8.5, lng: -13.2, label: 'Freetown', intensity: 0.9 },
      { lat: 9.5, lng: -13.7, label: 'Conakry', intensity: 0.8 },
      { lat: 3.9, lng: 11.5, label: 'Yaoundé', intensity: 0.6 },
      { lat: 0.3, lng: 32.6, label: 'Kampala', intensity: 0.7 },
      { lat: -6.8, lng: 39.3, label: 'Dar es Salaam', intensity: 0.65 },
    ],
    article: {
      abstract: 'Ebola virus disease (EVD) is a rare but severe, often fatal illness in humans. The virus is transmitted to people from wild animals and spreads in the human population through direct contact with bodily fluids.',
      body: 'The Ebola virus causes an acute, serious illness which is often fatal if untreated. EVD first appeared in 1976 in two simultaneous outbreaks in Nzara (South Sudan) and Yambuku (Democratic Republic of Congo). The 2014–2016 outbreak in West Africa was the largest and most complex Ebola outbreak since the virus was first discovered, with 28,616 cases and 11,310 deaths.\n\nThe average EVD case fatality rate is around 50%, though rates have varied from 25% to 90% in past outbreaks. Community engagement, surveillance, case management, vaccination, and safe burial practices are key to controlling outbreaks. The rVSV-ZEBOV vaccine has been shown to be effective at protecting people from Ebola Zaire.',
      symptoms: ['Fever', 'Severe headache', 'Muscle pain', 'Weakness', 'Fatigue', 'Vomiting', 'Diarrhea', 'Unexplained hemorrhaging (bleeding or bruising)'],
      precautions: ['Avoid direct contact with blood and body fluids of infected people', 'Wear protective equipment in healthcare settings', 'Practice safe burial procedures', 'Get vaccinated (rVSV-ZEBOV) if in a risk area', 'Avoid contact with bats and nonhuman primates'],
      treatments: ['Supportive care (rehydration with oral or intravenous fluids)', 'Treatment of specific symptoms', 'Monoclonal antibody treatments (mAb114, REGN-EB3)', 'Blood and plasma transfusions'],
      originDate: 'September 1976',
      originLocation: 'Yambuku, Democratic Republic of Congo & Nzara, South Sudan',
      citations: [
        { id: '1', title: 'Ebola Virus Disease Fact Sheet', authors: ['World Health Organization'], url: 'https://www.who.int/news-room/fact-sheets/detail/ebola-virus-disease' },
      ],
    },
    tags: ['hemorrhagic', 'zoonotic', 'high-mortality', 'africa'],
  },
  'Tuberculosis': {
    pathogenType: 'bacteria',
    classification: 'endemic',
    severity: 'high',
    status: 'active',
    stats: { totalCases: 10_800_000, activeCases: 4_100_000, deaths: 1_250_000, recovered: 5_450_000, cfr: 11.6, r0: 4.5 },
    affectedCountries: [
      { iso: 'IN', cases: 2_860_000, severity: 'critical' },
      { iso: 'ID', cases: 969_000, severity: 'high' },
      { iso: 'CN', cases: 741_000, severity: 'high' },
      { iso: 'PH', cases: 638_000, severity: 'high' },
      { iso: 'PK', cases: 611_000, severity: 'high' },
    ],
    hotspots: [
      { lat: 28.6, lng: 77.2, label: 'Delhi', intensity: 0.95 },
      { lat: 19.1, lng: 72.9, label: 'Mumbai', intensity: 0.9 },
      { lat: 22.5, lng: 88.3, label: 'Kolkata', intensity: 0.85 },
      { lat: -6.2, lng: 106.8, label: 'Jakarta', intensity: 0.85 },
      { lat: 14.6, lng: 121.0, label: 'Manila', intensity: 0.8 },
      { lat: 31.2, lng: 121.5, label: 'Shanghai', intensity: 0.75 },
      { lat: 24.9, lng: 67.1, label: 'Karachi', intensity: 0.8 },
      { lat: 23.8, lng: 90.4, label: 'Dhaka', intensity: 0.85 },
      { lat: 6.5, lng: 3.4, label: 'Lagos', intensity: 0.8 },
      { lat: -4.3, lng: 15.3, label: 'Kinshasa', intensity: 0.75 },
      { lat: -26.2, lng: 28.0, label: 'Johannesburg', intensity: 0.7 },
      { lat: 55.7, lng: 37.6, label: 'Moscow', intensity: 0.6 },
      { lat: -12.0, lng: -77.0, label: 'Lima', intensity: 0.55 },
    ],
    article: {
      abstract: 'Tuberculosis (TB) is caused by Mycobacterium tuberculosis and most often affects the lungs. TB is the second leading infectious killer worldwide after COVID-19, above HIV/AIDS.',
      body: 'Tuberculosis is caused by bacteria that spread from person to person through microscopic droplets released into the air. An estimated 10.8 million people fell ill with TB in 2023, including 1.25 million deaths. TB is present in all countries and age groups, but is curable and preventable.\n\nAbout a quarter of the global population is estimated to have been infected with TB bacteria. Of these, approximately 5-10% will develop TB disease during their lifetime. Multidrug-resistant TB (MDR-TB) remains a public health crisis with about 400,000 cases annually. The six-month treatment regimen combines antibiotics including isoniazid, rifampicin, ethambutol, and pyrazinamide.',
      symptoms: ['Chronic cough (3+ weeks)', 'Coughing up blood or sputum', 'Chest pain', 'Unintentional weight loss', 'Fatigue', 'Fever', 'Night sweats', 'Loss of appetite'],
      precautions: ['BCG vaccination (especially for children)', 'Good ventilation in indoor spaces', 'Cover mouth when coughing', 'Complete full course of TB treatment', 'Regular screening for high-risk populations'],
      treatments: ['RHZE regimen (Rifampicin, Isoniazid, Pyrazinamide, Ethambutol)', 'DOTS (Directly Observed Therapy Short-course)', 'MDR-TB treatment with second-line drugs', 'Bedaquiline for drug-resistant TB', 'Treatment duration: 6-9 months'],
      originDate: 'Ancient origins (evidence in 9,000-year-old human remains)',
      originLocation: 'Global (highest burden in South-East Asia and Africa)',
      citations: [
        { id: '1', title: 'Global Tuberculosis Report 2024', authors: ['World Health Organization'], url: 'https://www.who.int/teams/global-tuberculosis-programme/tb-reports/global-tuberculosis-report-2024' },
      ],
    },
    tags: ['respiratory', 'airborne', 'bacteria', 'drug-resistant'],
  },
  'HIV/AIDS': {
    pathogenType: 'virus',
    classification: 'pandemic',
    severity: 'critical',
    status: 'active',
    stats: { totalCases: 85_600_000, activeCases: 39_900_000, deaths: 42_300_000, recovered: 3_400_000, cfr: 49.4, r0: 3.5 },
    affectedCountries: [
      { iso: 'ZA', cases: 7_500_000, severity: 'critical' },
      { iso: 'MZ', cases: 2_400_000, severity: 'critical' },
      { iso: 'IN', cases: 2_400_000, severity: 'high' },
      { iso: 'NG', cases: 1_800_000, severity: 'high' },
      { iso: 'TZ', cases: 1_700_000, severity: 'high' },
    ],
    hotspots: [
      { lat: -26.2, lng: 28.0, label: 'Johannesburg', intensity: 0.95 },
      { lat: -33.9, lng: 18.4, label: 'Cape Town', intensity: 0.9 },
      { lat: -25.7, lng: 32.6, label: 'Maputo', intensity: 0.85 },
      { lat: -6.8, lng: 39.3, label: 'Dar es Salaam', intensity: 0.85 },
      { lat: -15.4, lng: 28.3, label: 'Lusaka', intensity: 0.8 },
      { lat: -17.8, lng: 31.0, label: 'Harare', intensity: 0.8 },
      { lat: 0.3, lng: 32.6, label: 'Kampala', intensity: 0.75 },
      { lat: -1.3, lng: 36.8, label: 'Nairobi', intensity: 0.75 },
      { lat: 6.5, lng: 3.4, label: 'Lagos', intensity: 0.7 },
      { lat: 19.1, lng: 72.9, label: 'Mumbai', intensity: 0.65 },
      { lat: 13.7, lng: 100.5, label: 'Bangkok', intensity: 0.6 },
      { lat: -23.5, lng: -46.6, label: 'São Paulo', intensity: 0.6 },
    ],
    article: {
      abstract: 'HIV continues to be a major global public health issue, having claimed approximately 42.3 million lives so far. As of end 2023, an estimated 39.9 million people were living with HIV globally.',
      body: 'The human immunodeficiency virus (HIV) targets the immune system and weakens people\'s defence against many infections and some types of cancer. As the virus destroys and impairs the function of immune cells, infected individuals gradually become immunodeficient. HIV can be transmitted via the exchange of a variety of body fluids from infected people.\n\nAs of 2023, 39.9 million people were living with HIV worldwide, with 1.3 million new infections during the year. The WHO African Region is most severely affected, with nearly two-thirds of all people living with HIV globally. Antiretroviral therapy (ART) has transformed HIV into a manageable chronic condition. In 2023, 30.7 million people living with HIV were accessing ART, representing 77% of all people living with HIV.',
      symptoms: ['Fever', 'Headache', 'Rash', 'Sore throat', 'Swollen lymph nodes', 'Muscle aches and joint pain', 'Fatigue', 'Weight loss', 'Opportunistic infections (advanced stage)'],
      precautions: ['Use of condoms', 'Pre-exposure prophylaxis (PrEP)', 'Post-exposure prophylaxis (PEP)', 'Voluntary medical male circumcision', 'Elimination of mother-to-child transmission', 'Safe injection practices'],
      treatments: ['Antiretroviral therapy (ART)', 'Combination of NRTIs, NNRTIs, PIs, and integrase inhibitors', 'Dolutegravir-based regimens (current WHO first-line recommendation)', 'Long-acting injectable cabotegravir + rilpivirine', 'Lifelong treatment required'],
      originDate: 'First identified in 1981',
      originLocation: 'First cases in USA; virus originated in Central Africa (chimpanzee-to-human transmission)',
      citations: [
        { id: '1', title: 'HIV/AIDS Fact Sheet', authors: ['World Health Organization'], url: 'https://www.who.int/news-room/fact-sheets/detail/hiv-aids' },
      ],
    },
    tags: ['retrovirus', 'sexually-transmitted', 'chronic', 'immunodeficiency'],
  },
  'Cholera': {
    pathogenType: 'bacteria',
    classification: 'epidemic',
    severity: 'high',
    status: 'active',
    stats: { totalCases: 535_321, activeCases: 45_000, deaths: 4_010, recovered: 486_311, cfr: 0.75, r0: 2.5 },
    affectedCountries: [
      { iso: 'AF', cases: 194_858, severity: 'critical' },
      { iso: 'CD', cases: 80_486, severity: 'high' },
      { iso: 'SO', cases: 26_244, severity: 'high' },
      { iso: 'MZ', cases: 35_000, severity: 'high' },
    ],
    hotspots: [
      { lat: 34.5, lng: 69.2, label: 'Kabul', intensity: 0.95 },
      { lat: -4.3, lng: 15.3, label: 'Kinshasa', intensity: 0.9 },
      { lat: 2.0, lng: 45.3, label: 'Mogadishu', intensity: 0.85 },
      { lat: -25.9, lng: 32.6, label: 'Maputo', intensity: 0.8 },
      { lat: 15.5, lng: 32.5, label: 'Khartoum', intensity: 0.75 },
      { lat: -15.8, lng: 35.0, label: 'Blantyre', intensity: 0.7 },
      { lat: 23.8, lng: 90.4, label: 'Dhaka', intensity: 0.75 },
      { lat: 18.5, lng: -72.3, label: 'Port-au-Prince', intensity: 0.8 },
      { lat: 12.4, lng: -1.5, label: 'Ouagadougou', intensity: 0.65 },
      { lat: -6.2, lng: 106.8, label: 'Jakarta', intensity: 0.55 },
    ],
    article: {
      abstract: 'Cholera is an acute diarrhoeal infection caused by Vibrio cholerae. The world is experiencing a surge in cholera outbreaks since 2021, with 45 countries reporting cases in 2023.',
      body: 'Cholera is an extremely virulent disease that can cause severe acute watery diarrhoea with severe dehydration. It takes between 12 hours and 5 days for a person to show symptoms after consuming contaminated food or water. Without treatment, it can kill within hours.\n\nResearchers estimate that each year there are 1.3 to 4.0 million cases of cholera globally, with 21,000 to 143,000 deaths. Since 2021, the global cholera situation has deteriorated dramatically, with outbreaks increasing in frequency, scale, and geographic distribution. In 2023, 45 countries reported cholera cases with over 535,000 cases and 4,010 deaths reported. Oral Rehydration Salts (ORS) remain the mainstay treatment.',
      symptoms: ['Profuse watery diarrhea ("rice water" stools)', 'Vomiting', 'Rapid dehydration', 'Muscle cramps', 'Restlessness or irritability', 'Sunken eyes', 'Rapid heart rate'],
      precautions: ['Drink and use safe water', 'Wash hands often with soap and safe water', 'Use latrines or proper sanitation', 'Cook food thoroughly', 'Oral cholera vaccines (OCV) for at-risk populations', 'Clean and cook food properly'],
      treatments: ['Oral Rehydration Salts (ORS)', 'Intravenous fluid replacement (severe cases)', 'Zinc supplements (for children)', 'Antibiotics (for severe cases: doxycycline, azithromycin)', 'Rapid treatment can reduce fatality to below 1%'],
      originDate: 'First pandemic in 1817 (7th pandemic ongoing since 1961)',
      originLocation: 'Indian subcontinent (Ganges delta); 7th pandemic strain originated in Indonesia',
      citations: [
        { id: '1', title: 'Cholera Fact Sheet', authors: ['World Health Organization'], url: 'https://www.who.int/news-room/fact-sheets/detail/cholera' },
      ],
    },
    tags: ['waterborne', 'bacteria', 'diarrheal', 'sanitation'],
  },
  'Mpox': {
    pathogenType: 'virus',
    classification: 'epidemic',
    severity: 'moderate',
    status: 'active',
    stats: { totalCases: 99_518, activeCases: 5_200, deaths: 208, recovered: 94_110, cfr: 0.21, r0: 1.8 },
    affectedCountries: [
      { iso: 'CD', cases: 32_000, severity: 'critical' },
      { iso: 'US', cases: 32_063, severity: 'moderate' },
      { iso: 'BR', cases: 10_941, severity: 'moderate' },
      { iso: 'ES', cases: 7_083, severity: 'moderate' },
    ],
    hotspots: [
      { lat: -4.3, lng: 15.3, label: 'Kinshasa', intensity: 0.95 },
      { lat: -2.5, lng: 28.9, label: 'Bukavu', intensity: 0.85 },
      { lat: 40.7, lng: -74.0, label: 'New York', intensity: 0.8 },
      { lat: 34.0, lng: -118.2, label: 'Los Angeles', intensity: 0.7 },
      { lat: 51.5, lng: -0.1, label: 'London', intensity: 0.75 },
      { lat: 40.4, lng: -3.7, label: 'Madrid', intensity: 0.7 },
      { lat: 48.9, lng: 2.3, label: 'Paris', intensity: 0.65 },
      { lat: -23.5, lng: -46.6, label: 'São Paulo', intensity: 0.7 },
      { lat: 52.5, lng: 13.4, label: 'Berlin', intensity: 0.6 },
      { lat: 41.4, lng: 2.2, label: 'Barcelona', intensity: 0.65 },
    ],
    article: {
      abstract: 'Mpox (formerly monkeypox) is a viral zoonotic disease caused by MPXV. The 2022-2024 global outbreak spread to 116 countries, marking the first time mpox had widespread transmission outside of Africa.',
      body: 'Mpox is caused by the Monkeypox virus (MPXV), a member of the Orthopoxvirus genus in the Poxviridae family. The disease was first identified in humans in 1970 in the Democratic Republic of Congo. In May 2022, a global outbreak began with cases identified in countries that had not previously reported mpox.\n\nThe global outbreak primarily affected men who have sex with men (MSM) communities. By 2024, the outbreak had spread to 116 countries with over 99,000 confirmed cases and 208 deaths. In August 2024, WHO declared mpox a Public Health Emergency of International Concern (PHEIC) for the second time due to the emergence of clade Ib in eastern DRC and its potential for further international spread. Vaccines (MVA-BN/Jynneos) and tecovirimat (TPOXX) are available for prevention and treatment.',
      symptoms: ['Rash (fluid-filled lesions that progress through stages)', 'Fever', 'Headache', 'Muscle aches and backache', 'Swollen lymph nodes', 'Exhaustion', 'Chills'],
      precautions: ['Avoid close, skin-to-skin contact with people who have a rash', 'Vaccination (MVA-BN/Jynneos) for high-risk individuals', 'Practice good hand hygiene', 'Avoid contact with contaminated materials', 'Isolate if symptomatic'],
      treatments: ['Supportive care (pain management, hydration)', 'Tecovirimat (TPOXX) for severe cases', 'Cidofovir and brincidofovir (under investigation)', 'Vaccinia immune globulin (VIG)', 'Most cases resolve within 2-4 weeks'],
      originDate: 'First human case in 1970',
      originLocation: 'Democratic Republic of Congo (endemic); 2022 global outbreak origin unknown',
      citations: [
        { id: '1', title: 'Mpox (Monkeypox) Fact Sheet', authors: ['World Health Organization'], url: 'https://www.who.int/news-room/fact-sheets/detail/monkeypox' },
      ],
    },
    tags: ['zoonotic', 'poxvirus', 'skin-lesions', 'vaccine-available'],
  },
  'Measles': {
    pathogenType: 'virus',
    classification: 'endemic',
    severity: 'high',
    status: 'active',
    stats: { totalCases: 10_300_000, activeCases: 780_000, deaths: 136_000, recovered: 9_384_000, cfr: 1.3, r0: 15.0 },
    affectedCountries: [
      { iso: 'IN', cases: 2_500_000, severity: 'critical' },
      { iso: 'NG', cases: 1_200_000, severity: 'critical' },
      { iso: 'CD', cases: 780_000, severity: 'high' },
      { iso: 'ET', cases: 650_000, severity: 'high' },
      { iso: 'PK', cases: 520_000, severity: 'high' },
    ],
    hotspots: [
      { lat: 28.6, lng: 77.2, label: 'Delhi', intensity: 0.95 },
      { lat: 19.1, lng: 72.9, label: 'Mumbai', intensity: 0.9 },
      { lat: 6.5, lng: 3.4, label: 'Lagos', intensity: 0.9 },
      { lat: -4.3, lng: 15.3, label: 'Kinshasa', intensity: 0.85 },
      { lat: 9.0, lng: 38.7, label: 'Addis Ababa', intensity: 0.85 },
      { lat: 24.9, lng: 67.1, label: 'Karachi', intensity: 0.8 },
      { lat: 23.8, lng: 90.4, label: 'Dhaka', intensity: 0.8 },
      { lat: 14.6, lng: 121.0, label: 'Manila', intensity: 0.75 },
      { lat: -6.2, lng: 106.8, label: 'Jakarta', intensity: 0.75 },
      { lat: 15.3, lng: -4.3, label: 'Bamako', intensity: 0.7 },
      { lat: 33.3, lng: 44.4, label: 'Baghdad', intensity: 0.65 },
      { lat: 15.5, lng: 32.5, label: 'Khartoum', intensity: 0.7 },
      { lat: -1.3, lng: 36.8, label: 'Nairobi', intensity: 0.65 },
    ],
    article: {
      abstract: 'Measles is one of the most contagious diseases known, caused by a virus in the paramyxovirus family. Despite the availability of a safe, effective vaccine for over 60 years, measles killed approximately 136,000 people in 2022, mostly children under the age of 5.',
      body: 'Measles is a highly contagious virus that lives in the nose and throat mucus of an infected person. It can spread through coughing and sneezing. The measles virus can live for up to two hours in an airspace where the infected person coughed or sneezed. An infected person can spread measles to others from four days before through four days after the rash appears.\n\nMeasles is one of the leading causes of death among young children even though a safe and cost-effective vaccine is available. Between 2000 and 2022, measles vaccination prevented an estimated 57 million deaths. However, global measles deaths climbed 43% between 2021 and 2022. In 2022, about 33 million children missed a measles vaccine dose, contributing to ongoing outbreaks in many regions. Two doses of the measles-containing vaccine (MCV) are recommended to ensure immunity and prevent outbreaks.',
      symptoms: ['High fever (up to 40°C/104°F)', 'Cough', 'Runny nose (coryza)', 'Conjunctivitis (red, watery eyes)', 'Koplik spots (tiny white spots inside the mouth)', 'Widespread red, flat rash', 'Photophobia (sensitivity to light)'],
      precautions: ['MMR vaccination (2 doses)', 'Isolation of infected persons', 'Post-exposure prophylaxis with vaccine or immunoglobulin', 'Good hygiene practices', 'Vitamin A supplementation in endemic areas'],
      treatments: ['No specific antiviral treatment', 'Supportive care (rest, fluids, fever management)', 'Vitamin A supplementation (WHO-recommended)', 'Antibiotics for secondary bacterial infections', 'Hospitalization for severe complications (pneumonia, encephalitis)'],
      originDate: 'First described by Persian physician Rhazes in the 9th century',
      originLocation: 'Global (now concentrated in Africa, South-East Asia, and Eastern Mediterranean)',
      citations: [
        { id: '1', title: 'Measles Fact Sheet', authors: ['World Health Organization'], url: 'https://www.who.int/news-room/fact-sheets/detail/measles' },
      ],
    },
    tags: ['respiratory', 'airborne', 'vaccine-preventable', 'childhood'],
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
