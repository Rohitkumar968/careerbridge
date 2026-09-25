import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Bookmark,
  CheckCircle,
  MapPin,
  Briefcase,
  Clock,
} from 'lucide-react'
import api from '../../services/api'

const JobDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isSaved, setIsSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [applying, setApplying] = useState(false)
  const [applied, setApplied] = useState(false)

  useEffect(() => {
    fetchJob()
    checkSavedJob()
  }, [id])

  // =========================
  // FETCH JOB DETAILS
  // =========================
  const fetchJob = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await api.get(`/jobs/${id}`)

      if (response.data?.success) {
        setJob(response.data.data)
      } else {
        setError(response.data?.message || 'Job not found.')
      }
    } catch (err) {
      console.error('Fetch job error:', err)

      setError(
        err.response?.data?.message ||
          'Unable to load job details. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  // =========================
  // CHECK SAVED JOB
  // =========================
  const checkSavedJob = async () => {
    const token = localStorage.getItem('token')

    if (!token) return

    try {
      const response = await api.get('/jobs/saved')

      if (response.data?.success) {
        const savedJobs = response.data.data || []

        const savedIds = savedJobs.map((savedJob) => {
          if (typeof savedJob === 'string') {
            return savedJob
          }

          return savedJob._id || savedJob.id
        })

        setIsSaved(savedIds.includes(id))
      }
    } catch (err) {
      console.error('Check saved job error:', err)
    }
  }

  // =========================
  // SAVE / UNSAVE JOB
  // =========================
  const handleSaveJob = async () => {
    const token = localStorage.getItem('token')

    if (!token) {
      navigate('/login')
      return
    }

    try {
      setSaving(true)
      setError('')

      if (isSaved) {
        await api.delete(`/jobs/${id}/save`)
        setIsSaved(false)
      } else {
        await api.post(`/jobs/${id}/save`, {})
        setIsSaved(true)
      }
    } catch (err) {
      console.error('Save job error:', err)

      setError(
        err.response?.data?.message ||
          'Unable to save this job. Please try again.'
      )
    } finally {
      setSaving(false)
    }
  }

  // =========================
  // APPLY FOR JOB
  // =========================
  const handleApply = async () => {
    const token = localStorage.getItem('token')

    if (!token) {
      navigate('/login')
      return
    }

    try {
      setApplying(true)
      setError('')

      const response = await api.post(
        `/applications/apply/${id}`,
        {
          resume: '',
          coverLetter: '',
        }
      )

      if (response.data?.success) {
        setApplied(true)
      } else {
        setError(
          response.data?.message ||
            'Unable to apply for this job.'
        )
      }
    } catch (err) {
      console.error('Apply job error:', err)

      setError(
        err.response?.data?.message ||
          'Unable to apply for this job. Please try again.'
      )
    } finally {
      setApplying(false)
    }
  }

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>

          <p className="text-gray-600 dark:text-gray-300">
            Loading job details...
          </p>
        </div>
      </div>
    )
  }

  // =========================
  // ERROR
  // =========================
  if (error && !job) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50 dark:bg-gray-950">
        <div className="text-center max-w-md">

          <div className="text-red-500 text-5xl mb-4">
            ⚠️
          </div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Unable to Load Job
          </h2>

          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {error}
          </p>

          <div className="flex justify-center gap-3">

            <button
              onClick={() => navigate('/jobs')}
              className="px-5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              Back to Jobs
            </button>

            <button
              onClick={fetchJob}
              className="px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Try Again
            </button>

          </div>
        </div>
      </div>
    )
  }

  if (!job) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">

      <div className="max-w-6xl mx-auto px-4">

        {/* =========================
            BACK BUTTON
        ========================= */}
        <button
          onClick={() => navigate('/jobs')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 mb-6 transition"
        >
          <ArrowLeft size={20} />
          Back to Jobs
        </button>

        {/* =========================
            ERROR MESSAGE
        ========================= */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* =========================
              MAIN CONTENT
          ========================= */}
          <div className="lg:col-span-2">

            {/* JOB HEADER */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 mb-6">

              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">

                <div className="flex gap-4">

                  {/* Company Icon */}
                  <div className="w-16 h-16 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                    <Briefcase
                      className="text-blue-600 dark:text-blue-400"
                      size={30}
                    />
                  </div>

                  {/* Job Title */}
                  <div>

                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                      {job.title}
                    </h1>

                    <p className="text-lg text-gray-600 dark:text-gray-300 mt-1">
                      {job.company?.name ||
                        job.companyName ||
                        'Company'}
                    </p>

                  </div>

                </div>

                {/* SAVE BUTTON */}
                <button
                  onClick={handleSaveJob}
                  disabled={saving}
                  className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border transition ${
                    isSaved
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >

                  <Bookmark
                    size={19}
                    fill={isSaved ? 'currentColor' : 'none'}
                  />

                  {saving
                    ? 'Saving...'
                    : isSaved
                    ? 'Saved'
                    : 'Save Job'}

                </button>

              </div>

              {/* JOB META */}
              <div className="flex flex-wrap gap-4 mt-6">

                {job.location && (
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <MapPin size={18} />
                    <span>{job.location}</span>
                  </div>
                )}

                {job.jobType && (
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <Briefcase size={18} />
                    <span>{job.jobType}</span>
                  </div>
                )}

                {job.experienceLevel && (
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <Clock size={18} />
                    <span>{job.experienceLevel}</span>
                  </div>
                )}

              </div>

            </div>

            {/* =========================
                JOB DESCRIPTION
            ========================= */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 mb-6">

              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Job Description
              </h2>

              <div className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-7">
                {job.description ||
                  'No description provided.'}
              </div>

            </div>

            {/* =========================
                REQUIREMENTS
            ========================= */}
            {job.requirements && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 mb-6">

                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Requirements
                </h2>

                <div className="text-gray-700 dark:text-gray-300 leading-7">

                  {Array.isArray(job.requirements) ? (
                    job.requirements.map(
                      (requirement, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 mb-3"
                        >

                          <CheckCircle
                            size={18}
                            className="text-blue-600 mt-1 flex-shrink-0"
                          />

                          <span>
                            {requirement}
                          </span>

                        </div>
                      )
                    )
                  ) : (
                    <div className="whitespace-pre-line">
                      {job.requirements}
                    </div>
                  )}

                </div>

              </div>
            )}

            {/* =========================
                SKILLS
            ========================= */}
            {job.skills && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">

                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Skills
                </h2>

                <div className="flex flex-wrap gap-2">

                  {Array.isArray(job.skills) ? (
                    job.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-sm font-medium">
                      {job.skills}
                    </span>
                  )}

                </div>

              </div>
            )}

          </div>

          {/* =========================
              SIDEBAR
          ========================= */}
          <div className="lg:col-span-1">

            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 sticky top-6">

              {/* SALARY */}
              {job.salary && (
                <div className="mb-6">

                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Salary
                  </p>

                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {typeof job.salary === 'object'
                      ? `${job.salary.min || ''} - ${
                          job.salary.max || ''
                        }`
                      : job.salary}
                  </p>

                </div>
              )}

              {/* LOCATION */}
              {job.location && (
                <div className="mb-6">

                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Location
                  </p>

                  <p className="font-medium text-gray-900 dark:text-white">
                    {job.location}
                  </p>

                </div>
              )}

              {/* APPLY BUTTON */}
              {applied ? (
                <div className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 font-semibold">
                  <CheckCircle size={20} />
                  Application Submitted
                </div>
              ) : (
                <button
                  onClick={handleApply}
                  disabled={applying}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
                >
                  {applying
                    ? 'Applying...'
                    : 'Apply Now'}
                </button>
              )}

              <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-3">
                Make sure your profile and resume are updated before applying.
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}

// IMPORTANT:
// index.js uses a named export:
// export { JobDetailsPage } from './JobDetailsPage'

export { JobDetailsPage }
export default JobDetailsPage