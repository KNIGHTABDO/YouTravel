// Real API integrations for travel research
// These are the actual API calls that the AI agent will use

const USER_AGENT = 'YouTravel/1.0 (https://youtravel.app; contact@youtravel.app)';

// Helper for Overpass API with timeout and rate limit handling
async function overpassQuery(query: string, timeout: number = 15000): Promise<any> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `data=${encodeURIComponent(query)}`,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (response.status === 429) {
      console.log('Overpass API rate limited, returning empty result');
      return { elements: [] };
    }
    
    if (response.status === 504 || response.status === 503) {
      console.log('Overpass API timeout/unavailable, returning empty result');
      return { elements: [] };
    }
    
    if (!response.ok) {
      console.log(`Overpass API error ${response.status}, returning empty result`);
      return { elements: [] };
    }
    
    return await response.json();
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.log('Overpass API request timed out, returning empty result');
    } else {
      console.log(`Overpass API error: ${error.message}, returning empty result`);
    }
    return { elements: [] };
  }
}

// ============ GEOCODING & LOCATION ============

export async function geocodeLocation(query: string) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&extratags=1&limit=5`,
      { 
        headers: { 'User-Agent': USER_AGENT },
        next: { revalidate: 86400 }, // Cache for 24 hours
        signal: AbortSignal.timeout(10000), // 10 second timeout
      }
    );
    
    if (!response.ok) {
      console.log(`Geocoding failed: ${response.status}, returning empty array`);
      return [];
    }
    return response.json();
  } catch (error: any) {
    console.log(`Geocoding error: ${error.message}, returning empty array`);
    return [];
  }
}

export async function reverseGeocode(lat: number, lon: number) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`,
      { 
        headers: { 'User-Agent': USER_AGENT },
        next: { revalidate: 86400 },
        signal: AbortSignal.timeout(10000),
      }
    );
    
    if (!response.ok) {
      console.log(`Reverse geocoding failed: ${response.status}, returning null`);
      return null;
    }
    return response.json();
  } catch (error: any) {
    console.log(`Reverse geocoding error: ${error.message}, returning null`);
    return null;
  }
}

// ============ PLACES & ATTRACTIONS (OpenStreetMap Overpass API) ============

export async function searchPlaces(lat: number, lon: number, radius: number = 5000, category: string = 'tourism') {
  // Overpass QL query for finding places
  const categoryMap: Record<string, string> = {
    'tourism': '["tourism"]',
    'attractions': '["tourism"~"attraction|museum|gallery|viewpoint|artwork"]',
    'hotels': '["tourism"="hotel"]',
    'restaurants': '["amenity"="restaurant"]',
    'cafes': '["amenity"="cafe"]',
    'bars': '["amenity"="bar"]',
    'shops': '["shop"]',
    'transport': '["public_transport"]',
    'historic': '["historic"]',
    'nature': '["natural"]',
    'religious': '["amenity"="place_of_worship"]',
  };

  const filter = categoryMap[category] || '["tourism"]';
  
  const query = `
    [out:json][timeout:30];
    (
      node${filter}(around:${radius},${lat},${lon});
      way${filter}(around:${radius},${lat},${lon});
    );
    out body center 50;
  `;

  const data = await overpassQuery(query);
  
  // Transform OSM data to our format
  return data.elements.map((el: any) => ({
    id: el.id,
    name: el.tags?.name || 'Unnamed',
    type: el.tags?.tourism || el.tags?.amenity || el.tags?.historic || 'place',
    lat: el.lat || el.center?.lat,
    lon: el.lon || el.center?.lon,
    tags: el.tags || {},
    description: el.tags?.description || el.tags?.['description:en'] || null,
    website: el.tags?.website || null,
    phone: el.tags?.phone || null,
    openingHours: el.tags?.opening_hours || null,
    wheelchair: el.tags?.wheelchair || null,
    wikipedia: el.tags?.wikipedia || null,
  })).filter((p: any) => p.name !== 'Unnamed');
}

