import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import useCartStore from '../../store/useCartStore'
import styles from './Trains.module.css'

const ALL_TRAINS = [
  { id:1, name:'Rajdhani Express',  number:'12951', type:'Rajdhani', dep:'16:55', arr:'08:35', duration:'15h 40m', durationH:15.67, timeSlot:'afternoon',
    classes:{ SL:{fare:765,avail:42,status:'Available'},'3A':{fare:1995,avail:18,status:'Available'},'2A':{fare:2870,avail:6,status:'Available'},'1A':{fare:4830,avail:2,status:'Available'} }, badge:'Fastest' },
  { id:2, name:'Mumbai Rajdhani',   number:'12953', type:'Rajdhani', dep:'17:25', arr:'09:25', duration:'16h 00m', durationH:16.0,  timeSlot:'afternoon',
    classes:{ SL:{fare:745,avail:0,status:'WL 12'},'3A':{fare:1965,avail:4,status:'Available'},'2A':{fare:2810,avail:0,status:'RAC 4'},'1A':{fare:4770,avail:1,status:'Available'} }, badge:'' },
  { id:3, name:'Duronto Express',   number:'12263', type:'Duronto',  dep:'23:00', arr:'16:55', duration:'17h 55m', durationH:17.92, timeSlot:'night',
    classes:{ SL:{fare:690,avail:88,status:'Available'},'3A':{fare:1820,avail:22,status:'Available'},'2A':{fare:2600,avail:8,status:'Available'},'1A':{fare:4450,avail:3,status:'Available'} }, badge:'' },
  { id:4, name:'Punjab Mail',       number:'12137', type:'Mail',     dep:'07:05', arr:'05:10', duration:'22h 05m', durationH:22.08, timeSlot:'morning',
    classes:{ SL:{fare:495,avail:210,status:'Available'},'3A':{fare:1310,avail:56,status:'Available'},'2A':{fare:1920,avail:14,status:'Available'},'1A':{fare:3240,avail:5,status:'Available'} }, badge:'Budget Pick' },
  { id:5, name:'Paschim Express',   number:'12925', type:'Mail',     dep:'20:40', arr:'22:35', duration:'25h 55m', durationH:25.92, timeSlot:'night',
    classes:{ SL:{fare:455,avail:320,status:'Available'},'3A':{fare:1195,avail:74,status:'Available'},'2A':{fare:1750,avail:22,status:'Available'},'1A':{fare:2980,avail:7,status:'Available'} }, badge:'' },
  { id:6, name:'Duronto Express',   number:'12289', type:'Duronto',  dep:'06:10', arr:'23:40', duration:'17h 30m', durationH:17.5,  timeSlot:'early',
    classes:{ SL:{fare:710,avail:0,status:'WL 28'},'3A':{fare:1850,avail:12,status:'Available'},'2A':{fare:2640,avail:3,status:'Available'},'1A':{fare:4510,avail:0,status:'WL 4'} }, badge:'' },
  { id:7, name:'Golden Temple Mail',number:'12903', type:'Mail',     dep:'09:30', arr:'09:05', duration:'23h 35m', durationH:23.58, timeSlot:'morning',
    classes:{ SL:{fare:480,avail:145,status:'Available'},'3A':{fare:1280,avail:38,status:'Available'},'2A':{fare:1890,avail:0,status:'WL 6'},'1A':{fare:3180,avail:2,status:'Available'} }, badge:'' },
  { id:8, name:'August Kranti Raj', number:'12953', type:'Mail',     dep:'17:40', arr:'22:10', duration:'28h 30m', durationH:28.5,  timeSlot:'afternoon',
    classes:{ SL:{fare:430,avail:180,status:'Available'},'3A':{fare:1150,avail:42,status:'Available'},'2A':{fare:1690,avail:11,status:'Available'},'1A':{fare:2870,avail:4,status:'Available'} }, badge:'' },
]

const TYPE_STYLE = {
  Rajdhani:{ bg:'#fff0e8',color:'#cf5020' },
  Shatabdi:{ bg:'#e8f3fc',color:'#1a7fcf' },
  Duronto: { bg:'#f0e8fc',color:'#7c25cf' },
  Mail:    { bg:'#eef2f8',color:'#7a8fa8' },
}

