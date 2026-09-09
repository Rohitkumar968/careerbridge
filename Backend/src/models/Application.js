const mongoose = require('mongoose')

const applicationSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    applicant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    resume: { type: String, default: '' },
    coverLetter: { type: String, default: '' },
    status: {
      type: String,
      enum: ['applied', 'reviewing', 'shortlisted', 'interview', 'rejected', 'hired'],
      default: 'applied',
    },
  },
  { timestamps: true }
)

// Prevent duplicate applications
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true })
applicationSchema.index({ applicant: 1 })
applicationSchema.index({ job: 1 })

module.exports = mongoose.model('Application', applicationSchema)
