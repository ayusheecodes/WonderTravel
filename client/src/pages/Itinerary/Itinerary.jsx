import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import API from '../../api/axios'
import MapViewer from '../../components/MapViewer/MapViewer'
import useCartStore from '../../store/useCartStore'
import styles from './Itinerary.module.css'

const TYPE_ICON = {
  nature: { icon: 'Nature', color: '#e6f4ee', text: '#2e7d5e' },
  culture: { icon: 'Culture', color: '#f0e8fc', text: '#7c25cf' },
  food: { icon: 'Food', color: '#fff4e8', text: '#b87820' },
  shopping: { icon: 'Shop', color: '#fce8e8', text: '#cf2525' },
  leisure: { icon: 'Relax', color: '#e8f3fc', text: '#1a7fcf' },
  adventure: { icon: 'Adventure', color: '#ecf3ff', text: '#215ea6' },
}

const TRAVEL_STYLES = [
  { id: 'adventure', icon: 'Adventure', label: 'Adventure' },
  { id: 'relaxed', icon: 'Slow', label: 'Relaxed' },
  { id: 'cultural', icon: 'Culture', label: 'Cultural' },
  { id: 'budget', icon: 'Save', label: 'Budget' },
  { id: 'luxury', icon: 'Plus', label: 'Luxury' },
  { id: 'family', icon: 'Family', label: 'Family' },
]

const POPULAR_DESTINATIONS = [
  'Manali, Himachal Pradesh',
  'Goa',
  'Kerala Backwaters',
  'Ziro Valley',
  'Chopta',
  'Coorg',
]

const buildTravelerLabel = (count) => {
  if (count === 1) return '1 Person'
  if (count === 2) return '2 People'
  if (count === 3) return '3 People'
  if (count === 4) return '4 People'
  return '5+ People'
}

