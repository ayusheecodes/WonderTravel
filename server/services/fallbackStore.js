const bcrypt = require('bcryptjs')
const { fallbackDestinations } = require('./destinationCatalog')

const users = []
const bookings = []
const destinations = fallbackDestinations.map((destination) => ({
  ...destination,
  _id: `fallback-dest-${Math.random().toString(36).slice(2, 10)}`,
  description: destination.description || destination.desc,
  contributorName: destination.contributorName || 'WonderTravel Team',
  isVerified: destination.isVerified ?? true,
}))

const createId = (prefix) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`

const withUserMethods = (user) => ({
  ...user,
  async matchPassword(enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password)
  },
  async save() {
    const index = users.findIndex((entry) => entry._id === `${this._id}`)
    if (index === -1) return null
    users[index] = { ...users[index], ...this, _id: `${this._id}` }
    return withUserMethods(users[index])
  },
})

const findUserByEmail = async (email) => {
  const normalized = `${email || ''}`.trim().toLowerCase()
  const user = users.find((entry) => entry.email === normalized)
  return user ? withUserMethods({ ...user }) : null
}

const findUserByPhone = async (phone) => {
  const normalized = `${phone || ''}`.trim()
  const user = users.find((entry) => entry.phone === normalized)
  return user ? withUserMethods({ ...user }) : null
}

const findUserByEmailOrPhone = async ({ email, phone }) => {
  const normalizedEmail = `${email || ''}`.trim().toLowerCase()
  const normalizedPhone = `${phone || ''}`.trim()
  const user = users.find((entry) => entry.email === normalizedEmail || entry.phone === normalizedPhone)
  return user ? withUserMethods({ ...user }) : null
}

const findUserById = async (id) => {
  const user = users.find((entry) => entry._id === `${id}`)
  return user ? withUserMethods({ ...user }) : null
}

const createUser = async ({ name, email, phone, password, role, region, expertise }) => {
  const normalizedEmail = `${email || ''}`.trim().toLowerCase()
  const normalizedPhone = `${phone || ''}`.trim()
  const hashedPassword = await bcrypt.hash(password, 12)
  const user = {
    _id: createId('user'),
    name: `${name || ''}`.trim(),
    email: normalizedEmail,
    phone: normalizedPhone,
    password: hashedPassword,
    role: role || 'traveler',
    region: region || '',
    expertise: expertise || '',
    createdAt: new Date().toISOString(),
  }
  users.push(user)
  return withUserMethods({ ...user })
}

const updateUser = async (id, updates) => {
  const index = users.findIndex((entry) => entry._id === `${id}`)
  if (index === -1) return null

  const existing = users[index]
  const nextUser = {
    ...existing,
    ...updates,
    _id: `${id}`,
    password: updates.password ? await bcrypt.hash(updates.password, 12) : existing.password,
  }
  users[index] = nextUser
  return withUserMethods({ ...nextUser })
}

const listBookingsByUser = async (userId) => {
  return bookings.filter((booking) => booking.user === `${userId}`).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

const createBooking = async (bookingData) => {
  const booking = {
    _id: createId('booking'),
    ...bookingData,
    status: bookingData.status || 'confirmed',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  bookings.push(booking)
  return booking
}

const cancelBookingById = async (id) => {
  const index = bookings.findIndex((booking) => booking._id === `${id}`)
  if (index === -1) return null
  const updated = { ...bookings[index], status: 'cancelled', updatedAt: new Date().toISOString() }
  bookings[index] = updated
  return updated
}

const getBookingById = async (id) => {
  return bookings.find((booking) => booking._id === `${id}`) || null
}

const getDestinationById = async (id) => {
  return destinations.find((destination) => destination._id === `${id}`) || null
}

const createDestination = async (payload) => {
  const destination = {
    ...payload,
    _id: createId('destination'),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  destinations.push(destination)
  return destination
}

const updateDestination = async (id, updates) => {
  const index = destinations.findIndex((destination) => destination._id === `${id}`)
  if (index === -1) return null
  destinations[index] = { ...destinations[index], ...updates, _id: `${id}`, updatedAt: new Date().toISOString() }
  return destinations[index]
}

const deleteDestination = async (id) => {
  const index = destinations.findIndex((destination) => destination._id === `${id}`)
  if (index === -1) return null
  const [removed] = destinations.splice(index, 1)
  return removed
}

module.exports = {
  createUser,
  findUserByEmail,
  findUserByPhone,
  findUserByEmailOrPhone,
  findUserById,
  updateUser,
  listBookingsByUser,
  createBooking,
  cancelBookingById,
  getBookingById,
  getDestinationById,
  createDestination,
  updateDestination,
  deleteDestination,
  getAllDestinations: () => destinations,
}
