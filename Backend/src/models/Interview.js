const mongoose = require('mongoose')

const interviewSchema = new mongoose.Schema(
  {
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },

    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
      default: null,
    },

    date: {
      type: Date,
      required: true,
    },

    interviewType: {
      type: String,
      enum: [
        'Google Meet',
        'Zoom',
        'Microsoft Teams',
        'Phone',
        'In-person',
      ],
      default: 'Google Meet',
    },

    meetingLink: {
      type: String,
      default: '',
      trim: true,
    },

    notes: {
      type: String,
      default: '',
      trim: true,
    },

    status: {
      type: String,
      enum: [
        'scheduled',
        'completed',
        'cancelled',
        'rescheduled',
      ],
      default: 'scheduled',
    },

    completedAt: {
      type: Date,
      default: null,
    },

    cancelledAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
)

interviewSchema.index({
  candidate: 1,
  date: 1,
})

interviewSchema.index({
  recruiter: 1,
  date: 1,
})

interviewSchema.index({
  job: 1,
  date: 1,
})

module.exports = mongoose.model(
  'Interview',
  interviewSchema
)