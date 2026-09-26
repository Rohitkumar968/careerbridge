const Application = require('../models/Application')
const Job = require('../models/Job')

// =====================================================
// APPLY FOR JOB
// =====================================================

const applyForJob = async (req, res, next) => {
  try {
    const { jobId } = req.params
    const { resume, coverLetter } = req.body

    const job = await Job.findById(jobId)

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      })
    }

    if (job.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'This job is no longer accepting applications',
      })
    }

    const existingApplication =
      await Application.findOne({
        job: jobId,
        applicant: req.user._id,
      })

    if (existingApplication) {
      return res.status(409).json({
        success: false,
        message: 'You have already applied for this job',
        data: existingApplication,
      })
    }

    const application = await Application.create({
      job: jobId,
      applicant: req.user._id,
      resume: resume || '',
      coverLetter: coverLetter || '',
      status: 'applied',
    })

    job.applicantsCount =
      (job.applicantsCount || 0) + 1

    await job.save()

    const populatedApplication =
      await Application.findById(application._id)
        .populate(
          'job',
          'title location employmentType workMode salaryMin salaryMax'
        )
        .populate(
          'applicant',
          'firstName lastName name email'
        )

    return res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: populatedApplication,
    })
  } catch (err) {
    console.error('Apply for job error:', err)
    next(err)
  }
}

// =====================================================
// GET APPLICATIONS
// Recruiter/Admin
// =====================================================

const getApplications = async (req, res, next) => {
  try {
    const {
      status,
      job,
      page = 1,
      limit = 50,
    } = req.query

    const filter = {}

    if (status) {
      filter.status = status
    }

    if (job) {
      filter.job = job
    }

    // Seeker gets only own applications
    if (
      req.user.role === 'seeker' ||
      req.user.role === 'job_seeker'
    ) {
      filter.applicant = req.user._id
    }

    // Recruiter gets applications for their jobs
    if (req.user.role === 'recruiter') {
      const recruiterJobs = await Job.find({
        recruiter: req.user._id,
      }).select('_id')

      filter.job = {
        $in: recruiterJobs.map(
          (item) => item._id
        ),
      }

      if (job) {
        filter.job = job
      }
    }

    const skip =
      (Number(page) - 1) * Number(limit)

    const [applications, total] =
      await Promise.all([
        Application.find(filter)
          .populate(
            'job',
            'title location employmentType workMode salaryMin salaryMax company'
          )
          .populate(
            'applicant',
            'firstName lastName name email profilePicture skills'
          )
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(Number(limit)),

        Application.countDocuments(filter),
      ])

    return res.json({
      success: true,
      count: applications.length,
      total,
      page: Number(page),
      pages: Math.ceil(
        total / Number(limit)
      ),
      data: applications,
    })
  } catch (err) {
    console.error(
      'Get applications error:',
      err
    )

    next(err)
  }
}

// =====================================================
// GET MY APPLICATIONS
// =====================================================

const getMyApplications = async (
  req,
  res,
  next
) => {
  try {
    const applications =
      await Application.find({
        applicant: req.user._id,
      })
        .populate(
          'job',
          'title location employmentType workMode salaryMin salaryMax company'
        )
        .sort({ createdAt: -1 })

    return res.json({
      success: true,
      count: applications.length,
      data: applications,
    })
  } catch (err) {
    console.error(
      'Get my applications error:',
      err
    )

    next(err)
  }
}

// =====================================================
// GET APPLICATION STATS
// =====================================================

const getApplicationStats = async (
  req,
  res,
  next
) => {
  try {
    const filter = {}

    if (
      req.user.role === 'seeker' ||
      req.user.role === 'job_seeker'
    ) {
      filter.applicant = req.user._id
    }

    if (req.user.role === 'recruiter') {
      const recruiterJobs =
        await Job.find({
          recruiter: req.user._id,
        }).select('_id')

      filter.job = {
        $in: recruiterJobs.map(
          (item) => item._id
        ),
      }
    }

    const [
      total,
      applied,
      reviewing,
      shortlisted,
      interview,
      hired,
      rejected,
    ] = await Promise.all([
      Application.countDocuments(filter),

      Application.countDocuments({
        ...filter,
        status: 'applied',
      }),

      Application.countDocuments({
        ...filter,
        status: 'reviewing',
      }),

      Application.countDocuments({
        ...filter,
        status: 'shortlisted',
      }),

      Application.countDocuments({
        ...filter,
        status: 'interview',
      }),

      Application.countDocuments({
        ...filter,
        status: 'hired',
      }),

      Application.countDocuments({
        ...filter,
        status: 'rejected',
      }),
    ])

    return res.json({
      success: true,
      data: {
        total,
        applied,
        reviewing,
        shortlisted,
        interview,
        hired,
        rejected,
      },
    })
  } catch (err) {
    console.error(
      'Get application stats error:',
      err
    )

    next(err)
  }
}

