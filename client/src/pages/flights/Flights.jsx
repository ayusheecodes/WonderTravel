import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import useCartStore from '../../store/useCartStore'
import styles from './Flights.module.css'

const ALL_FLIGHTS = [
  { id:1,  airline:'IndiGo',    code:'6E-204', dep:'05:10', arr:'07:20', duration:'2h 10m', stops:0, price:4299,  origPrice:5100, timeSlot:'early',     amenities:['wifi','meal'],            refundable:false, badge:'Cheapest',   seats:4  },
  { id:2,  airline:'Air India', code:'AI-102', dep:'07:40', arr:'10:05', duration:'2h 25m', stops:0, price:5850,  origPrice:6400, timeSlot:'morning',   amenities:['wifi','meal','usb'],       refundable:true,  badge:'',           seats:8  },
  { id:3,  airline:'Vistara',   code:'UK-955', dep:'09:15', arr:'11:30', duration:'2h 15m', stops:0, price:6200,  origPrice:7200, timeSlot:'morning',   amenities:['wifi','meal','usb'],       refundable:true,  badge:'Best Rated', seats:3  },
  { id:4,  airline:'IndiGo',    code:'6E-812', dep:'11:00', arr:'14:20', duration:'3h 20m', stops:1, price:3499,  origPrice:4200, timeSlot:'morning',   amenities:['meal'],                   refundable:false, badge:'',           seats:12 },
  { id:5,  airline:'SpiceJet',  code:'SG-118', dep:'12:30', arr:'15:00', duration:'2h 30m', stops:0, price:3850,  origPrice:4500, timeSlot:'afternoon', amenities:[],                         refundable:false, badge:'',           seats:6  },
  { id:6,  airline:'Air India', code:'AI-664', dep:'14:10', arr:'19:45', duration:'5h 35m', stops:1, price:4100,  origPrice:4800, timeSlot:'afternoon', amenities:['wifi','meal'],            refundable:true,  badge:'',           seats:9  },
  { id:7,  airline:'Vistara',   code:'UK-101', dep:'18:20', arr:'20:40', duration:'2h 20m', stops:0, price:7400,  origPrice:8800, timeSlot:'night',     amenities:['wifi','meal','usb','power'],refundable:true, badge:'Premium',    seats:2  },
  { id:8,  airline:'SpiceJet',  code:'SG-224', dep:'20:10', arr:'23:55', duration:'3h 45m', stops:1, price:3200,  origPrice:3900, timeSlot:'night',     amenities:[],                         refundable:false, badge:'',           seats:14 },
  { id:9,  airline:'IndiGo',    code:'6E-508', dep:'21:45', arr:'00:05', duration:'2h 20m', stops:0, price:4600,  origPrice:5200, timeSlot:'night',     amenities:['wifi'],                   refundable:false, badge:'',           seats:5  },
  { id:10, airline:'Air India', code:'AI-310', dep:'06:20', arr:'08:50', duration:'2h 30m', stops:0, price:5200,  origPrice:5900, timeSlot:'early',     amenities:['wifi','meal'],            refundable:true,  badge:'',           seats:7  },
  { id:11, airline:'IndiGo',    code:'6E-922', dep:'13:15', arr:'15:30', duration:'2h 15m', stops:0, price:4100,  origPrice:4700, timeSlot:'afternoon', amenities:['wifi'],                   refundable:false, badge:'',           seats:10 },
  { id:12, airline:'SpiceJet',  code:'SG-412', dep:'16:00', arr:'18:30', duration:'2h 30m', stops:0, price:3650,  origPrice:4200, timeSlot:'afternoon', amenities:[],                         refundable:false, badge:'',           seats:8  },
]

const AL_BG    = { IndiGo:'#e8f0ff','Air India':'#fff0f0',Vistara:'#f0e8ff',SpiceJet:'#fff4e8' }
const AL_COLOR = { IndiGo:'#2563cf','Air India':'#cf2525',Vistara:'#7c25cf',SpiceJet:'#cf6c25' }
const AL_CODE  = { IndiGo:'6E','Air India':'AI',Vistara:'UK',SpiceJet:'SG' }
const A_ICONS  = { wifi:'📶',meal:'🍽️',usb:'🔌',power:'⚡' }