export async function searchCities(countryCode: string) {
  // Find major cities in a country
  const query = `
    [out:json][timeout:60];
    area["ISO3166-1"="${countryCode.toUpperCase()}"]->.country;
    (
      node["place"~"city|town"](area.country);
    );
    out body 100;
  `;

  const data = await overpassQuery(query, 65000); // 65 second timeout for this longer query
  
  return data.elements
    .map((el: any) => ({
      name: el.tags?.name || el.tags?.['name:en'],
      population: parseInt(el.tags?.population) || 0,
      lat: el.lat,
      lon: el.lon,
      wikipedia: el.tags?.wikipedia,
      wikidata: el.tags?.wikidata,
    }))
    .filter((c: any) => c.name && c.population > 0)
    .sort((a: any, b: any) => b.population - a.population)
    .slice(0, 20);
}

// ============ COUNTRY INFORMATION ============

export async function getCountryInfo(countryName: string) {
  try {
    const response = await fetch(
      `https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}?fullText=false`,
      { 
        next: { revalidate: 86400 * 7 }, // Cache for a week
        signal: AbortSignal.timeout(10000), // 10 second timeout
      }
    );
    
    if (!response.ok) {
      console.log(`REST Countries API failed: ${response.status}, returning null`);
      return null;
    }
    const data = await response.json();
    
    if (!data || data.length === 0) return null;
    
    const country = data[0];
    return {
      name: country.name?.common,
      officialName: country.name?.official,
      capital: country.capital?.[0],
      region: country.region,
      subregion: country.subregion,
      population: country.population,
      area: country.area,
      languages: Object.values(country.languages || {}),
      currencies: Object.entries(country.currencies || {}).map(([code, info]: [string, any]) => ({
        code,
        name: info.name,
        symbol: info.symbol,
      })),
      timezones: country.timezones,
      borders: country.borders || [],
      flag: country.flags?.svg || country.flags?.png,
      coatOfArms: country.coatOfArms?.svg,
      maps: country.maps,
      latlng: country.latlng,
      landlocked: country.landlocked,
      unMember: country.unMember,
      cca2: country.cca2,
      cca3: country.cca3,
      callingCodes: country.idd?.root ? [country.idd.root + (country.idd.suffixes?.[0] || '')] : [],
      drivingSide: country.car?.side,
    };
  } catch (error: any) {
    console.log(`Country info fetch failed: ${error.message}, returning null`);
    return null;
  }
}

// ============ WIKIPEDIA ============

export async function getWikipediaSummary(title: string, lang: string = 'en') {
  const response = await fetch(
    `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
    { 
      headers: { 'User-Agent': USER_AGENT },
      next: { revalidate: 86400 }
    }
  );
  
  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error(`Wikipedia API failed: ${response.status}`);
  }
  
  const data = await response.json();
  return {
    title: data.title,
    extract: data.extract,
    description: data.description,
    thumbnail: data.thumbnail?.source,
    originalImage: data.originalimage?.source,
    coordinates: data.coordinates,
    url: data.content_urls?.desktop?.page,
  };
}

export async function searchWikipedia(query: string, limit: number = 10) {
  const response = await fetch(
    `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(query)}&limit=${limit}&format=json&origin=*`,
    { headers: { 'User-Agent': USER_AGENT } }
  );
  
  if (!response.ok) throw new Error(`Wikipedia search failed: ${response.status}`);
  const [, titles, descriptions, urls] = await response.json();
  
  return titles.map((title: string, i: number) => ({
    title,
    description: descriptions[i],
    url: urls[i],
  }));
}

export async function getWikipediaContent(title: string) {
  const response = await fetch(
    `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=extracts|images|coordinates|categories&exintro=1&explaintext=1&format=json&origin=*`,
    { headers: { 'User-Agent': USER_AGENT } }
  );
  
  if (!response.ok) throw new Error(`Wikipedia content failed: ${response.status}`);
  const data = await response.json();
  const pages = data.query?.pages || {};
  const page = Object.values(pages)[0] as any;
  
  if (!page || page.missing) return null;
  
  return {
    title: page.title,
    extract: page.extract,
    coordinates: page.coordinates?.[0],
    images: page.images?.map((img: any) => img.title),
    categories: page.categories?.map((cat: any) => cat.title.replace('Category:', '')),
  };
}

// ============ IMAGES (Unsplash - requires API key) ============

export async function searchImages(query: string, perPage: number = 10) {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  
  if (!accessKey) {
    // Fallback to Wikimedia Commons
    return searchWikimediaImages(query, perPage);
  }
  
  const response = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query + ' travel')}&per_page=${perPage}&orientation=landscape`,
    { 
      headers: { 'Authorization': `Client-ID ${accessKey}` },
      next: { revalidate: 3600 }
    }
  );
  
  if (!response.ok) throw new Error(`Unsplash API failed: ${response.status}`);
  const data = await response.json();
  
  return data.results.map((img: any) => ({
    id: img.id,
    url: img.urls.regular,
    thumb: img.urls.thumb,
    alt: img.alt_description || img.description || query,
    credit: img.user.name,
    creditUrl: img.user.links.html,
    downloadUrl: img.links.download,
  }));
}

