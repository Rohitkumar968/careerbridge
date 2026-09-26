import React, { useCallback, useEffect, useState } from 'react'
import {
  Calendar,
  Clock,
  Video,
  User,
  ExternalLink,
  X,
  Loader2,
  AlertCircle,
} from 'lucide-react'

import { Card, Badge, Button } from '../../components/common'
import api from '../../services/api'

// ==================================================
// DATE HELPERS
// ==================================================

const getInterviewDate = (interview) => {
  return interview?.date
    ? new Date(interview.date)
    : null
}

const formatDisplayDate = (interview) => {
  const date = getInterviewDate(interview)

  if (!date || Number.isNaN(date.getTime())) {
    return 'Date not available'
  }

  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

const formatTime = (interview) => {
  const date = getInterviewDate(interview)

  if (!date || Number.isNaN(date.getTime())) {
    return 'Time not available'
  }

  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

// ==================================================
// COMPONENT
// ==================================================

export const InterviewsPage = () => {
  const [activeTab, setActiveTab] = useState('upcoming')

  const [interviewsData, setInterviewsData] = useState([])

  const [loading, setLoading] = useState(true)

  const [error, setError] = useState('')

  // ==================================================
  // DETAILS STATE
  // ==================================================

  const [showDetailsModal, setShowDetailsModal] =
    useState(false)

  const [selectedDetails, setSelectedDetails] =
    useState(null)

  // ==================================================
  // LOAD MY INTERVIEWS
  // ==================================================

  const loadInterviews = useCallback(async () => {
    try {
      setLoading(true)
      setError('')

      /*
        _t prevents browser/proxy caching from returning
        an old interview list after recruiter deletes one.
      */
      const response = await api.get('/interviews/my', {
        params: {
          _t: Date.now(),
        },
      })

      const data = response?.data?.data || []

      /*
        Keep only valid interview objects and remove
        duplicate records by MongoDB _id.
      */
      const uniqueInterviews = Array.from(
        new Map(
          data
            .filter(
              (interview) =>
                interview &&
                interview._id
            )
            .map((interview) => [
              interview._id,
              interview,
            ])
        ).values()
      )

      setInterviewsData(uniqueInterviews)
    } catch (err) {
      console.error(
        'Load interviews error:',
        err
      )

      setError(
        err?.response?.data?.message ||
          'Failed to load interviews.'
      )

      setInterviewsData([])
    } finally {
      setLoading(false)
    }
  }, [])

  // ==================================================
  // LOAD ON PAGE OPEN
  // ==================================================

  useEffect(() => {
    loadInterviews()
  }, [loadInterviews])

  // ==================================================
  // REFRESH WHEN USER RETURNS TO THIS TAB
  // ==================================================

  useEffect(() => {
    const handleFocus = () => {
      loadInterviews()
    }

    const handleVisibilityChange = () => {
      if (
        document.visibilityState === 'visible'
      ) {
        loadInterviews()
      }
    }

    window.addEventListener(
      'focus',
      handleFocus
    )

    document.addEventListener(
      'visibilitychange',
      handleVisibilityChange
    )

    return () => {
      window.removeEventListener(
        'focus',
        handleFocus
      )

      document.removeEventListener(
        'visibilitychange',
        handleVisibilityChange
      )
    }
  }, [loadInterviews])

  // ==================================================
  // CURRENT DATE
  // ==================================================

  const now = new Date()

  // ==================================================
  // UPCOMING INTERVIEWS
  // ==================================================

  const upcomingInterviews =
    interviewsData.filter((interview) => {
      const interviewDate =
        getInterviewDate(interview)

      if (
        !interviewDate ||
        Number.isNaN(
          interviewDate.getTime()
        )
      ) {
        return false
      }

      /*
        Upcoming should ONLY contain active scheduled
        interviews.

        Cancelled/completed interviews should never appear
        here even if their date is in the future.
      */
      return (
        interviewDate > now &&
        (
          interview.status === 'scheduled' ||
          interview.status === 'rescheduled'
        )
      )
    })

  // ==================================================
  // PAST INTERVIEWS
  // ==================================================

  const pastInterviews =
    interviewsData.filter((interview) => {
      const interviewDate =
        getInterviewDate(interview)

      if (
        !interviewDate ||
        Number.isNaN(
          interviewDate.getTime()
        )
      ) {
        return false
      }

      return (
        interviewDate <= now ||
        interview.status === 'completed' ||
        interview.status === 'cancelled'
      )
    })

  // ==================================================
  // ACTIVE LIST
  // ==================================================

  const interviews =
    activeTab === 'upcoming'
      ? upcomingInterviews
      : pastInterviews

  // ==================================================
  // JOIN INTERVIEW
  // ==================================================

  const handleJoinInterview = (interview) => {
    const meetingLink =
      interview?.meetingLink ||
      interview?.meetingUrl ||
      ''

    if (!meetingLink.trim()) {
      alert(
        'Meeting link is not available.'
      )
      return
    }

    window.open(
      meetingLink,
      '_blank',
      'noopener,noreferrer'
    )
  }

  // ==================================================
  // VIEW DETAILS
  // ==================================================

  const handleViewDetails = (interview) => {
    setSelectedDetails(interview)
    setShowDetailsModal(true)
  }

  // ==================================================
  // CLOSE DETAILS
  // ==================================================

  const handleCloseDetails = () => {
    setShowDetailsModal(false)
    setSelectedDetails(null)
  }

  // ==================================================
  // GET JOB TITLE
  // ==================================================

  const getJobTitle = (interview) => {
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
  // GET RECRUITER NAME
  // ==================================================

  const getRecruiterName = (interview) => {
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
  // GET LOCATION
  // ==================================================

  const getLocation = (interview) => {
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
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-10 h-10 mx-auto mb-4 text-primary-600 animate-spin" />

          <p className="text-gray-600 dark:text-gray-400">
            Loading your interviews...
          </p>
        </div>
      </div>
    )
  }

  // ==================================================
  // RETURN
  // ==================================================

  return (
    <div className="space-y-6">

      {/* ==================================================
          PAGE HEADER
      ================================================== */}

      <div className="flex items-start justify-between gap-4">

        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            My Interviews
          </h1>

          <p className="text-gray-600 dark:text-gray-400">
            Manage your scheduled interviews
          </p>
        </div>

        {/* REFRESH BUTTON */}

        <Button
          variant="outline"
          onClick={loadInterviews}
        >
          <Loader2 className="w-4 h-4 mr-2 hidden" />

          Refresh
        </Button>

      </div>

      {/* ==================================================
          ERROR
      ================================================== */}

      {error && (
        <Card>
          <div className="flex items-start gap-3">

            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />

            <div>
              <p className="font-medium text-red-600 dark:text-red-400">
                Unable to load interviews
              </p>

              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {error}
              </p>
            </div>

          </div>
        </Card>
      )}

      {/* ==================================================
          TABS
      ================================================== */}

      <Card>

        <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700 pb-4">

          {/* UPCOMING */}

          <button
            onClick={() =>
              setActiveTab('upcoming')
            }
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'upcoming'
                ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Upcoming ({upcomingInterviews.length})
          </button>

          {/* PAST */}

          <button
            onClick={() =>
              setActiveTab('past')
            }
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'past'
                ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Past ({pastInterviews.length})
          </button>

        </div>

      </Card>

      {/* ==================================================
          INTERVIEWS LIST
      ================================================== */}

      {interviews.length > 0 ? (

        <div className="space-y-4">

          {interviews.map((interview) => (

            <Card
              key={interview._id}
            >

              {/* ==================================================
                  HEADER
              ================================================== */}

              <div className="flex items-start justify-between mb-4">

                <div>

                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {getJobTitle(interview)}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-400">
                    {getRecruiterName(interview)}
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

              {/* ==================================================
                  INTERVIEW INFORMATION
              ================================================== */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 py-4 border-y border-gray-200 dark:border-gray-700">

                {/* DATE */}

                <div className="flex items-center gap-3">

                  <Calendar className="w-5 h-5 text-gray-400" />

                  <div>

                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Date
                    </p>

                    <p className="font-medium text-gray-900 dark:text-white">
                      {formatDisplayDate(
                        interview
                      )}
                    </p>

                  </div>

                </div>

                {/* TIME */}

                <div className="flex items-center gap-3">

                  <Clock className="w-5 h-5 text-gray-400" />

                  <div>

                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Time
                    </p>

                    <p className="font-medium text-gray-900 dark:text-white">
                      {formatTime(
                        interview
                      )}
                    </p>

                  </div>

                </div>

                {/* TYPE */}

                <div className="flex items-center gap-3">

                  <Video className="w-5 h-5 text-gray-400" />

                  <div>

                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Type
                    </p>

                    <p className="font-medium text-gray-900 dark:text-white">
                      {interview.interviewType ||
                        'Google Meet'}
                    </p>

                  </div>

                </div>

                {/* LOCATION */}

                <div className="flex items-center gap-3">

                  <User className="w-5 h-5 text-gray-400" />

                  <div>

                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Location
                    </p>

                    <p className="font-medium text-gray-900 dark:text-white">
                      {getLocation(
                        interview
                      )}
                    </p>

                  </div>

                </div>

              </div>

              {/* ==================================================
                  BUTTONS
              ================================================== */}

              <div className="flex flex-col sm:flex-row gap-3">

                {/* JOIN */}

                {activeTab === 'upcoming' &&
                  interview.status !==
                    'cancelled' &&
                  interview.status !==
                    'completed' && (

                    <Button
                      variant="primary"
                      className="flex-1"
                      onClick={() =>
                        handleJoinInterview(
                          interview
                        )
                      }
                    >

                      <Video className="w-4 h-4 mr-2" />

                      Join Interview

                      <ExternalLink className="w-4 h-4 ml-2" />

                    </Button>

                  )}

                {/* VIEW DETAILS */}

                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() =>
                    handleViewDetails(
                      interview
                    )
                  }
                >
                  View Details
                </Button>

              </div>

            </Card>

          ))}

        </div>

      ) : (

        /* ==================================================
           EMPTY STATE
        ================================================== */

        <Card className="text-center py-12">

          <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />

          <p className="text-gray-600 dark:text-gray-400">

            {activeTab === 'upcoming'
              ? 'No upcoming interviews scheduled'
              : 'No past interviews'}

          </p>

        </Card>

      )}

      {/* ==================================================
          DETAILS MODAL
      ================================================== */}

      {showDetailsModal &&
        selectedDetails && (

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

            {/* BACKDROP */}

            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={
                handleCloseDetails
              }
            />

            {/* MODAL */}

            <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">

              {/* HEADER */}

              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-gray-700">

                <div>

                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Interview Details
                  </h2>

                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Complete interview information
                  </p>

                </div>

                <button
                  onClick={
                    handleCloseDetails
                  }
                  className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

              </div>

              {/* BODY */}

              <div className="p-6 space-y-5">

                {/* POSITION */}

                <div>

                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Position
                  </p>

                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {getJobTitle(
                      selectedDetails
                    )}
                  </p>

                </div>

                {/* INTERVIEWER */}

                <div>

                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Interviewer
                  </p>

                  <p className="font-medium text-gray-900 dark:text-white">
                    {getRecruiterName(
                      selectedDetails
                    )}
                  </p>

                </div>

                {/* DATE & TIME */}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  <div className="rounded-xl bg-gray-50 dark:bg-gray-800 p-4">

                    <div className="flex items-center gap-2 mb-2">

                      <Calendar className="w-4 h-4 text-primary-600" />

                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Date
                      </p>

                    </div>

                    <p className="font-semibold text-gray-900 dark:text-white">
                      {formatDisplayDate(
                        selectedDetails
                      )}
                    </p>

                  </div>

                  <div className="rounded-xl bg-gray-50 dark:bg-gray-800 p-4">

                    <div className="flex items-center gap-2 mb-2">

                      <Clock className="w-4 h-4 text-primary-600" />

                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Time
                      </p>

                    </div>

                    <p className="font-semibold text-gray-900 dark:text-white">
                      {formatTime(
                        selectedDetails
                      )}
                    </p>

                  </div>

                </div>

                {/* TYPE */}

                <div className="rounded-xl bg-gray-50 dark:bg-gray-800 p-4">

                  <div className="flex items-center gap-2 mb-2">

                    <Video className="w-4 h-4 text-primary-600" />

                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Interview Type
                    </p>

                  </div>

                  <p className="font-semibold text-gray-900 dark:text-white">
                    {selectedDetails.interviewType ||
                      'Google Meet'}
                  </p>

                </div>

                {/* LOCATION */}

                <div className="rounded-xl bg-gray-50 dark:bg-gray-800 p-4">

                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Location
                  </p>

                  <p className="font-semibold text-gray-900 dark:text-white mt-1">
                    {getLocation(
                      selectedDetails
                    )}
                  </p>

                </div>

                {/* STATUS */}

                <div className="flex items-center justify-between rounded-xl bg-gray-50 dark:bg-gray-800 p-4">

                  <div>

                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Interview Status
                    </p>

                    <p className="font-semibold text-gray-900 dark:text-white mt-1 capitalize">
                      {
                        selectedDetails.status
                      }
                    </p>

                  </div>

                  <Badge
                    variant={
                      selectedDetails.status ===
                        'cancelled'
                        ? 'gray'
                        : selectedDetails.status ===
                            'completed'
                          ? 'gray'
                          : 'primary'
                    }
                  >
                    {
                      selectedDetails.status
                    }
                  </Badge>

                </div>

                {/* NOTES */}

                {selectedDetails.notes && (

                  <div>

                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      Notes
                    </p>

                    <div className="rounded-xl bg-gray-50 dark:bg-gray-800 p-4">

                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {
                          selectedDetails.notes
                        }
                      </p>

                    </div>

                  </div>

                )}

                {/* MEETING */}

                {(selectedDetails.meetingLink ||
                  selectedDetails.meetingUrl) && (

                  <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4">

                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      Meeting
                    </p>

                    <Button
                      variant="primary"
                      onClick={() =>
                        handleJoinInterview(
                          selectedDetails
                        )
                      }
                    >

                      <Video className="w-4 h-4 mr-2" />

                      Join Interview

                      <ExternalLink className="w-4 h-4 ml-2" />

                    </Button>

                  </div>

                )}

              </div>

              {/* FOOTER */}

              <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={
                    handleCloseDetails
                  }
                >
                  Close
                </Button>

              </div>

            </div>

          </div>

        )}

    </div>
  )
}

export default InterviewsPage