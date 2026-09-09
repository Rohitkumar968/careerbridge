const User = require('../models/User')
const Job = require('../models/Job')
const Application = require('../models/Application')

// GET /api/admin/users
const getUsers = async (req, res, next) => {
  try {
    const { role, isActive, keyword, page = 1, limit = 20 } = req.query
    const query = {}
    if (role) query.role = role
    if (isActive !== undefined) query.isActive = isActive === 'true'
    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { email: { $regex: keyword, $options: 'i' } },
      ]
    }

    const skip = (Number(page) - 1) * Number(limit)
    const total = await User.countDocuments(query)
    const users = await User.find(query)
      .select('-password')
      .sort('-createdAt')
      .skip(skip)
      .limit(Number(limit))

    res.json({
      success: true,
      data: users,
      pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) },
    })
  } catch (err) {
    next(err)
  }
}

// GET /api/admin/users/:id
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password')
    if (!user) return res.status(404).json({ success: false, message: 'User not found' })
    res.json({ success: true, data: user })
  } catch (err) {
    next(err)
  }
}

// PUT /api/admin/users/:id
const updateUser = async (req, res, next) => {
  try {
    const { name, email, role, isActive } = req.body
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role, isActive },
      { new: true, runValidators: true }
    ).select('-password')
    if (!user) return res.status(404).json({ success: false, message: 'User not found' })
    res.json({ success: true, data: user })
  } catch (err) {
    next(err)
  }
}

// PUT /api/admin/users/:id/status  (suspend / activate)
const updateUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ success: false, message: 'User not found' })
    user.isActive = !user.isActive
    await user.save()
    res.json({ success: true, data: { _id: user._id, isActive: user.isActive } })
  } catch (err) {
    next(err)
  }
}

// POST /api/admin/users/:id/suspend
const suspendUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true }).select('-password')
    if (!user) return res.status(404).json({ success: false, message: 'User not found' })
    res.json({ success: true, data: user })
  } catch (err) {
    next(err)
  }
}

// DELETE /api/admin/users/:id
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) return res.status(404).json({ success: false, message: 'User not found' })
    res.json({ success: true, message: 'User deleted' })
  } catch (err) {
    next(err)
  }
}

// GET /api/admin/jobs
const getAdminJobs = async (req, res, next) => {
  try {
    const { status, keyword, page = 1, limit = 20 } = req.query
    const query = {}
    if (status) query.status = status
    if (keyword) query.title = { $regex: keyword, $options: 'i' }

    const skip = (Number(page) - 1) * Number(limit)
    const total = await Job.countDocuments(query)
    const jobs = await Job.find(query)
      .populate('company', 'name logo')
      .populate('recruiter', 'name email')
      .sort('-createdAt')
      .skip(skip)
      .limit(Number(limit))

    res.json({
      success: true,
      data: jobs,
      pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) },
    })
  } catch (err) {
    next(err)
  }
}

// POST /api/admin/jobs/:id/approve
const approveJob = async (req, res, next) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, { status: 'active' }, { new: true })
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' })
    res.json({ success: true, data: job })
  } catch (err) {
    next(err)
  }
}

// POST /api/admin/jobs/:id/reject
const rejectJob = async (req, res, next) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, { status: 'closed' }, { new: true })
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' })
    res.json({ success: true, data: job })
  } catch (err) {
    next(err)
  }
}

// POST /api/admin/jobs/:id/suspend
const suspendJob = async (req, res, next) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, { status: 'draft' }, { new: true })
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' })
    res.json({ success: true, data: job })
  } catch (err) {
    next(err)
  }
}

// DELETE /api/admin/jobs/:id
const deleteAdminJob = async (req, res, next) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id)
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' })
    res.json({ success: true, message: 'Job deleted' })
  } catch (err) {
    next(err)
  }
}

// GET /api/admin/applications
const getAdminApplications = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query
    const skip = (Number(page) - 1) * Number(limit)
    const total = await Application.countDocuments()
    const applications = await Application.find()
      .populate('applicant', 'name email')
      .populate({ path: 'job', select: 'title', populate: { path: 'company', select: 'name' } })
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

// GET /api/admin/stats
const getAdminStats = async (req, res, next) => {
  try {
    const [totalUsers, totalSeekers, totalRecruiters, totalJobs, totalApplications] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'seeker' }),
      User.countDocuments({ role: 'recruiter' }),
      Job.countDocuments(),
      Application.countDocuments(),
    ])
    res.json({ success: true, data: { totalUsers, totalSeekers, totalRecruiters, totalJobs, totalApplications } })
  } catch (err) {
    next(err)
  }
}

// GET /api/admin/reports
const getReports = async (req, res, next) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

    const [newUsers, newJobs, newApplications] = await Promise.all([
      User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      Job.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      Application.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
    ])

    const applicationsByStatus = await Application.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ])

    res.json({
      success: true,
      data: {
        last30Days: { newUsers, newJobs, newApplications },
        applicationsByStatus,
      },
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getUsers, getUserById, updateUser, updateUserStatus, suspendUser, deleteUser,
  getAdminJobs, approveJob, rejectJob, suspendJob, deleteAdminJob,
  getAdminApplications, getAdminStats, getReports,
}
