// Tool Executor - Calls REAL APIs to gather travel data
// UPGRADED VERSION - Uses premium APIs for better data quality

import {
  geocodeLocation,
  getCountryInfo,
  getCountryByCode,
  getWikipediaSummary,
  getWikipediaContent,
  searchWikipedia,
  searchImages,
  searchPlaces,
  searchCities,
  getWeather,
  getClimateData,
  getExchangeRates,
  getTravelAdvisory,
  getUKTravelAdvice,
  webSearch,
  searchAirports,
  searchTransitStops,
  searchNeighborhoods,
  getOpenTripMapAttractions,
  getEstimatedCosts,
  getCultureData,
  getSafetyData,
} from './apis';

export interface ToolResult {
  success: boolean;
  data?: any;
  error?: string;
  source?: string;
  cached?: boolean;
}

// Helper to safely execute API calls with error handling
async function safeApiCall<T>(
  apiCall: () => Promise<T>,
  source: string
): Promise<ToolResult> {
  try {
    const data = await apiCall();
    return { success: true, data, source };
  } catch (error: any) {
    console.error(`[Tool Error] ${source}:`, error.message);
    return { success: false, error: error.message, source };
  }
}

// ============ MAIN TOOL EXECUTOR ============

export async function executeTool(
  toolName: string,
  args: Record<string, any>
): Promise<ToolResult> {
  console.log(`[Tool] Executing: ${toolName}`, JSON.stringify(args));
  
  // Normalize common parameter names with validation
  const destination = (args.destination || args.query || args.location || args.country || args.city || '').toString().trim();
  const country = (args.country || args.destination || '').toString().trim();
  const city = (args.city || args.destination || '').toString().trim();
  
  // Validate that we have a destination for tools that need it
  const needsDestination = ['search_destination', 'get_city_info', 'search_attractions', 'get_budget_info', 'get_transportation', 'get_culture_info', 'get_weather', 'get_local_tips'];
  if (needsDestination.includes(toolName) && !destination) {
    console.log(`[Tool] Error: ${toolName} requires a destination parameter`);
    return { success: false, error: `Missing required parameter: destination` };
  }
  
  switch (toolName) {
    case 'search_destination':
      return executeSearchDestination(destination);
    
    case 'get_country_info':
      return executeGetCountryInfo(country);
    
    case 'get_city_info':
      return executeGetCityInfo(destination, args.country);
    
    case 'search_attractions':
      return executeSearchAttractions(destination, args.category || args.type);
    
    case 'get_neighborhoods':
      return executeGetNeighborhoods(city, args.country);
    
    case 'get_budget_info':
      return executeGetBudgetInfo(destination, args.currency || args.baseCurrency);
    
    case 'get_transportation':
      return executeGetTransportation(destination);
    
    case 'get_safety_info':
      return executeGetSafetyInfo(country);
    
    case 'get_culture_info':
      return executeGetCultureInfo(destination);
    
    case 'get_weather':
      return executeGetWeather(destination, args.lat, args.lon);
    
    case 'search_images':
      return executeSearchImages(args.query || destination, args.count);
    
    case 'get_visa_info':
      return executeGetVisaInfo(destination, args.nationality);
    
    case 'get_local_tips':
      return executeGetLocalTips(destination);
    
    case 'compare_destinations':
      return executeCompareDestinations(args.destinations);
    
    case 'finalize_guide':
      return executeFinalizeGuide(destination, args.collectedData);
    
    default:
      return { success: false, error: `Unknown tool: ${toolName}` };
  }
}

// ============ TOOL IMPLEMENTATIONS WITH REAL API CALLS ============

