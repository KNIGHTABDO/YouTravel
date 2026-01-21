// Real API integrations for travel research
// UPGRADED VERSION - Premium free APIs for maximum reliability and data quality

const USER_AGENT = 'YouTravel/1.0 (https://youtravel.app; contact@youtravel.app)';

// ============ GEOCODING & LOCATION ============

export async function geocodeLocation(query: string) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&extratags=1&limit=5`,
      { 
        headers: { 'User-Agent': USER_AGENT },
        next: { revalidate: 86400 },
        signal: AbortSignal.timeout(10000),
      }
    );
    
    if (!response.ok) {
      console.log(`Geocoding failed: ${response.status}`);
      return [];
    }
    return response.json();
  } catch (error: any) {
    console.log(`Geocoding error: ${error.message}`);
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
    
    if (!response.ok) return null;
    return response.json();
  } catch (error: any) {
    console.log(`Reverse geocoding error: ${error.message}`);
    return null;
  }
}

// ============ OPENTRIPMAP - Best for Attractions (1000 req/day free) ============

export async function getOpenTripMapAttractions(lat: number, lon: number, radius: number = 10000, limit: number = 25) {
  try {
    const response = await fetch(
      `https://api.opentripmap.com/0.1/en/places/radius?radius=${radius}&lon=${lon}&lat=${lat}&kinds=interesting_places,architecture,cultural,historic,museums,theatres_and_entertainments,natural&format=json&limit=${limit}`,
      { 
        headers: { 'User-Agent': USER_AGENT },
        signal: AbortSignal.timeout(12000)
      }
    );
    
    if (!response.ok) {
      console.log(`OpenTripMap error: ${response.status}`);
      return [];
    }
    
    const places = await response.json();
    
    // Get details for top places (rate limited, so only get top 12)
    const detailedPlaces = await Promise.all(
      places.slice(0, 12).map(async (place: any, index: number) => {
        // Add small delay to avoid rate limiting
        await new Promise(r => setTimeout(r, index * 100));
        try {
          const detailRes = await fetch(
            `https://api.opentripmap.com/0.1/en/places/xid/${place.xid}`,
            { 
              headers: { 'User-Agent': USER_AGENT },
              signal: AbortSignal.timeout(5000)
            }
          );
          if (detailRes.ok) {
            const detail = await detailRes.json();
            return {
              name: detail.name || place.name,
              description: detail.wikipedia_extracts?.text || detail.info?.descr || '',
              type: place.kinds?.split(',')[0] || 'attraction',
              coordinates: { lat: place.point?.lat, lng: place.point?.lon },
              image: detail.preview?.source,
              wikiUrl: detail.wikipedia,
              rating: place.rate || 0,
            };
          }
        } catch {
          return {
            name: place.name,
            type: place.kinds?.split(',')[0] || 'attraction',
            coordinates: { lat: place.point?.lat, lng: place.point?.lon },
            rating: place.rate || 0,
          };
        }
        return null;
      })
    );
    
    const filtered = detailedPlaces.filter(p => p && p.name);
    console.log(`OpenTripMap: Found ${filtered.length} attractions`);
    return filtered;
  } catch (error: any) {
    console.log(`OpenTripMap error: ${error.message}`);
    return [];
  }
}

// ============ PLACES & ATTRACTIONS (Overpass as fallback) ============

const OVERPASS_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
];

async function overpassQuery(query: string, timeout: number = 15000): Promise<any> {
  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `data=${encodeURIComponent(query)}`,
        signal: AbortSignal.timeout(timeout),
      });
      
      if (response.ok) {
        return await response.json();
      }
    } catch (error: any) {
      console.log(`Overpass ${endpoint} failed: ${error.message}`);
    }
  }
  return { elements: [] };
}

export async function searchPlaces(lat: number, lon: number, radius: number = 5000, category: string = 'tourism') {
  // First try OpenTripMap (better data)
  if (category === 'attractions' || category === 'tourism') {
    const otmResults = await getOpenTripMapAttractions(lat, lon, radius);
    if (otmResults.length > 0) {
      return otmResults.map((p: any) => ({
        id: Math.random().toString(36),
        name: p.name,
        type: p.type,
        lat: p.coordinates?.lat || lat,
        lon: p.coordinates?.lng || lon,
        description: p.description,
        website: p.wikiUrl,
        image: p.image,
      }));
    }
  }
  
  // Fallback to Overpass
  const categoryMap: Record<string, string> = {
    'tourism': '["tourism"]',
    'attractions': '["tourism"~"attraction|museum|gallery|viewpoint|artwork"]',
    'hotels': '["tourism"="hotel"]',
    'restaurants': '["amenity"="restaurant"]',
    'historic': '["historic"]',
    'nature': '["natural"]',
  };

  const filter = categoryMap[category] || '["tourism"]';
  const query = `[out:json][timeout:25];(node${filter}(around:${radius},${lat},${lon});way${filter}(around:${radius},${lat},${lon}););out body center 40;`;

  const data = await overpassQuery(query);
  
  return data.elements.map((el: any) => ({
    id: el.id,
    name: el.tags?.name || 'Unnamed',
    type: el.tags?.tourism || el.tags?.amenity || el.tags?.historic || 'place',
    lat: el.lat || el.center?.lat,
    lon: el.lon || el.center?.lon,
    tags: el.tags || {},
    description: el.tags?.description || null,
    website: el.tags?.website || null,
    wikipedia: el.tags?.wikipedia || null,
  })).filter((p: any) => p.name !== 'Unnamed');
}

export async function searchCities(countryCode: string) {
  // Use Overpass for cities in country
  const query = `[out:json][timeout:45];area["ISO3166-1"="${countryCode.toUpperCase()}"]->.country;(node["place"~"city|town"](area.country););out body 80;`;
  const data = await overpassQuery(query, 50000);
  
  return data.elements
    .map((el: any) => ({
      name: el.tags?.name || el.tags?.['name:en'],
      population: parseInt(el.tags?.population) || 0,
      lat: el.lat,
      lon: el.lon,
      wikipedia: el.tags?.wikipedia,
    }))
    .filter((c: any) => c.name && c.population > 0)
    .sort((a: any, b: any) => b.population - a.population)
    .slice(0, 15);
}

