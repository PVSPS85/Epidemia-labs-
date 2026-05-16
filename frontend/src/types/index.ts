export type SeverityLevel = "low" | "moderate" | "high" | "critical";
export type PathogenType = "virus" | "bacteria" | "fungal" | "prion" | "parasite";
export type Classification = "pandemic" | "epidemic" | "endemic" | "outbreak";
export type Status = "active" | "contained" | "resolved";

export interface Citation {
  id: string;
  title: string;
  authors: string[];
  url: string;
}

export interface Publisher {
  id: string;
  name: string;
  institution: string;
  avatar: string;
  publications: number;
  followers: number;
  verified: boolean;
}

export interface Disease {
  id: string;
  name: string;
  pathogenType: PathogenType;
  classification: Classification;
  severity: SeverityLevel;
  status: Status;
  stats: {
    totalCases: number;
    activeCases: number;
    deaths: number;
    recovered: number;
    cfr: number;       // case fatality rate %
    r0: number;        // basic reproduction number
  };
  sirParams: {
    beta: number;
    gamma: number;
    N: number;
    I0: number;
  };
  affectedCountries: {
    iso: string;
    cases: number;
    severity: SeverityLevel;
  }[];
  hotspots: {
    lat: number;
    lng: number;
    label: string;
    intensity: number;
  }[];
  article: {
    abstract: string;
    body: string;
    citations: Citation[];
  };
  author: Publisher;
  publishedAt: string;
  coverImage: string;
  tags: string[];
}

export interface SIRDataPoint {
  day: number;
  S: number;   // Susceptible
  I: number;   // Infected
  R: number;   // Recovered
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: "viewer" | "publisher";
  avatar: string;
  savedDiseases: string[];
}
