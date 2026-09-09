const jwt = require('jsonwebtoken')
const User = require('../models/User')

const protect = async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token',
    })
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    )

    req.user = await User.findById(decoded.id).select(
      '-password'
    )

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
      })
    }

    if (!req.user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is suspended',
      })
    }

    next()
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, invalid token',
    })
  }
}

const authorize = (...roles) => {
  return (req, res, next) => {
    const userRole =
      req.user.role === 'job_seeker'
        ? 'seeker'
        : req.user.role

    const normalizedRoles = roles.map((role) =>
      role === 'job_seeker' ? 'seeker' : role
    )

    if (!normalizedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user.role}' is not authorized for this action`,
      })
    }

    next()
  }
}

module.exports = {
  protect,
  authorize,
}