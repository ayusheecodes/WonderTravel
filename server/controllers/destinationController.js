const Destination = require('../models/Destination')
const { fallbackDestinations, formatDestination, filterCatalog } = require('../services/destinationCatalog')

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
    const totalCount = await Destination.countDocuments()

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
    const destinations = await Destination.find(query)
      .populate('addedBy', 'name')
      .sort({ rating: -1 })

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
    const dest = await Destination.findById(req.params.id).populate('addedBy', 'name')
    if (!dest) return res.status(404).json({ message: 'Destination not found' })
    res.json(formatDestination(dest))
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// POST /api/destinations — contributor only
const createDestination = async (req, res) => {
  try {
    const destination = await Destination.create({
      ...req.body,
      contributorName: req.user.name,
      addedBy: req.user._id,
      isVerified: false,
    })
    const populated = await destination.populate('addedBy', 'name')
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

    const dest = await Destination.findByIdAndUpdate(
      req.params.id,
      allowedUpdates,
      { new: true, runValidators: true }
    ).populate('addedBy', 'name')

    if (!dest) return res.status(404).json({ message: 'Destination not found' })
    res.json(formatDestination(dest))
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// DELETE /api/destinations/:id
const deleteDestination = async (req, res) => {
  try {
    const dest = await Destination.findByIdAndDelete(req.params.id)
    if (!dest) return res.status(404).json({ message: 'Destination not found' })
    res.json({ message: 'Destination deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { getDestinations, getDestinationById, createDestination, updateDestination, deleteDestination }
