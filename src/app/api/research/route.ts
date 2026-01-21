import { NextRequest, NextResponse } from 'next/server';
import { researchSteps } from '@/lib/tools';
import { executeTool, getThemeForDestination, ToolResult } from '@/lib/toolExecutor';
import { TravelGuide, ResearchStep, BudgetEstimate, TransportationGuide, SafetyInfo, CultureGuide, MapLocation } from '@/types';
import { enhanceSummary } from '@/lib/aiService';

// Direct research approach with optional AI enhancement
// We execute real API calls in sequence and assemble the guide from collected data
// AI is used to enhance summaries when available

// Synthesize a travel guide from collected real API data
// Now async to support optional AI enhancement
async function synthesizeGuideFromData(destination: string, data: Record<string, any>): Promise<TravelGuide> {
  // Extract data from various tool results
  const searchData = data['search_destination'] || {};
  const countryData = data['get_country_info'] || {};
  const cityData = data['get_city_info'] || {};
  const attractionsData = data['search_attractions'] || {};
  const neighborhoodData = data['get_neighborhoods'] || {};
  const budgetData = data['get_budget_info'] || {};
  const transportData = data['get_transportation'] || {};
  const safetyData = data['get_safety_info'] || {};
  const cultureData = data['get_culture_info'] || {};
  const weatherData = data['get_weather'] || {};
  const imageData = data['search_images'] || {};
  const tipsData = data['get_local_tips'] || {};
  
  // Extract coordinates
  const lat = searchData.coordinates?.lat || cityData.coordinates?.lat || 0;
  const lng = searchData.coordinates?.lng || cityData.coordinates?.lng || 0;
  
  // Get currency code
  const currencyCode = countryData.currency?.code || budgetData.currency || 'USD';
  
  // Build top cities array from city data
  const topCities = (cityData.cities || []).slice(0, 5).map((city: any, index: number) => ({
    rank: index + 1,
    name: city.name || `City ${index + 1}`,
    description: city.description || city.wikipedia?.summary || `A notable city in ${destination}`,
    whyVisit: city.whyVisit || city.highlights?.join(', ') || 'Rich culture and attractions',
    idealDuration: city.idealDuration || '2-3 days',
    highlights: city.highlights || city.attractions?.slice(0, 3)?.map((a: any) => a.name) || ['Local culture'],
    imageUrl: city.imageUrl || imageData.images?.[index]?.url,
  }));
  
  // Build neighborhoods array
  const neighborhoods = (neighborhoodData.neighborhoods || []).slice(0, 5).map((n: any) => ({
    name: n.name || 'City Center',
    city: n.city || topCities[0]?.name || destination,
    type: (n.type || 'mid-range') as 'budget' | 'mid-range' | 'luxury' | 'local',
    description: n.description || n.vibe || 'A local neighborhood',
    priceRange: {
      min: n.priceRange?.min || 50,
      max: n.priceRange?.max || 150,
      currency: currencyCode,
    },
    bestFor: n.bestFor || ['Travelers'],
    nearbyAttractions: n.nearbyAttractions || n.highlights || [],
  }));
  
  // Build attractions array
  const allAttractions = attractionsData.attractions || [];
  const attractions = allAttractions.slice(0, 10).map((a: any, index: number) => ({
    name: a.name || `Attraction ${index + 1}`,
    city: a.city || topCities[0]?.name || destination,
    type: (a.category === 'hidden-gem' ? 'hidden-gem' : index < 5 ? 'popular' : 'cultural') as 'popular' | 'hidden-gem' | 'cultural' | 'nature' | 'food' | 'nightlife',
    description: a.description || `A point of interest in ${destination}`,
    whyVisit: a.whyVisit || a.description || 'Worth visiting',
    estimatedTime: a.estimatedTime || '1-2 hours',
    cost: a.cost || 'Varies',
    tips: a.tips || ['Check opening hours before visiting'],
    imageUrl: a.image || imageData.images?.[index + 1]?.url,
    coordinates: a.coordinates || { lat: lat + (Math.random() - 0.5) * 0.1, lng: lng + (Math.random() - 0.5) * 0.1 },
  }));
  
  // Build budget estimate - matching BudgetEstimate interface
  // Use the comprehensive cost data from the budget tool
  const budget: BudgetEstimate = {
    currency: currencyCode,
    daily: {
      budget: { min: budgetData.daily?.budget || 30, max: Math.round((budgetData.daily?.budget || 30) * 1.3) },
      midRange: { min: budgetData.daily?.midRange || 80, max: Math.round((budgetData.daily?.midRange || 80) * 1.3) },
      luxury: { min: budgetData.daily?.luxury || 250, max: Math.round((budgetData.daily?.luxury || 250) * 1.5) },
    },
    breakdown: budgetData.breakdown || {
      accommodation: {
        budget: '$15-30/night',
        midRange: '$50-100/night',
        luxury: '$150-300+/night',
      },
      food: {
        budget: '$10-20/day',
        midRange: '$30-50/day',
        luxury: '$80-150/day',
      },
      transport: {
        budget: '$5-15/day',
        midRange: '$20-40/day',
        luxury: '$50-100/day',
      },
      activities: {
        budget: '$5-20/day',
        midRange: '$30-60/day',
        luxury: '$100-200/day',
      },
    },
    weeklyTotal: budgetData.weekly || {
      budget: { min: 210, max: 350 },
      midRange: { min: 560, max: 1050 },
      luxury: { min: 1750, max: 3500 },
    },
    tips: budgetData.tips || ['Research seasonal prices', 'Book accommodation in advance', 'Try local street food for savings'],
  };
  
  // Build transportation info - matching TransportationGuide interface
  const airports = transportData.airports || [];
  const transportation: TransportationGuide = {
    gettingThere: {
      mainAirports: airports.slice(0, 3).map((a: any) => a.name || 'International Airport'),
      alternativeOptions: transportData.alternativeOptions || ['Consider nearby airports', 'Train connections available'],
    },
    gettingAround: {
      publicTransport: transportData.publicTransit?.description || 'Public transportation available in major cities',
      taxis: transportData.taxis || 'Taxis and rideshares available',
      rentals: transportData.rentals || 'Car rentals available at airports and cities',
      walking: transportData.walking || 'City centers are often walkable',
      tips: transportData.gettingAround || ['Negotiate taxi fares in advance', 'Consider local transport apps'],
    },
    intercity: {
      options: transportData.intercityOptions || ['Domestic flights', 'Buses', 'Trains'],
      recommendations: transportData.intercityRecommendations || 'Buses are affordable, flights save time for long distances',
    },
  };
  
  // Build safety info - matching SafetyInfo interface
  // Use comprehensive safety data from the safety tool
  const safetyRating = (safetyData.overallRating || safetyData.safetyData?.rating || 'moderate').toLowerCase();
  const safetyRatingMap: Record<string, 'very-safe' | 'safe' | 'moderate' | 'caution' | 'avoid'> = {
    'very-safe': 'very-safe', 'very safe': 'very-safe', 'low': 'safe',
    'safe': 'safe', 'moderate': 'moderate', 'medium': 'moderate',
    'caution': 'caution', 'high': 'caution', 'avoid': 'avoid', 'extreme': 'avoid',
  };
  const safety: SafetyInfo = {
    overallRating: safetyRatingMap[safetyRating] || 'moderate',
    summary: safetyData.summary || safetyData.safetyData?.summary || `Exercise normal precautions when visiting ${destination}`,
    concerns: safetyData.concerns || safetyData.safetyData?.concerns || ['Check local advisories before travel'],
    tips: safetyData.tips || safetyData.safetyData?.tips || ['Be aware of your surroundings', 'Keep valuables secure'],
    emergencyNumbers: safetyData.emergencyNumbers || safetyData.safetyData?.emergency || {
      police: '911 or local equivalent',
      ambulance: '911 or local equivalent',
      tourist: 'Contact your embassy',
    },
    healthAdvice: safetyData.healthAdvice || safetyData.safetyData?.health || ['Consult a travel clinic before departure'],
  };
  
  // Build culture guide - matching CultureGuide interface
  // Use comprehensive culture data from the culture tool
  const culture: CultureGuide = {
    summary: cultureData.summary || cultureData.cultureWiki?.extract || `${destination} has a rich cultural heritage with unique customs and traditions`,
    etiquette: cultureData.etiquette || cultureData.cultureData?.etiquette || ['Respect local customs', 'Learn basic local phrases'],
    dress: cultureData.dress || cultureData.cultureData?.dress || 'Dress modestly, especially at religious sites',
    tipping: cultureData.tipping || cultureData.cultureData?.tipping || 'Tipping customs vary - check locally',
    greetings: cultureData.greetings || cultureData.cultureData?.greetings || 'Greet people respectfully, handshakes are common',
    taboos: cultureData.taboos || cultureData.cultureData?.taboos || ['Research local sensitivities'],
    localCustoms: cultureData.customs || cultureData.cultureData?.customs || ['Customs vary by region'],
  };
  
  // Build common mistakes - use structured data from local tips
  const mistakesRaw = tipsData.commonMistakes || [
    { mistake: 'Not researching local customs', why: 'Can lead to awkward situations', instead: 'Learn basic etiquette before visiting' },
    { mistake: 'Only visiting tourist areas', why: 'Miss authentic experiences', instead: 'Explore local neighborhoods' },
    { mistake: 'Not trying local food', why: 'Food is key to culture', instead: 'Eat where locals eat' },
    { mistake: 'Overpacking', why: 'Limits mobility', instead: 'Pack light and buy local' },
    { mistake: 'Not having backup payment', why: 'Cards can fail abroad', instead: 'Carry cash and multiple cards' },
  ];
  const mistakes = mistakesRaw.slice(0, 5).map((mistake: any, i: number) => ({
    mistake: typeof mistake === 'string' ? mistake : (mistake.mistake || `Mistake ${i + 1}`),
    why: typeof mistake === 'object' && mistake.why ? mistake.why : 'Can detract from your experience',
    instead: typeof mistake === 'object' && mistake.instead ? mistake.instead : 'Research and plan accordingly',
  }));
  
  // Build best for traveler types - use structured data
  const bestForRaw = tipsData.bestFor || [
    { type: 'Culture Enthusiasts', why: 'Rich history and traditions', highlights: ['Museums', 'Historic sites', 'Local festivals'] },
    { type: 'Food Lovers', why: 'Unique local cuisine', highlights: ['Street food', 'Traditional restaurants', 'Local markets'] },
    { type: 'Adventure Seekers', why: 'Diverse landscapes and activities', highlights: ['Hiking', 'Outdoor activities', 'Day trips'] },
    { type: 'History Buffs', why: 'Ancient sites and museums', highlights: ['Archaeological sites', 'Historic landmarks', 'Museums'] },
  ];
  const bestFor = bestForRaw.slice(0, 4).map((t: any) => ({
    type: typeof t === 'string' ? t : t.type,
    why: typeof t === 'object' ? t.why : `Great destination for ${t}`,
    highlights: typeof t === 'object' && t.highlights ? t.highlights : ['Local experiences'],
  }));
  
  // Build images array
  const images = (imageData.images || []).slice(0, 12).map((img: any) => ({
    url: img.url || img.src || `https://source.unsplash.com/800x600/?${encodeURIComponent(destination)}`,
    alt: img.alt || img.caption || destination,
    location: img.location || destination,
    credit: img.credit || img.author,
  }));
  
  // Build map locations
  const mapData: MapLocation[] = [
    { name: destination, type: 'city', coordinates: { lat, lng }, description: 'Main destination' },
    ...airports.slice(0, 2).map((a: any) => ({
      name: a.name || 'Airport',
      type: 'airport' as const,
      coordinates: a.coordinates || { lat, lng },
    })),
    ...attractions.slice(0, 5).map((a: any) => ({
      name: a.name,
      type: 'attraction' as const,
      coordinates: a.coordinates,
      description: a.description,
    })),
  ];
  
  // Get base summary
  let overviewSummary = searchData.wikipedia?.extract || 
                        searchData.wikipedia?.summary || 
                        countryData.summary || 
                        `Welcome to ${destination}. This guide was compiled using real-time data from multiple APIs.`;
  
  // Try AI enhancement for the summary (non-blocking, with fallback)
  try {
    if (overviewSummary && overviewSummary.length > 100) {
      const enhanced = await enhanceSummary(destination, overviewSummary.substring(0, 500));
      if (enhanced && enhanced.length > 50) {
        overviewSummary = enhanced;
        console.log('[Synthesis] AI enhanced the overview summary');
      }
    }
  } catch (e) {
    console.log('[Synthesis] AI enhancement skipped:', e);
    // Keep original summary
  }
  
  // Compile the guide matching TravelGuide interface
  const guide: TravelGuide = {
    destination,
    country: countryData.name || searchData.country || destination,
    theme: getThemeForDestination(destination),
    overview: {
      summary: overviewSummary,
      highlights: attractions.slice(0, 5).map((a: any) => a.name),
      bestTimeToVisit: weatherData.bestTimeToVisit || searchData.bestTimeToVisit || 'Spring and Fall',
      climate: weatherData.climate || weatherData.description || 'Check seasonal weather patterns',
      language: (countryData.languages || cultureData.languages || ['Local language']).join(', '),
      currency: currencyCode,
      timeZone: countryData.timezone || countryData.timezones?.[0] || 'Check local time',
      visaInfo: countryData.visaInfo || 'Check visa requirements for your nationality',
    },
    topCities: topCities.length > 0 ? topCities : [{
      rank: 1,
      name: destination,
      description: searchData.description || `The main destination area`,
      whyVisit: 'Primary destination with key attractions',
      idealDuration: '3-5 days',
      highlights: attractions.slice(0, 3).map((a: any) => a.name),
    }],
    neighborhoods: neighborhoods.length > 0 ? neighborhoods : [{
      name: 'City Center',
      city: destination,
      type: 'mid-range',
      description: 'Central and accessible area',
      priceRange: { min: 50, max: 150, currency: currencyCode },
      bestFor: ['First-time visitors'],
      nearbyAttractions: attractions.slice(0, 3).map((a: any) => a.name),
    }],
    attractions,
    budget,
    transportation,
    safety,
    culture,
    mistakes,
    bestFor,
    images,
    mapData,
  };
  
  return guide;
}

