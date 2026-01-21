// Travel Guide Types

export interface TravelGuide {
  destination: string;
  country: string;
  theme: string;
  overview: DestinationOverview;
  topCities: CityRanking[];
  neighborhoods: Neighborhood[];
  attractions: Attraction[];
  budget: BudgetEstimate;
  transportation: TransportationGuide;
  safety: SafetyInfo;
  culture: CultureGuide;
  mistakes: CommonMistake[];
  bestFor: TravelerType[];
  images: DestinationImage[];
  mapData: MapLocation[];
}

export interface DestinationOverview {
  summary: string;
  highlights: string[];
  bestTimeToVisit: string;
  climate: string;
  language: string;
  currency: string;
  timeZone: string;
  visaInfo: string;
}

export interface CityRanking {
  rank: number;
  name: string;
  description: string;
  whyVisit: string;
  idealDuration: string;
  highlights: string[];
  imageUrl?: string;
}

export interface Neighborhood {
  name: string;
  city: string;
  type: 'budget' | 'mid-range' | 'luxury' | 'local';
  description: string;
  priceRange: {
    min: number;
    max: number;
    currency: string;
  };
  bestFor: string[];
  nearbyAttractions: string[];
}

export interface Attraction {
  name: string;
  city: string;
  type: 'popular' | 'hidden-gem' | 'cultural' | 'nature' | 'food' | 'nightlife';
  description: string;
  whyVisit: string;
  estimatedTime: string;
  cost: string;
  tips: string[];
  imageUrl?: string;
  coordinates?: { lat: number; lng: number };
}

export interface BudgetEstimate {
  currency: string;
  daily: {
    budget: { min: number; max: number };
    midRange: { min: number; max: number };
    luxury: { min: number; max: number };
  };
  breakdown: {
    accommodation: { budget: string; midRange: string; luxury: string };
    food: { budget: string; midRange: string; luxury: string };
    transport: { budget: string; midRange: string; luxury: string };
    activities: { budget: string; midRange: string; luxury: string };
  };
  weeklyTotal: {
    budget: { min: number; max: number };
    midRange: { min: number; max: number };
    luxury: { min: number; max: number };
  };
  tips: string[];
}

export interface TransportationGuide {
  gettingThere: {
    mainAirports: string[];
    alternativeOptions: string[];
  };
  gettingAround: {
    publicTransport: string;
    taxis: string;
    rentals: string;
    walking: string;
    tips: string[];
  };
  intercity: {
    options: string[];
    recommendations: string;
  };
}

export interface SafetyInfo {
  overallRating: 'very-safe' | 'safe' | 'moderate' | 'caution' | 'avoid';
  summary: string;
  concerns: string[];
  tips: string[];
  emergencyNumbers: {
    police: string;
    ambulance: string;
    tourist: string;
  };
  healthAdvice: string[];
}

export interface CultureGuide {
  summary: string;
  etiquette: string[];
  dress: string;
  tipping: string;
  greetings: string;
  taboos: string[];
  localCustoms: string[];
}

export interface CommonMistake {
  mistake: string;
  why: string;
  instead: string;
}

export interface TravelerType {
  type: string;
  why: string;
  highlights: string[];
}

export interface DestinationImage {
  url: string;
  alt: string;
  location: string;
  credit?: string;
}

export interface MapLocation {
  name: string;
  type: 'city' | 'attraction' | 'neighborhood' | 'airport';
  coordinates: { lat: number; lng: number };
  description?: string;
}

// Research State Types

export interface ResearchState {
  status: 'idle' | 'researching' | 'complete' | 'error';
  currentStep: ResearchStep | null;
  steps: ResearchStep[];
  progress: number;
  error?: string;
  guide?: TravelGuide;
}

export interface ResearchStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'active' | 'complete' | 'error';
  toolCalls?: ToolCallInfo[];
}

export interface ToolCallInfo {
  toolName: string;
  startTime: number;
  endTime?: number;
  status: 'running' | 'complete' | 'error';
}

// API Types

export interface ResearchRequest {
  destination: string;
}

export interface ResearchResponse {
  success: boolean;
  guide?: TravelGuide;
  error?: string;
}

export interface StreamMessage {
  type: 'step' | 'tool_call' | 'progress' | 'complete' | 'error';
  data: {
    step?: ResearchStep;
    toolCall?: ToolCallInfo;
    progress?: number;
    guide?: TravelGuide;
    error?: string;
  };
}
