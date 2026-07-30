const { connectDB } = require('../config/db')

describe('database connection fallback', () => {
  afterEach(() => {
    delete process.env.MONGO_URI
  })

  it('returns a fallback state when no Mongo connection URI is configured', async () => {
    const result = await connectDB()

    expect(result).toEqual({ connected: false, mode: 'fallback' })
  })
})
