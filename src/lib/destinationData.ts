// Real destination data with actual cities, attractions, and information
// Images from Unsplash with proper URLs

import { TravelGuide } from '@/types';

// Morocco - Complete Real Data
export const moroccoData: Partial<TravelGuide> = {
  country: 'Morocco',
  theme: 'morocco',
  overview: {
    summary: 'Morocco is a gateway between Africa and Europe, where ancient medinas buzz with life, the Sahara stretches endlessly, and the Atlas Mountains pierce the sky. From the vibrant souks of Marrakech to the blue-washed streets of Chefchaouen, Morocco offers an intoxicating blend of Berber, Arab, and French influences.',
    highlights: [
      'Ancient medinas and souks',
      'Sahara Desert experiences',
      'Atlas Mountains trekking',
      'World-class cuisine',
      'Stunning Islamic architecture',
      'Blue city of Chefchaouen',
      'Coastal beach towns',
      'Rich handicraft traditions'
    ],
    bestTimeToVisit: 'March to May and September to November offer ideal weather. Summer (June-August) is extremely hot inland. Winter is mild on the coast but cold in the mountains.',
    climate: 'Mediterranean on the coast, continental inland, and desert in the south. Expect hot summers (40°C+) in Marrakech and cool mountain nights year-round.',
    language: 'Arabic and Berber (official). French widely spoken. English common in tourist areas.',
    currency: 'Moroccan Dirham (MAD). €1 ≈ 11 MAD, $1 ≈ 10 MAD. Cash preferred; ATMs widely available.',
    timeZone: 'Western European Time (WET), UTC+1. Morocco observes daylight saving time.',
    visaInfo: 'Visa-free for 90 days for US, EU, UK, Canada, and Australia citizens. Passport must be valid for 6 months.'
  },
  topCities: [
    {
      rank: 1,
      name: 'Marrakech',
      description: 'The "Red City" is Morocco\'s most iconic destination, where ancient palaces, vibrant souks, and the famous Jemaa el-Fnaa square create an unforgettable sensory experience.',
      whyVisit: 'The ultimate Moroccan experience. Lose yourself in the maze-like medina, haggle in traditional souks, stay in a beautiful riad, and witness the world\'s greatest open-air spectacle at Jemaa el-Fnaa.',
      idealDuration: '3-4 days',
      highlights: ['Jemaa el-Fnaa square', 'Bahia Palace', 'Majorelle Garden', 'Medina souks', 'Koutoubia Mosque'],
      imageUrl: 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=800'
    },
    {
      rank: 2,
      name: 'Fes',
      description: 'Home to the world\'s oldest university and largest car-free urban area, Fes el-Bali is a living medieval city where donkeys still carry goods through narrow alleys.',
      whyVisit: 'The most authentic medina experience in Morocco. Witness traditional craftsmen at work, explore the famous tanneries, and step back in time in this UNESCO World Heritage site.',
      idealDuration: '2-3 days',
      highlights: ['Fes el-Bali medina', 'Chouara Tannery', 'Al-Qarawiyyin University', 'Bou Inania Madrasa', 'Nejjarine Museum'],
      imageUrl: 'https://images.unsplash.com/photo-1548017567-efa7d8bc2c22?w=800'
    },
    {
      rank: 3,
      name: 'Chefchaouen',
      description: 'The famous "Blue Pearl" nestled in the Rif Mountains, where every building is painted in stunning shades of blue, creating one of the world\'s most photogenic towns.',
      whyVisit: 'A completely unique atmosphere unlike anywhere else. Perfect for photography, relaxation, and escaping the intensity of larger cities. Gateway to beautiful mountain hikes.',
      idealDuration: '2 days',
      highlights: ['Blue-washed medina', 'Ras el-Maa waterfall', 'Spanish Mosque viewpoint', 'Mountain hiking', 'Local goat cheese'],
      imageUrl: 'https://images.unsplash.com/photo-1553899017-df894e55ad04?w=800'
    },
    {
      rank: 4,
      name: 'Essaouira',
      description: 'A laid-back coastal town with Portuguese fortifications, world-class windsurfing, fresh seafood, and a thriving arts scene.',
      whyVisit: 'The perfect antidote to Marrakech\'s intensity. Relaxed beach vibes, excellent seafood, walkable medina, and reliable Atlantic winds for water sports.',
      idealDuration: '2 days',
      highlights: ['Ramparts and port', 'Medina (UNESCO)', 'Beach and water sports', 'Fresh fish grills', 'Gnaoua music scene'],
      imageUrl: 'https://images.unsplash.com/photo-1569383746724-6f1b882b8f46?w=800'
    },
    {
      rank: 5,
      name: 'Merzouga & Sahara',
      description: 'Gateway to the Erg Chebbi dunes, where you can ride camels into the sunset, sleep under the stars in desert camps, and experience the magic of the Sahara.',
      whyVisit: 'A once-in-a-lifetime experience. Watch sunrise over endless sand dunes, spend a night in a luxury desert camp, and disconnect completely from the modern world.',
      idealDuration: '2 nights (1 in desert)',
      highlights: ['Camel trekking', 'Desert camping', 'Sunrise over dunes', 'Stargazing', 'Berber music and culture'],
      imageUrl: 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=800'
    },
    {
      rank: 6,
      name: 'Casablanca',
      description: 'Morocco\'s modern economic capital, home to the stunning Hassan II Mosque and Art Deco architecture from the French colonial era.',
      whyVisit: 'See Morocco\'s modern face. The Hassan II Mosque is one of the world\'s largest and most beautiful, and the city offers excellent restaurants and nightlife.',
      idealDuration: '1-2 days',
      highlights: ['Hassan II Mosque', 'Corniche beachfront', 'Art Deco downtown', 'Rick\'s Café', 'Central Market'],
      imageUrl: 'https://images.unsplash.com/photo-1569383746724-6f1b882b8f46?w=800'
    }
  ],
  neighborhoods: [
    {
      name: 'Medina (Riad District)',
      city: 'Marrakech',
      type: 'mid-range',
      description: 'Stay in a traditional riad (courtyard house) in the heart of the ancient medina. Experience authentic Moroccan architecture and hospitality.',
      priceRange: { min: 60, max: 200, currency: 'USD' },
      bestFor: ['Authentic experience', 'Beautiful architecture', 'Central location'],
      nearbyAttractions: ['Jemaa el-Fnaa', 'Souks', 'Bahia Palace', 'Ben Youssef Madrasa']
    },
    {
      name: 'Gueliz',
      city: 'Marrakech',
      type: 'mid-range',
      description: 'The modern "new town" with wide boulevards, international restaurants, and contemporary hotels. Less atmospheric but more convenient.',
      priceRange: { min: 80, max: 250, currency: 'USD' },
      bestFor: ['Modern amenities', 'Restaurants and bars', 'Shopping'],
      nearbyAttractions: ['Majorelle Garden', 'Menara Mall', 'Avenue Mohammed V']
    },
    {
      name: 'Palmeraie',
      city: 'Marrakech',
      type: 'luxury',
      description: 'Luxury resort area set among palm groves outside the city. Perfect for those seeking pool time, spas, and tranquility.',
      priceRange: { min: 200, max: 800, currency: 'USD' },
      bestFor: ['Luxury seekers', 'Families', 'Peace and quiet'],
      nearbyAttractions: ['Golf courses', 'Palm groves', 'Camel rides']
    },
    {
      name: 'Fes el-Bali',
      city: 'Fes',
      type: 'mid-range',
      description: 'The ancient walled medina, a UNESCO site. Stay in a converted riad and wake up to the call to prayer echoing through medieval streets.',
      priceRange: { min: 50, max: 180, currency: 'USD' },
      bestFor: ['History lovers', 'Authentic experience', 'Photographers'],
      nearbyAttractions: ['Tanneries', 'Al-Qarawiyyin', 'Bou Inania Madrasa']
    },
    {
      name: 'Medina',
      city: 'Chefchaouen',
      type: 'budget',
      description: 'Small, walkable blue medina with charming guesthouses. Peaceful atmosphere with stunning mountain views from rooftop terraces.',
      priceRange: { min: 30, max: 100, currency: 'USD' },
      bestFor: ['Budget travelers', 'Photographers', 'Relaxation'],
      nearbyAttractions: ['Plaza Uta el-Hammam', 'Kasbah Museum', 'Ras el-Maa']
    }
  ],
  attractions: [
    {
      name: 'Jemaa el-Fnaa',
      city: 'Marrakech',
      type: 'popular',
      description: 'The beating heart of Marrakech—a UNESCO-recognized square that transforms from a daytime market to a nightly carnival of food stalls, musicians, storytellers, and snake charmers.',
      whyVisit: 'There is simply nowhere else like it on Earth. The world\'s greatest open-air spectacle has been happening here for 1,000 years.',
      estimatedTime: '2-4 hours',
      cost: 'Free (budget $10-20 for food)',
      tips: ['Visit at sunset for the best atmosphere', 'Agree on prices before taking photos with performers', 'Try the fresh orange juice stands'],
      coordinates: { lat: 31.6258, lng: -7.9891 },
      imageUrl: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800'
    },
    {
      name: 'Majorelle Garden',
      city: 'Marrakech',
      type: 'popular',
      description: 'A stunning botanical garden created by French painter Jacques Majorelle and later owned by Yves Saint Laurent. Famous for its vibrant cobalt blue buildings.',
      whyVisit: 'An oasis of calm in the bustling city. The striking blue color, exotic plants, and YSL museum make it unforgettable.',
      estimatedTime: '1.5-2 hours',
      cost: '150 MAD ($15)',
      tips: ['Book tickets online to skip the queue', 'Go early morning or late afternoon', 'Visit the adjacent YSL Museum'],
      coordinates: { lat: 31.6417, lng: -8.0031 },
      imageUrl: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800'
    },
    {
      name: 'Chouara Tannery',
      city: 'Fes',
      type: 'cultural',
      description: 'The world\'s oldest leather tannery, operating since the 11th century. Hundreds of stone vessels filled with colorful dyes create an unforgettable sight.',
      whyVisit: 'A living piece of history. Watch craftsmen work leather using methods unchanged for centuries. The view from the terraces is iconic.',
      estimatedTime: '1-2 hours',
      cost: 'Free (tips expected, mint to mask smell)',
      tips: ['Take the mint they offer—you\'ll need it', 'Go in the morning when workers are most active', 'Expect pressure to buy leather goods'],
      coordinates: { lat: 34.0646, lng: -4.9732 },
      imageUrl: 'https://images.unsplash.com/photo-1545167496-28be8f7c4f64?w=800'
    },
    {
      name: 'Erg Chebbi Dunes',
      city: 'Merzouga',
      type: 'nature',
      description: 'Morocco\'s most spectacular sand dunes, rising up to 150 meters. The classic Sahara experience with camel treks and desert camps.',
      whyVisit: 'The quintessential desert experience. Watching sunrise over the dunes from a desert camp is genuinely life-changing.',
      estimatedTime: 'Overnight (minimum)',
      cost: '$100-300 for tour with camp',
      tips: ['Book a reputable tour from Marrakech or Fes', 'Bring warm clothes—desert nights are cold', 'Spring and autumn have the best temperatures'],
      coordinates: { lat: 31.1477, lng: -4.0125 },
      imageUrl: 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=800'
    },
    {
      name: 'Chefchaouen Medina',
      city: 'Chefchaouen',
      type: 'hidden-gem',
      description: 'An entire medina painted in shades of blue, set against the backdrop of the Rif Mountains. Every corner is a photograph waiting to happen.',
      whyVisit: 'Unlike anywhere else in Morocco or the world. The relaxed pace, stunning colors, and mountain air make it the perfect escape.',
      estimatedTime: 'Half to full day',
      cost: 'Free',
      tips: ['Wander without a map—getting lost is the point', 'Climb to the Spanish Mosque for sunset views', 'Try the local goat cheese'],
      coordinates: { lat: 35.1688, lng: -5.2636 },
      imageUrl: 'https://images.unsplash.com/photo-1553899017-df894e55ad04?w=800'
    },
    {
      name: 'Hassan II Mosque',
      city: 'Casablanca',
      type: 'cultural',
      description: 'One of the world\'s largest and most beautiful mosques, built over the ocean with a retractable roof and the tallest minaret in the world (210m).',
      whyVisit: 'A masterpiece of Moroccan craftsmanship and one of the few mosques in Morocco open to non-Muslims.',
      estimatedTime: '1.5 hours (guided tour)',
      cost: '130 MAD ($13)',
      tips: ['Tours at set times only—check schedule', 'Dress modestly (coverings provided)', 'The oceanfront setting is stunning'],
      coordinates: { lat: 33.6086, lng: -7.6328 },
      imageUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800'
    },
    {
      name: 'Aït Benhaddou',
      city: 'Ouarzazate',
      type: 'cultural',
      description: 'A stunning UNESCO-listed ksar (fortified village) that has starred in countless films including Gladiator, Game of Thrones, and Lawrence of Arabia.',
      whyVisit: 'The most photogenic kasbahs in Morocco. Incredible sunset views and a fascinating example of traditional earthen architecture.',
      estimatedTime: '2-3 hours',
      cost: 'Free (tip for guides)',
      tips: ['Visit in late afternoon for best light', 'Climb to the top for panoramic views', 'Usually combined with Sahara tours'],
      coordinates: { lat: 31.0472, lng: -7.1318 },
      imageUrl: 'https://images.unsplash.com/photo-1531501410720-c8d437636169?w=800'
    },
    {
      name: 'Todra Gorge',
      city: 'Tinghir',
      type: 'nature',
      description: 'Dramatic canyon with 300-meter limestone walls narrowing to just 10 meters wide. A stunning natural wonder and popular rock climbing destination.',
      whyVisit: 'Jaw-dropping scenery unlike anywhere else in Morocco. The scale of the canyon walls is truly humbling.',
      estimatedTime: '2-4 hours',
      cost: 'Free',
      tips: ['Best light in the morning', 'Wade in the river to cool off', 'Stay in a nearby guesthouse for sunrise'],
      coordinates: { lat: 31.5889, lng: -5.5969 }
    }
  ],
  budget: {
    currency: 'USD',
    daily: {
      budget: { min: 35, max: 55 },
      midRange: { min: 80, max: 150 },
      luxury: { min: 250, max: 500 }
    },
    breakdown: {
      accommodation: {
        budget: '$15-30 (hostels, basic riads)',
        midRange: '$50-120 (beautiful riads, 3-4 star hotels)',
        luxury: '$150-400+ (luxury riads, 5-star resorts)'
      },
      food: {
        budget: '$8-15 (street food, local restaurants)',
        midRange: '$20-40 (mid-range restaurants, riad dining)',
        luxury: '$60-100+ (fine dining, hotel restaurants)'
      },
      transport: {
        budget: '$5-10 (buses, shared taxis)',
        midRange: '$15-30 (private taxis, some trains)',
        luxury: '$50-100+ (private drivers, domestic flights)'
      },
      activities: {
        budget: '$5-15 (free attractions, walking tours)',
        midRange: '$30-60 (guided tours, hammams)',
        luxury: '$100-250+ (private tours, desert camps)'
      }
    },
    weeklyTotal: {
      budget: { min: 245, max: 385 },
      midRange: { min: 560, max: 1050 },
      luxury: { min: 1750, max: 3500 }
    },
    tips: [
      'Haggling is expected in souks—start at 30-40% of asking price',
      'Riads offer incredible value compared to Western hotels',
      'Eat where locals eat—look for busy spots with high turnover',
      'Book desert tours in Marrakech or Fes for better prices than online',
      'CTM buses are cheap, reliable, and air-conditioned',
      'Trains are excellent for Marrakech-Fes-Tangier routes'
    ]
  },
  transportation: {
    gettingThere: {
      mainAirports: [
        'Marrakech Menara (RAK) - Most popular entry point',
        'Casablanca Mohammed V (CMN) - Largest hub',
        'Fes-Saïs (FEZ) - Northern Morocco'
      ],
      alternativeOptions: [
        'Ferry from Spain (Algeciras to Tangier)',
        'Direct flights from major European cities',
        'Agadir for beach destinations'
      ]
    },
    gettingAround: {
      publicTransport: 'ONCF trains connect major cities (Marrakech, Fes, Casablanca, Tangier). Modern, comfortable, and affordable.',
      taxis: 'Petit taxis (within cities) and grand taxis (between cities). Always agree on price first or insist on meter.',
      rentals: 'Useful for Atlas Mountains and remote areas. Not recommended for medinas. International license required.',
      walking: 'Essential for medinas which are car-free. Comfortable shoes are a must on uneven surfaces.',
      tips: [
        'CTM and Supratours buses are comfortable for intercity travel',
        'Grand taxis can be hired private or shared (cheaper)',
        'Download offline maps—medinas are labyrinthine',
        'Accept that you will get lost in medinas—it\'s part of the experience'
      ]
    },
    intercity: {
      options: [
        'ONCF Trains (best for major cities)',
        'CTM Buses (nationwide, reliable)',
        'Supratours Buses (connects to trains)',
        'Grand Taxis (flexible, shared or private)'
      ],
      recommendations: 'Take the train between Marrakech, Casablanca, and Fes. For the Sahara, book a 2-3 day tour with transportation included.'
    }
  },
  safety: {
    overallRating: 'safe',
    summary: 'Morocco is generally very safe for tourists. Violent crime is rare. The main concerns are persistent touts, scams targeting tourists, and petty theft in crowded areas.',
    concerns: [
      'Aggressive touts and "guides" in medinas',
      'Scams (fake directions, overcharging)',
      'Petty theft and pickpocketing in crowds',
      'Harassment of solo female travelers',
      'Road safety (driving standards differ)'
    ],
    tips: [
      'Say "la shukran" (no thank you) firmly to decline touts',
      'Agree on taxi prices before getting in',
      'Keep valuables in a money belt in crowded areas',
      'Female travelers: dress modestly and ignore catcalls',
      'Only use official guides (check for badges)',
      'Trust your instincts—if something feels wrong, leave'
    ],
    emergencyNumbers: {
      police: '19',
      ambulance: '15',
      tourist: '+212 524 38 44 17 (Tourist Police Marrakech)'
    },
    healthAdvice: [
      'Drink only bottled water',
      'Be cautious with raw vegetables and unpeeled fruit',
      'Bring stomach medication—traveler\'s diarrhea is common',
      'Sun protection is essential, especially in summer',
      'No required vaccinations for most travelers'
    ]
  },
  culture: {
    summary: 'Morocco is a Muslim country with deep traditions of hospitality. Moroccans are generally warm and welcoming, but it\'s important to respect Islamic customs and dress modestly, especially in medinas and rural areas.',
    etiquette: [
      'Dress modestly—cover shoulders and knees',
      'Remove shoes when entering homes and some shops',
      'Use your right hand for eating and greetings',
      'Ask before photographing people',
      'Accept mint tea when offered—it\'s a sign of hospitality',
      'Greet with "Salaam alaikum" (peace be upon you)'
    ],
    dress: 'Cover shoulders and knees, especially in medinas. Women may want a scarf for mosques and rural areas. Swimwear only at beaches and pools.',
    tipping: 'Expected for good service. 10-15% at restaurants, 20-50 MAD for guides, 10-20 MAD for small services.',
    greetings: '"Salaam alaikum" (peace be upon you), "Labas" (how are you), "Shukran" (thank you)',
    taboos: [
      'Public displays of affection',
      'Alcohol outside licensed venues',
      'Photographing people without permission',
      'Criticizing the king or Islam',
      'Pointing feet at people'
    ],
    localCustoms: [
      'Ramadan affects opening hours and atmospheres',
      'Friday is the holy day—some businesses close for prayers',
      'Hammam (bathhouse) is an important tradition',
      'Mint tea ceremony is central to hospitality',
      'Bargaining is expected and enjoyed in souks'
    ]
  },
  mistakes: [
    {
      mistake: 'Not bargaining in souks',
      why: 'You\'ll pay 3-5x the real price. Initial prices are inflated for negotiation.',
      instead: 'Start at 30-40% of asking price and negotiate from there. Walk away if needed—they often call you back.'
    },
    {
      mistake: 'Accepting unsolicited "help" in medinas',
      why: 'Self-appointed guides will demand payment and lead you to commission-paying shops.',
      instead: 'Politely decline with "la shukran." If you need directions, ask shopkeepers or book an official guide.'
    },
    {
      mistake: 'Only visiting Marrakech',
      why: 'You\'ll miss the diversity and quieter experiences Morocco offers.',
      instead: 'Add Fes for history, Chefchaouen for photography, the Sahara for adventure, or Essaouira for beaches.'
    },
    {
      mistake: 'Rushing between cities',
      why: 'The journey is part of the experience, and the best moments often happen unexpectedly.',
      instead: 'Allow time to wander, get lost, and stumble upon hidden gems.'
    },
    {
      mistake: 'Not bringing cash',
      why: 'Many riads, souks, and small restaurants are cash-only.',
      instead: 'Withdraw dirhams at airport ATMs and keep cash handy.'
    }
  ],
  bestFor: [
    {
      type: 'Photographers',
      why: 'Endless photogenic subjects from blue medinas to desert dunes to colorful souks.',
      highlights: ['Chefchaouen\'s blue streets', 'Sahara sunrise', 'Marrakech\'s chaos']
    },
    {
      type: 'Couples',
      why: 'Romantic riads, rooftop dinners, and desert stargazing create unforgettable moments.',
      highlights: ['Riad stays', 'Desert glamping', 'Sunset terraces']
    },
    {
      type: 'Solo Travelers',
      why: 'Safe, affordable, and endlessly interesting with a strong backpacker scene.',
      highlights: ['Hostel community', 'Affordable tours', 'Welcoming locals']
    },
    {
      type: 'Culture Seekers',
      why: 'Living history everywhere you look, from medieval medinas to ancient traditions.',
      highlights: ['UNESCO sites', 'Traditional crafts', 'Berber culture']
    },
    {
      type: 'Foodies',
      why: 'One of the world\'s great cuisines with unique spices and cooking traditions.',
      highlights: ['Tagine', 'Couscous', 'Street food', 'Cooking classes']
    }
  ],
  images: [
    { url: 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=1600', alt: 'Marrakech medina rooftops', location: 'Marrakech', credit: 'Unsplash' },
    { url: 'https://images.unsplash.com/photo-1553899017-df894e55ad04?w=1600', alt: 'Blue streets of Chefchaouen', location: 'Chefchaouen', credit: 'Unsplash' },
    { url: 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=1600', alt: 'Sahara desert dunes', location: 'Merzouga', credit: 'Unsplash' },
    { url: 'https://images.unsplash.com/photo-1548017567-efa7d8bc2c22?w=1600', alt: 'Fes tanneries', location: 'Fes', credit: 'Unsplash' },
    { url: 'https://images.unsplash.com/photo-1531501410720-c8d437636169?w=1600', alt: 'Aït Benhaddou', location: 'Ouarzazate', credit: 'Unsplash' }
  ],
  mapData: [
    { name: 'Marrakech', type: 'city', coordinates: { lat: 31.6295, lng: -7.9811 }, description: 'The Red City - Morocco\'s most popular destination' },
    { name: 'Fes', type: 'city', coordinates: { lat: 34.0181, lng: -5.0078 }, description: 'World\'s largest car-free urban area' },
    { name: 'Chefchaouen', type: 'city', coordinates: { lat: 35.1688, lng: -5.2636 }, description: 'The famous Blue City' },
    { name: 'Casablanca', type: 'city', coordinates: { lat: 33.5731, lng: -7.5898 }, description: 'Morocco\'s modern metropolis' },
    { name: 'Essaouira', type: 'city', coordinates: { lat: 31.5125, lng: -9.7749 }, description: 'Laid-back coastal town' },
    { name: 'Merzouga', type: 'city', coordinates: { lat: 31.0801, lng: -4.0130 }, description: 'Gateway to the Sahara' },
    { name: 'Jemaa el-Fnaa', type: 'attraction', coordinates: { lat: 31.6258, lng: -7.9891 }, description: 'Famous main square' },
    { name: 'Majorelle Garden', type: 'attraction', coordinates: { lat: 31.6417, lng: -8.0031 }, description: 'Stunning botanical garden' },
    { name: 'Hassan II Mosque', type: 'attraction', coordinates: { lat: 33.6086, lng: -7.6328 }, description: 'One of world\'s largest mosques' },
    { name: 'Aït Benhaddou', type: 'attraction', coordinates: { lat: 31.0472, lng: -7.1318 }, description: 'UNESCO kasbahs' },
    { name: 'Marrakech Menara Airport', type: 'airport', coordinates: { lat: 31.6069, lng: -8.0363 }, description: 'Main airport (RAK)' },
    { name: 'Casablanca Airport', type: 'airport', coordinates: { lat: 33.3675, lng: -7.5900 }, description: 'Largest hub (CMN)' }
  ]
};

// Japan - Enhanced with real data
export const japanData: Partial<TravelGuide> = {
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
    { 
      rank: 1, 
      name: 'Tokyo', 
      description: 'The world\'s most populous metropolis, offering everything from ancient temples to futuristic technology districts.', 
      whyVisit: 'Unmatched urban experience combining traditional culture with modern innovation. World-class food, shopping, and nightlife.', 
      idealDuration: '4-5 days minimum', 
      highlights: ['Shibuya Crossing', 'Senso-ji Temple', 'Akihabara', 'Tsukiji Market', 'Meiji Shrine'],
      imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800'
    },
    { 
      rank: 2, 
      name: 'Kyoto', 
      description: 'Japan\'s cultural heart with over 2,000 temples and shrines, traditional geisha districts, and exquisite gardens.', 
      whyVisit: 'The definitive Japanese cultural experience. See living traditions, historic architecture, and serene beauty.', 
      idealDuration: '3-4 days', 
      highlights: ['Fushimi Inari Shrine', 'Kinkaku-ji', 'Arashiyama Bamboo Grove', 'Gion district', 'Tea ceremonies'],
      imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800'
    },
    { 
      rank: 3, 
      name: 'Osaka', 
      description: 'Japan\'s kitchen and entertainment capital, known for its outgoing locals, street food, and vibrant nightlife.', 
      whyVisit: 'Best food scene in Japan. More relaxed and affordable than Tokyo. Gateway to Kyoto and Nara.', 
      idealDuration: '2-3 days', 
      highlights: ['Dotonbori', 'Osaka Castle', 'Universal Studios Japan', 'Kuromon Market', 'Shinsekai'],
      imageUrl: 'https://images.unsplash.com/photo-1590559899731-a382839e5549?w=800'
    },
    { 
      rank: 4, 
      name: 'Hiroshima', 
      description: 'A city of peace and resilience, offering profound history alongside warm hospitality and delicious okonomiyaki.', 
      whyVisit: 'Essential historical experience. Day trip to stunning Miyajima Island with its floating torii gate.', 
      idealDuration: '1-2 days', 
      highlights: ['Peace Memorial Park', 'Atomic Bomb Dome', 'Miyajima Island', 'Hiroshima-style okonomiyaki'],
      imageUrl: 'https://images.unsplash.com/photo-1576675784201-0e142b423952?w=800'
    },
    { 
      rank: 5, 
      name: 'Nara', 
      description: 'Japan\'s first permanent capital, home to friendly wild deer and some of the country\'s oldest temples.', 
      whyVisit: 'Interact with 1,200 free-roaming sacred deer. See Japan\'s largest bronze Buddha.', 
      idealDuration: '1 day trip', 
      highlights: ['Nara Park deer', 'Todai-ji Temple', 'Kasuga Grand Shrine', 'Traditional streets'],
      imageUrl: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800'
    }
  ],
  neighborhoods: [
    { name: 'Shinjuku', city: 'Tokyo', type: 'mid-range', description: 'Tokyo\'s busiest district with excellent transport links, shopping, and entertainment.', priceRange: { min: 100, max: 250, currency: 'USD' }, bestFor: ['First-time visitors', 'Nightlife', 'Shopping'], nearbyAttractions: ['Shinjuku Gyoen', 'Golden Gai', 'Kabukicho'] },
    { name: 'Shibuya', city: 'Tokyo', type: 'mid-range', description: 'Youth culture hub with iconic crossing, trendy shops, and vibrant atmosphere.', priceRange: { min: 120, max: 280, currency: 'USD' }, bestFor: ['Young travelers', 'Pop culture', 'Nightlife'], nearbyAttractions: ['Shibuya Crossing', 'Meiji Shrine', 'Harajuku'] },
    { name: 'Asakusa', city: 'Tokyo', type: 'budget', description: 'Traditional atmosphere with Tokyo\'s oldest temple and old-world charm.', priceRange: { min: 50, max: 120, currency: 'USD' }, bestFor: ['Culture seekers', 'Budget travelers', 'Traditional experience'], nearbyAttractions: ['Senso-ji', 'Tokyo Skytree', 'Nakamise Street'] },
    { name: 'Gion', city: 'Kyoto', type: 'luxury', description: 'Historic geisha district with traditional wooden machiya houses and exclusive ryokans.', priceRange: { min: 200, max: 600, currency: 'USD' }, bestFor: ['Luxury travelers', 'Cultural immersion', 'Romantics'], nearbyAttractions: ['Geisha spotting', 'Yasaka Shrine', 'Kiyomizu-dera'] },
    { name: 'Namba', city: 'Osaka', type: 'mid-range', description: 'Heart of Osaka\'s food and entertainment scene, walking distance to everything.', priceRange: { min: 80, max: 180, currency: 'USD' }, bestFor: ['Foodies', 'Nightlife', 'Central location'], nearbyAttractions: ['Dotonbori', 'Shinsaibashi', 'Kuromon Market'] }
  ],
  attractions: [
    { name: 'Fushimi Inari Shrine', city: 'Kyoto', type: 'popular', description: 'Iconic Shinto shrine with thousands of vermillion torii gates forming stunning tunnels up a forested mountain.', whyVisit: 'The most iconic image of Japan. Free to enter and open 24/7—visit at dawn to avoid crowds.', estimatedTime: '2-3 hours', cost: 'Free', tips: ['Go at sunrise', 'Hike the full mountain', 'Wear comfortable shoes'], coordinates: { lat: 34.9671, lng: 135.7727 }, imageUrl: 'https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?w=800' },
    { name: 'TeamLab Borderless', city: 'Tokyo', type: 'popular', description: 'Immersive digital art museum where artworks flow between rooms and interact with visitors.', whyVisit: 'Unlike any museum in the world. A must for art and tech enthusiasts.', estimatedTime: '3-4 hours', cost: '¥3,800', tips: ['Book weeks in advance', 'Wear white', 'Allow time to get lost'], coordinates: { lat: 35.6255, lng: 139.7831 }, imageUrl: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=800' },
    { name: 'Arashiyama Bamboo Grove', city: 'Kyoto', type: 'nature', description: 'Ethereal pathway through towering bamboo stalks in western Kyoto.', whyVisit: 'Otherworldly beauty and tranquility. Combine with monkey park and temple visits.', estimatedTime: '1-2 hours', cost: 'Free', tips: ['Arrive before 8am', 'Rent a bicycle', 'Visit Tenryu-ji Temple'], coordinates: { lat: 35.0170, lng: 135.6720 }, imageUrl: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800' },
    { name: 'Tsukiji Outer Market', city: 'Tokyo', type: 'food', description: 'Tokyo\'s culinary heart with fresh seafood, street food, and cooking supplies.', whyVisit: 'The best sushi breakfast in the world. Experience Tokyo\'s food culture.', estimatedTime: '2-3 hours', cost: 'Varies', tips: ['Go early', 'Try the tamago and uni', 'Cash only'], coordinates: { lat: 35.6654, lng: 139.7707 }, imageUrl: 'https://images.unsplash.com/photo-1551248429-40975aa4de74?w=800' },
    { name: 'Naoshima Art Island', city: 'Kagawa', type: 'hidden-gem', description: 'Small island dedicated to contemporary art with museums by world-famous architects.', whyVisit: 'Unique fusion of art, architecture, and nature. Less touristy than mainland.', estimatedTime: 'Full day', cost: '¥2,000-3,000', tips: ['Book Chichu in advance', 'Rent an electric bike', 'Stay overnight'], coordinates: { lat: 34.4619, lng: 133.9953 }, imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800' }
  ],
  budget: {
    currency: 'USD',
    daily: { budget: { min: 50, max: 80 }, midRange: { min: 150, max: 250 }, luxury: { min: 400, max: 800 } },
    breakdown: {
      accommodation: { budget: '$25-50 (hostels, capsule hotels)', midRange: '$100-200 (business hotels, ryokans)', luxury: '$300-600+ (luxury ryokans, 5-star hotels)' },
      food: { budget: '$15-25 (convenience stores, ramen)', midRange: '$40-70 (mid-range restaurants)', luxury: '$100-200+ (kaiseki, high-end sushi)' },
      transport: { budget: '$5-15 (JR Pass amortized)', midRange: '$20-40 (JR Pass, some taxis)', luxury: '$50-100+ (green car, private)' },
      activities: { budget: '$5-15 (free temples)', midRange: '$30-50 (attractions, tours)', luxury: '$100-200+ (private tours)' }
    },
    weeklyTotal: { budget: { min: 350, max: 560 }, midRange: { min: 1050, max: 1750 }, luxury: { min: 2800, max: 5600 } },
    tips: ['7-day JR Pass pays off for 3+ cities', 'Convenience store food is excellent', 'Cash is essential', 'Lunch sets are cheaper', 'Many free temples and parks']
  },
  transportation: {
    gettingThere: { mainAirports: ['Tokyo Narita (NRT)', 'Tokyo Haneda (HND)', 'Osaka Kansai (KIX)'], alternativeOptions: ['Fukuoka (FUK)', 'Sapporo (CTS)'] },
    gettingAround: { publicTransport: 'World-class metro and train systems. Get a Suica/Pasmo IC card.', taxis: 'Very expensive ($30+ for short trips). Clean but rarely needed.', rentals: 'Only for rural areas. International Permit required.', walking: 'Cities are very walkable and safe.', tips: ['Get JR Pass before arrival', 'Download Japan Transit app', 'Last trains around midnight', 'Respect priority seats'] },
    intercity: { options: ['Shinkansen (bullet trains)', 'Highway buses', 'Domestic flights'], recommendations: 'JR Pass essential for multi-city. Tokyo-Kyoto is 2.5 hours by Shinkansen.' }
  },
  safety: {
    overallRating: 'very-safe',
    summary: 'Japan is consistently ranked as one of the world\'s safest countries. Crime is extremely rare, and lost items are often returned.',
    concerns: ['Earthquakes (follow local guidance)', 'Summer heat', 'Crowded trains'],
    tips: ['Register for earthquake alerts', 'Carry cash safely', 'Follow local rules', 'Emergency: 110 (police), 119 (ambulance)'],
    emergencyNumbers: { police: '110', ambulance: '119', tourist: '050-3816-2787' },
    healthAdvice: ['Tap water is safe', 'No required vaccinations', 'High healthcare standards']
  },
  culture: {
    summary: 'Japanese culture values harmony, respect, and attention to detail. Social etiquette is important, but locals are forgiving of visitors\' mistakes.',
    etiquette: ['Bow when greeting', 'Remove shoes when entering homes', 'Don\'t tip', 'Be quiet on public transport', 'Don\'t eat while walking'],
    dress: 'Smart casual appreciated. Cover shoulders and knees at temples.',
    tipping: 'Never tip in Japan. Good service is expected.',
    greetings: '"Konnichiwa" (hello), "Arigatou gozaimasu" (thank you), "Sumimasen" (excuse me)',
    taboos: ['Chopsticks upright in rice', 'Blowing nose in public', 'Loud on trains', 'Cutting in line'],
    localCustoms: ['Onsen etiquette is strict', 'Business cards with two hands', 'Punctuality is valued', 'Drinking culture important']
  },
  mistakes: [
    { mistake: 'Not carrying enough cash', why: 'Many places don\'t accept cards', instead: 'Withdraw at 7-Eleven ATMs' },
    { mistake: 'Trying to see everything', why: 'Japan is dense with experiences', instead: 'Focus on fewer places with more time' },
    { mistake: 'Ignoring the JR Pass', why: 'Intercity travel is expensive', instead: 'Calculate routes—often saves 50%+' },
    { mistake: 'Only visiting Tokyo and Kyoto', why: 'Missing Japan\'s diversity', instead: 'Add Osaka, Hiroshima, or rural areas' },
    { mistake: 'Expecting everyone speaks English', why: 'English levels vary', instead: 'Learn basic phrases, use translation apps' }
  ],
  bestFor: [
    { type: 'First-time Asia travelers', why: 'Extremely safe, clean, and easy to navigate', highlights: ['Reliable transport', 'Clear signage', 'Helpful locals'] },
    { type: 'Food enthusiasts', why: 'More Michelin stars than any country', highlights: ['World-class sushi', 'Regional specialties', 'Convenience store cuisine'] },
    { type: 'Culture seekers', why: 'Living traditions alongside modernity', highlights: ['Ancient temples', 'Tea ceremonies', 'Traditional crafts'] },
    { type: 'Solo travelers', why: 'Safe, solo dining is normal, efficient transport', highlights: ['Safe at night', 'Solo-friendly restaurants', 'Great transit'] },
    { type: 'Tech and pop culture fans', why: 'Birthplace of anime, gaming, innovations', highlights: ['Akihabara', 'Robot Restaurant', 'Gaming arcades'] }
  ],
  images: [
    { url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1600', alt: 'Fushimi Inari torii gates', location: 'Kyoto', credit: 'Unsplash' },
    { url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1600', alt: 'Tokyo Tower at night', location: 'Tokyo', credit: 'Unsplash' },
    { url: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1600', alt: 'Cherry blossoms', location: 'Kyoto', credit: 'Unsplash' },
    { url: 'https://images.unsplash.com/photo-1504198453319-5ce911bafcde?w=1600', alt: 'Mount Fuji', location: 'Fujiyoshida', credit: 'Unsplash' },
    { url: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=1600', alt: 'Traditional street', location: 'Kyoto', credit: 'Unsplash' }
  ],
  mapData: [
    { name: 'Tokyo', type: 'city', coordinates: { lat: 35.6762, lng: 139.6503 }, description: 'Japan\'s capital megacity' },
    { name: 'Kyoto', type: 'city', coordinates: { lat: 35.0116, lng: 135.7681 }, description: 'Cultural heart with 2,000+ temples' },
    { name: 'Osaka', type: 'city', coordinates: { lat: 34.6937, lng: 135.5023 }, description: 'Food and entertainment capital' },
    { name: 'Hiroshima', type: 'city', coordinates: { lat: 34.3853, lng: 132.4553 }, description: 'City of peace' },
    { name: 'Nara', type: 'city', coordinates: { lat: 34.6851, lng: 135.8048 }, description: 'Ancient capital with deer' },
    { name: 'Narita Airport', type: 'airport', coordinates: { lat: 35.7720, lng: 140.3929 }, description: 'Main Tokyo airport (NRT)' },
    { name: 'Fushimi Inari Shrine', type: 'attraction', coordinates: { lat: 34.9671, lng: 135.7727 }, description: 'Iconic torii gates' },
    { name: 'Senso-ji Temple', type: 'attraction', coordinates: { lat: 35.7148, lng: 139.7967 }, description: 'Tokyo\'s oldest temple' }
  ]
};

// Export all destination data
export const allDestinationData: Record<string, Partial<TravelGuide>> = {
  morocco: moroccoData,
  marrakech: moroccoData,
  fes: moroccoData,
  casablanca: moroccoData,
  chefchaouen: moroccoData,
  japan: japanData,
  tokyo: japanData,
  kyoto: japanData,
  osaka: japanData,
};
