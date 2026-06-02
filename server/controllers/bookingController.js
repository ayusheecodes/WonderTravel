const Booking = require('../models/Booking')

// GET /api/bookings — get all bookings for logged-in user
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .sort({ createdAt: -1 })
    res.json(bookings)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// POST /api/bookings — create new booking
const createBooking = async (req, res) => {
  try {
    // Bug #4 fix: whitelist allowed fields instead of spreading req.body
    // to prevent mass-assignment (e.g. spoofing user, status, etc.)
    const {
      bookingType,
      totalAmount,
      travelDate,
      passengers,
      flightDetails,
      trainDetails,
      hotelDetails,
      cabDetails,
    } = req.body

    const booking = await Booking.create({
      user: req.user._id,
      bookingType,
      totalAmount,
      travelDate,
      passengers,
      flightDetails,
      trainDetails,
      hotelDetails,
      cabDetails,
      // status is intentionally excluded — always defaults to 'confirmed' via schema
    })
    res.status(201).json(booking)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// DELETE /api/bookings/:id — cancel booking
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' })
    }
    // Bug #2 fix: 403 Forbidden (authenticated but not the owner), not 401 Unauthenticated
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' })
    }
    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' })
    }
    booking.status = 'cancelled'
    await booking.save()
    res.json({ message: 'Booking cancelled successfully', booking })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// GET /api/bookings/:id — get one booking
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
    if (!booking) return res.status(404).json({ message: 'Booking not found' })
    // Bug #2 fix: 403 Forbidden (authenticated but not the owner), not 401 Unauthenticated
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' })
    }
    res.json(booking)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { getMyBookings, createBooking, cancelBooking, getBookingById }