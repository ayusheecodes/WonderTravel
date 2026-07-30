const dns = require('dns').promises
const mongoose = require('mongoose')

const buildMongoHelpMessage = (mongoUri, error) => {
  if (!mongoUri) {
    return 'MONGO_URI is missing in server/.env'
  }

  if (mongoUri.startsWith('mongodb+srv://')) {
    const host = mongoUri.replace('mongodb+srv://', '').split('@').pop().split('/')[0]

    if (
      error.code === 'ENOTFOUND' ||
      error.code === 'ECONNREFUSED' ||
      error.message.includes('querySrv')
    ) {
      return `Could not resolve the MongoDB Atlas SRV record for ${host}. Check your internet/DNS, Atlas network access list, or use a non-SRV mongodb:// URI from Atlas.`
    }
  }

  return error.message
}

let dbMode = 'disconnected'
let mongoAvailable = false

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI

  if (!mongoUri) {
    dbMode = 'fallback'
    mongoAvailable = false
    console.warn('MongoDB not configured; running in fallback mode with in-memory data.')
    return { connected: false, mode: 'fallback' }
  }

  try {
    if (mongoUri.startsWith('mongodb+srv://')) {
      const host = mongoUri.replace('mongodb+srv://', '').split('@').pop().split('/')[0]
      await dns.resolveSrv(`_mongodb._tcp.${host}`)
    }

    const conn = await mongoose.connect(mongoUri)
    dbMode = 'connected'
    mongoAvailable = true
    console.log(`MongoDB Connected: ${conn.connection.host}`)
    return { connected: true, mode: 'mongo' }
  } catch (error) {
    dbMode = 'fallback'
    mongoAvailable = false
    console.warn(`MongoDB connection failed; falling back to in-memory storage: ${buildMongoHelpMessage(mongoUri, error)}`)
    return { connected: false, mode: 'fallback' }
  }
}

const isMongoAvailable = () => mongoAvailable
const getDbMode = () => dbMode

module.exports = {
  connectDB,
  buildMongoHelpMessage,
  isMongoAvailable,
  getDbMode,
}
