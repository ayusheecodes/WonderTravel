const { GoogleGenerativeAI } = require('@google/generative-ai');

const DESTINATION_LIBRARY = [
  {
    name: 'Manali',
    aliases: ['manali', 'solang', 'old manali'],
    state: 'Himachal Pradesh',
    region: 'North India',
    baseCoords: [77.1892, 32.2396],
    hotelBands: {
      budget: ['Zostel Old Manali', 'Backpacker Panda Manali', 'Hotel Mountain Face'],
      mid: ['Johnson Lodge', 'The Orchard Greens', 'Snow Valley Resorts'],
      luxury: ['Span Resort and Spa', 'Larisa Resort', 'Mastiff Grand Manali'],
    },
    transport: [
      'Volvo bus from Delhi to Manali overnight',
      'Private cab for Solang, Atal Tunnel and nearby day trips',
      'Bike or scooty rental for local exploration',
    ],
    foodSpots: ['Johnson Cafe', 'Cafe 1947', 'Drifters Inn', 'Dylan\'s Toasted and Roasted'],
    quickTips: [
      'Keep one slower acclimatization block on day 1.',
      'Start Solang or Rohtang-side activities early to avoid traffic.',
      'Carry layers even if afternoons feel warm.',
    ],
    activityPool: [
      { title: 'Hadimba Temple and cedar grove walk', type: 'culture', styleTags: ['relaxed', 'family', 'cultural'], cost: 100, dayPart: 'morning', tip: 'Combine with Old Manali for an easy first day.' },
      { title: 'Solang Valley adventure session', type: 'adventure', styleTags: ['adventure', 'family'], cost: 1800, dayPart: 'morning', tip: 'Paragliding and rope activities book out on weekends.' },
      { title: 'Old Manali cafe trail', type: 'food', styleTags: ['relaxed', 'budget', 'luxury'], cost: 500, dayPart: 'afternoon', tip: 'Walk between cafes instead of taking a cab.' },
      { title: 'Vashisht hot springs and village lanes', type: 'nature', styleTags: ['relaxed', 'budget', 'cultural'], cost: 150, dayPart: 'afternoon', tip: 'Best paired with a slow lunch stop.' },
      { title: 'Atal Tunnel scenic drive', type: 'nature', styleTags: ['adventure', 'family', 'luxury'], cost: 1200, dayPart: 'morning', tip: 'Road conditions can change quickly in winter.' },
      { title: 'Mall Road shopping and local snacks', type: 'shopping', styleTags: ['budget', 'family', 'relaxed'], cost: 600, dayPart: 'evening', tip: 'Great slot for souvenirs on the last evening.' },
      { title: 'Sunset riverside dinner', type: 'food', styleTags: ['luxury', 'relaxed', 'family'], cost: 900, dayPart: 'evening', tip: 'Reserve ahead in peak season.' },
    ],
  },
  {
    name: 'Goa',
    aliases: ['goa', 'north goa', 'south goa', 'panjim'],
    state: 'Goa',
    region: 'West India',
    baseCoords: [73.8180, 15.4989],
    hotelBands: {
      budget: ['Pappi Chulo Hostel', 'Happy Panda Hostel', 'Whoopers Boutique Goa'],
      mid: ['BloomSuites Calangute', 'Treehouse Nova', 'Grand Hyatt Goa'],
      luxury: ['W Goa', 'Taj Exotica', 'The Leela Goa'],
    },
    transport: [
      'Flight to Goa plus pre-booked airport transfer',
      'Scooter rental for flexible beach hopping',
      'Private cab for South Goa and heritage loops',
    ],
    foodSpots: ['Fisherman\'s Wharf', 'Gunpowder', 'Mum\'s Kitchen', 'Pousada by the Beach'],
    quickTips: [
      'Choose one side of Goa per day instead of crossing the state repeatedly.',
      'Keep afternoons lighter in hot months.',
      'Book beach stays early for long weekends and December travel.',
    ],
    activityPool: [
      { title: 'Sunrise beach walk and shack breakfast', type: 'nature', styleTags: ['relaxed', 'budget', 'family'], cost: 350, dayPart: 'morning', tip: 'South Goa works best for a calmer start.' },
      { title: 'Old Goa churches and Latin Quarter stroll', type: 'culture', styleTags: ['cultural', 'family', 'relaxed'], cost: 250, dayPart: 'morning', tip: 'Cluster these sites in one half-day heritage circuit.' },
      { title: 'Water sports block at a popular beach', type: 'adventure', styleTags: ['adventure', 'family'], cost: 2200, dayPart: 'afternoon', tip: 'Morning slots usually have better sea conditions.' },
      { title: 'Cafe hopping and local seafood lunch', type: 'food', styleTags: ['budget', 'luxury', 'relaxed'], cost: 700, dayPart: 'afternoon', tip: 'Ask for the catch of the day instead of ordering blind.' },
      { title: 'Mandovi sunset cruise or riverfront evening', type: 'leisure', styleTags: ['family', 'relaxed', 'luxury'], cost: 900, dayPart: 'evening', tip: 'A good fit for the second evening when energy dips.' },
      { title: 'Hidden cove and fort lookout loop', type: 'nature', styleTags: ['adventure', 'cultural', 'luxury'], cost: 500, dayPart: 'morning', tip: 'Carry water, shade is limited near the fort stretches.' },
      { title: 'Night market and dessert stop', type: 'shopping', styleTags: ['budget', 'family', 'luxury'], cost: 800, dayPart: 'evening', tip: 'Keep bargaining expectations realistic.' },
    ],
  },
  {
    name: 'Kerala',
    aliases: ['kerala', 'alleppey', 'munnar', 'kochi', 'wayanad', 'backwaters'],
    state: 'Kerala',
    region: 'South India',
    baseCoords: [76.2711, 9.9312],
    hotelBands: {
      budget: ['Zostel Kochi', 'Munnar Jungle Camp', 'The Lost Hostel Alleppey'],
      mid: ['Abad Turtle Beach', 'Eastend Munnar', 'Olive Downtown Kochi'],
      luxury: ['Kumarakom Lake Resort', 'Brunton Boatyard', 'SpiceTree Munnar'],
    },
    transport: [
      'Flight or train into Kochi depending on origin city',
      'Private cab for multi-stop hill and backwater routing',
      'Local ferry or tuk-tuk for short town hops',
    ],
    foodSpots: ['Kashi Art Cafe', 'Grand Pavilion', 'Rice Boat', 'Dal Roti'],
    quickTips: [
      'Avoid packing too many far-apart regions into a short trip.',
      'Backwaters and hill stations need different pacing, balance them.',
      'Monsoon travel is beautiful but needs weather buffers.',
    ],
    activityPool: [
      { title: 'Backwater cruise with village stops', type: 'nature', styleTags: ['relaxed', 'family', 'luxury'], cost: 2600, dayPart: 'morning', tip: 'Day cruises are better value on tighter budgets.' },
      { title: 'Tea garden walk and viewpoint stop', type: 'nature', styleTags: ['relaxed', 'family', 'budget'], cost: 300, dayPart: 'morning', tip: 'Cloud cover is lighter early in the day.' },
      { title: 'Kathakali or martial arts cultural show', type: 'culture', styleTags: ['cultural', 'family', 'luxury'], cost: 500, dayPart: 'evening', tip: 'Arrive early to watch the pre-show preparation.' },
      { title: 'Spice plantation and local lunch', type: 'food', styleTags: ['cultural', 'relaxed', 'family'], cost: 650, dayPart: 'afternoon', tip: 'Good bridge activity between travel legs.' },
      { title: 'Fort Kochi heritage loop', type: 'culture', styleTags: ['cultural', 'budget', 'relaxed'], cost: 250, dayPart: 'morning', tip: 'Walkable if you keep it to the heritage pocket.' },
      { title: 'Ayurvedic massage and quiet evening', type: 'leisure', styleTags: ['luxury', 'relaxed'], cost: 2200, dayPart: 'evening', tip: 'Perfect recovery block after a travel-heavy day.' },
      { title: 'Local market and snack trail', type: 'food', styleTags: ['budget', 'family', 'relaxed'], cost: 400, dayPart: 'evening', tip: 'Try appam, stew, banana chips and fresh juice.' },
    ],
  },
  {
    name: 'Ziro Valley',
    aliases: ['ziro', 'ziro valley'],
    state: 'Arunachal Pradesh',
    region: 'Northeast',
    baseCoords: [93.8398, 27.5385],
    hotelBands: {
      budget: ['Blue Pine Homestay', 'Ziro Backpackers', 'Local bamboo homestays'],
      mid: ['Siiro Resort', 'Hotel Anne Ziro', 'Cygnett Ziro'],
      luxury: ['Curated eco-lodges', 'Premium valley cottages', 'Boutique heritage stays'],
    },
    transport: [
      'Fly to Guwahati or Lilabari, then continue by road',
      'Dedicated local cab for sightseeing between villages',
      'Scooter rental only if comfortable on hilly roads',
    ],
    foodSpots: ['Local Apatani homestay meals', 'Abi\'s Cafe', 'small valley kitchens'],
    quickTips: [
      'Connectivity can be patchy, keep offline maps.',
      'Use a local driver if this is your first Northeast road trip.',
      'Homestays often create the best food and culture experience.',
    ],
    activityPool: [
      { title: 'Apatani village culture walk', type: 'culture', styleTags: ['cultural', 'family', 'relaxed'], cost: 300, dayPart: 'morning', tip: 'Go with a local guide for context and etiquette.' },
      { title: 'Pine ridge viewpoint hike', type: 'adventure', styleTags: ['adventure', 'budget'], cost: 400, dayPart: 'morning', tip: 'Weather shifts quickly after noon.' },
      { title: 'Local market food trail', type: 'food', styleTags: ['budget', 'cultural', 'relaxed'], cost: 350, dayPart: 'afternoon', tip: 'Ask before photographing local produce stalls.' },
      { title: 'Music and cafe evening', type: 'leisure', styleTags: ['relaxed', 'luxury'], cost: 500, dayPart: 'evening', tip: 'Best atmosphere on weekends and festival dates.' },
      { title: 'Bamboo grove and paddy field photography loop', type: 'nature', styleTags: ['adventure', 'cultural', 'relaxed'], cost: 150, dayPart: 'afternoon', tip: 'Golden hour is especially good here.' },
    ],
  },
  {
    name: 'Puri',
    aliases: ['puri', 'jagannath puri', 'odisha beach'],
    state: 'Odisha',
    region: 'East India',
    baseCoords: [85.8315, 19.8135],
    hotelBands: {
      budget: ['Zostel Puri', 'Chanakya BNR', 'Local Guesthouses'],
      mid: ['Mayfair Waves', 'Hans Coco Palm', 'Pramod Convention'],
      luxury: ['Mayfair Heritage', 'Sterling Puri', 'Toshali Sands'],
    },
    transport: [
      'Train to Puri Railway Station or flight to Bhubaneswar (60km away)',
      'Auto-rickshaws for local temple and beach runs',
      'Private cab for Konark and Chilika Lake day trips',
    ],
    foodSpots: ['Temple Mahaprasad', 'Dalma', 'Chung Wah', 'Bakers Boutique'],
    quickTips: [
      'Temple dress codes are strict; avoid shorts and sleeveless tops.',
      'Leave phones and leather items at the hotel or locker before entering Jagannath Temple.',
      'The sea can have strong undercurrents; swim only in designated safe zones.',
    ],
    activityPool: [
      { title: 'Jagannath Temple Darshan', type: 'culture', styleTags: ['cultural', 'family', 'relaxed'], cost: 200, dayPart: 'morning', tip: 'Go early morning (around 5:30 AM) to avoid massive crowds.' },
      { title: 'Golden Beach relaxation and surfing', type: 'leisure', styleTags: ['relaxed', 'family', 'adventure'], cost: 300, dayPart: 'afternoon', tip: 'Try the surfing schools if you are feeling adventurous.' },
      { title: 'Konark Sun Temple day trip', type: 'culture', styleTags: ['cultural', 'family', 'luxury'], cost: 1200, dayPart: 'morning', tip: 'Hire a guide at the temple to understand the architectural marvels.' },
      { title: 'Chilika Lake boating and dolphin spotting', type: 'nature', styleTags: ['nature', 'family', 'relaxed'], cost: 1500, dayPart: 'morning', tip: 'Satapada side is best for Irrawaddy dolphins.' },
      { title: 'Evening walk at Swargadwar Beach', type: 'shopping', styleTags: ['relaxed', 'budget', 'shopping'], cost: 400, dayPart: 'evening', tip: 'Great spot to buy sea shell souvenirs and local textiles.' },
      { title: 'Local Odia cuisine dinner', type: 'food', styleTags: ['food', 'cultural', 'budget'], cost: 600, dayPart: 'evening', tip: 'Try the local Chhena Poda (baked cheese dessert).' },
    ],
  },
  {
    name: 'Bhubaneswar',
    aliases: ['bhubaneswar', 'bhubaneshwar', 'temple city'],
    state: 'Odisha',
    region: 'East India',
    baseCoords: [85.8245, 20.2961],
    hotelBands: {
      budget: ['Ekamra Manor', 'Hotel Priya', 'Boutique Hostels'],
      mid: ['Lemon Tree Premier', 'Ginger Hotel', 'Fortune Park Sishmo'],
      luxury: ['Mayfair Lagoon', 'Trident Bhubaneswar', 'Vivanta Bhubaneswar'],
    },
    transport: [
      'Flight into Biju Patnaik International Airport',
      'MoBus (city buses) or Ola/Uber for local transit',
      'Private cab for heritage trails',
    ],
    foodSpots: ['Dalma', 'Odisha Hotel', 'Michael\'s Kitchen', 'Bocca Cafe'],
    quickTips: [
      'Start temple tours early; the sandstone gets very hot by noon.',
      'Ekamra Walks (heritage walk) on Sunday mornings is highly recommended.',
      'Combine Udayagiri and Khandagiri caves in a single trip.',
    ],
    activityPool: [
      { title: 'Lingaraj Temple and Bindu Sagar Lake', type: 'culture', styleTags: ['cultural', 'family', 'relaxed'], cost: 150, dayPart: 'morning', tip: 'Non-Hindus cannot enter the main temple but there is a viewing platform.' },
      { title: 'Udayagiri and Khandagiri Caves', type: 'culture', styleTags: ['cultural', 'adventure', 'family'], cost: 300, dayPart: 'afternoon', tip: 'Beware of monkeys; do not carry food openly.' },
      { title: 'Dhauli Shanti Stupa sunset', type: 'nature', styleTags: ['relaxed', 'cultural', 'family'], cost: 250, dayPart: 'evening', tip: 'Stay for the evening light and sound show.' },
      { title: 'Odisha State Museum', type: 'culture', styleTags: ['cultural', 'budget', 'family'], cost: 100, dayPart: 'morning', tip: 'Closed on Mondays.' },
      { title: 'Nandankanan Zoological Park', type: 'nature', styleTags: ['family', 'adventure', 'relaxed'], cost: 600, dayPart: 'morning', tip: 'Famous for the white tiger safari.' },
      { title: 'Street food at Ram Mandir Square', type: 'food', styleTags: ['food', 'budget', 'relaxed'], cost: 300, dayPart: 'evening', tip: 'Try the Dahibara Aloodum.' },
    ],
  },
  {
    name: 'Banaras',
    aliases: ['banaras', 'varanasi', 'kashi'],
    state: 'Uttar Pradesh',
    region: 'North India',
    baseCoords: [83.0039, 25.3176],
    hotelBands: {
      budget: ['Zostel Varanasi', 'Stops Hostel', 'Moustache Varanasi'],
      mid: ['Suryauday Haveli', 'Amritara Suryauday Haveli', 'Hotel Ganges Grand'],
      luxury: ['Taj Ganges', 'BrijRama Palace', 'Guleria Kothi'],
    },
    transport: [
      'Flight to LBS Airport or train to Varanasi Junction',
      'Walking is the only way in the narrow ghat alleys',
      'E-rickshaws and auto-rickshaws for main roads',
    ],
    foodSpots: ['Deena Chaat Bhandar', 'Blue Lassi', 'Kashi Chat Bhandar', 'Pizzeria Vaatika Cafe'],
    quickTips: [
      'The narrow alleys (galis) are a maze; keep Google Maps handy but be ready to ask locals.',
      'Beware of touts offering "special" tours of the cremation ghats.',
      'Wake up before dawn for the best boat ride experience.',
    ],
    activityPool: [
      { title: 'Sunrise boat ride on the Ganges', type: 'nature', styleTags: ['cultural', 'relaxed', 'family'], cost: 800, dayPart: 'morning', tip: 'Negotiate the boat price firmly before getting in.' },
      { title: 'Kashi Vishwanath Temple Darshan', type: 'culture', styleTags: ['cultural', 'family'], cost: 300, dayPart: 'morning', tip: 'The new corridor makes access much easier, but expect security checks.' },
      { title: 'Sarnath Buddhist ruins day trip', type: 'culture', styleTags: ['cultural', 'relaxed', 'luxury'], cost: 600, dayPart: 'afternoon', tip: 'Very peaceful contrast to the chaotic city.' },
      { title: 'Evening Ganga Aarti at Dashashwamedh', type: 'culture', styleTags: ['cultural', 'family', 'budget'], cost: 200, dayPart: 'evening', tip: 'Get there 45 mins early for a good seat or rent a boat to watch from the water.' },
      { title: 'Banarasi silk weaving village tour', type: 'shopping', styleTags: ['cultural', 'shopping', 'luxury'], cost: 500, dayPart: 'afternoon', tip: 'Buy directly from weavers to ensure authenticity.' },
      { title: 'Street food and lassi trail', type: 'food', styleTags: ['food', 'budget', 'relaxed'], cost: 400, dayPart: 'evening', tip: 'Do not miss the malaiyo (winter only) and tamatar chaat.' },
    ],
  },
  {
    name: 'Ayodhya',
    aliases: ['ayodhya', 'ram janmabhoomi', 'ram nagari'],
    state: 'Uttar Pradesh',
    region: 'North India',
    baseCoords: [82.1384, 26.7922],
    hotelBands: {
      budget: ['Local Dharamshalas', 'Hotel Krishna Palace', 'Sri Ram Hotel'],
      mid: ['Cygnett Collection', 'Ramprastha Hotel', 'Tirupati Hotel'],
      luxury: ['Park Inn by Radisson', 'Kamat Hotels', 'Tent City Ayodhya'],
    },
    transport: [
      'New Ayodhya Airport or train to Ayodhya Dham Junction',
      'E-rickshaws for local temple hopping',
      'Walking for the main temple complex area',
    ],
    foodSpots: ['Makan-Malai Restaurant', 'Brijwasi', 'Local sweet shops'],
    quickTips: [
      'Security is extremely tight; carry only your ID to the main temple.',
      'Book hotels well in advance as the city experiences heavy pilgrim footfall.',
      'E-rickshaws are the most efficient way to navigate the city limits.',
    ],
    activityPool: [
      { title: 'Ram Janmabhoomi Temple Visit', type: 'culture', styleTags: ['cultural', 'family', 'relaxed'], cost: 100, dayPart: 'morning', tip: 'Free lockers are available at the entrance.' },
      { title: 'Hanuman Garhi darshan', type: 'culture', styleTags: ['cultural', 'family', 'budget'], cost: 50, dayPart: 'morning', tip: 'Involves climbing about 76 steps.' },
      { title: 'Sarayu River Ghats and Evening Aarti', type: 'culture', styleTags: ['cultural', 'relaxed', 'family'], cost: 150, dayPart: 'evening', tip: 'Take a boat ride before the evening aarti begins.' },
      { title: 'Kanak Bhawan and Dashrath Mahal', type: 'culture', styleTags: ['cultural', 'family', 'relaxed'], cost: 100, dayPart: 'afternoon', tip: 'Known for their beautiful architecture and idols.' },
      { title: 'Guptar Ghat exploration', type: 'nature', styleTags: ['relaxed', 'cultural', 'budget'], cost: 200, dayPart: 'afternoon', tip: 'A quieter, more peaceful ghat with mythological significance.' },
      { title: 'Heritage Walk and local sweets', type: 'food', styleTags: ['food', 'cultural', 'budget'], cost: 300, dayPart: 'evening', tip: 'Try the famous pedas.' },
    ],
  }
]