export default function Itinerary() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { addItem } = useCartStore()

  const [destination, setDestination] = useState(searchParams.get('destination') || '')
  const [days, setDays] = useState(searchParams.get('days') || '5')
  const [budget, setBudget] = useState(searchParams.get('budget') || 'Rs 20,000')
  const [travelStyle, setStyle] = useState(searchParams.get('style') || 'adventure')
  const [travelers, setTravelers] = useState(searchParams.get('travelers') || '2 People')
  const [errors, setErrors] = useState({})
  const [itinerary, setItinerary] = useState(null)
  const [generating, setGenerating] = useState(false)
  const [activeDay, setActiveDay] = useState(1)
  const [showBudget, setShowBudget] = useState(false)
  const [apiError, setApiError] = useState('')

  const hasPrefill = Boolean(searchParams.get('destination'))

  useEffect(() => {
    if (!hasPrefill || itinerary || generating) return
    handleGenerate(true)
  }, [])

  const handleGenerate = async (silent = false) => {
    const errs = {}
    if (!destination.trim()) errs.destination = 'Please enter a destination'
    if (!days || Number(days) < 1 || Number(days) > 14) errs.days = 'Enter days between 1 and 14'
    if (!budget.trim()) errs.budget = 'Please enter your budget'
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }

    setErrors({})
    setApiError('')
    setGenerating(true)
    if (!silent) setItinerary(null)

    try {
      const { data } = await API.post('/itinerary/generate', {
        destination,
        days: Number(days),
        budget,
        style: travelStyle,
        travelers,
      })

      setItinerary(data)
      setActiveDay(1)
      setSearchParams({
        destination,
        days: `${days}`,
        budget,
        style: travelStyle,
        travelers,
      })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (error) {
      setApiError(error.response?.data?.message || 'Could not generate itinerary right now.')
    } finally {
      setGenerating(false)
    }
  }

  const handleReset = () => {
    setItinerary(null)
    setGenerating(false)
    setActiveDay(1)
    setShowBudget(false)
    setApiError('')
    setSearchParams({})
  }

  const handleBookPackage = () => {
    if (!itinerary) return;
    const numericBudget = parseInt(itinerary.budget.replace(/[^0-9]/g, ''), 10) || 15000;
    
    addItem({
      id: `PKG-${itinerary.destination.substring(0,3).toUpperCase()}-${Math.floor(Math.random()*1000)}`,
      type: 'itinerary',
      title: `${itinerary.destination} Complete Package`,
      subtitle: `${itinerary.days} Days · ${buildTravelerLabel(itinerary.travelers)} · ${TRAVEL_STYLES.find((item) => item.id === itinerary.style)?.label}`,
      price: numericBudget
    });
    navigate('/checkout');
  }

  const currentDayData = itinerary?.days_data?.find((day) => day.day === activeDay)

  if (!itinerary && !generating) {
    return (
      <div className={styles.page}>
        <div className={styles.inputPage}>
          <div className={styles.inputHero}>
            <div className={styles.heroBlob1} />
            <div className={styles.heroBlob2} />
            <div className={styles.heroContent}>
              <p className={styles.eyebrow}>Powered by WonderTravel Planner</p>
              <h1 className={styles.heroTitle}>
                Your personal <em>travel planner</em>
              </h1>
              <p className={styles.heroSub}>
                Build a destination-aware itinerary with practical daily pacing, budget guidance, stays, transport and local tips.
              </p>
            </div>
          </div>

          <div className={styles.formCard}>
            <div className={`${styles.formGroup} ${errors.destination ? styles.hasError : ''}`}>
              <label>
                <span className={styles.labelIcon}>Pin</span>
                Where do you want to go?
              </label>
              <input
                type="text"
                placeholder="e.g. Manali, Goa, Kerala, Ziro Valley..."
                value={destination}
                className={styles.mainInput}
                onChange={(e) => { setDestination(e.target.value); setErrors((p) => ({ ...p, destination: '' })) }}
              />
              {errors.destination && <span className={styles.fieldError}>{errors.destination}</span>}

              <div className={styles.suggestions}>
                <span className={styles.sugLabel}>Popular:</span>
                {POPULAR_DESTINATIONS.map((option) => (
                  <button
                    key={option}
                    className={`${styles.sugBtn} ${destination === option ? styles.sugBtnActive : ''}`}
                    onClick={() => { setDestination(option); setErrors((p) => ({ ...p, destination: '' })) }}
                  >
                    {option.split(',')[0]}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.formRow3}>
              <div className={`${styles.formGroup} ${errors.days ? styles.hasError : ''}`}>
                <label>
                  <span className={styles.labelIcon}>Days</span>
                  Number of Days
                </label>
                <input
                  type="number"
                  min="1"
                  max="14"
                  placeholder="5"
                  value={days}
                  className={styles.fieldInput}
                  onChange={(e) => { setDays(e.target.value); setErrors((p) => ({ ...p, days: '' })) }}
                />
                {errors.days && <span className={styles.fieldError}>{errors.days}</span>}
              </div>

              <div className={`${styles.formGroup} ${errors.budget ? styles.hasError : ''}`}>
                <label>
                  <span className={styles.labelIcon}>Budget</span>
                  Total Budget
                </label>
                <input
                  type="text"
                  placeholder="Rs 20,000"
                  value={budget}
                  className={styles.fieldInput}
                  onChange={(e) => { setBudget(e.target.value); setErrors((p) => ({ ...p, budget: '' })) }}
                />
                {errors.budget && <span className={styles.fieldError}>{errors.budget}</span>}
              </div>

              <div className={styles.formGroup}>
                <label>
                  <span className={styles.labelIcon}>People</span>
                  Travelers
                </label>
                <select
                  value={travelers}
                  className={styles.fieldInput}
                  onChange={(e) => setTravelers(e.target.value)}
                >
                  {['1 Person', '2 People', '3 People', '4 People', '5+ People'].map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>
                <span className={styles.labelIcon}>Style</span>
                Travel Style
              </label>
              <div className={styles.styleGrid}>
                {TRAVEL_STYLES.map((item) => (
                  <button
                    key={item.id}
                    className={`${styles.styleBtn} ${travelStyle === item.id ? styles.styleBtnActive : ''}`}
                    onClick={() => setStyle(item.id)}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {apiError && <div className={styles.fieldError}>{apiError}</div>}

            <button className={styles.generateBtn} onClick={() => handleGenerate()}>
              <span>Plan</span>
              <span>Generate My Itinerary</span>
              <span className={styles.genBtnSub}>Smart pacing · Real budgets · Destination-aware</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (generating) {
    return (
      <div className={styles.page}>
        <div className={styles.loadingPage}>
          <div className={styles.loadingCard}>
            <div className={styles.loadingIcon}>AI</div>
            <h2>Planning your trip to</h2>
            <h1 className={styles.loadingDest}>{destination}</h1>
            <div className={styles.loadingSteps}>
              {[
                'Matching your destination with our travel library...',
                'Balancing daily pacing for your trip style...',
                'Allocating budget across stay, food and transport...',
                'Curating practical activity suggestions...',
                'Finishing your day-by-day route...',
              ].map((step, i) => (
                <div key={step} className={styles.loadingStep} style={{ animationDelay: `${i * 0.5}s` }}>
                  <div className={styles.loadingDot} style={{ animationDelay: `${i * 0.5}s` }} />
                  <span>{step}</span>
                </div>
              ))}
            </div>
            <div className={styles.loadingBar}>
              <div className={styles.loadingBarFill} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.resultHeader}>
        <div className={styles.resultHInner}>
          <div className={styles.resultHLeft}>
            <div className={styles.resultDestIcon}>Trip</div>
            <div>
              <h1 className={styles.resultTitle}>{itinerary.destination}</h1>
              <div className={styles.resultMeta}>
                <span>Days {itinerary.days}</span>
                <span>{buildTravelerLabel(itinerary.travelers)}</span>
                <span>{TRAVEL_STYLES.find((item) => item.id === itinerary.style)?.label}</span>
              </div>
            </div>
          </div>
          <div className={styles.resultHRight}>
            <button className={styles.btnBudget} onClick={() => setShowBudget((p) => !p)}>
              {showBudget ? 'Hide Budget' : 'View Budget'}
            </button>
            <button className={styles.btnNew} style={{ background: '#10b981', color: 'white' }} onClick={handleBookPackage}>
              Book Package
            </button>
            <button className={styles.btnNew} onClick={handleReset}>
              New Itinerary
            </button>
          </div>
        </div>
      </div>

      {showBudget && (
        <div className={styles.budgetPanel}>
          <div className={styles.bpInner}>
            <h3 className={styles.bpTitle}>Budget Breakdown - {itinerary.budget} total</h3>
            <div className={styles.bpGrid}>
              {[
                ['Stay', 'Accommodation', itinerary.budgetBreakdown.accommodation, 38],
                ['Food', 'Food and Dining', itinerary.budgetBreakdown.food, 22],
                ['Transport', 'Transport', itinerary.budgetBreakdown.transport, 18],
                ['Activities', 'Activities', itinerary.budgetBreakdown.activities, 14],
                ['Misc', 'Miscellaneous', itinerary.budgetBreakdown.misc, 8],
              ].map(([icon, label, amount, pct]) => (
                <div key={label} className={styles.bpItem}>
                  <div className={styles.bpItemTop}>
                    <span className={styles.bpIcon}>{icon}</span>
                    <span className={styles.bpLabel}>{label}</span>
                    <span className={styles.bpAmount}>Rs {amount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className={styles.bpBar}>
                    <div className={styles.bpBarFill} style={{ width: `${pct}%` }} />
                  </div>
                  <span className={styles.bpPct}>{pct}% of budget</span>
                </div>
              ))}
            </div>
            <div className={styles.bpPerDay}>
              Approx <strong>Rs {itinerary.dayBudget.toLocaleString('en-IN')}</strong> per day for the trip.
            </div>
          </div>
        </div>
      )}

      <div className={styles.resultLayout}>
        <aside className={styles.resultSidebar}>
          <div className={styles.sideCard}>
            <div className={styles.sideCardTitle}>Your Trip Days</div>
            <div className={styles.daysList}>
              {itinerary.days_data.map((day) => (
                <button
                  key={day.day}
                  className={`${styles.dayBtn} ${activeDay === day.day ? styles.dayBtnActive : ''}`}
                  onClick={() => setActiveDay(day.day)}
                >
                  <span className={styles.dayNum}>Day {day.day}</span>
                  <span className={styles.dayTitle}>{day.title.replace(`Day ${day.day} - `, '')}</span>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.sideCard}>
            <div className={styles.sideCardTitle}>Where to Stay</div>
            <div className={styles.hotelsList}>
              {itinerary.hotels.map((hotel, index) => (
                <div key={hotel} className={styles.hotelItem}>
                  <span className={styles.hotelRank}>{index + 1}</span>
                  <span className={styles.hotelName}>{hotel}</span>
                </div>
              ))}
            </div>
            <button className={styles.searchHotelsBtn} onClick={() => navigate('/hotels')}>
              Search Hotels
            </button>
          </div>

          <div className={styles.sideCard}>
            <div className={styles.sideCardTitle}>Getting There</div>
            <div className={styles.transportList}>
              {itinerary.transport.map((item) => (
                <div key={item} className={styles.transportItem}>
                  <span>Route</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.sideCard}>
            <div className={styles.sideCardTitle}>Local Tips</div>
            <div className={styles.transportList}>
              {itinerary.localTips.map((tip) => (
                <div key={tip} className={styles.transportItem}>
                  <span>Tip</span>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <main className={styles.resultMain}>
          <div className={styles.dayHeader}>
            <div className={styles.dayHeaderLeft}>
              <span className={styles.dayBadge}>Day {activeDay}</span>
              <h2 className={styles.dayHeading}>{currentDayData?.title.replace(`Day ${activeDay} - `, '')}</h2>
            </div>
            <div className={styles.dayNav}>
              <button className={styles.dayNavBtn} disabled={activeDay === 1} onClick={() => setActiveDay((p) => p - 1)}>
                Prev
              </button>
              <span>{activeDay} / {itinerary.days}</span>
              <button className={styles.dayNavBtn} disabled={activeDay === itinerary.days} onClick={() => setActiveDay((p) => p + 1)}>
                Next
              </button>
            </div>
          </div>

          <div className={styles.timelineMapSplit}>
            <div className={styles.timeline}>
              {currentDayData?.activities.map((activity) => {
                const typeStyle = TYPE_ICON[activity.type] || TYPE_ICON.leisure
                return (
                  <div key={`${activity.title}-${activity.dayPart}`} className={styles.timelineItem}>
                    <div className={styles.tlTime}>{activity.dayPart}</div>
                    <div className={styles.tlDotWrap}>
                      <div className={styles.tlDot} style={{ background: typeStyle.text }} />
                      <div className={styles.tlLine} />
                    </div>
                    <div className={styles.tlCard}>
                      <div className={styles.tlCardTop}>
                        <div className={styles.tlTypeTag} style={{ background: typeStyle.color, color: typeStyle.text }}>
                          {typeStyle.icon}
                        </div>
                        <span className={styles.tlCost}>Rs {activity.cost.toLocaleString('en-IN')}</span>
                      </div>
                      <h3 className={styles.tlName}>{activity.title}</h3>
                      <div className={styles.tlTip}>
                        <span className={styles.tlTipIcon}>Note</span>
                        <span>{activity.tip}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className={styles.dayTotal}>
              <span>Estimated Day {activeDay} Cost:</span>
              <strong>Rs {currentDayData?.estimatedCost.toLocaleString('en-IN')}</strong>
            </div>
            
            <MapViewer activities={currentDayData?.activities} destinationName={itinerary.destination} />
          </div>

          <div className={styles.bookBanner}>
            <div className={styles.bbLeft}>
              <h3>Best food and stay signals for this trip</h3>
              <p>{itinerary.foodSpots.join(' · ')}</p>
            </div>
            <div className={styles.bbBtns}>
              <button className={styles.bbBtn} onClick={() => navigate('/flights')}>Flights</button>
              <button className={styles.bbBtn} onClick={() => navigate('/trains')}>Trains</button>
              <button className={styles.bbBtn} onClick={() => navigate('/hotels')}>Hotels</button>
              <button className={styles.bbBtn} onClick={() => navigate('/cabs')}>Cabs</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