// Define the research sequence - each step executes real API calls
interface ResearchTask {
  toolName: string;
  getArgs: (destination: string, collectedData: Record<string, any>) => Record<string, any>;
  stepIndex: number;
}

const RESEARCH_SEQUENCE: ResearchTask[] = [
  { 
    toolName: 'search_destination', 
    getArgs: (dest) => ({ destination: dest }),
    stepIndex: 1 
  },
  { 
    toolName: 'get_country_info', 
    // Use English country name from search_destination, fallback to destination
    getArgs: (dest, data) => ({ 
      country: data.search_destination?.englishCountryName || 
               data.search_destination?.country?.name || 
               dest 
    }),
    stepIndex: 1 
  },
  { 
    toolName: 'get_city_info', 
    getArgs: (dest) => ({ destination: dest, limit: '8' }),
    stepIndex: 2 
  },
  { 
    toolName: 'search_attractions', 
    getArgs: (dest) => ({ destination: dest, type: 'all', limit: '15' }),
    stepIndex: 3 
  },
  { 
    toolName: 'get_neighborhoods', 
    getArgs: (dest) => ({ city: dest, limit: '8' }),
    stepIndex: 4 
  },
  { 
    toolName: 'get_budget_info', 
    getArgs: (dest) => ({ destination: dest, baseCurrency: 'USD' }),
    stepIndex: 5 
  },
  { 
    toolName: 'get_weather', 
    getArgs: (dest, data) => ({ 
      destination: dest,
      lat: data.search_destination?.location?.lat,
      lon: data.search_destination?.location?.lon 
    }),
    stepIndex: 5 
  },
  { 
    toolName: 'get_transportation', 
    getArgs: (dest) => ({ destination: dest }),
    stepIndex: 6 
  },
  { 
    toolName: 'get_safety_info', 
    // Use English country name from search_destination, fallback to destination
    getArgs: (dest, data) => ({ 
      destination: data.search_destination?.englishCountryName || 
                   data.search_destination?.country?.name || 
                   dest 
    }),
    stepIndex: 7 
  },
  { 
    toolName: 'get_culture_info', 
    getArgs: (dest) => ({ destination: dest }),
    stepIndex: 8 
  },
  { 
    toolName: 'get_local_tips', 
    getArgs: (dest) => ({ destination: dest }),
    stepIndex: 9 
  },
  { 
    toolName: 'search_images', 
    getArgs: (dest) => ({ query: `${dest} travel landmarks tourism`, count: '15' }),
    stepIndex: 10 
  },
];

