const Interview = require('../models/Interview')
const Application = require('../models/Application')
const Job = require('../models/Job')

// =====================================================
// CREATE INTERVIEW
// =====================================================

const createInterview = async (req, res, next) => {
  try {
    const {
      candidate,
      recruiter,
      job,
      application,
      date,
      interviewType,
      meetingLink,
      notes,
    } = req.body

    // -------------------------------------------------
    // REQUIRED FIELDS
    // -------------------------------------------------

    if (!candidate) {
      return res.status(400).json({
        success: false,
        message: 'Candidate is required',
      })
    }

    if (!job) {
      return res.status(400).json({
        success: false,
        message: 'Job is required',
      })
    }

    if (!application) {
      return res.status(400).json({
        success: false,
        message: 'Application is required',
      })
    }

    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Interview date is required',
      })
    }

    // -------------------------------------------------
    // DATE VALIDATION
    // -------------------------------------------------

    const interviewDate = new Date(date)

    if (Number.isNaN(interviewDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid interview date',
      })
    }

    if (interviewDate <= new Date()) {
      return res.status(400).json({
        success: false,
        message:
          'Interview date and time must be in the future',
      })
    }

    // -------------------------------------------------
    // FIND APPLICATION
    // -------------------------------------------------

    const existingApplication =
      await Application.findById(application)

    if (!existingApplication) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      })
    }

    // -------------------------------------------------
    // FIND JOB
    // -------------------------------------------------

    const existingJob = await Job.findById(job)

    if (!existingJob) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      })
    }

    // -------------------------------------------------
    // RECRUITER OWNERSHIP
    // -------------------------------------------------

    if (
      req.user.role !== 'admin' &&
      existingJob.recruiter?.toString() !==
        req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          'You are not authorized to schedule an interview for this job',
      })
    }

    // -------------------------------------------------
    // CHECK APPLICATION BELONGS TO JOB
    // -------------------------------------------------

    if (
      existingApplication.job?.toString() !==
      existingJob._id.toString()
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Application does not belong to this job',
      })
    }

    // -------------------------------------------------
    // CHECK CANDIDATE
    // -------------------------------------------------

    if (
      existingApplication.applicant?.toString() !==
      candidate.toString()
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Candidate does not belong to this application',
      })
    }

    // -------------------------------------------------
    // CHECK EXISTING INTERVIEW
    // -------------------------------------------------

    const existingInterview =
      await Interview.findOne({
        application,
        status: {
          $in: ['scheduled', 'rescheduled'],
        },
      })

    if (existingInterview) {
      return res.status(409).json({
        success: false,
        message:
          'An active interview already exists for this application',
      })
    }

    // -------------------------------------------------
    // ONLINE INTERVIEW LINK
    // -------------------------------------------------

    const onlineInterviewTypes = [
      'Google Meet',
      'Zoom',
      'Microsoft Teams',
    ]

    if (
      onlineInterviewTypes.includes(
        interviewType
      ) &&
      !meetingLink
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Meeting link is required for online interviews',
      })
    }

    // -------------------------------------------------
    // CREATE INTERVIEW
    // -------------------------------------------------

    const interview = await Interview.create({
      candidate,
      recruiter: req.user._id,
      job,
      application,
      date: interviewDate,
      interviewType:
        interviewType || 'Google Meet',
      meetingLink: meetingLink || '',
      notes: notes || '',
      status: 'scheduled',
    })

    // -------------------------------------------------
    // UPDATE APPLICATION STATUS
    // -------------------------------------------------

    existingApplication.status = 'interview'
    await existingApplication.save()

    // -------------------------------------------------
    // RESPONSE
    // -------------------------------------------------

    const populatedInterview =
      await Interview.findById(interview._id)
        .populate(
          'candidate',
          'name email phone profileImage'
        )
        .populate(
          'recruiter',
          'name email'
        )
        .populate(
          'job',
          'title location employmentType'
        )
        .populate(
          'application',
          'status resume coverLetter'
        )

    return res.status(201).json({
      success: true,
      message:
        'Interview scheduled successfully',
      data: populatedInterview,
    })
  } catch (err) {
    next(err)
  }
}

// =====================================================
// GET RECRUITER INTERVIEWS
// =====================================================

const getRecruiterInterviews = async (
  req,
  res,
  next
) => {
  try {
    const interviews =
      await Interview.find({
        recruiter: req.user._id,
      })
        .populate(
          'candidate',
          'name email phone profileImage'
        )
        .populate(
          'job',
          'title location employmentType'
        )
        .populate(
          'application',
          'status resume coverLetter'
        )
        .sort({ date: 1 })

    return res.json({
      success: true,
      data: interviews,
    })
  } catch (err) {
    next(err)
  }
}

// =====================================================
// GET MY INTERVIEWS - SEEKER
// =====================================================

const getMyInterviews = async (
  req,
  res,
  next
) => {
  try {
    const interviews =
      await Interview.find({
        candidate: req.user._id,
      })
        .populate(
          'candidate',
          'name email phone profileImage'
        )
        .populate(
          'recruiter',
          'name email'
        )
        .populate(
          'job',
          'title location employmentType company'
        )
        .populate(
          'application',
          'status resume coverLetter'
        )
        .sort({ date: 1 })

    return res.json({
      success: true,
      data: interviews,
    })
  } catch (err) {
    next(err)
  }
}