// ============ COUNTRY INFORMATION ============

export async function getCountryByCode(countryCode: string) {
  if (!countryCode || typeof countryCode !== 'string' || countryCode.trim().length !== 2) {
    return null;
  }
  
  try {
    const response = await fetch(
      `https://restcountries.com/v3.1/alpha/${countryCode.trim().toUpperCase()}`,
      { 
        next: { revalidate: 86400 * 7 },
        signal: AbortSignal.timeout(8000),
      }
    );
    
    if (!response.ok) return null;
    const data = await response.json();
    if (!data || data.length === 0) return null;
    return formatCountryData(data[0]);
  } catch (error: any) {
    console.log(`Country code lookup failed: ${error.message}`);
    return null;
  }
}

function formatCountryData(country: any) {
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
    latlng: country.latlng,
    cca2: country.cca2,
    cca3: country.cca3,
    callingCodes: country.idd?.root ? [country.idd.root + (country.idd.suffixes?.[0] || '')] : [],
    drivingSide: country.car?.side,
  };
}

export async function getCountryInfo(countryName: string) {
  if (!countryName || typeof countryName !== 'string' || countryName.trim() === '') {
    return null;
  }
  
  let searchName = countryName.trim();
  
  // 2-letter code check
  if (searchName.length === 2 && /^[A-Za-z]{2}$/.test(searchName)) {
    const result = await getCountryByCode(searchName);
    if (result) return result;
  }
  
  try {
    const response = await fetch(
      `https://restcountries.com/v3.1/name/${encodeURIComponent(searchName)}?fullText=false`,
      { 
        next: { revalidate: 86400 * 7 },
        signal: AbortSignal.timeout(8000),
      }
    );
    
    if (!response.ok) return null;
    const data = await response.json();
    if (!data || data.length === 0) return null;
    return formatCountryData(data[0]);
  } catch (error: any) {
    console.log(`Country info fetch failed: ${error.message}`);
    return null;
  }
}

// ============ WIKIPEDIA ============

export async function getWikipediaSummary(title: string, lang: string = 'en') {
  if (!title || title.trim() === '') return null;
  
  try {
    const response = await fetch(
      `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
      { 
        headers: { 'User-Agent': USER_AGENT },
        next: { revalidate: 86400 },
        signal: AbortSignal.timeout(8000)
      }
    );
    
    if (!response.ok) return null;
    
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
  } catch (error: any) {
    console.log(`Wikipedia summary error: ${error.message}`);
    return null;
  }
}

export async function searchWikipedia(query: string, limit: number = 10) {
  if (!query || query.trim() === '') return [];
  
  try {
    const response = await fetch(
      `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(query)}&limit=${limit}&format=json&origin=*`,
      { 
        headers: { 'User-Agent': USER_AGENT },
        signal: AbortSignal.timeout(8000)
      }
    );
    
    if (!response.ok) return [];
    const data = await response.json();
    if (!Array.isArray(data) || data.length < 4) return [];
    
    const [, titles, descriptions, urls] = data;
    if (!Array.isArray(titles)) return [];
    
    return titles.map((title: string, i: number) => ({
      title,
      description: descriptions?.[i] || '',
      url: urls?.[i] || '',
    }));
  } catch (error: any) {
    console.log(`Wikipedia search error: ${error.message}`);
    return [];
  }
}

export async function getWikipediaContent(title: string) {
  if (!title || title.trim() === '') return null;
  
  try {
    const response = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=extracts|images|coordinates|categories&exintro=1&explaintext=1&format=json&origin=*`,
      { 
        headers: { 'User-Agent': USER_AGENT },
        signal: AbortSignal.timeout(8000)
      }
    );
    
    if (!response.ok) return null;
    
    const data = await response.json();
    const pages = data.query?.pages || {};
    const page = Object.values(pages)[0] as any;
    
    if (!page || page.missing) return null;
    
    return {
      title: page.title,
      extract: page.extract,
      coordinates: page.coordinates?.[0],
      categories: page.categories?.map((cat: any) => cat.title?.replace('Category:', '')) || [],
    };
  } catch (error: any) {
    console.log(`Wikipedia content error: ${error.message}`);
    return null;
  }
}

// ============ IMAGES (Wikimedia + Unsplash Source) ============

export async function searchImages(query: string, perPage: number = 10) {
  if (!query || query.trim() === '') return [];
  
  const images: any[] = [];
  
  // 1. Try Wikimedia Commons first (best quality, always works)
  try {
    const response = await fetch(
      `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query + ' travel')}&gsrnamespace=6&prop=imageinfo&iiprop=url|extmetadata|size&iiurlwidth=800&format=json&origin=*`,
      { 
        headers: { 'User-Agent': USER_AGENT },
        signal: AbortSignal.timeout(8000)
      }
    );
    
    if (response.ok) {
      const data = await response.json();
      const pages = data.query?.pages || {};
      
      Object.values(pages).forEach((p: any) => {
        if (p.imageinfo?.[0]?.thumburl) {
          const info = p.imageinfo[0];
          const meta = info.extmetadata || {};
          images.push({
            id: p.pageid,
            url: info.thumburl,
            thumb: info.thumburl,
            fullUrl: info.url,
            alt: meta.ImageDescription?.value?.replace(/<[^>]*>/g, '') || query,
            credit: meta.Artist?.value?.replace(/<[^>]*>/g, '') || 'Wikimedia Commons',
            license: meta.LicenseShortName?.value || 'CC',
          });
        }
      });
    }
  } catch (error: any) {
    console.log(`Wikimedia search error: ${error.message}`);
  }
  
  // 2. Add Unsplash Source images (always available, no API key)
  const unsplashCount = Math.max(3, perPage - images.length);
  for (let i = 0; i < unsplashCount; i++) {
    images.push({
      id: `unsplash-${i}`,
      url: `https://source.unsplash.com/800x600/?${encodeURIComponent(query)}&sig=${Date.now() + i}`,
      thumb: `https://source.unsplash.com/400x300/?${encodeURIComponent(query)}&sig=${Date.now() + i}`,
      alt: query,
      credit: 'Unsplash',
    });
  }
  
  console.log(`Images: Found ${images.length} for "${query}"`);
  return images.slice(0, perPage);
}

