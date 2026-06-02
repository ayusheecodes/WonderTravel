const crypto = require('crypto')

const OTP_EXPIRY_MS = 5 * 60 * 1000

// Bug #11 note: This store is in-process memory only.
// OTP sessions are lost on server restart and will not work correctly
// across multiple processes or containers (e.g. clustered Node or Docker replicas).
// For production at scale, replace this Map with a Redis-backed store using
// the same createOtpSession / verifyOtpSession interface.
const otpSessions = new Map()

const generateOtp = () => crypto.randomInt(100000, 1000000).toString()

const createOtpSession = (phone) => {
  const otp = generateOtp()
  const sessionId = crypto.randomUUID()
  const expiresAt = Date.now() + OTP_EXPIRY_MS

  otpSessions.set(sessionId, {
    phone,
    otp,
    expiresAt,
  })

  return {
    sessionId,
    otp,
    expiresAt,
  }
}

const verifyOtpSession = ({ sessionId, phone, otp }) => {
  const record = otpSessions.get(sessionId)

  if (!record) {
    return { valid: false, message: 'OTP session not found. Please request a new OTP.' }
  }

  if (record.expiresAt < Date.now()) {
    otpSessions.delete(sessionId)
    return { valid: false, message: 'OTP expired. Please request a new OTP.' }
  }

  if (record.phone !== phone) {
    return { valid: false, message: 'OTP was requested for a different phone number.' }
  }

  if (record.otp !== otp) {
    return { valid: false, message: 'Invalid OTP. Please try again.' }
  }

  otpSessions.delete(sessionId)
  return { valid: true }
}

// Bug #11 fix: Periodic cleanup sweeps expired sessions every 10 minutes so the
// Map does not grow indefinitely in long-running processes.
const CLEANUP_INTERVAL_MS = 10 * 60 * 1000
const cleanupExpiredSessions = () => {
  const now = Date.now()
  for (const [sessionId, record] of otpSessions) {
    if (record.expiresAt < now) {
      otpSessions.delete(sessionId)
    }
  }
}
setInterval(cleanupExpiredSessions, CLEANUP_INTERVAL_MS).unref()

module.exports = {
  OTP_EXPIRY_MS,
  createOtpSession,
  verifyOtpSession,
}