const STYLE_WEIGHTS = {
  adventure: { adventure: 4, nature: 3, culture: 1, food: 1, leisure: 1, shopping: 0 },
  relaxed: { leisure: 4, nature: 3, food: 2, culture: 2, shopping: 1, adventure: 0 },
  cultural: { culture: 4, food: 2, nature: 2, leisure: 1, shopping: 1, adventure: 1 },
  budget: { food: 2, culture: 2, nature: 3, leisure: 1, shopping: 1, adventure: 1 },
  luxury: { leisure: 4, food: 3, nature: 2, culture: 2, shopping: 2, adventure: 1 },
  family: { family: 4, nature: 3, culture: 2, food: 2, leisure: 2, adventure: 1 },
}

const parseBudget = (value) => {
  const digits = `${value || ''}`.replace(/[^0-9]/g, '')
  return Number(digits || 0)
}

const normalizeTravelers = (travelers) => {
  const match = `${travelers || ''}`.match(/\d+/)
  return match ? Number(match[0]) : 1
}

const asArray = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean)
  if (!value) return []
  return [value]
}

const normalizeMoney = (amount) => {
  const parsed = parseBudget(amount)
  return parsed || Number(amount) || 0
}

const normalizeHotelName = (hotel) => {
  if (typeof hotel === 'string') return hotel
  if (!hotel || typeof hotel !== 'object') return 'Recommended local stay'

  const details = [hotel.rating && `${hotel.rating} rating`, hotel.price].filter(Boolean).join(' - ')
  return details ? `${hotel.name || 'Recommended local stay'} (${details})` : hotel.name || 'Recommended local stay'
}

