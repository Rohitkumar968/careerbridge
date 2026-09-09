const express = require('express')
const router = express.Router()
const { getCompanies, getCompanyById, createCompany, updateCompany, deleteCompany } = require('../controllers/companyController')
const { protect, authorize } = require('../middleware/authMiddleware')

router.get('/', getCompanies)
router.get('/:id', getCompanyById)
router.post('/', protect, authorize('recruiter', 'admin'), createCompany)
router.put('/:id', protect, authorize('recruiter', 'admin'), updateCompany)
router.delete('/:id', protect, authorize('recruiter', 'admin'), deleteCompany)

module.exports = router
