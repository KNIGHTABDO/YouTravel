import { NextRequest, NextResponse } from 'next/server';
import { travelResearchTools, researchSteps } from '@/lib/tools';
import { executeTool, getThemeForDestination, ToolResult } from '@/lib/toolExecutor';
import { TravelGuide, ResearchStep, BudgetEstimate, TransportationGuide, SafetyInfo, CultureGuide, MapLocation } from '@/types';

// GitHub Models API configuration
const GITHUB_MODELS_ENDPOINT = 'https://models.github.ai/inference';
const MODEL = 'openai/gpt-4.1';

// Helper to truncate/summarize tool results to avoid 413 errors
const MAX_RESULT_LENGTH = 2000; // Max characters per tool result

function truncateToolResult(data: any): string {
  if (typeof data === 'string') {
    return data.length > MAX_RESULT_LENGTH 
      ? data.substring(0, MAX_RESULT_LENGTH) + '... [truncated]'
      : data;
  }
  
  // For objects, create a summarized version
  const summarized = summarizeData(data);
  const json = JSON.stringify(summarized, null, 1);
  
  if (json.length > MAX_RESULT_LENGTH) {
    return json.substring(0, MAX_RESULT_LENGTH) + '... [truncated]';
  }
  return json;
}

function summarizeData(data: any): any {
  if (!data || typeof data !== 'object') return data;
  
  if (Array.isArray(data)) {
    // Limit arrays to first 5 items and summarize each
    return data.slice(0, 5).map(item => summarizeData(item));
  }
  
  const summary: any = {};
  for (const [key, value] of Object.entries(data)) {
    // Skip very long text fields
    if (typeof value === 'string') {
      summary[key] = value.length > 300 ? value.substring(0, 300) + '...' : value;
    } else if (Array.isArray(value)) {
      summary[key] = value.slice(0, 5).map(v => 
        typeof v === 'string' && v.length > 100 ? v.substring(0, 100) + '...' : 
        typeof v === 'object' ? summarizeData(v) : v
      );
    } else if (typeof value === 'object' && value !== null) {
      // Skip deeply nested objects like full wiki content
      if (key === 'wikiContent' || key === 'fullContent' || key === 'html') {
        summary[key] = '[content available]';
      } else {
        summary[key] = summarizeData(value);
      }
    } else {
      summary[key] = value;
    }
  }
  return summary;
}

// System prompt for the travel research agent
const SYSTEM_PROMPT = `You are an autonomous travel research agent with access to REAL APIs that gather live data from the internet.

Your available tools connect to:
- Nominatim (OpenStreetMap) for location geocoding and coordinates
- Wikipedia API for destination descriptions and summaries
- REST Countries API for country information (language, currency, timezone, etc.)
- OpenStreetMap Overpass API for real attractions, cities, neighborhoods, airports, transit
- Open-Meteo for weather and climate data
- Frankfurter for currency exchange rates  
- Travel Advisory APIs for safety information
- DuckDuckGo for web search and additional context
- Image search (Unsplash/Wikimedia) for destination photos

When researching a destination, follow this systematic approach:

1. ALWAYS start with search_destination to get basic location info and coordinates
2. Use get_country_info for currency, language, timezone, visa info
3. Use get_city_info for major cities with attractions, airports, neighborhoods
4. Use search_attractions to find real tourist sites with coordinates
5. Use get_neighborhoods to find areas to stay with real place data
6. Use get_budget_info for currency exchange and cost context
7. Use get_transportation to find real airports and transit options
8. Use get_safety_info for travel advisories
9. Use get_culture_info for etiquette and customs
10. Use search_images to find real photos of the destination
11. Use get_local_tips for insider advice and common mistakes
12. Call finalize_guide when research is complete

BE THOROUGH. Each tool call fetches REAL DATA from live APIs. Take your time to gather comprehensive information. The quality of the final guide depends on how much real data you collect.

After your research, you will synthesize all the real API data into a comprehensive travel guide.`;

interface Message {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string | null;
  tool_calls?: Array<{
    id: string;
    type: 'function';
    function: { name: string; arguments: string };
  }>;
  tool_call_id?: string;
  name?: string;
}