async function executeSearchDestination(query: string): Promise<ToolResult> {
  if (!query || query.trim() === '') {
    return { success: false, error: 'Query parameter is required' };
  }
  
  console.log(`[Tool] Searching destination: ${query}`);
  
  const results: any = {
    query,
    timestamp: new Date().toISOString(),
  };

  // 1. Geocode to get coordinates
  const geoResult = await safeApiCall(
    () => geocodeLocation(query),
    'Nominatim Geocoding'
  );
  if (geoResult.success && geoResult.data?.length > 0) {
    const location = geoResult.data[0];
    results.location = {
      displayName: location.display_name,
      lat: parseFloat(location.lat),
      lon: parseFloat(location.lon),
      type: location.type,
      country: location.address?.country,
      countryCode: location.address?.country_code?.toUpperCase(),
    };
  }

  // 2. Get Wikipedia summary
  const wikiResult = await safeApiCall(
    () => getWikipediaSummary(query),
    'Wikipedia'
  );
  if (wikiResult.success && wikiResult.data) {
    results.wikipedia = {
      title: wikiResult.data.title,
      description: wikiResult.data.description,
      extract: wikiResult.data.extract,
      thumbnail: wikiResult.data.thumbnail,
      image: wikiResult.data.originalImage,
      url: wikiResult.data.url,
    };
  }

  // 3. Get country information - use country code if available (more reliable than native name)
  // Nominatim returns country names in local language (e.g., "Ελλάς" instead of "Greece")
  // So we should use the country code for REST Countries lookup
  let countryResult;
  
  if (results.location?.countryCode) {
    // Use country code for reliable lookup
    countryResult = await safeApiCall(
      () => getCountryByCode(results.location.countryCode),
      'REST Countries (by code)'
    );
  }
  
  // Fallback to name-based lookup if code lookup failed
  if (!countryResult?.success || !countryResult?.data) {
    const countryQuery = query; // Use the original search query, not the native name
    countryResult = await safeApiCall(
      () => getCountryInfo(countryQuery),
      'REST Countries'
    );
  }
  
  if (countryResult?.success && countryResult?.data) {
    results.country = countryResult.data;
    // Store the English country name for use by other tools
    results.englishCountryName = countryResult.data.name || query;
    // Also store country code for API calls
    results.countryCode = countryResult.data.cca2;
  } else {
    // Fallback to using the query as the country name
    results.englishCountryName = query;
  }

  // 4. Web search for context (uses Wikipedia + Wikidata + DuckDuckGo fallback)
  const webResult = await safeApiCall(
    () => webSearch(`${query} travel guide`),
    'Web Search (Multi-source)'
  );
  if (webResult.success && webResult.data) {
    results.webSearch = webResult.data;
  }

  return {
    success: true,
    data: results,
    source: 'Nominatim, Wikipedia, REST Countries, Web Search',
  };
}

async function executeGetCountryInfo(country: string): Promise<ToolResult> {
  console.log(`[Tool] Getting country info: ${country}`);
  
  const results: any = { country };

  const countryResult = await safeApiCall(() => getCountryInfo(country), 'REST Countries');
  if (countryResult.success) results.info = countryResult.data;

  const wikiResult = await safeApiCall(() => getWikipediaContent(country), 'Wikipedia');
  if (wikiResult.success) results.wikiContent = wikiResult.data;

  if (results.info?.cca2) {
    const advisoryResult = await safeApiCall(() => getTravelAdvisory(results.info.cca2), 'Travel Advisory');
    if (advisoryResult.success) results.advisory = advisoryResult.data;
  }

  const ratesResult = await safeApiCall(() => getExchangeRates('USD'), 'Frankfurter');
  if (ratesResult.success) results.exchangeRates = ratesResult.data;

  return { success: true, data: results, source: 'REST Countries, Wikipedia, Travel Advisory, Frankfurter' };
}

