const express = require('express')
const router = express.Router()
const {
  applyForJob, getApplications, getApplicationById,
  updateApplicationStatus, withdrawApplication, deleteApplication, getApplicationStats,
} = require('../controllers/applicationController')
const { protect, authorize } = require('../middleware/authMiddleware')

router.use(protect)

// Static routes before /:id
router.get('/stats', getApplicationStats)
router.get('/', getApplications)

// /my is an alias for GET / scoped to the logged-in seeker
router.get('/my', getApplications)

router.post('/apply/:jobId', authorize('seeker', 'job_seeker'), applyForJob)
router.get('/:id', getApplicationById)
router.put('/:id/status', authorize('recruiter', 'admin'), updateApplicationStatus)
router.post('/:id/withdraw', authorize('seeker', 'job_seeker'), withdrawApplication)
router.delete('/:id', deleteApplication)

module.exports = router
