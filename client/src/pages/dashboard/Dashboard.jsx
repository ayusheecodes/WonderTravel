import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../../api/axios'
import { useAuth } from '../../context/AuthContext'
import styles from './Dashboard.module.css'

const formatCurrency = (value) => `Rs ${Number(value || 0).toLocaleString('en-IN')}`

const formatDate = (value) => {
  if (!value) return 'Flexible'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Flexible'
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

const getBookingTitle = (booking) => {
  if (booking.bookingType === 'flight') return booking.flightDetails?.airline || 'Flight booking'
  if (booking.bookingType === 'train') return booking.trainDetails?.trainName || 'Train booking'
  if (booking.bookingType === 'hotel') return booking.hotelDetails?.hotelName || 'Hotel stay'
  if (booking.bookingType === 'cab') return booking.cabDetails?.vehicle || 'Cab booking'
  return 'Booking'
}

const getBookingRoute = (booking) => {
  if (booking.bookingType === 'flight') return `${booking.flightDetails?.from || 'Origin'} to ${booking.flightDetails?.to || 'Destination'}`
  if (booking.bookingType === 'train') return `${booking.trainDetails?.from || 'Origin'} to ${booking.trainDetails?.to || 'Destination'}`
  if (booking.bookingType === 'hotel') return booking.hotelDetails?.location || 'Stay details'
  if (booking.bookingType === 'cab') return `${booking.cabDetails?.pickup || 'Pickup'} to ${booking.cabDetails?.drop || 'Drop'}`
  return 'Travel details'
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, updateUser } = useAuth()

  const [profile, setProfile] = useState(null)
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [photoMessage, setPhotoMessage] = useState('')

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true)
        setError('')

        const [profileResponse, bookingsResponse] = await Promise.allSettled([
          API.get('/auth/profile'),
          API.get('/bookings'),
        ])

        if (profileResponse.status === 'fulfilled') {
          setProfile(profileResponse.value.data)
        } else {
          setProfile(user || null)
        }

        if (bookingsResponse.status === 'fulfilled') {
          setBookings(bookingsResponse.value.data)
        } else {
          setBookings([])
        }

        if (profileResponse.status === 'rejected' && bookingsResponse.status === 'rejected') {
          setError('Could not load dashboard data right now.')
        }
      } catch {
        setError('Could not load dashboard data right now.')
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [user])

  const stats = useMemo(() => {
    const today = new Date()
    const activeBookings = bookings.filter((booking) => booking.status !== 'cancelled')
    const upcomingTrips = activeBookings.filter((booking) => {
      if (!booking.travelDate) return false
      return new Date(booking.travelDate) >= today
    })

    return {
      upcomingTrips: upcomingTrips.length,
      totalBookings: activeBookings.length,
      totalSpent: activeBookings.reduce((sum, booking) => sum + Number(booking.totalAmount || 0), 0),
      pending: bookings.filter((booking) => booking.status === 'pending').length,
    }
  }, [bookings])

  const firstName = profile?.name?.split(' ')[0] || user?.name?.split(' ')[0] || 'Traveler'
  const roleLabel = profile?.role || user?.role || 'traveler'
  const profilePhoto = profile?.avatarUrl || user?.avatarUrl || localStorage.getItem('wondertravel_profile_photo') || ''
  const initials = (profile?.name || user?.name || 'WT')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')

  const handlePhotoUpload = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setPhotoMessage('Please choose an image file.')
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      setPhotoMessage('Please choose an image under 2 MB.')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const photoUrl = reader.result
      localStorage.setItem('wondertravel_profile_photo', photoUrl)
      updateUser?.({ avatarUrl: photoUrl })
      setProfile((current) => ({ ...(current || user || {}), avatarUrl: photoUrl }))
      setPhotoMessage('Profile photo updated.')
    }
    reader.readAsDataURL(file)
  }

  const removePhoto = () => {
    localStorage.removeItem('wondertravel_profile_photo')
    updateUser?.({ avatarUrl: '' })
    setProfile((current) => ({ ...(current || user || {}), avatarUrl: '' }))
    setPhotoMessage('Profile photo removed.')
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <section className={styles.heroCard}>
          <div className={styles.heroTop}>
            <div>
              <span className={styles.badge}>WonderTravel Dashboard</span>
              <h1 className={styles.title}>Welcome back, {firstName}.</h1>
              <p className={styles.subtitle}>
                Track your bookings, watch upcoming trips, and keep your travel profile ready for the next plan.
              </p>
            </div>
            <div className={styles.heroActions}>
              <button className={styles.primaryBtn} onClick={() => navigate('/itinerary')}>New AI Plan</button>
              <button className={styles.secondaryBtn} onClick={() => navigate('/explore')}>Explore Places</button>
            </div>
          </div>

          <div className={styles.grid}>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Upcoming Trips</span>
              <strong className={styles.statValue}>{stats.upcomingTrips}</strong>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Active Bookings</span>
              <strong className={styles.statValue}>{stats.totalBookings}</strong>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Total Spend</span>
              <strong className={styles.statValue}>{formatCurrency(stats.totalSpent)}</strong>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Pending</span>
              <strong className={styles.statValue}>{stats.pending}</strong>
            </div>
          </div>
        </section>

        {loading && (
          <section className={styles.panel}>
            <h2 className={styles.panelTitle}>Loading dashboard...</h2>
            <p className={styles.panelText}>We&apos;re pulling in your profile and booking details.</p>
          </section>
        )}

        {!loading && error && (
          <section className={styles.panel}>
            <h2 className={styles.panelTitle}>Dashboard unavailable</h2>
            <p className={styles.panelText}>{error}</p>
          </section>
        )}

        {!loading && !error && (
          <div className={styles.contentGrid}>
            <section className={styles.panel}>
              <div className={styles.panelHeader}>
                <h2 className={styles.panelTitle}>Profile Snapshot</h2>
                <span className={styles.rolePill}>{roleLabel}</span>
              </div>

              <div className={styles.photoPanel}>
                <div className={styles.photoPreview}>
                  {profilePhoto ? <img src={profilePhoto} alt="" /> : <span>{initials || 'WT'}</span>}
                </div>
                <div className={styles.photoContent}>
                  <strong>Profile photo</strong>
                  <span>This appears in the navbar and your dashboard.</span>
                  <div className={styles.photoActions}>
                    <label className={styles.photoUpload}>
                      Upload Photo
                      <input type="file" accept="image/*" onChange={handlePhotoUpload} />
                    </label>
                    {profilePhoto && <button className={styles.photoRemove} onClick={removePhoto}>Remove</button>}
                  </div>
                  {photoMessage && <p className={styles.photoMessage}>{photoMessage}</p>}
                </div>
              </div>

              <div className={styles.profileGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Name</span>
                  <span className={styles.infoValue}>{profile?.name || user?.name || 'Not available'}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Email</span>
                  <span className={styles.infoValue}>{profile?.email || user?.email || 'Not available'}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Phone</span>
                  <span className={styles.infoValue}>{profile?.phone || user?.phone || 'Not added'}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Member Since</span>
                  <span className={styles.infoValue}>{formatDate(profile?.createdAt)}</span>
                </div>
                {roleLabel === 'contributor' && (
                  <>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Region</span>
                      <span className={styles.infoValue}>{profile?.region || 'Not added'}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Expertise</span>
                      <span className={styles.infoValue}>{profile?.expertise || 'Not added'}</span>
                    </div>
                  </>
                )}
              </div>
            </section>

            <section className={styles.panel}>
              <div className={styles.panelHeader}>
                <h2 className={styles.panelTitle}>Recent Bookings</h2>
                <span className={styles.panelHint}>{bookings.length} total</span>
              </div>

              {bookings.length === 0 ? (
                <div className={styles.emptyState}>
                  <p className={styles.panelText}>No bookings yet. Start with an itinerary or explore destinations.</p>
                  <div className={styles.inlineActions}>
                    <button className={styles.primaryBtn} onClick={() => navigate('/itinerary')}>Plan a Trip</button>
                    <button className={styles.secondaryBtn} onClick={() => navigate('/flights')}>Book Travel</button>
                  </div>
                </div>
              ) : (
                <div className={styles.bookingList}>
                  {bookings.slice(0, 4).map((booking) => (
                    <div key={booking._id} className={styles.bookingCard}>
                      <div className={styles.bookingTop}>
                        <div>
                          <h3 className={styles.bookingTitle}>{getBookingTitle(booking)}</h3>
                          <p className={styles.bookingRoute}>{getBookingRoute(booking)}</p>
                        </div>
                        <span className={`${styles.statusPill} ${styles[`status${booking.status?.charAt(0).toUpperCase()}${booking.status?.slice(1)}`]}`}>
                          {booking.status}
                        </span>
                      </div>
                      <div className={styles.bookingMeta}>
                        <span>{booking.bookingType}</span>
                        <span>{formatDate(booking.travelDate || booking.hotelDetails?.checkIn)}</span>
                        <span>{formatCurrency(booking.totalAmount)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className={styles.panel}>
              <div className={styles.panelHeader}>
                <h2 className={styles.panelTitle}>Next Actions</h2>
              </div>
              <div className={styles.actionList}>
                <button className={styles.actionCard} onClick={() => navigate('/itinerary')}>
                  <strong>Create a fresh itinerary</strong>
                  <span>Use the AI planner to shape your next trip day by day.</span>
                </button>
                <button className={styles.actionCard} onClick={() => navigate('/explore')}>
                  <strong>Browse offbeat destinations</strong>
                  <span>Find hidden gems and contributor-approved routes.</span>
                </button>
                <button className={styles.actionCard} onClick={() => navigate('/hotels')}>
                  <strong>Check stays and transport</strong>
                  <span>Compare hotels, cabs, flights, and trains from one place.</span>
                </button>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  )
}
