import React, { useEffect, useState } from 'react'
import { Bookmark } from 'lucide-react'
import { JobCard } from '../../components/jobs'
import {
  EmptyState,
  Card,
  LoadingSpinner,
} from '../../components/common'
import api from '../../services/api'

export const SavedJobsPage = () => {
  const [savedJobs, setSavedJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // =====================================================
  // LOAD SAVED JOBS
  // =====================================================

  const loadSavedJobs = async () => {
    try {
      setLoading(true)
      setError('')

      const response =
        await api.get('/jobs/saved')

      setSavedJobs(
        response.data?.data || []
      )
    } catch (err) {
      console.error(
        'Load saved jobs error:',
        err
      )

      setError(
        err.response?.data?.message ||
        'Failed to load saved jobs.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSavedJobs()
  }, [])

  // =====================================================
  // NORMALIZE JOB
  // =====================================================

  const normalizeJob = (job) => {
    const company =
      typeof job.company === 'object'
        ? job.company
        : null

    return {
      ...job,

      id: job._id || job.id,

      title:
        job.title ||
        'Untitled Job',

      company:
        company?.name ||
        job.companyName ||
        'Company',

      /*
       * IMPORTANT:
       * Backend company.logo ko use karega.
       */

      logo:
        company?.logo ||
        job.logo ||
        '',

      location:
        job.location ||
        'Not specified',

      jobType:
        job.employmentType ||
        job.jobType ||
        'Full-time',

      experience:
        job.experienceLevel ||
        job.experience ||
        'Entry Level',

      salary: {
        min:
          Number(
            job.salary?.min ??
            job.salaryMin ??
            0
          ),

        max:
          Number(
            job.salary?.max ??
            job.salaryMax ??
            0
          ),
      },

      skills:
        Array.isArray(job.skills)
          ? job.skills
          : [],

      remote:
        job.workMode === 'remote' ||
        job.workMode === 'Remote' ||
        job.remote === true,

      postedDate:
        job.createdAt ||
        job.postedDate ||
        new Date(),
    }
  }

  // =====================================================
  // UNSAVE
  // =====================================================

  const handleUnsave = async (
    jobId
  ) => {
    try {
      setError('')

      await api.delete(
        `/jobs/${jobId}/save`
      )

      setSavedJobs((prev) =>
        prev.filter(
          (job) =>
            (job._id || job.id) !==
            jobId
        )
      )
    } catch (err) {
      console.error(
        'Remove saved job error:',
        err
      )

      setError(
        err.response?.data?.message ||
        'Unable to remove saved job.'
      )
    }
  }

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="space-y-6">

        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            Saved Jobs
          </h1>

          <p className="text-gray-600 dark:text-gray-400">
            Loading saved jobs...
          </p>
        </div>

        <Card className="py-16 text-center">
          <LoadingSpinner />

          <p className="text-gray-600 dark:text-gray-400 mt-4">
            Loading your saved jobs...
          </p>
        </Card>

      </div>
    )
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
          Saved Jobs
        </h1>

        <p className="text-gray-600 dark:text-gray-400">
          {savedJobs.length}{' '}
          job
          {savedJobs.length !== 1
            ? 's'
            : ''}{' '}
          bookmarked
        </p>
      </div>

      {/* ERROR */}

      {error && (
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      {/* EMPTY */}

      {savedJobs.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="No saved jobs"
          description="Bookmark jobs you're interested in and they'll appear here."
        />
      ) : (

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

          {savedJobs.map(
            (rawJob) => {
              const job =
                normalizeJob(
                  rawJob
                )

              return (
                <JobCard
                  key={job.id}
                  job={job}
                  isSaved={true}
                  onSave={
                    handleUnsave
                  }
                />
              )
            }
          )}

        </div>

      )}

    </div>
  )
}

export default SavedJobsPage