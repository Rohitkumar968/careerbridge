import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Calendar,
  Clock,
  Building2,
  Briefcase,
  MapPin,
  DollarSign,
  Loader2,
  AlertCircle,
  Trash2,
} from 'lucide-react'

import { Card, Badge, Button } from '../../components/common'
import api from '../../services/api'

const formatDate = (value) => {
  if (!value) {
    return 'Not available'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'Not available'
  }

  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

const statusColors = {
  applied: 'gray',
  reviewing: 'warning',
  shortlisted: 'primary',
  interview: 'primary',
  hired: 'success',
  rejected: 'danger',
}

const statusLabels = {
  applied: 'Applied',
  reviewing: 'Reviewing',
  shortlisted: 'Shortlisted',
  interview: 'Interview',
  hired: 'Hired',
  rejected: 'Rejected',
}

const ApplicationDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [application, setApplication] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        setLoading(true)
        setError('')

        if (!id) {
          setError('Application ID is missing.')
          return
        }

        const response = await api.get('/applications/' + id)

        const responseData = response.data

        if (!responseData) {
          setError('Application not found.')
          return
        }

        const data = responseData.data

        if (!data) {
          setError('Application not found.')
          return
        }

        setApplication(data)
      } catch (err) {
        console.error('Fetch application details error:', err)

        let message = 'Failed to load application details.'

        if (err && err.response) {
          if (
            err.response.data &&
            err.response.data.message
          ) {
            message = err.response.data.message
          }
        }

        setError(message)
      } finally {
        setLoading(false)
      }
    }

    fetchApplication()
  }, [id])

  const handleDeleteApplication = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this application? This action cannot be undone.'
    )

    if (!confirmed) {
      return
    }

    try {
      setDeleting(true)

      await api.delete('/applications/' + id)

      alert('Application deleted successfully.')

      navigate('/dashboard/applications', {
        replace: true,
      })
    } catch (err) {
      console.error('Delete application error:', err)

      let message = 'Failed to delete application.'

      if (err && err.response) {
        if (
          err.response.data &&
          err.response.data.message
        ) {
          message = err.response.data.message
        }
      }

      alert(message)
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />

          <p className="text-gray-600 dark:text-gray-400">
            Loading application...
          </p>
        </div>
      </div>
    )
  }

  if (error || !application) {
    return (
      <div className="space-y-6">
        <Link
          to="/dashboard/applications"
          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Applications
        </Link>

        <Card className="text-center py-14">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Application Not Found
          </h2>

          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error || 'The application could not be found.'}
          </p>

          <Link to="/dashboard/applications">
            <Button variant="primary">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Applications
            </Button>
          </Link>
        </Card>
      </div>
    )
  }

  const job = application.job || {}

  const jobTitle =
    job.title ||
    application.jobTitle ||
    'Job Title'

  let companyName = 'Company'

  if (
    job.company &&
    typeof job.company === 'object' &&
    job.company.name
  ) {
    companyName = job.company.name
  } else if (typeof job.company === 'string') {
    companyName = job.company
  } else if (application.company) {
    companyName = application.company
  }

  const status = String(
    application.status || 'applied'
  )
    .toLowerCase()
    .trim()

  const jobLocation =
    job.location ||
    'Location not specified'

  const experience =
    job.experience ||
    job.experienceLevel ||
    'Not specified'

  const employmentType =
    job.employmentType ||
    job.jobType ||
    'Not specified'

  let salaryText = ''

  if (
    job.salaryMin !== undefined &&
    job.salaryMin !== null
  ) {
    salaryText =
      '$' +
      Number(job.salaryMin).toLocaleString()
  }

  if (
    job.salaryMax !== undefined &&
    job.salaryMax !== null
  ) {
    if (salaryText) {
      salaryText += ' - '
    }

    salaryText +=
      '$' +
      Number(job.salaryMax).toLocaleString()
  }

  if (!salaryText && job.salary) {
    if (
      job.salary.min !== undefined &&
      job.salary.min !== null
    ) {
      salaryText =
        '$' +
        Number(job.salary.min).toLocaleString()
    }

    if (
      job.salary.max !== undefined &&
      job.salary.max !== null
    ) {
      if (salaryText) {
        salaryText += ' - '
      }

      salaryText +=
        '$' +
        Number(job.salary.max).toLocaleString()
    }
  }

  const skills = Array.isArray(job.skills)
    ? job.skills
    : []

  const getNextStep = () => {
    if (status === 'applied') {
      return 'Wait for the recruiter to review your application.'
    }

    if (status === 'reviewing') {
      return 'Your application is currently being reviewed.'
    }

    if (status === 'shortlisted') {
      return 'You have been shortlisted. Wait for the next update.'
    }

    if (status === 'interview') {
      return 'Prepare for your interview.'
    }

    if (status === 'hired') {
      return 'Congratulations! You have been hired.'
    }

    if (status === 'rejected') {
      return 'This application was not selected. Keep applying to other jobs.'
    }

    return 'Check your application status regularly.'
  }

  return (
    <div className="space-y-6">
      <Link
        to="/dashboard/applications"
        className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Applications
      </Link>

      <Card>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">
          <div className="min-w-0">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {jobTitle}
            </h1>

            <p className="text-gray-600 dark:text-gray-400 mt-2 flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              {companyName}
            </p>

            <p className="text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              {jobLocation}
            </p>
          </div>

          <Badge variant={statusColors[status] || 'gray'}>
            {statusLabels[status] || status}
          </Badge>
        </div>
      </Card>

      <Card>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Application Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-primary-600" />

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Applied Date
              </p>

              <p className="font-medium text-gray-900 dark:text-white">
                {formatDate(application.createdAt)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-primary-600" />

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Last Updated
              </p>

              <p className="font-medium text-gray-900 dark:text-white">
                {formatDate(
                  application.updatedAt ||
                  application.createdAt
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Briefcase className="w-5 h-5 text-primary-600" />

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Current Status
              </p>

              <p className="font-medium text-gray-900 dark:text-white">
                {statusLabels[status] || status}
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Next Step
            </p>

            <p className="font-medium text-gray-900 dark:text-white mt-1">
              {getNextStep()}
            </p>
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Job Details
        </h2>

        <div className="space-y-5">
          {job.description && (
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Job Description
              </p>

              <p className="text-gray-700 dark:text-gray-300 mt-1 whitespace-pre-line">
                {job.description}
              </p>
            </div>
          )}

          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Location
            </p>

            <p className="text-gray-700 dark:text-gray-300 mt-1 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              {jobLocation}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Employment Type
            </p>

            <p className="text-gray-700 dark:text-gray-300 mt-1">
              {employmentType}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Experience
            </p>

            <p className="text-gray-700 dark:text-gray-300 mt-1">
              {experience}
            </p>
          </div>

          {salaryText && (
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Salary
              </p>

              <p className="text-gray-700 dark:text-gray-300 mt-1 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                {salaryText}
              </p>
            </div>
          )}

          {skills.length > 0 && (
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Skills
              </p>

              <div className="flex flex-wrap gap-2 mt-2">
                {skills.map((skill, index) => (
                  <span
                    key={
                      String(skill) +
                      '-' +
                      String(index)
                    }
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm text-gray-700 dark:text-gray-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {application.coverLetter && (
        <Card>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Cover Letter
          </h2>

          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
            {application.coverLetter}
          </p>
        </Card>
      )}

      <Card>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Delete Application
            </h2>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Permanently remove this application from your account.
            </p>
          </div>

          <button
            type="button"
            onClick={handleDeleteApplication}
            disabled={deleting}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed text-white font-medium transition"
          >
            {deleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Delete Application
              </>
            )}
          </button>
        </div>
      </Card>
    </div>
  )
}

export default ApplicationDetailsPage