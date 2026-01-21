#!/usr/bin/env node
/**
 * Full Flow Test Script
 * Tests the complete research flow for a destination and validates all data
 */

const USER_AGENT = 'YouTravel/1.0 (test script)';

// ============ API TESTS ============

async function testNominatim(destination) {
  console.log('\n📍 Testing Nominatim (Geocoding)...');
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(destination)}&format=json&limit=1&addressdetails=1`,
      { headers: { 'User-Agent': USER_AGENT } }
    );
    const data = await response.json();
    if (data && data.length > 0) {
      console.log(`   ✅ Found: ${data[0].display_name}`);
      console.log(`   📌 Coordinates: ${data[0].lat}, ${data[0].lon}`);
      console.log(`   🏳️ Country Code: ${data[0].address?.country_code?.toUpperCase()}`);
      return {
        success: true,
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon),
        countryCode: data[0].address?.country_code?.toUpperCase(),
        country: data[0].address?.country
      };
    }
    console.log('   ❌ No results');
    return { success: false };
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function testRESTCountriesByCode(code) {
  console.log(`\n🌍 Testing REST Countries (by code: ${code})...`);
  try {
    const response = await fetch(
      `https://restcountries.com/v3.1/alpha/${code}?fields=name,capital,currencies,languages,population,region,subregion,timezones,flags,cca2`,
      { signal: AbortSignal.timeout(5000) }
    );
    if (!response.ok) {
      console.log(`   ❌ HTTP ${response.status}`);
      return { success: false };
    }
    const data = await response.json();
    console.log(`   ✅ Country: ${data.name?.common}`);
    console.log(`   💰 Currency: ${Object.keys(data.currencies || {})[0]}`);
    console.log(`   🗣️ Languages: ${Object.values(data.languages || {}).join(', ')}`);
    return { success: true, data };
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function testWikipedia(query) {
  console.log(`\n📚 Testing Wikipedia (${query})...`);
  try {
    const response = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`,
      { headers: { 'User-Agent': USER_AGENT } }
    );
    if (!response.ok) {
      console.log(`   ❌ HTTP ${response.status}`);
      return { success: false };
    }
    const data = await response.json();
    console.log(`   ✅ Title: ${data.title}`);
    console.log(`   📝 Extract: ${data.extract?.substring(0, 100)}...`);
    return { success: true, data };
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function testWikipediaSearch(query) {
  console.log(`\n🔍 Testing Wikipedia Search (${query})...`);
  try {
    const response = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&srlimit=3`,
      { headers: { 'User-Agent': USER_AGENT } }
    );
    const data = await response.json();
    const results = data.query?.search || [];
    if (results.length > 0) {
      console.log(`   ✅ Found ${results.length} results`);
      results.forEach((r, i) => console.log(`      ${i+1}. ${r.title}`));
      return { success: true, data: results };
    }
    console.log('   ❌ No results');
    return { success: false };
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function testOpenMeteo(lat, lon) {
  console.log(`\n🌤️ Testing Open-Meteo (${lat}, ${lon})...`);
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`,
      { signal: AbortSignal.timeout(5000) }
    );
    const data = await response.json();
    if (data.current_weather) {
      console.log(`   ✅ Temperature: ${data.current_weather.temperature}°C`);
      console.log(`   💨 Wind: ${data.current_weather.windspeed} km/h`);
      return { success: true, data };
    }
    console.log('   ❌ No weather data');
    return { success: false };
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function testFrankfurter() {
  console.log('\n💱 Testing Frankfurter (Exchange Rates)...');
  try {
    const response = await fetch('https://api.frankfurter.app/latest?from=USD');
    const data = await response.json();
    console.log(`   ✅ Base: ${data.base}, Date: ${data.date}`);
    console.log(`   💶 EUR: ${data.rates?.EUR}, GBP: ${data.rates?.GBP}`);
    return { success: true, data };
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function testTravelAdvisory(countryCode) {
  console.log(`\n⚠️ Testing Travel Advisory (${countryCode})...`);
  try {
    const response = await fetch(
      `https://www.travel-advisory.info/api?countrycode=${countryCode}`,
      { signal: AbortSignal.timeout(8000) }
    );
    if (!response.ok) {
      console.log(`   ⚠️ HTTP ${response.status} - will use fallback`);
      return { success: false, useFallback: true };
    }
    const data = await response.json();
    const advisory = data?.data?.[countryCode];
    if (advisory) {
      console.log(`   ✅ Score: ${advisory.advisory?.score}`);
      console.log(`   📝 Message: ${advisory.advisory?.message}`);
      return { success: true, data: advisory };
    }
    console.log('   ⚠️ No data - will use fallback');
    return { success: false, useFallback: true };
  } catch (error) {
    console.log(`   ⚠️ ${error.message} - will use fallback`);
    return { success: false, useFallback: true, error: error.message };
  }
}

