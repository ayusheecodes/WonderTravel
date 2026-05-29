const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  bookingType: {
    type: String,
    enum: ['flight', 'train', 'hotel', 'cab'],
    required: true,
  },
  status: {
    type: String,
    enum: ['confirmed', 'pending', 'cancelled'],
    default: 'confirmed',
  },
  totalAmount: { type: Number, required: true },
  travelDate:  { type: Date },
  passengers:  { type: Number, default: 1 },

  // Flight details
  flightDetails: {
    airline:  String,
    code:     String,
    from:     String,
    to:       String,
    dep:      String,
    arr:      String,
    class:    String,
    fare:     String,
  },

  // Train details
  trainDetails: {
    trainName:   String,
    trainNumber: String,
    from:        String,
    to:          String,
    class:       String,
    dep:         String,
    arr:         String,
  },

  // Hotel details
  hotelDetails: {
    hotelName: String,
    location:  String,
    roomType:  String,
    checkIn:   Date,
    checkOut:  Date,
    nights:    Number,
    guests:    String,
  },

  // Cab details
  cabDetails: {
    driverName:  String,
    vehicle:     String,
    pickup:      String,
    drop:        String,
    isLocalDriver: { type: Boolean, default: false },
  },

}, { timestamps: true })

module.exports = mongoose.model('Booking', bookingSchema)