const express    = require('express')
const router     = express.Router()
const { sendSignupOtp, register, login, getProfile, updateProfile, sendLoginOtp, verifyLoginOtp } = require('../controllers/authController')
const { protect } = require('../middleware/authMiddleware')

router.post('/send-otp', sendSignupOtp)
router.post('/register', register)
router.post('/login',    login)
router.post('/send-login-otp', sendLoginOtp)
router.post('/verify-login-otp', verifyLoginOtp)
router.get ('/profile',  protect, getProfile)
router.put ('/profile',  protect, updateProfile)

module.exports = router
