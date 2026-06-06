const User = require('../models/User')
const jwt  = require('jsonwebtoken')
const { createOtpSession, verifyOtpSession } = require('../services/otpStore')
const { sendOtpSms } = require('../services/smsService')

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  })
}

// @route  POST /api/auth/send-otp
const sendSignupOtp = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: 'Please fill in all required fields before requesting OTP' })
    }

    const userExists = await User.findOne({ $or: [{ email }, { phone }] })
    if (userExists) {
      return res.status(400).json({ message: 'An account already exists with this email or phone number' })
    }

    const { sessionId, otp } = createOtpSession(phone)
    const delivery = await sendOtpSms({ phone, otp })

    res.status(200).json({
      message: 'OTP sent successfully',
      otpSessionId: sessionId,
      deliveryMode: delivery.mode,
      ...(process.env.NODE_ENV !== 'production' ? { devOtp: otp } : {}),
    })
  } catch (error) {
    console.error('Send OTP error:', error.message)
    res.status(500).json({ message: 'Failed to send OTP' })
  }
}

// @route  POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, phone, password, role, region, expertise, otp, otpSessionId } = req.body

    // Validate required fields
    if (!name || !email || !phone || !password || !otp || !otpSessionId) {
      return res.status(400).json({ message: 'Please fill in all required fields' })
    }

    const otpCheck = verifyOtpSession({ sessionId: otpSessionId, phone, otp })
    if (!otpCheck.valid) {
      return res.status(400).json({ message: otpCheck.message })
    }

    // Check if user exists
    const userExists = await User.findOne({ $or: [{ email }, { phone }] })
    if (userExists) {
      return res.status(400).json({ message: 'An account already exists with this email or phone number' })
    }

    // Create user
    const user = await User.create({
      name,
      email,
      phone,
      password,
      role:      role      || 'traveler',
      region:    region    || '',
      expertise: expertise || '',
    })

    res.status(201).json({
      _id:   user._id,
      name:  user.name,
      email: user.email,
      phone: user.phone,
      role:  user.role,
      token: generateToken(user._id),
    })
  } catch (error) {
    console.error('Register error:', error.message)
    res.status(500).json({ message: 'Server error during registration' })
  }
}

// @route  POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter email and password' })
    }

    // Find user and include password
    const user = await User.findOne({ email }).select('+password')
    if (!user) {
      return res.status(401).json({ message: 'No account found with this email' })
    }

    // Check password
    const isMatch = await user.matchPassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password' })
    }

    res.json({
      _id:   user._id,
      name:  user.name,
      email: user.email,
      phone: user.phone,
      role:  user.role,
      token: generateToken(user._id),
    })
  } catch (error) {
    console.error('Login error:', error.message)
    res.status(500).json({ message: 'Server error during login' })
  }
}

// @route  GET /api/auth/profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json({
      _id:       user._id,
      name:      user.name,
      email:     user.email,
      phone:     user.phone,
      role:      user.role,
      region:    user.region,
      expertise: user.expertise,
      createdAt: user.createdAt,
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

// @route  PUT /api/auth/profile
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    if (!user) return res.status(404).json({ message: 'User not found' })

    // Bug #10 fix: use 'key in req.body' for optional fields so callers can
    // intentionally clear them by passing "". Required fields (name, phone) still
    // only update when a truthy value is provided, protecting schema constraints.
    if (req.body.name)           user.name      = req.body.name
    if (req.body.phone)          user.phone     = req.body.phone
    if ('region'    in req.body) user.region    = req.body.region    ?? user.region
    if ('expertise' in req.body) user.expertise = req.body.expertise ?? user.expertise

    if (req.body.password) {
      user.password = req.body.password
    }

    const updated = await user.save()
    // BUG-08 fix: include region and expertise in the response so AuthContext
    // stays fully in sync after a profile update — previously these were saved
    // to the DB but never returned, leaving the client with stale values.
    res.json({
      _id:       updated._id,
      name:      updated.name,
      email:     updated.email,
      phone:     updated.phone,
      role:      updated.role,
      region:    updated.region,
      expertise: updated.expertise,
      token:     generateToken(updated._id),
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

// @route  POST /api/auth/send-login-otp
const sendLoginOtp = async (req, res) => {
  try {
    const { phone } = req.body

    if (!phone) {
      return res.status(400).json({ message: 'Please provide a phone number' })
    }

    const user = await User.findOne({ phone })
    if (!user) {
      return res.status(404).json({ message: 'No account found with this phone number' })
    }

    const { sessionId, otp } = createOtpSession(phone)
    const delivery = await sendOtpSms({ phone, otp })

    res.status(200).json({
      message: 'OTP sent successfully',
      otpSessionId: sessionId,
      deliveryMode: delivery.mode,
      ...(process.env.NODE_ENV !== 'production' ? { devOtp: otp } : {}),
    })
  } catch (error) {
    console.error('Send Login OTP error:', error.message)
    res.status(500).json({ message: 'Failed to send OTP' })
  }
}

// @route  POST /api/auth/verify-login-otp
const verifyLoginOtp = async (req, res) => {
  try {
    const { phone, otp, otpSessionId } = req.body

    if (!phone || !otp || !otpSessionId) {
      return res.status(400).json({ message: 'Please provide phone, OTP, and session ID' })
    }

    const otpCheck = verifyOtpSession({ sessionId: otpSessionId, phone, otp })
    if (!otpCheck.valid) {
      return res.status(400).json({ message: otpCheck.message })
    }

    const user = await User.findOne({ phone })
    if (!user) {
      return res.status(404).json({ message: 'No account found with this phone number' })
    }

    res.json({
      _id:   user._id,
      name:  user.name,
      email: user.email,
      phone: user.phone,
      role:  user.role,
      token: generateToken(user._id),
    })
  } catch (error) {
    console.error('Verify Login OTP error:', error.message)
    res.status(500).json({ message: 'Server error during OTP verification' })
  }
}

module.exports = { sendSignupOtp, register, login, getProfile, updateProfile, sendLoginOtp, verifyLoginOtp }