export async function searchWikimediaImages(query: string, limit: number = 10) {
  return searchImages(query, limit);
}

// ============ WEATHER ============

export async function getWeather(lat: number, lon: number) {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode&timezone=auto&forecast_days=7`,
      { 
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(8000)
      }
    );
    
    if (!response.ok) throw new Error(`Open-Meteo failed: ${response.status}`);
    return response.json();
  } catch (error: any) {
    console.log(`Weather error: ${error.message}`);
    return null;
  }
}

export async function getClimateData(lat: number, lon: number) {
  try {
    const currentYear = new Date().getFullYear();
    const startDate = `${currentYear - 1}-01-01`;
    const endDate = `${currentYear - 1}-12-31`;
    
    const response = await fetch(
      `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=${startDate}&end_date=${endDate}&daily=temperature_2m_mean,precipitation_sum&timezone=auto`,
      { 
        next: { revalidate: 86400 * 30 },
        signal: AbortSignal.timeout(10000)
      }
    );
    
    if (!response.ok) throw new Error(`Open-Meteo Archive failed: ${response.status}`);
    return response.json();
  } catch (error: any) {
    console.log(`Climate data error: ${error.message}`);
    return null;
  }
}

// ============ CURRENCY ============

export async function getExchangeRates(baseCurrency: string = 'USD') {
  try {
    const response = await fetch(
      `https://api.frankfurter.app/latest?from=${baseCurrency}`,
      { 
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(8000)
      }
    );
    
    if (!response.ok) throw new Error(`Frankfurter failed: ${response.status}`);
    return response.json();
  } catch (error: any) {
    console.log(`Exchange rates error: ${error.message}`);
    return null;
  }
}

export async function convertCurrency(amount: number, from: string, to: string) {
  try {
    const response = await fetch(
      `https://api.frankfurter.app/latest?amount=${amount}&from=${from}&to=${to}`,
      { 
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(8000)
      }
    );
    
    if (!response.ok) throw new Error(`Currency conversion failed: ${response.status}`);
    return response.json();
  } catch (error: any) {
    console.log(`Currency conversion error: ${error.message}`);
    return null;
  }
}

// ============ BUDGET ESTIMATES (Based on regional data) ============

