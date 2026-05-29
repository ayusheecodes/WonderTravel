import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import useCartStore from '../../store/useCartStore'
import styles from './Hotels.module.css'

const ALL_HOTELS = [
  { id:1,  name:'The Manali Inn',         type:'Hotel',    stars:4, emoji:'🏨', bg:'#d8eaf8', rating:4.6, reviews:284, price:2800, origPrice:3500, amenities:['wifi','parking','breakfast','mountain','heater'], tags:['Free Cancellation','Couple Friendly'], desc:'Panoramic Himalayan views, walking distance to Mall Road.', rooms:[{name:'Deluxe Mountain View',price:2800},{name:'Suite with Balcony',price:4200}], badge:'Top Rated' },
  { id:2,  name:'Snow Valley Resort',      type:'Resort',   stars:5, emoji:'🌨️',bg:'#e8f0f8', rating:4.8, reviews:156, price:6500, origPrice:8000, amenities:['wifi','parking','breakfast','mountain','heater'], tags:['Luxury','Spa'],                  desc:'Heated pools, spa, and unobstructed views of Rohtang Pass.', rooms:[{name:'Premium Suite',price:6500},{name:'Presidential Suite',price:9800}], badge:'Luxury Pick' },
  { id:3,  name:'Kullu Riverside Cottage', type:'Cottage',  stars:3, emoji:'🌲', bg:'#d8f0d8', rating:4.7, reviews:98,  price:1800, origPrice:2200, amenities:['wifi','parking','breakfast','heater'],           tags:['River View','Bonfire'],          desc:'Charming wooden cottages on the banks of Beas river.', rooms:[{name:'Riverside Cottage',price:1800},{name:'Family Cottage',price:2600}], badge:'' },
  { id:4,  name:'Sharma Homestay',         type:'Homestay', stars:2, emoji:'🏡', bg:'#f0ead8', rating:4.9, reviews:67,  price:950,  origPrice:null,  amenities:['wifi','parking','breakfast','mountain','heater'], tags:['Local Experience','✓ WonderTravel Verified'], desc:'Authentic Himachali homestay. Home-cooked food, real mountain life.', rooms:[{name:'Standard Room',price:950},{name:'Deluxe Room',price:1200}], badge:'Community Pick' },
  { id:5,  name:'Hotel Rohtang View',      type:'Hotel',    stars:3, emoji:'🏔️',bg:'#e8e0f8', rating:4.2, reviews:203, price:1600, origPrice:1900, amenities:['wifi','heater','mountain'],                      tags:['Free Cancellation'],            desc:'Budget-friendly hotel with direct views of Rohtang Pass.', rooms:[{name:'Standard Room',price:1600}], badge:'' },
  { id:6,  name:'Deodar Forest Camp',      type:'Cottage',  stars:2, emoji:'⛺', bg:'#d8f4e8', rating:4.5, reviews:44,  price:1200, origPrice:null,  amenities:['parking','breakfast','mountain','heater'],        tags:['Eco Stay','Campfire'],          desc:'Eco-friendly camp in deodar forest. Ideal base for Hampta Pass trek.', rooms:[{name:'Deluxe Tent',price:1200},{name:'Swiss Tent',price:1600}], badge:'' },
  { id:7,  name:'Apple Orchard Resort',    type:'Resort',   stars:4, emoji:'🍎', bg:'#f0f8d8', rating:4.4, reviews:118, price:3800, origPrice:4500, amenities:['wifi','parking','breakfast','mountain'],          tags:['Apple Orchard','Family'],       desc:'Set amidst apple orchards with stunning valley views.', rooms:[{name:'Garden View Room',price:3800},{name:'Orchard Suite',price:5200}], badge:'' },
  { id:8,  name:'Beas Valley Guesthouse',  type:'Homestay', stars:2, emoji:'🌿', bg:'#e8f4ec', rating:4.3, reviews:29,  price:800,  origPrice:null,  amenities:['wifi','heater','breakfast'],                     tags:['Budget Pick','Home Meals'],     desc:'Small family-run guesthouse in Old Manali. Local Himachali cuisine.', rooms:[{name:'Economy Room',price:800}], badge:'' },
]

const AMENITY_ICONS = { wifi:'📶',parking:'🅿️',breakfast:'🍳',mountain:'🏔️',heater:'🔥' }
const HOTEL_IMAGES = {
  Hotel: '/images/bhubaneswar_1777233740502.png',
  Resort: '/images/ziro_valley_1777233795515.png',
  Cottage: '/images/tirthan_valley.png',
  Homestay: '/images/banaras_ghats_1777233756750.png',
}

