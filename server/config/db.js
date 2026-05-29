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

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI

  if (!mongoUri) {
    throw new Error('MONGO_URI is missing in server/.env')
  }

  if (mongoUri.startsWith('mongodb+srv://')) {
    const host = mongoUri.replace('mongodb+srv://', '').split('@').pop().split('/')[0]
    await dns.resolveSrv(`_mongodb._tcp.${host}`)
  }

  const conn = await mongoose.connect(mongoUri)
  console.log(`MongoDB Connected: ${conn.connection.host}`)
}

module.exports = {
  connectDB,
  buildMongoHelpMessage,
}
