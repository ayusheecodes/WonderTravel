import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

export default function Footer() {
  const footerLinks = {
    'Company': [
      ['About Us', '/info/about-us'],
      ['Careers', '/info/careers'],
      ['Press', '/info/press'],
      ['Blog', '/info/blog'],
    ],
    'Support': [
      ['Help Center', '/info/help-center'],
      ['Safety Information', '/info/safety'],
      ['Cancellation Options', '/info/cancellations'],
    ],
    'Explore': [
      ['Hidden Gems', '/info/hidden-gems'],
      ['AI Planner', '/itinerary'],
      ['Local Stories', '/info/local-stories'],
      ['Offers', '/offers'],
    ],
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.footerGrid}>
        <div className={styles.footerBrand}>
          <div className={styles.footerLogo}>WonderTravel</div>
          <p>Discover India's hidden beauty beyond the usual maps. Curated by locals, powered by AI.</p>
        </div>
        
        {Object.entries(footerLinks).map(([title, links]) => (
          <div key={title} className={styles.footerCol}>
            <h4>{title}</h4>
            {links.map(([label, path]) => (
              <Link key={label} to={path}>{label}</Link>
            ))}
          </div>
        ))}
      </div>
      <div className={styles.footerBottom}>
        <p>© 2026 WonderTravel Inc. All rights reserved.</p>
        <div className={styles.footerLinks}>
          <Link to="/info/privacy">Privacy Policy</Link>
          <Link to="/info/terms">Terms of Service</Link>
          <Link to="/info/sitemap">Sitemap</Link>
        </div>
      </div>
    </footer>
  )
}
