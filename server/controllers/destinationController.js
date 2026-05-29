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

    const destinationCount = await Destination.countDocuments()

    if (destinationCount === 0) {
      const results = filterCatalog(fallbackDestinations, { region, tag, search, verified })
        .sort((a, b) => b.rating - a.rating)
        .map(formatDestination)

      return res.json(results)
    }

    const destinations = await Destination.find(query)
      .populate('addedBy', 'name')
      .sort({ rating: -1 })

    const formattedDestinations = destinations.map(formatDestination)
    const existingNames = new Set(formattedDestinations.map((destination) => destination.name.toLowerCase()))
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
    const dest = await Destination.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('addedBy', 'name')
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
