const express = require('express')

const router = express.Router()

const {
  uploadResume,
  getResume,
  viewResume,
  downloadResume,
  deleteResume,
  analyzeResume,
  getResumeAnalysis,
} = require('../controllers/resumeController')

const { protect } = require('../middleware/authMiddleware')

const {
  uploadResume: uploadResumeMiddleware,
} = require('../middleware/uploadMiddleware')

// TEST
router.get('/ping', (req, res) => {
  res.json({
    success: true,
    message: 'Resume routes are working',
  })
})

// PROTECTED ROUTES
router.get('/', protect, getResume)

router.get('/view', protect, viewResume)

router.get('/download', protect, downloadResume)

router.post('/analyze', protect, analyzeResume)

router.get('/analysis', protect, getResumeAnalysis)

router.post(
  '/upload',
  protect,
  uploadResumeMiddleware.single('resume'),
  uploadResume
)

router.delete('/', protect, deleteResume)

module.exports = router