export default function Flights() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { addItem } = useCartStore()

  const fromParam    = searchParams.get('from')  || ''
  const toParam      = searchParams.get('to')    || ''
  const dateParam    = searchParams.get('date')  || ''
  const paxParam     = searchParams.get('pax')   || '1 Adult, Economy'

  // Modify search state
  const [from,     setFrom]     = useState(fromParam)
  const [to,       setTo]       = useState(toParam)
  const [date,     setDate]     = useState(dateParam)
  const [pax,      setPax]      = useState(paxParam)
  const [showModify, setShowModify] = useState(false)

  // Filter state
  const [sortKey,     setSortKey]     = useState('price')
  const [stopsFilter, setStopsFilter] = useState([])
  const [airlines,    setAirlines]    = useState(['IndiGo','Air India','Vistara','SpiceJet'])
  const [maxPrice,    setMaxPrice]    = useState(18500)
  const [activeSlots, setActiveSlots] = useState([])
  const [expanded,    setExpanded]    = useState(null)
  const [selectedFlight, setSelected]= useState(null)
  const [selectedFare,   setFare]    = useState('saver')

  const filtered = ALL_FLIGHTS
    .filter(f => stopsFilter.length === 0 || stopsFilter.includes(f.stops))
    .filter(f => airlines.includes(f.airline))
    .filter(f => f.price <= maxPrice)
    .filter(f => activeSlots.length === 0 || activeSlots.includes(f.timeSlot))
    .sort((a,b) => {
      if (sortKey === 'price')    return a.price - b.price
      if (sortKey === 'duration') return a.duration.localeCompare(b.duration)
      if (sortKey === 'depart')   return a.dep.localeCompare(b.dep)
      return 0
    })

  const toggleStop    = s => setStopsFilter(p => p.includes(s) ? p.filter(x=>x!==s) : [...p,s])
  const toggleAirline = a => setAirlines(p => p.includes(a) ? p.filter(x=>x!==a) : [...p,a])
  const toggleSlot    = s => setActiveSlots(p => p.includes(s) ? p.filter(x=>x!==s) : [...p,s])
  const farePrice     = f => ({saver:f.price, flexi:f.price+900, business:Math.round(f.price*2.8)})[selectedFare]

  const resetFilters = () => {
    setStopsFilter([]); setAirlines(['IndiGo','Air India','Vistara','SpiceJet'])
    setMaxPrice(18500); setActiveSlots([]); setSortKey('price')
  }

  const handleModifySearch = () => {
    navigate(`/flights?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${encodeURIComponent(date)}&pax=${encodeURIComponent(pax)}`)
    setShowModify(false)
  }

  const displayFrom = fromParam || 'Delhi'
  const displayTo   = toParam   || 'Mumbai'
  const displayDate = dateParam  ? new Date(dateParam).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}) : 'Select Date'

  const handleBookNow = () => {
    if (!selectedFlight) return;
    addItem({
      id: selectedFlight.id,
      type: 'flight',
      title: `${selectedFlight.airline} ${selectedFlight.code}`,
      subtitle: `${displayFrom.split(',')[0]} to ${displayTo.split(',')[0]} · ${paxParam}`,
      price: farePrice(selectedFlight),
      details: {
        code: selectedFlight.code,
        from: displayFrom,
        to: displayTo,
        dep: selectedFlight.dep,
        arr: selectedFlight.arr,
        date: displayDate,
        passengers: Number.parseInt(paxParam, 10) || 1,
        class: selectedFare === 'business' ? 'Business' : 'Economy',
      }
    });
    navigate('/checkout');
  };

  return (
    <div className={styles.page}>
      {/* RESULTS HEADER */}
      <div className={styles.resultsHeader}>
        <div className={styles.rhInner}>
          <div>
            <h1 className={styles.rhTitle}>{displayFrom} → {displayTo}</h1>
            <span className={styles.rhMeta}>{displayDate} · {paxParam}</span>
          </div>
          <button className={styles.modifyBtn} onClick={() => setShowModify(p=>!p)}>✎ Modify Search</button>
          <div className={styles.rhCount}><span className={styles.rhNum}>{filtered.length}</span> flights found</div>
          <div className={styles.sortBar}>
            <span className={styles.sortLabel}>Sort:</span>
            {[['price','Cheapest'],['duration','Fastest'],['depart','Departure']].map(([k,l]) => (
              <button key={k} className={`${styles.sortBtn} ${sortKey===k?styles.sortBtnActive:''}`} onClick={()=>setSortKey(k)}>{l}</button>
            ))}
          </div>
        </div>

        {/* MODIFY PANEL */}
        {showModify && (
          <div className={styles.modifyPanel}>
            <div className={styles.modifyInner}>
              <div className={styles.modifyFields}>
                <div className={styles.mfBox}>
                  <label>From</label>
                  <input value={from} onChange={e=>setFrom(e.target.value)} placeholder="City or Airport" />
                </div>
                <div className={styles.mfBox}>
                  <label>To</label>
                  <input value={to} onChange={e=>setTo(e.target.value)} placeholder="City or Airport" />
                </div>
                <div className={styles.mfBox}>
                  <label>Date</label>
                  <input type="date" value={date} onChange={e=>setDate(e.target.value)} />
                </div>
                <div className={styles.mfBox}>
                  <label>Passengers</label>
                  <select value={pax} onChange={e=>setPax(e.target.value)}>
                    <option>1 Adult, Economy</option>
                    <option>2 Adults, Economy</option>
                    <option>1 Adult, Business</option>
                  </select>
                </div>
                <button className={styles.modifySearchBtn} onClick={handleModifySearch}>Search</button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className={styles.layout}>
        {/* FILTERS */}
        <aside className={styles.filters}>
          <div className={styles.filterHeader}><span>Filters</span><button className={styles.resetBtn} onClick={resetFilters}>Reset all</button></div>

          <div className={styles.filterSection}>
            <div className={styles.filterTitle}>Stops</div>
            {[[0,'Non-stop'],[1,'1 Stop'],[2,'2+ Stops']].map(([v,l]) => (
              <label key={v} className={styles.checkLabel}>
                <input type="checkbox" checked={stopsFilter.includes(v)} onChange={()=>toggleStop(v)} />
                <span className={styles.checkBox} />{l}
              </label>
            ))}
          </div>

          <div className={styles.filterSection}>
            <div className={styles.filterTitle}>Max Price: <strong>₹{maxPrice.toLocaleString()}</strong></div>
            <input type="range" min={3200} max={18500} value={maxPrice} className={styles.rangeSlider} onChange={e=>setMaxPrice(+e.target.value)} />
            <div className={styles.rangeLabels}><span>₹3,200</span><span>₹18,500</span></div>
          </div>

          <div className={styles.filterSection}>
            <div className={styles.filterTitle}>Departure Time</div>
            <div className={styles.timeSlots}>
              {[['🌅','early','Before 6 AM'],['☀️','morning','6AM–12PM'],['🌤️','afternoon','12–6PM'],['🌙','night','After 6PM']].map(([icon,val,label]) => (
                <div key={val} className={`${styles.timeSlot} ${activeSlots.includes(val)?styles.timeSlotActive:''}`} onClick={()=>toggleSlot(val)}>
                  <span>{icon}</span><span className={styles.tsLabel}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.filterSection}>
            <div className={styles.filterTitle}>Airlines</div>
            {['IndiGo','Air India','Vistara','SpiceJet'].map(a => (
              <label key={a} className={styles.checkLabel}>
                <input type="checkbox" checked={airlines.includes(a)} onChange={()=>toggleAirline(a)} />
                <span className={styles.checkBox} />
                <span className={styles.alCode} style={{background:AL_BG[a],color:AL_COLOR[a]}}>{AL_CODE[a]}</span>
                {a}
              </label>
            ))}
          </div>
        </aside>

        {/* RESULTS */}
        <main className={styles.results}>
          <div className={styles.remoteBanner}>
            <span>🏔️</span>
            <div><strong>Reaching a remote area?</strong> WonderTravel covers airstrips other platforms miss.</div>
            <a href="#">Explore remote flights →</a>
          </div>

          {filtered.length === 0 && (
            <div className={styles.noResults}>
              <div className={styles.noResultsIcon}>✈️</div>
              <h3>No flights match your filters</h3>
              <p>Try adjusting filters or <button className={styles.resetLinkBtn} onClick={resetFilters}>reset all</button></p>
            </div>
          )}

          {filtered.map((f, idx) => (
            <div key={f.id} className={styles.flightCard} style={{animationDelay:`${idx*0.06}s`}}>
              {f.badge && (
                <div className={`${styles.badge} ${f.badge==='Cheapest'?styles.badgeBlue:f.badge==='Best Rated'?styles.badgeGreen:styles.badgePurple}`}>{f.badge}</div>
              )}
              <div className={styles.fcMain}>
                <div className={styles.fcAirline}>
                  <div className={styles.fcLogo} style={{background:AL_BG[f.airline],color:AL_COLOR[f.airline]}}>{AL_CODE[f.airline]}</div>
                  <div><div className={styles.fcName}>{f.airline}</div><div className={styles.fcCode}>{f.code}</div></div>
                </div>
                <div className={styles.fcRoute}>
                  <div className={styles.fcTimeBlock}><span className={styles.fcTime}>{f.dep}</span><span className={styles.fcCity}>{displayFrom.split(',')[0].slice(0,3).toUpperCase() || 'DEL'}</span></div>
                  <div className={styles.fcMid}>
                    <span className={styles.fcDur}>{f.duration}</span>
                    <div className={styles.fcLine}><div className={styles.fcDot}/><span className={styles.fcPlane}>✈</span><div className={styles.fcDot}/></div>
                    <span className={`${styles.fcStops} ${f.stops===0?styles.fcStopsNone:''}`}>{f.stops===0?'Non-stop':`${f.stops} Stop`}</span>
                  </div>
                  <div className={styles.fcTimeBlock}><span className={styles.fcTime}>{f.arr}</span><span className={styles.fcCity}>{displayTo.split(',')[0].slice(0,3).toUpperCase() || 'BOM'}</span></div>
                </div>
                <div className={styles.fcAmenities}>
                  {f.amenities.map(a => <span key={a} className={styles.fcAmenity} title={a}>{A_ICONS[a]}</span>)}
                  <span className={f.refundable?styles.fcRefund:styles.fcNoRefund}>{f.refundable?'✓ Refundable':'✗ Non-refundable'}</span>
                </div>
                <div className={styles.fcPrice}>
                  {f.origPrice && <span className={styles.fcOrig}>₹{f.origPrice.toLocaleString()}</span>}
                  <span className={styles.fcAmt}>₹{f.price.toLocaleString()}</span>
                  <span className={styles.fcPer}>per person</span>
                  <button className={styles.btnBook} onClick={()=>{setSelected(f);setFare('saver')}}>Book Now</button>
                  <span className={styles.fcSeats}>Only {f.seats} seats left</span>
                </div>
              </div>
              <div className={styles.fcExpandRow}>
                <button className={styles.fcDetailsBtn} onClick={()=>setExpanded(expanded===f.id?null:f.id)}>
                  Flight Details {expanded===f.id?'▴':'▾'}
                </button>
              </div>
              {expanded===f.id && (
                <div className={styles.fcDetails}>
                  <div className={styles.fdpStop}>
                    <div className={`${styles.fdpDot} ${styles.fdpDep}`}/>
                    <div><strong>{f.dep}</strong> — {displayFrom || 'Delhi'} Airport · Terminal 2</div>
                  </div>
                  <div className={styles.fdpStop}>
                    <div className={`${styles.fdpDot} ${styles.fdpArr}`}/>
                    <div><strong>{f.arr}</strong> — {displayTo || 'Mumbai'} Airport · Terminal 1</div>
                  </div>
                  <div className={styles.fdpExtras}>
                    {[['✈ Aircraft','Airbus A320'],['🧳 Cabin Bag','7 kg'],['🛄 Check-in','15 kg (paid)'],['💺 Seat','Free select']].map(([k,v])=>(
                      <div key={k} className={styles.fdpExtra}><span>{k}</span><span>{v}</span></div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </main>
      </div>

      {/* MODAL */}
      {selectedFlight && (
        <div className={styles.modalOverlay} onClick={e=>e.target===e.currentTarget&&setSelected(null)}>
          <div className={styles.modal}>
            <button className={styles.modalClose} onClick={()=>setSelected(null)}>✕</button>
            <div className={styles.modalHeader}>
              <span className={styles.modalIcon}>✈️</span>
              <div>
                <h2 className={styles.modalTitle}>{selectedFlight.airline} {selectedFlight.code}</h2>
                <p className={styles.modalSub}>{displayFrom} → {displayTo} · {selectedFlight.dep} – {selectedFlight.arr}</p>
              </div>
            </div>
            <div className={styles.fareTabs}>
              {[['saver','Saver',selectedFlight.price,'Non-refundable'],['flexi','Flexi',selectedFlight.price+900,'Free cancellation'],['business','Business',Math.round(selectedFlight.price*2.8),'Full flexibility']].map(([key,label,price,tag])=>(
                <button key={key} className={`${styles.fareTab} ${selectedFare===key?styles.fareTabActive:''}`} onClick={()=>setFare(key)}>
                  <span className={styles.ftName}>{label}</span>
                  <span className={styles.ftPrice}>₹{price.toLocaleString()}</span>
                  <span className={styles.ftTag}>{tag}</span>
                </button>
              ))}
            </div>
            <div className={styles.modalDetails}>
              {[['🧳 Cabin Bag','7 kg included'],['🛄 Check-in','15 kg (paid)'],['🍽️ Meals','Available onboard'],['🔄 Cancel',selectedFare==='saver'?'Non-refundable':'Free cancellation'],['📅 Date Change','₹3,000 + fare diff']].map(([k,v])=>(
                <div key={k} className={styles.mdRow}><span>{k}</span><span>{v}</span></div>
              ))}
            </div>
            <div className={styles.modalFooter}>
              <div className={styles.modalTotal}>Total: <strong>₹{farePrice(selectedFlight).toLocaleString()}</strong><span> /person</span></div>
              <button className={styles.btnBookNow} onClick={handleBookNow}>Continue to Booking →</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
