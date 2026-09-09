const express = require('express')
const router = express.Router()
const {
  getUsers, getUserById, updateUser, updateUserStatus, suspendUser, deleteUser,
  getAdminJobs, approveJob, rejectJob, suspendJob, deleteAdminJob,
  getAdminApplications, getAdminStats, getReports,
} = require('../controllers/adminController')
const { protect, authorize } = require('../middleware/authMiddleware')

router.use(protect, authorize('admin'))

// Users
router.get('/users', getUsers)
router.get('/users/:id', getUserById)
router.put('/users/:id', updateUser)
router.put('/users/:id/status', updateUserStatus)
router.post('/users/:id/suspend', suspendUser)
router.delete('/users/:id', deleteUser)

// Jobs
router.get('/jobs', getAdminJobs)
router.post('/jobs/:id/approve', approveJob)
router.post('/jobs/:id/reject', rejectJob)
router.post('/jobs/:id/suspend', suspendJob)
router.delete('/jobs/:id', deleteAdminJob)

// Applications
router.get('/applications', getAdminApplications)

// Stats & Reports
router.get('/stats', getAdminStats)
router.get('/reports', getReports)

module.exports = router
