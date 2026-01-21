// Tool Executor - Calls REAL APIs to gather travel data
// Each tool corresponds to a real API call or combination of calls

import {
  geocodeLocation,
  getCountryInfo,
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
  
  // Normalize common parameter names
  const destination = args.destination || args.query || args.location || args.country || args.city;
  const country = args.country || args.destination;
  const city = args.city || args.destination;
  
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

  // 3. Get country information
  const countryQuery = results.location?.country || query;
  const countryResult = await safeApiCall(
    () => getCountryInfo(countryQuery),
    'REST Countries'
  );
  if (countryResult.success && countryResult.data) {
    results.country = countryResult.data;
  }

  // 4. Web search for context
  const webResult = await safeApiCall(
    () => webSearch(`${query} travel guide`),
    'DuckDuckGo'
  );
  if (webResult.success && webResult.data) {
    results.webSearch = webResult.data;
  }

  return {
    success: true,
    data: results,
    source: 'Nominatim, Wikipedia, REST Countries, DuckDuckGo',
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
  console.log(`[Tool] Getting city info: ${city}, ${country}`);
  
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

  const attractionsResult = await safeApiCall(() => searchPlaces(lat, lon, 15000, category || 'attractions'), 'Overpass');
  if (attractionsResult.success) results.attractions = attractionsResult.data;

  const historicResult = await safeApiCall(() => searchPlaces(lat, lon, 15000, 'historic'), 'Overpass');
  if (historicResult.success) results.historicSites = historicResult.data;

  const wikiResult = await safeApiCall(() => searchWikipedia(`${location} tourist attractions`, 15), 'Wikipedia');
  if (wikiResult.success) results.wikiResults = wikiResult.data;

  const imagesResult = await safeApiCall(() => searchImages(`${location} attractions landmarks`, 10), 'Images');
  if (imagesResult.success) results.images = imagesResult.data;

  return { success: true, data: results, source: 'Nominatim, Overpass, Wikipedia, Images' };
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

  const webResult = await safeApiCall(() => webSearch(`${city} best neighborhoods to stay`), 'DuckDuckGo');
  if (webResult.success) results.webSearch = webResult.data;

  return { success: true, data: results, source: 'Nominatim, Overpass, Wikipedia, DuckDuckGo' };
}

async function executeGetBudgetInfo(destination: string, currency: string = 'USD'): Promise<ToolResult> {
  console.log(`[Tool] Getting budget info: ${destination}`);
  
  const results: any = { destination, currency };

  const countryResult = await safeApiCall(() => getCountryInfo(destination), 'REST Countries');
  if (countryResult.success && countryResult.data) {
    results.countryInfo = countryResult.data;
    results.localCurrency = countryResult.data.currencies?.[0];
  }

  const ratesResult = await safeApiCall(() => getExchangeRates(currency), 'Frankfurter');
  if (ratesResult.success) {
    results.exchangeRates = ratesResult.data;
    if (results.localCurrency?.code) {
      results.exchangeRate = ratesResult.data.rates[results.localCurrency.code];
    }
  }

  const webResult = await safeApiCall(() => webSearch(`${destination} travel budget cost daily expenses`), 'DuckDuckGo');
  if (webResult.success) results.webSearch = webResult.data;

  const hotelResult = await safeApiCall(() => webSearch(`${destination} hotel prices average cost`), 'DuckDuckGo');
  if (hotelResult.success) results.hotelInfo = hotelResult.data;

  return { success: true, data: results, source: 'REST Countries, Frankfurter, DuckDuckGo' };
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

  const webResult = await safeApiCall(() => webSearch(`${destination} public transportation getting around`), 'DuckDuckGo');
  if (webResult.success) results.webSearch = webResult.data;

  const countryResult = await safeApiCall(() => getCountryInfo(destination), 'REST Countries');
  if (countryResult.success) results.drivingSide = countryResult.data?.drivingSide;

  return { success: true, data: results, source: 'Nominatim, Overpass, DuckDuckGo, REST Countries' };
}

async function executeGetSafetyInfo(country: string): Promise<ToolResult> {
  console.log(`[Tool] Getting safety info: ${country}`);
  
  const results: any = { country };

  const countryResult = await safeApiCall(() => getCountryInfo(country), 'REST Countries');
  if (countryResult.success) results.countryInfo = countryResult.data;

  if (results.countryInfo?.cca2) {
    const advisoryResult = await safeApiCall(() => getTravelAdvisory(results.countryInfo.cca2), 'Travel Advisory');
    if (advisoryResult.success) results.advisory = advisoryResult.data;
  }

  const ukResult = await safeApiCall(() => getUKTravelAdvice(country), 'UK FCDO');
  if (ukResult.success) results.ukAdvice = ukResult.data;

  const webResult = await safeApiCall(() => webSearch(`${country} travel safety tips warnings`), 'DuckDuckGo');
  if (webResult.success) results.webSearch = webResult.data;

  return { success: true, data: results, source: 'REST Countries, Travel Advisory, UK FCDO, DuckDuckGo' };
}

async function executeGetCultureInfo(destination: string): Promise<ToolResult> {
  console.log(`[Tool] Getting culture info: ${destination}`);
  
  const results: any = { destination };

  const wikiResult = await safeApiCall(() => getWikipediaContent(`Culture of ${destination}`), 'Wikipedia');
  if (wikiResult.success) results.cultureWiki = wikiResult.data;

  const countryResult = await safeApiCall(() => getCountryInfo(destination), 'REST Countries');
  if (countryResult.success) results.countryInfo = countryResult.data;

  const etiquetteResult = await safeApiCall(() => webSearch(`${destination} cultural etiquette customs dos donts`), 'DuckDuckGo');
  if (etiquetteResult.success) results.etiquette = etiquetteResult.data;

  const foodResult = await safeApiCall(() => webSearch(`${destination} traditional food cuisine must try`), 'DuckDuckGo');
  if (foodResult.success) results.food = foodResult.data;

  return { success: true, data: results, source: 'Wikipedia, REST Countries, DuckDuckGo' };
}

async function executeGetWeather(location: string, providedLat?: number, providedLon?: number): Promise<ToolResult> {
  console.log(`[Tool] Getting weather: ${location}`);
  
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

  const webResult = await safeApiCall(() => webSearch(`${location} best time to visit weather`), 'DuckDuckGo');
  if (webResult.success) results.webSearch = webResult.data;

  return { success: true, data: results, source: 'Nominatim, Open-Meteo, DuckDuckGo' };
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

  const webResult = await safeApiCall(() => webSearch(`${destination} visa requirements entry ${nationality || ''}`), 'DuckDuckGo');
  if (webResult.success) results.webSearch = webResult.data;

  return { success: true, data: results, source: 'REST Countries, UK FCDO, DuckDuckGo' };
}

async function executeGetLocalTips(destination: string): Promise<ToolResult> {
  console.log(`[Tool] Getting local tips: ${destination}`);
  
  const results: any = { destination };

  const tipsResult = await safeApiCall(() => webSearch(`${destination} local tips insider secrets hidden gems`), 'DuckDuckGo');
  if (tipsResult.success) results.tips = tipsResult.data;

  const mistakesResult = await safeApiCall(() => webSearch(`${destination} tourist mistakes avoid`), 'DuckDuckGo');
  if (mistakesResult.success) results.mistakes = mistakesResult.data;

  const hiddenResult = await safeApiCall(() => webSearch(`${destination} off beaten path locals`), 'DuckDuckGo');
  if (hiddenResult.success) results.hiddenGems = hiddenResult.data;

  return { success: true, data: results, source: 'DuckDuckGo' };
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

