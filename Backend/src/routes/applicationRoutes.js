const express = require('express')

const router = express.Router()

const {
  applyForJob,
  getApplications,
  getMyApplications,
  getApplicationStats,
  getApplicationById,
  updateApplicationStatus,
  withdrawApplication,
  resetMyInterviewApplications,
  deleteApplication,
} = require('../controllers/applicationController')

const {
  protect,
  authorize,
} = require('../middleware/authMiddleware')

// =====================================================
// ALL APPLICATION ROUTES REQUIRE LOGIN
// =====================================================

router.use(protect)

// =====================================================
// APPLICATION STATS
// =====================================================

router.get(
  '/stats',
  getApplicationStats
)

// =====================================================
// MY APPLICATIONS
// IMPORTANT: /my MUST COME BEFORE /:id
// =====================================================

router.get(
  '/my',
  getMyApplications
)

// =====================================================
// TEMPORARY FIX
// Reset current user's stale interview applications
// =====================================================

router.patch(
  '/reset-my-interviews',
  authorize('seeker', 'job_seeker'),
  resetMyInterviewApplications
)

// =====================================================
// GET ALL APPLICATIONS
// =====================================================

router.get(
  '/',
  getApplications
)

// =====================================================
// APPLY FOR JOB
// =====================================================

router.post(
  '/apply/:jobId',
  authorize('seeker', 'job_seeker'),
  applyForJob
)

// =====================================================
// GET APPLICATION BY ID
// =====================================================

router.get(
  '/:id',
  getApplicationById
)

// =====================================================
// UPDATE APPLICATION STATUS
// Recruiter/Admin only
// =====================================================

router.put(
  '/:id/status',
  authorize('recruiter', 'admin'),
  updateApplicationStatus
)

// =====================================================
// WITHDRAW APPLICATION
// =====================================================

router.post(
  '/:id/withdraw',
  authorize('seeker', 'job_seeker'),
  withdrawApplication
)

// =====================================================
// DELETE APPLICATION
// =====================================================

router.delete(
  '/:id',
  deleteApplication
)

module.exports = router