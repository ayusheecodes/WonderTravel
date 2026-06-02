import API from '../../api/axios'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import styles from './Login.module.css'

export default function Login() {
  const [method,     setMethod]     = useState('email')
  const [email,      setEmail]      = useState('')
  const [password,   setPassword]   = useState('')
  const [showPw,     setShowPw]     = useState(false)
  const [phone,      setPhone]      = useState('')
  const [otpSent,    setOtpSent]    = useState(false)
  const [otp,        setOtp]        = useState(['','','','','',''])
  const [timer,      setTimer]      = useState(0)
  const [loading,    setLoading]    = useState(false)
  const [errors,     setErrors]     = useState({})
  const [toast,      setToast]      = useState('')
  const [otpSessionId, setOtpSessionId] = useState('')
  const [devOtp,     setDevOtp]     = useState('')
  const [sendingOtp, setSendingOtp] = useState(false)
  const [verifying,  setVerifying]  = useState(false)

  const { login } = useAuth()
  const navigate  = useNavigate()

  const showToast = msg => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const startTimer = () => {
    setTimer(30)
    const iv = setInterval(() => {
      setTimer(t => {
        if (t <= 1) { clearInterval(iv); return 0 }
        return t - 1
      })
    }, 1000)
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    const errs = {}
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Enter a valid email address'
    }
    // Bug #9 fix: min length must match the server schema (minlength: 8) and Signup validation
    if (!password || password.length < 8) {
      errs.password = 'Password must be at least 8 characters'
    }
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    try {
      const { data } = await API.post('/auth/login', { email, password })
      login(data)
      showToast('Welcome back! Redirecting…')
      setTimeout(() => navigate('/'), 1200)
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Try again.'
      setErrors({ password: msg })
    } finally {
      setLoading(false)
    }
  }

  const handleSendOtp = async () => {
    if (!phone || phone.length !== 10) { setErrors({ phone: 'Enter valid 10-digit number' }); return }
    setErrors({})
    setSendingOtp(true)
    try {
      const { data } = await API.post('/auth/send-login-otp', { phone })
      setOtpSessionId(data.otpSessionId)
      setDevOtp(data.devOtp || '')
      setOtp(['','','','','',''])
      setOtpSent(true)
      startTimer()
      showToast(data.deliveryMode === 'console' ? 'OTP generated in dev mode. Check hint below.' : 'OTP sent!')
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to send OTP.'
      setErrors({ phone: msg })
    } finally {
      setSendingOtp(false)
    }
  }

  const handleOtpChange = (val, idx) => {
    const newOtp = [...otp]
    newOtp[idx] = val.replace(/\D/g, '').slice(-1)
    setOtp(newOtp)
    if (val && idx < 5) document.getElementById(`otp-${idx + 1}`)?.focus()
    if (newOtp.every(d => d)) {
      verifyLogin(newOtp.join(''))
    }
  }

  const verifyLogin = async (joinedOtp) => {
    setVerifying(true)
    try {
      const { data } = await API.post('/auth/verify-login-otp', {
        phone,
        otp: joinedOtp,
        otpSessionId,
      })
      login(data)
      showToast('OTP verified! Welcome 🎉')
      setTimeout(() => navigate('/'), 1200)
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Try again.'
      showToast(msg)
    } finally {
      setVerifying(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.bgBlobs}>
        <div className={styles.blob1} /><div className={styles.blob2} /><div className={styles.blob3} />
      </div>

      <nav className={styles.authNav}>
        <Link to="/" className={styles.authLogo}>
          <span className={styles.logoMark}>
            <svg viewBox="0 0 48 48" aria-hidden="true">
              <path d="M24 4C15.2 4 8 11 8 19.7c0 11.8 16 24.3 16 24.3s16-12.5 16-24.3C40 11 32.8 4 24 4Z" />
              <path d="M17 28.5 21.8 15 31 24.2 17 28.5Z" />
              <circle cx="24" cy="20" r="3.2" />
            </svg>
          </span>
          <div>
            <span className={styles.logoName}>WonderTravel</span>
            <span className={styles.logoTag}>Beyond the Map</span>
          </div>
        </Link>
        <Link to="/signup" className={styles.navLink}>
          Don't have an account? <strong>Sign Up →</strong>
        </Link>
      </nav>

      <main className={styles.main}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardIcon}>✈️</span>
            <h1 className={styles.cardTitle}>Welcome back</h1>
            <p className={styles.cardSub}>Log in to continue your journey</p>
          </div>

          {/* METHOD TABS */}
          <div className={styles.methodTabs}>
            <button className={`${styles.methodTab} ${method === 'email' ? styles.methodTabActive : ''}`} onClick={() => setMethod('email')}>
              📧 Email
            </button>
            <button className={`${styles.methodTab} ${method === 'phone' ? styles.methodTabActive : ''}`} onClick={() => setMethod('phone')}>
              📱 Phone / OTP
            </button>
          </div>

          {/* EMAIL FORM */}
          {method === 'email' && (
            <form className={styles.form} onSubmit={handleLogin}>
              <div className={`${styles.formGroup} ${errors.email ? styles.hasError : ''}`}>
                <label>Email Address</label>
                <div className={styles.inputWrap}>
                  <span className={styles.inputIcon}>✉️</span>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })) }}
                  />
                </div>
                {errors.email && <span className={styles.fieldError}>{errors.email}</span>}
              </div>

              <div className={`${styles.formGroup} ${errors.password ? styles.hasError : ''}`}>
                <label>
                  Password
                  <a href="#" className={styles.forgotLink}>Forgot password?</a>
                </label>
                <div className={styles.inputWrap}>
                  <span className={styles.inputIcon}>🔒</span>
                  <input
                    type={showPw ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: '' })) }}
                  />
                  <button type="button" className={styles.togglePw} onClick={() => setShowPw(p => !p)}>
                    {showPw ? '🙈' : '👁'}
                  </button>
                </div>
                {errors.password && <span className={styles.fieldError}>{errors.password}</span>}
              </div>

              <button type="submit" className={styles.btnAuth} disabled={loading}>
                {loading ? 'Logging in…' : 'Log In'}
              </button>
            </form>
          )}

          {/* PHONE FORM */}
          {method === 'phone' && (
            <div className={styles.form}>
              <div className={`${styles.formGroup} ${errors.phone ? styles.hasError : ''}`}>
                <label>Mobile Number</label>
                <div className={styles.inputWrap}>
                  <span className={`${styles.inputIcon} ${styles.countryCode}`}>🇮🇳 +91</span>
                  <input
                    type="tel"
                    placeholder="9876543210"
                    maxLength={10}
                    value={phone}
                    disabled={otpSent}
                    onChange={e => { setPhone(e.target.value.replace(/\D/g, '')); setErrors({}) }}
                  />
                </div>
                {errors.phone && <span className={styles.fieldError}>{errors.phone}</span>}
              </div>

              {otpSent && (
                <div className={styles.otpSection}>
                  <p className={styles.otpMsg}>OTP sent to <strong>+91 {phone}</strong></p>
                  <div className={styles.otpBoxes}>
                    {otp.map((d, i) => (
                      <input
                        key={i}
                        id={`otp-${i}`}
                        type="text"
                        className={styles.otpBox}
                        maxLength={1}
                        value={d}
                        onChange={e => handleOtpChange(e.target.value, i)}
                      />
                    ))}
                  </div>
                  {devOtp && (
                    <p className={styles.roleNote} style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
                      Dev OTP: <strong>{devOtp}</strong>
                    </p>
                  )}
                  <div className={styles.otpTimer}>
                    {timer > 0
                      ? <span>Resend in <strong>{timer}s</strong></span>
                      : <button className={styles.resendBtn} disabled={sendingOtp} onClick={() => { handleSendOtp() }}>{sendingOtp ? 'Sending...' : 'Resend OTP'}</button>
                    }
                  </div>
                  {verifying && <p style={{ fontSize: '14px', color: '#666', textAlign: 'center', marginTop: '10px' }}>Verifying...</p>}
                </div>
              )}

              {!otpSent && (
                <button className={styles.btnAuth} onClick={handleSendOtp} disabled={sendingOtp}>
                  {sendingOtp ? 'Sending...' : 'Send OTP'}
                </button>
              )}
            </div>
          )}

          <div className={styles.orDivider}><span>or continue with</span></div>

          <div className={styles.socialBtns}>
            <button className={styles.socialBtn} onClick={() => showToast('Google login coming soon!')}>
              <span className={styles.socialIcon}>G</span> Google
            </button>
            <button className={styles.socialBtn} onClick={() => showToast('Facebook login coming soon!')}>
              <span className={`${styles.socialIcon} ${styles.fb}`}>f</span> Facebook
            </button>
          </div>

          <p className={styles.footerNote}>
            By logging in you agree to our <a href="#">Terms</a> and <a href="#">Privacy Policy</a>
          </p>
        </div>

        {/* SIDE QUOTE */}
        <div className={styles.sideQuote}>
          <div className={styles.quoteCard}>
            <p className={styles.quoteText}>
              I found a valley that no other platform even knew existed. WonderTravel changed how I explore India.
            </p>
            <div className={styles.quoteAuthor}>
              <div className={styles.qaAvatar}>PK</div>
              <div>
                <strong>Priya K.</strong>
                <span>Solo traveller · Bengaluru</span>
              </div>
            </div>
          </div>
          <div className={styles.destCounter}>
            <span className={styles.dcNum}>2,400+</span>
            <span className={styles.dcLabel}>hidden destinations waiting for you</span>
          </div>
        </div>
      </main>

      {toast && <div className={styles.toast}>{toast}</div>}
    </div>
  )
}
