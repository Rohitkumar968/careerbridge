const Notification = require('../models/Notification')

const createNotification = async (
  userId,
  title,
  message,
  type = 'system',
  relatedId = null
) => {
  try {
    console.log('🔔 Creating notification...')
    console.log('User:', userId)
    console.log('Title:', title)
    console.log('Message:', message)

    if (!userId) {
      throw new Error('Notification userId is missing')
    }

    const notification = await Notification.create({
      user: userId,
      title,
      message,
      type,
      relatedId,
      isRead: false,
    })

    console.log(
      '✅ Notification created:',
      notification._id.toString()
    )

    return notification
  } catch (error) {
    console.error(
      '❌ Notification creation failed:',
      error
    )

    // IMPORTANT:
    // Do not silently hide notification errors.
    throw error
  }
}

module.exports = createNotification