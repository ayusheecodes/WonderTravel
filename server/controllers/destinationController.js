const Destination = require('../models/Destination')
const { isMongoAvailable } = require('../config/db')
const fallbackStore = require('../services/fallbackStore')
const { fallbackDestinations, formatDestination, filterCatalog } = require('../services/destinationCatalog')

const getDestinationModel = () => {
  if (isMongoAvailable()) return Destination
  return {
    countDocuments: async () => fallbackStore.getAllDestinations().length,
    find: async (query) => fallbackStore.getAllDestinations().filter((item) => {
      if (query.region && query.region !== 'All Regions' && item.region !== query.region) return false
      if (query.tag && query.tag !== 'All' && item.tag !== query.tag) return false
      if (query.isVerified === true && !item.isVerified) return false
      if (query.$or) {
        const searchText = query.$or
          .map((condition) => condition.name?.$regex || condition.state?.$regex || condition.description?.$regex || '')
          .join(' ')
          .trim()
          .toLowerCase()
        if (!searchText) return true
        const haystack = `${item.name} ${item.state} ${item.description}`.toLowerCase()
        return haystack.includes(searchText)
      }
      return true
    }),
    findById: async (id) => fallbackStore.getDestinationById(id),
    create: async (payload) => fallbackStore.createDestination(payload),
    findByIdAndUpdate: async (id, updates) => fallbackStore.updateDestination(id, updates),
    findByIdAndDelete: async (id) => fallbackStore.deleteDestination(id),
  }
}

// GET /api/destinations
const getDestinations = async (req, res) => {
  try {
    const { region, tag, search, verified } = req.query
    let query = {}

    if (region && region !== 'All Regions') query.region = region
    if (tag    && tag    !== 'All')          query.tag    = tag
    if (verified === 'true')                 query.isVerified = true
    if (search) {
      query.$or = [
        { name:        { $regex: search, $options: 'i' } },
        { state:       { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ]
    }

    // Bug #19 fix: count ALL documents (not just matching ones) so we can decide
    // whether the DB is populated. If DB is empty, use the catalog exclusively.
    const totalCount = await getDestinationModel().countDocuments()

    if (totalCount === 0) {
      // DB is empty — filter and return the catalog only
      const results = filterCatalog(fallbackDestinations, { region, tag, search, verified })
        .sort((a, b) => b.rating - a.rating)
        .map(formatDestination)

      return res.json(results)
    }

    // DB has data — apply the same filters to both sources and merge.
    // Both the Mongoose query and filterCatalog now receive identical filter
    // parameters so results are consistent regardless of which source they come from.
    const destinations = await getDestinationModel().find(query)

    const formattedDestinations = destinations.map(formatDestination)
    const existingNames = new Set(formattedDestinations.map((destination) => destination.name.toLowerCase()))

    // filterCatalog applies region/tag/search/verified — same as the DB query
    const fallbackResults = filterCatalog(fallbackDestinations, { region, tag, search, verified })
      .filter((destination) => !existingNames.has(destination.name.toLowerCase()))
      .map(formatDestination)

    res.json([...formattedDestinations, ...fallbackResults].sort((a, b) => b.rating - a.rating))
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// GET /api/destinations/:id
const getDestinationById = async (req, res) => {
  try {
    const dest = await getDestinationModel().findById(req.params.id)
    if (!dest) return res.status(404).json({ message: 'Destination not found' })
    res.json(formatDestination(dest))
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// POST /api/destinations — contributor only
const createDestination = async (req, res) => {
  try {
    const destination = await getDestinationModel().create({
      ...req.body,
      contributorName: req.user.name,
      addedBy: req.user._id,
      isVerified: false,
    })
    const populated = typeof destination.populate === 'function'
      ? await destination.populate('addedBy', 'name')
      : destination
    res.status(201).json(formatDestination(populated))
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// PUT /api/destinations/:id — admin verify
const updateDestination = async (req, res) => {
  try {
    // Bug #13 fix: whitelist the fields an admin is allowed to update.
    // Prevents mass-assignment of sensitive fields like addedBy, contributorName, etc.
    const {
      name, state, region, tag, emoji, image,
      rating, difficulty, bestSeason, duration,
      description, tips, activities, budgetMin, budgetMax,
      isVerified,
    } = req.body

    const allowedUpdates = {
      ...(name        !== undefined && { name }),
      ...(state       !== undefined && { state }),
      ...(region      !== undefined && { region }),
      ...(tag         !== undefined && { tag }),
      ...(emoji       !== undefined && { emoji }),
      ...(image       !== undefined && { image }),
      ...(rating      !== undefined && { rating }),
      ...(difficulty  !== undefined && { difficulty }),
      ...(bestSeason  !== undefined && { bestSeason }),
      ...(duration    !== undefined && { duration }),
      ...(description !== undefined && { description }),
      ...(tips        !== undefined && { tips }),
      ...(activities  !== undefined && { activities }),
      ...(budgetMin   !== undefined && { budgetMin }),
      ...(budgetMax   !== undefined && { budgetMax }),
      ...(isVerified  !== undefined && { isVerified }),
    }

    const destResult = await getDestinationModel().findByIdAndUpdate(
      req.params.id,
      allowedUpdates,
      { new: true, runValidators: true }
    )

    const dest = typeof destResult?.populate === 'function'
      ? await destResult.populate('addedBy', 'name')
      : destResult

    if (!dest) return res.status(404).json({ message: 'Destination not found' })
    res.json(formatDestination(dest))
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// DELETE /api/destinations/:id
const deleteDestination = async (req, res) => {
  try {
    const dest = await getDestinationModel().findByIdAndDelete(req.params.id)
    if (!dest) return res.status(404).json({ message: 'Destination not found' })
    res.json({ message: 'Destination deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { getDestinations, getDestinationById, createDestination, updateDestination, deleteDestination }