export async function searchWikimediaImages(query: string, limit: number = 10) {
  const response = await fetch(
    `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=6&prop=imageinfo&iiprop=url|extmetadata|size&iiurlwidth=800&format=json&origin=*`,
    { headers: { 'User-Agent': USER_AGENT } }
  );
  
  if (!response.ok) throw new Error(`Wikimedia API failed: ${response.status}`);
  const data = await response.json();
  const pages = data.query?.pages || {};
  
  return Object.values(pages)
    .filter((p: any) => p.imageinfo?.[0]?.thumburl)
    .slice(0, limit)
    .map((p: any) => {
      const info = p.imageinfo[0];
      const meta = info.extmetadata || {};
      return {
        id: p.pageid,
        url: info.thumburl,
        thumb: info.thumburl,
        fullUrl: info.url,
        alt: meta.ImageDescription?.value?.replace(/<[^>]*>/g, '') || p.title,
        credit: meta.Artist?.value?.replace(/<[^>]*>/g, '') || 'Wikimedia Commons',
        license: meta.LicenseShortName?.value || 'Unknown',
      };
    });
}

// ============ WEATHER ============

export async function getWeather(lat: number, lon: number) {
  // Using Open-Meteo (completely free, no API key)
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode&timezone=auto&forecast_days=7`,
    { next: { revalidate: 3600 } }
  );
  
  if (!response.ok) throw new Error(`Open-Meteo API failed: ${response.status}`);
  return response.json();
}

export async function getClimateData(lat: number, lon: number) {
  // Get historical climate averages
  const currentYear = new Date().getFullYear();
  const startDate = `${currentYear - 1}-01-01`;
  const endDate = `${currentYear - 1}-12-31`;
  
  const response = await fetch(
    `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=${startDate}&end_date=${endDate}&daily=temperature_2m_mean,precipitation_sum,weathercode&timezone=auto`,
    { next: { revalidate: 86400 * 30 } } // Cache for a month
  );
  
  if (!response.ok) throw new Error(`Open-Meteo Archive API failed: ${response.status}`);
  return response.json();
}

// ============ CURRENCY ============

export async function getExchangeRates(baseCurrency: string = 'USD') {
  const response = await fetch(
    `https://api.frankfurter.app/latest?from=${baseCurrency}`,
    { next: { revalidate: 3600 } }
  );
  
  if (!response.ok) throw new Error(`Frankfurter API failed: ${response.status}`);
  return response.json();
}

export async function convertCurrency(amount: number, from: string, to: string) {
  const response = await fetch(
    `https://api.frankfurter.app/latest?amount=${amount}&from=${from}&to=${to}`,
    { next: { revalidate: 3600 } }
  );
  
  if (!response.ok) throw new Error(`Currency conversion failed: ${response.status}`);
  return response.json();
}

// ============ TRAVEL SAFETY ============

