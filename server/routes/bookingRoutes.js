const express = require('express')
const router  = express.Router()
const { getMyBookings, createBooking, cancelBooking, getBookingById } = require('../controllers/bookingController')
const { protect } = require('../middleware/authMiddleware')

router.get ('/',    protect, getMyBookings)
router.post('/',    protect, createBooking)
router.get ('/:id', protect, getBookingById)
router.put ('/:id', protect, cancelBooking)

module.exports = router