async function executeGetCityInfo(city: string, country?: string): Promise<ToolResult> {
  if (!city || city.trim() === '') {
    return { success: false, error: 'City parameter is required' };
  }
  
  console.log(`[Tool] Getting city info: city="${city}", country="${country || 'not specified'}"`);
  
  const query = country ? `${city}, ${country}` : city;
  const results: any = { city, country };

  const geoResult = await safeApiCall(() => geocodeLocation(query), 'Nominatim');
  if (geoResult.success && geoResult.data?.length > 0) {
    const loc = geoResult.data[0];
    results.location = { lat: parseFloat(loc.lat), lon: parseFloat(loc.lon), displayName: loc.display_name };
  }

  const wikiResult = await safeApiCall(() => getWikipediaSummary(city), 'Wikipedia');
  if (wikiResult.success) results.wikipedia = wikiResult.data;

  if (results.location) {
    const { lat, lon } = results.location;
    
    const weatherResult = await safeApiCall(() => getWeather(lat, lon), 'Open-Meteo');
    if (weatherResult.success) results.weather = weatherResult.data;

    const attractionsResult = await safeApiCall(() => searchPlaces(lat, lon, 10000, 'attractions'), 'Overpass');
    if (attractionsResult.success) results.attractions = attractionsResult.data?.slice(0, 20);

    const airportsResult = await safeApiCall(() => searchAirports(lat, lon, 80000), 'Overpass');
    if (airportsResult.success) results.airports = airportsResult.data;

    const neighborhoodsResult = await safeApiCall(() => searchNeighborhoods(lat, lon, 15000), 'Overpass');
    if (neighborhoodsResult.success) results.neighborhoods = neighborhoodsResult.data;
  }

  const imagesResult = await safeApiCall(() => searchImages(`${city} ${country || ''} travel`, 8), 'Images');
  if (imagesResult.success) results.images = imagesResult.data;

  return { success: true, data: results, source: 'Nominatim, Wikipedia, Open-Meteo, Overpass, Image Search' };
}

async function executeSearchAttractions(location: string, category?: string): Promise<ToolResult> {
  console.log(`[Tool] Searching attractions: ${location}`);
  
  const results: any = { location, category };

  const geoResult = await safeApiCall(() => geocodeLocation(location), 'Nominatim');
  if (!geoResult.success || !geoResult.data?.length) {
    return { success: false, error: `Could not find location: ${location}` };
  }

  const loc = geoResult.data[0];
  const lat = parseFloat(loc.lat);
  const lon = parseFloat(loc.lon);
  results.coordinates = { lat, lon };

  // Use OpenTripMap for better attraction data
  const attractionsResult = await safeApiCall(
    () => getOpenTripMapAttractions(lat, lon, 20000, 25), 
    'OpenTripMap'
  );
  if (attractionsResult.success && attractionsResult.data?.length > 0) {
    results.attractions = attractionsResult.data;
    console.log(`[Tool] OpenTripMap found ${attractionsResult.data.length} attractions`);
  } else {
    // Fallback to Overpass
    const overpassResult = await safeApiCall(
      () => searchPlaces(lat, lon, 15000, category || 'attractions'), 
      'Overpass'
    );
    if (overpassResult.success) results.attractions = overpassResult.data;
  }

  // Get historic sites separately for variety
  const historicResult = await safeApiCall(() => searchPlaces(lat, lon, 15000, 'historic'), 'Overpass');
  if (historicResult.success) results.historicSites = historicResult.data;

  const wikiResult = await safeApiCall(() => searchWikipedia(`${location} tourist attractions`, 10), 'Wikipedia');
  if (wikiResult.success) results.wikiResults = wikiResult.data;

  const imagesResult = await safeApiCall(() => searchImages(`${location} attractions landmarks`, 10), 'Images');
  if (imagesResult.success) results.images = imagesResult.data;

  return { success: true, data: results, source: 'Nominatim, OpenTripMap, Wikipedia, Images' };
}

