const express = require('express')

const router = express.Router()

const {
  chat,
  chatStream,
  getChatHistory,
  analyzeResume,
  getJobMatches,
  jobMatch,
  getRankingCandidates,
} = require('../controllers/aiController')

const {
  protect,
} = require('../middleware/authMiddleware')

/**
 * All AI routes require authentication.
 */
router.use(protect)

/**
 * Normal AI chat
 */
router.post('/chat', chat)

/**
 * Streaming AI chat
 */
router.post('/chat/stream', chatStream)

/**
 * Chat history
 */
router.get(
  '/chat-history',
  getChatHistory
)

/**
 * Resume analysis
 */
router.post(
  '/analyze-resume',
  analyzeResume
)

/**
 * Job matches
 */
router.get(
  '/job-matches',
  getJobMatches
)

/**
 * Specific job match
 */
router.post(
  '/job-match',
  jobMatch
)

/**
 * Recruiter candidate ranking
 */
router.get(
  '/ranking/:jobId',
  getRankingCandidates
)

module.exports = router