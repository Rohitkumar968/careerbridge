import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MapPin, Globe, Users, Briefcase, Star } from 'lucide-react'
import { Button, Badge, Card } from '../../components/common'
import { JobCard } from '../../components/jobs'
import { mockCompanies, mockJobs } from '../../data/mockData'

export const CompanyDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const company = mockCompanies.find(c => c.id === parseInt(id))
  const companyJobs = mockJobs.filter(j => j.company === company?.name)

  if (!company) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <p className="text-gray-600 dark:text-gray-400">Company not found</p>
          <Button onClick={() => navigate('/companies')} className="mt-4">
            Back to Companies
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/companies')}
          className="text-primary-600 hover:text-primary-700 mb-6 flex items-center gap-1"
        >
          ← Back to Companies
        </button>

        {/* Header */}
        <Card className="mb-8">
          <div className="flex items-start gap-6 mb-6">
            <img
              src={company.logo}
              alt={company.name}
              className="w-24 h-24 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {company.name}
              </h1>
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  {company.rating}
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  ({company.reviews} reviews)
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="primary">{company.industry}</Badge>
                <Badge variant="gray">{company.size} employees</Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Location
              </p>
              <p className="font-semibold text-gray-900 dark:text-white mt-1">
                {company.location}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Website
              </p>
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary-600 hover:text-primary-700 mt-1"
              >
                Visit Website
              </a>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Active Jobs
              </p>
              <p className="font-semibold text-gray-900 dark:text-white mt-1">
                {companyJobs.length}
              </p>
            </div>
          </div>
        </Card>

        {/* About */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            About
          </h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            {company.description}
          </p>
        </Card>

        {/* Open Positions */}
        {companyJobs.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Open Positions ({companyJobs.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {companyJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CompanyDetailsPage
