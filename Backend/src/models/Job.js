const mongoose = require('mongoose')

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Job title is required'], trim: true },
    description: { type: String, required: [true, 'Description is required'] },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    recruiter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    location: { type: String, required: [true, 'Location is required'] },
    employmentType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'],
      default: 'Full-time',
    },
    workMode: { type: String, enum: ['On-site', 'Remote', 'Hybrid'], default: 'On-site' },
    experienceLevel: {
      type: String,
      enum: ['Entry', 'Mid', 'Senior', 'Lead', 'Manager'],
      default: 'Mid',
    },
    salaryMin: { type: Number, default: 0 },
    salaryMax: { type: Number, default: 0 },
    skills: [{ type: String }],
    category: { type: String, default: 'Technology' },
    deadline: { type: Date },
    status: { type: String, enum: ['active', 'closed', 'draft'], default: 'active' },
    applicantsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
)

jobSchema.index({ title: 'text', description: 'text' })
jobSchema.index({ location: 1 })
jobSchema.index({ category: 1 })
jobSchema.index({ status: 1 })
jobSchema.index({ createdAt: -1 })

module.exports = mongoose.model('Job', jobSchema)
