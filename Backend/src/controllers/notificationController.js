const Notification = require('../models/Notification')

// =====================================================
// GET NOTIFICATIONS
// GET /api/notifications
// =====================================================
const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({
      user: req.user._id,
    })
      .sort({ createdAt: -1 })
      .limit(50)

    const unreadCount = await Notification.countDocuments({
      user: req.user._id,
      isRead: false,
    })

    res.json({
      success: true,
      data: notifications,
      unreadCount,
    })
  } catch (err) {
    next(err)
  }
}

// =====================================================
// MARK ONE AS READ
// PUT /api/notifications/:id/read
// =====================================================
const markAsRead = async (req, res, next) => {
  try {
    const notification =
      await Notification.findOneAndUpdate(
        {
          _id: req.params.id,
          user: req.user._id,
        },
        {
          isRead: true,
        },
        {
          new: true,
        }
      )

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found',
      })
    }

    res.json({
      success: true,
      data: notification,
    })
  } catch (err) {
    next(err)
  }
}

// =====================================================
// MARK ALL AS READ
// PUT /api/notifications/read-all
// =====================================================
const markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      {
        user: req.user._id,
        isRead: false,
      },
      {
        isRead: true,
      }
    )

    res.json({
      success: true,
      message: 'All notifications marked as read',
    })
  } catch (err) {
    next(err)
  }
}

// =====================================================
// DELETE
// DELETE /api/notifications/:id
// =====================================================
const deleteNotification = async (
  req,
  res,
  next
) => {
  try {
    const notification =
      await Notification.findOneAndDelete({
        _id: req.params.id,
        user: req.user._id,
      })

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found',
      })
    }

    res.json({
      success: true,
      message: 'Notification deleted',
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
}