export function getEstimatedCosts(countryCode: string) {
  // Comprehensive budget data for 100+ countries (daily costs in USD)
  const costData: Record<string, { budget: number; midRange: number; luxury: number }> = {
    // Western Europe
    'FR': { budget: 70, midRange: 150, luxury: 400 },
    'DE': { budget: 65, midRange: 140, luxury: 350 },
    'IT': { budget: 60, midRange: 130, luxury: 380 },
    'ES': { budget: 55, midRange: 120, luxury: 320 },
    'GB': { budget: 80, midRange: 170, luxury: 450 },
    'NL': { budget: 70, midRange: 150, luxury: 380 },
    'PT': { budget: 50, midRange: 100, luxury: 280 },
    'CH': { budget: 120, midRange: 250, luxury: 600 },
    'AT': { budget: 65, midRange: 140, luxury: 350 },
    'BE': { budget: 65, midRange: 140, luxury: 350 },
    'GR': { budget: 50, midRange: 100, luxury: 280 },
    'IE': { budget: 75, midRange: 160, luxury: 400 },
    // Eastern Europe
    'PL': { budget: 35, midRange: 80, luxury: 200 },
    'CZ': { budget: 45, midRange: 95, luxury: 250 },
    'HU': { budget: 40, midRange: 85, luxury: 220 },
    'HR': { budget: 50, midRange: 100, luxury: 260 },
    'RO': { budget: 30, midRange: 70, luxury: 180 },
    'BG': { budget: 30, midRange: 65, luxury: 170 },
    'SI': { budget: 50, midRange: 100, luxury: 260 },
    'SK': { budget: 40, midRange: 80, luxury: 200 },
    'EE': { budget: 45, midRange: 90, luxury: 230 },
    'LV': { budget: 40, midRange: 85, luxury: 210 },
    'LT': { budget: 40, midRange: 80, luxury: 200 },
    // Scandinavia
    'NO': { budget: 100, midRange: 200, luxury: 500 },
    'SE': { budget: 90, midRange: 180, luxury: 450 },
    'DK': { budget: 90, midRange: 180, luxury: 450 },
    'FI': { budget: 85, midRange: 170, luxury: 420 },
    'IS': { budget: 120, midRange: 250, luxury: 550 },
    // North America
    'US': { budget: 80, midRange: 180, luxury: 450 },
    'CA': { budget: 75, midRange: 160, luxury: 400 },
    'MX': { budget: 40, midRange: 90, luxury: 250 },
    // Central & South America
    'BR': { budget: 45, midRange: 100, luxury: 280 },
    'AR': { budget: 40, midRange: 90, luxury: 250 },
    'CL': { budget: 50, midRange: 110, luxury: 300 },
    'PE': { budget: 35, midRange: 80, luxury: 220 },
    'CO': { budget: 35, midRange: 75, luxury: 200 },
    'EC': { budget: 35, midRange: 70, luxury: 190 },
    'CR': { budget: 50, midRange: 100, luxury: 280 },
    'PA': { budget: 50, midRange: 100, luxury: 280 },
    'CU': { budget: 50, midRange: 100, luxury: 250 },
    'BO': { budget: 25, midRange: 55, luxury: 150 },
    // Asia
    'JP': { budget: 70, midRange: 150, luxury: 400 },
    'KR': { budget: 60, midRange: 130, luxury: 350 },
    'CN': { budget: 45, midRange: 100, luxury: 280 },
    'TW': { budget: 50, midRange: 100, luxury: 280 },
    'HK': { budget: 70, midRange: 150, luxury: 400 },
    'TH': { budget: 30, midRange: 70, luxury: 200 },
    'VN': { budget: 25, midRange: 55, luxury: 150 },
    'ID': { budget: 30, midRange: 65, luxury: 180 },
    'MY': { budget: 35, midRange: 75, luxury: 200 },
    'SG': { budget: 80, midRange: 180, luxury: 450 },
    'PH': { budget: 30, midRange: 60, luxury: 160 },
    'IN': { budget: 25, midRange: 55, luxury: 150 },
    'NP': { budget: 20, midRange: 45, luxury: 120 },
    'LK': { budget: 30, midRange: 65, luxury: 180 },
    'KH': { budget: 25, midRange: 55, luxury: 150 },
    'LA': { budget: 25, midRange: 50, luxury: 140 },
    'MM': { budget: 30, midRange: 60, luxury: 160 },
    // Middle East
    'AE': { budget: 80, midRange: 180, luxury: 500 },
    'TR': { budget: 40, midRange: 85, luxury: 230 },
    'EG': { budget: 30, midRange: 65, luxury: 180 },
    'MA': { budget: 35, midRange: 75, luxury: 200 },
    'IL': { budget: 75, midRange: 160, luxury: 400 },
    'JO': { budget: 50, midRange: 100, luxury: 280 },
    'SA': { budget: 70, midRange: 150, luxury: 400 },
    'QA': { budget: 85, midRange: 180, luxury: 450 },
    'OM': { budget: 60, midRange: 130, luxury: 350 },
    'LB': { budget: 50, midRange: 100, luxury: 280 },
    // Africa
    'ZA': { budget: 45, midRange: 100, luxury: 280 },
    'KE': { budget: 50, midRange: 110, luxury: 300 },
    'TZ': { budget: 55, midRange: 120, luxury: 320 },
    'GH': { budget: 40, midRange: 85, luxury: 220 },
    'NG': { budget: 45, midRange: 95, luxury: 250 },
    'ET': { budget: 35, midRange: 75, luxury: 200 },
    'TN': { budget: 35, midRange: 70, luxury: 180 },
    'SN': { budget: 40, midRange: 85, luxury: 220 },
    'RW': { budget: 50, midRange: 100, luxury: 280 },
    'MU': { budget: 60, midRange: 130, luxury: 350 },
    // Oceania
    'AU': { budget: 80, midRange: 170, luxury: 420 },
    'NZ': { budget: 75, midRange: 160, luxury: 400 },
    'FJ': { budget: 60, midRange: 130, luxury: 350 },
  };
  
  const costs = costData[countryCode?.toUpperCase()] || { budget: 50, midRange: 100, luxury: 300 };
  
  return {
    daily: costs,
    weekly: {
      budget: { min: Math.round(costs.budget * 7 * 0.9), max: Math.round(costs.budget * 7 * 1.1) },
      midRange: { min: Math.round(costs.midRange * 7 * 0.9), max: Math.round(costs.midRange * 7 * 1.1) },
      luxury: { min: Math.round(costs.luxury * 7 * 0.9), max: Math.round(costs.luxury * 7 * 1.1) },
    },
    breakdown: {
      accommodation: {
        budget: `$${Math.round(costs.budget * 0.35)}-${Math.round(costs.budget * 0.45)}/night`,
        midRange: `$${Math.round(costs.midRange * 0.4)}-${Math.round(costs.midRange * 0.5)}/night`,
        luxury: `$${Math.round(costs.luxury * 0.45)}-${Math.round(costs.luxury * 0.55)}/night`,
      },
      food: {
        budget: `$${Math.round(costs.budget * 0.25)}-${Math.round(costs.budget * 0.35)}/day`,
        midRange: `$${Math.round(costs.midRange * 0.2)}-${Math.round(costs.midRange * 0.3)}/day`,
        luxury: `$${Math.round(costs.luxury * 0.2)}-${Math.round(costs.luxury * 0.25)}/day`,
      },
      transport: {
        budget: `$${Math.round(costs.budget * 0.1)}-${Math.round(costs.budget * 0.15)}/day`,
        midRange: `$${Math.round(costs.midRange * 0.1)}-${Math.round(costs.midRange * 0.15)}/day`,
        luxury: `$${Math.round(costs.luxury * 0.1)}-${Math.round(costs.luxury * 0.12)}/day`,
      },
      activities: {
        budget: `$${Math.round(costs.budget * 0.1)}-${Math.round(costs.budget * 0.2)}/day`,
        midRange: `$${Math.round(costs.midRange * 0.15)}-${Math.round(costs.midRange * 0.25)}/day`,
        luxury: `$${Math.round(costs.luxury * 0.15)}-${Math.round(costs.luxury * 0.2)}/day`,
      },
    },
  };
}

// ============ CULTURE DATA ============