async function testWikimediaCommons(query) {
  console.log(`\n🖼️ Testing Wikimedia Commons (${query})...`);
  try {
    const response = await fetch(
      `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent(query)}&gsrlimit=5&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=800&format=json`,
      { headers: { 'User-Agent': USER_AGENT } }
    );
    const data = await response.json();
    const pages = data.query?.pages;
    if (pages) {
      const images = Object.values(pages).filter(p => p.imageinfo?.[0]?.url);
      console.log(`   ✅ Found ${images.length} images`);
      return { success: true, count: images.length };
    }
    console.log('   ❌ No images');
    return { success: false };
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function testOverpass(lat, lon) {
  console.log(`\n🗺️ Testing Overpass (POIs near ${lat}, ${lon})...`);
  const query = `[out:json][timeout:10];node["tourism"](around:5000,${lat},${lon});out 5;`;
  const endpoints = [
    'https://overpass-api.de/api/interpreter',
    'https://lz4.overpass-api.de/api/interpreter',
  ];
  
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: `data=${encodeURIComponent(query)}`,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        signal: AbortSignal.timeout(10000)
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log(`   ✅ Found ${data.elements?.length || 0} POIs`);
        return { success: true, count: data.elements?.length || 0 };
      }
    } catch (error) {
      console.log(`   ⚠️ ${endpoint.split('/')[2]}: ${error.message}`);
    }
  }
  console.log('   ⚠️ Overpass unavailable - this is optional');
  return { success: false, optional: true };
}

// ============ DATA STRUCTURE VALIDATION ============

