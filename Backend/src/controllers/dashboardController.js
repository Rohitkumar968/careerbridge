const User = require('../models/User')
const Job = require('../models/Job')
const Company = require('../models/Company')
const Application = require('../models/Application')
const Interview = require('../models/Interview')

// GET /api/dashboard/seeker
const getSeekerDashboard = async (req, res, next) => {
  try {
    const userId = req.user._id

    const [totalApplications, applications, interviews, user] = await Promise.all([
      Application.countDocuments({ applicant: userId }),
      Application.find({ applicant: userId })
        .populate({ path: 'job', select: 'title location', populate: { path: 'company', select: 'name logo' } })
        .sort('-createdAt')
        .limit(5),
      Interview.find({ candidate: userId, status: 'scheduled' })
        .populate({ path: 'job', select: 'title', populate: { path: 'company', select: 'name logo' } })
        .sort('date')
        .limit(5),
      User.findById(userId).select('savedJobs skills'),
    ])

    const statusCounts = await Application.aggregate([
      { $match: { applicant: userId } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ])
    const stats = { applied: 0, reviewing: 0, shortlisted: 0, interview: 0, rejected: 0, hired: 0 }
    statusCounts.forEach((s) => { stats[s._id] = s.count })

    // Recommended jobs based on skills
    const skillQuery = user.skills && user.skills.length
      ? { status: 'active', skills: { $in: user.skills.map((s) => new RegExp(s, 'i')) } }
      : { status: 'active' }
    const recommendedJobs = await Job.find(skillQuery)
      .populate('company', 'name logo location')
      .sort('-createdAt')
      .limit(6)

    res.json({
      success: true,
      data: {
        totalApplications,
        shortlistedApplications: stats.shortlisted,
        applicationStats: stats,
        recentApplications: applications,
        interviews,
        savedJobsCount: user.savedJobs.length,
        recommendedJobs,
      },
    })
  } catch (err) {
    next(err)
  }
}

// GET /api/dashboard/recruiter
const getRecruiterDashboard = async (req, res, next) => {
  try {
    const recruiterId = req.user._id

    const recruiterJobs = await Job.find({ recruiter: recruiterId }).select('_id status')
    const jobIds = recruiterJobs.map((j) => j._id)

    const [totalApplicants, recentApplications, interviews] = await Promise.all([
      Application.countDocuments({ job: { $in: jobIds } }),
      Application.find({ job: { $in: jobIds } })
        .populate('applicant', 'name email avatar')
        .populate({ path: 'job', select: 'title', populate: { path: 'company', select: 'name logo' } })
        .sort('-createdAt')
        .limit(5),
      Interview.countDocuments({ recruiter: recruiterId, status: 'scheduled' }),
    ])

    res.json({
      success: true,
      data: {
        totalJobs: recruiterJobs.length,
        activeJobs: recruiterJobs.filter((j) => j.status === 'active').length,
        totalApplicants,
        interviews,
        recentApplications,
      },
    })
  } catch (err) {
    next(err)
  }
}

// GET /api/dashboard/admin
const getAdminDashboard = async (req, res, next) => {
  try {
    const [totalUsers, totalSeekers, totalRecruiters, totalJobs, totalCompanies, totalApplications] =
      await Promise.all([
        User.countDocuments(),
        User.countDocuments({ role: 'seeker' }),
        User.countDocuments({ role: 'recruiter' }),
        Job.countDocuments(),
        Company.countDocuments(),
        Application.countDocuments(),
      ])

    res.json({
      success: true,
      data: { totalUsers, totalSeekers, totalRecruiters, totalJobs, totalCompanies, totalApplications },
    })
  } catch (err) {
    next(err)
  }
}

module.exports = { getSeekerDashboard, getRecruiterDashboard, getAdminDashboard }
