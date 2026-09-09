const Company = require('../models/Company')
const Job = require('../models/Job')
const Application = require('../models/Application')
const Interview = require('../models/Interview')

// GET /api/recruiter/company
const getMyCompany = async (req, res, next) => {
  try {
    const company = await Company.findOne({ recruiter: req.user._id })
    if (!company) return res.status(404).json({ success: false, message: 'No company profile found' })
    res.json({ success: true, data: company })
  } catch (err) {
    next(err)
  }
}

// PUT /api/recruiter/company
const updateMyCompany = async (req, res, next) => {
  try {
    const company = await Company.findOneAndUpdate(
      { recruiter: req.user._id },
      req.body,
      { new: true, runValidators: true, upsert: false }
    )
    if (!company) return res.status(404).json({ success: false, message: 'No company profile found. Create one first.' })
    res.json({ success: true, data: company })
  } catch (err) {
    next(err)
  }
}

// GET /api/recruiter/applicants
const getApplicants = async (req, res, next) => {
  try {
    const { status, jobId, page = 1, limit = 10 } = req.query

    const recruiterJobs = await Job.find({ recruiter: req.user._id }).select('_id')
    const jobIds = recruiterJobs.map((j) => j._id)

    const query = { job: { $in: jobIds } }
    if (status) query.status = status
    if (jobId) query.job = jobId

    const skip = (Number(page) - 1) * Number(limit)
    const total = await Application.countDocuments(query)
    const applicants = await Application.find(query)
      .populate('applicant', 'name email avatar phone location skills bio experience')
      .populate({ path: 'job', select: 'title location employmentType', populate: { path: 'company', select: 'name logo' } })
      .sort('-createdAt')
      .skip(skip)
      .limit(Number(limit))

    res.json({
      success: true,
      data: applicants,
      pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) },
    })
  } catch (err) {
    next(err)
  }
}

// GET /api/recruiter/applicants/:id
const getApplicantById = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('applicant', 'name email avatar phone location skills bio experience education resume')
      .populate({ path: 'job', select: 'title recruiter', populate: { path: 'company', select: 'name logo' } })

    if (!application) return res.status(404).json({ success: false, message: 'Application not found' })

    if (application.job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' })
    }

    res.json({ success: true, data: application })
  } catch (err) {
    next(err)
  }
}

// PUT /api/recruiter/applicants/:id/status
const updateApplicantStatus = async (req, res, next) => {
  try {
    const { status } = req.body
    const validStatuses = ['applied', 'reviewing', 'shortlisted', 'interview', 'rejected', 'hired']
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' })
    }

    const application = await Application.findById(req.params.id).populate('job', 'title recruiter')
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' })

    if (application.job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' })
    }

    application.status = status
    await application.save()

    const createNotification = require('../utils/createNotification')
    await createNotification(
      application.applicant,
      'Application Status Updated',
      `Your application for ${application.job.title} status changed to: ${status}.`,
      'status',
      application._id
    )

    res.json({ success: true, data: application })
  } catch (err) {
    next(err)
  }
}

// POST /api/recruiter/applicants/:id/shortlist
const shortlistCandidate = async (req, res, next) => {
  req.body.status = 'shortlisted'
  return updateApplicantStatus(req, res, next)
}

// POST /api/recruiter/applicants/:id/reject
const rejectCandidate = async (req, res, next) => {
  req.body.status = 'rejected'
  return updateApplicantStatus(req, res, next)
}

// GET /api/recruiter/analytics
const getAnalytics = async (req, res, next) => {
  try {
    const recruiterJobs = await Job.find({ recruiter: req.user._id }).select('_id title applicantsCount status createdAt')
    const jobIds = recruiterJobs.map((j) => j._id)

    const totalApplicants = await Application.countDocuments({ job: { $in: jobIds } })
    const interviews = await Interview.countDocuments({ recruiter: req.user._id })

    const statusBreakdown = await Application.aggregate([
      { $match: { job: { $in: jobIds } } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ])

    const statusMap = {}
    statusBreakdown.forEach((s) => { statusMap[s._id] = s.count })

    res.json({
      success: true,
      data: {
        totalJobs: recruiterJobs.length,
        activeJobs: recruiterJobs.filter((j) => j.status === 'active').length,
        totalApplicants,
        interviews,
        statusBreakdown: statusMap,
        jobs: recruiterJobs,
      },
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getMyCompany, updateMyCompany, getApplicants, getApplicantById,
  updateApplicantStatus, shortlistCandidate, rejectCandidate, getAnalytics,
}