export async function getTravelAdvisory(countryCode?: string) {
  const url = countryCode 
    ? `https://www.travel-advisory.info/api?countrycode=${countryCode}`
    : 'https://www.travel-advisory.info/api';
    
  const response = await fetch(url, { next: { revalidate: 86400 } });
  
  if (!response.ok) throw new Error(`Travel Advisory API failed: ${response.status}`);
  return response.json();
}

export async function getUKTravelAdvice(country: string) {
  const slug = country.toLowerCase().replace(/\s+/g, '-');
  const response = await fetch(
    `https://www.gov.uk/api/content/foreign-travel-advice/${slug}`,
    { next: { revalidate: 86400 } }
  );
  
  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error(`UK FCDO API failed: ${response.status}`);
  }
  return response.json();
}

// ============ WEB SEARCH (DuckDuckGo) ============

export async function webSearch(query: string) {
  // DuckDuckGo Instant Answer API - can return empty responses
  try {
    const response = await fetch(
      `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`,
      { 
        headers: { 'User-Agent': USER_AGENT },
        signal: AbortSignal.timeout(5000) // 5 second timeout
      }
    );
    
    if (!response.ok) {
      console.log(`DuckDuckGo returned ${response.status}, skipping`);
      return null;
    }
    
    const text = await response.text();
    if (!text || text.trim() === '') {
      console.log('DuckDuckGo returned empty response, skipping');
      return null;
    }
    
    const data = JSON.parse(text);
    
    return {
      abstract: data.Abstract || null,
      abstractSource: data.AbstractSource || null,
      abstractURL: data.AbstractURL || null,
      image: data.Image || null,
      heading: data.Heading || null,
      relatedTopics: data.RelatedTopics?.slice(0, 5).map((t: any) => ({
        text: t.Text,
        url: t.FirstURL,
      })) || [],
      type: data.Type || null,
    };
  } catch (error: any) {
    console.log(`DuckDuckGo search failed: ${error.message}, skipping`);
    return null;
  }
}

// ============ AIRPORTS ============

export async function searchAirports(lat: number, lon: number, radius: number = 100000) {
  const query = `
    [out:json][timeout:30];
    (
      node["aeroway"="aerodrome"]["iata"](around:${radius},${lat},${lon});
      way["aeroway"="aerodrome"]["iata"](around:${radius},${lat},${lon});
    );
    out body center 20;
  `;

  const data = await overpassQuery(query);
  
  return data.elements.map((el: any) => ({
    name: el.tags?.name || el.tags?.['name:en'],
    iata: el.tags?.iata,
    icao: el.tags?.icao,
    lat: el.lat || el.center?.lat,
    lon: el.lon || el.center?.lon,
    type: el.tags?.aeroway,
    international: el.tags?.['aerodrome:type'] === 'international',
  })).filter((a: any) => a.iata);
}

// ============ PUBLIC TRANSIT ============

export async function searchTransitStops(lat: number, lon: number, radius: number = 1000) {
  const query = `
    [out:json][timeout:30];
    (
      node["public_transport"="station"](around:${radius},${lat},${lon});
      node["railway"="station"](around:${radius},${lat},${lon});
      node["amenity"="bus_station"](around:${radius},${lat},${lon});
    );
    out body 50;
  `;

  const data = await overpassQuery(query);
  
  return data.elements.map((el: any) => ({
    name: el.tags?.name,
    type: el.tags?.railway || el.tags?.public_transport || el.tags?.amenity,
    lat: el.lat,
    lon: el.lon,
    operator: el.tags?.operator,
    network: el.tags?.network,
  })).filter((s: any) => s.name);
}

// ============ NEIGHBORHOODS / DISTRICTS ============

export async function searchNeighborhoods(lat: number, lon: number, radius: number = 10000) {
  const query = `
    [out:json][timeout:30];
    (
      node["place"~"suburb|neighbourhood|quarter"](around:${radius},${lat},${lon});
    );
    out body 30;
  `;

  const data = await overpassQuery(query);
  
  return data.elements.map((el: any) => ({
    name: el.tags?.name || el.tags?.['name:en'],
    type: el.tags?.place,
    lat: el.lat,
    lon: el.lon,
    wikipedia: el.tags?.wikipedia,
    wikidata: el.tags?.wikidata,
  })).filter((n: any) => n.name);
}