async function executeGetNeighborhoods(city: string, country?: string): Promise<ToolResult> {
  console.log(`[Tool] Getting neighborhoods: ${city}`);
  
  const query = country ? `${city}, ${country}` : city;
  const results: any = { city, country };

  const geoResult = await safeApiCall(() => geocodeLocation(query), 'Nominatim');
  if (!geoResult.success || !geoResult.data?.length) {
    return { success: false, error: `Could not find city: ${city}` };
  }

  const loc = geoResult.data[0];
  const lat = parseFloat(loc.lat);
  const lon = parseFloat(loc.lon);

  const neighborhoodsResult = await safeApiCall(() => searchNeighborhoods(lat, lon, 20000), 'Overpass');
  if (neighborhoodsResult.success) results.neighborhoods = neighborhoodsResult.data;

  // Enrich top neighborhoods with Wikipedia info
  if (results.neighborhoods?.length > 0) {
    const enriched = [];
    for (const n of results.neighborhoods.slice(0, 8)) {
      const wikiResult = await safeApiCall(() => getWikipediaSummary(`${n.name} ${city}`), 'Wikipedia');
      enriched.push({ ...n, wikipedia: wikiResult.success ? wikiResult.data : null });
      await new Promise(r => setTimeout(r, 100)); // Rate limit
    }
    results.enrichedNeighborhoods = enriched;
  }

  const webResult = await safeApiCall(() => webSearch(`${city} best neighborhoods to stay`), 'Web Search');
  if (webResult.success) results.webSearch = webResult.data;

  return { success: true, data: results, source: 'Nominatim, Overpass, Wikipedia, Web Search' };
}

async function executeGetBudgetInfo(destination: string, currency: string = 'USD'): Promise<ToolResult> {
  console.log(`[Tool] Getting budget info: ${destination}`);
  
  const results: any = { destination, currency };

  const countryResult = await safeApiCall(() => getCountryInfo(destination), 'REST Countries');
  if (countryResult.success && countryResult.data) {
    results.countryInfo = countryResult.data;
    results.localCurrency = countryResult.data.currencies?.[0];
    
    // Get estimated costs from our comprehensive database
    const countryCode = countryResult.data.cca2;
    if (countryCode) {
      const costEstimates = getEstimatedCosts(countryCode);
      results.daily = costEstimates.daily;
      results.weekly = costEstimates.weekly;
      results.breakdown = costEstimates.breakdown;
    }
  }

  const ratesResult = await safeApiCall(() => getExchangeRates(currency), 'Frankfurter');
  if (ratesResult.success) {
    results.exchangeRates = ratesResult.data;
    if (results.localCurrency?.code) {
      results.exchangeRate = ratesResult.data.rates[results.localCurrency.code];
    }
  }

  // Add budget tips
  results.tips = [
    'Book accommodation in advance for better rates',
    'Eat where locals eat for authentic food at lower prices',
    'Use public transportation instead of taxis',
    'Visit free attractions and museums on free entry days',
    'Get a local SIM card instead of using roaming',
  ];

  return { success: true, data: results, source: 'REST Countries, Frankfurter, Cost Database' };
}

async function executeGetTransportation(destination: string): Promise<ToolResult> {
  console.log(`[Tool] Getting transportation info: ${destination}`);
  
  const results: any = { destination };

  const geoResult = await safeApiCall(() => geocodeLocation(destination), 'Nominatim');
  if (geoResult.success && geoResult.data?.length > 0) {
    const loc = geoResult.data[0];
    const lat = parseFloat(loc.lat);
    const lon = parseFloat(loc.lon);
    results.coordinates = { lat, lon };

    const airportsResult = await safeApiCall(() => searchAirports(lat, lon, 150000), 'Overpass');
    if (airportsResult.success) results.airports = airportsResult.data;

    const transitResult = await safeApiCall(() => searchTransitStops(lat, lon, 5000), 'Overpass');
    if (transitResult.success) results.transitStops = transitResult.data;
  }

  const webResult = await safeApiCall(() => webSearch(`${destination} public transportation getting around`), 'Web Search');
  if (webResult.success) results.webSearch = webResult.data;

  const countryResult = await safeApiCall(() => getCountryInfo(destination), 'REST Countries');
  if (countryResult.success) results.drivingSide = countryResult.data?.drivingSide;

  return { success: true, data: results, source: 'Nominatim, Overpass, Web Search, REST Countries' };
}