const normalizeCoordinates = (coordinates, fallbackCoords, index = 0) => {
  if (Array.isArray(coordinates) && coordinates.length >= 2) {
    const lng = Number(coordinates[0])
    const lat = Number(coordinates[1])
    if (Number.isFinite(lng) && Number.isFinite(lat)) return [lng, lat]
  }

  const lngOffset = ((index % 5) - 2) * 0.01
  const latOffset = (Math.floor(index / 5) - 1) * 0.01
  return [
    (fallbackCoords?.[0] || 77.1892) + lngOffset,
    (fallbackCoords?.[1] || 32.2396) + latOffset,
  ]
}

const normalizeGeneratedItinerary = (raw, request) => {
  const totalDays = Math.min(Math.max(Number(raw?.days || request.days) || 3, 1), 14)
  const travelerCount = normalizeTravelers(raw?.travelers || request.travelers)
  const totalBudget = normalizeMoney(raw?.budget || request.budget) || (totalDays * travelerCount * 3500)
  const destination = findDestination(raw?.destination || request.destination)
  const budgetTier = inferBudgetTier(totalBudget, totalDays, travelerCount)
  const style = raw?.style || request.style || 'adventure'
  const dayParts = ['morning', 'afternoon', 'evening', 'night']

  const daysData = Array.from({ length: totalDays }, (_, index) => {
    const sourceDay = asArray(raw?.days_data).find((day) => Number(day.day) === index + 1) || asArray(raw?.days_data)[index] || {}
    const activities = asArray(sourceDay.activities).slice(0, 5).map((activity, activityIndex) => ({
      time: activity.time,
      title: activity.title || activity.name || `Explore ${destination.name}`,
      type: TYPE_ICON_TYPES.has(activity.type) ? activity.type : 'leisure',
      dayPart: activity.dayPart || dayParts[activityIndex] || 'evening',
      cost: normalizeMoney(activity.cost),
      tip: activity.tip || activity.notes || 'Keep this slot flexible based on local timing and weather.',
      coordinates: normalizeCoordinates(activity.coordinates, destination.baseCoords, (index * 5) + activityIndex),
    }))

    return {
      day: index + 1,
      title: sourceDay.title || `Day ${index + 1} - Signature experiences`,
      summary: sourceDay.summary || `Balanced ${style} day for ${travelerCount} traveler${travelerCount > 1 ? 's' : ''}.`,
      activities,
      estimatedCost: activities.reduce((sum, item) => sum + item.cost, 0),
    }
  })

  const budgetBreakdown = raw?.budgetBreakdown || {
    accommodation: Math.round(totalBudget * 0.38),
    food: Math.round(totalBudget * 0.22),
    transport: Math.round(totalBudget * 0.18),
    activities: Math.round(totalBudget * 0.14),
    misc: Math.round(totalBudget * 0.08),
  }

  return {
    destination: raw?.destination || request.destination?.trim() || destination.name,
    canonicalDestination: raw?.canonicalDestination || destination.name,
    state: raw?.state || destination.state,
    region: raw?.region || destination.region,
    days: totalDays,
    travelers: travelerCount,
    budget: `Rs ${totalBudget.toLocaleString('en-IN')}`,
    totalBudget,
    dayBudget: Math.round(totalBudget / totalDays),
    style,
    hotelTier: raw?.hotelTier || budgetTier,
    hotels: asArray(raw?.hotels).length
      ? asArray(raw.hotels).map(normalizeHotelName).filter(Boolean).slice(0, 5)
      : destination.hotelBands[budgetTier],
    transport: asArray(raw?.transport).length ? asArray(raw.transport) : destination.transport,
    foodSpots: asArray(raw?.foodSpots).length ? asArray(raw.foodSpots) : destination.foodSpots,
    localTips: asArray(raw?.localTips || raw?.tips).length ? asArray(raw?.localTips || raw?.tips) : destination.quickTips,
    budgetBreakdown,
    days_data: daysData,
    // Bug #5 fix: explicit source flag so the client knows which generator was used
    source: 'ai',
  }
}

