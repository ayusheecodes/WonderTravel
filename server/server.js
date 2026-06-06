const path = require('path')
const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const { connectDB, buildMongoHelpMessage } = require('./config/db')
const mongoose = require('mongoose')

dotenv.config({ path: path.join(__dirname, '.env') })

const app = express()

const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      return callback(null, true)
    }
    return callback(new Error(`CORS blocked origin: ${origin}`))
  },
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.json({
    message: 'WonderTravel API is running',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      bookings: '/api/bookings',
      destinations: '/api/destinations',
    },
  })
})

// Health endpoint used by containers and load balancers
app.get('/health', (req, res) => {
  const dbState = mongoose?.connection?.readyState === 1 ? 'connected' : 'disconnected'
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    db: dbState,
    timestamp: Date.now(),
  })
})

app.use('/api/auth', require('./routes/authRoutes'))
app.use('/api/bookings', require('./routes/bookingRoutes'))
app.use('/api/destinations', require('./routes/destinationRoutes'))
app.use('/api/itinerary', require('./routes/itineraryRoutes'))

app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` })
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  // BUG-13 fix: if headers were already sent (e.g. a partial streaming response),
  // calling res.json() again would crash with ERR_HTTP_HEADERS_SENT.
  // Delegate to Express's default error handler in that case.
  if (res.headersSent) return next(err)
  res.status(500).json({ message: 'Something went wrong on the server' })
})

const PORT = process.env.PORT || 5000

const startServer = async () => {
  try {
    await connectDB()
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error(`MongoDB Error: ${buildMongoHelpMessage(process.env.MONGO_URI, error)}`)
    process.exit(1)
  }
}

startServer()
