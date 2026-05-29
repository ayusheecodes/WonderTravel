const { createItinerary } = require('../services/itineraryService')

const generateItinerary = async (req, res) => {
  try {
    const { destination, days, budget, style, travelers } = req.body

    if (!destination || !`${destination}`.trim()) {
      return res.status(400).json({ message: 'Destination is required' })
    }

    const totalDays = Number(days)
    if (!Number.isFinite(totalDays) || totalDays < 1 || totalDays > 14) {
      return res.status(400).json({ message: 'Days must be between 1 and 14' })
    }

    const totalBudget = Number(`${budget || ''}`.replace(/[^0-9]/g, ''))
    if (!totalBudget) {
      return res.status(400).json({ message: 'Budget is required' })
    }

    const itinerary = await createItinerary({ destination, days, budget, style, travelers })
    res.json(itinerary)
  } catch (error) {
    console.error('Itinerary generation error:', error.message)
    res.status(500).json({ message: 'Failed to generate itinerary' })
  }
}

module.exports = { generateItinerary }
