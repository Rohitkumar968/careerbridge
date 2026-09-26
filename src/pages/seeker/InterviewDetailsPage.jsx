import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Calendar,
  Clock,
  Video,
  User,
  Building2,
  MapPin,
  ExternalLink,
  Loader2,
  AlertCircle,
} from 'lucide-react'

import { Card, Badge, Button } from '../../components/common'
import api from '../../services/api'

export const InterviewDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  // ==================================================
  // STATE
  // ==================================================

  const [interview, setInterview] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // ==================================================
  // LOAD INTERVIEW
  // ==================================================

  useEffect(() => {
    const loadInterview = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await api.get(
          `/interviews/${id}`
        )

        setInterview(
          response?.data?.data || null
        )
      } catch (err) {
        console.error(
          'Load interview details error:',
          err
        )

        setError(
          err?.response?.data?.message ||
            'Failed to load interview details.'
        )

        setInterview(null)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      loadInterview()
    }
  }, [id])

  // ==================================================
  // JOIN INTERVIEW
  // ==================================================

  const handleJoinInterview = () => {
    if (!interview?.meetingLink) {
      alert(
        'Meeting link is not available.'
      )
      return
    }

    window.open(
      interview.meetingLink,
      '_blank',
      'noopener,noreferrer'
    )
  }

  // ==================================================
  // JOB TITLE
  // ==================================================

  const getJobTitle = () => {
    if (
      interview?.job &&
      typeof interview.job === 'object'
    ) {
      return (
        interview.job.title ||
        'Job Interview'
      )
    }

    return 'Job Interview'
  }

  // ==================================================
  // RECRUITER NAME
  // ==================================================

  const getRecruiterName = () => {
    if (
      interview?.recruiter &&
      typeof interview.recruiter === 'object'
    ) {
      return (
        interview.recruiter.name ||
        interview.recruiter.email ||
        'Recruiter'
      )
    }

    return 'Recruiter'
  }

  // ==================================================
  // RECRUITER EMAIL
  // ==================================================

  const getRecruiterEmail = () => {
    if (
      interview?.recruiter &&
      typeof interview.recruiter === 'object'
    ) {
      return (
        interview.recruiter.email ||
        ''
      )
    }

    return ''
  }

  // ==================================================
  // COMPANY
  // ==================================================

  const getCompanyName = () => {
    if (
      interview?.job &&
      typeof interview.job === 'object'
    ) {
      if (
        interview.job.company &&
        typeof interview.job.company === 'object'
      ) {
        return (
          interview.job.company.name ||
          'Company'
        )
      }
    }

    return 'Company'
  }

  // ==================================================
  // LOCATION
  // ==================================================

  const getLocation = () => {
    if (
      interview?.job &&
      typeof interview.job === 'object'
    ) {
      return (
        interview.job.location ||
        'Online'
      )
    }

    return 'Online'
  }

  // ==================================================
  // DATE
  // ==================================================

  const getDate = () => {
    if (!interview?.date) {
      return 'Date not available'
    }

    const date = new Date(
      interview.date
    )

    if (Number.isNaN(date.getTime())) {
      return 'Date not available'
    }

    return date.toLocaleDateString(
      'en-IN',
      {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }
    )
  }

  // ==================================================
  // TIME
  // ==================================================

  const getTime = () => {
    if (!interview?.date) {
      return 'Time not available'
    }

    const date = new Date(
      interview.date
    )

    if (Number.isNaN(date.getTime())) {
      return 'Time not available'
    }

    return date.toLocaleTimeString(
      'en-IN',
      {
        hour: '2-digit',
        minute: '2-digit',
      }
    )
  }

  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">

        <div className="text-center">

          <Loader2 className="w-10 h-10 mx-auto mb-4 text-primary-600 animate-spin" />

          <p className="text-gray-600 dark:text-gray-400">
            Loading interview details...
          </p>

        </div>

      </div>
    )
  }

  // ==================================================
  // ERROR
  // ==================================================

  if (error || !interview) {
    return (
      <div className="space-y-6">

        <Button
          variant="outline"
          onClick={() =>
            navigate(
              '/dashboard/interviews'
            )
          }
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Interviews
        </Button>

        <Card className="text-center py-12">

          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Interview Not Found
          </h1>

          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error ||
              'The interview you are looking for does not exist.'}
          </p>

          <Button
            variant="primary"
            onClick={() =>
              navigate(
                '/dashboard/interviews'
              )
            }
          >
            Go to Interviews
          </Button>

        </Card>

      </div>
    )
  }

  // ==================================================
  // RETURN
  // ==================================================

  return (
    <div className="space-y-6">

      {/* ==================================================
          BACK BUTTON
      ================================================== */}

      <Button
        variant="outline"
        onClick={() =>
          navigate(
            '/dashboard/interviews'
          )
        }
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Interviews
      </Button>

      {/* ==================================================
          HEADER
      ================================================== */}

      <Card>

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">

          <div>

            <p className="text-sm text-primary-600 dark:text-primary-400 font-medium mb-2">
              Interview Details
            </p>

            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {getJobTitle()}
            </h1>

            <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">
              {getCompanyName()}
            </p>

          </div>

          <Badge
            variant={
              interview.status ===
              'cancelled'
                ? 'gray'
                : interview.status ===
                    'completed'
                  ? 'gray'
                  : 'primary'
            }
          >
            {interview.status}
          </Badge>

        </div>

      </Card>

      {/* ==================================================
          INTERVIEW INFORMATION
      ================================================== */}

      <Card>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Interview Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* COMPANY */}

          <div className="flex items-start gap-3">

            <Building2 className="w-5 h-5 text-primary-600 mt-1" />

            <div>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Company
              </p>

              <p className="font-medium text-gray-900 dark:text-white">
                {getCompanyName()}
              </p>

            </div>

          </div>

          {/* INTERVIEWER */}

          <div className="flex items-start gap-3">

            <User className="w-5 h-5 text-primary-600 mt-1" />

            <div>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Interviewer
              </p>

              <p className="font-medium text-gray-900 dark:text-white">
                {getRecruiterName()}
              </p>

              {getRecruiterEmail() && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {getRecruiterEmail()}
                </p>
              )}

            </div>

          </div>

          {/* DATE */}

          <div className="flex items-start gap-3">

            <Calendar className="w-5 h-5 text-primary-600 mt-1" />

            <div>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Date
              </p>

              <p className="font-medium text-gray-900 dark:text-white">
                {getDate()}
              </p>

            </div>

          </div>

          {/* TIME */}

          <div className="flex items-start gap-3">

            <Clock className="w-5 h-5 text-primary-600 mt-1" />

            <div>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Time
              </p>

              <p className="font-medium text-gray-900 dark:text-white">
                {getTime()}
              </p>

            </div>

          </div>

          {/* TYPE */}

          <div className="flex items-start gap-3">

            <Video className="w-5 h-5 text-primary-600 mt-1" />

            <div>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Interview Type
              </p>

              <p className="font-medium text-gray-900 dark:text-white">
                {interview.interviewType ||
                  'Google Meet'}
              </p>

            </div>

          </div>

          {/* LOCATION */}

          <div className="flex items-start gap-3">

            <MapPin className="w-5 h-5 text-primary-600 mt-1" />

            <div>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Location
              </p>

              <p className="font-medium text-gray-900 dark:text-white">
                {getLocation()}
              </p>

            </div>

          </div>

        </div>

      </Card>

      {/* ==================================================
          NOTES
      ================================================== */}

      {interview.notes && (

        <Card>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            Interview Notes
          </h2>

          <div className="rounded-xl bg-gray-50 dark:bg-gray-800 p-4">

            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {interview.notes}
            </p>

          </div>

        </Card>

      )}

      {/* ==================================================
          MEETING
      ================================================== */}

      <Card>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
          Join Interview
        </h2>

        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Use the button below to join your scheduled interview.
        </p>

        {interview.meetingLink ? (

          <Button
            variant="primary"
            onClick={handleJoinInterview}
            disabled={
              interview.status ===
                'cancelled' ||
              interview.status ===
                'completed'
            }
          >
            <Video className="w-4 h-4 mr-2" />

            Join Interview

            <ExternalLink className="w-4 h-4 ml-2" />

          </Button>

        ) : (

          <div className="rounded-xl bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-900 p-4">

            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              Meeting link has not been added yet.
            </p>

          </div>

        )}

      </Card>

      {/* ==================================================
          STATUS INFORMATION
      ================================================== */}

      <Card>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Interview Status
        </h2>

        <div className="flex items-center justify-between rounded-xl bg-gray-50 dark:bg-gray-800 p-4">

          <div>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Current Status
            </p>

            <p className="font-semibold text-gray-900 dark:text-white mt-1 capitalize">
              {interview.status}
            </p>

          </div>

          <Badge
            variant={
              interview.status ===
              'cancelled'
                ? 'gray'
                : interview.status ===
                    'completed'
                  ? 'gray'
                  : 'primary'
            }
          >
            {interview.status}
          </Badge>

        </div>

      </Card>

    </div>
  )
}

export default InterviewDetailsPage