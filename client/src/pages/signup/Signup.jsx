import API from '../../api/axios'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import styles from './Signup.module.css'

export default function Signup() {
  const [step, setStep] = useState(1)
  const [role, setRole] = useState(null)
  const [fname, setFname] = useState('')
  const [lname, setLname] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [region, setRegion] = useState('')
  const [expertise, setExpertise] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [timer, setTimer] = useState(0)
  const [errors, setErrors] = useState({})
  const [toast, setToast] = useState('')
  const [sendingOtp, setSendingOtp] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [otpSessionId, setOtpSessionId] = useState('')
  const [devOtp, setDevOtp] = useState('')

  const { login } = useAuth()
  const navigate = useNavigate()

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const startTimer = () => {
    setTimer(30)
    const iv = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(iv)
          return 0
        }
        return t - 1
      })
    }, 1000)
  }

  const pwStrength = (pw) => {
    let s = 0
    if (pw.length >= 8) s++
    if (/[A-Z]/.test(pw)) s++
    if (/[0-9]/.test(pw)) s++
    if (/[^A-Za-z0-9]/.test(pw)) s++
    return s
  }

  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong']
  const strengthColor = ['', '#cf2525', '#b87820', '#b8a020', '#2e7d5e']

  const goStep2 = () => {
    if (role) setStep(2)
  }

  const validateDetails = () => {
    const errs = {}
    if (!fname) errs.fname = 'Required'
    if (!lname) errs.lname = 'Required'
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Enter a valid email'
    if (!phone || phone.length !== 10) errs.phone = 'Enter valid 10-digit number'
    if (!password || password.length < 8) errs.password = 'Minimum 8 characters'
    return errs
  }

  const requestOtp = async (e) => {
    e.preventDefault()

    const errs = validateDetails()

    if (!agreed) {
      showToast('Please accept Terms of Service')
      return
    }

    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }

    setSendingOtp(true)

    try {
      const { data } = await API.post('/auth/send-otp', {
        name: `${fname} ${lname}`,
        email,
        phone,
        password,
      })

      setOtpSessionId(data.otpSessionId)
      setDevOtp(data.devOtp || '')
      setOtp(['', '', '', '', '', ''])
      setStep(3)
      startTimer()
      showToast(data.deliveryMode === 'console' ? 'OTP generated in dev mode. Check the hint below.' : 'OTP sent to your phone.')
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to send OTP. Try again.'
      showToast(msg)
    } finally {
      setSendingOtp(false)
    }
  }

  const resendOtp = async () => {
    if (timer > 0 || sendingOtp) return

    setSendingOtp(true)

    try {
      const { data } = await API.post('/auth/send-otp', {
        name: `${fname} ${lname}`,
        email,
        phone,
        password,
      })

      setOtpSessionId(data.otpSessionId)
      setDevOtp(data.devOtp || '')
      setOtp(['', '', '', '', '', ''])
      startTimer()
      showToast(data.deliveryMode === 'console' ? 'New OTP generated in dev mode.' : 'OTP resent to your phone.')
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to resend OTP.'
      showToast(msg)
    } finally {
      setSendingOtp(false)
    }
  }

  const handleOtpChange = (val, idx) => {
    const next = [...otp]
    next[idx] = val.replace(/\D/g, '').slice(-1)
    setOtp(next)
    if (val && idx < 5) document.getElementById(`sotp-${idx + 1}`)?.focus()
  }

  const verifySignup = async () => {
    const joinedOtp = otp.join('')

    if (joinedOtp.length !== 6) {
      showToast('Enter the 6-digit OTP')
      return
    }

    setVerifying(true)

    try {
      const { data } = await API.post('/auth/register', {
        name: `${fname} ${lname}`,
        email,
        phone,
        password,
        role: role || 'traveler',
        region,
        expertise,
        otp: joinedOtp,
        otpSessionId,
      })

      login(data)
      showToast('Welcome to WonderTravel!')
      setTimeout(() => navigate('/'), 1200)
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Try again.'
      showToast(msg)
      setVerifying(false)
    }
  }

  const strength = pwStrength(password)

  return (
    <div className={styles.page}>
      <div className={styles.bgBlobs}>
        <div className={styles.blob1} />
        <div className={styles.blob2} />
        <div className={styles.blob3} />
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
        <Link to="/login" className={styles.navLink}>
          Already have an account? <strong>Log In</strong>
        </Link>
      </nav>

      <main className={styles.main}>
        <div className={styles.card}>
          <div className={styles.stepsBar}>
            {[1, 2, 3].map((s, i) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', flex: i < 2 ? 1 : 'none' }}>
                <div className={`${styles.stepItem} ${step >= s ? styles.stepActive : ''} ${step > s ? styles.stepDone : ''}`}>
                  <div className={styles.stepDot}>{step > s ? 'OK' : s}</div>
                  <span>{['Role', 'Details', 'Verify'][i]}</span>
                </div>
                {i < 2 && <div className={`${styles.stepLine} ${step > s ? styles.stepLineDone : ''}`} />}
              </div>
            ))}
          </div>

          {step === 1 && (
            <div className={styles.stepContent}>
              <div className={styles.cardHeader}>
                <span className={styles.cardIcon}>W</span>
                <h1 className={styles.cardTitle}>Join WonderTravel</h1>
                <p className={styles.cardSub}>How would you like to use the platform?</p>
              </div>
              <div className={styles.roleCards}>
                {[
                  { id: 'traveler', icon: 'T', title: 'Traveler', perks: ['All booking types', 'AI itinerary generator', 'Save and review places', 'Access local tips'] },
                  { id: 'contributor', icon: 'C', title: 'Local Contributor', perks: ['Add offbeat destinations', 'Write travel stories', 'Register local drivers', 'Contributor profile'] },
                ].map((r) => (
                  <div
                    key={r.id}
                    className={`${styles.roleCard} ${role === r.id ? styles.roleSelected : ''}`}
                    onClick={() => setRole(r.id)}
                  >
                    <span className={styles.roleIcon}>{r.icon}</span>
                    <h3>{r.title}</h3>
                    <ul className={styles.rolePerks}>
                      {r.perks.map((p) => <li key={p}>OK {p}</li>)}
                    </ul>
                    {role === r.id && <div className={styles.roleCheck}>Selected</div>}
                  </div>
                ))}
              </div>
              <p className={styles.roleNote}>Choose the role that matches how you want to use the app.</p>
              <button className={styles.btnAuth} disabled={!role} onClick={goStep2}>
                Continue
              </button>
            </div>
          )}

          {step === 2 && (
            <div className={styles.stepContent}>
              <div className={styles.cardHeader}>
                <h1 className={styles.cardTitle}>
                  {role === 'traveler' ? 'Set up your account' : 'Set up your profile'}
                </h1>
                <p className={styles.cardSub}>
                  {role === 'traveler'
                    ? 'Start booking and discovering hidden India'
                    : 'Help travelers find the places you know'}
                </p>
              </div>

              <form className={styles.form} onSubmit={requestOtp}>
                <div className={styles.formRow}>
                  <div className={`${styles.formGroup} ${errors.fname ? styles.hasError : ''}`}>
                    <label>First Name</label>
                    <div className={styles.inputWrap}>
                      <span className={styles.inputIcon}>U</span>
                      <input placeholder="Priya" value={fname} onChange={(e) => { setFname(e.target.value); setErrors((p) => ({ ...p, fname: '' })) }} />
                    </div>
                    {errors.fname && <span className={styles.fieldError}>{errors.fname}</span>}
                  </div>
                  <div className={`${styles.formGroup} ${errors.lname ? styles.hasError : ''}`}>
                    <label>Last Name</label>
                    <div className={styles.inputWrap}>
                      <span className={styles.inputIcon}>U</span>
                      <input placeholder="Sharma" value={lname} onChange={(e) => { setLname(e.target.value); setErrors((p) => ({ ...p, lname: '' })) }} />
                    </div>
                    {errors.lname && <span className={styles.fieldError}>{errors.lname}</span>}
                  </div>
                </div>

                <div className={`${styles.formGroup} ${errors.email ? styles.hasError : ''}`}>
                  <label>Email Address</label>
                  <div className={styles.inputWrap}>
                    <span className={styles.inputIcon}>@</span>
                    <input type="email" placeholder="you@example.com" value={email} onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: '' })) }} />
                  </div>
                  {errors.email && <span className={styles.fieldError}>{errors.email}</span>}
                </div>

                <div className={`${styles.formGroup} ${errors.phone ? styles.hasError : ''}`}>
                  <label>Mobile Number</label>
                  <div className={styles.inputWrap}>
                    <span className={`${styles.inputIcon} ${styles.countryCode}`}>+91</span>
                    <input type="tel" placeholder="9876543210" maxLength={10} value={phone} onChange={(e) => { setPhone(e.target.value.replace(/\D/g, '')); setErrors((p) => ({ ...p, phone: '' })) }} />
                  </div>
                  {errors.phone && <span className={styles.fieldError}>{errors.phone}</span>}
                </div>

                <div className={`${styles.formGroup} ${errors.password ? styles.hasError : ''}`}>
                  <label>Password</label>
                  <div className={styles.inputWrap}>
                    <span className={styles.inputIcon}>*</span>
                    <input type={showPw ? 'text' : 'password'} placeholder="Min 8 characters" value={password} onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: '' })) }} />
                    <button type="button" className={styles.togglePw} onClick={() => setShowPw((p) => !p)}>{showPw ? 'Hide' : 'Show'}</button>
                  </div>
                  {password && (
                    <div className={styles.pwStrength}>
                      <div className={styles.psBars}>
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className={styles.psBar} style={{ background: i <= strength ? strengthColor[strength] : 'var(--border)' }} />
                        ))}
                      </div>
                      <span style={{ fontSize: 11.5, fontWeight: 700, color: strengthColor[strength] }}>
                        {strengthLabel[strength]}
                      </span>
                    </div>
                  )}
                  {errors.password && <span className={styles.fieldError}>{errors.password}</span>}
                </div>

                {role === 'contributor' && (
                  <div className={styles.contributorFields}>
                    <div className={styles.cfDivider}>Contributor Profile</div>
                    <div className={styles.formGroup}>
                      <label>Your Region / State</label>
                      <div className={styles.inputWrap}>
                        <span className={styles.inputIcon}>R</span>
                        <input placeholder="e.g. Arunachal Pradesh" value={region} onChange={(e) => setRegion(e.target.value)} />
                      </div>
                    </div>
                    <div className={styles.formGroup}>
                      <label>Area of Expertise</label>
                      <div className={styles.inputWrap}>
                        <span className={styles.inputIcon}>E</span>
                        <select value={expertise} onChange={(e) => setExpertise(e.target.value)} style={{ flex: 1, padding: '12px 12px 12px 0', fontSize: 14, fontWeight: 600, color: 'var(--text-dark)', background: 'transparent', border: 'none', outline: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                          <option value="">Select your specialty</option>
                          <option>Hidden Viewpoints and Scenic Spots</option>
                          <option>Local Transport and Cab Drivers</option>
                          <option>Travel Stories and Blogs</option>
                          <option>Trekking and Adventure Routes</option>
                          <option>Local Food and Stays</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                <label className={styles.checkRow}>
                  <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
                  <span className={styles.checkBox} />
                  I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
                </label>

                <div className={styles.stepBtns}>
                  <button type="button" className={styles.btnBack} onClick={() => setStep(1)} disabled={sendingOtp}>Back</button>
                  <button type="submit" className={`${styles.btnAuth} ${styles.btnFlex}`} disabled={sendingOtp}>
                    {sendingOtp ? 'Sending OTP...' : 'Send OTP'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {step === 3 && (
            <div className={styles.stepContent}>
              <div className={styles.cardHeader}>
                <span className={styles.cardIcon}>OTP</span>
                <h1 className={styles.cardTitle}>Verify your number</h1>
                <p className={styles.cardSub}>We sent a 6-digit OTP to <strong>+91 {phone}</strong></p>
              </div>

              <div className={styles.otpBoxes}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`sotp-${i}`}
                    type="text"
                    className={styles.otpBox}
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(e.target.value, i)}
                  />
                ))}
              </div>

              {devOtp && (
                <p className={styles.roleNote}>Dev OTP: <strong>{devOtp}</strong></p>
              )}

              <div className={styles.otpTimer}>
                {timer > 0 ? (
                  <span>Resend in <strong>{timer}s</strong></span>
                ) : (
                  <button className={styles.resendBtn} onClick={resendOtp} disabled={sendingOtp}>
                    {sendingOtp ? 'Sending...' : 'Resend OTP'}
                  </button>
                )}
              </div>

              <button className={styles.btnAuth} disabled={verifying} onClick={verifySignup}>
                {verifying ? 'Verifying...' : 'Verify and Complete'}
              </button>

              <div className={styles.stepBtns} style={{ marginTop: 12 }}>
                <button className={styles.btnBack} onClick={() => setStep(2)} disabled={verifying}>Change number</button>
              </div>
            </div>
          )}
        </div>
      </main>

      {toast && <div className={styles.toast}>{toast}</div>}
    </div>
  )
}