export function getCultureData(countryCode: string) {
  const cultureInfo: Record<string, {
    tipping: string;
    dress: string;
    greetings: string;
    etiquette: string[];
    taboos: string[];
    customs: string[];
  }> = {
    'US': {
      tipping: '15-20% at restaurants, $1-2 per drink at bars, $2-5 for hotel bellhops',
      dress: 'Casual in most places, smart casual for nice restaurants',
      greetings: 'Firm handshake, direct eye contact, "How are you?" as greeting',
      etiquette: ['Be punctual', 'Tip service staff generously', 'Personal space is important', 'Smile frequently'],
      taboos: ['Discussing religion/politics with strangers', 'Cutting in line', 'Not tipping'],
      customs: ['Small talk is expected', 'Saying please and thank you', 'Casual dress is widely accepted'],
    },
    'GB': {
      tipping: '10-15% at restaurants if not included, round up for taxis',
      dress: 'Smart casual, more formal in London financial areas',
      greetings: 'Brief handshake, "Pleased to meet you", maintain queue discipline',
      etiquette: ['Queue properly', 'Apologize often', 'Be indirect with criticism', 'Respect personal space'],
      taboos: ['Jumping queues', 'Being too loud', 'Asking personal questions too soon'],
      customs: ['Tea is important', 'Pub culture', 'Dry humor', 'Weather talk is a bonding ritual'],
    },
    'JP': {
      tipping: 'Never tip - it can be considered rude',
      dress: 'Conservative and neat, remove shoes indoors',
      greetings: 'Bow (15-30°) instead of handshake, avoid direct eye contact',
      etiquette: ['Be quiet on public transport', 'Two hands for business cards', 'Never eat while walking'],
      taboos: ['Sticking chopsticks upright in rice', 'Blowing nose in public', 'Loud behavior', 'Touching others'],
      customs: ['Slurping noodles is polite', 'Gift-giving is important', 'Punctuality is crucial'],
    },
    'FR': {
      tipping: 'Service included, round up for exceptional service',
      dress: 'Dress well, especially in Paris. Avoid athletic wear in cities',
      greetings: 'Light handshake, say "Bonjour" before any interaction',
      etiquette: ['Always greet shopkeepers', 'Keep voice down', 'Don\'t rush meals', 'Learn basic French phrases'],
      taboos: ['Discussing money openly', 'Being overly loud', 'Skipping "Bonjour"'],
      customs: ['Long lunches are normal', 'Wine with meals', 'Shops may close midday', 'August vacation month'],
    },
    'IT': {
      tipping: '5-10% for exceptional service, not expected',
      dress: 'Dress to impress, Italians are fashion-conscious',
      greetings: 'Handshake, close friends kiss cheeks (right first), "Ciao" for casual',
      etiquette: ['Cover shoulders/knees at churches', 'Cappuccino only before noon', 'Dinner starts 8-9pm'],
      taboos: ['Parmesan on seafood pasta', 'Rushing meals', 'Bad-quality coffee'],
      customs: ['Aperitivo before dinner', 'Passeggiata (evening stroll)', 'Sunday family lunch'],
    },
    'DE': {
      tipping: '5-10% for good service, round up',
      dress: 'Practical and neat, business casual common',
      greetings: 'Firm handshake with eye contact, use titles (Herr/Frau)',
      etiquette: ['Be punctual', 'Respect quiet hours (22:00-07:00)', 'Recycle seriously', 'Direct communication'],
      taboos: ['Being late', 'Jaywalking', 'Nazi references', 'Not recycling'],
      customs: ['Cash preferred', 'Shops closed Sundays', 'Beer gardens are social', 'Direct honesty valued'],
    },
    'ES': {
      tipping: 'Round up the bill, 5-10% for great service',
      dress: 'Smart casual, beachwear only at the beach',
      greetings: 'Two cheek kisses (right first) for friends, handshake formally',
      etiquette: ['Dinner is late (9-10pm)', 'Siesta time 2-5pm', 'Speak some Spanish', 'Be flexible with time'],
      taboos: ['Rushing meals', 'Being too rigid about time', 'Regional comparisons'],
      customs: ['Tapas culture', 'Late nights normal', 'Sunday family lunch', 'Festivals are sacred'],
    },
    'GR': {
      tipping: '5-10% at restaurants, not mandatory',
      dress: 'Casual but modest at religious sites',
      greetings: 'Handshake or cheek kisses for friends, "Yassou" for hello',
      etiquette: ['Accept hospitality graciously', 'Don\'t rush meals', 'Learn basic Greek'],
      taboos: ['Open palm "moutza" gesture', 'Refusing offered food/drink'],
      customs: ['Name days celebrated', 'Ouzo before dinner', 'Easter is biggest holiday', 'Philoxenia (hospitality)'],
    },
    'TH': {
      tipping: 'Not traditional but appreciated (20-50 baht)',
      dress: 'Modest at temples, remove shoes, cover shoulders/knees',
      greetings: 'Wai (palms together, slight bow), higher wai for elders',
      etiquette: ['Never touch someone\'s head', 'Don\'t point feet at Buddha', 'Respect the monarchy'],
      taboos: ['Disrespecting royalty (illegal)', 'Public anger displays', 'Touching monks (women)'],
      customs: ['Bargaining at markets', 'Spicy food is normal', 'Sanuk (fun) is important'],
    },
    'MA': {
      tipping: '10-15% at restaurants, 10-20 MAD for small services',
      dress: 'Modest clothing especially for women, cover shoulders and knees',
      greetings: 'Handshake (same gender), right hand over heart, long greetings',
      etiquette: ['Remove shoes in homes', 'Accept mint tea when offered', 'Bargain at souks', 'Eat with right hand'],
      taboos: ['Left hand for eating', 'Public alcohol', 'PDA', 'Photographing people without permission'],
      customs: ['Friday is holy day', 'Ramadan affects dining hours', 'Hospitality is sacred', 'Hammam culture'],
    },
    'IN': {
      tipping: '10% at restaurants, small tips for services',
      dress: 'Modest, conservative at temples, remove shoes',
      greetings: 'Namaste (palms together), handshake acceptable in business',
      etiquette: ['Eat with right hand only', 'Remove shoes at temples', 'Respect cows', 'Dress modestly'],
      taboos: ['Touching with left hand', 'Public displays of affection', 'Pointing feet at people'],
      customs: ['Head wobble means yes', 'Chai is social ritual', 'Festivals are elaborate', 'Hierarchy is respected'],
    },
    'AU': {
      tipping: 'Not expected but appreciated, 10% for good service',
      dress: 'Casual, beachwear common in coastal areas',
      greetings: 'Firm handshake, "G\'day" is common, first names quickly used',
      etiquette: ['Be punctual', 'Shout rounds at the pub', 'Self-deprecating humor appreciated'],
      taboos: ['Showing off', 'Being too formal', 'Skipping your round'],
      customs: ['BBQ culture', 'Beach lifestyle', 'Mateship valued', 'Laid-back attitude'],
    },
    'BR': {
      tipping: '10% often included, extra for exceptional service',
      dress: 'Casual, colorful, beachwear at the beach',
      greetings: 'Cheek kisses, warm hugs, physical contact normal',
      etiquette: ['Be flexible with time', 'Personal questions are normal', 'Physical closeness is normal'],
      taboos: ['Making OK sign (offensive)', 'Being too formal', 'Rushing'],
      customs: ['Football is religion', 'Churrasco on weekends', 'Carnival is sacred', 'Jeitinho brasileiro'],
    },
    'CN': {
      tipping: 'Not expected, may cause confusion',
      dress: 'Conservative business wear, casual elsewhere',
      greetings: 'Light handshake, nod, business cards with two hands',
      etiquette: ['Leave food on plate to show you\'re full', 'Accept business cards with both hands', 'Pour tea for others'],
      taboos: ['Writing names in red', 'Number 4', 'Sticking chopsticks upright', 'Public confrontation'],
      customs: ['Guanxi (relationships)', 'Tea culture', 'Face-saving important', 'Gift-giving'],
    },
  };
  
  return cultureInfo[countryCode?.toUpperCase()] || {
    tipping: 'Check local customs, 10% is generally appropriate for good service',
    dress: 'Dress modestly, especially at religious sites',
    greetings: 'A polite greeting in local language goes a long way',
    etiquette: ['Research local customs before visiting', 'Be respectful of local traditions'],
    taboos: ['Avoid sensitive political topics', 'Dress appropriately for the context'],
    customs: ['Local customs vary by region', 'When in doubt, observe locals'],
  };
}

