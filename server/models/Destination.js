const mongoose = require('mongoose')

const destinationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  state: {
    type: String,
    required: true,
    trim: true,
  },
  region: {
    type: String,
    required: true,
    trim: true,
  },
  tag: {
    type: String,
    default: 'Hidden Gem',
    trim: true,
  },
  emoji: {
    type: String,
    default: 'Place',
    trim: true,
  },
  image: {
    type: String,
    default: '',
    trim: true,
  },
  rating: {
    type: Number,
    default: 4.5,
    min: 0,
    max: 5,
  },
  reviews: {
    type: Number,
    default: 0,
    min: 0,
  },
  difficulty: {
    type: String,
    default: 'Easy',
    trim: true,
  },
  bestSeason: {
    type: String,
    default: 'Any Season',
    trim: true,
  },
  duration: {
    type: String,
    default: '2-3 days',
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  tips: {
    type: [String],
    default: [],
  },
  activities: {
    type: [String],
    default: [],
  },
  budgetMin: {
    type: Number,
    default: 3000,
    min: 0,
  },
  budgetMax: {
    type: Number,
    default: 8000,
    min: 0,
  },
  contributorName: {
    type: String,
    default: '',
    trim: true,
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true })

module.exports = mongoose.model('Destination', destinationSchema)