// Synthesize a travel guide from collected real API data
function synthesizeGuideFromData(destination: string, data: Record<string, any>): TravelGuide {
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
  const budget: BudgetEstimate = {
    currency: currencyCode,
    daily: {
      budget: { min: budgetData.daily?.budget?.min || 30, max: budgetData.daily?.budget?.max || 50 },
      midRange: { min: budgetData.daily?.midRange?.min || 80, max: budgetData.daily?.midRange?.max || 150 },
      luxury: { min: budgetData.daily?.luxury?.min || 250, max: budgetData.daily?.luxury?.max || 500 },
    },
    breakdown: {
      accommodation: {
        budget: budgetData.breakdown?.accommodation?.budget || '$15-30/night',
        midRange: budgetData.breakdown?.accommodation?.midRange || '$50-100/night',
        luxury: budgetData.breakdown?.accommodation?.luxury || '$150-300+/night',
      },
      food: {
        budget: budgetData.breakdown?.food?.budget || '$10-20/day',
        midRange: budgetData.breakdown?.food?.midRange || '$30-50/day',
        luxury: budgetData.breakdown?.food?.luxury || '$80-150/day',
      },
      transport: {
        budget: budgetData.breakdown?.transport?.budget || '$5-15/day',
        midRange: budgetData.breakdown?.transport?.midRange || '$20-40/day',
        luxury: budgetData.breakdown?.transport?.luxury || '$50-100/day',
      },
      activities: {
        budget: budgetData.breakdown?.activities?.budget || '$5-20/day',
        midRange: budgetData.breakdown?.activities?.midRange || '$30-60/day',
        luxury: budgetData.breakdown?.activities?.luxury || '$100-200/day',
      },
    },
    weeklyTotal: {
      budget: { min: budgetData.weekly?.budget?.min || 210, max: budgetData.weekly?.budget?.max || 350 },
      midRange: { min: budgetData.weekly?.midRange?.min || 560, max: budgetData.weekly?.midRange?.max || 1050 },
      luxury: { min: budgetData.weekly?.luxury?.min || 1750, max: budgetData.weekly?.luxury?.max || 3500 },
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
  const safetyRating = (safetyData.overallRating || safetyData.advisoryScore || 'moderate').toLowerCase();
  const safetyRatingMap: Record<string, 'very-safe' | 'safe' | 'moderate' | 'caution' | 'avoid'> = {
    'very-safe': 'very-safe', 'very safe': 'very-safe', 'low': 'safe',
    'safe': 'safe', 'moderate': 'moderate', 'medium': 'moderate',
    'caution': 'caution', 'high': 'caution', 'avoid': 'avoid', 'extreme': 'avoid',
  };
  const safety: SafetyInfo = {
    overallRating: safetyRatingMap[safetyRating] || 'moderate',
    summary: safetyData.summary || safetyData.advisorySummary || `Exercise normal precautions when visiting ${destination}`,
    concerns: safetyData.concerns || safetyData.areasToAvoid || ['Check local advisories before travel'],
    tips: safetyData.tips || safetyData.commonScams || ['Be aware of your surroundings', 'Keep valuables secure'],
    emergencyNumbers: {
      police: safetyData.emergencyNumbers?.police || '911 or local equivalent',
      ambulance: safetyData.emergencyNumbers?.ambulance || '911 or local equivalent',
      tourist: safetyData.emergencyNumbers?.tourist || 'Contact your embassy',
    },
    healthAdvice: safetyData.healthAdvice || safetyData.healthTips || ['Consult a travel clinic before departure'],
  };
  
  // Build culture guide - matching CultureGuide interface
  const culture: CultureGuide = {
    summary: cultureData.summary || `${destination} has a rich cultural heritage with unique customs and traditions`,
    etiquette: cultureData.etiquette || ['Respect local customs', 'Learn basic local phrases'],
    dress: cultureData.dresscode || cultureData.dress || 'Dress modestly, especially at religious sites',
    tipping: cultureData.tipping || budgetData.tippingCustoms || 'Tipping customs vary - check locally',
    greetings: cultureData.greetings || 'Greet people respectfully, handshakes are common',
    taboos: cultureData.taboos || ['Research local sensitivities'],
    localCustoms: cultureData.localCustoms || cultureData.customs || ['Customs vary by region'],
  };
  
  // Build common mistakes
  const mistakesRaw = tipsData.commonMistakes || [
    'Not researching local customs',
    'Only visiting tourist areas', 
    'Not trying local food'
  ];
  const mistakes = mistakesRaw.slice(0, 5).map((mistake: any, i: number) => ({
    mistake: typeof mistake === 'string' ? mistake : (mistake.mistake || `Mistake ${i + 1}`),
    why: typeof mistake === 'object' && mistake.why ? mistake.why : 'Can detract from your experience',
    instead: typeof mistake === 'object' && mistake.instead ? mistake.instead : 'Research and plan accordingly',
  }));
  
  // Build best for traveler types
  const bestFor = (tipsData.bestFor || [
    { type: 'Culture Enthusiasts', why: 'Rich history and traditions' },
    { type: 'Adventure Seekers', why: 'Diverse landscapes and activities' },
    { type: 'Food Lovers', why: 'Unique local cuisine' },
  ]).slice(0, 4).map((t: any) => ({
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
  
  // Compile the guide matching TravelGuide interface
  const guide: TravelGuide = {
    destination,
    country: countryData.name || searchData.country || destination,
    theme: getThemeForDestination(destination),
    overview: {
      summary: searchData.wikipedia?.summary || countryData.summary || `Welcome to ${destination}. This guide was compiled using real-time data from multiple APIs.`,
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

async function callGitHubModels(messages: Message[], hasTools: boolean = true): Promise<{
  content: string | null;
  tool_calls?: Array<{
    id: string;
    type: 'function';
    function: { name: string; arguments: string };
  }>;
}> {
  const token = process.env.GITHUB_TOKEN;
  
  if (!token) {
    // Simulate AI response for development without token
    return simulateAIResponse(messages);
  }
  
  const response = await fetch(`${GITHUB_MODELS_ENDPOINT}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      tools: hasTools ? travelResearchTools : undefined,
      tool_choice: hasTools ? 'auto' : undefined,
      temperature: 0.7,
      max_tokens: 4096,
    }),
  });
  
  if (!response.ok) {
    const error = await response.text();
    console.error('GitHub Models API error:', error);
    throw new Error(`API error: ${response.status}`);
  }
  
  const data = await response.json();
  const choice = data.choices[0];
  
  return {
    content: choice.message.content,
    tool_calls: choice.message.tool_calls,
  };
}

// Simulate AI responses for development without API token
// These match our real API-connected tools
function simulateAIResponse(messages: Message[]): {
  content: string | null;
  tool_calls?: Array<{
    id: string;
    type: 'function';
    function: { name: string; arguments: string };
  }>;
} {
  const lastMessage = messages[messages.length - 1];
  
  // Check if we've been calling tools (look for tool messages)
  const toolCallCount = messages.filter(m => m.role === 'tool').length;
  
  // If we have enough tool calls, return final response
  if (toolCallCount >= 12) {
    return {
      content: 'Research complete. I have gathered comprehensive REAL data from multiple APIs including geocoding, Wikipedia, OpenStreetMap, weather, currency exchange, and travel advisories. The travel guide is ready with authentic information.',
      tool_calls: undefined,
    };
  }
  
  // Extract destination from user message
  const userMessage = messages.find(m => m.role === 'user');
  const destination = userMessage?.content?.replace('Research this destination thoroughly: ', '') || 'destination';
  
  // Simulate progressive tool calls - these match our real API tools
  const toolSequence = [
    { name: 'search_destination', args: { destination } },
    { name: 'get_country_info', args: { country: destination } },
    { name: 'get_city_info', args: { destination, limit: '10' } },
    { name: 'search_attractions', args: { destination, type: 'all', limit: '20' } },
    { name: 'get_neighborhoods', args: { city: destination, limit: '10' } },
    { name: 'get_budget_info', args: { destination, baseCurrency: 'USD' } },
    { name: 'get_transportation', args: { destination } },
    { name: 'get_safety_info', args: { destination } },
    { name: 'get_culture_info', args: { destination } },
    { name: 'get_weather', args: { destination } },
    { name: 'get_local_tips', args: { destination } },
    { name: 'search_images', args: { query: `${destination} travel tourism`, count: '12' } },
    { name: 'finalize_guide', args: { destination, summary: 'Research complete with real API data' } },
  ];
  
  const nextTool = toolSequence[toolCallCount] || toolSequence[toolSequence.length - 1];
  
  return {
    content: null,
    tool_calls: [{
      id: `call_${Date.now()}_${toolCallCount}`,
      type: 'function',
      function: {
        name: nextTool.name,
        arguments: JSON.stringify(nextTool.args),
      },
    }],
  };
}

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
        
        // Send initial step
        const steps = [...researchSteps];
        let currentStepIndex = 0;
        
        const sendStep = (index: number, status: 'active' | 'complete') => {
          const step: ResearchStep = {
            ...steps[index],
            status,
            toolCalls: [],
          };
          controller.enqueue(encoder.encode(JSON.stringify({
            type: 'step',
            data: { step, stepIndex: index }
          }) + '\n'));
        };
        
        const sendProgress = (progress: number) => {
          controller.enqueue(encoder.encode(JSON.stringify({
            type: 'progress',
            data: { progress }
          }) + '\n'));
        };
        
        const sendToolCall = (toolName: string) => {
          controller.enqueue(encoder.encode(JSON.stringify({
            type: 'tool_call',
            data: { 
              toolCall: { 
                toolName, 
                startTime: Date.now(), 
                status: 'running' 
              } 
            }
          }) + '\n'));
        };
        
        // Initialize research
        sendStep(0, 'active');
        sendProgress(5);
        
        // Build conversation with AI
        const messages: Message[] = [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `Research this destination thoroughly: ${destination}` }
        ];
        
        let toolCallCount = 0;
        const maxToolCalls = 20; // Increased to allow more thorough research
        let researchComplete = false;
        
        // Collect data from all tool calls for guide generation
        const collectedData: Record<string, any> = {};
        
        // Simulate progressive research with tool calls
        while (!researchComplete && toolCallCount < maxToolCalls) {
          // Call the AI
          const response = await callGitHubModels(messages, true);
          
          if (response.tool_calls && response.tool_calls.length > 0) {
            // AI wants to call tools
            for (const toolCall of response.tool_calls) {
              const toolName = toolCall.function.name;
              const toolArgs = JSON.parse(toolCall.function.arguments);
              
              // Update UI step based on tool - mapped to our real API tools
              const stepMapping: Record<string, number> = {
                'search_destination': 1,
                'get_country_info': 1,
                'get_city_info': 2,
                'search_attractions': 3,
                'get_neighborhoods': 4,
                'get_budget_info': 5,
                'get_transportation': 6,
                'get_safety_info': 7,
                'get_culture_info': 8,
                'get_local_tips': 9,
                'search_images': 10,
                'get_weather': 5,
                'get_visa_info': 7,
                'compare_destinations': 2,
                'finalize_guide': 11,
              };
              
              const stepIndex = stepMapping[toolName] || currentStepIndex;
              
              // Complete previous step and activate new one
              if (stepIndex > currentStepIndex) {
                sendStep(currentStepIndex, 'complete');
                currentStepIndex = stepIndex;
                sendStep(currentStepIndex, 'active');
              }
              
              sendToolCall(toolName);
              
              // Execute the tool - now returns ToolResult object
              const toolResult: ToolResult = await executeTool(toolName, toolArgs);
              
              // Store collected data for guide generation (keep full data)
              if (toolResult.success && toolResult.data) {
                collectedData[toolName] = toolResult.data;
              }
              
              // Format result for message - TRUNCATE to avoid 413 errors
              const resultContent = toolResult.success 
                ? truncateToolResult(toolResult.data)
                : `Error: ${toolResult.error || 'Tool execution failed'}`;
              
              // Add to messages
              messages.push({
                role: 'assistant',
                content: null,
                tool_calls: [toolCall],
              });
              
              messages.push({
                role: 'tool',
                content: resultContent,
                tool_call_id: toolCall.id,
                name: toolName,
              });
              
              toolCallCount++;
              sendProgress(Math.min(10 + (toolCallCount / maxToolCalls) * 80, 90));
            }
          } else {
            // AI finished with tools, final response
            researchComplete = true;
          }
        }
        
        // Complete remaining steps
        for (let i = currentStepIndex; i < steps.length; i++) {
          sendStep(i, 'complete');
          await new Promise(r => setTimeout(r, 200));
        }
        
        sendProgress(95);
        
        // Generate the final travel guide from collected real API data
        const guide = synthesizeGuideFromData(destination, collectedData);
        
        sendProgress(100);
        
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