async function executeGetSafetyInfo(country: string): Promise<ToolResult> {
  if (!country || country.trim() === '') {
    return { success: false, error: 'Country parameter is required' };
  }
  
  console.log(`[Tool] Getting safety info: country="${country}"`);
  
  const results: any = { country };

  const countryResult = await safeApiCall(() => getCountryInfo(country), 'REST Countries');
  if (countryResult.success) {
    results.countryInfo = countryResult.data;
    
    // Get comprehensive safety data from our database
    const countryCode = countryResult.data?.cca2;
    if (countryCode) {
      const safetyData = getSafetyData(countryCode);
      results.safetyData = safetyData;
      results.overallRating = safetyData.rating;
      results.summary = safetyData.summary;
      results.concerns = safetyData.concerns;
      results.tips = safetyData.tips;
      results.emergencyNumbers = safetyData.emergency;
      results.healthAdvice = safetyData.health;
    }
  }

  if (results.countryInfo?.cca2) {
    const advisoryResult = await safeApiCall(() => getTravelAdvisory(results.countryInfo.cca2), 'Travel Advisory');
    if (advisoryResult.success) {
      results.advisory = advisoryResult.data;
      results.advisoryScore = advisoryResult.data?.advisory?.score;
      results.advisorySummary = advisoryResult.data?.advisory?.message;
    }
  }

  const ukResult = await safeApiCall(() => getUKTravelAdvice(country), 'UK FCDO');
  if (ukResult.success) results.ukAdvice = ukResult.data;

  return { success: true, data: results, source: 'REST Countries, Safety Database, Travel Advisory, UK FCDO' };
}

async function executeGetCultureInfo(destination: string): Promise<ToolResult> {
  console.log(`[Tool] Getting culture info: ${destination}`);
  
  const results: any = { destination };

  const countryResult = await safeApiCall(() => getCountryInfo(destination), 'REST Countries');
  if (countryResult.success) {
    results.countryInfo = countryResult.data;
    
    // Get comprehensive culture data from our database
    const countryCode = countryResult.data?.cca2;
    if (countryCode) {
      const cultureData = getCultureData(countryCode);
      results.cultureData = cultureData;
      results.tipping = cultureData.tipping;
      results.dress = cultureData.dress;
      results.greetings = cultureData.greetings;
      results.etiquette = cultureData.etiquette;
      results.taboos = cultureData.taboos;
      results.customs = cultureData.customs;
    }
    
    // Add language info
    if (countryResult.data?.languages) {
      results.languages = countryResult.data.languages;
    }
  }

  const wikiResult = await safeApiCall(() => getWikipediaContent(`Culture of ${destination}`), 'Wikipedia');
  if (wikiResult.success) results.cultureWiki = wikiResult.data;

  return { success: true, data: results, source: 'REST Countries, Culture Database, Wikipedia' };
}

async function executeGetWeather(location: string, providedLat?: number, providedLon?: number): Promise<ToolResult> {
  if (!location || location.trim() === '') {
    return { success: false, error: 'Location parameter is required' };
  }
  
  console.log(`[Tool] Getting weather: location="${location}", lat=${providedLat}, lon=${providedLon}`);
  
  const results: any = { location };

  let lat: number;
  let lon: number;
  
  // If lat/lon are provided, use them directly
  if (providedLat !== undefined && providedLon !== undefined) {
    lat = providedLat;
    lon = providedLon;
    results.coordinates = { lat, lon };
  } else {
    // Otherwise geocode the location
    const geoResult = await safeApiCall(() => geocodeLocation(location), 'Nominatim');
    if (!geoResult.success || !geoResult.data?.length) {
      return { success: false, error: `Could not find location: ${location}` };
    }

    const loc = geoResult.data[0];
    lat = parseFloat(loc.lat);
    lon = parseFloat(loc.lon);
    results.coordinates = { lat, lon };
  }

  const weatherResult = await safeApiCall(() => getWeather(lat, lon), 'Open-Meteo');
  if (weatherResult.success) results.weather = weatherResult.data;

  const climateResult = await safeApiCall(() => getClimateData(lat, lon), 'Open-Meteo Archive');
  if (climateResult.success) results.climate = climateResult.data;

  const webResult = await safeApiCall(() => webSearch(`${location} best time to visit weather`), 'Web Search');
  if (webResult.success) results.webSearch = webResult.data;

  return { success: true, data: results, source: 'Nominatim, Open-Meteo, Web Search' };
}

