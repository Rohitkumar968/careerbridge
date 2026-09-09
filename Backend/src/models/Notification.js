const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema(
  {
    // User who receives the notification
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    // Notification title
    title: {
      type: String,
      trim: true,
      default: 'Notification',
    },

    // Notification message
    message: {
      type: String,
      required: true,
      trim: true,
    },

    // Notification type
    type: {
      type: String,
      enum: [
        'application',
        'interview',
        'job',
        'status',
        'system',
      ],
      default: 'system',
    },

    // Read status
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },

    // Optional related resource
    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    // Optional link/action
    link: {
      type: String,
      default: null,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
)

// Faster notification queries
notificationSchema.index({
  user: 1,
  createdAt: -1,
})

notificationSchema.index({
  user: 1,
  isRead: 1,
})

module.exports = mongoose.model(
  'Notification',
  notificationSchema
)