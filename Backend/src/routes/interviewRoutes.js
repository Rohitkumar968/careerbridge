const express = require('express')
const router = express.Router()

const {
  createInterview,
  getRecruiterInterviews,
  getMyInterviews,
  getInterviewById,
  cancelInterview,
  completeInterview,
  deleteInterview,
} = require('../controllers/interviewController')

const {
  protect,
  authorize,
} = require('../middleware/authMiddleware')

router.use(protect)

// CREATE INTERVIEW
router.post(
  '/',
  authorize('recruiter', 'admin'),
  createInterview
)

// RECRUITER INTERVIEWS
router.get(
  '/recruiter',
  authorize('recruiter', 'admin'),
  getRecruiterInterviews
)

// CANCEL INTERVIEW
router.patch(
  '/:id/cancel',
  authorize('recruiter', 'admin'),
  cancelInterview
)

// COMPLETE INTERVIEW
router.patch(
  '/:id/complete',
  authorize('recruiter', 'admin'),
  completeInterview
)

// DELETE INTERVIEW
router.delete(
  '/:id',
  authorize('recruiter', 'admin'),
  deleteInterview
)

// CANDIDATE INTERVIEWS
router.get(
  '/my',
  authorize('seeker', 'job_seeker'),
  getMyInterviews
)

// SINGLE INTERVIEW
router.get(
  '/:id',
  getInterviewById
)

module.exports = router