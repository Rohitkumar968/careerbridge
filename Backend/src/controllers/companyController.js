const Company = require('../models/Company')
const Job = require('../models/Job')

// GET /api/companies
const getCompanies = async (req, res, next) => {
  try {
    const { keyword, industry, location, page = 1, limit = 10 } = req.query
    const query = {}
    if (keyword) query.name = { $regex: keyword, $options: 'i' }
    if (industry) query.industry = { $regex: industry, $options: 'i' }
    if (location) query.location = { $regex: location, $options: 'i' }

    const skip = (Number(page) - 1) * Number(limit)
    const total = await Company.countDocuments(query)
    const companies = await Company.find(query)
      .populate('recruiter', 'name email')
      .sort('-createdAt')
      .skip(skip)
      .limit(Number(limit))

    // Attach active job counts
    const companiesWithJobs = await Promise.all(
      companies.map(async (c) => {
        const activeJobs = await Job.countDocuments({ company: c._id, status: 'active' })
        return { ...c.toObject(), activeJobs }
      })
    )

    res.json({
      success: true,
      data: companiesWithJobs,
      pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) },
    })
  } catch (err) {
    next(err)
  }
}

// GET /api/companies/:id
const getCompanyById = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id).populate('recruiter', 'name email')
    if (!company) return res.status(404).json({ success: false, message: 'Company not found' })

    const jobs = await Job.find({ company: company._id, status: 'active' })
      .select('title location employmentType salaryMin salaryMax skills createdAt')
      .sort('-createdAt')

    res.json({ success: true, data: { ...company.toObject(), jobs } })
  } catch (err) {
    next(err)
  }
}

// POST /api/companies
const createCompany = async (req, res, next) => {
  try {
    const existing = await Company.findOne({ recruiter: req.user._id })
    if (existing) {
      return res.status(409).json({ success: false, message: 'You already have a company profile' })
    }
    const company = await Company.create({ ...req.body, recruiter: req.user._id })
    res.status(201).json({ success: true, data: company })
  } catch (err) {
    next(err)
  }
}

// PUT /api/companies/:id
const updateCompany = async (req, res, next) => {
  try {
    let company = await Company.findById(req.params.id)
    if (!company) return res.status(404).json({ success: false, message: 'Company not found' })

    if (company.recruiter.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' })
    }

    company = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    res.json({ success: true, data: company })
  } catch (err) {
    next(err)
  }
}

// DELETE /api/companies/:id
const deleteCompany = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id)
    if (!company) return res.status(404).json({ success: false, message: 'Company not found' })

    if (company.recruiter.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' })
    }

    await company.deleteOne()
    res.json({ success: true, message: 'Company deleted' })
  } catch (err) {
    next(err)
  }
}

module.exports = { getCompanies, getCompanyById, createCompany, updateCompany, deleteCompany }
