import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import styles from './Navbar.module.css'

const BOOKING_TABS = [
  { path: '/flights', label: 'Flights', icon: 'Air' },
  { path: '/trains',  label: 'Trains', icon: 'Rail' },
  { path: '/hotels',  label: 'Hotels', icon: 'Stay' },
  { path: '/cabs',    label: 'Cabs', icon: 'Cab' },
]

const RESULTS_PAGES = ['/flights', '/trains', '/hotels', '/cabs']

const MAIN_LINKS = [
  { path: '/explore', label: 'Explore' },
  { path: '/', label: 'Stories' },
  { path: '/itinerary', label: 'AI Planner' },
  { path: '/offers', label: 'Offers' },
]

const getInitials = (name = 'Traveler') => {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || 'WT'
}

const getAvatarUrl = (user) => {
  if (!user) return ''
  return user.avatarUrl || user.photoUrl || user.profilePhoto || localStorage.getItem('wondertravel_profile_photo') || ''
}

export default function Navbar() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const isResultsPage = RESULTS_PAGES.includes(location.pathname)
  const firstName = user?.name?.split(' ')[0] || 'Traveler'
  const avatarUrl = getAvatarUrl(user)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className={styles.navbar}>
      <div className={styles.inner}>

        {/* LOGO */}
        <Link to="/" className={styles.logo}>
          <div className={styles.logoIcon}>
            <svg viewBox="0 0 48 48" aria-hidden="true">
              <path d="M24 4C15.2 4 8 11 8 19.7c0 11.8 16 24.3 16 24.3s16-12.5 16-24.3C40 11 32.8 4 24 4Z" />
              <path d="M17 28.5 21.8 15 31 24.2 17 28.5Z" />
              <circle cx="24" cy="20" r="3.2" />
            </svg>
          </div>
          <span className={styles.logoText}>
            <span className={styles.logoName}>WonderTravel</span>
            <span className={styles.logoTag}>Hidden India, planned better</span>
          </span>
        </Link>

        {/* BOOKING TABS */}
        {isResultsPage && (
          <nav className={styles.tabs}>
            {BOOKING_TABS.map(t => (
              <Link
                key={t.path}
                to={t.path}
                className={`${styles.tab} ${
                  location.pathname === t.path ? styles.activeTab : ''
                }`}
              >
                <span className={styles.tabIcon}>{t.icon}</span>
                {t.label}
              </Link>
            ))}
          </nav>
        )}

        {/* MAIN NAV */}
        {!isResultsPage && (
          <nav className={styles.navLinks}>
            {MAIN_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={location.pathname === link.path ? styles.active : ''}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}

        {/* RIGHT SIDE */}
        <div className={styles.right}>
          {user ? (
            <>
              <Link to="/itinerary" className={styles.planBtn}>Plan Trip</Link>
              <Link to="/dashboard" className={styles.user}>
                <span className={styles.userAvatar}>
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="" />
                  ) : (
                    <span>{getInitials(user.name)}</span>
                  )}
                </span>
                <span>{firstName}</span>
              </Link>
              <button onClick={handleLogout} className={styles.logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={styles.login}>Login</Link>
              <Link to="/itinerary" className={styles.planBtn}>Plan Trip</Link>
              <Link to="/signup" className={styles.signup}>Sign Up</Link>
            </>
          )}
        </div>

      </div>
    </header>
  )
}
