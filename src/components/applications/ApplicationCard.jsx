import React from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Clock, ArrowRight } from 'lucide-react'
import { Badge, Button } from '../common'

export const ApplicationCard = ({ application }) => {
  // ==========================================
  // STATUS
  // ==========================================
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

  // ==========================================
  // REAL BACKEND DATA
  // ==========================================
  const applicationId =
    application?._id || application?.id

  const jobTitle =
    application?.job?.title ||
    application?.jobTitle ||
    'Job Title'

  const companyName =
    application?.job?.company?.name ||
    (typeof application?.job?.company === 'string'
      ? application.job.company
      : '') ||
    application?.company ||
    'Company'

  const status =
    String(application?.status || 'applied')
      .toLowerCase()
      .trim()

  // ==========================================
  // DATE FORMATTER
  // ==========================================
  const formatDate = (dateValue) => {
    if (!dateValue) return 'Not available'

    const date = new Date(dateValue)

    if (Number.isNaN(date.getTime())) {
      return 'Not available'
    }

    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  // ==========================================
  // NEXT STEP
  // ==========================================
  const getNextStep = () => {
    switch (status) {
      case 'applied':
        return 'Application submitted'

      case 'reviewing':
        return 'Application under review'

      case 'shortlisted':
        return 'Wait for interview details'

      case 'interview':
        return 'Prepare for your interview'

      case 'hired':
        return 'Congratulations!'

      case 'rejected':
        return 'Explore other opportunities'

      default:
        return 'Check application status'
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-200 dark:border-gray-700">

      {/* HEADER */}
      <div className="flex items-start justify-between mb-4">

        <div className="min-w-0 pr-3">
          <h3 className="font-semibold text-gray-900 dark:text-white text-lg truncate">
            {jobTitle}
          </h3>

          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 truncate">
            {companyName}
          </p>
        </div>

        <Badge variant={statusColors[status] || 'gray'}>
          {statusLabels[status] || 'Applied'}
        </Badge>

      </div>

      {/* DATES */}
      <div className="space-y-2 mb-4 text-sm text-gray-600 dark:text-gray-400">

        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 flex-shrink-0" />

          <span>
            Applied:{' '}
            {formatDate(application?.createdAt)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 flex-shrink-0" />

          <span>
            Updated:{' '}
            {formatDate(
              application?.updatedAt ||
              application?.createdAt
            )}
          </span>
        </div>

      </div>

      {/* NEXT STEP */}
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Next Step:{' '}
        <span className="font-medium text-gray-800 dark:text-gray-200">
          {getNextStep()}
        </span>
      </p>

      {/* VIEW DETAILS */}
      {applicationId ? (
        <Link
          to={`/dashboard/applications/${applicationId}`}
          className="block"
        >
          <Button
            variant="outline"
            className="w-full"
          >
            View Details
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      ) : (
        <Button
          variant="outline"
          className="w-full"
          disabled
        >
          Application ID unavailable
        </Button>
      )}

    </div>
  )
}

export default ApplicationCard