import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Home.module.css'

const TABS = ['Flights', 'Trains', 'Hotels', 'Cabs']

const DESTINATIONS = [
  { name: 'Puri', state: 'Odisha', tag: 'Spiritual Heritage', image: '/images/puri_odisha_1777233725290.png', tagColor: { color: '#b87820' }, desc: 'The sacred coastal town of Lord Jagannath, offering divine tranquility and beautiful beaches.' },
  { name: 'Banaras Ghats', state: 'Uttar Pradesh', tag: 'Cultural Epicenter', image: '/images/banaras_ghats_1777233756750.png', tagColor: { color: '#7c25cf' }, desc: 'The spiritual heart of India on the banks of the Ganges, mesmerizing with golden aarti.' },
  { name: 'Bhubaneswar', state: 'Odisha', tag: 'Temple City', image: '/images/bhubaneswar_1777233740502.png', tagColor: { color: '#2e7d5e' }, desc: 'An ancient city blending thousands of intricate sandstone temples with modern life.' },
  { name: 'Ayodhya', state: 'Uttar Pradesh', tag: 'Divine City', image: '/images/ayodhya_1777233779724.png', tagColor: { color: '#cf2525' }, desc: 'The birthplace of Lord Ram, boasting majestic stone architecture and a profound sense of devotion.' },
]

const MORE_DESTINATIONS = [
  { name: 'Ziro Valley', state: 'Arunachal Pradesh', tag: 'Hidden Gem', image: '/images/ziro_valley_1777233795515.png', tagColor: { color: '#1a7fcf' }, desc: 'Ancient tribal culture amid misty pine forests.' },
  { name: 'Chopta', state: 'Uttarakhand', tag: 'Remote', image: '/images/chopta_1777233813934.png', tagColor: { color: '#2e7d5e' }, desc: 'Mini Switzerland of India with quiet alpine meadows.' },
]

const PACKAGES = [
  { name: 'Goa Escape', label: 'Coast', nights: 3, tags: ['Flight', 'Hotel'], price: 12499, image: '/images/goa_coast.png' },
  { name: 'Manali Hills', label: 'Summit', nights: 5, tags: ['Train', 'Hotel', 'Cab'], price: 9999, image: '/images/chopta_1777233813934.png' },
  { name: 'Kerala Backwaters', label: 'Backwaters', nights: 4, tags: ['Flight', 'Cab'], price: 14999, image: '/images/kerala_backwaters.png' },
  { name: 'Rajasthan Royal', label: 'Fort Trail', nights: 6, tags: ['Train', 'Hotel'], price: 18999, image: '/images/ayodhya_1777233779724.png' },
]

const WHY_US = [
  { icon: 'Map', title: 'Remote Access', desc: 'Reach destinations other platforms do not cover, including local drivers in remote regions.' },
  { icon: 'Local', title: 'Community-Driven', desc: 'Real tips from residents and contributors instead of recycled tourist blurbs.' },
  { icon: 'AI', title: 'AI Planning', desc: 'Generate day-by-day itineraries aligned to your timeline, budget and trip style.' },
  { icon: 'Bundle', title: 'All-in-One Booking', desc: 'Flights, trains, hotels and cabs in one flow so planning stays coherent.' },
]

const HERO_IMAGES = [
  '/images/kerala_backwaters.png',
  '/images/goa_coast.png',
  '/images/hampi_karnataka.png',
]

