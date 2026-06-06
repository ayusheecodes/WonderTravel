import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../../api/axios'
import styles from './Explore.module.css'

const REGIONS = ['All Regions', 'North India', 'Northeast', 'South India', 'West India', 'East India']
const TAGS = ['All', 'Hidden Gem', 'Remote', 'Offbeat', 'Local Pick']
const DIFF = ['All Levels', 'Easy', 'Easy-Moderate', 'Moderate', 'Moderate-Hard', 'Hard']
const SEASONS = ['Any Season', 'Mar-Jun', 'Apr-Jun', 'May-Oct', 'Jun-Sep', 'Sep-Nov', 'Oct-Mar', 'Nov-Feb', 'Dec-Mar']

const TAG_STYLE = {
  'Hidden Gem': { bg: '#f0e8fc', color: '#7c25cf' },
  'Remote': { bg: '#e8f0fc', color: '#1a7fcf' },
  'Offbeat': { bg: '#fdf3e0', color: '#b87820' },
  'Local Pick': { bg: '#e6f4ee', color: '#2e7d5e' },
}

const LOCAL_DESTINATIONS = [
  {
    id: 'ziro-valley',
    name: 'Ziro Valley',
    state: 'Arunachal Pradesh',
    region: 'Northeast',
    tag: 'Hidden Gem',
    image: '/images/ziro_valley_1777233795515.png',
    rating: 4.9,
    reviews: 128,
    difficulty: 'Moderate',
    bestSeason: 'Sep-Nov',
    duration: '3-5 days',
    desc: 'Ancient Apatani villages, misty pine groves and quiet rice fields make Ziro one of Northeast India\'s most beautiful slow-travel escapes.',
    tips: ['Stay in a local homestay', 'Carry warm layers even in summer', 'Visit village trails with a local guide'],
    activities: ['Village Walks', 'Photography', 'Music Trails', 'Cycling'],
    budget: 'Rs 8,000-Rs 15,000',
    contributor: 'Rahul D.',
    verified: true,
  },
  {
    id: 'chopta',
    name: 'Chopta',
    state: 'Uttarakhand',
    region: 'North India',
    tag: 'Remote',
    image: '/images/chopta_1777233813934.png',
    rating: 4.8,
    reviews: 94,
    difficulty: 'Easy-Moderate',
    bestSeason: 'Mar-Jun',
    duration: '2-3 days',
    desc: 'High meadows, cedar forests, Tungnath temple and Chandrashila sunrise views make Chopta a compact Himalayan escape.',
    tips: ['Start Chandrashila before sunrise', 'Roads can close during heavy snow', 'Book stays ahead on weekends'],
    activities: ['Trekking', 'Camping', 'Temple Visit', 'Stargazing'],
    budget: 'Rs 5,000-Rs 10,000',
    contributor: 'Priya S.',
    verified: true,
  },
  {
    id: 'dzukou-valley',
    name: 'Dzukou Valley',
    state: 'Nagaland',
    region: 'Northeast',
    tag: 'Offbeat',
    image: '/images/dzukou_valley.png',
    rating: 4.7,
    reviews: 56,
    difficulty: 'Moderate-Hard',
    bestSeason: 'Jun-Sep',
    duration: '2-4 days',
    desc: 'A rolling valley of seasonal flowers, green folds and silence above the clouds between Nagaland and Manipur.',
    tips: ['Carry supplies into the valley', 'Use Viswema for the easier approach', 'June and July bring the Dzukou lily'],
    activities: ['Trekking', 'Camping', 'Nature Walks', 'Photography'],
    budget: 'Rs 6,000-Rs 12,000',
    contributor: 'Ananya K.',
    verified: true,
  },
  {
    id: 'tirthan-valley',
    name: 'Tirthan Valley',
    state: 'Himachal Pradesh',
    region: 'North India',
    tag: 'Local Pick',
    image: '/images/tirthan_valley.png',
    rating: 4.9,
    reviews: 143,
    difficulty: 'Easy',
    bestSeason: 'Apr-Jun, Sep-Nov',
    duration: '3-5 days',
    desc: 'A river valley near the Great Himalayan National Park with trout streams, wooden homes and forest hikes without the usual hill-station rush.',
    tips: ['Get permits before GHNP treks', 'Try trout with a local host', 'Keep one day for slow riverside walks'],
    activities: ['Hiking', 'Fishing', 'Wildlife Spotting', 'River Walks'],
    budget: 'Rs 7,000-Rs 14,000',
    contributor: 'Mohan T.',
    verified: true,
  },
  {
    id: 'mechuka',
    name: 'Mechuka',
    state: 'Arunachal Pradesh',
    region: 'Northeast',
    tag: 'Remote',
    image: '/images/remote_himalayan_valley.png',
    rating: 4.9,
    reviews: 82,
    difficulty: 'Moderate',
    bestSeason: 'Oct-Mar',
    duration: '4-6 days',
    desc: 'A faraway valley near the Indo-Tibet border with wooden monasteries, hanging bridges, river bends and snow-dusted ridges.',
    tips: ['Inner Line Permit is required', 'Keep buffer days for road delays', 'Carry cash for remote villages'],
    activities: ['Monastery Visit', 'River Walks', 'Village Trails', 'Photography'],
    budget: 'Rs 12,000-Rs 24,000',
    contributor: 'Tsering L.',
    verified: true,
  },
  {
    id: 'gurudongmar-lake',
    name: 'Gurudongmar Lake',
    state: 'Sikkim',
    region: 'Northeast',
    tag: 'Remote',
    image: '/images/remote_himalayan_valley.png',
    rating: 4.9,
    reviews: 118,
    difficulty: 'Hard',
    bestSeason: 'Apr-Jun, Oct-Nov',
    duration: '3-5 days',
    desc: 'One of India\'s highest lakes, framed by stark Himalayan desert, icy winds and sacred blue water near the Tibetan plateau.',
    tips: ['Acclimatize properly in Lachen', 'Permits are mandatory', 'Avoid if you have altitude issues'],
    activities: ['High-Altitude Drive', 'Photography', 'Monastery Stops', 'Snow Views'],
    budget: 'Rs 14,000-Rs 28,000',
    contributor: 'Pema R.',
    verified: true,
  },
  {
    id: 'sandakhphu',
    name: 'Sandakphu',
    state: 'West Bengal',
    region: 'East India',
    tag: 'Offbeat',
    image: '/images/remote_himalayan_valley.png',
    rating: 4.8,
    reviews: 166,
    difficulty: 'Moderate-Hard',
    bestSeason: 'Oct-Mar',
    duration: '5-7 days',
    desc: 'A ridge walk where Everest, Kanchenjunga, Lhotse and Makalu can appear together on clear Himalayan mornings.',
    tips: ['Book GTA trekkers huts early', 'Layer for cold winds', 'March-April brings rhododendron blooms'],
    activities: ['Trekking', 'Mountain Views', 'Forest Trails', 'Photography'],
    budget: 'Rs 10,000-Rs 20,000',
    contributor: 'Rinchen S.',
    verified: true,
  },
  {
    id: 'spiti-valley',
    name: 'Spiti Valley',
    state: 'Himachal Pradesh',
    region: 'North India',
    tag: 'Remote',
    image: '/images/remote_himalayan_valley.png',
    rating: 4.9,
    reviews: 312,
    difficulty: 'Moderate-Hard',
    bestSeason: 'May-Oct',
    duration: '6-9 days',
    desc: 'Cold desert villages, ancient monasteries, moonlike valleys and high passes create one of India\'s most dramatic road journeys.',
    tips: ['Take the Shimla route for gentler acclimatization', 'Fuel up whenever possible', 'Respect monastery timings'],
    activities: ['Road Trip', 'Monastery Visit', 'Stargazing', 'Fossil Village Walks'],
    budget: 'Rs 18,000-Rs 35,000',
    contributor: 'Karan B.',
    verified: true,
  },
  {
    id: 'gurez-valley',
    name: 'Gurez Valley',
    state: 'Jammu & Kashmir',
    region: 'North India',
    tag: 'Hidden Gem',
    image: '/images/remote_himalayan_valley.png',
    rating: 4.8,
    reviews: 74,
    difficulty: 'Moderate',
    bestSeason: 'May-Oct',
    duration: '3-5 days',
    desc: 'A remote Kishanganga river valley with wooden homes, Habba Khatoon peak and alpine quiet far from crowded Kashmir circuits.',
    tips: ['Check road status before leaving Srinagar', 'Carry ID for security checks', 'Stay overnight for sunrise views'],
    activities: ['River Walks', 'Village Trails', 'Peak Views', 'Photography'],
    budget: 'Rs 10,000-Rs 22,000',
    contributor: 'Aamir Q.',
    verified: true,
  },
  {
    id: 'kanatal',
    name: 'Kanatal',
    state: 'Uttarakhand',
    region: 'North India',
    tag: 'Offbeat',
    image: '/images/remote_himalayan_valley.png',
    rating: 4.7,
    reviews: 133,
    difficulty: 'Easy',
    bestSeason: 'Mar-Jun',
    duration: '2-3 days',
    desc: 'A peaceful ridge near Mussoorie with deodar forests, valley-facing stays and quiet walks toward Surkanda Devi.',
    tips: ['Pick a stay with valley views', 'Pack a light jacket year-round', 'Avoid peak holiday traffic via early starts'],
    activities: ['Forest Walks', 'Camping', 'Temple Visit', 'Sunset Views'],
    budget: 'Rs 5,000-Rs 12,000',
    contributor: 'Nidhi P.',
    verified: true,
  },
  {
    id: 'hampi',
    name: 'Hampi',
    state: 'Karnataka',
    region: 'South India',
    tag: 'Hidden Gem',
    image: '/images/hampi_karnataka.png',
    rating: 4.8,
    reviews: 244,
    difficulty: 'Easy-Moderate',
    bestSeason: 'Oct-Mar',
    duration: '2-4 days',
    desc: 'Vijayanagara ruins, giant boulders, coracle crossings and golden sunsets make Hampi feel ancient and otherworldly.',
    tips: ['Rent a bicycle or scooter', 'Visit Matanga Hill for sunrise', 'Start temple walks early'],
    activities: ['Heritage Walk', 'Bouldering', 'Cycling', 'Photography'],
    budget: 'Rs 4,500-Rs 12,000',
    contributor: 'Arjun R.',
    verified: true,
  },
  {
    id: 'munnar-offbeat',
    name: 'Munnar Tea Trails',
    state: 'Kerala',
    region: 'South India',
    tag: 'Local Pick',
    image: '/images/kerala_backwaters.png',
    rating: 4.8,
    reviews: 276,
    difficulty: 'Easy',
    bestSeason: 'Sep-Mar',
    duration: '3-4 days',
    desc: 'Rolling tea gardens, cloud-wrapped viewpoints and spice villages beyond the crowded town center.',
    tips: ['Stay outside central Munnar', 'Start viewpoints before 8 AM', 'Carry rain protection in monsoon'],
    activities: ['Tea Estate Walk', 'Viewpoints', 'Spice Tour', 'Photography'],
    budget: 'Rs 8,000-Rs 18,000',
    contributor: 'Meera K.',
    verified: true,
  },
  {
    id: 'gandikota',
    name: 'Gandikota',
    state: 'Andhra Pradesh',
    region: 'South India',
    tag: 'Offbeat',
    image: '/images/south_india_canyon.png',
    rating: 4.7,
    reviews: 122,
    difficulty: 'Easy',
    bestSeason: 'Oct-Mar',
    duration: '1-2 days',
    desc: 'India\'s grand canyon, with ochre cliffs, a fort wall and Pennar river views that glow beautifully at sunrise.',
    tips: ['Sunrise is better than midday', 'Pair with Belum Caves', 'Carry water around the gorge'],
    activities: ['Gorge Viewpoints', 'Fort Walk', 'Camping', 'Photography'],
    budget: 'Rs 3,000-Rs 8,000',
    contributor: 'Sushma V.',
    verified: true,
  },
  {
    id: 'agumbe',
    name: 'Agumbe Rainforest',
    state: 'Karnataka',
    region: 'South India',
    tag: 'Remote',
    image: '/images/northeast_rainforest_bridge.png',
    rating: 4.8,
    reviews: 91,
    difficulty: 'Moderate',
    bestSeason: 'Jun-Sep',
    duration: '2-3 days',
    desc: 'A rainforest village with mist, waterfalls, rainforest research trails and some of the most cinematic monsoon sunsets in India.',
    tips: ['Leech socks help in monsoon', 'Use local guides for forest trails', 'Expect patchy mobile network'],
    activities: ['Waterfalls', 'Rainforest Walks', 'Sunset Point', 'Wildlife'],
    budget: 'Rs 5,000-Rs 11,000',
    contributor: 'Ravi H.',
    verified: true,
  },
  {
    id: 'rann-kutch',
    name: 'Rann of Kutch',
    state: 'Gujarat',
    region: 'West India',
    tag: 'Offbeat',
    image: '/images/rann_kutch.png',
    rating: 4.8,
    reviews: 186,
    difficulty: 'Easy',
    bestSeason: 'Nov-Feb',
    duration: '2-4 days',
    desc: 'A vast white salt desert, craft villages, folk evenings and moonlit winter landscapes around Dhordo and Bhuj.',
    tips: ['Full moon dates book fast', 'Carry warm layers for nights', 'Visit craft villages near Bhuj'],
    activities: ['Salt Desert', 'Craft Villages', 'Cultural Shows', 'Photography'],
    budget: 'Rs 8,000-Rs 18,000',
    contributor: 'Nirali P.',
    verified: true,
  },
  {
    id: 'saputara',
    name: 'Saputara',
    state: 'Gujarat',
    region: 'West India',
    tag: 'Hidden Gem',
    image: '/images/river_island_village.png',
    rating: 4.6,
    reviews: 98,
    difficulty: 'Easy',
    bestSeason: 'Jun-Sep',
    duration: '2-3 days',
    desc: 'A green hill station in the Dang forests with monsoon viewpoints, tribal villages and quiet lake evenings.',
    tips: ['Monsoon is the prettiest season', 'Visit Artist Village for local craft', 'Keep mornings for viewpoints'],
    activities: ['Lake Walk', 'Viewpoints', 'Tribal Craft', 'Monsoon Drives'],
    budget: 'Rs 4,500-Rs 10,000',
    contributor: 'Jay M.',
    verified: true,
  },
  {
    id: 'bhandardara',
    name: 'Bhandardara',
    state: 'Maharashtra',
    region: 'West India',
    tag: 'Local Pick',
    image: '/images/river_island_village.png',
    rating: 4.7,
    reviews: 154,
    difficulty: 'Easy',
    bestSeason: 'Jun-Sep',
    duration: '2 days',
    desc: 'Lakeside camping, waterfalls, firefly season and Sahyadri mountain roads make this a quiet weekend escape from Mumbai or Pune.',
    tips: ['Fireflies peak before heavy monsoon', 'Book lakeside camps early', 'Roads get slippery in rain'],
    activities: ['Camping', 'Waterfalls', 'Fireflies', 'Lake Views'],
    budget: 'Rs 3,500-Rs 9,000',
    contributor: 'Aditi N.',
    verified: true,
  },
  {
    id: 'mawsynram',
    name: 'Mawsynram',
    state: 'Meghalaya',
    region: 'Northeast',
    tag: 'Remote',
    image: '/images/northeast_rainforest_bridge.png',
    rating: 4.8,
    reviews: 104,
    difficulty: 'Moderate',
    bestSeason: 'Oct-Mar',
    duration: '3-4 days',
    desc: 'Rain-carved caves, living root bridges, emerald cliffs and cloud drama in one of the wettest landscapes on earth.',
    tips: ['Carry waterproof bags', 'Hire a local guide for caves', 'Road visibility can change quickly'],
    activities: ['Caves', 'Root Bridges', 'Waterfalls', 'Village Walks'],
    budget: 'Rs 8,000-Rs 17,000',
    contributor: 'Iamon L.',
    verified: true,
  },
  {
    id: 'majuli',
    name: 'Majuli Island',
    state: 'Assam',
    region: 'Northeast',
    tag: 'Local Pick',
    image: '/images/river_island_village.png',
    rating: 4.7,
    reviews: 137,
    difficulty: 'Easy',
    bestSeason: 'Oct-Mar',
    duration: '2-3 days',
    desc: 'A river island of satras, mask-making villages, cycling paths and slow Brahmaputra sunsets.',
    tips: ['Check ferry timings carefully', 'Cycle between satras', 'Stay in a bamboo cottage if available'],
    activities: ['Cycling', 'Cultural Tours', 'River Ferry', 'Mask Making'],
    budget: 'Rs 4,000-Rs 10,000',
    contributor: 'Bhaskar G.',
    verified: true,
  },
]