async function executeSearchImages(query: string, count: number = 10): Promise<ToolResult> {
  console.log(`[Tool] Searching images: ${query}`);
  
  const results: any = { query };

  const imagesResult = await safeApiCall(() => searchImages(query, count), 'Images');
  if (imagesResult.success) results.images = imagesResult.data;

  const wikiResult = await safeApiCall(() => getWikipediaSummary(query), 'Wikipedia');
  if (wikiResult.success && wikiResult.data?.originalImage) {
    results.wikiImage = { url: wikiResult.data.originalImage, thumbnail: wikiResult.data.thumbnail, alt: wikiResult.data.title };
  }

  return { success: true, data: results, source: 'Unsplash/Wikimedia, Wikipedia' };
}

async function executeGetVisaInfo(destination: string, nationality?: string): Promise<ToolResult> {
  console.log(`[Tool] Getting visa info: ${destination}`);
  
  const results: any = { destination, nationality };

  const countryResult = await safeApiCall(() => getCountryInfo(destination), 'REST Countries');
  if (countryResult.success) results.countryInfo = countryResult.data;

  const ukResult = await safeApiCall(() => getUKTravelAdvice(destination), 'UK FCDO');
  if (ukResult.success) results.ukAdvice = ukResult.data;

  const webResult = await safeApiCall(() => webSearch(`${destination} visa requirements entry ${nationality || ''}`), 'Web Search');
  if (webResult.success) results.webSearch = webResult.data;

  return { success: true, data: results, source: 'REST Countries, UK FCDO, Web Search' };
}

async function executeGetLocalTips(destination: string): Promise<ToolResult> {
  console.log(`[Tool] Getting local tips: ${destination}`);
  
  const results: any = { destination };

  // Get country info for culture-based tips
  const countryResult = await safeApiCall(() => getCountryInfo(destination), 'REST Countries');
  if (countryResult.success && countryResult.data?.cca2) {
    const countryCode = countryResult.data.cca2;
    const cultureData = getCultureData(countryCode);
    const safetyData = getSafetyData(countryCode);
    
    // Generate smart tips based on culture and safety data
    results.tips = [
      ...cultureData.etiquette.slice(0, 3),
      ...safetyData.tips.slice(0, 2),
    ];
    
    // Common mistakes based on culture
    results.commonMistakes = [
      { 
        mistake: 'Not learning basic local phrases', 
        why: 'Locals appreciate the effort and it shows respect',
        instead: `Learn at least "hello", "thank you", and "please" in the local language`
      },
      { 
        mistake: 'Only visiting tourist areas', 
        why: 'You miss authentic local experiences',
        instead: 'Explore neighborhoods where locals live and eat'
      },
      {
        mistake: 'Not researching local customs',
        why: 'You might accidentally offend or miss important experiences',
        instead: `Know the local etiquette: ${cultureData.etiquette[0] || 'research before you go'}`
      },
      {
        mistake: 'Overpacking',
        why: 'Heavy luggage limits your mobility and flexibility',
        instead: 'Pack light and buy what you need locally'
      },
      {
        mistake: 'Not having backup payment methods',
        why: 'Cards can be declined or ATMs may be unavailable',
        instead: 'Carry some cash and have multiple card options'
      }
    ];
    
    // Best for traveler types
    results.bestFor = [
      { type: 'Culture Enthusiasts', why: 'Rich history and local traditions', highlights: cultureData.customs.slice(0, 2) },
      { type: 'Food Lovers', why: 'Unique local cuisine and dining experiences', highlights: ['Street food', 'Local restaurants', 'Traditional dishes'] },
      { type: 'History Buffs', why: 'Historical sites and museums', highlights: ['Ancient ruins', 'Museums', 'Historical landmarks'] },
      { type: 'Adventure Seekers', why: 'Diverse landscapes and activities', highlights: ['Outdoor activities', 'Hiking', 'Local adventures'] },
    ];
  }

  const tipsResult = await safeApiCall(() => webSearch(`${destination} travel tips insider secrets`), 'Web Search');
  if (tipsResult.success) results.webTips = tipsResult.data;

  return { success: true, data: results, source: 'Culture Database, Web Search' };
}