export default function Home() {
  const [activeTab, setActiveTab] = useState('Flights')
  const [tripType, setTripType] = useState('one-way')
  const [mode, setMode] = useState('traveler')
  const [plannerDestination, setPlannerDestination] = useState('')
  const [plannerDays, setPlannerDays] = useState('5')
  const [plannerBudget, setPlannerBudget] = useState('Rs 20,000')
  const [flightSearch, setFlightSearch] = useState({ from: '', to: '', date: '', pax: '1 Adult, Economy' })
  const [trainSearch, setTrainSearch] = useState({ from: '', to: '', date: '', class: 'All Classes' })
  const [hotelSearch, setHotelSearch] = useState({ dest: '', checkIn: '', checkOut: '', guests: '2 Guests, 1 Room' })
  const [cabSearch, setCabSearch] = useState({ pickup: '', drop: '', date: '', type: 'Any Cab' })
  const navigate = useNavigate()

  const routeMap = {
    Flights: '/flights',
    Trains: '/trains',
    Hotels: '/hotels',
    Cabs: '/cabs',
  }

  const tabIcon = { Flights: 'Flight', Trains: 'Train', Hotels: 'Hotel', Cabs: 'Cab' }

  const updateSearch = (setter, key, value) => {
    setter((previous) => ({ ...previous, [key]: value }))
  }

  const runSearch = () => {
    const params = new URLSearchParams()

    if (activeTab === 'Flights') {
      Object.entries({ ...flightSearch, tripType }).forEach(([key, value]) => value && params.set(key, value))
    }

    if (activeTab === 'Trains') {
      Object.entries(trainSearch).forEach(([key, value]) => value && params.set(key, value))
    }

    if (activeTab === 'Hotels') {
      Object.entries(hotelSearch).forEach(([key, value]) => value && params.set(key, value))
    }

    if (activeTab === 'Cabs') {
      Object.entries(cabSearch).forEach(([key, value]) => value && params.set(key, value))
    }

    const query = params.toString()
    navigate(`${routeMap[activeTab]}${query ? `?${query}` : ''}`)
  }

  const openPlanner = () => {
    const params = new URLSearchParams({
      destination: plannerDestination || 'Manali',
      days: plannerDays || '5',
      budget: plannerBudget || 'Rs 20,000',
      style: 'adventure',
      travelers: '2 People',
    })

    navigate(`/itinerary?${params.toString()}`)
  }

  return (
    <div className={styles.page}>
      <section className={`${styles.hero} ${mode === 'contributor' ? styles.heroContributor : ''}`}>
        <div className={styles.blobs}>
          <div className={styles.blob1} />
          <div className={styles.blob2} />
          <div className={styles.blob3} />
        </div>

        <div className={styles.floatingPills}>
          <span className={styles.pill} style={{ top: '18%', left: '5%' }}>Ziro Valley</span>
          <span className={styles.pill} style={{ top: '30%', right: '5%', animationDelay: '1s' }}>Chopta</span>
          <span className={styles.pill} style={{ bottom: '38%', left: '4%', animationDelay: '0.5s' }}>Dzukou Valley</span>
          <span className={styles.pill} style={{ bottom: '44%', right: '7%', animationDelay: '2s' }}>Majuli Island</span>
        </div>

        <div className={styles.heroPhotoRail} aria-hidden="true">
          {HERO_IMAGES.map((image) => (
            <span key={image} style={{ backgroundImage: `url(${image})` }} />
          ))}
        </div>

        <div className={styles.modeSwitcher} onClick={() => setMode((m) => (m === 'traveler' ? 'contributor' : 'traveler'))}>
          <span className={`${styles.modeOpt} ${mode === 'traveler' ? styles.modeOptActive : ''}`}>Traveler</span>
          <div className={`${styles.modeSlider} ${mode === 'contributor' ? styles.modeSliderOn : ''}`} />
          <span className={`${styles.modeOpt} ${mode === 'contributor' ? styles.modeOptActive : ''}`}>Contributor</span>
        </div>

        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>
            {mode === 'traveler' ? 'Your complete travel companion' : 'Join local voices from hidden India'}
          </p>
          <h1 className={styles.heroTitle}>
            {mode === 'traveler'
              ? <>Travel where <em>maps end</em><br />stories begin</>
              : <>Share what <em>only you</em><br />know exists</>}
          </h1>
          <p className={styles.heroSub}>
            {mode === 'traveler'
              ? 'Book trains, flights, hotels and cabs while discovering destinations that other platforms rarely surface.'
              : 'Publish local knowledge, hidden routes and insider travel context for curious travelers.'}
          </p>
        </div>

        {mode === 'traveler' && (
          <div className={styles.searchCard}>
            <div className={styles.searchTabs}>
              {TABS.map((tab) => (
                <button
                  key={tab}
                  className={`${styles.tabBtn} ${activeTab === tab ? styles.tabBtnActive : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tabIcon[tab]} {tab}
                </button>
              ))}
            </div>

            {(activeTab === 'Flights' || activeTab === 'Trains') && (
              <div className={styles.tripTypeRow}>
                {['one-way', 'round-trip', 'multi-city'].map((option) => (
                  <label key={option} className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="triptype"
                      checked={tripType === option}
                      onChange={() => setTripType(option)}
                    />
                    {option.replace('-', ' ')}
                  </label>
                ))}
              </div>
            )}

            <div className={styles.fieldsRow}>
              {activeTab === 'Flights' && <FlightFields tripType={tripType} values={flightSearch} onChange={(key, value) => updateSearch(setFlightSearch, key, value)} />}
              {activeTab === 'Trains' && <TrainFields values={trainSearch} onChange={(key, value) => updateSearch(setTrainSearch, key, value)} />}
              {activeTab === 'Hotels' && <HotelFields values={hotelSearch} onChange={(key, value) => updateSearch(setHotelSearch, key, value)} />}
              {activeTab === 'Cabs' && <CabFields values={cabSearch} onChange={(key, value) => updateSearch(setCabSearch, key, value)} />}
              <button className={styles.searchBtn} onClick={runSearch}>
                Search {activeTab}
              </button>
            </div>
          </div>
        )}

        {mode === 'contributor' && (
          <button className={styles.ctaBtn} onClick={() => navigate('/signup')}>
            Join as Contributor
          </button>
        )}

        <div className={styles.statsBar}>
          {[
            ['2,400+', 'Hidden Destinations'],
            ['890+', 'Local Contributors'],
            ['140+', 'Remote Regions'],
            ['AI', 'Smart Itineraries'],
          ].map(([num, label]) => (
            <div key={label} className={styles.statItem}>
              <span className={styles.statNum}>{num}</span>
              <span className={styles.statLabel}>{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.eyebrowSection}>Spiritual & Heritage</p>
              <h2 className={styles.sectionTitle}>Discover India's <em>Soul</em></h2>
            </div>
            <button className={styles.viewAll} onClick={() => navigate('/explore')}>Explore all</button>
          </div>
          <div className={styles.destGrid}>
            {DESTINATIONS.map((destination) => (
              <div key={destination.name} className={styles.destCard}>
                <div className={styles.destImgWrapper}>
                  <div className={styles.destImage} style={{ backgroundImage: `url(${destination.image})` }} />
                  <span className={styles.destTag} style={destination.tagColor}>{destination.tag}</span>
                </div>
                <div className={styles.destInfo}>
                  <h3>{destination.name}</h3>
                  <p className={styles.destState}>{destination.state}</p>
                  <p className={styles.destDesc}>{destination.desc}</p>
                  <span className={styles.destLink}>Explore Location -&gt;</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.sectionWhite}`}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.eyebrowSection}>Off the beaten path</p>
              <h2 className={styles.sectionTitle}>Places most maps <em>ignore</em></h2>
            </div>
            <button className={styles.viewAll} onClick={() => navigate('/explore')}>Explore all</button>
          </div>
          <div className={`${styles.destGrid} ${styles.destGridWide}`}>
            {MORE_DESTINATIONS.map((destination) => (
              <div key={destination.name} className={styles.destCard}>
                <div className={styles.destImgWrapper} style={{ height: '280px' }}>
                  <div className={styles.destImage} style={{ backgroundImage: `url(${destination.image})` }} />
                  <span className={styles.destTag} style={destination.tagColor}>{destination.tag}</span>
                </div>
                <div className={styles.destInfo}>
                  <h3>{destination.name}</h3>
                  <p className={styles.destState}>{destination.state}</p>
                  <p className={styles.destDesc}>{destination.desc}</p>
                  <span className={styles.destLink}>Explore Location -&gt;</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.sectionWhite}`}>
        <div className={styles.container}>
          <div className={styles.aiBanner}>
            <div className={styles.aiLeft}>
              <span className={styles.aiIcon}>AI</span>
              <div>
                <p className={styles.eyebrowSection}>AI-Powered</p>
                <h2 className={styles.sectionTitle}>Your personal <em>virtual guide</em></h2>
                <p className={styles.aiDesc}>
                  Tell us your destination, days and budget. Get a complete itinerary with real pacing and practical trip guidance.
                </p>
              </div>
            </div>
            <div className={styles.aiForm}>
              <div className={styles.aiFields}>
                <div className={styles.aiField}>
                  <label>Where to?</label>
                  <input placeholder="Destination or region" value={plannerDestination} onChange={(e) => setPlannerDestination(e.target.value)} />
                </div>
                <div className={styles.aiField}>
                  <label>Days</label>
                  <input type="number" placeholder="7" value={plannerDays} onChange={(e) => setPlannerDays(e.target.value)} />
                </div>
                <div className={styles.aiField}>
                  <label>Budget</label>
                  <input placeholder="Rs 20,000" value={plannerBudget} onChange={(e) => setPlannerBudget(e.target.value)} />
                </div>
              </div>
              <button className={styles.aiBtnFull} onClick={openPlanner}>Generate My Itinerary</button>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.eyebrowSection}>Trending this season</p>
              <h2 className={styles.sectionTitle}>Popular Trip Packages</h2>
            </div>
            <button className={styles.viewAll} onClick={() => navigate('/explore')}>See all</button>
          </div>
          <div className={styles.packagesGrid}>
            {PACKAGES.map((pkg) => (
              <div key={pkg.name} className={styles.packageCard}>
                <div className={styles.packageImg} style={{ backgroundImage: `linear-gradient(180deg, rgba(15,23,42,0.05), rgba(15,23,42,0.58)), url(${pkg.image})` }}>
                  <span>{pkg.label}</span>
                </div>
                <div className={styles.packageBody}>
                  <div className={styles.packageTags}>
                    {pkg.tags.map((tag) => <span key={tag} className={styles.ptag}>{tag}</span>)}
                  </div>
                  <h3>{pkg.name}</h3>
                  <p>{pkg.nights} Nights - {pkg.nights + 1} Days</p>
                  <div className={styles.packagePrice}>
                    From <strong>Rs {pkg.price.toLocaleString('en-IN')}</strong> <span>/person</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.sectionWhite}`}>
        <div className={styles.container}>
          <div className={`${styles.sectionHeader} ${styles.centerHeader}`}>
            <div>
              <p className={styles.eyebrowSection}>Why choose us</p>
              <h2 className={styles.sectionTitle}>Beyond booking - <em>genuine discovery</em></h2>
            </div>
          </div>
          <div className={styles.whyGrid}>
            {WHY_US.map((item) => (
              <div key={item.title} className={styles.whyCard}>
                <div className={styles.whyIcon}>{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}

function FieldBox({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '14px 18px', borderRight: '1.5px solid var(--border)' }}>
      <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 6 }}>
        {label}
      </div>
      {children}
    </div>
  )
}

function FieldInput({ placeholder, type = 'text', value, onChange }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(event) => onChange?.(event.target.value)}
      style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-dark)', background: 'transparent', border: 'none', outline: 'none', width: '100%' }}
    />
  )
}

function FieldSelect({ options, value, onChange }) {
  return (
    <select
      value={value}
      onChange={(event) => onChange?.(event.target.value)}
      style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-dark)', background: 'transparent', border: 'none', outline: 'none', width: '100%', cursor: 'pointer' }}
    >
      {options.map((option) => <option key={option}>{option}</option>)}
    </select>
  )
}

function FlightFields({ tripType, values, onChange }) {
  return (
    <>
      <FieldBox label="From"><FieldInput placeholder="City or Airport" value={values.from} onChange={(value) => onChange('from', value)} /></FieldBox>
      <FieldBox label="To"><FieldInput placeholder="City or Airport" value={values.to} onChange={(value) => onChange('to', value)} /></FieldBox>
      <FieldBox label="Departure"><FieldInput type="date" value={values.date} onChange={(value) => onChange('date', value)} /></FieldBox>
      {tripType === 'round-trip' && <FieldBox label="Return"><FieldInput type="date" value={values.returnDate || ''} onChange={(value) => onChange('returnDate', value)} /></FieldBox>}
      <FieldBox label="Passengers"><FieldSelect options={['1 Adult, Economy', '2 Adults, Economy', '1 Adult, Business']} value={values.pax} onChange={(value) => onChange('pax', value)} /></FieldBox>
    </>
  )
}

function TrainFields({ values, onChange }) {
  return (
    <>
      <FieldBox label="From Station"><FieldInput placeholder="City or Station" value={values.from} onChange={(value) => onChange('from', value)} /></FieldBox>
      <FieldBox label="To Station"><FieldInput placeholder="City or Station" value={values.to} onChange={(value) => onChange('to', value)} /></FieldBox>
      <FieldBox label="Date"><FieldInput type="date" value={values.date} onChange={(value) => onChange('date', value)} /></FieldBox>
      <FieldBox label="Class"><FieldSelect options={['All Classes', 'Sleeper', '3A', '2A', '1A']} value={values.class} onChange={(value) => onChange('class', value)} /></FieldBox>
    </>
  )
}

function HotelFields({ values, onChange }) {
  return (
    <>
      <FieldBox label="Destination"><FieldInput placeholder="City, village or region" value={values.dest} onChange={(value) => onChange('dest', value)} /></FieldBox>
      <FieldBox label="Check-in"><FieldInput type="date" value={values.checkIn} onChange={(value) => onChange('checkIn', value)} /></FieldBox>
      <FieldBox label="Check-out"><FieldInput type="date" value={values.checkOut} onChange={(value) => onChange('checkOut', value)} /></FieldBox>
      <FieldBox label="Guests"><FieldSelect options={['1 Guest, 1 Room', '2 Guests, 1 Room', '4 Guests, 2 Rooms']} value={values.guests} onChange={(value) => onChange('guests', value)} /></FieldBox>
    </>
  )
}

function CabFields({ values, onChange }) {
  return (
    <>
      <FieldBox label="Pickup"><FieldInput placeholder="Address or landmark" value={values.pickup} onChange={(value) => onChange('pickup', value)} /></FieldBox>
      <FieldBox label="Drop"><FieldInput placeholder="Destination" value={values.drop} onChange={(value) => onChange('drop', value)} /></FieldBox>
      <FieldBox label="Date & Time"><FieldInput type="datetime-local" value={values.date} onChange={(value) => onChange('date', value)} /></FieldBox>
      <FieldBox label="Cab Type"><FieldSelect options={['Any Cab', 'Mini', 'Sedan', 'SUV', 'Local Driver']} value={values.type} onChange={(value) => onChange('type', value)} /></FieldBox>
    </>
  )
}