// =====================================================
// GET APPLICATION BY ID
// =====================================================

const getApplicationById = async (
  req,
  res,
  next
) => {
  try {
    const application =
      await Application.findById(
        req.params.id
      )
        .populate(
          'job',
          'title location employmentType workMode salaryMin salaryMax company recruiter'
        )
        .populate(
          'applicant',
          'firstName lastName name email profilePicture skills'
        )

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      })
    }

    const isOwner =
      application.applicant?._id?.toString() ===
      req.user._id.toString()

    const isAdmin =
      req.user.role === 'admin'

    const isRecruiter =
      application.job?.recruiter?.toString() ===
      req.user._id.toString()

    if (
      !isOwner &&
      !isAdmin &&
      !isRecruiter
    ) {
      return res.status(403).json({
        success: false,
        message:
          'You are not authorized to view this application',
      })
    }

    return res.json({
      success: true,
      data: application,
    })
  } catch (err) {
    console.error(
      'Get application error:',
      err
    )

    next(err)
  }
}

// =====================================================
// UPDATE APPLICATION STATUS
// =====================================================

const updateApplicationStatus = async (
  req,
  res,
  next
) => {
  try {
    const { status } = req.body

    const allowedStatuses = [
      'applied',
      'reviewing',
      'shortlisted',
      'interview',
      'rejected',
      'hired',
    ]

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid application status',
      })
    }

    const application =
      await Application.findById(
        req.params.id
      ).populate('job')

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      })
    }

    const isAdmin =
      req.user.role === 'admin'

    const isRecruiter =
      req.user.role === 'recruiter' &&
      application.job?.recruiter?.toString() ===
        req.user._id.toString()

    if (!isAdmin && !isRecruiter) {
      return res.status(403).json({
        success: false,
        message:
          'You are not authorized to update this application',
      })
    }

    application.status = status

    await application.save()

    return res.json({
      success: true,
      message:
        'Application status updated successfully',
      data: application,
    })
  } catch (err) {
    console.error(
      'Update application status error:',
      err
    )

    next(err)
  }
}

// =====================================================
// WITHDRAW APPLICATION
// =====================================================

const withdrawApplication = async (
  req,
  res,
  next
) => {
  try {
    const application =
      await Application.findById(
        req.params.id
      )

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      })
    }

    if (
      application.applicant.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          'You are not authorized to withdraw this application',
      })
    }

    if (
      application.status === 'hired'
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Hired applications cannot be withdrawn',
      })
    }

    await Application.findByIdAndDelete(
      req.params.id
    )

    return res.json({
      success: true,
      message:
        'Application withdrawn successfully',
    })
  } catch (err) {
    console.error(
      'Withdraw application error:',
      err
    )

    next(err)
  }
}

// =====================================================
// RESET MY INTERVIEW APPLICATIONS
// =====================================================
// Ye existing stale Interview(1) ko fix karega.
// Sirf current logged-in seeker ke applications ko touch karega.

const resetMyInterviewApplications = async (
  req,
  res,
  next
) => {
  try {
    const result =
      await Application.updateMany(
        {
          applicant: req.user._id,
          status: 'interview',
        },
        {
          $set: {
            status: 'applied',
          },
        }
      )

    return res.json({
      success: true,
      message:
        'Interview applications reset successfully',
      modifiedCount:
        result.modifiedCount,
    })
  } catch (err) {
    console.error(
      'Reset interview applications error:',
      err
    )

    next(err)
  }
}

// =====================================================
// DELETE APPLICATION
// =====================================================

const deleteApplication = async (
  req,
  res,
  next
) => {
  try {
    const application =
      await Application.findById(
        req.params.id
      )

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      })
    }

    const isOwner =
      application.applicant.toString() ===
      req.user._id.toString()

    const isAdmin =
      req.user.role === 'admin'

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message:
          'You are not authorized to delete this application',
      })
    }

    await Application.findByIdAndDelete(
      req.params.id
    )

    return res.json({
      success: true,
      message:
        'Application deleted successfully',
    })
  } catch (err) {
    console.error(
      'Delete application error:',
      err
    )

    next(err)
  }
}

module.exports = {
  applyForJob,
  getApplications,
  getMyApplications,
  getApplicationStats,
  getApplicationById,
  updateApplicationStatus,
  withdrawApplication,
  resetMyInterviewApplications,
  deleteApplication,
}