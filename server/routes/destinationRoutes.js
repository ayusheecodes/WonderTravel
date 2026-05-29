const express = require('express')
const router  = express.Router()
const {
  getDestinations, getDestinationById,
  createDestination, updateDestination, deleteDestination,
} = require('../controllers/destinationController')
const { protect, contributorOnly, adminOnly } = require('../middleware/authMiddleware')

router.get ('/',    getDestinations)
router.get ('/:id', getDestinationById)
router.post('/',    protect, contributorOnly, createDestination)
router.put ('/:id', protect, adminOnly, updateDestination)
router.delete('/:id', protect, adminOnly, deleteDestination)

module.exports = router