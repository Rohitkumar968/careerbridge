const mongoose = require('mongoose')

const interviewSchema = new mongoose.Schema(
  {
    application: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', required: true },
    candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    recruiter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, default: '' },
    meetingLink: { type: String, default: '' },
    notes: { type: String, default: '' },
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled'],
      default: 'scheduled',
    },
  },
  { timestamps: true }
)

interviewSchema.index({ candidate: 1 })
interviewSchema.index({ recruiter: 1 })
interviewSchema.index({ date: 1 })

module.exports = mongoose.model('Interview', interviewSchema)