// =====================================================
// GET INTERVIEW BY ID
// =====================================================

const getInterviewById = async (
  req,
  res,
  next
) => {
  try {
    const interview =
      await Interview.findById(req.params.id)
        .populate(
          'candidate',
          'name email phone profileImage'
        )
        .populate(
          'recruiter',
          'name email'
        )
        .populate(
          'job',
          'title location employmentType company'
        )
        .populate(
          'application',
          'status resume coverLetter'
        )

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found',
      })
    }

    // -------------------------------------------------
    // AUTHORIZATION
    // -------------------------------------------------

    const isRecruiter =
      interview.recruiter?._id?.toString() ===
      req.user._id.toString()

    const isCandidate =
      interview.candidate?._id?.toString() ===
      req.user._id.toString()

    const isAdmin =
      req.user.role === 'admin'

    if (
      !isRecruiter &&
      !isCandidate &&
      !isAdmin
    ) {
      return res.status(403).json({
        success: false,
        message:
          'You are not authorized to view this interview',
      })
    }

    return res.json({
      success: true,
      data: interview,
    })
  } catch (err) {
    next(err)
  }
}

// =====================================================
// CANCEL INTERVIEW
// =====================================================

const cancelInterview = async (
  req,
  res,
  next
) => {
  try {
    const interview =
      await Interview.findById(
        req.params.id
      )

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found',
      })
    }

    // -------------------------------------------------
    // RECRUITER AUTHORIZATION
    // -------------------------------------------------

    if (
      req.user.role !== 'admin' &&
      interview.recruiter.toString() !==
        req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          'You are not authorized to cancel this interview',
      })
    }

    // -------------------------------------------------
    // ALREADY CANCELLED
    // -------------------------------------------------

    if (
      interview.status === 'cancelled'
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Interview is already cancelled',
      })
    }

    // -------------------------------------------------
    // UPDATE INTERVIEW
    // -------------------------------------------------

    interview.status = 'cancelled'
    interview.cancelledAt = new Date()

    await interview.save()

    // -------------------------------------------------
    // RESET APPLICATION
    // -------------------------------------------------

    if (interview.application) {
      await Application.findByIdAndUpdate(
        interview.application,
        {
          status: 'applied',
        }
      )
    }

    return res.json({
      success: true,
      message:
        'Interview cancelled successfully',
      data: interview,
    })
  } catch (err) {
    next(err)
  }
}

// =====================================================
// COMPLETE INTERVIEW
// =====================================================

const completeInterview = async (
  req,
  res,
  next
) => {
  try {
    const interview =
      await Interview.findById(
        req.params.id
      )

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found',
      })
    }

    // -------------------------------------------------
    // RECRUITER AUTHORIZATION
    // -------------------------------------------------

    if (
      req.user.role !== 'admin' &&
      interview.recruiter.toString() !==
        req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          'You are not authorized to complete this interview',
      })
    }

    // -------------------------------------------------
    // CHECK STATUS
    // -------------------------------------------------

    if (
      interview.status === 'cancelled'
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Cancelled interview cannot be completed',
      })
    }

    if (
      interview.status === 'completed'
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Interview is already completed',
      })
    }

    // -------------------------------------------------
    // UPDATE
    // -------------------------------------------------

    interview.status = 'completed'
    interview.completedAt = new Date()

    await interview.save()

    // -------------------------------------------------
    // KEEP APPLICATION AS INTERVIEW
    // Recruiter can now shortlist/reject/hire
    // -------------------------------------------------

    if (interview.application) {
      await Application.findByIdAndUpdate(
        interview.application,
        {
          status: 'interview',
        }
      )
    }

    return res.json({
      success: true,
      message:
        'Interview completed successfully',
      data: interview,
    })
  } catch (err) {
    next(err)
  }
}

// =====================================================
// DELETE INTERVIEW
// =====================================================

const deleteInterview = async (
  req,
  res,
  next
) => {
  try {
    const interview =
      await Interview.findById(
        req.params.id
      )

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found',
      })
    }

    // -------------------------------------------------
    // RECRUITER AUTHORIZATION
    // -------------------------------------------------

    if (
      req.user.role !== 'admin' &&
      interview.recruiter.toString() !==
        req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          'You are not authorized to delete this interview',
      })
    }

    // -------------------------------------------------
    // DELETE
    // -------------------------------------------------

    const applicationId =
      interview.application

    await Interview.findByIdAndDelete(
      req.params.id
    )

    // -------------------------------------------------
    // RESET APPLICATION
    // -------------------------------------------------

    if (applicationId) {
      await Application.findByIdAndUpdate(
        applicationId,
        {
          status: 'applied',
        }
      )
    }

    return res.json({
      success: true,
      message:
        'Interview deleted successfully',
    })
  } catch (err) {
    next(err)
  }
}

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  createInterview,
  getRecruiterInterviews,
  getMyInterviews,
  getInterviewById,
  cancelInterview,
  completeInterview,
  deleteInterview,
}