async function executeCompareDestinations(destinations: string[]): Promise<ToolResult> {
  console.log(`[Tool] Comparing destinations:`, destinations);
  
  const results: any = { destinations: [] };

  for (const dest of destinations) {
    const destData: any = { name: dest };

    const countryResult = await safeApiCall(() => getCountryInfo(dest), 'REST Countries');
    if (countryResult.success) destData.country = countryResult.data;

    const wikiResult = await safeApiCall(() => getWikipediaSummary(dest), 'Wikipedia');
    if (wikiResult.success) destData.wikipedia = wikiResult.data;

    if (destData.country?.cca2) {
      const advisoryResult = await safeApiCall(() => getTravelAdvisory(destData.country.cca2), 'Travel Advisory');
      if (advisoryResult.success) destData.advisory = advisoryResult.data;
    }

    results.destinations.push(destData);
    await new Promise(r => setTimeout(r, 300));
  }

  return { success: true, data: results, source: 'REST Countries, Wikipedia, Travel Advisory' };
}

async function executeFinalizeGuide(destination: string, collectedData: any): Promise<ToolResult> {
  console.log(`[Tool] Finalizing guide for: ${destination}`);
  
  return {
    success: true,
    data: {
      destination,
      status: 'complete',
      message: 'Guide research completed with real data from multiple sources.',
      timestamp: new Date().toISOString(),
      collectedData,
    },
    source: 'Internal',
  };
}

// Helper to get theme for destination
export function getThemeForDestination(destination: string): string {
  const themeMap: Record<string, string> = {
    'japan': 'japan', 'tokyo': 'japan', 'kyoto': 'japan', 'osaka': 'japan',
    'france': 'france', 'paris': 'france', 'nice': 'france', 'lyon': 'france',
    'italy': 'italy', 'rome': 'italy', 'venice': 'italy', 'florence': 'italy',
    'thailand': 'thailand', 'bangkok': 'thailand', 'phuket': 'thailand',
    'morocco': 'morocco', 'marrakech': 'morocco', 'fes': 'morocco', 'casablanca': 'morocco',
    'greece': 'greece', 'athens': 'greece', 'santorini': 'greece',
    'spain': 'spain', 'barcelona': 'spain', 'madrid': 'spain',
    'portugal': 'portugal', 'lisbon': 'portugal', 'porto': 'portugal',
    'turkey': 'turkey', 'istanbul': 'turkey',
    'egypt': 'egypt', 'cairo': 'egypt',
    'india': 'india', 'delhi': 'india', 'mumbai': 'india',
    'brazil': 'brazil', 'rio': 'brazil',
    'mexico': 'mexico', 'mexico city': 'mexico',
    'australia': 'australia', 'sydney': 'australia',
    'iceland': 'iceland', 'reykjavik': 'iceland',
    'peru': 'peru', 'lima': 'peru', 'cusco': 'peru',
    'vietnam': 'vietnam', 'hanoi': 'vietnam',
  };
  const lower = destination.toLowerCase();
  return themeMap[lower] || 'default';
}