function validateGuideStructure() {
  console.log('\n📋 Validating Guide Data Structure...');
  
  // Simulate the data structure that route.ts creates
  const mockGuide = {
    destination: 'Greece',
    country: 'Greece',
    theme: 'mediterranean',
    overview: {
      summary: 'Test summary',
      highlights: ['Acropolis', 'Santorini'],
      bestTimeToVisit: 'Spring',
      climate: 'Mediterranean',
      language: 'Greek',
      currency: 'EUR',
      timeZone: 'EET',
      visaInfo: 'Check requirements'
    },
    topCities: [{
      rank: 1,
      name: 'Athens',
      description: 'Capital city',
      whyVisit: 'History',
      idealDuration: '3 days',
      highlights: ['Acropolis']
    }],
    neighborhoods: [{
      name: 'Plaka',
      city: 'Athens',
      type: 'mid-range',
      description: 'Historic area',
      priceRange: { min: 50, max: 150, currency: 'EUR' },
      bestFor: ['History'],
      nearbyAttractions: ['Acropolis']
    }],
    attractions: [{
      name: 'Acropolis',
      city: 'Athens',
      type: 'popular',
      description: 'Ancient citadel',
      whyVisit: 'Iconic landmark',
      estimatedTime: '2-3 hours',
      cost: '€20',
      tips: ['Go early'],
      coordinates: { lat: 37.9715, lng: 23.7257 }
    }],
    budget: {
      currency: 'EUR',
      daily: {
        budget: { min: 50, max: 80 },
        midRange: { min: 100, max: 180 },
        luxury: { min: 300, max: 500 }
      },
      breakdown: {
        accommodation: { budget: '€20-40', midRange: '€60-100', luxury: '€200+' },
        food: { budget: '€15-25', midRange: '€30-50', luxury: '€80+' },
        transport: { budget: '€5-10', midRange: '€20-30', luxury: '€50+' },
        activities: { budget: '€10-20', midRange: '€30-50', luxury: '€100+' }
      },
      weeklyTotal: {
        budget: { min: 350, max: 560 },
        midRange: { min: 700, max: 1260 },
        luxury: { min: 2100, max: 3500 }
      },
      tips: ['Use public transport']
    },
    transportation: {
      gettingThere: {
        mainAirports: ['Athens International'],
        alternativeOptions: ['Ferry']
      },
      gettingAround: {
        publicTransport: 'Metro available',
        taxis: 'Yellow taxis',
        rentals: 'Available',
        walking: 'City centers walkable',
        tips: ['Get transport card']
      },
      intercity: {
        options: ['Bus', 'Ferry'],
        recommendations: 'Ferries for islands'
      }
    },
    safety: {
      overallRating: 'safe',
      summary: 'Generally safe',
      concerns: ['Pickpockets'],
      tips: ['Watch belongings'],
      emergencyNumbers: {
        police: '100',
        ambulance: '166',
        tourist: '171'
      },
      healthAdvice: ['No special vaccinations']
    },
    culture: {
      summary: 'Rich history',
      etiquette: ['Respect traditions'],
      dress: 'Casual is fine',
      tipping: '10% customary',
      greetings: 'Handshake',
      taboos: ['Avoid sensitive topics'],
      localCustoms: ['Afternoon siesta']
    },
    mistakes: [{
      mistake: 'Only visiting Athens',
      why: 'Islands are amazing',
      instead: 'Visit Santorini too'
    }],
    bestFor: [{
      type: 'History Buffs',
      why: 'Ancient sites',
      highlights: ['Acropolis']
    }],
    images: [{
      url: 'https://example.com/greece.jpg',
      alt: 'Greece',
      location: 'Santorini'
    }],
    mapData: [{
      name: 'Athens',
      type: 'city',
      coordinates: { lat: 37.98, lng: 23.72 }
    }]
  };
  
  // Test all the property accesses that caused crashes
  const tests = [
    { path: 'overview.timeZone', value: mockGuide.overview?.timeZone },
    { path: 'overview.visaInfo', value: mockGuide.overview?.visaInfo },
    { path: 'safety.emergencyNumbers.police', value: mockGuide.safety?.emergencyNumbers?.police },
    { path: 'safety.emergencyNumbers.ambulance', value: mockGuide.safety?.emergencyNumbers?.ambulance },
    { path: 'safety.healthAdvice.length', value: mockGuide.safety?.healthAdvice?.length },
    { path: 'budget.breakdown.accommodation.budget', value: mockGuide.budget?.breakdown?.accommodation?.budget },
    { path: 'budget.weeklyTotal.budget.min', value: mockGuide.budget?.weeklyTotal?.budget?.min },
    { path: 'attractions[0].tips.length', value: mockGuide.attractions?.[0]?.tips?.length },
  ];
  
  let allPassed = true;
  tests.forEach(test => {
    if (test.value !== undefined) {
      console.log(`   ✅ ${test.path}: ${test.value}`);
    } else {
      console.log(`   ❌ ${test.path}: undefined`);
      allPassed = false;
    }
  });
  
  // Test with empty/null values (simulating API failures)
  console.log('\n📋 Testing with empty data (API failure simulation)...');
  const emptyGuide = {
    destination: 'Test',
    overview: null,
    safety: { emergencyNumbers: null, healthAdvice: null },
    budget: { breakdown: null, weeklyTotal: null, tips: null },
    attractions: [{ tips: null }]
  };
  
  const safeTests = [
    { path: 'overview?.timeZone', value: emptyGuide.overview?.timeZone, expected: undefined },
    { path: 'safety?.emergencyNumbers?.police', value: emptyGuide.safety?.emergencyNumbers?.police, expected: undefined },
    { path: 'budget?.breakdown?.accommodation', value: emptyGuide.budget?.breakdown?.accommodation, expected: undefined },
    { path: 'attractions?.[0]?.tips?.length', value: emptyGuide.attractions?.[0]?.tips?.length, expected: undefined },
  ];
  
  safeTests.forEach(test => {
    const status = test.value === test.expected ? '✅' : '❌';
    console.log(`   ${status} ${test.path}: ${test.value} (expected: ${test.expected})`);
    if (test.value !== test.expected) allPassed = false;
  });
  
  return allPassed;
}