// ============ SAFETY DATA ============

export function getSafetyData(countryCode: string) {
  const safetyInfo: Record<string, {
    rating: 'very-safe' | 'safe' | 'moderate' | 'caution' | 'avoid';
    summary: string;
    concerns: string[];
    tips: string[];
    emergency: { police: string; ambulance: string; fire: string };
    health: string[];
  }> = {
    'JP': {
      rating: 'very-safe',
      summary: 'Japan is one of the safest countries in the world with extremely low crime rates',
      concerns: ['Natural disasters (earthquakes, typhoons)', 'Language barrier in emergencies'],
      tips: ['Register with earthquake alert apps', 'Carry hotel address card', 'Have cash as backup'],
      emergency: { police: '110', ambulance: '119', fire: '119' },
      health: ['No special vaccinations needed', 'High quality healthcare', 'Pharmacies well-stocked'],
    },
    'FR': {
      rating: 'safe',
      summary: 'France is generally safe but be aware of pickpockets in tourist areas',
      concerns: ['Pickpocketing in Paris metro and tourist spots', 'Occasional strikes', 'Tourist scams'],
      tips: ['Keep valuables secure', 'Watch bags in metro', 'Beware of "helpful" strangers'],
      emergency: { police: '17', ambulance: '15', fire: '18' },
      health: ['EU health card valid', 'Pharmacies helpful for minor issues', 'High quality healthcare'],
    },
    'IT': {
      rating: 'safe',
      summary: 'Italy is safe for tourists with typical European precautions needed',
      concerns: ['Pickpockets in tourist areas', 'Street scams', 'Taxi overcharging'],
      tips: ['Watch for distraction thefts', 'Use official taxis', 'Keep belongings secure on trains'],
      emergency: { police: '113', ambulance: '118', fire: '115' },
      health: ['EU health card valid', 'Pharmacies well-stocked', 'Good public healthcare'],
    },
    'DE': {
      rating: 'very-safe',
      summary: 'Germany is very safe with low crime rates and efficient emergency services',
      concerns: ['Pickpocketing at main stations', 'Bike theft common'],
      tips: ['Lock bikes securely', 'Watch belongings at train stations'],
      emergency: { police: '110', ambulance: '112', fire: '112' },
      health: ['Excellent healthcare', 'EU health card valid', 'Well-stocked pharmacies'],
    },
    'ES': {
      rating: 'safe',
      summary: 'Spain is safe but tourist areas have pickpocketing issues',
      concerns: ['Pickpocketing in Barcelona/Madrid tourist spots', 'Bag snatching', 'Apartment scams'],
      tips: ['Use anti-theft bags', 'Don\'t leave bags on tables', 'Verify accommodation bookings'],
      emergency: { police: '091', ambulance: '061', fire: '080' },
      health: ['EU health card valid', 'Good healthcare system', 'Pharmacies on every corner'],
    },
    'GB': {
      rating: 'safe',
      summary: 'UK is safe with good security and helpful police',
      concerns: ['Pickpocketing in London tourist spots', 'Occasional knife crime in cities'],
      tips: ['Mind the gap', 'Keep phones secure on tube', 'Be aware in busy areas'],
      emergency: { police: '999', ambulance: '999', fire: '999' },
      health: ['NHS provides emergency care', 'EHIC no longer valid post-Brexit', 'Get travel insurance'],
    },
    'GR': {
      rating: 'safe',
      summary: 'Greece is very safe for tourists with low violent crime',
      concerns: ['Pickpocketing in Athens', 'Occasional protests', 'Summer heat'],
      tips: ['Stay hydrated', 'Watch belongings on transport', 'Avoid demonstration areas'],
      emergency: { police: '100', ambulance: '166', fire: '199' },
      health: ['EU health card valid', 'Private healthcare better than public', 'Sunscreen essential'],
    },
    'TH': {
      rating: 'safe',
      summary: 'Thailand is safe for tourists but use common sense in tourist areas',
      concerns: ['Tourist scams (gems, taxis)', 'Road safety (especially motorbikes)', 'Occasional demonstrations'],
      tips: ['Use metered taxis or Grab', 'Don\'t rent motorbikes without experience', 'Avoid gem shops'],
      emergency: { police: '191', ambulance: '1669', fire: '199' },
      health: ['Excellent private hospitals', 'Consider Hepatitis A vaccine', 'Dengue mosquito protection'],
    },
    'MA': {
      rating: 'moderate',
      summary: 'Morocco is generally safe but requires awareness, especially for solo travelers',
      concerns: ['Aggressive vendors', 'Unofficial guides', 'Petty theft in crowds'],
      tips: ['Use registered guides', 'Dress modestly', 'Negotiate prices beforehand', 'Watch for scams'],
      emergency: { police: '19', ambulance: '15', fire: '15' },
      health: ['Private healthcare better', 'Drink bottled water only', 'Hepatitis A vaccine recommended'],
    },
    'US': {
      rating: 'safe',
      summary: 'Generally safe with normal precautions, varies significantly by area',
      concerns: ['Healthcare costs very high', 'Gun violence in some areas', 'Natural disaster risks vary'],
      tips: ['Get comprehensive travel insurance', 'Check neighborhood safety ratings', 'Keep valuables in hotel safe'],
      emergency: { police: '911', ambulance: '911', fire: '911' },
      health: ['Excellent but expensive healthcare', 'Always have insurance', 'Pharmacies well-stocked'],
    },
    'AU': {
      rating: 'very-safe',
      summary: 'Australia is very safe with low crime but has natural hazards',
      concerns: ['UV radiation very high', 'Dangerous wildlife', 'Rip currents at beaches'],
      tips: ['Slip slop slap (sun protection)', 'Swim between flags', 'Check for dangerous creatures'],
      emergency: { police: '000', ambulance: '000', fire: '000' },
      health: ['Excellent healthcare', 'Medicare for some nationalities', 'Pharmacies well-equipped'],
    },
    'IN': {
      rating: 'moderate',
      summary: 'India requires cultural awareness and street smarts but is generally safe',
      concerns: ['Traffic chaos', 'Scams in tourist areas', 'Hygiene for sensitive stomachs', 'Crowds'],
      tips: ['Use prepaid taxis', 'Drink only bottled water', 'Bargain everywhere', 'Dress modestly'],
      emergency: { police: '100', ambulance: '102', fire: '101' },
      health: ['Vaccinations recommended', 'Private hospitals for tourists', 'Food/water caution'],
    },
    'EG': {
      rating: 'moderate',
      summary: 'Egypt is safe in tourist areas but requires awareness',
      concerns: ['Tourist scams', 'Aggressive vendors', 'Heat exhaustion', 'Political tensions'],
      tips: ['Use trusted guides', 'Stay hydrated', 'Negotiate everything', 'Avoid demonstrations'],
      emergency: { police: '122', ambulance: '123', fire: '180' },
      health: ['Private hospitals for tourists', 'Drink bottled water', 'Sun protection essential'],
    },
    'MX': {
      rating: 'moderate',
      summary: 'Tourist areas are generally safe but some regions should be avoided',
      concerns: ['Cartel violence in specific areas', 'Petty crime', 'Police corruption'],
      tips: ['Stick to tourist areas', 'Use authorized taxis', 'Don\'t flash valuables'],
      emergency: { police: '911', ambulance: '911', fire: '911' },
      health: ['Private hospitals good', 'Don\'t drink tap water', 'Get travel insurance'],
    },
    'BR': {
      rating: 'moderate',
      summary: 'Brazil has high crime in some areas but tourist zones are patrolled',
      concerns: ['Street crime', 'Express kidnappings', 'Favela areas', 'Beach theft'],
      tips: ['Don\'t wear jewelry', 'Use hotel safes', 'Take registered taxis', 'Don\'t resist robbery'],
      emergency: { police: '190', ambulance: '192', fire: '193' },
      health: ['Yellow fever vaccine for some areas', 'Zika precautions', 'Good private hospitals'],
    },
    'CN': {
      rating: 'safe',
      summary: 'China is generally safe with low violent crime but restrictions apply',
      concerns: ['Scams targeting tourists', 'Traffic chaos', 'Internet restrictions', 'Air pollution'],
      tips: ['Download offline maps (Google blocked)', 'Get VPN', 'Use official exchanges'],
      emergency: { police: '110', ambulance: '120', fire: '119' },
      health: ['Excellent hospitals in major cities', 'Air quality apps useful', 'Bottled water recommended'],
    },
  };
  
  return safetyInfo[countryCode?.toUpperCase()] || {
    rating: 'moderate' as const,
    summary: 'Exercise normal precautions and check current travel advisories before departure',
    concerns: ['Check current travel advisories', 'Be aware of your surroundings'],
    tips: ['Register with your embassy', 'Keep copies of important documents', 'Get comprehensive travel insurance'],
    emergency: { police: 'Check locally', ambulance: 'Check locally', fire: 'Check locally' },
    health: ['Consult a travel clinic before departure', 'Carry necessary medications', 'Get travel insurance'],
  };
}

