const Application = require('../models/Application')
const Job = require('../models/Job')
const createNotification = require('../utils/createNotification')

// POST /api/applications/apply/:jobId
const applyForJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId)
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' })
    if (job.status !== 'active') return res.status(400).json({ success: false, message: 'This job is no longer accepting applications' })

    const existing = await Application.findOne({ job: req.params.jobId, applicant: req.user._id })
    if (existing) return res.status(409).json({ success: false, message: 'You have already applied for this job' })

    const application = await Application.create({
      job: req.params.jobId,
      applicant: req.user._id,
      resume: req.body.resume || req.user.resume || '',
      coverLetter: req.body.coverLetter || '',
    })

    await Job.findByIdAndUpdate(req.params.jobId, { $inc: { applicantsCount: 1 } })

    await createNotification(
      req.user._id,
      'Application Submitted',
      `Your application for ${job.title} has been submitted successfully.`,
      'application',
      application._id
    )

    await application.populate([
      { path: 'job', select: 'title location employmentType', populate: { path: 'company', select: 'name logo' } },
      { path: 'applicant', select: 'name email avatar' },
    ])

    res.status(201).json({ success: true, data: application })
  } catch (err) {
    next(err)
  }
}

// GET /api/applications  (seeker: own | recruiter: their jobs | admin: all)
const getApplications = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query
    const query = {}

    if (req.user.role === 'seeker' || req.user.role === 'job_seeker') {
      query.applicant = req.user._id
    } else if (req.user.role === 'recruiter') {
      const Job = require('../models/Job')
      const recruiterJobs = await Job.find({ recruiter: req.user._id }).select('_id')
      query.job = { $in: recruiterJobs.map((j) => j._id) }
    }

    if (status) query.status = status

    const skip = (Number(page) - 1) * Number(limit)
    const total = await Application.countDocuments(query)
    const applications = await Application.find(query)
      .populate({ path: 'job', select: 'title location employmentType salaryMin salaryMax', populate: { path: 'company', select: 'name logo' } })
      .populate('applicant', 'name email avatar skills location')
      .sort('-createdAt')
      .skip(skip)
      .limit(Number(limit))

    res.json({
      success: true,
      data: applications,
      pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) },
    })
  } catch (err) {
    next(err)
  }
}

// GET /api/applications/stats
const getApplicationStats = async (req, res, next) => {
  try {
    const isSeeker = req.user.role === 'seeker' || req.user.role === 'job_seeker'
    const query = isSeeker ? { applicant: req.user._id } : {}
    const stats = await Application.aggregate([
      { $match: query },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ])
    const result = { applied: 0, reviewing: 0, shortlisted: 0, interview: 0, rejected: 0, hired: 0 }
    stats.forEach((s) => { result[s._id] = s.count })
    res.json({ success: true, data: result })
  } catch (err) {
    next(err)
  }
}

// GET /api/applications/:id
const getApplicationById = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate({ path: 'job', populate: { path: 'company', select: 'name logo location' } })
      .populate('applicant', 'name email avatar phone location skills bio')

    if (!application) return res.status(404).json({ success: false, message: 'Application not found' })

    const isOwner = application.applicant._id.toString() === req.user._id.toString()
    const isRecruiter = req.user.role === 'recruiter'
    const isAdmin = req.user.role === 'admin'

    if (!isOwner && !isRecruiter && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized' })
    }

    res.json({ success: true, data: application })
  } catch (err) {
    next(err)
  }
}

// PUT /api/applications/:id/status
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body
    const validStatuses = ['applied', 'reviewing', 'shortlisted', 'interview', 'rejected', 'hired']
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' })
    }

    const application = await Application.findById(req.params.id).populate('job', 'title recruiter')
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' })

    if (application.job.recruiter.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' })
    }

    application.status = status
    await application.save()

    await createNotification(
      application.applicant,
      'Application Status Updated',
      `Your application for ${application.job.title} has been updated to: ${status}.`,
      'status',
      application._id
    )

    res.json({ success: true, data: application })
  } catch (err) {
    next(err)
  }
}

// POST /api/applications/:id/withdraw
const withdrawApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id)
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' })

    if (application.applicant.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' })
    }

    await application.deleteOne()
    await Job.findByIdAndUpdate(application.job, { $inc: { applicantsCount: -1 } })

    res.json({ success: true, message: 'Application withdrawn' })
  } catch (err) {
    next(err)
  }
}

// DELETE /api/applications/:id
const deleteApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id)
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' })

    const isOwner = application.applicant.toString() === req.user._id.toString()
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' })
    }

    await application.deleteOne()
    res.json({ success: true, message: 'Application deleted' })
  } catch (err) {
    next(err)
  }
}

module.exports = { applyForJob, getApplications, getApplicationById, updateApplicationStatus, withdrawApplication, deleteApplication, getApplicationStats }
