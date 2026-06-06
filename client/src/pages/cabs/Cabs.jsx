import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import useCartStore from '../../store/useCartStore'
import styles from './Cabs.module.css'

const ALL_CABS = [
  { id:1, driverName:'Ramesh Thakur',   vehicle:'Innova Crysta',  number:'HP 01 A 1234', cabtype:'SUV',   drivertype:'local',    emoji:'🚐', bg:'#e8f4d8', rating:4.9, trips:312, price:2200, capacity:6, eta:7,  features:['4x4','ac','music','luggage'], lang:'Hindi, Pahari',          desc:'Born in Manali. Knows every shortcut and remote route.', yearsExp:11, badge:'Top Local Pick' },
  { id:2, driverName:'Suresh Kumar',    vehicle:'Toyota Fortuner', number:'HP 03 C 5678', cabtype:'SUV',   drivertype:'local',    emoji:'🏔️',bg:'#dceaf8', rating:4.8, trips:228, price:2800, capacity:7, eta:12, features:['4x4','ac','music','luggage'], lang:'Hindi, English',         desc:'Expert on high-altitude routes. Driven to Spiti 100+ times.', yearsExp:9, badge:'' },
  { id:3, driverName:'Ola Outstation',  vehicle:'Swift Dzire',     number:'OLA Fleet',    cabtype:'Sedan', drivertype:'platform', emoji:'🚕', bg:'#f8f0d8', rating:4.2, trips:1840,price:1650, capacity:4, eta:4,  features:['ac','music'],               lang:'Hindi',                  desc:'GPS tracked, 24/7 support. Standard outstation ride.', yearsExp:null, badge:'' },
  { id:4, driverName:'Mohan Singh',     vehicle:'Mahindra Bolero', number:'HP 05 B 9012', cabtype:'SUV',   drivertype:'local',    emoji:'🌿', bg:'#e4f0e8', rating:4.7, trips:189, price:1900, capacity:6, eta:18, features:['4x4','luggage'],             lang:'Hindi, Pahari',          desc:'Kullu-Manali-Rohtang specialist. Local guide knowledge included.', yearsExp:14, badge:'' },
  { id:5, driverName:'Uber Intercity',  vehicle:'Ertiga',          number:'UBER Fleet',   cabtype:'Sedan', drivertype:'platform', emoji:'🚙', bg:'#f0e8f8', rating:4.1, trips:2240,price:1480, capacity:5, eta:6,  features:['ac','music'],               lang:'Hindi',                  desc:'GPS tracked, insured. Standard Uber intercity ride.', yearsExp:null, badge:'' },
  { id:6, driverName:'Vikram Negi',     vehicle:'Maruti Gypsy',    number:'HP 02 D 3456', cabtype:'Mini',  drivertype:'local',    emoji:'🏕️',bg:'#f8ead8', rating:4.6, trips:95,  price:1200, capacity:4, eta:22, features:['4x4','music'],               lang:'Hindi, Pahari',          desc:'The Gypsy conquers roads bigger cars refuse. Best for adventure.', yearsExp:7, badge:'Budget Local' },
  { id:7, driverName:'Deepak Travels',  vehicle:'Tempo Traveller', number:'HP 06 E 7890', cabtype:'Tempo', drivertype:'local',    emoji:'🚌', bg:'#e8e4f8', rating:4.5, trips:143, price:4500, capacity:12, eta:25, features:['ac','music','luggage'],      lang:'Hindi, English',         desc:'Perfect for groups. AC Tempo, driver + helper included.', yearsExp:8, badge:'Group Pick' },
  { id:8, driverName:'Pradeep Chauhan', vehicle:'Innova Crysta',   number:'HP 04 F 2345', cabtype:'SUV',   drivertype:'local',    emoji:'⛰️', bg:'#dce8f4', rating:4.8, trips:267, price:2400, capacity:6, eta:15, features:['4x4','ac','music','luggage'], lang:'Hindi, English, Pahari', desc:'Former HRTC mountain driver. Speaks English fluently.', yearsExp:16, badge:'' },
]

const FEATURE_ICONS = { ac:'❄️','4x4':'🏔️',music:'🎵',luggage:'🧳' }
const CAB_IMAGES = {
  local: '/images/tirthan_valley.png',
  platform: '/images/chopta_1777233813934.png',
}
const initials = name => name.split(' ').map(n=>n[0]).join('').slice(0,2)

