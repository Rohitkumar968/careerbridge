const express = require('express')
const router = express.Router()
const {
  getJobs, getJobById, createJob, updateJob, deleteJob,
  saveJob, unsaveJob, getSavedJobs, getRecommendedJobs,
} = require('../controllers/jobController')
const { protect, authorize } = require('../middleware/authMiddleware')

// ── Static routes MUST come before /:id ──────────────────────────────────────
router.get('/saved', protect, authorize('seeker', 'job_seeker'), getSavedJobs)
router.get('/recommended', protect, getRecommendedJobs)
// /search aliases to getJobs with keyword param (frontend calls GET /jobs/search?q=...)
router.get('/search', (req, res, next) => {
  if (req.query.q) req.query.keyword = req.query.q
  return getJobs(req, res, next)
})

// ── Public routes ─────────────────────────────────────────────────────────────
router.get('/', getJobs)
router.get('/:id', getJobById)

// ── Protected routes ──────────────────────────────────────────────────────────
router.post('/', protect, authorize('recruiter', 'admin'), createJob)
router.put('/:id', protect, authorize('recruiter', 'admin'), updateJob)
router.delete('/:id', protect, authorize('recruiter', 'admin'), deleteJob)
router.post('/:id/save', protect, authorize('seeker', 'job_seeker'), saveJob)
router.delete('/:id/save', protect, authorize('seeker', 'job_seeker'), unsaveJob)

module.exports = router