export default function Trains() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { addItem } = useCartStore()

  const fromParam  = searchParams.get('from')  || ''
  const toParam    = searchParams.get('to')    || ''
  const dateParam  = searchParams.get('date')  || ''
  const classParam = searchParams.get('class') || 'All Classes'

  const [from,  setFrom]  = useState(fromParam)
  const [to,    setTo]    = useState(toParam)
  const [date,  setDate]  = useState(dateParam)
  const [showModify, setShowModify] = useState(false)

  const [sortKey,     setSortKey]     = useState('depart')
  const [typeFilter,  setTypeFilter]  = useState(['Rajdhani','Shatabdi','Duronto','Mail'])
  const [maxDur,      setMaxDur]      = useState(36)
  const [activeSlots, setActiveSlots] = useState([])
  const [selClasses,  setSelClasses]  = useState({})
  const [expanded,    setExpanded]    = useState(null)
  const [selected,    setSelected]    = useState(null)
  const [selClass,    setSelClass]    = useState('3A')

  const filtered = ALL_TRAINS
    .filter(t => typeFilter.includes(t.type))
    .filter(t => t.durationH <= maxDur)
    .filter(t => activeSlots.length===0 || activeSlots.includes(t.timeSlot))
    .sort((a,b) => {
      if (sortKey==='depart')   return a.dep.localeCompare(b.dep)
      if (sortKey==='duration') return a.durationH - b.durationH
      if (sortKey==='arrival')  return a.arr.localeCompare(b.arr)
      return 0
    })

  const toggleType = t => setTypeFilter(p => p.includes(t)?p.filter(x=>x!==t):[...p,t])
  const toggleSlot = s => setActiveSlots(p => p.includes(s)?p.filter(x=>x!==s):[...p,s])
  const getClass   = id => selClasses[id] || '3A'
  const setClass   = (id,cls) => setSelClasses(p=>({...p,[id]:cls}))
  const statusColor= s => s==='Available'?styles.availOk:s.startsWith('WL')?styles.availWl:styles.availRac
  const resetFilters=()=>{ setTypeFilter(['Rajdhani','Shatabdi','Duronto','Mail']); setMaxDur(36); setActiveSlots([]) }

  const handleModifySearch = () => {
    navigate(`/trains?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${encodeURIComponent(date)}`)
    setShowModify(false)
  }

  const displayFrom = fromParam || 'New Delhi'
  const displayTo   = toParam   || 'Mumbai CST'
  const displayDate = dateParam ? new Date(dateParam).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}) : 'Select Date'

  const handleBookTrain = () => {
    if (!selected) return
    const fare = selected.classes[selClass]?.fare || 0

    addItem({
      id: `TRN-${selected.number}-${selClass}`,
      type: 'train',
      title: `${selected.name} #${selected.number}`,
      subtitle: `${displayFrom} to ${displayTo} - ${selClass} - ${displayDate}`,
      price: fare,
      details: {
        trainNumber: selected.number,
        from: displayFrom,
        to: displayTo,
        class: selClass,
        dep: selected.dep,
        arr: selected.arr,
        date: displayDate,
      },
    })
    navigate('/checkout')
  }

  return (
    <div className={styles.page}>
      {/* RESULTS HEADER */}
      <div className={styles.resultsHeader}>
        <div className={styles.rhInner}>
          <div>
            <h1 className={styles.rhTitle}>{displayFrom} → {displayTo}</h1>
            <span className={styles.rhMeta}>{displayDate} · {classParam}</span>
          </div>
          <button className={styles.modifyBtn} onClick={()=>setShowModify(p=>!p)}>✎ Modify Search</button>
          <div className={styles.rhCount}><span className={styles.rhNum}>{filtered.length}</span> trains found</div>
          <div className={styles.sortBar}>
            <span className={styles.sortLabel}>Sort:</span>
            {[['depart','Departure'],['duration','Duration'],['arrival','Arrival']].map(([k,l])=>(
              <button key={k} className={`${styles.sortBtn} ${sortKey===k?styles.sortBtnActive:''}`} onClick={()=>setSortKey(k)}>{l}</button>
            ))}
          </div>
        </div>

        {showModify && (
          <div className={styles.modifyPanel}>
            <div className={styles.modifyInner}>
              <div className={styles.modifyFields}>
                <div className={styles.mfBox}><label>From Station</label><input value={from} onChange={e=>setFrom(e.target.value)} placeholder="City or Station"/></div>
                <div className={styles.mfBox}><label>To Station</label><input value={to} onChange={e=>setTo(e.target.value)} placeholder="City or Station"/></div>
                <div className={styles.mfBox}><label>Date</label><input type="date" value={date} onChange={e=>setDate(e.target.value)}/></div>
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
            <div className={styles.filterTitle}>Departure Time</div>
            <div className={styles.timeSlots}>
              {[['🌅','early','Before 6 AM'],['☀️','morning','6AM–12PM'],['🌤️','afternoon','12–6PM'],['🌙','night','After 6PM']].map(([icon,val,label])=>(
                <div key={val} className={`${styles.timeSlot} ${activeSlots.includes(val)?styles.timeSlotActive:''}`} onClick={()=>toggleSlot(val)}>
                  <span>{icon}</span><span className={styles.tsLabel}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.filterSection}>
            <div className={styles.filterTitle}>Train Type</div>
            {['Rajdhani','Shatabdi','Duronto','Mail'].map(t=>(
              <label key={t} className={styles.checkLabel}>
                <input type="checkbox" checked={typeFilter.includes(t)} onChange={()=>toggleType(t)}/>
                <span className={styles.checkBox}/>{t} Express
              </label>
            ))}
          </div>

          <div className={styles.filterSection}>
            <div className={styles.filterTitle}>Max Duration: <strong>{maxDur}h</strong></div>
            <input type="range" min={12} max={36} value={maxDur} className={styles.rangeSlider} onChange={e=>setMaxDur(+e.target.value)}/>
            <div className={styles.rangeLabels}><span>12h</span><span>36h</span></div>
          </div>

          <div className={styles.filterSection}>
            <div className={styles.filterTitle}>Travel Class</div>
            {[['SL','Sleeper'],['3A','Third AC'],['2A','Second AC'],['1A','First AC']].map(([c,l])=>(
              <label key={c} className={styles.checkLabel}>
                <input type="checkbox" defaultChecked/><span className={styles.checkBox}/>{c} — {l}
              </label>
            ))}
          </div>
        </aside>

        {/* RESULTS */}
        <main className={styles.results}>
          <div className={styles.remoteBanner}>
            <span>🏔️</span>
            <div><strong>Reaching remote regions?</strong> WonderTravel lists trains to small junction stations not found on other platforms.</div>
            <a href="#">Remote routes →</a>
          </div>

          {filtered.length===0 && (
            <div className={styles.noResults}>
              <div>🚆</div><h3>No trains match your filters</h3>
              <p><button className={styles.resetLinkBtn} onClick={resetFilters}>Reset filters</button></p>
            </div>
          )}

          {filtered.map((t,idx)=>{
            const cls=getClass(t.id)
            return (
              <div key={t.id} className={styles.trainCard} style={{animationDelay:`${idx*0.06}s`}}>
                {t.badge&&<div className={`${styles.badge} ${t.badge==='Fastest'?styles.badgeBlue:styles.badgeAmber}`}>{t.badge}</div>}

                <div className={styles.tcMain}>
                  <div className={styles.tcInfo}>
                    <div className={styles.tcName}>{t.name}</div>
                    <div className={styles.tcMeta}>#{t.number} · <span className={styles.tcType} style={TYPE_STYLE[t.type]}>{t.type}</span></div>
                    <div className={styles.tcRoute}>
                      <div className={styles.tcTimeBlock}>
                        <span className={styles.tcTime}>{t.dep}</span>
                        <span className={styles.tcStation}>{displayFrom.split(' ')[0].slice(0,4).toUpperCase()}</span>
                      </div>
                      <div className={styles.tcMid}>
                        <span className={styles.tcDur}>{t.duration}</span>
                        <div className={styles.tcTrack}>
                          <div className={`${styles.trackDot} ${styles.trackDep}`}/>
                          <div className={styles.trackLine}/>
                          <span className={styles.trackLoco}>🚂</span>
                          <div className={`${styles.trackDot} ${styles.trackArr}`}/>
                        </div>
                        <span className={styles.tcDirect}>Direct Route</span>
                      </div>
                      <div className={styles.tcTimeBlock}>
                        <span className={styles.tcTime}>{t.arr}<sup className={styles.nextDay}>+1</sup></span>
                        <span className={styles.tcStation}>{displayTo.split(' ')[0].slice(0,4).toUpperCase()}</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.tcClasses}>
                    {Object.entries(t.classes).map(([c,data])=>{
                      const avail=data.status==='Available'
                      const isRac=data.status.startsWith('RAC')
                      return (
                        <div key={c}
                          className={`${styles.classBox} ${cls===c?styles.classSelected:''} ${!avail&&!isRac?styles.classUnavail:''}`}
                          onClick={()=>setClass(t.id,c)}>
                          <span className={styles.cbClass}>{c}</span>
                          <span className={styles.cbFare}>₹{data.fare.toLocaleString()}</span>
                          <span className={`${styles.cbAvail} ${statusColor(data.status)}`}>
                            {data.status==='Available'?`${data.avail} seats`:data.status}
                          </span>
                        </div>
                      )
                    })}
                  </div>

                  <div className={styles.tcBookCol}>
                    <button className={styles.btnBook} onClick={()=>{setSelected(t);setSelClass(cls)}}>Book Now</button>
                    <span className={styles.tcRefund}>✓ IRCTC Policy</span>
                  </div>
                </div>

                <div className={styles.tcExpandRow}>
                  <button className={styles.detailsBtn} onClick={()=>setExpanded(expanded===t.id?null:t.id)}>
                    Train Details {expanded===t.id?'▴':'▾'}
                  </button>
                  <div className={styles.runningDays}>
                    <span className={styles.rdLabel}>Runs on:</span>
                    {['M','T','W','T','F','S','S'].map((d,i)=>(
                      <span key={i} className={`${styles.rdDay} ${[0,1,3,5].includes(i)?styles.rdActive:''}`}>{d}</span>
                    ))}
                  </div>
                </div>

                {expanded===t.id&&(
                  <div className={styles.tcDetails}>
                    <div className={styles.tdpStop}><div className={`${styles.tdpDot} ${styles.tdpDep}`}/><div><strong>{t.dep}</strong> — {displayFrom} · Platform 1</div></div>
                    <div className={styles.tdpStop}><div className={`${styles.tdpDot} ${styles.tdpArr}`}/><div><strong>{t.arr}</strong> — {displayTo} · Platform 7</div></div>
                    <div className={styles.tdpExtras}>
                      {[['🚂 Type',t.type],['📏 Distance','1,384 km'],['⚡ Zone','Western Rly'],['🍽️ Pantry','Available']].map(([k,v])=>(
                        <div key={k} className={styles.tdpExtra}><span>{k}</span><span>{v}</span></div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </main>
      </div>

      {/* MODAL */}
      {selected&&(
        <div className={styles.modalOverlay} onClick={e=>e.target===e.currentTarget&&setSelected(null)}>
          <div className={styles.modal}>
            <button className={styles.modalClose} onClick={()=>setSelected(null)}>✕</button>
            <div className={styles.modalHeader}>
              <span className={styles.modalIcon}>🚆</span>
              <div>
                <h2 className={styles.modalTitle}>{selected.name} #{selected.number}</h2>
                <p className={styles.modalSub}>{displayFrom} → {displayTo} · {selected.dep} – {selected.arr}</p>
              </div>
            </div>
            <div className={styles.modalClassGrid}>
              {Object.entries(selected.classes).map(([c,data])=>{
                const avail=data.status==='Available'
                return (
                  <div key={c}
                    className={`${styles.mcgItem} ${selClass===c?styles.mcgSelected:''} ${!avail?styles.mcgUnavail:''}`}
                    onClick={()=>avail&&setSelClass(c)}>
                    <span className={styles.mcgCls}>{c}</span>
                    <span className={styles.mcgName}>{{SL:'Sleeper','3A':'Third AC','2A':'Second AC','1A':'First AC'}[c]}</span>
                    <span className={styles.mcgFare}>₹{data.fare.toLocaleString()}</span>
                    <span className={`${styles.mcgAvail} ${avail?styles.availOk:styles.availWl}`}>
                      {data.status==='Available'?`${data.avail} seats`:data.status}
                    </span>
                  </div>
                )
              })}
            </div>
            <div className={styles.modalFooter}>
              <div className={styles.modalTotal}>Total: <strong>₹{selected.classes[selClass]?.fare.toLocaleString()}</strong> <span>/person</span></div>
              <button className={styles.btnBookNow} onClick={handleBookTrain}>Continue to Booking →</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
