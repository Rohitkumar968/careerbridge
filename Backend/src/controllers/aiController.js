const aiService = require('../services/aiService')
const Resume = require('../models/Resume')
const Job = require('../models/Job')
const User = require('../models/User')

/**
 * POST /api/ai/chat
 *
 * Normal non-streaming endpoint.
 */
const chat = async (req, res, next) => {
  try {
    const { message } = req.body

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message is required',
      })
    }

    const user = await User.findById(req.user._id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      })
    }

    const reply = await aiService.chat(
      message.trim(),
      user
    )

    res.json({
      success: true,
      reply,
    })
  } catch (err) {
    console.error('AI chat controller error:', err)

    next(err)
  }
}

/**
 * POST /api/ai/chat/stream
 *
 * Streaming AI endpoint.
 *
 * Browser receives text chunks immediately.
 */
const chatStream = async (req, res) => {
  try {
    const { message } = req.body

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message is required',
      })
    }

    const user = await User.findById(req.user._id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      })
    }

    /**
     * Headers for streaming.
     */
    res.status(200)

    res.setHeader(
      'Content-Type',
      'text/plain; charset=utf-8'
    )

    res.setHeader(
      'Cache-Control',
      'no-cache, no-transform'
    )

    res.setHeader(
      'Connection',
      'keep-alive'
    )

    res.setHeader(
      'X-Accel-Buffering',
      'no'
    )

    if (typeof res.flushHeaders === 'function') {
      res.flushHeaders()
    }

    /**
     * Stream Gemini response.
     */
    await aiService.chatStream(
      message.trim(),
      user,
      (chunk) => {
        if (!res.writableEnded) {
          res.write(chunk)
        }
      }
    )

    if (!res.writableEnded) {
      res.end()
    }
  } catch (error) {
    console.error(
      'AI streaming controller error:',
      error?.message || error
    )

    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message:
          error?.message ||
          'AI service failed',
      })
    }

    if (!res.writableEnded) {
      res.write(
        `\n\n[AI_ERROR] ${
          error?.message ||
          'AI service failed'
        }`
      )

      res.end()
    }
  }
}

/**
 * GET /api/ai/chat-history
 */
const getChatHistory = async (req, res) => {
  res.json({
    success: true,
    data: [],
  })
}

/**
 * POST /api/ai/analyze-resume
 */
const analyzeResume = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      })
    }

    const analysis =
      await aiService.analyzeResumeText(user)

    await Resume.findOneAndUpdate(
      { user: req.user._id },
      {
        atsScore: analysis.atsScore,
        analysisResult: analysis,
        skills: analysis.skills || [],
      },
      {
        upsert: true,
        new: true,
      }
    )

    res.json({
      success: true,
      data: analysis,
    })
  } catch (err) {
    next(err)
  }
}

/**
 * GET /api/ai/job-matches
 */
const getJobMatches = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      })
    }

    if (
      !user.skills ||
      user.skills.length === 0
    ) {
      return res.json({
        success: true,
        data: [],
      })
    }

    const jobs = await Job.find({
      status: 'active',
    })
      .populate(
        'company',
        'name logo location'
      )
      .limit(20)

    const userSkills = user.skills.map((s) =>
      s.toLowerCase()
    )

    const matches = jobs.map((job) => {
      const jobSkills = (
        job.skills || []
      ).map((s) => s.toLowerCase())

      const matched = userSkills.filter((s) =>
        jobSkills.includes(s)
      )

      const missing = jobSkills.filter(
        (s) => !userSkills.includes(s)
      )

      const matchPercentage =
        jobSkills.length > 0
          ? Math.round(
              (matched.length /
                jobSkills.length) *
                100
            )
          : 0

      return {
        job,
        matchPercentage,
        matchedSkills: matched,
        missingSkills: missing,

        recommendations:
          missing.length > 0
            ? [
                `Consider learning: ${missing
                  .slice(0, 3)
                  .join(', ')}`,
              ]
            : [
                'Great match! Your skills align well with this role.',
              ],
      }
    })

    matches.sort(
      (a, b) =>
        b.matchPercentage -
        a.matchPercentage
    )

    res.json({
      success: true,
      data: matches.slice(0, 10),
    })
  } catch (err) {
    next(err)
  }
}

/**
 * POST /api/ai/job-match
 */
const jobMatch = async (req, res, next) => {
  try {
    const { jobId } = req.body

    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: 'jobId is required',
      })
    }

    const [job, user] =
      await Promise.all([
        Job.findById(jobId).populate(
          'company',
          'name logo'
        ),

        User.findById(req.user._id),
      ])

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      })
    }

    const jobSkills = (
      job.skills || []
    ).map((s) => s.toLowerCase())

    const userSkills = (
      user?.skills || []
    ).map((s) => s.toLowerCase())

    const matchedSkills =
      userSkills.filter((s) =>
        jobSkills.includes(s)
      )

    const missingSkills =
      jobSkills.filter(
        (s) => !userSkills.includes(s)
      )

    const matchPercentage =
      jobSkills.length > 0
        ? Math.round(
            (matchedSkills.length /
              jobSkills.length) *
              100
          )
        : 0

    const recommendations = []

    if (missingSkills.length > 0) {
      recommendations.push(
        `Learn these skills to improve your match: ${missingSkills.join(
          ', '
        )}`
      )
    }

    if (matchPercentage >= 80) {
      recommendations.push(
        'Excellent match! Apply with confidence.'
      )
    } else if (matchPercentage >= 50) {
      recommendations.push(
        'Good match. Highlight your relevant experience.'
      )
    } else {
      recommendations.push(
        'Consider upskilling before applying.'
      )
    }

    res.json({
      success: true,
      data: {
        matchPercentage,
        matchedSkills,
        missingSkills,
        recommendations,
      },
    })
  } catch (err) {
    next(err)
  }
}

/**
 * GET /api/ai/ranking/:jobId
 */
const getRankingCandidates = async (
  req,
  res,
  next
) => {
  try {
    const Application =
      require('../models/Application')

    const job = await Job.findById(
      req.params.jobId
    )

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      })
    }

    if (
      job.recruiter.toString() !==
        req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      })
    }

    const applications =
      await Application.find({
        job: req.params.jobId,
      }).populate(
        'applicant',
        'name email avatar skills experience'
      )

    const jobSkills = (
      job.skills || []
    ).map((s) => s.toLowerCase())

    const ranked = applications.map(
      (app) => {
        const candidateSkills = (
          app.applicant?.skills || []
        ).map((s) => s.toLowerCase())

        const matched =
          candidateSkills.filter((s) =>
            jobSkills.includes(s)
          )

        const score =
          jobSkills.length > 0
            ? Math.round(
                (matched.length /
                  jobSkills.length) *
                  100
              )
            : 0

        return {
          application: app,
          matchScore: score,
          matchedSkills: matched,
        }
      }
    )

    ranked.sort(
      (a, b) =>
        b.matchScore -
        a.matchScore
    )

    res.json({
      success: true,
      data: ranked,
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  chat,
  chatStream,
  getChatHistory,
  analyzeResume,
  getJobMatches,
  jobMatch,
  getRankingCandidates,
}