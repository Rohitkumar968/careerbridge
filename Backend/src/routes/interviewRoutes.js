const express = require('express')
const router = express.Router()
const {
  scheduleInterview, getInterviews, getInterviewById,
  updateInterview, cancelInterview, rescheduleInterview, deleteInterview,
} = require('../controllers/interviewController')
const { protect, authorize } = require('../middleware/authMiddleware')

router.use(protect)

router.get('/', getInterviews)
router.get('/:id', getInterviewById)
router.post('/', authorize('recruiter', 'admin'), scheduleInterview)
router.put('/:id', authorize('recruiter', 'admin'), updateInterview)
router.post('/:id/cancel', authorize('recruiter', 'admin'), cancelInterview)
router.post('/:id/reschedule', authorize('recruiter', 'admin'), rescheduleInterview)
router.delete('/:id', authorize('recruiter', 'admin'), deleteInterview)

module.exports = router