export default function Hotels() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { addItem } = useCartStore()

  const destParam     = searchParams.get('dest')     || ''
  const checkInParam  = searchParams.get('checkIn')  || ''
  const checkOutParam = searchParams.get('checkOut') || ''
  const guestsParam   = searchParams.get('guests')   || '2 Guests, 1 Room'

  const [dest,      setDest]      = useState(destParam)
  const [checkIn,   setCheckIn]   = useState(checkInParam)
  const [checkOut,  setCheckOut]  = useState(checkOutParam)
  const [showModify,setShowModify]= useState(false)

  const [sortKey,  setSortKey]  = useState('recommended')
  const [maxPrice, setMaxPrice] = useState(12000)
  const [types,    setTypes]    = useState(['Hotel','Resort','Homestay','Cottage'])
  const [selected, setSelected] = useState(null)
  const [selRoom,  setSelRoom]  = useState(0)

  const filtered = ALL_HOTELS
    .filter(h => types.includes(h.type))
    .filter(h => h.price <= maxPrice)
    .sort((a,b) => sortKey==='price' ? a.price-b.price : b.rating-a.rating)

  const toggleType   = t => setTypes(p => p.includes(t)?p.filter(x=>x!==t):[...p,t])
  const resetFilters = () => { setTypes(['Hotel','Resort','Homestay','Cottage']); setMaxPrice(12000) }
  const renderStars  = n => '⭐'.repeat(n)

  const getNights = () => {
    if (checkInParam && checkOutParam) {
      const diff = (new Date(checkOutParam) - new Date(checkInParam)) / (1000*60*60*24)
      return isNaN(diff) || diff <= 0 ? 4 : diff
    }
    return 4
  }
  const nights = getNights()

  const handleModifySearch = () => {
    navigate(`/hotels?dest=${encodeURIComponent(dest)}&checkIn=${encodeURIComponent(checkIn)}&checkOut=${encodeURIComponent(checkOut)}&guests=${encodeURIComponent(guestsParam)}`)
    setShowModify(false)
  }

  const displayDest = destParam || 'Manali'
  const displayDates = checkInParam && checkOutParam
    ? `${new Date(checkInParam).toLocaleDateString('en-IN',{day:'numeric',month:'short'})} – ${new Date(checkOutParam).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}`
    : 'Select Dates'

  const handleBookHotel = () => {
    if (!selected) return
    const room = selected.rooms[selRoom]
    const total = room.price * nights

    addItem({
      id: `HTL-${selected.id}-${selRoom}`,
      type: 'hotel',
      title: selected.name,
      subtitle: `${displayDest} - ${room.name} - ${nights} nights`,
      price: total,
      details: {
        roomType: room.name,
        checkIn: checkInParam || new Date().toISOString(),
        checkOut: checkOutParam || new Date(Date.now() + nights * 86400000).toISOString(),
        nights,
        guests: guestsParam,
      },
    })
    navigate('/checkout')
  }

  return (
    <div className={styles.page}>
      <div className={styles.resultsHeader}>
        <div className={styles.rhInner}>
          <div>
            <h1 className={styles.rhTitle}>Hotels in {displayDest}</h1>
            <span className={styles.rhMeta}>{displayDates} · {nights} Nights · {guestsParam}</span>
          </div>
          <button className={styles.modifyBtn} onClick={()=>setShowModify(p=>!p)}>✎ Modify Search</button>
          <div className={styles.rhCount}><span className={styles.rhNum}>{filtered.length}</span> hotels found</div>
          <div className={styles.sortBar}>
            <span className={styles.sortLabel}>Sort:</span>
            {[['recommended','Recommended'],['price','Price'],['rating','Rating']].map(([k,l])=>(
              <button key={k} className={`${styles.sortBtn} ${sortKey===k?styles.sortBtnActive:''}`} onClick={()=>setSortKey(k)}>{l}</button>
            ))}
          </div>
        </div>
        {showModify && (
          <div className={styles.modifyPanel}>
            <div className={styles.modifyInner}>
              <div className={styles.modifyFields}>
                <div className={styles.mfBox}><label>Destination</label><input value={dest} onChange={e=>setDest(e.target.value)} placeholder="City or region"/></div>
                <div className={styles.mfBox}><label>Check-in</label><input type="date" value={checkIn} onChange={e=>setCheckIn(e.target.value)}/></div>
                <div className={styles.mfBox}><label>Check-out</label><input type="date" value={checkOut} onChange={e=>setCheckOut(e.target.value)}/></div>
                <button className={styles.modifySearchBtn} onClick={handleModifySearch}>Search</button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className={styles.layout}>
        <aside className={styles.filters}>
          <div className={styles.filterHeader}><span>Filters</span><button className={styles.resetBtn} onClick={resetFilters}>Reset all</button></div>
          <div className={styles.filterSection}>
            <div className={styles.filterTitle}>Price/Night: <strong>up to ₹{maxPrice.toLocaleString()}</strong></div>
            <input type="range" min={800} max={12000} value={maxPrice} className={styles.rangeSlider} onChange={e=>setMaxPrice(+e.target.value)}/>
            <div className={styles.rangeLabels}><span>₹800</span><span>₹12,000</span></div>
          </div>
          <div className={styles.filterSection}>
            <div className={styles.filterTitle}>Property Type</div>
            {[['Hotel','🏨 Hotel'],['Resort','🌟 Resort'],['Homestay','🏡 Homestay (Local)'],['Cottage','🌲 Cottage / Camp']].map(([v,l])=>(
              <label key={v} className={styles.checkLabel}>
                <input type="checkbox" checked={types.includes(v)} onChange={()=>toggleType(v)}/>
                <span className={styles.checkBox}/>{l}
              </label>
            ))}
          </div>
          <div className={styles.filterSection}>
            <div className={styles.filterTitle}>Amenities</div>
            {[['wifi','📶 Free WiFi'],['breakfast','🍳 Breakfast Included'],['mountain','🏔️ Mountain View'],['parking','🅿️ Free Parking'],['heater','🔥 Room Heater']].map(([v,l])=>(
              <label key={v} className={styles.checkLabel}><input type="checkbox"/><span className={styles.checkBox}/>{l}</label>
            ))}
          </div>
        </aside>

        <main className={styles.results}>
          <div className={styles.remoteBanner}>
            <span>🏡</span>
            <div><strong>Looking for authentic stays?</strong> WonderTravel lists verified homestays contributed directly by residents.</div>
            <a href="#">View local stays →</a>
          </div>

          {filtered.length===0 && (
            <div className={styles.noResults}><div>🏨</div><h3>No hotels match your filters</h3><p><button className={styles.resetLinkBtn} onClick={resetFilters}>Reset filters</button></p></div>
          )}

          {filtered.map((h,idx)=>(
            <div key={h.id} className={styles.hotelCard} style={{animationDelay:`${idx*0.06}s`}}>
              {h.badge&&<div className={`${styles.badge} ${h.badge==='Luxury Pick'?styles.badgePurple:h.badge==='Community Pick'?styles.badgeGreen:styles.badgeBlue}`}>{h.badge}</div>}
              <div className={styles.hcMain}>
                <div className={styles.hcImage} style={{backgroundImage:`linear-gradient(135deg,${h.bg}22,${h.bg}88), url(${HOTEL_IMAGES[h.type]})`}}>
                  {h.type==='Homestay'&&<div className={styles.localBadge}>🏡 Local Stay</div>}
                  {h.type==='Cottage'&&<div className={`${styles.localBadge} ${styles.cottageBadge}`}>🌲 Nature Stay</div>}
                </div>
                <div className={styles.hcInfo}>
                  <div className={styles.hcTop}>
                    <div>
                      <h3 className={styles.hcName}>{h.name}</h3>
                      <div className={styles.hcMeta}>
                        <span>{renderStars(h.stars)}</span>
                        <span className={styles.typeBadge}>{h.type}</span>
                        <span className={styles.hcLoc}>📍 {displayDest}</span>
                      </div>
                    </div>
                    <div className={styles.ratingBlock}>
                      <div className={styles.ratingNum}>{h.rating}</div>
                      <div className={styles.ratingLabel}>{h.rating>=4.7?'Exceptional':h.rating>=4.4?'Very Good':'Good'}</div>
                      <div className={styles.ratingReviews}>{h.reviews} reviews</div>
                    </div>
                  </div>
                  <p className={styles.hcDesc}>{h.desc}</p>
                  <div className={styles.amenities}>{h.amenities.map(a=><span key={a} className={styles.amenity} title={a}>{AMENITY_ICONS[a]}</span>)}</div>
                  <div className={styles.hcTags}>{h.tags.map(t=><span key={t} className={styles.hcTag}>{t}</span>)}</div>
                </div>
                <div className={styles.hcPriceCol}>
                  {h.origPrice&&<span className={styles.origPrice}>₹{h.origPrice.toLocaleString()}/night</span>}
                  <span className={styles.price}>₹{h.price.toLocaleString()}</span>
                  <span className={styles.perNight}>per night</span>
                  <span className={styles.totalPrice}>₹{(h.price*nights).toLocaleString()} total</span>
                  <button className={styles.btnBook} onClick={()=>{setSelected(h);setSelRoom(0)}}>View Rooms</button>
                  <span className={styles.freeCancellation}>✓ Free cancellation</span>
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
              <div className={styles.mhImg} style={{background:`linear-gradient(135deg,${selected.bg},${selected.bg}cc)`}}>{selected.emoji}</div>
              <div>
                <h2 className={styles.modalTitle}>{selected.name}</h2>
                <p className={styles.modalSub}>📍 {displayDest} · {nights} Nights · {displayDates}</p>
              </div>
            </div>
            <div className={styles.roomList}>
              {selected.rooms.map((r,i)=>(
                <div key={i} className={`${styles.roomItem} ${selRoom===i?styles.roomSelected:''}`} onClick={()=>setSelRoom(i)}>
                  <div><h4>{r.name}</h4><div className={styles.roomMeta}><span>👥 {guestsParam}</span><span>🍳 Breakfast available</span></div></div>
                  <div className={styles.roomPriceCol}>
                    <span className={styles.roomNight}>₹{r.price.toLocaleString()}/night</span>
                    <span className={styles.roomTotal}>₹{(r.price*nights).toLocaleString()} total</span>
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.modalFooter}>
              <div className={styles.modalTotal}>Total ({nights} nights): <strong>₹{(selected.rooms[selRoom].price*nights).toLocaleString()}</strong></div>
              <button className={styles.btnBookNow} onClick={handleBookHotel}>Continue to Booking →</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
