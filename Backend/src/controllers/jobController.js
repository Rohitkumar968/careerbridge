const Job = require('../models/Job')
const Company = require('../models/Company')
const User = require('../models/User')

// =====================================================
// GET ALL JOBS
// GET /api/jobs
// =====================================================

const getJobs = async (req, res, next) => {
  try {
    const {
      keyword,
      location,
      category,
      employmentType,
      experienceLevel,
      salaryMin,
      salaryMax,
      workMode,
      status = 'active',
      page = 1,
      limit = 10,
      sort = '-createdAt',
    } = req.query

    const query = {
      status,
    }

    // Keyword search
    if (keyword) {
      query.$or = [
        {
          title: {
            $regex: keyword,
            $options: 'i',
          },
        },
        {
          description: {
            $regex: keyword,
            $options: 'i',
          },
        },
        {
          skills: {
            $in: [new RegExp(keyword, 'i')],
          },
        },
      ]
    }

    // Location
    if (location) {
      query.location = {
        $regex: location,
        $options: 'i',
      }
    }

    // Category
    if (category) {
      query.category = {
        $regex: category,
        $options: 'i',
      }
    }

    // Employment type
    if (employmentType) {
      query.employmentType = employmentType
    }

    // Experience level
    if (experienceLevel) {
      query.experienceLevel = experienceLevel
    }

    // Work mode
    if (workMode) {
      query.workMode = workMode
    }

    // Salary
    if (salaryMin) {
      query.salaryMax = {
        $gte: Number(salaryMin),
      }
    }

    if (salaryMax) {
      query.salaryMin = {
        ...(query.salaryMin || {}),
        $lte: Number(salaryMax),
      }
    }

    const pageNumber = Math.max(
      1,
      Number(page) || 1
    )

    const limitNumber = Math.max(
      1,
      Number(limit) || 10
    )

    const skip =
      (pageNumber - 1) * limitNumber

    const total =
      await Job.countDocuments(query)

    const jobs =
      await Job.find(query)
        .populate(
          'company',
          'name logo location industry'
        )
        .populate(
          'recruiter',
          'name email'
        )
        .sort(sort)
        .skip(skip)
        .limit(limitNumber)

    return res.json({
      success: true,
      data: jobs,
      pagination: {
        total,
        page: pageNumber,
        pages: Math.ceil(
          total / limitNumber
        ),
        limit: limitNumber,
      },
    })
  } catch (err) {
    next(err)
  }
}

// =====================================================
// GET SAVED JOBS
// GET /api/jobs/saved
// =====================================================

const getSavedJobs = async (req, res, next) => {
  try {
    const user =
      await User.findById(req.user._id)
        .populate({
          path: 'savedJobs',
          populate: {
            path: 'company',
            select: 'name logo location industry',
          },
        })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      })
    }

    return res.json({
      success: true,
      data: user.savedJobs || [],
    })
  } catch (err) {
    next(err)
  }
}

// =====================================================
// GET RECOMMENDED JOBS
// GET /api/jobs/recommended
// =====================================================

const getRecommendedJobs = async (
  req,
  res,
  next
) => {
  try {
    const user =
      await User.findById(req.user._id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      })
    }

    const query = {
      status: 'active',
    }

    if (
      Array.isArray(user.skills) &&
      user.skills.length > 0
    ) {
      query.skills = {
        $in: user.skills.map(
          (skill) =>
            new RegExp(skill, 'i')
        ),
      }
    }

    const jobs =
      await Job.find(query)
        .populate(
          'company',
          'name logo location industry'
        )
        .sort('-createdAt')
        .limit(6)

    return res.json({
      success: true,
      data: jobs,
    })
  } catch (err) {
    next(err)
  }
}

// =====================================================
// GET SINGLE JOB
// GET /api/jobs/:id
// =====================================================

const getJobById = async (
  req,
  res,
  next
) => {
  try {
    const job =
      await Job.findById(req.params.id)
        .populate(
          'company',
          'name logo location industry website description companySize'
        )
        .populate(
          'recruiter',
          'name email'
        )

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      })
    }

    return res.json({
      success: true,
      data: job,
    })
  } catch (err) {
    next(err)
  }
}

