import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import styles from './Offers.module.css'

const OFFERS = [
  {
    id: 1,
    title: 'Flat 20% OFF on Domestic Flights',
    desc: 'Book your domestic flights with WonderTravel and get a flat 20% discount up to Rs 2,000.',
    code: 'WONDER20',
    type: 'Flights',
    color: '#e6f4ee',
    textColor: '#2e7d5e',
    validity: 'Valid till 30th Nov',
  },
  {
    id: 2,
    title: 'Monsoon Getaways - Up to 40% OFF',
    desc: 'Experience the magic of monsoons in Kerala, Goa, and Coorg with premium hotel stays.',
    code: 'MONSOON40',
    type: 'Hotels',
    color: '#e8f3fc',
    textColor: '#1a7fcf',
    validity: 'Valid till 15th Aug',
  },
  {
    id: 3,
    title: 'Free Cab Upgrades',
    desc: 'Book an outstation trip and get a free upgrade to a premium SUV at no extra cost.',
    code: 'SUVUPGRADE',
    type: 'Cabs',
    color: '#fce8e8',
    textColor: '#cf2525',
    validity: 'Valid for weekend trips',
  },
  {
    id: 4,
    title: 'First Trip Bonus - Rs 1000 Cashback',
    desc: 'Planning your first trip with us? Book any package over Rs 10,000 and get instant cashback.',
    code: 'FIRST1000',
    type: 'Packages',
    color: '#f0e8fc',
    textColor: '#7c25cf',
    validity: 'For New Users Only',
  },
  {
    id: 5,
    title: 'Last Minute Deals - 30% OFF',
    desc: 'Spontaneous plans? Get up to 30% off on last-minute hotel bookings across India.',
    code: 'LASTMIN30',
    type: 'Hotels',
    color: '#e8f3fc',
    textColor: '#1a7fcf',
    validity: 'Bookings within 24hrs',
  },
  {
    id: 6,
    title: 'Train Convenience Fee Waiver',
    desc: 'Zero convenience fees on all IRCTC train bookings made through WonderTravel.',
    code: 'ZEROFEE',
    type: 'Trains',
    color: '#fff4e8',
    textColor: '#b87820',
    validity: 'Valid on UPI Payments',
  },
]

export default function Offers() {
  const navigate = useNavigate()
  const [copiedCode, setCopiedCode] = useState('')

  const copyCode = (code) => {
    navigator.clipboard?.writeText(code)
    setCopiedCode(code)
    window.setTimeout(() => setCopiedCode(''), 1800)
  }

  return (
    <div className={styles.page}>
      {/* HERO SECTION */}
      <section className={styles.hero}>
        <div className={styles.heroBlob1} />
        <div className={styles.heroBlob2} />
        <div className={styles.heroInner}>
          <span className={styles.eyebrow}>Exclusive Deals</span>
          <h1 className={styles.heroTitle}>Travel more, <em>spend less.</em></h1>
          <p className={styles.heroSub}>
            Discover handpicked offers on flights, premium stays, and curated holiday packages. 
            Unlock your next adventure with WonderTravel.
          </p>
        </div>
      </section>

      {/* OFFERS GRID */}
      <section className={styles.mainLayout}>
        <div className={styles.filtersHeader}>
          <h2>Latest Offers</h2>
          <span className={styles.offerCount}>{OFFERS.length} active deals</span>
        </div>

        <div className={styles.offersGrid}>
          {OFFERS.map(offer => (
            <div key={offer.id} className={styles.offerCard}>
              <div className={styles.ocTop}>
                <span 
                  className={styles.ocType} 
                  style={{ background: offer.color, color: offer.textColor }}
                >
                  {offer.type}
                </span>
                <span className={styles.ocValidity}>{offer.validity}</span>
              </div>
              <h3 className={styles.ocTitle}>{offer.title}</h3>
              <p className={styles.ocDesc}>{offer.desc}</p>
              
              <div className={styles.ocFooter}>
                <div className={styles.ocCodeWrap} onClick={() => copyCode(offer.code)}>
                  <span className={styles.ocCodeLabel}>Code</span>
                  <span className={styles.ocCode}>{offer.code}</span>
                  <span className={styles.ocCopyIcon}>{copiedCode === offer.code ? 'Copied' : 'Copy'}</span>
                </div>
                <button 
                  className={styles.ocBookBtn} 
                  onClick={() => navigate(offer.type === 'Flights' ? '/flights' : offer.type === 'Hotels' ? '/hotels' : offer.type === 'Trains' ? '/trains' : offer.type === 'Cabs' ? '/cabs' : '/explore')}
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
