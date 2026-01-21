// Simulated tool responses with realistic travel data
// In production, these would call real APIs (Bing Search, Google Places, etc.)

import { TravelGuide, CityRanking, Neighborhood, Attraction, BudgetEstimate, TransportationGuide, SafetyInfo, CultureGuide, CommonMistake, TravelerType, DestinationImage, MapLocation, DestinationOverview } from '@/types';

// Destination data for generating realistic responses
const destinationData: Record<string, Partial<TravelGuide>> = {
  japan: {
    country: 'Japan',
    theme: 'japan',
    overview: {
      summary: 'Japan seamlessly blends ancient traditions with cutting-edge modernity. From serene temples and cherry blossoms to neon-lit cityscapes and world-class cuisine, this island nation offers an unparalleled cultural experience that captivates every type of traveler.',
      highlights: ['Ancient temples and shrines', 'World-renowned cuisine', 'Cherry blossom season', 'Efficient public transport', 'Unique pop culture', 'Natural hot springs (onsen)', 'Safe and clean cities'],
      bestTimeToVisit: 'March-May for cherry blossoms, October-November for autumn colors. Avoid Golden Week (late April-early May) and Obon (mid-August) due to crowds.',
      climate: 'Four distinct seasons. Hot, humid summers (June-August) with rainy season in June. Cold winters in the north. Mild spring and autumn are ideal for travel.',
      language: 'Japanese. English signage common in major cities but limited English spoken outside tourist areas.',
      currency: 'Japanese Yen (¥). Cash is still king—many places don\'t accept cards.',
      timeZone: 'Japan Standard Time (JST), UTC+9. No daylight saving time.',
      visaInfo: 'Most Western countries enjoy visa-free entry for 90 days. Valid passport required.'
    },
    topCities: [
      { rank: 1, name: 'Tokyo', description: 'The world\'s most populous metropolis, offering everything from ancient temples to futuristic technology districts.', whyVisit: 'Unmatched urban experience combining traditional culture with modern innovation. World-class food, shopping, and nightlife.', idealDuration: '4-5 days minimum', highlights: ['Shibuya Crossing', 'Senso-ji Temple', 'Akihabara electronics district', 'Tsukiji Outer Market', 'Meiji Shrine'] },
      { rank: 2, name: 'Kyoto', description: 'Japan\'s cultural heart with over 2,000 temples and shrines, traditional geisha districts, and exquisite gardens.', whyVisit: 'The definitive Japanese cultural experience. See living traditions, historic architecture, and serene beauty.', idealDuration: '3-4 days', highlights: ['Fushimi Inari Shrine', 'Kinkaku-ji (Golden Pavilion)', 'Arashiyama Bamboo Grove', 'Gion geisha district', 'Traditional tea ceremonies'] },
      { rank: 3, name: 'Osaka', description: 'Japan\'s kitchen and entertainment capital, known for its outgoing locals, street food, and vibrant nightlife.', whyVisit: 'Best food scene in Japan. More relaxed and affordable than Tokyo. Gateway to Kyoto and Nara.', idealDuration: '2-3 days', highlights: ['Dotonbori food street', 'Osaka Castle', 'Universal Studios Japan', 'Kuromon Market', 'Shinsekai district'] },
      { rank: 4, name: 'Hiroshima', description: 'A city of peace and resilience, offering profound history alongside warm hospitality and delicious okonomiyaki.', whyVisit: 'Essential historical experience. Day trip to stunning Miyajima Island with its floating torii gate.', idealDuration: '1-2 days', highlights: ['Peace Memorial Park', 'Atomic Bomb Dome', 'Miyajima Island', 'Hiroshima-style okonomiyaki'] },
      { rank: 5, name: 'Nara', description: 'Japan\'s first permanent capital, home to friendly wild deer and some of the country\'s oldest temples.', whyVisit: 'Interact with 1,200 free-roaming sacred deer. See Japan\'s largest bronze Buddha.', idealDuration: '1 day trip', highlights: ['Nara Park deer', 'Todai-ji Temple', 'Kasuga Grand Shrine', 'Traditional machiya townhouses'] }
    ],
    neighborhoods: [
      { name: 'Shinjuku', city: 'Tokyo', type: 'mid-range', description: 'Tokyo\'s busiest district with excellent transport links, shopping, and entertainment.', priceRange: { min: 100, max: 250, currency: 'USD' }, bestFor: ['First-time visitors', 'Nightlife seekers', 'Shopping enthusiasts'], nearbyAttractions: ['Shinjuku Gyoen', 'Golden Gai', 'Robot Restaurant'] },
      { name: 'Shibuya', city: 'Tokyo', type: 'mid-range', description: 'Youth culture hub with iconic crossing, trendy shops, and vibrant atmosphere.', priceRange: { min: 120, max: 280, currency: 'USD' }, bestFor: ['Young travelers', 'Pop culture fans', 'Nightlife'], nearbyAttractions: ['Shibuya Crossing', 'Meiji Shrine', 'Harajuku'] },
      { name: 'Asakusa', city: 'Tokyo', type: 'budget', description: 'Traditional atmosphere with Tokyo\'s oldest temple and old-world charm.', priceRange: { min: 50, max: 120, currency: 'USD' }, bestFor: ['Culture seekers', 'Budget travelers', 'Traditional experience'], nearbyAttractions: ['Senso-ji', 'Tokyo Skytree', 'Nakamise Street'] },
      { name: 'Gion', city: 'Kyoto', type: 'luxury', description: 'Historic geisha district with traditional wooden machiya houses and exclusive ryokans.', priceRange: { min: 200, max: 600, currency: 'USD' }, bestFor: ['Luxury travelers', 'Cultural immersion', 'Romantics'], nearbyAttractions: ['Geisha spotting', 'Yasaka Shrine', 'Kiyomizu-dera'] },
      { name: 'Namba', city: 'Osaka', type: 'mid-range', description: 'Heart of Osaka\'s food and entertainment scene, walking distance to everything.', priceRange: { min: 80, max: 180, currency: 'USD' }, bestFor: ['Foodies', 'Nightlife lovers', 'Central location'], nearbyAttractions: ['Dotonbori', 'Shinsaibashi', 'Kuromon Market'] }
    ],
    attractions: [
      { name: 'Fushimi Inari Shrine', city: 'Kyoto', type: 'popular', description: 'Iconic Shinto shrine with thousands of vermillion torii gates forming stunning tunnels up a forested mountain.', whyVisit: 'The most iconic image of Japan. Free to enter and open 24/7—visit at dawn to avoid crowds.', estimatedTime: '2-3 hours', cost: 'Free', tips: ['Go at sunrise for empty paths', 'Hike the full mountain for hidden shrines', 'Wear comfortable shoes'] },
      { name: 'TeamLab Borderless', city: 'Tokyo', type: 'popular', description: 'Immersive digital art museum where artworks flow between rooms and interact with visitors.', whyVisit: 'Unlike any museum in the world. A must for art and tech enthusiasts.', estimatedTime: '3-4 hours', cost: '¥3,800', tips: ['Book tickets weeks in advance', 'Wear white to reflect the art', 'Allow extra time to get lost'] },
      { name: 'Arashiyama Bamboo Grove', city: 'Kyoto', type: 'nature', description: 'Ethereal pathway through towering bamboo stalks in western Kyoto.', whyVisit: 'Otherworldly beauty and tranquility. Combine with monkey park and temple visits.', estimatedTime: '1-2 hours', cost: 'Free', tips: ['Arrive before 8am for photos without crowds', 'Rent a bicycle to explore the area', 'Visit Tenryu-ji Temple nearby'] },
      { name: 'Tsukiji Outer Market', city: 'Tokyo', type: 'food', description: 'Tokyo\'s culinary heart with fresh seafood, street food, and cooking supplies.', whyVisit: 'The best sushi breakfast in the world. Experience Tokyo\'s food culture.', estimatedTime: '2-3 hours', cost: 'Varies', tips: ['Go early for best selection', 'Try the tamago (egg) and fresh uni', 'Inner market moved to Toyosu—outer market remains'] },
      { name: 'Naoshima Art Island', city: 'Kagawa', type: 'hidden-gem', description: 'Small island dedicated to contemporary art with museums by world-famous architects.', whyVisit: 'Unique fusion of art, architecture, and nature. Less touristy than mainland.', estimatedTime: 'Full day', cost: '¥2,000-3,000 for museums', tips: ['Book Chichu Art Museum in advance', 'Rent an electric bike', 'Stay overnight for the full experience'] }
    ],
    budget: {
      currency: 'USD',
      daily: { budget: { min: 50, max: 80 }, midRange: { min: 150, max: 250 }, luxury: { min: 400, max: 800 } },
      breakdown: {
        accommodation: { budget: '$25-50 (hostels, capsule hotels)', midRange: '$100-200 (business hotels, ryokans)', luxury: '$300-600+ (luxury ryokans, 5-star hotels)' },
        food: { budget: '$15-25 (convenience stores, ramen, gyudon)', midRange: '$40-70 (mid-range restaurants, izakayas)', luxury: '$100-200+ (kaiseki, high-end sushi)' },
        transport: { budget: '$5-15 (JR Pass amortized, walking)', midRange: '$20-40 (JR Pass, some taxis)', luxury: '$50-100+ (green car, private transfers)' },
        activities: { budget: '$5-15 (free temples, parks)', midRange: '$30-50 (paid attractions, tours)', luxury: '$100-200+ (private tours, premium experiences)' }
      },
      weeklyTotal: { budget: { min: 350, max: 560 }, midRange: { min: 1050, max: 1750 }, luxury: { min: 2800, max: 5600 } },
      tips: ['7-day JR Pass pays off if visiting 3+ cities', 'Convenience store food is excellent and cheap', 'Cash is essential—many places don\'t accept cards', 'Lunch sets are much cheaper than dinner', 'Free attractions like temples and parks are world-class']
    },
    transportation: {
      gettingThere: { mainAirports: ['Tokyo Narita (NRT)', 'Tokyo Haneda (HND)', 'Osaka Kansai (KIX)'], alternativeOptions: ['Fukuoka (FUK) for Kyushu', 'Sapporo (CTS) for Hokkaido'] },
      gettingAround: {
        publicTransport: 'World-class metro and train systems. Get a Suica/Pasmo IC card for seamless travel.',
        taxis: 'Very expensive ($30+ for short trips). Clean and reliable but rarely necessary.',
        rentals: 'Only recommended for rural areas. International Driving Permit required.',
        walking: 'Cities are very walkable and safe at all hours.',
        tips: ['Get a JR Pass before arrival for intercity travel', 'Download Japan Transit app for navigation', 'Last trains around midnight—plan accordingly', 'Priority seats are strictly for those who need them']
      },
      intercity: { options: ['Shinkansen (bullet trains)', 'Highway buses (budget option)', 'Domestic flights (for distant regions)'], recommendations: 'JR Pass is essential for multi-city trips. Tokyo-Kyoto is 2.5 hours by Shinkansen.' }
    },
    safety: {
      overallRating: 'very-safe',
      summary: 'Japan is consistently ranked as one of the safest countries for travelers. Crime is extremely rare, and lost items are often returned.',
      concerns: ['Earthquakes and natural disasters (follow local guidance)', 'Summer heat can be dangerous (stay hydrated)', 'Crowded trains can be uncomfortable'],
      tips: ['Register for earthquake alerts on your phone', 'Carry cash—crime is so low theft is rarely a concern', 'Follow local rules and customs', 'Emergency number: 110 (police), 119 (fire/ambulance)'],
      emergencyNumbers: { police: '110', ambulance: '119', tourist: '050-3816-2787' },
      healthAdvice: ['Tap water is safe to drink', 'No required vaccinations', 'Pharmacies have English products—look for drugstores', 'High healthcare standards but English can be limited']
    },
    culture: {
      summary: 'Japanese culture values harmony, respect, and attention to detail. Social etiquette is important, but locals are forgiving of foreign visitors\' mistakes.',
      etiquette: ['Bow when greeting (slight nod is fine for foreigners)', 'Remove shoes when entering homes and some restaurants', 'Don\'t tip—it\'s considered rude', 'Be quiet on public transport', 'Don\'t eat while walking'],
      dress: 'Smart casual is appreciated. Cover shoulders and knees at temples. Remove shoes where required.',
      tipping: 'Never tip in Japan. Good service is standard and expected.',
      greetings: '"Konnichiwa" (hello), "Arigatou gozaimasu" (thank you), "Sumimasen" (excuse me)',
      taboos: ['Sticking chopsticks upright in rice', 'Blowing your nose in public', 'Being loud on trains', 'Cutting in line'],
      localCustoms: ['Hot spring (onsen) etiquette is strict—wash before entering', 'Business cards exchanged with two hands', 'Drinking culture is important for socializing', 'Punctuality is extremely valued']
    },
    mistakes: [
      { mistake: 'Not carrying enough cash', why: 'Many restaurants, shops, and transit don\'t accept cards', instead: 'Withdraw yen at airport or convenience store ATMs (7-Eleven, Lawson)' },
      { mistake: 'Trying to see everything', why: 'Japan is dense with experiences—rushing ruins the depth', instead: 'Focus on fewer places with more time in each' },
      { mistake: 'Ignoring the JR Pass', why: 'Intercity travel is expensive without it', instead: 'Calculate your routes—7-day pass often saves 50% or more' },
      { mistake: 'Only visiting Tokyo and Kyoto', why: 'Missing the diversity of Japan', instead: 'Add Osaka, Hiroshima, or a rural area for contrast' },
      { mistake: 'Expecting everyone speaks English', why: 'English levels are lower than expected', instead: 'Learn basic phrases, use translation apps, be patient' }
    ],
    bestFor: [
      { type: 'First-time Asia travelers', why: 'Extremely safe, clean, and easy to navigate despite language barrier', highlights: ['Reliable transport', 'Clear signage', 'Helpful locals'] },
      { type: 'Food enthusiasts', why: 'More Michelin stars than any country and incredible everyday food', highlights: ['World-class sushi', 'Regional specialties', 'Convenience store cuisine'] },
      { type: 'Culture seekers', why: 'Living traditions alongside cutting-edge modernity', highlights: ['Ancient temples', 'Tea ceremonies', 'Traditional crafts'] },
      { type: 'Solo travelers', why: 'Extremely safe, solo dining is normal, efficient for independent travel', highlights: ['Safe at night', 'Solo-friendly restaurants', 'Great public transport'] },
      { type: 'Tech and pop culture fans', why: 'Birthplace of anime, gaming, and unique innovations', highlights: ['Akihabara', 'Robot Restaurant', 'Gaming arcades'] }
    ],
    images: [
      { url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e', alt: 'Fushimi Inari Shrine torii gates', location: 'Kyoto', credit: 'Unsplash' },
      { url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf', alt: 'Tokyo Tower at night', location: 'Tokyo', credit: 'Unsplash' },
      { url: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186', alt: 'Cherry blossoms at a temple', location: 'Kyoto', credit: 'Unsplash' },
      { url: 'https://images.unsplash.com/photo-1504198453319-5ce911bafcde', alt: 'Mount Fuji with pagoda', location: 'Fujiyoshida', credit: 'Unsplash' },
      { url: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9', alt: 'Traditional street in Kyoto', location: 'Kyoto', credit: 'Unsplash' }
    ],
    mapData: [
      { name: 'Tokyo', type: 'city', coordinates: { lat: 35.6762, lng: 139.6503 } },
      { name: 'Kyoto', type: 'city', coordinates: { lat: 35.0116, lng: 135.7681 } },
      { name: 'Osaka', type: 'city', coordinates: { lat: 34.6937, lng: 135.5023 } },
      { name: 'Narita Airport', type: 'airport', coordinates: { lat: 35.7720, lng: 140.3929 } },
      { name: 'Fushimi Inari Shrine', type: 'attraction', coordinates: { lat: 34.9671, lng: 135.7727 } }
    ]
  },
  france: {
    country: 'France',
    theme: 'france',
    overview: {
      summary: 'France is the world\'s most visited country, offering an unrivaled blend of art, history, gastronomy, and natural beauty. From the romantic streets of Paris to sun-drenched Provence and the glamorous Côte d\'Azur, France delivers timeless experiences.',
      highlights: ['World-class museums and art', 'Legendary cuisine and wine', 'Stunning architecture', 'Diverse landscapes', 'Fashion capital', 'Rich history', 'Mediterranean beaches'],
      bestTimeToVisit: 'April-June and September-October for pleasant weather and fewer crowds. July-August is peak season with higher prices.',
      climate: 'Varies by region. North is temperate, south is Mediterranean. Winters mild but can be cold in Paris. Summers warm throughout.',
      language: 'French. English widely spoken in tourist areas but learning basic French is appreciated.',
      currency: 'Euro (€). Cards widely accepted but carry cash for small purchases.',
      timeZone: 'Central European Time (CET), UTC+1. Daylight saving observed.',
      visaInfo: 'Schengen zone. Most nationalities can visit visa-free for 90 days.'
    },
    topCities: [
      { rank: 1, name: 'Paris', description: 'The City of Light needs no introduction—iconic landmarks, world-class museums, and unmatched romance.', whyVisit: 'Essential for first-time visitors. Art, food, and atmosphere that define French culture.', idealDuration: '4-5 days minimum', highlights: ['Eiffel Tower', 'Louvre Museum', 'Notre-Dame', 'Montmartre', 'Champs-Élysées'] },
      { rank: 2, name: 'Nice', description: 'Gateway to the French Riviera with stunning beaches, vibrant old town, and perfect Mediterranean climate.', whyVisit: 'Beach culture, great food, and base for exploring the Côte d\'Azur.', idealDuration: '2-3 days', highlights: ['Promenade des Anglais', 'Old Town (Vieux Nice)', 'Castle Hill views', 'Local markets'] },
      { rank: 3, name: 'Lyon', description: 'France\'s gastronomic capital with Renaissance architecture and vibrant cultural scene.', whyVisit: 'Best food city in France. Less touristy with authentic French atmosphere.', idealDuration: '2-3 days', highlights: ['Bouchon restaurants', 'Old Lyon (UNESCO)', 'Traboules passages', 'Food markets'] },
      { rank: 4, name: 'Bordeaux', description: 'Elegant wine capital with stunning 18th-century architecture and nearby vineyard experiences.', whyVisit: 'Wine lover\'s paradise with beautiful urban setting and day trip opportunities.', idealDuration: '2-3 days', highlights: ['Wine tasting', 'Place de la Bourse', 'Saint-Émilion day trip', 'Miroir d\'Eau'] },
      { rank: 5, name: 'Marseille', description: 'France\'s oldest city with a gritty charm, diverse neighborhoods, and Mediterranean soul.', whyVisit: 'Authentic, multicultural France. Great food, calanques, and gateway to Provence.', idealDuration: '2 days', highlights: ['Vieux Port', 'Calanques National Park', 'MuCEM', 'Le Panier neighborhood'] }
    ]
  },
  italy: {
    country: 'Italy',
    theme: 'italy',
    overview: {
      summary: 'Italy is a feast for all senses—ancient ruins, Renaissance masterpieces, world-famous cuisine, and dolce vita lifestyle. Each region offers distinct character, from Alpine north to Mediterranean south.',
      highlights: ['Ancient Roman ruins', 'Renaissance art and architecture', 'Legendary cuisine', 'Fashion and design', 'Beautiful coastlines', 'Wine regions', 'Passionate culture'],
      bestTimeToVisit: 'April-June and September-October for ideal weather and manageable crowds. August sees many closures as Italians vacation.',
      climate: 'Mediterranean south, continental north. Hot summers, mild winters in most regions. Alps have mountain climate.',
      language: 'Italian. English common in tourist areas but varies. Learning basics is highly appreciated.',
      currency: 'Euro (€). Cards accepted but cash preferred for small establishments.',
      timeZone: 'Central European Time (CET), UTC+1. Daylight saving observed.',
      visaInfo: 'Schengen zone. Most nationalities can visit visa-free for 90 days.'
    }
  },
  thailand: {
    country: 'Thailand',
    theme: 'thailand',
    overview: {
      summary: 'Thailand captivates with its perfect blend of ancient temples, tropical beaches, delicious cuisine, and genuine hospitality. The "Land of Smiles" offers incredible value and experiences for every type of traveler.',
      highlights: ['Ornate Buddhist temples', 'Tropical islands and beaches', 'Incredible street food', 'Warm hospitality', 'Affordable luxury', 'Rich culture', 'Vibrant nightlife'],
      bestTimeToVisit: 'November-February for cool, dry weather. March-May is hot season. June-October brings monsoons (but fewer crowds).',
      climate: 'Tropical. Hot and humid year-round. Three seasons: cool (Nov-Feb), hot (Mar-May), rainy (Jun-Oct).',
      language: 'Thai. English widely spoken in tourist areas. Learning greetings appreciated.',
      currency: 'Thai Baht (฿). Cards accepted in cities but cash needed for markets and small shops.',
      timeZone: 'Indochina Time (ICT), UTC+7. No daylight saving.',
      visaInfo: 'Most nationalities get 30-60 days visa-free on arrival. Extensions possible.'
    }
  }
};

// Default/generic destination template
const defaultDestination: Partial<TravelGuide> = {
  overview: {
    summary: 'A fascinating destination with unique culture, history, and experiences waiting to be discovered.',
    highlights: ['Rich cultural heritage', 'Unique local cuisine', 'Historical landmarks', 'Natural beauty', 'Warm hospitality'],
    bestTimeToVisit: 'Spring and autumn generally offer the best weather and fewer crowds.',
    climate: 'Varied climate depending on the region and season.',
    language: 'Local language with English spoken in tourist areas.',
    currency: 'Local currency. Cards may not be accepted everywhere.',
    timeZone: 'Local timezone.',
    visaInfo: 'Check specific requirements for your nationality.'
  }
};

// Helper to get theme for a destination
export function getThemeForDestination(destination: string): string {
  const lower = destination.toLowerCase();
  for (const key of Object.keys(destinationData)) {
    if (lower.includes(key) || key.includes(lower)) {
      return destinationData[key].theme || 'default';
    }
  }
  // Check for specific countries/cities
  const themeMap: Record<string, string> = {
    'tokyo': 'japan', 'kyoto': 'japan', 'osaka': 'japan',
    'paris': 'france', 'nice': 'france', 'lyon': 'france',
    'rome': 'italy', 'venice': 'italy', 'florence': 'italy', 'milan': 'italy',
    'bangkok': 'thailand', 'phuket': 'thailand', 'chiang mai': 'thailand',
    'morocco': 'morocco', 'marrakech': 'morocco', 'fez': 'morocco',
    'greece': 'greece', 'athens': 'greece', 'santorini': 'greece',
    'spain': 'spain', 'barcelona': 'spain', 'madrid': 'spain',
    'portugal': 'portugal', 'lisbon': 'portugal', 'porto': 'portugal',
    'turkey': 'turkey', 'istanbul': 'turkey',
    'egypt': 'egypt', 'cairo': 'egypt',
    'india': 'india', 'delhi': 'india', 'mumbai': 'india',
    'brazil': 'brazil', 'rio': 'brazil', 'sao paulo': 'brazil',
    'mexico': 'mexico', 'mexico city': 'mexico', 'cancun': 'mexico',
    'australia': 'australia', 'sydney': 'australia', 'melbourne': 'australia',
    'new zealand': 'new-zealand', 'auckland': 'new-zealand',
    'iceland': 'iceland', 'reykjavik': 'iceland',
    'peru': 'peru', 'lima': 'peru', 'cusco': 'peru',
    'vietnam': 'vietnam', 'hanoi': 'vietnam', 'ho chi minh': 'vietnam'
  };
  return themeMap[lower] || 'default';
}

// Tool execution functions
export async function executeWebSearch(query: string, category?: string, region?: string): Promise<string> {
  await simulateDelay(800, 1500);
  return JSON.stringify({
    results: [
      { title: `${region || 'Destination'} Travel Guide 2024`, snippet: `Comprehensive travel information for ${region || 'your destination'} including attractions, culture, and practical tips.` },
      { title: `Best Things to Do in ${region || 'Destination'}`, snippet: 'Top-rated experiences and hidden gems recommended by travelers.' },
      { title: `${category || 'Travel'} Tips for ${region || 'Destination'}`, snippet: 'Expert advice and local insights for your trip.' }
    ]
  });
}

export async function executeDiscoverPlaces(destination: string, placeType: string, limit?: string): Promise<string> {
  await simulateDelay(1000, 2000);
  const data = findDestinationData(destination);
  
  if (placeType === 'cities' && data.topCities) {
    return JSON.stringify({ places: data.topCities.slice(0, parseInt(limit || '10')) });
  }
  if (placeType === 'neighborhoods' && data.neighborhoods) {
    return JSON.stringify({ places: data.neighborhoods.slice(0, parseInt(limit || '10')) });
  }
  if (placeType === 'attractions' && data.attractions) {
    return JSON.stringify({ places: data.attractions.slice(0, parseInt(limit || '10')) });
  }
  
  return JSON.stringify({ places: [], message: `Discovering ${placeType} in ${destination}` });
}

export async function executeGetLocationDetails(locationName: string, infoTypes?: string): Promise<string> {
  await simulateDelay(600, 1200);
  return JSON.stringify({
    location: locationName,
    coordinates: { lat: 35.6762, lng: 139.6503 },
    description: `Detailed information about ${locationName}`,
    rating: 4.5,
    tips: ['Visit early morning for best experience', 'Book in advance during peak season']
  });
}

export async function executeEstimateCosts(destination: string, category?: string, budgetLevel?: string, duration?: string): Promise<string> {
  await simulateDelay(1000, 1800);
  const data = findDestinationData(destination);
  if (data.budget) {
    return JSON.stringify(data.budget);
  }
  return JSON.stringify({
    currency: 'USD',
    daily: { budget: { min: 50, max: 100 }, midRange: { min: 150, max: 250 }, luxury: { min: 400, max: 800 } },
    message: `Cost estimates for ${destination}`
  });
}

export async function executeAnalyzeSafety(destination: string, aspects?: string): Promise<string> {
  await simulateDelay(800, 1400);
  const data = findDestinationData(destination);
  if (data.safety) {
    return JSON.stringify(data.safety);
  }
  return JSON.stringify({
    overallRating: 'safe',
    summary: `${destination} is generally safe for tourists with normal precautions.`,
    concerns: ['Petty theft in tourist areas', 'Traffic safety'],
    tips: ['Keep valuables secure', 'Be aware of your surroundings', 'Follow local guidelines']
  });
}

export async function executeGetCulturalInfo(destination: string, topics?: string): Promise<string> {
  await simulateDelay(700, 1300);
  const data = findDestinationData(destination);
  if (data.culture) {
    return JSON.stringify(data.culture);
  }
  return JSON.stringify({
    summary: `Rich cultural traditions in ${destination}`,
    etiquette: ['Greet locals politely', 'Respect local customs', 'Dress appropriately at religious sites'],
    tipping: 'Tipping practices vary—check locally',
    taboos: ['Research local sensitivities before visiting']
  });
}

export async function executeGetTransportationInfo(destination: string, transportType?: string): Promise<string> {
  await simulateDelay(600, 1100);
  const data = findDestinationData(destination);
  if (data.transportation) {
    return JSON.stringify(data.transportation);
  }
  return JSON.stringify({
    gettingThere: { mainAirports: ['International Airport'], alternativeOptions: ['Regional airports', 'Land borders'] },
    gettingAround: { publicTransport: 'Available in major cities', taxis: 'Widely available', tips: ['Download local transit apps'] }
  });
}

export async function executeSearchImages(query: string, location?: string, imageType?: string, count?: string): Promise<string> {
  await simulateDelay(500, 1000);
  const numImages = parseInt(count || '5');
  const images: DestinationImage[] = [];
  
  const unsplashQueries = [
    'landscape', 'cityscape', 'architecture', 'culture', 'food'
  ];
  
  for (let i = 0; i < numImages; i++) {
    images.push({
      url: `https://images.unsplash.com/photo-${1500000000000 + i * 1000}?w=800`,
      alt: `${location || query} - ${imageType || unsplashQueries[i % unsplashQueries.length]}`,
      location: location || query,
      credit: 'Unsplash'
    });
  }
  
  return JSON.stringify({ images });
}

export async function executeCompareNeighborhoods(city: string, criteria?: string, neighborhoodCount?: string): Promise<string> {
  await simulateDelay(1200, 2000);
  const data = findDestinationData(city);
  if (data.neighborhoods) {
    return JSON.stringify({ neighborhoods: data.neighborhoods });
  }
  return JSON.stringify({
    neighborhoods: [
      { name: 'City Center', type: 'mid-range', description: 'Central location with easy access', priceRange: { min: 100, max: 200, currency: 'USD' } },
      { name: 'Old Town', type: 'mid-range', description: 'Historic charm and character', priceRange: { min: 80, max: 180, currency: 'USD' } },
      { name: 'Budget District', type: 'budget', description: 'Affordable with good transport links', priceRange: { min: 40, max: 80, currency: 'USD' } }
    ]
  });
}

export async function executeGetWeatherClimate(destination: string, infoType?: string): Promise<string> {
  await simulateDelay(500, 900);
  const data = findDestinationData(destination);
  return JSON.stringify({
    climate: data.overview?.climate || 'Varied climate throughout the year',
    bestTimeToVisit: data.overview?.bestTimeToVisit || 'Spring and autumn are generally pleasant',
    monthlyAverages: 'Temperature ranges from cool winters to warm summers'
  });
}

export async function executeGetVisaEntryInfo(destination: string, travelerNationality?: string): Promise<string> {
  await simulateDelay(400, 800);
  const data = findDestinationData(destination);
  return JSON.stringify({
    visaInfo: data.overview?.visaInfo || 'Check specific requirements for your nationality',
    generalInfo: 'Most nationalities can visit for tourism with appropriate documentation'
  });
}

export async function executeRankDestinations(country: string, criteria?: string, destinationType?: string): Promise<string> {
  await simulateDelay(1000, 1800);
  const data = findDestinationData(country);
  if (data.topCities) {
    return JSON.stringify({ rankings: data.topCities });
  }
  return JSON.stringify({
    rankings: [
      { rank: 1, name: 'Capital City', whyVisit: 'Main hub with most attractions' },
      { rank: 2, name: 'Second City', whyVisit: 'Cultural heart with unique character' },
      { rank: 3, name: 'Coastal City', whyVisit: 'Beach and relaxation options' }
    ]
  });
}

export async function executeGetLocalTips(destination: string, tipCategory?: string): Promise<string> {
  await simulateDelay(700, 1200);
  const data = findDestinationData(destination);
  if (data.mistakes) {
    return JSON.stringify({ mistakes: data.mistakes, tips: data.budget?.tips || [] });
  }
  return JSON.stringify({
    tips: [
      'Learn a few local phrases—it goes a long way',
      'Visit major attractions early or late to avoid crowds',
      'Try local markets for authentic food experiences',
      'Research local customs before visiting',
      'Download offline maps and translation apps'
    ]
  });
}

export async function executeAnalyzeTravelerFit(destination: string, travelerTypes?: string): Promise<string> {
  await simulateDelay(600, 1100);
  const data = findDestinationData(destination);
  if (data.bestFor) {
    return JSON.stringify({ bestFor: data.bestFor });
  }
  return JSON.stringify({
    bestFor: [
      { type: 'Solo travelers', why: 'Safe and easy to navigate independently' },
      { type: 'Couples', why: 'Romantic settings and experiences' },
      { type: 'Families', why: 'Family-friendly attractions and accommodations' },
      { type: 'Adventure seekers', why: 'Outdoor activities and unique experiences' }
    ]
  });
}

export async function executeSynthesizeGuideSection(section: string, rawData: string, destination: string): Promise<string> {
  await simulateDelay(1500, 2500);
  return JSON.stringify({
    section,
    synthesized: true,
    message: `Section ${section} synthesized for ${destination}`
  });
}

// Helper functions
function findDestinationData(destination: string): Partial<TravelGuide> {
  const lower = destination.toLowerCase();
  for (const key of Object.keys(destinationData)) {
    if (lower.includes(key) || key.includes(lower)) {
      return destinationData[key];
    }
  }
  
  // Check for cities
  for (const key of Object.keys(destinationData)) {
    const data = destinationData[key];
    if (data.topCities?.some(city => lower.includes(city.name.toLowerCase()))) {
      return data;
    }
  }
  
  return defaultDestination;
}

function simulateDelay(min: number, max: number): Promise<void> {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
}

// Main tool executor
export async function executeTool(toolName: string, args: Record<string, string>): Promise<string> {
  switch (toolName) {
    case 'web_search':
      return executeWebSearch(args.query, args.category, args.region);
    case 'discover_places':
      return executeDiscoverPlaces(args.destination, args.placeType, args.limit);
    case 'get_location_details':
      return executeGetLocationDetails(args.locationName, args.infoTypes);
    case 'estimate_costs':
      return executeEstimateCosts(args.destination, args.category, args.budgetLevel, args.duration);
    case 'analyze_safety':
      return executeAnalyzeSafety(args.destination, args.aspects);
    case 'get_cultural_info':
      return executeGetCulturalInfo(args.destination, args.topics);
    case 'get_transportation_info':
      return executeGetTransportationInfo(args.destination, args.transportType);
    case 'search_images':
      return executeSearchImages(args.query, args.location, args.imageType, args.count);
    case 'compare_neighborhoods':
      return executeCompareNeighborhoods(args.city, args.criteria, args.neighborhoodCount);
    case 'get_weather_climate':
      return executeGetWeatherClimate(args.destination, args.infoType);
    case 'get_visa_entry_info':
      return executeGetVisaEntryInfo(args.destination, args.travelerNationality);
    case 'rank_destinations':
      return executeRankDestinations(args.country, args.criteria, args.destinationType);
    case 'get_local_tips':
      return executeGetLocalTips(args.destination, args.tipCategory);
    case 'analyze_traveler_fit':
      return executeAnalyzeTravelerFit(args.destination, args.travelerTypes);
    case 'synthesize_guide_section':
      return executeSynthesizeGuideSection(args.section, args.rawData, args.destination);
    default:
      return JSON.stringify({ error: `Unknown tool: ${toolName}` });
  }
}

// Generate complete travel guide from destination data
export function generateCompleteGuide(destination: string): TravelGuide {
  const data = findDestinationData(destination);
  const theme = getThemeForDestination(destination);
  
  // Determine country name
  let country = destination;
  for (const key of Object.keys(destinationData)) {
    if (destination.toLowerCase().includes(key)) {
      country = destinationData[key].country || destination;
      break;
    }
  }
  
  return {
    destination: destination.charAt(0).toUpperCase() + destination.slice(1),
    country,
    theme,
    overview: data.overview || defaultDestination.overview!,
    topCities: data.topCities || [
      { rank: 1, name: 'Capital City', description: 'The main hub and cultural center.', whyVisit: 'Experience the heart of the nation.', idealDuration: '3-4 days', highlights: ['Main attractions', 'Local culture', 'Food scene'] }
    ],
    neighborhoods: data.neighborhoods || [
      { name: 'City Center', city: destination, type: 'mid-range', description: 'Central location perfect for first-time visitors.', priceRange: { min: 80, max: 180, currency: 'USD' }, bestFor: ['First-time visitors', 'Easy access'], nearbyAttractions: ['Main sights'] }
    ],
    attractions: data.attractions || [
      { name: 'Main Landmark', city: destination, type: 'popular', description: 'The most iconic sight in the destination.', whyVisit: 'Iconic and unmissable.', estimatedTime: '2-3 hours', cost: 'Varies', tips: ['Visit early'] }
    ],
    budget: data.budget || {
      currency: 'USD',
      daily: { budget: { min: 50, max: 80 }, midRange: { min: 120, max: 200 }, luxury: { min: 350, max: 600 } },
      breakdown: {
        accommodation: { budget: '$25-50', midRange: '$80-150', luxury: '$250-500' },
        food: { budget: '$15-25', midRange: '$40-70', luxury: '$100-200' },
        transport: { budget: '$5-15', midRange: '$20-40', luxury: '$50-100' },
        activities: { budget: '$10-20', midRange: '$30-60', luxury: '$100-200' }
      },
      weeklyTotal: { budget: { min: 350, max: 560 }, midRange: { min: 840, max: 1400 }, luxury: { min: 2450, max: 4200 } },
      tips: ['Book in advance for better rates', 'Travel during shoulder season', 'Eat where locals eat']
    },
    transportation: data.transportation || {
      gettingThere: { mainAirports: ['International Airport'], alternativeOptions: ['Regional connections'] },
      gettingAround: { publicTransport: 'Available in cities', taxis: 'Widely available', rentals: 'Available with international license', walking: 'City centers are walkable', tips: ['Download local transport apps'] },
      intercity: { options: ['Trains', 'Buses', 'Domestic flights'], recommendations: 'Plan routes in advance' }
    },
    safety: data.safety || {
      overallRating: 'safe',
      summary: 'Generally safe for tourists with standard precautions.',
      concerns: ['Petty theft in tourist areas', 'Traffic'],
      tips: ['Keep valuables secure', 'Stay aware of surroundings', 'Follow local guidelines'],
      emergencyNumbers: { police: 'Check locally', ambulance: 'Check locally', tourist: 'Check locally' },
      healthAdvice: ['Check if any vaccinations needed', 'Travel insurance recommended']
    },
    culture: data.culture || {
      summary: 'Rich cultural heritage with unique traditions and customs.',
      etiquette: ['Be respectful', 'Learn basic greetings', 'Follow local dress codes at religious sites'],
      dress: 'Smart casual generally appropriate. Cover up at religious sites.',
      tipping: 'Varies—research local customs.',
      greetings: 'Hello and thank you in local language appreciated.',
      taboos: ['Research local sensitivities'],
      localCustoms: ['Observe and follow local practices']
    },
    mistakes: data.mistakes || [
      { mistake: 'Not researching before visiting', why: 'Miss important cultural context', instead: 'Read guides and learn basics' },
      { mistake: 'Staying only in tourist areas', why: 'Miss authentic experiences', instead: 'Explore local neighborhoods' },
      { mistake: 'Over-scheduling', why: 'Leads to burnout', instead: 'Leave time for spontaneity' }
    ],
    bestFor: data.bestFor || [
      { type: 'Curious travelers', why: 'Rich culture and experiences to discover', highlights: ['Cultural sites', 'Local cuisine', 'Friendly locals'] }
    ],
    images: data.images || [
      { url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee', alt: destination, location: destination, credit: 'Unsplash' }
    ],
    mapData: data.mapData || [
      { name: destination, type: 'city', coordinates: { lat: 0, lng: 0 } }
    ]
  };
}