// =====================================================
// CREATE JOB
// POST /api/jobs
// =====================================================

const createJob = async (
  req,
  res,
  next
) => {
  try {
    const company =
      await Company.findOne({
        recruiter: req.user._id,
      })

    if (!company) {
      return res.status(400).json({
        success: false,
        message:
          'Create a company profile before posting jobs',
      })
    }

    const job =
      await Job.create({
        ...req.body,
        recruiter: req.user._id,
        company: company._id,
      })

    await job.populate(
      'company',
      'name logo location industry'
    )

    return res.status(201).json({
      success: true,
      data: job,
    })
  } catch (err) {
    next(err)
  }
}

// =====================================================
// UPDATE JOB
// PUT /api/jobs/:id
// =====================================================

const updateJob = async (
  req,
  res,
  next
) => {
  try {
    let job =
      await Job.findById(req.params.id)

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      })
    }

    const isOwner =
      job.recruiter &&
      job.recruiter.toString() ===
        req.user._id.toString()

    const isAdmin =
      req.user.role === 'admin'

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message:
          'Not authorized to update this job',
      })
    }

    job =
      await Job.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      )
        .populate(
          'company',
          'name logo location industry'
        )
        .populate(
          'recruiter',
          'name email'
        )

    return res.json({
      success: true,
      data: job,
    })
  } catch (err) {
    next(err)
  }
}

// =====================================================
// DELETE JOB
// DELETE /api/jobs/:id
// =====================================================

const deleteJob = async (
  req,
  res,
  next
) => {
  try {
    const job =
      await Job.findById(req.params.id)

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      })
    }

    const isOwner =
      job.recruiter &&
      job.recruiter.toString() ===
        req.user._id.toString()

    const isAdmin =
      req.user.role === 'admin'

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message:
          'Not authorized to delete this job',
      })
    }

    await job.deleteOne()

    // Remove deleted job from
    // every user's saved jobs
    await User.updateMany(
      {},
      {
        $pull: {
          savedJobs: job._id,
        },
      }
    )

    return res.json({
      success: true,
      message:
        'Job deleted successfully',
    })
  } catch (err) {
    next(err)
  }
}

// =====================================================
// SAVE JOB
// POST /api/jobs/:id/save
// =====================================================

const saveJob = async (
  req,
  res,
  next
) => {
  try {
    const user =
      await User.findById(req.user._id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      })
    }

    const job =
      await Job.findById(req.params.id)

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      })
    }

    // Make sure savedJobs exists
    if (!Array.isArray(user.savedJobs)) {
      user.savedJobs = []
    }

    // Check whether this job is already saved
    const alreadySaved =
      user.savedJobs.some(
        (savedJobId) =>
          savedJobId.toString() ===
          job._id.toString()
      )

    if (alreadySaved) {
      return res.status(409).json({
        success: false,
        message: 'Job already saved',
      })
    }

    // Add job to saved jobs
    user.savedJobs.push(job._id)

    await user.save()

    return res.status(200).json({
      success: true,
      message:
        'Job saved successfully',
      data: {
        savedJobs:
          user.savedJobs,
        savedJobsCount:
          user.savedJobs.length,
      },
    })
  } catch (err) {
    next(err)
  }
}

// =====================================================
// UNSAVE JOB
// DELETE /api/jobs/:id/save
// =====================================================

const unsaveJob = async (
  req,
  res,
  next
) => {
  try {
    const user =
      await User.findById(req.user._id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      })
    }

    if (!Array.isArray(user.savedJobs)) {
      user.savedJobs = []
    }

    const jobId =
      req.params.id.toString()

    user.savedJobs =
      user.savedJobs.filter(
        (savedJobId) =>
          savedJobId.toString() !== jobId
      )

    await user.save()

    return res.json({
      success: true,
      message:
        'Job removed from saved',
      data: {
        savedJobs:
          user.savedJobs,
        savedJobsCount:
          user.savedJobs.length,
      },
    })
  } catch (err) {
    next(err)
  }
}

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  saveJob,
  unsaveJob,
  getSavedJobs,
  getRecommendedJobs,
}