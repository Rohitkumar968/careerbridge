const Interview = require('../models/Interview')
const Application = require('../models/Application')
const createNotification = require('../utils/createNotification')

// POST /api/interviews
const scheduleInterview = async (req, res, next) => {
  try {
    const { applicationId, date, startTime, endTime, meetingLink, notes } = req.body

    const application = await Application.findById(applicationId).populate('job', 'title recruiter')
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' })

    if (application.job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' })
    }

    const interview = await Interview.create({
      application: applicationId,
      candidate: application.applicant,
      recruiter: req.user._id,
      job: application.job._id,
      date,
      startTime,
      endTime: endTime || '',
      meetingLink: meetingLink || '',
      notes: notes || '',
    })

    // Update application status to interview
    application.status = 'interview'
    await application.save()

    await createNotification(
      application.applicant,
      'Interview Scheduled',
      `An interview has been scheduled for ${application.job.title} on ${new Date(date).toLocaleDateString()}.`,
      'interview',
      interview._id
    )

    await interview.populate([
      { path: 'candidate', select: 'name email avatar' },
      { path: 'job', select: 'title', populate: { path: 'company', select: 'name logo' } },
    ])

    res.status(201).json({ success: true, data: interview })
  } catch (err) {
    next(err)
  }
}

// GET /api/interviews
const getInterviews = async (req, res, next) => {
  try {
    const { status } = req.query
    const query = {}

    if (req.user.role === 'seeker') query.candidate = req.user._id
    else if (req.user.role === 'recruiter') query.recruiter = req.user._id

    if (status) query.status = status

    const interviews = await Interview.find(query)
      .populate('candidate', 'name email avatar')
      .populate('recruiter', 'name email')
      .populate({ path: 'job', select: 'title', populate: { path: 'company', select: 'name logo' } })
      .sort('-date')

    res.json({ success: true, data: interviews })
  } catch (err) {
    next(err)
  }
}

// GET /api/interviews/:id
const getInterviewById = async (req, res, next) => {
  try {
    const interview = await Interview.findById(req.params.id)
      .populate('candidate', 'name email avatar phone')
      .populate('recruiter', 'name email')
      .populate({ path: 'job', populate: { path: 'company', select: 'name logo' } })

    if (!interview) return res.status(404).json({ success: false, message: 'Interview not found' })

    const isParticipant =
      interview.candidate._id.toString() === req.user._id.toString() ||
      interview.recruiter._id.toString() === req.user._id.toString() ||
      req.user.role === 'admin'

    if (!isParticipant) return res.status(403).json({ success: false, message: 'Not authorized' })

    res.json({ success: true, data: interview })
  } catch (err) {
    next(err)
  }
}

// PUT /api/interviews/:id
const updateInterview = async (req, res, next) => {
  try {
    let interview = await Interview.findById(req.params.id)
    if (!interview) return res.status(404).json({ success: false, message: 'Interview not found' })

    if (interview.recruiter.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' })
    }

    interview = await Interview.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    res.json({ success: true, data: interview })
  } catch (err) {
    next(err)
  }
}

// POST /api/interviews/:id/cancel
const cancelInterview = async (req, res, next) => {
  try {
    const interview = await Interview.findById(req.params.id)
    if (!interview) return res.status(404).json({ success: false, message: 'Interview not found' })

    if (interview.recruiter.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' })
    }

    interview.status = 'cancelled'
    await interview.save()

    await createNotification(
      interview.candidate,
      'Interview Cancelled',
      `Your interview has been cancelled.`,
      'interview',
      interview._id
    )

    res.json({ success: true, data: interview })
  } catch (err) {
    next(err)
  }
}

// POST /api/interviews/:id/reschedule
const rescheduleInterview = async (req, res, next) => {
  try {
    const { date, startTime, endTime, meetingLink } = req.body
    const interview = await Interview.findById(req.params.id)
    if (!interview) return res.status(404).json({ success: false, message: 'Interview not found' })

    if (interview.recruiter.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' })
    }

    if (date) interview.date = date
    if (startTime) interview.startTime = startTime
    if (endTime) interview.endTime = endTime
    if (meetingLink) interview.meetingLink = meetingLink
    interview.status = 'scheduled'
    await interview.save()

    await createNotification(
      interview.candidate,
      'Interview Rescheduled',
      `Your interview has been rescheduled to ${new Date(interview.date).toLocaleDateString()}.`,
      'interview',
      interview._id
    )

    res.json({ success: true, data: interview })
  } catch (err) {
    next(err)
  }
}

// DELETE /api/interviews/:id
const deleteInterview = async (req, res, next) => {
  try {
    const interview = await Interview.findById(req.params.id)
    if (!interview) return res.status(404).json({ success: false, message: 'Interview not found' })

    if (interview.recruiter.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' })
    }

    await interview.deleteOne()
    res.json({ success: true, message: 'Interview deleted' })
  } catch (err) {
    next(err)
  }
}

module.exports = { scheduleInterview, getInterviews, getInterviewById, updateInterview, cancelInterview, rescheduleInterview, deleteInterview }
