const express = require('express')
const router = express.Router()
const { getSeekerDashboard, getRecruiterDashboard, getAdminDashboard } = require('../controllers/dashboardController')
const { protect, authorize } = require('../middleware/authMiddleware')

router.get('/seeker', protect, authorize('seeker', 'job_seeker'), getSeekerDashboard)
router.get('/recruiter', protect, authorize('recruiter'), getRecruiterDashboard)
router.get('/admin', protect, authorize('admin'), getAdminDashboard)

module.exports = router
