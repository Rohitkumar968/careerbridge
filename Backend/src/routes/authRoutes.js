const express = require('express')

const router = express.Router()

const {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController')

const { protect } = require('../middleware/authMiddleware')

router.post('/register', register)

router.post('/login', login)

router.post('/forgot-password', forgotPassword)

router.post('/reset-password', resetPassword)

router.post('/logout', protect, logout)

router.get('/me', protect, getMe)

router.put('/profile', protect, updateProfile)

router.put('/change-password', protect, changePassword)

module.exports = router