const TYPE_ICON_TYPES = new Set(['nature', 'culture', 'food', 'shopping', 'leisure', 'adventure'])

const inferBudgetTier = (totalBudget, days, travelers) => {
  const perPersonPerDay = totalBudget / Math.max(days, 1) / Math.max(travelers, 1)
  if (perPersonPerDay >= 6000) return 'luxury'
  if (perPersonPerDay >= 2500) return 'mid'
  return 'budget'
}

const findDestination = (query) => {
  const normalized = `${query || ''}`.trim().toLowerCase()
  if (!normalized) return DESTINATION_LIBRARY[0]

  return DESTINATION_LIBRARY.find((entry) =>
    entry.aliases.some((alias) => normalized.includes(alias))
  ) || DESTINATION_LIBRARY[0]
}

const scoreActivity = (activity, style) => {
  const typeWeight = STYLE_WEIGHTS[style]?.[activity.type] || 1
  const styleBonus = activity.styleTags.includes(style) ? 3 : 0
  return typeWeight + styleBonus
}

// --- GEMINI AI INTEGRATION ---
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy_key');

const generateWithGemini = async ({ destination, days, budget, style, travelers }) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY not found');
  }

  const travelerCount = normalizeTravelers(travelers)
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    generationConfig: { responseMimeType: "application/json" }
  });

  const prompt = `
  You are an expert travel planner building an API response for a web application called WonderTravel.
  Create a highly detailed, realistic itinerary for ${destination} for ${days} days.
  The travelers are: ${travelerCount} people. The budget is: ${budget} INR total. The travel style is: ${style}.

  Return a JSON object matching this schema:
  {
    "destination": "Name of destination",
    "days": Number (must equal ${days}),
    "budget": "Formatted budget string like ₹15,000",
    "travelers": Number (must equal ${travelerCount}),
    "style": "The travel style",
    "hotels": [
      { "name": "Hotel 1", "rating": "4.5", "price": "₹1500" },
      { "name": "Hotel 2", "rating": "4.2", "price": "₹2000" }
    ],
    "transport": [
      "Transportation tip 1",
      "Transportation tip 2"
    ],
    "tips": [
      "Travel tip 1",
      "Travel tip 2"
    ],
    "days_data": [
      {
        "day": 1,
        "title": "Short title for day 1",
        "activities": [
          {
            "time": "09:00 AM",
            "title": "Activity name",
            "type": "culture",
            "cost": 500,
            "tip": "Short tip",
            "coordinates": [longitude, latitude] // MUST BE REAL GEOGRAPHICAL COORDINATES FOR MAPBOX [lng, lat]
          }
        ]
      }
    ]
  }

  Ensure that every day has 3-5 activities and EVERY activity has accurate longitude and latitude coordinates for ${destination}.
  `;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const parsed = JSON.parse(text);
  
  if (!parsed.days_data || parsed.days_data.length === 0) throw new Error('Invalid JSON structure');
  
  return parsed;
};

