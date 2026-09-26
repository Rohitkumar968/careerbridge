import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Calendar,
  Clock,
  Video,
  User,
  Briefcase,
  CheckCircle,
  XCircle,
  Trash2,
  RefreshCw,
  ArrowLeft,
  ExternalLink,
} from 'lucide-react'
import api from '../../services/api'

const DEFAULT_MEETING_LINK =
  'https://meet.google.com/poo-wfuo-byc'

const ScheduleInterviewPage = () => {
  const navigate = useNavigate()

  const [applications, setApplications] = useState([])
  const [interviews, setInterviews] = useState([])

  const [loading, setLoading] = useState(true)
  const [scheduling, setScheduling] = useState(false)
  const [actionLoading, setActionLoading] =
    useState(null)

  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    application: '',
    date: '',
    time: '',
    interviewType: 'Google Meet',
    meetingLink: DEFAULT_MEETING_LINK,
    notes: '',
  })

  // =====================================================
  // LOAD DATA
  // =====================================================

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')

      const [
        applicationsResponse,
        interviewsResponse,
      ] = await Promise.all([
        api.get('/applications?limit=100'),
        api.get('/interviews/recruiter'),
      ])

      const applicationsData =
        applicationsResponse?.data?.data

      const interviewsData =
        interviewsResponse?.data?.data

      setApplications(
        Array.isArray(applicationsData)
          ? applicationsData
          : []
      )

      setInterviews(
        Array.isArray(interviewsData)
          ? interviewsData
          : []
      )
    } catch (err) {
      console.error(
        'Load interview data error:',
        err
      )

      setError(
        err.response?.data?.message ||
          'Failed to load interview data.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // =====================================================
  // FORM CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target

    setForm((prev) => {
      if (
        name === 'interviewType' &&
        value === 'Google Meet'
      ) {
        return {
          ...prev,
          interviewType: value,
          meetingLink: DEFAULT_MEETING_LINK,
        }
      }

      return {
        ...prev,
        [name]: value,
      }
    })
  }

  // =====================================================
  // SCHEDULE INTERVIEW
  // =====================================================

  const handleSchedule = async (e) => {
    e.preventDefault()

    setMessage('')
    setError('')

    if (!form.application) {
      setError(
        'Please select an application.'
      )
      return
    }

    if (!form.date) {
      setError(
        'Please select interview date.'
      )
      return
    }

    if (!form.time) {
      setError(
        'Please select interview time.'
      )
      return
    }

    const selectedApplication =
      applications.find(
        (application) =>
          application._id ===
          form.application
      )

    if (!selectedApplication) {
      setError(
        'Selected application not found.'
      )
      return
    }

    const candidate =
      selectedApplication.applicant?._id ||
      selectedApplication.applicant?.id ||
      selectedApplication.applicant

    const job =
      selectedApplication.job?._id ||
      selectedApplication.job?.id ||
      selectedApplication.job

    if (!candidate) {
      setError(
        'Candidate information is missing.'
      )
      return
    }

    if (!job) {
      setError(
        'Job information is missing.'
      )
      return
    }

    const interviewDate = new Date(
      `${form.date}T${form.time}`
    )

    if (
      Number.isNaN(
        interviewDate.getTime()
      )
    ) {
      setError(
        'Invalid interview date or time.'
      )
      return
    }

    if (
      interviewDate <= new Date()
    ) {
      setError(
        'Interview date and time must be in the future.'
      )
      return
    }

    let meetingLink =
      form.meetingLink.trim()

    if (
      form.interviewType ===
      'Google Meet'
    ) {
      meetingLink =
        DEFAULT_MEETING_LINK
    }

    const onlineTypes = [
      'Google Meet',
      'Zoom',
      'Microsoft Teams',
    ]

    if (
      onlineTypes.includes(
        form.interviewType
      ) &&
      !meetingLink
    ) {
      setError(
        'Meeting link is required for online interviews.'
      )
      return
    }

    try {
      setScheduling(true)

      await api.post('/interviews', {
        candidate,
        job,
        application:
          form.application,
        date:
          interviewDate.toISOString(),
        interviewType:
          form.interviewType,
        meetingLink,
        notes: form.notes.trim(),
      })

      setMessage(
        'Interview scheduled successfully.'
      )

      setForm({
        application: '',
        date: '',
        time: '',
        interviewType:
          'Google Meet',
        meetingLink:
          DEFAULT_MEETING_LINK,
        notes: '',
      })

      await loadData()
    } catch (err) {
      console.error(
        'Schedule interview error:',
        err
      )

      setError(
        err.response?.data?.message ||
          'Failed to schedule interview.'
      )
    } finally {
      setScheduling(false)
    }
  }

  // =====================================================
  // CANCEL INTERVIEW
  // =====================================================

  const handleCancel = async (id) => {
    if (
      !window.confirm(
        'Are you sure you want to cancel this interview?'
      )
    ) {
      return
    }

    try {
      setActionLoading(id)
      setMessage('')
      setError('')

      await api.patch(
        `/interviews/${id}/cancel`
      )

      setMessage(
        'Interview cancelled successfully.'
      )

      await loadData()
    } catch (err) {
      console.error(
        'Cancel interview error:',
        err
      )

      setError(
        err.response?.data?.message ||
          'Failed to cancel interview.'
      )
    } finally {
      setActionLoading(null)
    }
  }

  // =====================================================
  // COMPLETE INTERVIEW
  // =====================================================

  const handleComplete = async (id) => {
    if (
      !window.confirm(
        'Mark this interview as completed?'
      )
    ) {
      return
    }

    try {
      setActionLoading(id)
      setMessage('')
      setError('')

      await api.patch(
        `/interviews/${id}/complete`
      )

      setMessage(
        'Interview marked as completed.'
      )

      await loadData()
    } catch (err) {
      console.error(
        'Complete interview error:',
        err
      )

      setError(
        err.response?.data?.message ||
          'Failed to complete interview.'
      )
    } finally {
      setActionLoading(null)
    }
  }

  // =====================================================
  // DELETE INTERVIEW
  // =====================================================

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        'Are you sure you want to delete this interview?'
      )
    ) {
      return
    }

    try {
      setActionLoading(id)
      setMessage('')
      setError('')

      await api.delete(
        `/interviews/${id}`
      )

      setMessage(
        'Interview deleted successfully.'
      )

      await loadData()
    } catch (err) {
      console.error(
        'Delete interview error:',
        err
      )

      setError(
        err.response?.data?.message ||
          'Failed to delete interview.'
      )
    } finally {
      setActionLoading(null)
    }
  }

  // =====================================================
  // SHORTLIST / REJECT / HIRE
  // =====================================================

  const handleApplicationStatus = async (
    applicationId,
    status
  ) => {
    if (!applicationId) {
      setError(
        'Application ID not found.'
      )
      return
    }

    const actionNames = {
      shortlisted: 'shortlist',
      rejected: 'reject',
      hired: 'hire',
    }

    const successMessages = {
      shortlisted:
        'Candidate shortlisted successfully.',
      rejected:
        'Candidate rejected successfully.',
      hired:
        'Candidate hired successfully.',
    }

    const actionName =
      actionNames[status]

    if (!actionName) {
      setError(
        'Invalid application status.'
      )
      return
    }

    const confirmed =
      window.confirm(
        `Are you sure you want to ${actionName} this candidate?`
      )

    if (!confirmed) {
      return
    }

    try {
      setActionLoading(applicationId)
      setMessage('')
      setError('')

      await api.put(
        `/applications/${applicationId}/status`,
        {
          status,
        }
      )

      setMessage(
        successMessages[status]
      )

      await loadData()
    } catch (err) {
      console.error(
        'Update application status error:',
        err
      )

      setError(
        err.response?.data?.message ||
          'Failed to update candidate status.'
      )
    } finally {
      setActionLoading(null)
    }
  }

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) {
      return '-'
    }

    return new Date(
      date
    ).toLocaleDateString(
      'en-IN',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }
    )
  }

  // =====================================================
  // FORMAT TIME
  // =====================================================

  const formatTime = (date) => {
    if (!date) {
      return '-'
    }

    return new Date(
      date
    ).toLocaleTimeString(
      'en-IN',
      {
        hour: '2-digit',
        minute: '2-digit',
      }
    )
  }

  // =====================================================
  // STATUS STYLE
  // =====================================================

  const getStatusClass = (status) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-700'

      case 'completed':
        return 'bg-green-100 text-green-700'

      case 'cancelled':
        return 'bg-red-100 text-red-700'

      case 'rescheduled':
        return 'bg-yellow-100 text-yellow-700'

      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center gap-3 text-gray-600">
          <RefreshCw
            size={20}
            className="animate-spin"
          />
          Loading interviews...
        </div>
      </div>
    )
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

          <div>
            <button
              type="button"
              onClick={() =>
                navigate('/recruiter')
              }
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-3"
            >
              <ArrowLeft size={17} />
              Back to Dashboard
            </button>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Schedule Interview
            </h1>

            <p className="text-gray-600 mt-1">
              Schedule and manage candidate interviews.
            </p>
          </div>

          <button
            type="button"
            onClick={loadData}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <RefreshCw size={17} />
            Refresh
          </button>
        </div>

        {/* SUCCESS MESSAGE */}

        {message && (
          <div className="mb-5 flex items-center gap-3 rounded-lg bg-green-50 border border-green-200 text-green-700 px-4 py-3">
            <CheckCircle size={20} />
            <span>{message}</span>
          </div>
        )}

        {/* ERROR MESSAGE */}

        {error && (
          <div className="mb-5 flex items-center gap-3 rounded-lg bg-red-50 border border-red-200 text-red-700 px-4 py-3">
            <XCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* ================================================= */}
        {/* NEW INTERVIEW FORM */}
        {/* ================================================= */}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 md:p-6 mb-8">

          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <Calendar size={21} />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                New Interview
              </h2>

              <p className="text-sm text-gray-500">
                Select candidate and interview details.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSchedule}
            className="space-y-5"
          >

            {/* APPLICATION */}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Candidate / Application
              </label>

              <select
                name="application"
                value={form.application}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">
                  Select Application
                </option>

                {applications.map(
                  (application) => {
                    const candidateName =
                      application.applicant?.name ||
                      application.applicant
                        ?.fullName ||
                      application.applicant
                        ?.email ||
                      'Candidate'

                    const jobTitle =
                      application.job
                        ?.title ||
                      'Job'

                    return (
                      <option
                        key={
                          application._id
                        }
                        value={
                          application._id
                        }
                      >
                        {candidateName} —{' '}
                        {jobTitle}
                      </option>
                    )
                  }
                )}
              </select>
            </div>

            {/* DATE + TIME */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Interview Date
                </label>

                <div className="relative">
                  <Calendar
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    min={
                      new Date()
                        .toISOString()
                        .split('T')[0]
                    }
                    className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Interview Time
                </label>

                <div className="relative">
                  <Clock
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="time"
                    name="time"
                    value={form.time}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* INTERVIEW TYPE */}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Interview Type
              </label>

              <select
                name="interviewType"
                value={
                  form.interviewType
                }
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Google Meet">
                  Google Meet
                </option>

                <option value="Zoom">
                  Zoom
                </option>

                <option value="Microsoft Teams">
                  Microsoft Teams
                </option>

                <option value="Phone">
                  Phone
                </option>

                <option value="In-person">
                  In-person
                </option>
              </select>
            </div>

            {/* MEETING LINK */}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meeting Link
              </label>

              <div className="relative">
                <Video
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="url"
                  name="meetingLink"
                  value={
                    form.meetingLink
                  }
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {form.interviewType ===
                'Google Meet' && (
                <p className="text-xs text-gray-500 mt-2">
                  Google Meet uses the fixed meeting
                  link automatically.
                </p>
              )}
            </div>

            {/* NOTES */}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>

              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows={4}
                placeholder="Add interview instructions or notes..."
                className="w-full border border-gray-300 rounded-lg px-3 py-3 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            {/* SUBMIT */}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={scheduling}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {scheduling ? (
                  <>
                    <RefreshCw
                      size={18}
                      className="animate-spin"
                    />
                    Scheduling...
                  </>
                ) : (
                  <>
                    <Calendar
                      size={18}
                    />
                    Schedule Interview
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* ================================================= */}
        {/* INTERVIEW LIST */}
        {/* ================================================= */}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">

          <div className="p-5 md:p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Scheduled Interviews
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Manage interviews and candidate decisions.
            </p>
          </div>

          {interviews.length === 0 ? (
            <div className="p-10 text-center">
              <Calendar
                size={42}
                className="mx-auto text-gray-300 mb-3"
              />

              <h3 className="text-lg font-medium text-gray-700">
                No interviews scheduled
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Schedule an interview using the form above.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">

              {interviews.map(
                (interview) => {
                  const candidate =
                    interview.candidate

                  const job =
                    interview.job

                  const application =
                    interview.application

                  const candidateName =
                    candidate?.name ||
                    candidate?.fullName ||
                    candidate?.email ||
                    'Candidate'

                  const jobTitle =
                    job?.title ||
                    'Job'

                  const applicationId =
                    application?._id ||
                    application

                  const applicationStatus =
                    application?.status

                  const isLoading =
                    actionLoading ===
                      interview._id ||
                    actionLoading ===
                      applicationId

                  return (
                    <div
                      key={interview._id}
                      className="p-5 md:p-6"
                    >
                      <div className="flex flex-col gap-5">

                        {/* INTERVIEW INFO */}

                        <div className="flex-1">

                          {/* STATUS */}

                          <div className="flex flex-wrap items-center gap-2 mb-3">

                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusClass(
                                interview.status
                              )}`}
                            >
                              {interview.status}
                            </span>

                            {applicationStatus && (
                              <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 capitalize">
                                Application:{' '}
                                {
                                  applicationStatus
                                }
                              </span>
                            )}

                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                              {
                                interview.interviewType
                              }
                            </span>
                          </div>

                          {/* CANDIDATE */}

                          <h3 className="text-lg font-semibold text-gray-900">
                            {candidateName}
                          </h3>

                          <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                            <Briefcase
                              size={16}
                            />
                            {jobTitle}
                          </div>

                          {/* DATE / TIME / EMAIL */}

                          <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">

                            <div className="flex items-center gap-2">
                              <Calendar
                                size={16}
                              />
                              {formatDate(
                                interview.date
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              <Clock
                                size={16}
                              />
                              {formatTime(
                                interview.date
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              <User
                                size={16}
                              />
                              {candidate?.email ||
                                'Candidate'}
                            </div>
                          </div>

                          {/* NOTES */}

                          {interview.notes && (
                            <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                              <strong>
                                Notes:
                              </strong>{' '}
                              {interview.notes}
                            </div>
                          )}

                          {/* MEETING LINK */}

                          {interview.meetingLink && (
                            <div className="mt-5 p-4 bg-blue-50 border border-blue-100 rounded-lg">

                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                                <div>
                                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                                    <Video
                                      size={18}
                                      className="text-blue-600"
                                    />

                                    Interview Meeting
                                  </div>

                                  <p className="text-xs text-gray-500 mt-1 break-all">
                                    {
                                      interview.meetingLink
                                    }
                                  </p>
                                </div>

                                <a
                                  href={
                                    interview.meetingLink
                                  }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm whitespace-nowrap"
                                >
                                  <Video
                                    size={17}
                                  />

                                  Join Meeting

                                  <ExternalLink
                                    size={15}
                                  />
                                </a>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* ================================================= */}
                        {/* ACTION BUTTONS */}
                        {/* ================================================= */}

                        <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">

                          {/* COMPLETE */}

                          {interview.status ===
                            'scheduled' && (
                            <>
                              <button
                                type="button"
                                onClick={() =>
                                  handleComplete(
                                    interview._id
                                  )
                                }
                                disabled={
                                  isLoading
                                }
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 text-sm font-medium disabled:opacity-50"
                              >
                                <CheckCircle
                                  size={16}
                                />
                                Complete Interview
                              </button>

                              {/* CANCEL */}

                              <button
                                type="button"
                                onClick={() =>
                                  handleCancel(
                                    interview._id
                                  )
                                }
                                disabled={
                                  isLoading
                                }
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 text-sm font-medium disabled:opacity-50"
                              >
                                <XCircle
                                  size={16}
                                />
                                Cancel
                              </button>
                            </>
                          )}

                          {/* ================================================= */}
                          {/* SHORTLIST / REJECT / HIRE */}
                          {/* ================================================= */}

                          {interview.status ===
                            'completed' &&
                            applicationId && (
                              <>
                                {/* SHORTLIST */}

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleApplicationStatus(
                                      applicationId,
                                      'shortlisted'
                                    )
                                  }
                                  disabled={
                                    isLoading
                                  }
                                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-sm font-medium disabled:opacity-50"
                                >
                                  <CheckCircle
                                    size={16}
                                  />
                                  Shortlist
                                </button>

                                {/* REJECT */}

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleApplicationStatus(
                                      applicationId,
                                      'rejected'
                                    )
                                  }
                                  disabled={
                                    isLoading
                                  }
                                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 text-sm font-medium disabled:opacity-50"
                                >
                                  <XCircle
                                    size={16}
                                  />
                                  Reject
                                </button>

                                {/* HIRE */}

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleApplicationStatus(
                                      applicationId,
                                      'hired'
                                    )
                                  }
                                  disabled={
                                    isLoading
                                  }
                                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 text-sm font-medium disabled:opacity-50"
                                >
                                  <CheckCircle
                                    size={16}
                                  />
                                  Hire
                                </button>
                              </>
                            )}

                          {/* DELETE */}

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                interview._id
                              )
                            }
                            disabled={
                              isLoading
                            }
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm font-medium disabled:opacity-50"
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                }
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ScheduleInterviewPage