export async function POST(request: NextRequest) {
  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const { destination } = await request.json();
        
        if (!destination) {
          controller.enqueue(encoder.encode(JSON.stringify({ 
            type: 'error', 
            data: { error: 'Destination is required' } 
          }) + '\n'));
          controller.close();
          return;
        }
        
        console.log(`[Research] Starting research for: ${destination}`);
        
        // Send initial step
        const steps = [...researchSteps];
        let currentStepIndex = 0;
        
        const sendStep = (index: number, status: 'active' | 'complete') => {
          if (index >= 0 && index < steps.length) {
            const step: ResearchStep = {
              ...steps[index],
              status,
              toolCalls: [],
            };
            controller.enqueue(encoder.encode(JSON.stringify({
              type: 'step',
              data: { step, stepIndex: index }
            }) + '\n'));
          }
        };
        
        const sendProgress = (progress: number) => {
          controller.enqueue(encoder.encode(JSON.stringify({
            type: 'progress',
            data: { progress }
          }) + '\n'));
        };
        
        const sendToolCall = (toolName: string, status: 'running' | 'complete' = 'running') => {
          controller.enqueue(encoder.encode(JSON.stringify({
            type: 'tool_call',
            data: { 
              toolCall: { 
                toolName, 
                startTime: Date.now(), 
                status 
              } 
            }
          }) + '\n'));
        };
        
        // Initialize research
        sendStep(0, 'active');
        sendProgress(5);
        
        // Collect data from all tool calls
        const collectedData: Record<string, any> = {};
        
        // Execute each research task in sequence
        for (let i = 0; i < RESEARCH_SEQUENCE.length; i++) {
          const task = RESEARCH_SEQUENCE[i];
          
          // Update step if needed
          if (task.stepIndex > currentStepIndex) {
            sendStep(currentStepIndex, 'complete');
            currentStepIndex = task.stepIndex;
            sendStep(currentStepIndex, 'active');
          }
          
          // Show tool being called
          sendToolCall(task.toolName, 'running');
          
          // Execute the tool with real APIs
          const args = task.getArgs(destination, collectedData);
          console.log(`[Research] Executing: ${task.toolName}`, args);
          
          try {
            const result: ToolResult = await executeTool(task.toolName, args);
            
            if (result.success && result.data) {
              collectedData[task.toolName] = result.data;
              console.log(`[Research] ${task.toolName} completed with data`);
            } else {
              console.log(`[Research] ${task.toolName} failed:`, result.error);
            }
          } catch (error) {
            console.error(`[Research] Error executing ${task.toolName}:`, error);
          }
          
          // Update progress
          const progress = 10 + ((i + 1) / RESEARCH_SEQUENCE.length) * 80;
          sendProgress(Math.round(progress));
          
          // Small delay to show progress in UI
          await new Promise(r => setTimeout(r, 100));
        }
        
        // Complete remaining steps
        for (let i = currentStepIndex; i < steps.length; i++) {
          sendStep(i, 'complete');
        }
        
        sendProgress(95);
        console.log(`[Research] All tools executed, synthesizing guide...`);
        
        // Generate the final travel guide from collected real API data (with optional AI enhancement)
        const guide = await synthesizeGuideFromData(destination, collectedData);
        
        sendProgress(100);
        console.log(`[Research] Guide generated for ${destination}`);
        
        // Send complete event with guide
        controller.enqueue(encoder.encode(JSON.stringify({
          type: 'complete',
          data: { guide }
        }) + '\n'));
        
        controller.close();
        
      } catch (error) {
        console.error('Research error:', error);
        controller.enqueue(encoder.encode(JSON.stringify({
          type: 'error',
          data: { error: error instanceof Error ? error.message : 'Research failed' }
        }) + '\n'));
        controller.close();
      }
    }
  });
  
  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