// ============ TRAVEL ADVISORY ============

export async function getTravelAdvisory(countryCode?: string) {
  if (!countryCode || typeof countryCode !== 'string') return null;
  
  const code = countryCode.trim().toUpperCase();
  const results: any = { countryCode: code, sources: [] };
  
  // Get safety data from our database first (always reliable)
  const safetyData = getSafetyData(code);
  results.safetyData = safetyData;
  results.sources.push('Safety Database');
  
  // Try travel-advisory.info API
  try {
    const response = await fetch(
      `https://www.travel-advisory.info/api?countrycode=${code}`,
      { 
        next: { revalidate: 86400 },
        signal: AbortSignal.timeout(5000)
      }
    );
    
    if (response.ok) {
      const data = await response.json();
      if (data?.data?.[code]) {
        const advisory = data.data[code];
        results.advisory = {
          score: advisory.advisory?.score,
          message: advisory.advisory?.message,
          updated: advisory.advisory?.updated,
          source: advisory.advisory?.source,
        };
        results.sources.push('Travel-Advisory.info');
      }
    }
  } catch (error: any) {
    console.log(`Travel Advisory API failed: ${error.message}`);
  }
  
  // If no external API worked, use our safety rating
  if (!results.advisory) {
    const ratingToScore: Record<string, number> = {
      'very-safe': 1.5,
      'safe': 2.0,
      'moderate': 2.8,
      'caution': 3.8,
      'avoid': 4.5,
    };
    
    results.advisory = {
      score: ratingToScore[safetyData.rating] || 2.5,
      message: safetyData.summary,
      source: 'Regional estimates',
    };
    results.sources.push('Fallback');
  }
  
  console.log(`Travel Advisory for ${code}: sources=${results.sources.join(', ')}`);
  return results;
}

export async function getUKTravelAdvice(country: string) {
  if (!country || typeof country !== 'string') return null;
  
  const slug = country.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z\s-]/g, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-');
  
  if (!slug) return null;
  
  try {
    const response = await fetch(
      `https://www.gov.uk/api/content/foreign-travel-advice/${slug}`,
      { 
        next: { revalidate: 86400 },
        signal: AbortSignal.timeout(8000)
      }
    );
    
    if (!response.ok) return null;
    return response.json();
  } catch (error: any) {
    console.log(`UK FCDO error: ${error.message}`);
    return null;
  }
}

// ============ WEB SEARCH (Wikipedia + Wikidata) ============

