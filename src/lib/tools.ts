// AI Tool Definitions for GitHub Models API (OpenAI-compatible)
// These tools connect to REAL APIs - no hardcoded data

export interface ToolDefinition {
  type: 'function';
  function: {
    name: string;
    description: string;
    parameters: {
      type: 'object';
      properties: Record<string, {
        type: string;
        description: string;
        enum?: string[];
        items?: { type: string };
      }>;
      required: string[];
    };
  };
}

// All available tools for the travel research agent - connected to real APIs
export const travelResearchTools: ToolDefinition[] = [
  {
    type: 'function',
    function: {
      name: 'search_destination',
      description: 'Search for a destination using real geocoding APIs (Nominatim/OpenStreetMap) and Wikipedia. Returns coordinates, country info, description, and basic facts. ALWAYS call this first!',
      parameters: {
        type: 'object',
        properties: {
          destination: {
            type: 'string',
            description: 'The destination to search for (country, city, or region name)'
          }
        },
        required: ['destination']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'get_country_info',
      description: 'Get detailed country information from REST Countries API including capital, population, languages, currencies, timezones, and regional info.',
      parameters: {
        type: 'object',
        properties: {
          country: {
            type: 'string',
            description: 'The country name to get information for'
          }
        },
        required: ['country']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'get_city_info',
      description: 'Get information about major cities in a destination using OpenStreetMap Overpass API. Returns real cities with coordinates and basic info.',
      parameters: {
        type: 'object',
        properties: {
          destination: {
            type: 'string',
            description: 'The country or region to find cities in'
          },
          limit: {
            type: 'string',
            description: 'Maximum number of cities to return (default: 10)'
          }
        },
        required: ['destination']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'search_attractions',
      description: 'Search for real tourist attractions, landmarks, and points of interest using OpenStreetMap Overpass API. Returns actual places with coordinates.',
      parameters: {
        type: 'object',
        properties: {
          destination: {
            type: 'string',
            description: 'The destination to search attractions in'
          },
          type: {
            type: 'string',
            description: 'Type of attractions to search for',
            enum: ['all', 'tourism', 'museum', 'historic', 'nature', 'religious', 'entertainment']
          },
          limit: {
            type: 'string',
            description: 'Maximum number of attractions to return (default: 20)'
          }
        },
        required: ['destination']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'get_neighborhoods',
      description: 'Find real neighborhoods and districts in a city using OpenStreetMap. Returns actual areas with coordinates.',
      parameters: {
        type: 'object',
        properties: {
          city: {
            type: 'string',
            description: 'The city to find neighborhoods in'
          },
          limit: {
            type: 'string',
            description: 'Maximum number of neighborhoods to return (default: 10)'
          }
        },
        required: ['city']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'get_budget_info',
      description: 'Get budget and cost information using Frankfurter currency API for exchange rates. Provides currency info and cost context.',
      parameters: {
        type: 'object',
        properties: {
          destination: {
            type: 'string',
            description: 'The destination to get budget info for'
          },
          baseCurrency: {
            type: 'string',
            description: 'Base currency for exchange rates (default: USD)'
          }
        },
        required: ['destination']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'get_transportation',
      description: 'Get real transportation info including airports (from OpenStreetMap) and transit options.',
      parameters: {
        type: 'object',
        properties: {
          destination: {
            type: 'string',
            description: 'The destination to get transportation info for'
          }
        },
        required: ['destination']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'get_safety_info',
      description: 'Get travel safety information from Travel-Advisory.info API and UK FCDO travel advice. Returns real advisories and safety scores.',
      parameters: {
        type: 'object',
        properties: {
          destination: {
            type: 'string',
            description: 'The destination to get safety info for'
          }
        },
        required: ['destination']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'get_culture_info',
      description: 'Get cultural information about a destination using Wikipedia and web search. Returns customs, etiquette, and cultural tips.',
      parameters: {
        type: 'object',
        properties: {
          destination: {
            type: 'string',
            description: 'The destination to get cultural info for'
          }
        },
        required: ['destination']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'get_weather',
      description: 'Get real weather and climate data from Open-Meteo API. Returns current conditions and climate averages.',
      parameters: {
        type: 'object',
        properties: {
          destination: {
            type: 'string',
            description: 'The destination to get weather for'
          }
        },
        required: ['destination']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'search_images',
      description: 'Search for real images of a destination using Wikimedia Commons API. Returns actual photos with proper attribution.',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Search query for images (e.g., "Morocco travel", "Marrakech medina")'
          },
          count: {
            type: 'string',
            description: 'Number of images to return (default: 10)'
          }
        },
        required: ['query']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'get_visa_info',
      description: 'Get visa and entry requirement information by searching Wikipedia and web sources.',
      parameters: {
        type: 'object',
        properties: {
          destination: {
            type: 'string',
            description: 'The destination country'
          },
          nationality: {
            type: 'string',
            description: 'Traveler nationality (optional)'
          }
        },
        required: ['destination']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'get_local_tips',
      description: 'Get local tips and insider advice by searching web sources and Wikipedia.',
      parameters: {
        type: 'object',
        properties: {
          destination: {
            type: 'string',
            description: 'The destination to get tips for'
          }
        },
        required: ['destination']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'compare_destinations',
      description: 'Compare multiple destinations within a country or region using real data.',
      parameters: {
        type: 'object',
        properties: {
          destinations: {
            type: 'string',
            description: 'Comma-separated list of destinations to compare'
          }
        },
        required: ['destinations']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'finalize_guide',
      description: 'Call this when you have finished gathering all research data. Signals that the guide is ready to be synthesized.',
      parameters: {
        type: 'object',
        properties: {
          destination: {
            type: 'string',
            description: 'The main destination of the guide'
          },
          summary: {
            type: 'string',
            description: 'A brief summary of the research completed'
          }
        },
        required: ['destination']
      }
    }
  }
];

// Tool name to step name mapping for UI
export const toolStepMapping: Record<string, string> = {
  'search_destination': 'Locating destination',
  'get_country_info': 'Getting country data',
  'get_city_info': 'Finding cities',
  'search_attractions': 'Discovering attractions',
  'get_neighborhoods': 'Mapping neighborhoods',
  'get_budget_info': 'Calculating costs',
  'get_transportation': 'Finding transport',
  'get_safety_info': 'Checking safety',
  'get_culture_info': 'Learning culture',
  'get_weather': 'Checking weather',
  'search_images': 'Finding photos',
  'get_visa_info': 'Checking visa requirements',
  'get_local_tips': 'Gathering tips',
  'compare_destinations': 'Comparing options',
  'finalize_guide': 'Finalizing guide'
};

// Research steps for the UI
export const researchSteps = [
  { id: 'init', name: 'Initializing research', description: 'Starting destination research with real APIs' },
  { id: 'overview', name: 'Researching destination', description: 'Gathering data from Wikipedia, OpenStreetMap' },
  { id: 'cities', name: 'Finding cities', description: 'Discovering cities via Overpass API' },
  { id: 'places', name: 'Discovering attractions', description: 'Finding real places via OpenStreetMap' },
  { id: 'neighborhoods', name: 'Mapping neighborhoods', description: 'Locating areas via Nominatim' },
  { id: 'costs', name: 'Calculating costs', description: 'Getting exchange rates from Frankfurter' },
  { id: 'transport', name: 'Finding transportation', description: 'Locating airports and transit' },
  { id: 'safety', name: 'Checking safety', description: 'Fetching travel advisories' },
  { id: 'culture', name: 'Understanding culture', description: 'Researching customs via Wikipedia' },
  { id: 'tips', name: 'Gathering insights', description: 'Searching for local tips' },
  { id: 'images', name: 'Finding photos', description: 'Searching Wikimedia Commons' },
  { id: 'synthesize', name: 'Creating guide', description: 'Compiling research into guide' }
];
