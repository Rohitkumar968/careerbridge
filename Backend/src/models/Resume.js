const mongoose = require('mongoose')

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },

    originalName: {
      type: String,
      required: true,
    },

    fileName: {
      type: String,
      required: true,
    },

    filePath: {
      type: String,
      required: true,
    },

    mimeType: {
      type: String,
      required: true,
    },

    size: {
      type: Number,
      required: true,
    },

    // ATS compatibility score
    atsScore: {
      type: Number,
      default: 0,
    },
    

    // Resume formatting / readability score
    formattingScore: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ['uploaded', 'analyzing', 'analyzed'],
      default: 'uploaded',
    },

    skills: {
      type: [String],
      default: [],
    },

    strengths: {
      type: [String],
      default: [],
    },

    recommendations: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Resume', resumeSchema)