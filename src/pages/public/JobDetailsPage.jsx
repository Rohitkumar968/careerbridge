import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
  MapPin,
  Briefcase,
  DollarSign,
  Calendar,
  Users,
  Building2,
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  Share2,
  Send,
  CheckCircle,
  Loader2,
} from 'lucide-react'
import { Card, Button, Badge } from '../../components/common'

const API_URL = '/api'

const getAuthConfig = () => {
  const token = localStorage.getItem('token')

  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  }
}

const getJobId = (job) => job?._id || job?.id

const getCompanyName = (job) => {
  if (typeof job?.company === 'string') return job.company

  return (
    job?.company?.name ||
    job?.companyName ||
    'Company'
  )
}

const getCompanyLogo = (job) => {
  return (
    job?.company?.logo ||
    job?.companyLogo ||
    job?.logo ||
    ''
  )
}

const fallbackLogo = (companyName) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(
    companyName
  )}&background=6366f1&color=fff&size=128`

const JobDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)

  const [applying, setApplying] = useState(false)
  const [applied, setApplied] = useState(false)

  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const [sharing, setSharing] = useState(false)

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // =====================================================
  // LOAD JOB
  // =====================================================

  useEffect(() => {
    const loadJob = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await axios.get(
          `${API_URL}/jobs/${id}`
        )

        const data =
          response.data?.data ||
          response.data?.job ||
          response.data

        if (!data) {
          throw new Error('Job not found')
        }

        setJob(data)

        // Check saved status
        try {
          const savedResponse = await axios.get(
            `${API_URL}/jobs/saved`,
            getAuthConfig()
          )

          const savedJobs =
            savedResponse.data?.data ||
            savedResponse.data ||
            []

          if (Array.isArray(savedJobs)) {
            const exists = savedJobs.some(
              (item) =>
                String(getJobId(item)) === String(id) ||
                String(item?.job?._id) === String(id) ||
                String(item?.jobId) === String(id)
            )

            setSaved(exists)
          }
        } catch (saveError) {
          // Saved check failure should not stop job page
          console.log(
            'Saved status check failed:',
            saveError.response?.data ||
              saveError.message
          )
        }
      } catch (err) {
        console.error(
          'Load job error:',
          err.response?.data || err.message
        )

        setError(
          err.response?.data?.message ||
            'Unable to load this job.'
        )
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      loadJob()
    }
  }, [id])

  // =====================================================
  // APPLY FOR JOB
  // =====================================================

  const handleApply = async () => {
    if (applying || applied) return

    const token = localStorage.getItem('token')

    if (!token) {
      alert('Please login to apply for this job.')
      navigate('/login')
      return
    }

    try {
      setApplying(true)
      setError('')
      setSuccess('')

      const response = await axios.post(
        `${API_URL}/applications/apply/${id}`,
        {
          resume: '',
          coverLetter: '',
        },
        getAuthConfig()
      )

      console.log(
        'Application response:',
        response.data
      )

      setApplied(true)

      setSuccess(
        'Application submitted successfully! A notification has been created.'
      )
    } catch (err) {
      console.error(
        'Apply job error:',
        err.response?.data || err.message
      )

      const status = err.response?.status

      if (status === 409) {
        setApplied(true)
        setError(
          'You have already applied for this job.'
        )
      } else if (status === 401) {
        setError(
          'Your session has expired. Please login again.'
        )

        localStorage.removeItem('token')
        localStorage.removeItem('user')

        setTimeout(() => {
          navigate('/login')
        }, 1000)
      } else {
        setError(
          err.response?.data?.message ||
            'Failed to submit application.'
        )
      }
    } finally {
      setApplying(false)
    }
  }

  // =====================================================
  // SAVE / UNSAVE JOB
  // =====================================================

  const handleSave = async () => {
    const token = localStorage.getItem('token')

    if (!token) {
      alert('Please login to save this job.')
      navigate('/login')
      return
    }

    if (saving) return

    try {
      setSaving(true)
      setError('')
      setSuccess('')

      if (saved) {
        await axios.delete(
          `${API_URL}/jobs/${id}/save`,
          getAuthConfig()
        )

        setSaved(false)
        setSuccess('Job removed from saved jobs.')
      } else {
        await axios.post(
          `${API_URL}/jobs/${id}/save`,
          {},
          getAuthConfig()
        )

        setSaved(true)
        setSuccess('Job saved successfully.')
      }
    } catch (err) {
      console.error(
        'Save job error:',
        err.response?.data || err.message
      )

      setError(
        err.response?.data?.message ||
          'Unable to update saved job.'
      )
    } finally {
      setSaving(false)
    }
  }

  // =====================================================
  // SHARE JOB
  // =====================================================

  const handleShare = async () => {
    if (sharing) return

    try {
      setSharing(true)

      const shareUrl = window.location.href

      if (navigator.share) {
        await navigator.share({
          title: job?.title || 'Job Opportunity',
          text: `Check out this job: ${
            job?.title || 'Job'
          }`,
          url: shareUrl,
        })
      } else if (
        navigator.clipboard &&
        navigator.clipboard.writeText
      ) {
        await navigator.clipboard.writeText(shareUrl)

        setSuccess(
          'Job link copied to clipboard!'
        )
      } else {
        window.prompt(
          'Copy this job link:',
          shareUrl
        )
      }
    } catch (err) {
      // User cancelling native share is not an error
      if (err?.name !== 'AbortError') {
        console.error('Share error:', err)
        setError('Unable to share this job.')
      }
    } finally {
      setSharing(false)
    }
  }

  // =====================================================
  // IMAGE ERROR
  // =====================================================

  const handleLogoError = (event) => {
    event.currentTarget.src =
      fallbackLogo(getCompanyName(job))
  }

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
          <p className="text-gray-500">
            Loading job...
          </p>
        </div>
      </div>
    )
  }

  // =====================================================
  // ERROR / JOB NOT FOUND
  // =====================================================

  if (!job) {
    return (
      <div className="max-w-3xl mx-auto py-16 px-4 text-center">
        <Card className="p-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Job not found
          </h2>

          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {error || 'This job may no longer exist.'}
          </p>

          <Button onClick={() => navigate('/jobs')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Jobs
          </Button>
        </Card>
      </div>
    )
  }

  // =====================================================
  // JOB DATA
  // =====================================================

  const jobId = getJobId(job)

  const companyName = getCompanyName(job)

  const logo =
    getCompanyLogo(job) ||
    fallbackLogo(companyName)

  const location =
    job?.location ||
    job?.company?.location ||
    'Location not specified'

  const employmentType =
    job?.employmentType ||
    job?.jobType ||
    'Full-time'

  const experience =
    job?.experience ||
    job?.experienceLevel ||
    'Not specified'

  const salaryMin =
    job?.salary?.min ??
    job?.salaryMin ??
    0

  const salaryMax =
    job?.salary?.max ??
    job?.salaryMax ??
    0

  const skills = Array.isArray(job?.skills)
    ? job.skills
    : []

  const description =
    job?.description ||
    'No job description available.'

  const requirements =
    Array.isArray(job?.requirements)
      ? job.requirements
      : []

  const benefits =
    Array.isArray(job?.benefits)
      ? job.benefits
      : []

  const applicantsCount =
    job?.applicantsCount ??
    job?.applicationsCount ??
    0

  const postedDate =
    job?.createdAt
      ? new Date(
          job.createdAt
        ).toLocaleDateString()
      : 'Recently'

  const isActive =
    job?.status === 'active' ||
    !job?.status

  return (
    <div className="max-w-6xl mx-auto space-y-6">

      {/* =================================================
          BACK BUTTON
      ================================================= */}

      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary-600 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {/* =================================================
          SUCCESS MESSAGE
      ================================================= */}

      {success && (
        <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800 p-4">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />

          <p className="text-sm text-green-700 dark:text-green-300">
            {success}
          </p>
        </div>
      )}

      {/* =================================================
          ERROR MESSAGE
      ================================================= */}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 p-4">
          <p className="text-sm text-red-700 dark:text-red-300">
            {error}
          </p>
        </div>
      )}

      {/* =================================================
          HEADER
      ================================================= */}

      <Card className="p-6 md:p-8">

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">

          <div className="flex items-start gap-4">

            <img
              src={logo}
              alt={companyName}
              onError={handleLogoError}
              className="w-16 h-16 rounded-xl object-cover border border-gray-200 dark:border-gray-700 bg-gray-100 flex-shrink-0"
            />

            <div>

              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                {job?.title || 'Untitled Job'}
              </h1>

              <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">
                {companyName}
              </p>

              <div className="flex flex-wrap gap-2 mt-3">

                <Badge variant="gray">
                  {employmentType}
                </Badge>

                {job?.workMode && (
                  <Badge variant="gray">
                    {job.workMode}
                  </Badge>
                )}

                {job?.status && (
                  <Badge
                    variant={
                      job.status === 'active'
                        ? 'success'
                        : 'gray'
                    }
                  >
                    {job.status}
                  </Badge>
                )}

              </div>

            </div>
          </div>

          {/* ACTIONS */}

          <div className="flex gap-2">

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className={`p-3 rounded-lg border transition ${
                saved
                  ? 'border-primary-300 bg-primary-50 text-primary-600'
                  : 'border-gray-300 dark:border-gray-600 text-gray-500 hover:text-primary-600'
              }`}
              title={
                saved
                  ? 'Remove saved job'
                  : 'Save job'
              }
            >
              {saving ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : saved ? (
                <BookmarkCheck className="w-5 h-5" />
              ) : (
                <Bookmark className="w-5 h-5" />
              )}
            </button>

            <button
              type="button"
              onClick={handleShare}
              disabled={sharing}
              className="p-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-500 hover:text-primary-600 transition"
              title="Share job"
            >
              {sharing ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Share2 className="w-5 h-5" />
              )}
            </button>

          </div>

        </div>

        {/* =================================================
            JOB INFO
        ================================================= */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">

          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-primary-600" />

            <div>
              <p className="text-xs text-gray-400">
                Location
              </p>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {location}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Briefcase className="w-5 h-5 text-primary-600" />

            <div>
              <p className="text-xs text-gray-400">
                Experience
              </p>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {experience}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <DollarSign className="w-5 h-5 text-primary-600" />

            <div>
              <p className="text-xs text-gray-400">
                Salary
              </p>

              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {salaryMin || salaryMax
                  ? `$${Number(
                      salaryMin
                    ).toLocaleString()} - $${Number(
                      salaryMax
                    ).toLocaleString()}`
                  : 'Not specified'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-primary-600" />

            <div>
              <p className="text-xs text-gray-400">
                Posted
              </p>

              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {postedDate}
              </p>
            </div>
          </div>

        </div>

      </Card>

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT */}

        <div className="lg:col-span-2 space-y-6">

          {/* DESCRIPTION */}

          <Card className="p-6">

            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Job Description
            </h2>

            <div className="text-gray-600 dark:text-gray-400 whitespace-pre-line leading-7">
              {description}
            </div>

          </Card>

          {/* REQUIREMENTS */}

          {requirements.length > 0 && (
            <Card className="p-6">

              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Requirements
              </h2>

              <ul className="space-y-3">

                {requirements.map(
                  (requirement, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-gray-600 dark:text-gray-400"
                    >
                      <CheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />

                      <span>
                        {typeof requirement ===
                        'string'
                          ? requirement
                          : requirement?.text ||
                            requirement?.description ||
                            ''}
                      </span>
                    </li>
                  )
                )}

              </ul>

            </Card>
          )}

          {/* SKILLS */}

          {skills.length > 0 && (
            <Card className="p-6">

              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Skills
              </h2>

              <div className="flex flex-wrap gap-2">

                {skills.map(
                  (skill, index) => (
                    <Badge
                      key={`${skill}-${index}`}
                      variant="gray"
                    >
                      {skill}
                    </Badge>
                  )
                )}

              </div>

            </Card>
          )}

          {/* BENEFITS */}

          {benefits.length > 0 && (
            <Card className="p-6">

              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Benefits
              </h2>

              <ul className="space-y-3">

                {benefits.map(
                  (benefit, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-gray-600 dark:text-gray-400"
                    >
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />

                      <span>
                        {typeof benefit ===
                        'string'
                          ? benefit
                          : benefit?.text ||
                            benefit?.description ||
                            ''}
                      </span>
                    </li>
                  )
                )}

              </ul>

            </Card>
          )}

        </div>

        {/* RIGHT SIDEBAR */}

        <div className="space-y-6">

          {/* APPLY */}

          <Card className="p-6 lg:sticky lg:top-6">

            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Interested in this job?
            </h2>

            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
              Submit your application and the recruiter will review your profile.
            </p>

            <Button
              onClick={handleApply}
              disabled={
                applying ||
                applied ||
                !isActive
              }
              className="w-full"
            >

              {applying ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Applying...
                </>
              ) : applied ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Applied
                </>
              ) : !isActive ? (
                'Applications Closed'
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Apply Now
                </>
              )}

            </Button>

            <button
              type="button"
              onClick={handleShare}
              className="w-full mt-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Share Job
            </button>

            {/* APPLICANTS */}

            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">

              <div className="flex items-center gap-3">

                <Users className="w-5 h-5 text-gray-400" />

                <div>
                  <p className="text-xs text-gray-400">
                    Applicants
                  </p>

                  <p className="font-semibold text-gray-700 dark:text-gray-300">
                    {applicantsCount}
                  </p>
                </div>

              </div>

            </div>

          </Card>

          {/* COMPANY */}

          <Card className="p-6">

            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              About the Company
            </h2>

            <div className="flex items-center gap-3 mb-4">

              <img
                src={logo}
                alt={companyName}
                onError={handleLogoError}
                className="w-12 h-12 rounded-lg object-cover border border-gray-200 dark:border-gray-700"
              />

              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {companyName}
                </p>

                {job?.company?.industry && (
                  <p className="text-sm text-gray-500">
                    {job.company.industry}
                  </p>
                )}
              </div>

            </div>

            {job?.company?.description && (
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-6">
                {job.company.description}
              </p>
            )}

            {job?.company?.location && (
              <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">
                <Building2 className="w-4 h-4" />
                {job.company.location}
              </div>
            )}

          </Card>

        </div>

      </div>

    </div>
  )
}

export { JobDetailsPage }
export default JobDetailsPage