const createItinerary = async ({ destination: destinationQuery, days, budget, style = 'adventure', travelers }) => {
  let fallbackReason = null

  try {
    const generated = await generateWithGemini({ destination: destinationQuery, days, budget, style, travelers });
    return normalizeGeneratedItinerary(generated, { destination: destinationQuery, days, budget, style, travelers });
  } catch (error) {
    // Bug #5 fix: capture the reason so the fallback is not completely silent
    fallbackReason = error.message
    console.warn('Gemini AI failed or not configured, falling back to local generator:', fallbackReason);
  }

  const totalDays = Math.min(Math.max(Number(days) || 3, 1), 14)
  const travelerCount = normalizeTravelers(travelers)
  const totalBudget = parseBudget(budget) || (totalDays * travelerCount * 3500)
  const destination = findDestination(destinationQuery)
  const budgetTier = inferBudgetTier(totalBudget, totalDays, travelerCount)
  const usedTitles = new Set()

  const daysData = Array.from({ length: totalDays }, (_, index) => {
    const sorted = [...destination.activityPool]
      .sort((a, b) => scoreActivity(b, style) - scoreActivity(a, style))

    const chosen = []
    for (const dayPart of ['morning', 'afternoon', 'evening']) {
      const match = sorted.find((activity) => activity.dayPart === dayPart && !usedTitles.has(activity.title))
      if (match) {
        chosen.push(match)
        usedTitles.add(match.title)
      }
    }

    while (chosen.length < 3) {
      const fallback = sorted.find((activity) => !usedTitles.has(activity.title))
      if (!fallback) break
      chosen.push(fallback)
      usedTitles.add(fallback.title)
    }

    const activities = chosen.map((activity) => {
      const lngOffset = (Math.random() - 0.5) * 0.05
      const latOffset = (Math.random() - 0.5) * 0.05
      return {
        ...activity,
        cost: Math.round(activity.cost * Math.max(travelerCount, 1)),
        coordinates: [
          (destination.baseCoords?.[0] || 77.1892) + lngOffset,
          (destination.baseCoords?.[1] || 32.2396) + latOffset
        ]
      }
    })

    const themes = [
      'Arrival and orientation',
      'Signature experiences',
      'Culture and local food',
      'Nature and slower moments',
      'Hidden corners',
      'Flexible exploration',
      'Wrap-up and departure prep',
    ]

    return {
      day: index + 1,
      title: `Day ${index + 1} - ${themes[index % themes.length]}`,
      summary: `Balanced ${style} day for ${travelerCount} traveler${travelerCount > 1 ? 's' : ''}.`,
      activities,
      estimatedCost: activities.reduce((sum, item) => sum + item.cost, 0),
    }
  })

  return {
    destination: destinationQuery?.trim() || destination.name,
    canonicalDestination: destination.name,
    state: destination.state,
    region: destination.region,
    days: totalDays,
    travelers: travelerCount,
    budget: `Rs ${totalBudget.toLocaleString('en-IN')}`,
    totalBudget,
    dayBudget: Math.round(totalBudget / totalDays),
    style,
    hotelTier: budgetTier,
    hotels: destination.hotelBands[budgetTier],
    transport: destination.transport,
    foodSpots: destination.foodSpots,
    localTips: [
      ...destination.quickTips,
      `This plan is paced for ${travelerCount} traveler${travelerCount > 1 ? 's' : ''} and a ${style} trip style.`,
      `Aim for about Rs ${Math.round(totalBudget / totalDays).toLocaleString('en-IN')} per day across the trip.`,
    ],
    budgetBreakdown: {
      accommodation: Math.round(totalBudget * 0.38),
      food: Math.round(totalBudget * 0.22),
      transport: Math.round(totalBudget * 0.18),
      activities: Math.round(totalBudget * 0.14),
      misc: Math.round(totalBudget * 0.08),
    },
    days_data: daysData,
    // Bug #5 fix: tell the client this came from the local fallback, not Gemini AI
    source: 'local',
    ...(fallbackReason ? { fallbackReason } : {}),
  }
}

module.exports = { createItinerary }
