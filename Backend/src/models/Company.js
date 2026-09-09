const mongoose = require('mongoose')

const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Company name is required'], trim: true },
    logo: { type: String, default: '' },
    description: { type: String, default: '' },
    website: { type: String, default: '' },
    industry: { type: String, default: '' },
    location: { type: String, default: '' },
    companySize: { type: String, default: '' },
    foundedYear: { type: Number },
    recruiter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
)

companySchema.virtual('jobs', {
  ref: 'Job',
  localField: '_id',
  foreignField: 'company',
})

companySchema.index({ name: 1 })
companySchema.index({ industry: 1 })

module.exports = mongoose.model('Company', companySchema)