export default function Cabs() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { addItem } = useCartStore()

  const pickupParam = searchParams.get('pickup') || ''
  const dropParam   = searchParams.get('drop')   || ''
  const dateParam   = searchParams.get('date')   || ''
  const typeParam   = searchParams.get('type')   || 'Any Cab'

  const [pickup,    setPickup]    = useState(pickupParam)
  const [drop,      setDrop]      = useState(dropParam)
  const [date,      setDate]      = useState(dateParam)
  const [showModify,setShowModify]= useState(false)

  const [sortKey,    setSortKey]    = useState('price')
  const [driverTypes,setDT]         = useState(['local','platform'])
  const [cabTypes,   setCT]         = useState(['SUV','Sedan','Mini','Tempo'])
  const [maxPrice,   setMaxPrice]   = useState(6000)
  const [selected,   setSelected]   = useState(null)

  const filtered = ALL_CABS
    .filter(c => driverTypes.includes(c.drivertype))
    .filter(c => cabTypes.includes(c.cabtype))
    .filter(c => c.price <= maxPrice)
    .filter(c => typeParam==='Any Cab' || typeParam==='' || c.cabtype===typeParam || (typeParam.includes('Local') && c.drivertype==='local'))
    .sort((a,b) => sortKey==='price'?a.price-b.price:sortKey==='rating'?b.rating-a.rating:a.eta-b.eta)

  const toggleDT = t => setDT(p => p.includes(t)?p.filter(x=>x!==t):[...p,t])
  const toggleCT = t => setCT(p => p.includes(t)?p.filter(x=>x!==t):[...p,t])
  const resetFilters = () => { setDT(['local','platform']); setCT(['SUV','Sedan','Mini','Tempo']); setMaxPrice(6000) }

  const handleModifySearch = () => {
    navigate(`/cabs?pickup=${encodeURIComponent(pickup)}&drop=${encodeURIComponent(drop)}&date=${encodeURIComponent(date)}`)
    setShowModify(false)
  }

  const displayPickup = pickupParam || 'Pickup Location'
  const displayDrop   = dropParam   || 'Drop Location'

  const handleBookCab = () => {
    if (!selected) return

    addItem({
      id: `CAB-${selected.id}`,
      type: 'cab',
      title: `${selected.vehicle} with ${selected.driverName}`,
      subtitle: `${displayPickup} to ${displayDrop}`,
      price: selected.price,
      details: {
        driverName: selected.driverName,
        vehicle: selected.vehicle,
        pickup: displayPickup,
        drop: displayDrop,
        isLocalDriver: selected.drivertype === 'local',
        date: dateParam || 'Flexible',
      },
    })
    navigate('/checkout')
  }

  return (
    <div className={styles.page}>
      <div className={styles.resultsHeader}>
        <div className={styles.rhInner}>
          <div>
            <h1 className={styles.rhTitle}>{displayPickup} → {displayDrop}</h1>
            <span className={styles.rhMeta}>{dateParam ? new Date(dateParam).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'}) : 'Select Date & Time'}</span>
          </div>
          <button className={styles.modifyBtn} onClick={()=>setShowModify(p=>!p)}>✎ Modify Search</button>
          <div className={styles.rhCount}><span className={styles.rhNum}>{filtered.length}</span> cabs available</div>
          <div className={styles.sortBar}>
            <span className={styles.sortLabel}>Sort:</span>
            {[['price','Cheapest'],['rating','Rating'],['eta','Fastest ETA']].map(([k,l])=>(
              <button key={k} className={`${styles.sortBtn} ${sortKey===k?styles.sortBtnActive:''}`} onClick={()=>setSortKey(k)}>{l}</button>
            ))}
          </div>
        </div>
        {showModify&&(
          <div className={styles.modifyPanel}>
            <div className={styles.modifyInner}>
              <div className={styles.modifyFields}>
                <div className={styles.mfBox}><label>Pickup</label><input value={pickup} onChange={e=>setPickup(e.target.value)} placeholder="Address or landmark"/></div>
                <div className={styles.mfBox}><label>Drop</label><input value={drop} onChange={e=>setDrop(e.target.value)} placeholder="Destination"/></div>
                <div className={styles.mfBox}><label>Date & Time</label>
                  {/* BUG-06 fix: controlled input so the new value is captured in state */}
                  <input type="datetime-local" value={date} onChange={e=>setDate(e.target.value)}/>
                </div>
                <button className={styles.modifySearchBtn} onClick={handleModifySearch}>Search</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ROUTE INFO BAR */}
      <div className={styles.routeBar}>
        <div className={styles.rbInner}>
          {[['📏','Varies','Distance'],['⏱️','Based on route','Est. Time'],['🏔️','Mountain Route','Terrain'],['⚠️','Remote Route','4×4 recommended']].map(([icon,val,label])=>(
            <div key={label} className={`${styles.rbItem} ${label==='4×4 recommended'?styles.rbRemote:''}`}>
              <span className={styles.rbIcon}>{icon}</span>
              <div><strong>{val}</strong><span>{label}</span></div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.layout}>
        <aside className={styles.filters}>
          <div className={styles.filterHeader}><span>Filters</span><button className={styles.resetBtn} onClick={resetFilters}>Reset all</button></div>
          <div className={styles.filterSection}>
            <div className={styles.filterTitle}>Driver Type</div>
            <label className={styles.checkLabel}><input type="checkbox" checked={driverTypes.includes('local')} onChange={()=>toggleDT('local')}/><span className={styles.checkBox}/>🏔️ Verified Local Drivers</label>
            <label className={styles.checkLabel}><input type="checkbox" checked={driverTypes.includes('platform')} onChange={()=>toggleDT('platform')}/><span className={styles.checkBox}/>📱 Platform Drivers</label>
          </div>
          <div className={styles.filterSection}>
            <div className={styles.filterTitle}>Cab Type</div>
            {[['Mini','🚗 Mini'],['Sedan','🚙 Sedan'],['SUV','🚐 SUV / 4×4'],['Tempo','🚌 Tempo Traveller']].map(([v,l])=>(
              <label key={v} className={styles.checkLabel}><input type="checkbox" checked={cabTypes.includes(v)} onChange={()=>toggleCT(v)}/><span className={styles.checkBox}/>{l}</label>
            ))}
          </div>
          <div className={styles.filterSection}>
            <div className={styles.filterTitle}>Max Price: <strong>₹{maxPrice.toLocaleString()}</strong></div>
            <input type="range" min={800} max={6000} value={maxPrice} className={styles.rangeSlider} onChange={e=>setMaxPrice(+e.target.value)}/>
            <div className={styles.rangeLabels}><span>₹800</span><span>₹6,000</span></div>
          </div>
        </aside>

        <main className={styles.results}>
          <div className={styles.localSpotlight}>
            <span className={styles.lsIcon}>🏔️</span>
            <div className={styles.lsText}>
              <strong>WonderTravel Verified Local Drivers</strong>
              <p>These drivers know every mountain pass on your route. They're not on any other platform.</p>
            </div>
            <span className={styles.lsBadge}>Exclusive to WonderTravel</span>
          </div>

          {filtered.length===0&&(
            <div className={styles.noResults}><div>🚕</div><h3>No cabs match your filters</h3><p><button className={styles.resetLinkBtn} onClick={resetFilters}>Reset filters</button></p></div>
          )}

          {filtered.map((c,idx)=>(
            <div key={c.id} className={`${styles.cabCard} ${c.drivertype==='local'?styles.cabLocal:''}`} style={{animationDelay:`${idx*0.06}s`}}>
              {c.badge&&<div className={`${styles.badge} ${c.badge==='Top Local Pick'?styles.badgeGreen:c.badge==='Group Pick'?styles.badgePurple:styles.badgeAmber}`}>{c.badge}</div>}
              <div className={styles.ccMain}>
                <div className={styles.ccImg} style={{backgroundImage:`linear-gradient(135deg,${c.bg}22,${c.bg}99), url(${CAB_IMAGES[c.drivertype]})`}}>
                  <div className={c.drivertype==='local'?styles.ccLocalTag:styles.ccPlatformTag}>{c.drivertype==='local'?'🏔️ Local Driver':'📱 Platform'}</div>
                </div>
                <div className={styles.ccInfo}>
                  <div className={styles.ccTop}>
                    <div><h3 className={styles.ccVehicle}>{c.vehicle}</h3><span className={styles.ccNumber}>{c.number}</span></div>
                    <div className={styles.ccRating}><span className={styles.ccRatingNum}>{c.rating}</span><span>⭐</span><span className={styles.ccTrips}>{c.trips} trips</span></div>
                  </div>
                  <div className={styles.ccDriverRow}>
                    <div className={styles.ccAvatar}>{initials(c.driverName)}</div>
                    <div className={styles.ccDriverInfo}>
                      <span className={styles.ccDriverName}>{c.driverName}</span>
                      {c.drivertype==='local'?<span className={styles.ccVerified}>✓ WonderTravel Verified</span>:<span className={styles.ccUnverified}>Platform Driver</span>}
                      {c.yearsExp&&<span className={styles.ccExp}>{c.yearsExp} yrs exp · {c.lang}</span>}
                    </div>
                  </div>
                  <p className={styles.ccDesc}>{c.desc}</p>
                  <div className={styles.ccFeatures}>
                    {c.features.map(f=><span key={f} className={styles.ccFeature}>{FEATURE_ICONS[f]} {f==='4x4'?'4×4 Terrain':f.charAt(0).toUpperCase()+f.slice(1)}</span>)}
                    <span className={styles.ccCap}>👥 {c.capacity} seats</span>
                  </div>
                </div>
                <div className={styles.ccPriceCol}>
                  <div className={styles.ccEta}>📍 ETA {c.eta} min</div>
                  <span className={styles.ccPrice}>₹{c.price.toLocaleString()}</span>
                  <span className={styles.ccPer}>one way</span>
                  <button className={styles.btnBook} onClick={()=>setSelected(c)}>Book Now</button>
                  {c.drivertype==='local'?<span className={styles.ccExclusive}>Only on WonderTravel</span>:<span className={styles.ccStd}>Standard booking</span>}
                </div>
              </div>
            </div>
          ))}
        </main>
      </div>

      {selected&&(
        <div className={styles.modalOverlay} onClick={e=>e.target===e.currentTarget&&setSelected(null)}>
          <div className={styles.modal}>
            <button className={styles.modalClose} onClick={()=>setSelected(null)}>✕</button>
            <div className={styles.modalHeader}>
              <span className={styles.modalIcon}>{selected.emoji}</span>
              <div><h2 className={styles.modalTitle}>{selected.driverName} · {selected.vehicle}</h2><p className={styles.modalSub}>{displayPickup} → {displayDrop}</p></div>
            </div>
            <div className={styles.mcdDriver}>
              <div className={styles.mcdAvatar}>{initials(selected.driverName)}</div>
              <div>
                <strong style={{color:'var(--text-dark)',fontSize:14}}>{selected.driverName}</strong>
                {selected.drivertype==='local'?<div className={styles.ccVerified}>✓ WonderTravel Verified Local Driver</div>:<div className={styles.ccUnverified}>Platform Driver</div>}
                {selected.yearsExp&&<div className={styles.ccExp}>{selected.yearsExp} yrs experience · {selected.lang}</div>}
              </div>
              <div style={{marginLeft:'auto',textAlign:'center'}}><div style={{fontSize:22,fontWeight:900,color:'var(--accent)'}}>{selected.rating} ⭐</div><div style={{fontSize:11,color:'var(--text-muted)',fontWeight:600}}>{selected.trips} trips</div></div>
            </div>
            <div className={styles.mcdRows}>
              {[['🚗 Vehicle',`${selected.vehicle} · ${selected.number}`],['👥 Capacity',`${selected.capacity} passengers`],['📍 Route',`${displayPickup} → ${displayDrop}`],['⛽ Fuel','Included in fare'],['📞 Contact','Shared after booking'],['💰 Price',`₹${selected.price.toLocaleString()} one way`]].map(([k,v])=>(
                <div key={k} className={styles.mcdRow}><span>{k}</span><span>{v}</span></div>
              ))}
            </div>
            <div className={styles.modalFooter}>
              <div className={styles.modalTotal}>Total Fare: <strong>₹{selected.price.toLocaleString()}</strong></div>
              <button className={styles.btnBookNow} onClick={handleBookCab}>Book This Cab →</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
