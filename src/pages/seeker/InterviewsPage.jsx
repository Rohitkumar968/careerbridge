import React, { useState } from 'react'
import {
  Calendar,
  Clock,
  Video,
  User,
  ExternalLink,
  X,
} from 'lucide-react'

import { Card, Badge, Button } from '../../components/common'
import { mockInterviews } from '../../data/mockData'

// ==================================================
// DATE HELPERS
// ==================================================

const parseInterviewDate = (dateString) => {
  if (!dateString) return new Date()

  // YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    const [year, month, day] = dateString.split('-').map(Number)

    return new Date(year, month - 1, day)
  }

  // DD/MM/YYYY or MM/DD/YYYY
  if (dateString.includes('/')) {
    const parts = dateString.split('/').map(Number)

    if (parts.length === 3) {
      const [first, second, third] = parts

      // Your mock data is displayed like 11/9/2026.
      // Treat it as DD/MM/YYYY.
      return new Date(third, second - 1, first)
    }
  }

  const parsed = new Date(dateString)

  return Number.isNaN(parsed.getTime())
    ? new Date()
    : parsed
}

const formatDisplayDate = (dateString) => {
  const date = parseInterviewDate(dateString)

  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

const formatInputDate = (dateString) => {
  const date = parseInterviewDate(dateString)

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

// ==================================================
// COMPONENT
// ==================================================

export const InterviewsPage = () => {
  const [activeTab, setActiveTab] = useState('upcoming')

  // Keep interviews in local state so rescheduling updates the UI
  const [interviewsData, setInterviewsData] = useState(
    mockInterviews
  )

  // ==================================================
  // RESCHEDULE STATE
  // ==================================================

  const [showRescheduleModal, setShowRescheduleModal] =
    useState(false)

  const [selectedInterview, setSelectedInterview] =
    useState(null)

  const [rescheduleDate, setRescheduleDate] = useState('')
  const [rescheduleTime, setRescheduleTime] = useState('')

  // ==================================================
  // DETAILS STATE
  // ==================================================

  const [showDetailsModal, setShowDetailsModal] =
    useState(false)

  const [selectedDetails, setSelectedDetails] =
    useState(null)

  // ==================================================
  // CURRENT DATE
  // ==================================================

  const now = new Date()

  // ==================================================
  // UPCOMING / PAST
  // ==================================================

  const upcomingInterviews = interviewsData.filter(
    (interview) =>
      parseInterviewDate(interview.date) > now
  )

  const pastInterviews = interviewsData.filter(
    (interview) =>
      parseInterviewDate(interview.date) <= now
  )

  const interviews =
    activeTab === 'upcoming'
      ? upcomingInterviews
      : pastInterviews

  // ==================================================
  // JOIN INTERVIEW
  // ==================================================

  const handleJoinInterview = (interview) => {
    if (!interview.meetingLink) {
      alert('Meeting link is not available.')
      return
    }

    window.open(
      interview.meetingLink,
      '_blank',
      'noopener,noreferrer'
    )
  }

  // ==================================================
  // OPEN RESCHEDULE MODAL
  // ==================================================

  const handleReschedule = (interview) => {
    setSelectedInterview(interview)

    setRescheduleDate(
      formatInputDate(interview.date)
    )

    setRescheduleTime(
      interview.time || '10:00'
    )

    setShowRescheduleModal(true)
  }

  // ==================================================
  // CLOSE RESCHEDULE MODAL
  // ==================================================

  const handleCloseReschedule = () => {
    setShowRescheduleModal(false)
    setSelectedInterview(null)
    setRescheduleDate('')
    setRescheduleTime('')
  }

  // ==================================================
  // SAVE RESCHEDULE
  // ==================================================

  const handleSaveReschedule = (e) => {
    e.preventDefault()

    if (!selectedInterview) return

    if (!rescheduleDate || !rescheduleTime) {
      return
    }

    setInterviewsData((previousInterviews) =>
      previousInterviews.map((interview) =>
        interview.id === selectedInterview.id
          ? {
              ...interview,
              date: rescheduleDate,
              time: rescheduleTime,
            }
          : interview
      )
    )

    handleCloseReschedule()
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
  // RETURN
  // ==================================================

  return (
    <div className="space-y-6">

      {/* ==================================================
          PAGE HEADER
      ================================================== */}

      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          My Interviews
        </h1>

        <p className="text-gray-600 dark:text-gray-400">
          Manage your scheduled interviews
        </p>
      </div>

      {/* ==================================================
          TABS
      ================================================== */}

      <Card>
        <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700 pb-4">

          {/* UPCOMING */}

          <button
            onClick={() => setActiveTab('upcoming')}
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
            onClick={() => setActiveTab('past')}
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

            <Card key={interview.id}>

              {/* ==================================================
                  HEADER
              ================================================== */}

              <div className="flex items-start justify-between mb-4">

                <div>

                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {interview.position}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-400">
                    {interview.company}
                  </p>

                </div>

                <Badge
                  variant={
                    activeTab === 'upcoming'
                      ? 'primary'
                      : 'gray'
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
                      {formatDisplayDate(interview.date)}
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
                      {interview.time}
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
                      {interview.type}
                    </p>

                  </div>

                </div>

                {/* INTERVIEWER */}

                <div className="flex items-center gap-3">

                  <User className="w-5 h-5 text-gray-400" />

                  <div>

                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Interviewer
                    </p>

                    <p className="font-medium text-gray-900 dark:text-white">
                      {interview.interviewer}
                    </p>

                  </div>

                </div>

              </div>

              {/* ==================================================
                  BUTTONS
              ================================================== */}

              <div className="flex flex-col sm:flex-row gap-3">

                {/* JOIN INTERVIEW */}

                {activeTab === 'upcoming' && (

                  <Button
                    variant="primary"
                    className="flex-1"
                    onClick={() =>
                      handleJoinInterview(interview)
                    }
                  >

                    <Video className="w-4 h-4 mr-2" />

                    Join Interview

                    <ExternalLink className="w-4 h-4 ml-2" />

                  </Button>

                )}

                {/* RESCHEDULE */}

                {activeTab === 'upcoming' && (

                  <Button
                    variant="secondary"
                    className="flex-1"
                    onClick={() =>
                      handleReschedule(interview)
                    }
                  >

                    <Calendar className="w-4 h-4 mr-2" />

                    Reschedule

                  </Button>

                )}

                {/* VIEW DETAILS */}

                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() =>
                    handleViewDetails(interview)
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
          RESCHEDULE MODAL
      ================================================== */}

      {showRescheduleModal && selectedInterview && (

        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

          {/* BACKDROP */}

          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleCloseReschedule}
          />

          {/* MODAL */}

          <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-2xl">

            {/* HEADER */}

            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-gray-700">

              <div>

                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Reschedule Interview
                </h2>

                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Select a new date and time
                </p>

              </div>

              <button
                onClick={handleCloseReschedule}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

            </div>

            {/* FORM */}

            <form onSubmit={handleSaveReschedule}>

              <div className="p-6 space-y-5">

                {/* INTERVIEW INFO */}

                <div className="rounded-xl bg-gray-50 dark:bg-gray-800 p-4">

                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Interview
                  </p>

                  <p className="font-semibold text-gray-900 dark:text-white mt-1">
                    {selectedInterview.position}
                  </p>

                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedInterview.company}
                  </p>

                </div>

                {/* DATE */}

                <div>

                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    New Date
                  </label>

                  <div className="relative">

                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />

                    <input
                      type="date"
                      value={rescheduleDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) =>
                        setRescheduleDate(e.target.value)
                      }
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />

                  </div>

                </div>

                {/* TIME */}

                <div>

                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    New Time
                  </label>

                  <div className="relative">

                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />

                    <input
                      type="time"
                      value={rescheduleTime}
                      onChange={(e) =>
                        setRescheduleTime(e.target.value)
                      }
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />

                  </div>

                </div>

                {/* NOTE */}

                <div className="rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/30 p-4">

                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Your interview schedule will be updated with the new date and time.
                  </p>

                </div>

              </div>

              {/* FOOTER */}

              <div className="flex gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700">

                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={handleCloseReschedule}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1"
                >
                  Save Changes
                </Button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* ==================================================
          VIEW DETAILS MODAL
      ================================================== */}

      {showDetailsModal && selectedDetails && (

        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

          {/* BACKDROP */}

          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleCloseDetails}
          />

          {/* MODAL */}

          <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-2xl">

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
                onClick={handleCloseDetails}
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
                  {selectedDetails.position}
                </p>

              </div>

              {/* COMPANY */}

              <div>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Company
                </p>

                <p className="font-medium text-gray-900 dark:text-white">
                  {selectedDetails.company}
                </p>

              </div>

              {/* DETAILS GRID */}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* DATE */}

                <div className="rounded-xl bg-gray-50 dark:bg-gray-800 p-4">

                  <div className="flex items-center gap-2 mb-2">

                    <Calendar className="w-4 h-4 text-primary-600" />

                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Date
                    </p>

                  </div>

                  <p className="font-semibold text-gray-900 dark:text-white">
                    {formatDisplayDate(selectedDetails.date)}
                  </p>

                </div>

                {/* TIME */}

                <div className="rounded-xl bg-gray-50 dark:bg-gray-800 p-4">

                  <div className="flex items-center gap-2 mb-2">

                    <Clock className="w-4 h-4 text-primary-600" />

                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Time
                    </p>

                  </div>

                  <p className="font-semibold text-gray-900 dark:text-white">
                    {selectedDetails.time}
                  </p>

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
                    {selectedDetails.type}
                  </p>

                </div>

                {/* INTERVIEWER */}

                <div className="rounded-xl bg-gray-50 dark:bg-gray-800 p-4">

                  <div className="flex items-center gap-2 mb-2">

                    <User className="w-4 h-4 text-primary-600" />

                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Interviewer
                    </p>

                  </div>

                  <p className="font-semibold text-gray-900 dark:text-white">
                    {selectedDetails.interviewer}
                  </p>

                </div>

              </div>

              {/* STATUS */}

              <div className="flex items-center justify-between rounded-xl bg-gray-50 dark:bg-gray-800 p-4">

                <div>

                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Interview Status
                  </p>

                  <p className="font-semibold text-gray-900 dark:text-white mt-1 capitalize">
                    {selectedDetails.status}
                  </p>

                </div>

                <Badge variant="primary">
                  {selectedDetails.status}
                </Badge>

              </div>

              {/* MEETING */}

              {selectedDetails.meetingLink && (

                <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4">

                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    Meeting
                  </p>

                  <button
                    onClick={() =>
                      handleJoinInterview(selectedDetails)
                    }
                    className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-medium hover:underline"
                  >

                    <Video className="w-4 h-4" />

                    Join Interview

                    <ExternalLink className="w-4 h-4" />

                  </button>

                </div>

              )}

            </div>

            {/* FOOTER */}

            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">

              <Button
                variant="outline"
                className="w-full"
                onClick={handleCloseDetails}
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