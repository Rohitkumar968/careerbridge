const express = require('express')

const router = express.Router()

const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} = require('../controllers/notificationController')

const { protect } = require('../middleware/authMiddleware')

// All notification routes require login
router.use(protect)

// Get notifications
router.get('/', getNotifications)

// Mark all as read
router.put('/read-all', markAllAsRead)

// Mark one as read
router.put('/:id/read', markAsRead)

// Delete notification
router.delete('/:id', deleteNotification)

module.exports = router