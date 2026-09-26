import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Zap } from 'lucide-react'
import { JobCard } from '../../components/jobs'
import api from '../../services/api'

export const RecommendationsPage = () => {
  const { user } = useSelector((state) => state.auth)

  const [recommended, setRecommended] = useState([])
  const [savedJobIds, setSavedJobIds] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadRecommendedJobs()
  }, [])

  // =====================================================
  // LOAD RECOMMENDED JOBS
  // =====================================================
  const loadRecommendedJobs = async () => {
    try {
      setLoading(true)
      setError('')

      // Load real recommended jobs from backend
      const recommendedResponse =
        await api.get('/jobs/recommended')

      const jobs =
        recommendedResponse.data?.data || []

      setRecommended(jobs)

      // Load saved jobs separately.
      // If this request fails, recommendations
      // should still continue working.
      try {
        const savedResponse =
          await api.get('/jobs/saved')

        const savedJobs =
          savedResponse.data?.data || []

        const savedIds = savedJobs
          .map((job) => job?._id || job?.id)
          .filter(Boolean)

        setSavedJobIds(savedIds)
      } catch (savedError) {
        console.error(
          'Load saved jobs error:',
          savedError
        )

        setSavedJobIds([])
      }
    } catch (err) {
      console.error(
        'Load recommended jobs error:',
        err
      )

      setError(
        err.response?.data?.message ||
          'Unable to load recommended jobs'
      )
    } finally {
      setLoading(false)
    }
  }

  // =====================================================
  // SAVE / UNSAVE JOB
  // =====================================================
  const handleSave = async (jobId) => {
    if (!jobId) {
      console.error('Save job failed: Job ID missing')
      return
    }

    try {
      const isSaved =
        savedJobIds.includes(jobId)

      if (isSaved) {
        // UNSAVE
        await api.delete(
          `/jobs/${jobId}/save`
        )

        setSavedJobIds((prev) =>
          prev.filter(
            (id) => id !== jobId
          )
        )
      } else {
        // SAVE
        await api.post(
          `/jobs/${jobId}/save`,
          {}
        )

        setSavedJobIds((prev) => [
          ...prev,
          jobId,
        ])
      }
    } catch (err) {
      console.error(
        'Save job error:',
        err
      )

      alert(
        err.response?.data?.message ||
          'Unable to save job'
      )
    }
  }

  // =====================================================
  // LOADING
  // =====================================================
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-gray-600 dark:text-gray-400">
          Loading recommended jobs...
        </p>
      </div>
    )
  }

  // =====================================================
  // PAGE
  // =====================================================
  return (
    <div className="space-y-6">

      {/* =================================================
          HEADER
      ================================================= */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
          Recommended Jobs
        </h1>

        <p className="text-gray-600 dark:text-gray-400">
          Jobs matched to your profile
          {user?.skills?.length
            ? ` based on: ${user.skills
                .slice(0, 3)
                .join(', ')}`
            : ''}
        </p>
      </div>

      {/* =================================================
          ERROR
      ================================================= */}
      {error && (
        <div className="p-4 rounded-lg border border-red-200 bg-red-50 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300">
          {error}
        </div>
      )}

      {/* =================================================
          RECOMMENDATION INFO
      ================================================= */}
      <div className="flex items-center gap-2 p-4 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg">
        <Zap className="w-5 h-5 text-primary-600 flex-shrink-0" />

        <p className="text-sm text-primary-700 dark:text-primary-300">
          {recommended.length} jobs recommended for you
        </p>
      </div>

      {/* =================================================
          NO JOBS
      ================================================= */}
      {recommended.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-600 dark:text-gray-400">
            No recommended jobs found for your skills.
          </p>
        </div>
      ) : (

        /* =================================================
           JOB GRID
        ================================================= */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

          {recommended.map((job) => {

            // IMPORTANT:
            // Backend MongoDB ID
            const jobId =
              job?._id || job?.id

            return (
              <JobCard
                key={jobId}
                job={job}
                showMatchScore
                isSaved={savedJobIds.includes(jobId)}
                onSave={handleSave}
              />
            )
          })}

        </div>
      )}
    </div>
  )
}

export default RecommendationsPage