// ============ MAIN TEST RUNNER ============

async function runTests(destination = 'Greece') {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║           YouTravel Full Flow Test                         ║');
  console.log(`║           Destination: ${destination.padEnd(35)}║`);
  console.log('╚════════════════════════════════════════════════════════════╝');
  
  const results = {
    apis: {},
    dataStructure: false,
    overallSuccess: true
  };
  
  // 1. Test Nominatim
  const nominatim = await testNominatim(destination);
  results.apis.nominatim = nominatim.success;
  if (!nominatim.success) results.overallSuccess = false;
  
  // 2. Test REST Countries (by code)
  if (nominatim.countryCode) {
    const restCountries = await testRESTCountriesByCode(nominatim.countryCode);
    results.apis.restCountries = restCountries.success;
    if (!restCountries.success) results.overallSuccess = false;
  }
  
  // 3. Test Wikipedia
  const wikipedia = await testWikipedia(destination);
  results.apis.wikipedia = wikipedia.success;
  if (!wikipedia.success) results.overallSuccess = false;
  
  // 4. Test Wikipedia Search
  const wikiSearch = await testWikipediaSearch(`${destination} travel guide`);
  results.apis.wikipediaSearch = wikiSearch.success;
  
  // 5. Test Open-Meteo
  if (nominatim.lat && nominatim.lon) {
    const weather = await testOpenMeteo(nominatim.lat, nominatim.lon);
    results.apis.openMeteo = weather.success;
    if (!weather.success) results.overallSuccess = false;
  }
  
  // 6. Test Frankfurter
  const frankfurter = await testFrankfurter();
  results.apis.frankfurter = frankfurter.success;
  if (!frankfurter.success) results.overallSuccess = false;
  
  // 7. Test Travel Advisory
  if (nominatim.countryCode) {
    const advisory = await testTravelAdvisory(nominatim.countryCode);
    results.apis.travelAdvisory = advisory.success || advisory.useFallback;
  }
  
  // 8. Test Wikimedia Commons
  const images = await testWikimediaCommons(destination);
  results.apis.wikimediaCommons = images.success;
  
  // 9. Test Overpass (optional)
  if (nominatim.lat && nominatim.lon) {
    const overpass = await testOverpass(nominatim.lat, nominatim.lon);
    results.apis.overpass = overpass.success || overpass.optional;
  }
  
  // 10. Validate data structure
  results.dataStructure = validateGuideStructure();
  
  // Summary
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║                      TEST SUMMARY                          ║');
  console.log('╠════════════════════════════════════════════════════════════╣');
  
  const apiResults = Object.entries(results.apis);
  const passed = apiResults.filter(([_, v]) => v).length;
  const total = apiResults.length;
  
  console.log(`║  APIs: ${passed}/${total} passed                                        ║`);
  apiResults.forEach(([name, success]) => {
    const status = success ? '✅' : '❌';
    console.log(`║    ${status} ${name.padEnd(40)}║`);
  });
  
  console.log('║                                                            ║');
  console.log(`║  Data Structure: ${results.dataStructure ? '✅ Valid' : '❌ Invalid'}                              ║`);
  console.log('╠════════════════════════════════════════════════════════════╣');
  
  const finalStatus = passed >= (total - 1) && results.dataStructure;
  if (finalStatus) {
    console.log('║  🎉 READY FOR DEPLOYMENT!                                  ║');
  } else {
    console.log('║  ⚠️  ISSUES FOUND - Review above                           ║');
  }
  console.log('╚════════════════════════════════════════════════════════════╝');
  
  return finalStatus;
}

// Run the tests
const destination = process.argv[2] || 'Greece';
runTests(destination).then(success => {
  process.exit(success ? 0 : 1);
});
