const express = require('express')
const router = express.Router()
const {
  getMyCompany, updateMyCompany, getApplicants, getApplicantById,
  updateApplicantStatus, shortlistCandidate, rejectCandidate, getAnalytics,
} = require('../controllers/recruiterController')
const { protect, authorize } = require('../middleware/authMiddleware')

router.use(protect, authorize('recruiter', 'admin'))

router.get('/company', getMyCompany)
router.put('/company', updateMyCompany)
router.get('/applicants', getApplicants)
router.get('/applicants/:id', getApplicantById)
router.put('/applicants/:id/status', updateApplicantStatus)
router.post('/applicants/:id/shortlist', shortlistCandidate)
router.post('/applicants/:id/reject', rejectCandidate)
router.get('/analytics', getAnalytics)

module.exports = router
