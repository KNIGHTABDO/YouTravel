// AI Tool Definitions for GitHub Models API (OpenAI-compatible)

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

// All available tools for the travel research agent
export const travelResearchTools: ToolDefinition[] = [
  {
    type: 'function',
    function: {
      name: 'web_search',
      description: 'Search the web for travel information, reviews, articles, and current data about destinations. Use for finding up-to-date information about places, events, and travel conditions.',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'The search query for finding travel information'
          },
          category: {
            type: 'string',
            description: 'Category of search to focus results',
            enum: ['general', 'attractions', 'hotels', 'restaurants', 'safety', 'transportation', 'culture', 'costs', 'weather']
          },
          region: {
            type: 'string',
            description: 'Geographic region to focus the search on'
          }
        },
        required: ['query']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'discover_places',
      description: 'Discover and retrieve detailed information about places, cities, neighborhoods, and points of interest in a destination.',
      parameters: {
        type: 'object',
        properties: {
          destination: {
            type: 'string',
            description: 'The country or city to discover places in'
          },
          placeType: {
            type: 'string',
            description: 'Type of places to discover',
            enum: ['cities', 'neighborhoods', 'attractions', 'restaurants', 'hotels', 'landmarks', 'hidden-gems', 'nature']
          },
          limit: {
            type: 'string',
            description: 'Maximum number of places to return (default: 10)'
          }
        },
        required: ['destination', 'placeType']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'get_location_details',
      description: 'Get detailed information about a specific location including coordinates, descriptions, ratings, and practical information.',
      parameters: {
        type: 'object',
        properties: {
          locationName: {
            type: 'string',
            description: 'Name of the location to get details for'
          },
          infoTypes: {
            type: 'string',
            description: 'Comma-separated types of information needed: coordinates, description, ratings, hours, prices, tips'
          }
        },
        required: ['locationName']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'estimate_costs',
      description: 'Estimate travel costs for a destination including accommodation, food, transportation, and activities.',
      parameters: {
        type: 'object',
        properties: {
          destination: {
            type: 'string',
            description: 'The destination to estimate costs for'
          },
          category: {
            type: 'string',
            description: 'Cost category to estimate',
            enum: ['accommodation', 'food', 'transportation', 'activities', 'all']
          },
          budgetLevel: {
            type: 'string',
            description: 'Budget level for estimates',
            enum: ['budget', 'mid-range', 'luxury', 'all']
          },
          duration: {
            type: 'string',
            description: 'Duration of stay (e.g., "7 days", "2 weeks")'
          }
        },
        required: ['destination']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'analyze_safety',
      description: 'Analyze safety conditions, travel advisories, health concerns, and security information for a destination.',
      parameters: {
        type: 'object',
        properties: {
          destination: {
            type: 'string',
            description: 'The destination to analyze safety for'
          },
          aspects: {
            type: 'string',
            description: 'Comma-separated safety aspects to analyze: crime, health, natural-disasters, political, scams, transportation'
          }
        },
        required: ['destination']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'get_cultural_info',
      description: 'Get cultural information including customs, etiquette, dress codes, tipping practices, and local traditions.',
      parameters: {
        type: 'object',
        properties: {
          destination: {
            type: 'string',
            description: 'The destination to get cultural info for'
          },
          topics: {
            type: 'string',
            description: 'Comma-separated cultural topics: etiquette, dress, tipping, language, religion, food-customs, taboos, greetings'
          }
        },
        required: ['destination']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'get_transportation_info',
      description: 'Get transportation information including airports, public transit, intercity travel, and getting around tips.',
      parameters: {
        type: 'object',
        properties: {
          destination: {
            type: 'string',
            description: 'The destination to get transportation info for'
          },
          transportType: {
            type: 'string',
            description: 'Type of transportation info needed',
            enum: ['airports', 'public-transit', 'taxis', 'car-rental', 'trains', 'buses', 'ferries', 'all']
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
      description: 'Search for high-quality images of destinations, attractions, and places to include in the travel guide.',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Search query for images'
          },
          location: {
            type: 'string',
            description: 'Location the images should be from'
          },
          imageType: {
            type: 'string',
            description: 'Type of images to search for',
            enum: ['landscape', 'cityscape', 'landmark', 'food', 'culture', 'nature', 'street', 'aerial']
          },
          count: {
            type: 'string',
            description: 'Number of images to return (default: 5)'
          }
        },
        required: ['query']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'compare_neighborhoods',
      description: 'Compare neighborhoods for accommodation, considering factors like price, safety, accessibility, and atmosphere.',
      parameters: {
        type: 'object',
        properties: {
          city: {
            type: 'string',
            description: 'City to compare neighborhoods in'
          },
          criteria: {
            type: 'string',
            description: 'Comma-separated comparison criteria: price, safety, nightlife, family-friendly, accessibility, local-vibe, tourist-convenience'
          },
          neighborhoodCount: {
            type: 'string',
            description: 'Number of top neighborhoods to compare (default: 5)'
          }
        },
        required: ['city']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'get_weather_climate',
      description: 'Get weather patterns, climate information, and best times to visit for a destination.',
      parameters: {
        type: 'object',
        properties: {
          destination: {
            type: 'string',
            description: 'The destination to get weather info for'
          },
          infoType: {
            type: 'string',
            description: 'Type of weather/climate info',
            enum: ['current', 'monthly-averages', 'best-time-to-visit', 'seasonal-events', 'all']
          }
        },
        required: ['destination']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'get_visa_entry_info',
      description: 'Get visa requirements, entry conditions, and documentation needed for a destination.',
      parameters: {
        type: 'object',
        properties: {
          destination: {
            type: 'string',
            description: 'The destination country'
          },
          travelerNationality: {
            type: 'string',
            description: 'Nationality of the traveler (optional, will provide general info if not specified)'
          }
        },
        required: ['destination']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'rank_destinations',
      description: 'Rank and compare cities or regions within a country based on various criteria.',
      parameters: {
        type: 'object',
        properties: {
          country: {
            type: 'string',
            description: 'The country to rank destinations in'
          },
          criteria: {
            type: 'string',
            description: 'Comma-separated ranking criteria: popularity, uniqueness, accessibility, affordability, safety, culture, nature, food'
          },
          destinationType: {
            type: 'string',
            description: 'Type of destinations to rank',
            enum: ['cities', 'regions', 'islands', 'coastal', 'mountain', 'historical']
          }
        },
        required: ['country']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'get_local_tips',
      description: 'Get insider tips and local knowledge about a destination that tourists often miss.',
      parameters: {
        type: 'object',
        properties: {
          destination: {
            type: 'string',
            description: 'The destination to get local tips for'
          },
          tipCategory: {
            type: 'string',
            description: 'Category of tips',
            enum: ['food', 'transport', 'money-saving', 'avoiding-crowds', 'local-experiences', 'common-mistakes', 'all']
          }
        },
        required: ['destination']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'analyze_traveler_fit',
      description: 'Analyze which types of travelers a destination is best suited for and why.',
      parameters: {
        type: 'object',
        properties: {
          destination: {
            type: 'string',
            description: 'The destination to analyze'
          },
          travelerTypes: {
            type: 'string',
            description: 'Comma-separated traveler types to analyze: solo, couples, families, budget, luxury, adventure, cultural, relaxation, party, seniors, digital-nomads'
          }
        },
        required: ['destination']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'synthesize_guide_section',
      description: 'Synthesize researched information into a polished section of the travel guide.',
      parameters: {
        type: 'object',
        properties: {
          section: {
            type: 'string',
            description: 'Section to synthesize',
            enum: ['overview', 'cities', 'neighborhoods', 'attractions', 'budget', 'transportation', 'safety', 'culture', 'mistakes', 'best-for']
          },
          rawData: {
            type: 'string',
            description: 'Raw data and notes to synthesize into the section'
          },
          destination: {
            type: 'string',
            description: 'The destination this section is about'
          }
        },
        required: ['section', 'rawData', 'destination']
      }
    }
  }
];

// Tool name to step name mapping for UI
export const toolStepMapping: Record<string, string> = {
  'web_search': 'Searching the web',
  'discover_places': 'Discovering places',
  'get_location_details': 'Analyzing locations',
  'estimate_costs': 'Estimating costs',
  'analyze_safety': 'Checking safety',
  'get_cultural_info': 'Understanding culture',
  'get_transportation_info': 'Mapping transport',
  'search_images': 'Finding images',
  'compare_neighborhoods': 'Comparing areas',
  'get_weather_climate': 'Checking climate',
  'get_visa_entry_info': 'Reviewing entry requirements',
  'rank_destinations': 'Ranking destinations',
  'get_local_tips': 'Gathering local tips',
  'analyze_traveler_fit': 'Analyzing fit',
  'synthesize_guide_section': 'Compiling guide'
};

// Research steps for the UI
export const researchSteps = [
  { id: 'init', name: 'Initializing research', description: 'Starting comprehensive destination analysis' },
  { id: 'overview', name: 'Researching destination', description: 'Gathering general information and context' },
  { id: 'cities', name: 'Analyzing cities', description: 'Ranking and comparing cities and regions' },
  { id: 'places', name: 'Discovering attractions', description: 'Finding must-see places and hidden gems' },
  { id: 'neighborhoods', name: 'Comparing neighborhoods', description: 'Evaluating where to stay' },
  { id: 'costs', name: 'Estimating costs', description: 'Calculating realistic budget ranges' },
  { id: 'transport', name: 'Mapping transportation', description: 'Understanding how to get around' },
  { id: 'safety', name: 'Analyzing safety', description: 'Reviewing travel advisories and concerns' },
  { id: 'culture', name: 'Understanding culture', description: 'Learning customs and etiquette' },
  { id: 'tips', name: 'Gathering insights', description: 'Collecting local tips and common mistakes' },
  { id: 'images', name: 'Finding visuals', description: 'Sourcing destination imagery' },
  { id: 'synthesize', name: 'Creating guide', description: 'Synthesizing research into premium guide' }
];