const mergeDestinations = (apiDestinations = []) => {
  const combined = [...apiDestinations, ...LOCAL_DESTINATIONS]
  const seen = new Set()
  return combined.filter((destination) => {
    const key = destination.name.toLowerCase()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

export default function Explore() {
  const navigate = useNavigate()

  const [destinations, setDestinations] = useState([])
  const [loading, setLoading] = useState(true)
  const [apiError, setApiError] = useState('')
  const [search, setSearch] = useState('')
  const [region, setRegion] = useState('All Regions')
  const [tag, setTag] = useState('All')
  const [diff, setDiff] = useState('All Levels')
  const [season, setSeason] = useState('Any Season')
  const [sortBy, setSortBy] = useState('rating')
  const [selected, setSelected] = useState(null)
  const [viewMode, setViewMode] = useState('grid')

  useEffect(() => {
    const loadDestinations = async () => {
      try {
        setLoading(true)
        const { data } = await API.get('/destinations')
        setDestinations(mergeDestinations(Array.isArray(data) ? data : []))
        setApiError('')
      } catch {
        // BUG-12 fix: use mergeDestinations([]) instead of LOCAL_DESTINATIONS
        // directly so the fallback path is consistent with the success path.
        setDestinations(mergeDestinations([]))
        setApiError('')
      } finally {
        setLoading(false)
      }
    }

    loadDestinations()
  }, [])

  const filtered = useMemo(() => {
    return destinations
      .filter((destination) => {
        if (
          search &&
          !destination.name.toLowerCase().includes(search.toLowerCase()) &&
          !destination.state.toLowerCase().includes(search.toLowerCase()) &&
          // BUG-18 fix: API destinations are normalised through formatDestination which
          // maps `description` → `desc`. But as a safety net, fall back to
          // `description` so a mismatch never throws a TypeError and crashes the filter.
          !(destination.desc || destination.description || '').toLowerCase().includes(search.toLowerCase())
        ) return false
        if (region !== 'All Regions' && destination.region !== region) return false
        if (tag !== 'All' && destination.tag !== tag) return false
        if (diff !== 'All Levels' && destination.difficulty !== diff) return false
        // Bug #12 fix: match the full season string (e.g. 'Oct-Mar') instead of just
        // the start month ('Oct'). The old split('-')[0] approach matched 'Oct-Nov'
        // and 'Oct-Mar' equally for a 'Oct-Mar' filter, making it over-inclusive.
        if (season !== 'Any Season' && !destination.bestSeason.includes(season)) return false
        return true
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating
        if (sortBy === 'reviews') return b.reviews - a.reviews
        if (sortBy === 'name') return a.name.localeCompare(b.name)
        return 0
      })
  }, [destinations, search, region, tag, diff, season, sortBy])

  const resetFilters = () => {
    setSearch('')
    setRegion('All Regions')
    setTag('All')
    setDiff('All Levels')
    setSeason('Any Season')
    setSortBy('rating')
  }

  const openPlanner = (destinationName) => {
    const params = new URLSearchParams({
      destination: destinationName,
      days: '4',
      budget: 'Rs 18,000',
      style: 'cultural',
      travelers: '2 People',
    })

    navigate(`/itinerary?${params.toString()}`)
  }

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroBlob1} />
        <div className={styles.heroBlob2} />
        <div className={styles.heroInner}>
          <p className={styles.eyebrow}>Community-powered discovery</p>
          <h1 className={styles.heroTitle}>
            Places most maps <em>never show</em>
          </h1>
          <p className={styles.heroSub}>
            {destinations.length} destinations contributed by locals - hidden viewpoints, remote valleys and offbeat routes across India.
          </p>
          <div className={styles.heroSearch}>
            <span className={styles.searchIcon}>Search</span>
            <input
              type="text"
              placeholder="Search by destination, state or activity..."
              value={search}
              className={styles.searchInput}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button className={styles.clearSearch} onClick={() => setSearch('')}>x</button>
            )}
          </div>
          <div className={styles.quickTags}>
            {TAGS.map((item) => (
              <button
                key={item}
                className={`${styles.quickTag} ${tag === item ? styles.quickTagActive : ''}`}
                onClick={() => setTag(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.mainLayout}>
        <aside className={styles.filtersSidebar}>
          <div className={styles.filtersHeader}>
            <span>Filters</span>
            <button className={styles.resetBtn} onClick={resetFilters}>Reset all</button>
          </div>

          <div className={styles.filterSection}>
            <div className={styles.filterLabel}>Region</div>
            {REGIONS.map((item) => (
              <button
                key={item}
                className={`${styles.filterOpt} ${region === item ? styles.filterOptActive : ''}`}
                onClick={() => setRegion(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <div className={styles.filterSection}>
            <div className={styles.filterLabel}>Type</div>
            {TAGS.map((item) => (
              <button
                key={item}
                className={`${styles.filterOpt} ${tag === item ? styles.filterOptActive : ''}`}
                onClick={() => setTag(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <div className={styles.filterSection}>
            <div className={styles.filterLabel}>Difficulty</div>
            {DIFF.map((item) => (
              <button
                key={item}
                className={`${styles.filterOpt} ${diff === item ? styles.filterOptActive : ''}`}
                onClick={() => setDiff(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <div className={styles.filterSection}>
            <div className={styles.filterLabel}>Best Season</div>
            {SEASONS.map((item) => (
              <button
                key={item}
                className={`${styles.filterOpt} ${season === item ? styles.filterOptActive : ''}`}
                onClick={() => setSeason(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </aside>

        <main className={styles.resultsArea}>
          <div className={styles.resultsBar}>
            <span className={styles.resultsCount}>
              <strong>{filtered.length}</strong> destinations found
            </span>
            <div className={styles.rbRight}>
              <div className={styles.sortWrap}>
                <span className={styles.sortLabel}>Sort:</span>
                <select value={sortBy} className={styles.sortSelect} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="rating">Top Rated</option>
                  <option value="reviews">Most Reviewed</option>
                  <option value="name">Name A-Z</option>
                </select>
              </div>
              <div className={styles.viewToggle}>
                <button className={`${styles.viewBtn} ${viewMode === 'grid' ? styles.viewBtnActive : ''}`} onClick={() => setViewMode('grid')}>Grid</button>
                <button className={`${styles.viewBtn} ${viewMode === 'list' ? styles.viewBtnActive : ''}`} onClick={() => setViewMode('list')}>List</button>
              </div>
            </div>
          </div>

          {loading && <div className={styles.noResults}><h3>Loading destinations...</h3></div>}
          {!loading && apiError && <div className={styles.noResults}><h3>{apiError}</h3></div>}

          {!loading && !apiError && filtered.length === 0 && (
            <div className={styles.noResults}>
              <h3>No destinations match your filters</h3>
              <p>Try changing your search or filters.</p>
              <button className={styles.noResetBtn} onClick={resetFilters}>Reset all filters</button>
            </div>
          )}

          {!loading && !apiError && viewMode === 'grid' && (
            <div className={styles.destGrid}>
              {filtered.map((destination) => (
                <div key={destination.id} className={styles.destCard} onClick={() => setSelected(destination)}>
                  <div className={styles.dcImageWrapper}>
                    <div className={styles.dcImage} style={{ backgroundImage: `url(${destination.image})` }} />
                    <span className={styles.dcTag} style={TAG_STYLE[destination.tag] || TAG_STYLE['Hidden Gem']}>{destination.tag}</span>
                    {destination.verified && <span className={styles.dcVerified}>Verified</span>}
                  </div>
                  <div className={styles.dcInfo}>
                    <div className={styles.dcTop}>
                      <div>
                        <h3 className={styles.dcName}>{destination.name}</h3>
                        <p className={styles.dcState}>{destination.state}</p>
                      </div>
                      <div className={styles.dcRating}>
                        <span className={styles.dcRatingNum}>{destination.rating}</span>
                        <span className={styles.dcReviews}>{destination.reviews}</span>
                      </div>
                    </div>
                    <p className={styles.dcDesc}>{destination.desc.slice(0, 100)}...</p>
                    <div className={styles.dcMeta}>
                      <span>{destination.duration}</span>
                      <span>{destination.budget.split('-')[0]}</span>
                      <span>{destination.difficulty}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && !apiError && viewMode === 'list' && (
            <div className={styles.destList}>
              {filtered.map((destination) => (
                <div key={destination.id} className={styles.destListItem} onClick={() => setSelected(destination)}>
                  <div className={styles.dliImage} style={{ backgroundImage: `url(${destination.image})` }} />
                  <div className={styles.dliInfo}>
                    <div className={styles.dliTop}>
                      <h3>{destination.name}</h3>
                      <span className={styles.dliTag} style={TAG_STYLE[destination.tag] || TAG_STYLE['Hidden Gem']}>{destination.tag}</span>
                    </div>
                    <p className={styles.dliState}>{destination.state} · {destination.region}</p>
                    <p className={styles.dliDesc}>{destination.desc.slice(0, 130)}...</p>
                  </div>
                  <div className={styles.dliRight}>
                    <div className={styles.dliRating}>
                      <span className={styles.dliRatingNum}>{destination.rating}</span>
                      <span className={styles.dliRatingLabel}>({destination.reviews})</span>
                    </div>
                    <button className={styles.dliBtn}>View Details</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {selected && (
        <div className={styles.modalOverlay} onClick={(e) => e.target === e.currentTarget && setSelected(null)}>
          <div className={styles.modal}>
            <button className={styles.modalClose} onClick={() => setSelected(null)}>x</button>
            <div className={styles.modalHeader}>
              <div className={styles.mhImageWrapper}>
                <div className={styles.mhImage} style={{ backgroundImage: `url(${selected.image})` }} />
                <span className={styles.mhTag} style={TAG_STYLE[selected.tag] || TAG_STYLE['Hidden Gem']}>{selected.tag}</span>
                {selected.verified && <span className={styles.mhVerified}>WonderTravel Verified</span>}
              </div>
              <div className={styles.mhInfo}>
                <h2 className={styles.mhName}>{selected.name}</h2>
                <p className={styles.mhState}>{selected.state} · {selected.region}</p>
              </div>
            </div>

            <div className={styles.modalBody}>
              <p className={styles.modalDesc}>{selected.desc}</p>

              <div className={styles.modalSection}>
                <h4>Activities</h4>
                <div className={styles.activitiesWrap}>
                  {selected.activities.map((activity) => <span key={activity} className={styles.activityTag}>{activity}</span>)}
                </div>
              </div>

              <div className={styles.modalSection}>
                <h4>Local Tips from {selected.contributor}</h4>
                <div className={styles.tipsList}>
                  {selected.tips.map((tip, index) => (
                    <div key={tip} className={styles.tipItem}>
                      <span className={styles.tipNum}>{index + 1}</span>
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.mfItinerary} onClick={() => { setSelected(null); openPlanner(selected.name) }}>
                Plan a Trip Here
              </button>
              <div className={styles.mfBookBtns}>
                <button className={styles.mfBtn} onClick={() => { setSelected(null); navigate('/flights') }}>Flights</button>
                <button className={styles.mfBtn} onClick={() => { setSelected(null); navigate('/hotels') }}>Hotels</button>
                <button className={styles.mfBtn} onClick={() => { setSelected(null); navigate('/cabs') }}>Cabs</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