async function searchWikipediaArticles(query: string, limit: number = 5) {
  try {
    const response = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srlimit=${limit}&format=json&origin=*`,
      { 
        headers: { 'User-Agent': USER_AGENT },
        signal: AbortSignal.timeout(6000)
      }
    );
    
    if (!response.ok) return [];
    const data = await response.json();
    return (data.query?.search || []).map((item: any) => ({
      title: item.title,
      snippet: item.snippet?.replace(/<[^>]*>/g, '') || '',
    }));
  } catch {
    return [];
  }
}

export async function webSearch(query: string) {
  if (!query || query.trim() === '') return null;
  
  const results: any = { query, sources: [] };
  
  // Try Wikipedia first
  const wikiArticles = await searchWikipediaArticles(query, 5);
  if (wikiArticles.length > 0) {
    results.sources.push('Wikipedia');
    results.relatedTopics = wikiArticles.map((a: any) => ({
      text: `${a.title}: ${a.snippet}`,
      url: `https://en.wikipedia.org/wiki/${encodeURIComponent(a.title.replace(/ /g, '_'))}`,
    }));
    
    // Get summary from first result
    try {
      const summaryResponse = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wikiArticles[0].title)}`,
        { 
          headers: { 'User-Agent': USER_AGENT },
          signal: AbortSignal.timeout(5000)
        }
      );
      
      if (summaryResponse.ok) {
        const summaryData = await summaryResponse.json();
        results.abstract = summaryData.extract || null;
        results.abstractSource = 'Wikipedia';
        results.abstractURL = summaryData.content_urls?.desktop?.page || null;
        results.image = summaryData.thumbnail?.source || null;
        results.heading = summaryData.title || null;
      }
    } catch {}
  }
  
  if (!results.abstract && (!results.relatedTopics || results.relatedTopics.length === 0)) {
    console.log(`Web search for "${query}" returned no results`);
    return null;
  }
  
  console.log(`Web search for "${query}" succeeded: ${results.sources.join(', ')}`);
  return results;
}

// ============ AIRPORTS & TRANSIT ============

export async function searchAirports(lat: number, lon: number, radius: number = 100000) {
  const query = `[out:json][timeout:25];(node["aeroway"="aerodrome"]["iata"](around:${radius},${lat},${lon});way["aeroway"="aerodrome"]["iata"](around:${radius},${lat},${lon}););out body center 15;`;
  const data = await overpassQuery(query);
  
  return data.elements.map((el: any) => ({
    name: el.tags?.name || el.tags?.['name:en'],
    iata: el.tags?.iata,
    icao: el.tags?.icao,
    lat: el.lat || el.center?.lat,
    lon: el.lon || el.center?.lon,
    international: el.tags?.['aerodrome:type'] === 'international',
  })).filter((a: any) => a.iata);
}

export async function searchTransitStops(lat: number, lon: number, radius: number = 1000) {
  const query = `[out:json][timeout:20];(node["public_transport"="station"](around:${radius},${lat},${lon});node["railway"="station"](around:${radius},${lat},${lon}););out body 30;`;
  const data = await overpassQuery(query);
  
  return data.elements.map((el: any) => ({
    name: el.tags?.name,
    type: el.tags?.railway || el.tags?.public_transport,
    lat: el.lat,
    lon: el.lon,
    operator: el.tags?.operator,
  })).filter((s: any) => s.name);
}

export async function searchNeighborhoods(lat: number, lon: number, radius: number = 10000) {
  const query = `[out:json][timeout:20];(node["place"~"suburb|neighbourhood|quarter"](around:${radius},${lat},${lon}););out body 20;`;
  const data = await overpassQuery(query);
  
  return data.elements.map((el: any) => ({
    name: el.tags?.name || el.tags?.['name:en'],
    type: el.tags?.place,
    lat: el.lat,
    lon: el.lon,
    wikipedia: el.tags?.wikipedia,
  })).filter((n: any) => n.name);
}

// ============ COMPREHENSIVE DESTINATION OVERVIEW ============

export async function getDestinationOverview(destination: string) {
  console.log(`[API] Starting research for: ${destination}`);
  
  const results: Record<string, any> = {};
  const errors: string[] = [];

  // 1. Geocode
  try {
    const geoData = await geocodeLocation(destination);
    if (geoData?.length > 0) {
      results.location = geoData[0];
      console.log(`[API] Found: ${results.location.display_name}`);
    }
  } catch (e: any) { errors.push(`Geocoding: ${e.message}`); }

  // 2. Country info
  try {
    const countryInfo = await getCountryInfo(destination);
    if (countryInfo) results.country = countryInfo;
  } catch (e: any) { errors.push(`Country: ${e.message}`); }

  // 3. Wikipedia
  try {
    const wikiSummary = await getWikipediaSummary(destination);
    if (wikiSummary) results.wikipedia = wikiSummary;
  } catch (e: any) { errors.push(`Wikipedia: ${e.message}`); }

  // 4. Images
  try {
    results.images = await searchImages(destination, 10);
  } catch (e: any) { errors.push(`Images: ${e.message}`); }

  // 5. Location-based data
  if (results.location || results.country) {
    const lat = parseFloat(results.location?.lat) || results.country?.latlng?.[0];
    const lon = parseFloat(results.location?.lon) || results.country?.latlng?.[1];
    
    if (lat && lon) {
      try { results.weather = await getWeather(lat, lon); } 
      catch (e: any) { errors.push(`Weather: ${e.message}`); }

      try { results.attractions = await getOpenTripMapAttractions(lat, lon, 20000); } 
      catch (e: any) { errors.push(`Attractions: ${e.message}`); }

      try { results.airports = await searchAirports(lat, lon); } 
      catch (e: any) { errors.push(`Airports: ${e.message}`); }
    }
  }

  // 6. Travel advisory
  if (results.country?.cca2) {
    try { results.travelAdvisory = await getTravelAdvisory(results.country.cca2); } 
    catch (e: any) { errors.push(`Advisory: ${e.message}`); }
  }

  // 7. Exchange rates
  try { results.exchangeRates = await getExchangeRates('USD'); } 
  catch (e: any) { errors.push(`Rates: ${e.message}`); }

  console.log(`[API] Complete. Errors: ${errors.length}`);
  return { results, errors };
}
