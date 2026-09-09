import React, { useEffect, useState } from 'react'
import { Filter, X } from 'lucide-react'
import { Button, Input, Select, Card, LoadingSpinner } from '../../components/common'
import { JobCard } from '../../components/jobs'
import api from '../../services/api'

export const JobsPage = () => {
  const [jobs, setJobs] = useState([])
  const [filteredJobs, setFilteredJobs] = useState([])
  const [savedJobs, setSavedJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const [filters, setFilters] = useState({
    keyword: '',
    location: '',
    jobType: '',
    experienceLevel: '',
    salaryMin: 0,
    salaryMax: 200000,
    remote: false,
  })

  const [sort, setSort] = useState('relevant')

  // =====================================================
  // LOAD JOBS
  // =====================================================

  const loadJobs = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await api.get('/jobs', {
        params: {
          status: 'active',
          limit: 100,
        },
      })

      const data = response.data?.data || []

      setJobs(data)
      setFilteredJobs(data)
    } catch (err) {
      console.error('Load jobs error:', err)

      setError(
        err.response?.data?.message ||
        'Failed to load jobs.'
      )
    } finally {
      setLoading(false)
    }
  }

  // =====================================================
  // LOAD SAVED JOBS
  // =====================================================

  const loadSavedJobs = async () => {
    try {
      const response = await api.get('/jobs/saved')

      const saved = response.data?.data || []

      setSavedJobs(
        saved.map((job) =>
          typeof job === 'string'
            ? job
            : job._id || job.id
        )
      )
    } catch (err) {
      console.error('Load saved jobs error:', err)

      // Don't break jobs page if saved jobs fails
      if (err.response?.status !== 401) {
        console.warn('Could not load saved jobs')
      }
    }
  }

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    loadJobs()
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

      title: job.title || 'Untitled Job',

      company:
        company?.name ||
        job.companyName ||
        job.company ||
        'Company',

      logo:
        company?.logo ||
        job.logo ||
        '',

      location:
        job.location || 'Not specified',

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

      skills: Array.isArray(job.skills)
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
  // FILTER JOBS
  // =====================================================

  const applyFilters = (
    currentFilters,
    currentSort = sort
  ) => {
    let filtered = jobs.filter((rawJob) => {
      const job = normalizeJob(rawJob)

      const keyword =
        currentFilters.keyword.toLowerCase()

      const matchKeyword =
        !keyword ||
        job.title
          .toLowerCase()
          .includes(keyword) ||
        job.company
          .toLowerCase()
          .includes(keyword) ||
        job.skills.some((skill) =>
          String(skill)
            .toLowerCase()
            .includes(keyword)
        )

      const matchLocation =
        !currentFilters.location ||
        job.location
          .toLowerCase()
          .includes(
            currentFilters.location.toLowerCase()
          )

      const matchJobType =
        !currentFilters.jobType ||
        job.jobType === currentFilters.jobType

      const matchExperience =
        !currentFilters.experienceLevel ||
        job.experience
          .toLowerCase()
          .includes(
            currentFilters.experienceLevel.toLowerCase()
          )

      const matchSalary =
        job.salary.max >=
          Number(currentFilters.salaryMin) &&
        job.salary.min <=
          Number(currentFilters.salaryMax)

      const matchRemote =
        !currentFilters.remote ||
        job.remote

      return (
        matchKeyword &&
        matchLocation &&
        matchJobType &&
        matchExperience &&
        matchSalary &&
        matchRemote
      )
    })

    // ===================================================
    // SORT
    // ===================================================

    if (currentSort === 'salary-high') {
      filtered.sort(
        (a, b) =>
          normalizeJob(b).salary.max -
          normalizeJob(a).salary.max
      )
    }

    if (currentSort === 'salary-low') {
      filtered.sort(
        (a, b) =>
          normalizeJob(a).salary.min -
          normalizeJob(b).salary.min
      )
    }

    if (currentSort === 'newest') {
      filtered.sort(
        (a, b) =>
          new Date(
            normalizeJob(b).postedDate
          ) -
          new Date(
            normalizeJob(a).postedDate
          )
      )
    }

    setFilteredJobs(filtered)
  }

  // =====================================================
  // FILTER CHANGE
  // =====================================================

  const handleFilterChange = (
    key,
    value
  ) => {
    const newFilters = {
      ...filters,
      [key]: value,
    }

    setFilters(newFilters)

    applyFilters(
      newFilters,
      sort
    )
  }

  // =====================================================
  // SORT CHANGE
  // =====================================================

  const handleSortChange = (value) => {
    setSort(value)

    applyFilters(
      filters,
      value
    )
  }

  // =====================================================
  // SAVE / UNSAVE JOB
  // =====================================================

  const handleSaveJob = async (jobId) => {
    try {
      setError('')

      const alreadySaved =
        savedJobs.includes(jobId)

      if (alreadySaved) {
        await api.delete(
          `/jobs/${jobId}/save`
        )

        setSavedJobs((prev) =>
          prev.filter(
            (id) => id !== jobId
          )
        )
      } else {
        await api.post(
          `/jobs/${jobId}/save`
        )

        setSavedJobs((prev) => [
          ...prev,
          jobId,
        ])
      }
    } catch (err) {
      console.error(
        'Save job error:',
        err
      )

      setError(
        err.response?.data?.message ||
        'Unable to save job.'
      )
    }
  }

  // =====================================================
  // RESET FILTERS
  // =====================================================

  const handleResetFilters = () => {
    const reset = {
      keyword: '',
      location: '',
      jobType: '',
      experienceLevel: '',
      salaryMin: 0,
      salaryMax: 200000,
      remote: false,
    }

    setFilters(reset)
    applyFilters(reset, sort)
  }

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-8 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="py-16">
            <LoadingSpinner />
            <p className="text-center text-gray-600 dark:text-gray-400 mt-4">
              Loading jobs...
            </p>
          </Card>
        </div>
      </div>
    )
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* HEADER */}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Find Your Next Opportunity
          </h1>

          <p className="text-gray-600 dark:text-gray-400">
            {filteredJobs.length} jobs found
          </p>
        </div>

        {/* ERROR */}

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* FILTERS */}

          <div
            className={`lg:col-span-1 ${
              showFilters
                ? 'block'
                : 'hidden'
            } lg:block`}
          >
            <Card className="sticky top-24">

              <div className="flex items-center justify-between mb-6 lg:hidden">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Filters
                </h3>

                <button
                  onClick={() =>
                    setShowFilters(false)
                  }
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">

                <Input
                  label="Keyword"
                  placeholder="Job title, skill..."
                  value={filters.keyword}
                  onChange={(e) =>
                    handleFilterChange(
                      'keyword',
                      e.target.value
                    )
                  }
                />

                <Input
                  label="Location"
                  placeholder="City or Remote"
                  value={filters.location}
                  onChange={(e) =>
                    handleFilterChange(
                      'location',
                      e.target.value
                    )
                  }
                />

                <Select
                  label="Job Type"
                  value={filters.jobType}
                  onChange={(e) =>
                    handleFilterChange(
                      'jobType',
                      e.target.value
                    )
                  }
                  options={[
                    {
                      value: '',
                      label: 'All Types',
                    },
                    {
                      value: 'Full-time',
                      label: 'Full-time',
                    },
                    {
                      value: 'Part-time',
                      label: 'Part-time',
                    },
                    {
                      value: 'Contract',
                      label: 'Contract',
                    },
                  ]}
                />

                <Select
                  label="Experience Level"
                  value={filters.experienceLevel}
                  onChange={(e) =>
                    handleFilterChange(
                      'experienceLevel',
                      e.target.value
                    )
                  }
                  options={[
                    {
                      value: '',
                      label: 'All Levels',
                    },
                    {
                      value: '0-2',
                      label: 'Entry Level',
                    },
                    {
                      value: '2-5',
                      label: 'Mid Level',
                    },
                    {
                      value: '5+',
                      label: 'Senior',
                    },
                  ]}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Salary up to $
                    {filters.salaryMax.toLocaleString()}
                  </label>

                  <input
                    type="range"
                    min="0"
                    max="200000"
                    step="10000"
                    value={filters.salaryMax}
                    onChange={(e) =>
                      handleFilterChange(
                        'salaryMax',
                        Number(
                          e.target.value
                        )
                      )
                    }
                    className="w-full"
                  />
                </div>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.remote}
                    onChange={(e) =>
                      handleFilterChange(
                        'remote',
                        e.target.checked
                      )
                    }
                    className="rounded"
                  />

                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Remote Only
                  </span>
                </label>

                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={
                    handleResetFilters
                  }
                >
                  Reset Filters
                </Button>
              </div>
            </Card>
          </div>

          {/* JOB LIST */}

          <div className="lg:col-span-3">

            <div className="flex items-center justify-between mb-6">

              <Select
                value={sort}
                onChange={(e) =>
                  handleSortChange(
                    e.target.value
                  )
                }
                options={[
                  {
                    value: 'relevant',
                    label: 'Most Relevant',
                  },
                  {
                    value: 'newest',
                    label: 'Newest',
                  },
                  {
                    value: 'salary-high',
                    label: 'Salary: High to Low',
                  },
                  {
                    value: 'salary-low',
                    label: 'Salary: Low to High',
                  },
                ]}
              />

              <button
                onClick={() =>
                  setShowFilters(
                    !showFilters
                  )
                }
                className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>

            </div>

            {filteredJobs.length === 0 ? (
              <Card className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">
                  No jobs found matching your criteria.
                </p>
              </Card>
            ) : (
              <div className="space-y-4">

                {filteredJobs.map(
                  (rawJob) => {
                    const job =
                      normalizeJob(
                        rawJob
                      )

                    return (
                      <JobCard
                        key={job.id}
                        job={job}
                        onSave={
                          handleSaveJob
                        }
                        isSaved={savedJobs.includes(
                          job.id
                        )}
                        showMatchScore={
                          true
                        }
                      />
                    )
                  }
                )}

              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default JobsPage