// ============ HELPER: Get comprehensive destination data ============

export async function getDestinationOverview(destination: string) {
  console.log(`[API] Starting comprehensive research for: ${destination}`);
  
  const results: Record<string, any> = {};
  const errors: string[] = [];

  // 1. Geocode the destination
  try {
    console.log('[API] Geocoding destination...');
    const geoData = await geocodeLocation(destination);
    if (geoData && geoData.length > 0) {
      results.location = geoData[0];
      console.log(`[API] Found location: ${results.location.display_name}`);
    }
  } catch (e: any) {
    errors.push(`Geocoding: ${e.message}`);
  }

  // 2. Get country info if it's a country
  try {
    console.log('[API] Fetching country info...');
    const countryInfo = await getCountryInfo(destination);
    if (countryInfo) {
      results.country = countryInfo;
      console.log(`[API] Found country: ${countryInfo.name}`);
    }
  } catch (e: any) {
    errors.push(`Country info: ${e.message}`);
  }

  // 3. Get Wikipedia summary
  try {
    console.log('[API] Fetching Wikipedia summary...');
    const wikiSummary = await getWikipediaSummary(destination);
    if (wikiSummary) {
      results.wikipedia = wikiSummary;
      console.log(`[API] Found Wikipedia article: ${wikiSummary.title}`);
    }
  } catch (e: any) {
    errors.push(`Wikipedia: ${e.message}`);
  }

  // 4. Get images
  try {
    console.log('[API] Searching for images...');
    const images = await searchImages(destination, 10);
    results.images = images;
    console.log(`[API] Found ${images.length} images`);
  } catch (e: any) {
    errors.push(`Images: ${e.message}`);
  }

  // 5. If we have coordinates, get more data
  if (results.location || results.country) {
    const lat = results.location?.lat || results.country?.latlng?.[0];
    const lon = results.location?.lon || results.country?.latlng?.[1];
    
    if (lat && lon) {
      // Get weather
      try {
        console.log('[API] Fetching weather data...');
        results.weather = await getWeather(parseFloat(lat), parseFloat(lon));
        console.log('[API] Weather data fetched');
      } catch (e: any) {
        errors.push(`Weather: ${e.message}`);
      }

      // Get attractions
      try {
        console.log('[API] Searching for attractions...');
        results.attractions = await searchPlaces(parseFloat(lat), parseFloat(lon), 20000, 'attractions');
        console.log(`[API] Found ${results.attractions?.length || 0} attractions`);
      } catch (e: any) {
        errors.push(`Attractions: ${e.message}`);
      }

      // Get airports
      try {
        console.log('[API] Searching for airports...');
        results.airports = await searchAirports(parseFloat(lat), parseFloat(lon));
        console.log(`[API] Found ${results.airports?.length || 0} airports`);
      } catch (e: any) {
        errors.push(`Airports: ${e.message}`);
      }
    }
  }

  // 6. Get travel advisory
  if (results.country?.cca2) {
    try {
      console.log('[API] Fetching travel advisory...');
      results.travelAdvisory = await getTravelAdvisory(results.country.cca2);
      console.log('[API] Travel advisory fetched');
    } catch (e: any) {
      errors.push(`Travel advisory: ${e.message}`);
    }
  }

  // 7. Get exchange rates
  if (results.country?.currencies?.[0]?.code) {
    try {
      console.log('[API] Fetching exchange rates...');
      results.exchangeRates = await getExchangeRates('USD');
      console.log('[API] Exchange rates fetched');
    } catch (e: any) {
      errors.push(`Exchange rates: ${e.message}`);
    }
  }

  console.log(`[API] Research complete. Errors: ${errors.length}`);
  if (errors.length > 0) {
    console.log('[API] Errors encountered:', errors);
  }

  return { results, errors };
}
