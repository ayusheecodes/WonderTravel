const crypto = require('crypto')

const OTP_EXPIRY_MS = 5 * 60 * 1000
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

module.exports = {
  OTP_EXPIRY_MS,
  createOtpSession,
  verifyOtpSession,
}
