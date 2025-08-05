require('dotenv').config();
const express = require('express');
const axios = require('axios');
const router = express.Router();
const TravelPlan = require('../models/TravelPlan');
const { generateItinerary } = require('../utils/ai');
const { generatePDF } = require('../utils/pdf');
const { sendItineraryEmail } = require('../utils/email');
const path = require('path');

// Test endpoint - simple response without AI
router.post('/test', (req, res) => {
  res.json({ 
    message: 'Test endpoint working',
    body: req.body,
    timestamp: new Date().toISOString()
  });
});

// Google Places API integration for real places
async function fetchPlacesFromAPI(destination, type) {
  try {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
      console.log('Google Places API key not found, using fallback data');
      return null;
    }

    const query = `${type} in ${destination}`;
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${apiKey}&type=${type}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status === 'OK' && data.results) {
      return data.results.slice(0, 8).map(place => ({
        activity: `Visit ${place.name}`,
        location: place.formatted_address || place.name,
        rating: place.rating,
        types: place.types
      }));
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching ${type} places for ${destination}:`, error);
    return null;
  }
}

// Fallback data for when API is not available
const fallbackAttractions = {
  sightseeing: [
    { activity: 'Visit local landmarks', location: 'City Center' },
    { activity: 'Explore historical monuments', location: 'Old Town' },
    { activity: 'See famous architecture', location: 'Architectural District' },
    { activity: 'Visit local museums', location: 'Museum District' },
    { activity: 'Walk through city gardens', location: 'Botanical Gardens' },
    { activity: 'See local palaces', location: 'Royal District' },
    { activity: 'Explore city markets', location: 'Central Market' },
    { activity: 'Visit religious sites', location: 'Sacred Places' }
  ],
  food: [
    { activity: 'Try local cuisine', location: 'Traditional Restaurant' },
    { activity: 'Visit food markets', location: 'Food Market' },
    { activity: 'Wine tasting experience', location: 'Wine Cellar' },
    { activity: 'Cooking class', location: 'Culinary School' },
    { activity: 'Street food tour', location: 'Street Food District' },
    { activity: 'Fine dining experience', location: 'Upscale Restaurant' },
    { activity: 'Coffee culture tour', location: 'Coffee District' },
    { activity: 'Local brewery visit', location: 'Craft Brewery' }
  ],
  culture: [
    { activity: 'Attend local festival', location: 'Festival Grounds' },
    { activity: 'Visit art galleries', location: 'Art District' },
    { activity: 'Watch traditional dance', location: 'Cultural Center' },
    { activity: 'Learn local language', location: 'Language School' },
    { activity: 'Visit religious sites', location: 'Sacred Places' },
    { activity: 'Attend theater performance', location: 'Theater District' },
    { activity: 'Explore local crafts', location: 'Craft Village' },
    { activity: 'Visit cultural museums', location: 'Cultural Museum' }
  ],
  relaxation: [
    { activity: 'Spa and wellness', location: 'Wellness Center' },
    { activity: 'Yoga session', location: 'Yoga Studio' },
    { activity: 'Meditation retreat', location: 'Meditation Garden' },
    { activity: 'Beach relaxation', location: 'Beach Resort' },
    { activity: 'Mountain retreat', location: 'Mountain Lodge' },
    { activity: 'Hot springs visit', location: 'Hot Springs' },
    { activity: 'Forest bathing', location: 'Nature Reserve' },
    { activity: 'Sunset viewing', location: 'Sunset Point' }
  ],
  adventure: [
    { activity: 'Hiking adventure', location: 'Mountain Trails' },
    { activity: 'Water sports', location: 'Water Sports Center' },
    { activity: 'Rock climbing', location: 'Climbing Center' },
    { activity: 'Cycling tour', location: 'Cycling Routes' },
    { activity: 'Zip lining', location: 'Adventure Park' },
    { activity: 'Cave exploration', location: 'Cave System' },
    { activity: 'Wildlife safari', location: 'Wildlife Reserve' },
    { activity: 'Paragliding', location: 'Paragliding Site' }
  ],
  shopping: [
    { activity: 'Visit shopping malls', location: 'Shopping Center' },
    { activity: 'Explore local markets', location: 'Local Market' },
    { activity: 'Antique shopping', location: 'Antique District' },
    { activity: 'Fashion boutiques', location: 'Fashion Street' },
    { activity: 'Craft shopping', location: 'Craft Market' },
    { activity: 'Bookstore browsing', location: 'Book District' },
    { activity: 'Jewelry shopping', location: 'Jewelry Quarter' },
    { activity: 'Souvenir hunting', location: 'Tourist Market' }
  ]
};

// Real destinations and their attractions (for popular cities)
const destinationAttractions = {
  'london': {
    sightseeing: [
      { activity: 'Visit Big Ben and Houses of Parliament', location: 'Westminster, London' },
      { activity: 'Explore the Tower of London', location: 'Tower Hill, London' },
      { activity: 'See Buckingham Palace', location: 'Westminster, London' },
      { activity: 'Walk across Tower Bridge', location: 'Tower Bridge, London' },
      { activity: 'Visit Westminster Abbey', location: 'Westminster, London' },
      { activity: 'Explore St. Paul\'s Cathedral', location: 'City of London' },
      { activity: 'See the London Eye', location: 'South Bank, London' },
      { activity: 'Visit Trafalgar Square', location: 'Westminster, London' }
    ],
    food: [
      { activity: 'Traditional Fish & Chips', location: 'Poetry Fish & Chips, London' },
      { activity: 'Afternoon Tea at The Ritz', location: 'The Ritz London' },
      { activity: 'Borough Market Food Tour', location: 'Borough Market, London Bridge' },
      { activity: 'Gourmet Dinner at Sketch', location: 'Sketch, Mayfair' },
      { activity: 'Indian Cuisine at Dishoom', location: 'Dishoom, Covent Garden' },
      { activity: 'Pub Lunch at The Churchill Arms', location: 'The Churchill Arms, Kensington' },
      { activity: 'Chocolate Workshop at Hotel Chocolat', location: 'Hotel Chocolat, Covent Garden' },
      { activity: 'Gin Tasting at Beefeater Distillery', location: 'Beefeater Distillery, Kennington' }
    ],
    culture: [
      { activity: 'Visit the British Museum', location: 'British Museum, Bloomsbury' },
      { activity: 'Explore the National Gallery', location: 'National Gallery, Trafalgar Square' },
      { activity: 'Watch a West End Show', location: 'West End Theatre District' },
      { activity: 'Visit the Tate Modern', location: 'Tate Modern, Bankside' },
      { activity: 'Explore Camden Market', location: 'Camden Market, Camden Town' },
      { activity: 'Visit the Natural History Museum', location: 'Natural History Museum, South Kensington' },
      { activity: 'Explore the Victoria & Albert Museum', location: 'V&A Museum, South Kensington' },
      { activity: 'Visit Shakespeare\'s Globe', location: 'Shakespeare\'s Globe, Bankside' }
    ],
    relaxation: [
      { activity: 'Spa Day at The Dorchester', location: 'The Dorchester Spa, Mayfair' },
      { activity: 'Yoga in Hyde Park', location: 'Hyde Park, London' },
      { activity: 'Boat Ride on the Thames', location: 'Thames River Cruise' },
      { activity: 'Afternoon in Kew Gardens', location: 'Royal Botanic Gardens, Kew' },
      { activity: 'Relax at Hampstead Heath', location: 'Hampstead Heath, North London' },
      { activity: 'Visit the Sky Garden', location: 'Sky Garden, Fenchurch Street' },
      { activity: 'Walk along the South Bank', location: 'South Bank, London' },
      { activity: 'Visit Regent\'s Park', location: 'Regent\'s Park, London' }
    ],
    adventure: [
      { activity: 'Climb the O2 Arena', location: 'The O2 Arena, Greenwich' },
      { activity: 'Cycling in Richmond Park', location: 'Richmond Park, London' },
      { activity: 'Rock Climbing at The Castle', location: 'The Castle Climbing Centre, Stoke Newington' },
      { activity: 'Zip Line at Go Ape', location: 'Go Ape, Battersea Park' },
      { activity: 'Kayaking on the Thames', location: 'Thames Kayaking, Putney' },
      { activity: 'Escape Room Challenge', location: 'Escape Hunt, Oxford Street' },
      { activity: 'Indoor Skydiving', location: 'iFLY Indoor Skydiving, Milton Keynes' },
      { activity: 'High Ropes Course', location: 'Tree Top Adventure, Battersea' }
    ],
    shopping: [
      { activity: 'Shop at Oxford Street', location: 'Oxford Street, London' },
      { activity: 'Explore Covent Garden Market', location: 'Covent Garden Market' },
      { activity: 'Visit Harrods', location: 'Harrods, Knightsbridge' },
      { activity: 'Shop at Portobello Market', location: 'Portobello Road Market, Notting Hill' },
      { activity: 'Explore Carnaby Street', location: 'Carnaby Street, Soho' },
      { activity: 'Visit Liberty London', location: 'Liberty London, Regent Street' },
      { activity: 'Shop at Selfridges', location: 'Selfridges, Oxford Street' },
      { activity: 'Explore Spitalfields Market', location: 'Spitalfields Market, East London' }
    ]
  },
  'indore': {
    sightseeing: [
      { activity: 'Visit Rajwada Palace', location: 'Rajwada Palace, Indore' },
      { activity: 'Explore Lal Bagh Palace', location: 'Lal Bagh Palace, Indore' },
      { activity: 'See Kanch Mandir', location: 'Kanch Mandir, Indore' },
      { activity: 'Visit Central Museum', location: 'Central Museum, Indore' },
      { activity: 'Explore Annapurna Temple', location: 'Annapurna Temple, Indore' },
      { activity: 'See Gomatgiri', location: 'Gomatgiri, Indore' },
      { activity: 'Visit Bada Ganpati', location: 'Bada Ganpati Temple, Indore' },
      { activity: 'Explore Chhatris', location: 'Chhatris, Indore' }
    ],
    food: [
      { activity: 'Try Poha Jalebi', location: '56 Dukaan, Indore' },
      { activity: 'Visit Sarafa Bazaar', location: 'Sarafa Bazaar, Indore' },
      { activity: 'Try Bhutte ka Kees', location: 'Local Food Stalls, Indore' },
      { activity: 'Visit Chappan Dukaan', location: '56 Dukaan, Indore' },
      { activity: 'Try Garadu', location: 'Street Food Vendors, Indore' },
      { activity: 'Visit Food Street', location: 'Food Street, Indore' },
      { activity: 'Try Sabudana Khichdi', location: 'Local Restaurants, Indore' },
      { activity: 'Visit Traditional Restaurants', location: 'Old Indore Area' }
    ],
    culture: [
      { activity: 'Visit Central Museum', location: 'Central Museum, Indore' },
      { activity: 'Explore Tribal Museum', location: 'Tribal Museum, Indore' },
      { activity: 'Watch Traditional Dance', location: 'Cultural Centers, Indore' },
      { activity: 'Visit Art Galleries', location: 'Art District, Indore' },
      { activity: 'Explore Local Crafts', location: 'Craft Markets, Indore' },
      { activity: 'Visit Religious Sites', location: 'Temple District, Indore' },
      { activity: 'Attend Cultural Events', location: 'Cultural Centers, Indore' },
      { activity: 'Learn Local Traditions', location: 'Heritage Centers, Indore' }
    ],
    relaxation: [
      { activity: 'Visit Pipliyapala Regional Park', location: 'Pipliyapala Regional Park, Indore' },
      { activity: 'Yoga at Local Centers', location: 'Yoga Centers, Indore' },
      { activity: 'Meditation at Temples', location: 'Temple Gardens, Indore' },
      { activity: 'Walk in City Parks', location: 'City Parks, Indore' },
      { activity: 'Visit Botanical Gardens', location: 'Botanical Gardens, Indore' },
      { activity: 'Relax at Water Bodies', location: 'Lakes and Ponds, Indore' },
      { activity: 'Spa and Wellness', location: 'Wellness Centers, Indore' },
      { activity: 'Sunset Viewing', location: 'High Points, Indore' }
    ],
    adventure: [
      { activity: 'Trekking at Local Hills', location: 'Hills around Indore' },
      { activity: 'Cycling Tours', location: 'Cycling Routes, Indore' },
      { activity: 'Rock Climbing', location: 'Adventure Centers, Indore' },
      { activity: 'Water Sports', location: 'Water Sports Centers, Indore' },
      { activity: 'Zip Lining', location: 'Adventure Parks, Indore' },
      { activity: 'Escape Rooms', location: 'Escape Room Centers, Indore' },
      { activity: 'Indoor Sports', location: 'Sports Complexes, Indore' },
      { activity: 'Outdoor Activities', location: 'Adventure Parks, Indore' }
    ],
    shopping: [
      { activity: 'Shop at 56 Dukaan', location: '56 Dukaan, Indore' },
      { activity: 'Visit Sarafa Bazaar', location: 'Sarafa Bazaar, Indore' },
      { activity: 'Explore Rajwada Market', location: 'Rajwada Market, Indore' },
      { activity: 'Visit Shopping Malls', location: 'Shopping Malls, Indore' },
      { activity: 'Shop for Traditional Items', location: 'Traditional Markets, Indore' },
      { activity: 'Visit Fashion Street', location: 'Fashion Street, Indore' },
      { activity: 'Explore Local Markets', location: 'Local Markets, Indore' },
      { activity: 'Shop for Handicrafts', location: 'Craft Markets, Indore' }
    ]
  }
};

// Create a new travel plan
router.post('/', async (req, res) => {
  try {
    console.log('Received travel plan request:', req.body);
    
    const { userId, destination, startDate, endDate, interests } = req.body;
    
    // Validate required fields
    if (!destination || !startDate || !endDate || !interests) {
      return res.status(400).json({ 
        error: 'Missing required fields: destination, startDate, endDate, interests' 
      });
    }
    
    // Calculate number of days
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    
    console.log(`Creating ${days}-day itinerary for ${destination}`);
    
    // Get destination-specific attractions or use API/fallback
    const destinationKey = destination.toLowerCase();
    let activityTemplates = destinationAttractions[destinationKey];
    
    // If no predefined data, try to fetch from API or use fallback
    if (!activityTemplates) {
      console.log(`No predefined data for ${destination}, attempting API fetch...`);
      
      // Try to fetch real places from Google Places API
      const apiTypes = {
        sightseeing: 'tourist_attraction',
        food: 'restaurant',
        culture: 'museum',
        relaxation: 'park',
        adventure: 'amusement_park',
        shopping: 'shopping_mall'
      };
      
      activityTemplates = {};
      
      // Fetch places for each interest type
      for (const [interestType, apiType] of Object.entries(apiTypes)) {
        const places = await fetchPlacesFromAPI(destination, apiType);
        if (places && places.length > 0) {
          activityTemplates[interestType] = places;
        } else {
          // Use fallback data if API fails
          activityTemplates[interestType] = fallbackAttractions[interestType].map(item => ({
            ...item,
            activity: item.activity.replace('local', destination),
            location: item.location.replace('City Center', `${destination} City Center`)
          }));
        }
      }
    }
    
    // Create activities for each day
    const itineraryDays = [];
    for (let i = 1; i <= days; i++) {
      const currentDate = new Date(start);
      currentDate.setDate(start.getDate() + i - 1);
      const dateString = currentDate.toISOString().split('T')[0];
      
      const dayActivities = [];
      
      // Add varied activities based on interests
      const availableTypes = ['sightseeing', 'food', 'culture', 'relaxation', 'adventure', 'shopping'];
      
      // Select 4-5 different activities for each day
      const selectedTypes = [];
      if (interests.includes('Sightseeing')) selectedTypes.push('sightseeing');
      if (interests.includes('Food & Dining')) selectedTypes.push('food');
      if (interests.includes('Culture')) selectedTypes.push('culture');
      if (interests.includes('Relaxation')) selectedTypes.push('relaxation');
      if (interests.includes('Adventure')) selectedTypes.push('adventure');
      if (interests.includes('Shopping')) selectedTypes.push('shopping');
      
      // If no specific interests, use all types
      if (selectedTypes.length === 0) {
        selectedTypes.push(...availableTypes);
      }
      
      // Shuffle and select activities for this day
      const shuffledTypes = [...selectedTypes].sort(() => Math.random() - 0.5);
      const dayTypes = shuffledTypes.slice(0, Math.min(5, shuffledTypes.length));
      
      const times = ["09:00 AM", "11:00 AM", "02:00 PM", "04:00 PM", "06:00 PM"];
      
      dayTypes.forEach((type, index) => {
        const templates = activityTemplates[type];
        if (templates && templates.length > 0) {
          const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
          
          dayActivities.push({
            time: times[index] || "10:00 AM",
            activity: `Day ${i}: ${randomTemplate.activity}`,
            location: randomTemplate.location,
            type: type
          });
        }
      });
      
      // Add interest-specific activities
      if (interests.includes('Nightlife')) {
        dayActivities.push({
          time: "08:00 PM",
          activity: `Day ${i}: Nightlife experience`,
          location: `${destination} Entertainment District`,
          type: "culture"
        });
      }
      
      if (interests.includes('hiking') || interests.includes('Hiking')) {
        dayActivities.push({
          time: "10:00 AM",
          activity: `Day ${i}: Hiking adventure`,
          location: `${destination} Nature Trails`,
          type: "adventure"
        });
      }
      
      itineraryDays.push({
        day: i,
        date: dateString,
        activities: dayActivities
      });
    }
    
    // Create a complete itinerary
    const testItinerary = {
      destination: destination,
      duration: `${days} days`,
      interests: interests,
      itinerary: itineraryDays
    };
    
    console.log(`Generated ${days}-day itinerary with ${itineraryDays.length} days`);
    
    const plan = new TravelPlan({ userId, destination, startDate, endDate, interests, itinerary: testItinerary });
    await plan.save();
    console.log('Travel plan saved to database');
    
    res.status(201).json(plan);
  } catch (err) {
    console.error('Error in travel plan creation:', err);
    res.status(500).json({ 
      error: err.message,
      details: 'Failed to create travel plan. Please check server logs for more details.'
    });
  }
});

// Get all travel plans for a user
router.get('/:userId', async (req, res) => {
  try {
    const plans = await TravelPlan.find({ userId: req.params.userId });
    res.json(plans);
  } catch (err) {
    console.error('Error fetching travel plans:', err);
    res.status(500).json({ error: err.message });
  }
});

// Export itinerary as PDF
router.post('/export-pdf', async (req, res) => {
  try {
    const { itinerary } = req.body;
    const filePath = path.join(__dirname, '../exports/itinerary.pdf');
    generatePDF(itinerary, filePath);
    // Wait for file to be written
    setTimeout(() => {
      res.download(filePath, 'itinerary.pdf');
    }, 1000);
  } catch (err) {
    console.error('Error exporting PDF:', err);
    res.status(500).json({ error: err.message });
  }
});

// Send itinerary via email
router.post('/send-email', async (req, res) => {
  try {
    const { itinerary, email, subject } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        error: 'Email address is required' 
      });
    }
    
    // Send email
    const result = await sendItineraryEmail(email, itinerary, subject);
    
    res.json({ success: true, messageId: result.messageId });
  } catch (err) {
    console.error('Error sending email:', err);
    res.status(500).json({ error: err.message });
  }
});


// Get famous places for a city using Nominatim (OpenStreetMap) and OpenTripMap
router.get('/places', async (req, res) => {
  const { city } = req.query;
  if (!city) return res.status(400).json({ error: 'City is required' });
  try {
    // 1. Geocode city using Nominatim
    const geoRes = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: city,
        format: 'json',
        limit: 1,
      },
      headers: {
        'User-Agent': 'ai-travel-app/1.0 (your@email.com)'
      }
    });
    if (!geoRes.data.length) return res.status(404).json({ error: 'City not found' });
    const { lat, lon } = geoRes.data[0];

    // 2. Get famous places from OpenTripMap
    // You can get a free API key at https://opentripmap.io/
    const apiKey = process.env.OPENTRIPMAP_API_KEY || '5ae2e3f221c38a28845f05b611c5446a'; // demo key, replace for production
    // Get list of places (radius 10km, kinds: interesting_places)
    const placesRes = await axios.get('https://api.opentripmap.com/0.1/en/places/radius', {
      params: {
        radius: 10000,
        lon,
        lat,
        kinds: 'interesting_places',
        format: 'json',
        apikey: apiKey,
        limit: 20,
      }
    });
    // Get details for each place (name, address, etc.)
    const places = await Promise.all(
      placesRes.data.map(async (place) => {
        try {
          const detailRes = await axios.get(`https://api.opentripmap.com/0.1/en/places/xid/${place.xid}`, {
            params: { apikey: apiKey }
          });
          const d = detailRes.data;
          return {
            name: d.name,
            address: d.address?.road || d.address?.suburb || d.address?.city || '',
            kinds: d.kinds,
            wikipedia: d.wikipedia_extracts?.text || '',
            image: d.preview?.source || '',
            xid: d.xid,
            lat: d.point?.lat,
            lon: d.point?.lon,
          };
        } catch {
          return null;
        }
      })
    );
    res.json({ city, places: places.filter(Boolean) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
