import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  MapPin,
  Globe,
  Briefcase,
  Star,
  ArrowLeft,
  Users,
  Loader2,
} from 'lucide-react'
import axios from 'axios'

import { Button, Badge, Card } from '../../components/common'
import { JobCard } from '../../components/jobs'

const API_URL =
  import.meta.env.VITE_API_URL ||
  'https://careerbridge-r5yo.onrender.com/api'

const CompanyDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [company, setCompany] = useState(null)
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // =====================================================
  // LOAD COMPANY FROM BACKEND
  // =====================================================

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        setLoading(true)
        setError('')

        if (!id) {
          setError('Company ID is missing.')
          return
        }

        console.log(
          'Loading company:',
          id
        )

        const response = await axios.get(
          `${API_URL}/companies/${id}`
        )

        console.log(
          'Company API response:',
          response.data
        )

        if (!response.data?.success) {
          throw new Error(
            response.data?.message ||
              'Company not found'
          )
        }

        const companyData =
          response.data.data

        if (!companyData) {
          throw new Error(
            'Company data not found'
          )
        }

        setCompany(companyData)

        // Backend may return jobs in different fields
        const companyJobs =
          companyData.jobs ||
          companyData.activeJobsList ||
          companyData.activeJobsData ||
          []

        setJobs(
          Array.isArray(companyJobs)
            ? companyJobs
            : []
        )
      } catch (err) {
        console.error(
          'Company details error:',
          err
        )

        const message =
          err.response?.data?.message ||
          err.message ||
          'Unable to load company.'

        setError(message)
      } finally {
        setLoading(false)
      }
    }

    fetchCompany()
  }, [id])

  // =====================================================
  // LOCAL FALLBACK LOGO
  // =====================================================

  const createFallbackLogo = (
    name = 'Company'
  ) => {
    const letter =
      name
        .trim()
        .charAt(0)
        .toUpperCase() || 'C'

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg"
           width="200"
           height="200"
           viewBox="0 0 200 200">

        <rect
          width="200"
          height="200"
          rx="40"
          fill="#6366f1"
        />

        <text
          x="100"
          y="108"
          text-anchor="middle"
          dominant-baseline="middle"
          font-family="Arial, sans-serif"
          font-size="90"
          font-weight="700"
          fill="white"
        >
          ${letter}
        </text>

      </svg>
    `

    return (
      'data:image/svg+xml;charset=UTF-8,' +
      encodeURIComponent(svg)
    )
  }

  // =====================================================
  // LOGO URL
  // =====================================================

  const getLogoUrl = () => {
    if (!company) {
      return createFallbackLogo()
    }

    const logo =
      company.logo ||
      company.logoUrl ||
      company.image ||
      company.imageUrl ||
      ''

    if (!logo) {
      return createFallbackLogo(
        company.name
      )
    }

    if (
      logo.startsWith('http://') ||
      logo.startsWith('https://') ||
      logo.startsWith('data:image/')
    ) {
      return logo
    }

    const backendUrl =
      API_URL.replace(/\/api\/?$/, '')

    if (logo.startsWith('/')) {
      return `${backendUrl}${logo}`
    }

    return `${backendUrl}/${logo}`
  }

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">

        <div className="flex flex-col items-center gap-4">

          <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />

          <p className="text-gray-600 dark:text-gray-400">
            Loading company...
          </p>

        </div>

      </div>
    )
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error || !company) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">

        <Card className="w-full max-w-md text-center p-8">

          <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">

            <Briefcase className="w-8 h-8 text-gray-400" />

          </div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Company not found
          </h1>

          <p className="text-gray-600 dark:text-gray-400 mb-3">
            {error ||
              'The company you are looking for does not exist.'}
          </p>

          <p className="text-xs text-gray-400 mb-6 break-all">
            ID: {id}
          </p>

          <Button
            onClick={() =>
              navigate('/companies')
            }
            className="inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Companies
          </Button>

        </Card>

      </div>
    )
  }

  // =====================================================
  // COMPANY VALUES
  // =====================================================

  const companyName =
    company.name ||
    company.companyName ||
    'Company'

  const companyLogo =
    getLogoUrl()

  const companyLocation =
    company.location ||
    company.address ||
    'Location not specified'

  const companyIndustry =
    company.industry ||
    'Technology'

  const companySize =
    company.size ||
    company.employees ||
    company.employeeCount ||
    'Not specified'

  const companyRating =
    company.rating ??
    company.ratings ??
    null

  const companyReviews =
    company.reviews ??
    company.reviewCount ??
    null

  const companyDescription =
    company.description ||
    'This company is building modern products and providing professional career opportunities.'

  // =====================================================
  // WEBSITE
  // =====================================================

  let websiteUrl = null

  if (company.website) {
    let website =
      String(company.website)
        .replace(/\[|\]/g, '')
        .trim()

    const markdownMatch =
      website.match(
        /\((https?:\/\/[^)]+)\)/
      )

    if (markdownMatch) {
      website =
        markdownMatch[1]
    }

    if (website) {
      websiteUrl =
        website.startsWith('http')
          ? website
          : `https://${website}`
    }
  }

  // =====================================================
  // LOGO ERROR
  // =====================================================

  const handleLogoError = (
    event
  ) => {
    event.currentTarget.src =
      createFallbackLogo(companyName)
  }

  // =====================================================
  // JOBS
  // =====================================================

  const companyJobs =
    Array.isArray(jobs)
      ? jobs
      : []

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-8 pb-20">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* =================================================
            BACK
        ================================================= */}

        <button
          type="button"
          onClick={() =>
            navigate('/companies')
          }
          className="mb-6 inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />

          Back to Companies
        </button>

        {/* =================================================
            COMPANY HEADER
        ================================================= */}

        <Card className="mb-8">

          <div className="p-6 md:p-8">

            <div className="flex flex-col md:flex-row gap-6">

              {/* =================================================
                  COMPANY LOGO
              ================================================= */}

              <div className="flex-shrink-0">

                <div className="w-28 h-28 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white">

                  <img
                    src={companyLogo}
                    alt={`${companyName} logo`}
                    onError={
                      handleLogoError
                    }
                    className="w-full h-full object-cover"
                  />

                </div>

              </div>

              {/* =================================================
                  COMPANY INFO
              ================================================= */}

              <div className="flex-1">

                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                  {companyName}
                </h1>

                {/* Rating */}

                {companyRating !==
                  null && (
                  <div className="flex items-center gap-2 mb-4">

                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />

                    <span className="font-semibold text-gray-900 dark:text-white">
                      {companyRating}
                    </span>

                    {companyReviews !==
                      null && (
                      <span className="text-gray-600 dark:text-gray-400">
                        ({companyReviews}{' '}
                        reviews)
                      </span>
                    )}

                  </div>
                )}

                {/* Badges */}

                <div className="flex flex-wrap gap-2">

                  <Badge variant="primary">
                    {companyIndustry}
                  </Badge>

                  <Badge variant="gray">

                    <span className="inline-flex items-center gap-1">

                      <Users className="w-3 h-3" />

                      {companySize}{' '}
                      employees

                    </span>

                  </Badge>

                </div>

              </div>

            </div>

            {/* =================================================
                COMPANY STATS
            ================================================= */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">

              {/* Location */}

              <div>

                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 mb-1">

                  <MapPin className="w-4 h-4" />

                  Location

                </p>

                <p className="font-semibold text-gray-900 dark:text-white">

                  {companyLocation}

                </p>

              </div>

              {/* Website */}

              <div>

                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 mb-1">

                  <Globe className="w-4 h-4" />

                  Website

                </p>

                {websiteUrl ? (
                  <a
                    href={websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400"
                  >
                    Visit Website
                  </a>
                ) : (
                  <span className="text-gray-500">
                    Not available
                  </span>
                )}

              </div>

              {/* Jobs */}

              <div>

                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 mb-1">

                  <Briefcase className="w-4 h-4" />

                  Active Jobs

                </p>

                <p className="font-semibold text-gray-900 dark:text-white">

                  {company.activeJobs ??
                    companyJobs.length}

                </p>

              </div>

            </div>

          </div>

        </Card>

        {/* =================================================
            ABOUT
        ================================================= */}

        <Card className="mb-8">

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">

            About {companyName}

          </h2>

          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">

            {companyDescription}

          </p>

        </Card>

        {/* =================================================
            OPEN POSITIONS
        ================================================= */}

        {companyJobs.length > 0 ? (
          <section>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">

              Open Positions (
              {companyJobs.length}
              )

            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {companyJobs.map(
                (job) => (
                  <JobCard
                    key={
                      job._id ||
                      job.id
                    }
                    job={job}
                  />
                )
              )}

            </div>

          </section>
        ) : (
          <Card className="text-center py-10">

            <Briefcase className="w-10 h-10 mx-auto mb-3 text-gray-400" />

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">

              No open positions

            </h3>

            <p className="text-gray-600 dark:text-gray-400">

              There are currently no
              open jobs at{' '}

              {companyName}.

            </p>

          </Card>
        )}

      </div>

    </div>
  )
}

export { CompanyDetailsPage }

export default CompanyDetailsPage