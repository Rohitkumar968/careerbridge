import React, {
  useCallback,
  useEffect,
  useState,
} from 'react'

import { useSelector } from 'react-redux'

import {
  Briefcase,
  Bookmark,
  Calendar,
  TrendingUp,
  CheckCircle2,
  Clock3,
  XCircle,
  UserRound,
  ArrowUpRight,
} from 'lucide-react'

import { Card, Button } from '../../components/common'
import { JobCard } from '../../components/jobs'
import api from '../../services/api'

// =====================================================
// SEeker Dashboard
// =====================================================

export const SeekerDashboard = () => {
  const { user } = useSelector(
    (state) => state.auth
  )

  // =====================================================
  // STATE
  // =====================================================

  const [recommendedJobs, setRecommendedJobs] =
    useState([])

  const [savedJobIds, setSavedJobIds] =
    useState([])

  const [applications, setApplications] =
    useState([])

  const [interviews, setInterviews] =
    useState([])

  const [loadingJobs, setLoadingJobs] =
    useState(true)

  const [loadingApplications, setLoadingApplications] =
    useState(true)

  const [loadingInterviews, setLoadingInterviews] =
    useState(true)

  const [jobsError, setJobsError] =
    useState('')

  const [applicationsError, setApplicationsError] =
    useState('')

  const [interviewsError, setInterviewsError] =
    useState('')

  // =====================================================
  // LOAD RECOMMENDED JOBS
  // =====================================================

  useEffect(() => {
    const loadRecommendedJobs = async () => {
      try {
        setLoadingJobs(true)
        setJobsError('')

        const response = await api.get(
          '/jobs/recommended'
        )

        const jobs =
          response?.data?.data || []

        setRecommendedJobs(
          Array.isArray(jobs)
            ? jobs
            : []
        )
      } catch (error) {
        console.error(
          'Load recommended jobs error:',
          error
        )

        setJobsError(
          error?.response?.data?.message ||
            'Unable to load recommended jobs'
        )
      } finally {
        setLoadingJobs(false)
      }
    }

    loadRecommendedJobs()
  }, [])

  // =====================================================
  // LOAD SAVED JOBS
  // =====================================================

  useEffect(() => {
    const loadSavedJobs = async () => {
      try {
        const response =
          await api.get('/jobs/saved')

        const savedJobs =
          response?.data?.data || []

        const savedIds =
          savedJobs
            .map(
              (job) =>
                job?._id ||
                job?.id
            )
            .filter(Boolean)

        setSavedJobIds(savedIds)
      } catch (error) {
        console.error(
          'Load saved jobs error:',
          error
        )

        setSavedJobIds([])
      }
    }

    loadSavedJobs()
  }, [])

  // =====================================================
  // LOAD APPLICATIONS
  // =====================================================

  const loadApplications =
    useCallback(async () => {
      try {
        setLoadingApplications(true)
        setApplicationsError('')

        const response =
          await api.get(
            '/applications/my',
            {
              params: {
                _t: Date.now(),
              },
            }
          )

        const data =
          response?.data?.data || []

        setApplications(
          Array.isArray(data)
            ? data
            : []
        )
      } catch (error) {
        console.error(
          'Load applications error:',
          error
        )

        setApplicationsError(
          error?.response?.data?.message ||
            'Unable to load applications'
        )

        setApplications([])
      } finally {
        setLoadingApplications(false)
      }
    }, [])

  useEffect(() => {
    loadApplications()
  }, [loadApplications])

  // =====================================================
  // LOAD REAL INTERVIEWS
  // =====================================================

  const loadInterviews =
    useCallback(async () => {
      try {
        setLoadingInterviews(true)
        setInterviewsError('')

        /*
          IMPORTANT:

          Dashboard now gets interviews directly
          from /interviews/my.

          It does NOT use application.status ===
          "interview" anymore.

          Therefore if recruiter permanently deletes
          an interview, it disappears from this list.
        */

        const response =
          await api.get(
            '/interviews/my',
            {
              params: {
                _t: Date.now(),
              },
            }
          )

        const data =
          response?.data?.data || []

        const validInterviews =
          Array.isArray(data)
            ? data.filter(
                (interview) =>
                  interview &&
                  interview._id
              )
            : []

        /*
          Remove duplicate interview IDs.
        */

        const uniqueInterviews =
          Array.from(
            new Map(
              validInterviews.map(
                (interview) => [
                  interview._id,
                  interview,
                ]
              )
            ).values()
          )

        setInterviews(
          uniqueInterviews
        )
      } catch (error) {
        console.error(
          'Load interviews error:',
          error
        )

        setInterviewsError(
          error?.response?.data?.message ||
            'Unable to load interviews'
        )

        setInterviews([])
      } finally {
        setLoadingInterviews(false)
      }
    }, [])

  useEffect(() => {
    loadInterviews()
  }, [loadInterviews])

  // =====================================================
  // REFRESH DATA WHEN WINDOW GETS FOCUS
  // =====================================================

  useEffect(() => {
    const handleFocus = () => {
      loadInterviews()
      loadApplications()
    }

    const handleVisibilityChange = () => {
      if (
        document.visibilityState ===
        'visible'
      ) {
        loadInterviews()
        loadApplications()
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
  }, [
    loadInterviews,
    loadApplications,
  ])

  // =====================================================
  // SAVE / UNSAVE JOB
  // =====================================================

  const handleSaveJob = async (
    jobId
  ) => {
    if (!jobId) {
      console.error(
        'Save job failed: Job ID missing'
      )
      return
    }

    try {
      const isSaved =
        savedJobIds.includes(jobId)

      if (isSaved) {
        await api.delete(
          `/jobs/${jobId}/save`
        )

        setSavedJobIds(
          (prev) =>
            prev.filter(
              (id) =>
                id !== jobId
            )
        )
      } else {
        await api.post(
          `/jobs/${jobId}/save`,
          {}
        )

        setSavedJobIds(
          (prev) => [
            ...prev,
            jobId,
          ]
        )
      }
    } catch (error) {
      console.error(
        'Save job error:',
        error
      )

      alert(
        error?.response?.data?.message ||
          'Unable to save job'
      )
    }
  }

  // =====================================================
  // JOIN INTERVIEW
  // =====================================================

  const handleJoinInterview = (
    interview
  ) => {
    const meetingLink =
      interview?.meetingLink ||
      interview?.meetingUrl ||
      interview?.application
        ?.meetingLink ||
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

  // =====================================================
  // APPLICATION STATUS HELPERS
  // =====================================================

  const getStatus = (
    application
  ) => {
    return String(
      application?.status || ''
    ).toLowerCase()
  }

  const isStatus = (
    application,
    ...statuses
  ) => {
    const status =
      getStatus(application)

    return statuses.includes(
      status
    )
  }

  // =====================================================
  // APPLICATION COUNTS
  // =====================================================

  const appliedCount =
    applications.filter(
      (application) =>
        isStatus(
          application,
          'applied'
        )
    ).length

  const screeningCount =
    applications.filter(
      (application) =>
        isStatus(
          application,
          'screening'
        )
    ).length

  const interviewCount =
    interviews.filter(
      (interview) =>
        interview.status ===
          'scheduled' ||
        interview.status ===
          'rescheduled'
    ).length

  const selectedCount =
    applications.filter(
      (application) =>
        isStatus(
          application,
          'selected',
          'accepted',
          'hired'
        )
    ).length

  const rejectedCount =
    applications.filter(
      (application) =>
        isStatus(
          application,
          'rejected'
        )
    ).length

  // =====================================================
  // PROFILE COMPLETION
  // =====================================================

  const calculateProfileCompletion =
    () => {
      if (!user) return 0

      const fields = [
        user.name,
        user.phone,
        user.location,
        user.bio,
        user.skills?.length > 0,
        user.experience?.length > 0,
        user.education?.length > 0,
        user.avatar,
      ]

      const completedFields =
        fields.filter(
          Boolean
        ).length

      return Math.round(
        (completedFields /
          fields.length) *
          100
      )
    }

  const profileCompletion =
    calculateProfileCompletion()

  // =====================================================
  // DASHBOARD STATS
  // =====================================================

  const stats = [
    {
      label: 'Applications',
      value: applications.length,
      icon: Briefcase,
      iconClass:
        'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400',
    },
    {
      label: 'Interviews',
      value: interviewCount,
      icon: Calendar,
      iconClass:
        'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400',
    },
    {
      label: 'Saved Jobs',
      value: savedJobIds.length,
      icon: Bookmark,
      iconClass:
        'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400',
    },
    {
      label: 'Profile',
      value: `${profileCompletion}%`,
      icon: TrendingUp,
      iconClass:
        'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400',
    },
  ]

  // =====================================================
  // STATUS CARDS
  // =====================================================

  const applicationStats = [
    {
      label: 'Applied',
      value: appliedCount,
      icon: Briefcase,
      className:
        'text-slate-700 dark:text-slate-200',
    },
    {
      label: 'Screening',
      value: screeningCount,
      icon: Clock3,
      className:
        'text-amber-600 dark:text-amber-400',
    },
    {
      label: 'Interview',
      value: interviewCount,
      icon: Calendar,
      className:
        'text-indigo-600 dark:text-indigo-400',
    },
    {
      label: 'Selected',
      value: selectedCount,
      icon: CheckCircle2,
      className:
        'text-emerald-600 dark:text-emerald-400',
    },
    {
      label: 'Rejected',
      value: rejectedCount,
      icon: XCircle,
      className:
        'text-rose-600 dark:text-rose-400',
    },
  ]

  // =====================================================
  // UPCOMING INTERVIEWS
  // =====================================================

  const now = new Date()

  const upcomingInterviews =
    interviews.filter(
      (interview) => {
        if (
          !interview?.date
        ) {
          return false
        }

        const interviewDate =
          new Date(
            interview.date
          )

        if (
          Number.isNaN(
            interviewDate.getTime()
          )
        ) {
          return false
        }

        /*
          Only scheduled/rescheduled interviews
          can appear in Upcoming.
        */

        const activeStatus =
          interview.status ===
            'scheduled' ||
          interview.status ===
            'rescheduled'

        return (
          activeStatus &&
          interviewDate > now
        )
      }
    )

  // =====================================================
  // INTERVIEW DATE
  // =====================================================

  const formatInterviewDate =
    (interview) => {
      const date =
        new Date(
          interview.date
        )

      if (
        Number.isNaN(
          date.getTime()
        )
      ) {
        return 'Date not available'
      }

      return date.toLocaleDateString(
        'en-GB',
        {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }
      )
    }

  // =====================================================
  // INTERVIEW TIME
  // =====================================================

  const formatInterviewTime =
    (interview) => {
      const date =
        new Date(
          interview.date
        )

      if (
        Number.isNaN(
          date.getTime()
        )
      ) {
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

  // =====================================================
  // GET JOB TITLE
  // =====================================================

  const getInterviewJobTitle =
    (interview) => {
      if (
        interview?.job &&
        typeof interview.job ===
          'object'
      ) {
        return (
          interview.job.title ||
          'Interview'
        )
      }

      return 'Interview'
    }

  // =====================================================
  // GET COMPANY NAME
  // =====================================================

  const getInterviewCompany =
    (interview) => {
      if (
        interview?.job?.company &&
        typeof interview.job
          .company === 'object'
      ) {
        return (
          interview.job.company
            .name ||
          'Company'
        )
      }

      return 'Company'
    }

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <div className="space-y-8 pb-10">

      {/* =================================================
          WELCOME HEADER
      ================================================= */}

      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">

        <div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-3">

            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />

            Job Seeker Dashboard

          </div>

          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">

            Good morning,{' '}

            {user?.name || 'there'}! 👋

          </h1>

          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Here's what's happening with your job search.
          </p>

        </div>

        <div className="hidden md:flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">

          <UserRound className="w-4 h-4" />

          Profile completion{' '}

          <span className="font-semibold text-indigo-600 dark:text-indigo-400">
            {profileCompletion}%
          </span>

        </div>

      </div>

      {/* =================================================
          STATS
      ================================================= */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

        {stats.map(
          (stat) => {
            const Icon =
              stat.icon

            return (
              <Card
                key={
                  stat.label
                }
                className="border border-slate-200/80 dark:border-slate-700/70 shadow-sm hover:shadow-md transition-shadow duration-200"
              >

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      {stat.label}
                    </p>

                    <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">

                      {loadingApplications &&
                      stat.label ===
                        'Applications'
                        ? '—'
                        : stat.value}

                    </p>

                  </div>

                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.iconClass}`}
                  >

                    <Icon className="w-6 h-6" />

                  </div>

                </div>

              </Card>
            )
          }
        )}

      </div>

      {/* =================================================
          APPLICATION OVERVIEW
      ================================================= */}

      <Card className="border border-slate-200/80 dark:border-slate-700/70 shadow-sm">

        <div className="flex items-center justify-between mb-6">

          <div>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Application Overview
            </h2>

            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Track your applications by current status
            </p>

          </div>

          <div className="hidden sm:flex items-center gap-2 text-sm text-slate-400">

            <Briefcase className="w-4 h-4" />

            {applications.length} total

          </div>

        </div>

        {applicationsError ? (

          <div className="py-6 text-center text-sm text-rose-500">
            {applicationsError}
          </div>

        ) : (

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">

            {applicationStats.map(
              (status) => {

                const Icon =
                  status.icon

                return (
                  <div
                    key={
                      status.label
                    }
                    className="rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 p-4 text-center"
                  >

                    <Icon
                      className={`w-5 h-5 mx-auto mb-2 ${status.className}`}
                    />

                    <div
                      className={`text-2xl font-bold ${status.className}`}
                    >

                      {loadingApplications
                        ? '—'
                        : status.value}

                    </div>

                    <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
                      {status.label}
                    </p>

                  </div>
                )
              }
            )}

          </div>

        )}

      </Card>

      {/* =================================================
          RECOMMENDED JOBS
      ================================================= */}

      <section>

        <div className="flex items-end justify-between mb-5">

          <div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Recommended for You
            </h2>

            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Jobs matched with your profile and skills
            </p>

          </div>

          <div className="hidden sm:flex items-center gap-1 text-sm font-medium text-indigo-600 dark:text-indigo-400">

            <span>
              {recommendedJobs.length} jobs
            </span>

          </div>

        </div>

        {/* Loading */}

        {loadingJobs && (

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {[1, 2, 3, 4].map(
              (item) => (

                <Card
                  key={item}
                  className="border border-slate-200 dark:border-slate-700"
                >

                  <div className="animate-pulse space-y-4">

                    <div className="flex gap-4">

                      <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-700" />

                      <div className="flex-1 space-y-2">

                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />

                        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />

                      </div>

                    </div>

                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />

                    <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded" />

                  </div>

                </Card>

              )
            )}

          </div>

        )}

        {/* Error */}

        {!loadingJobs &&
          jobsError && (

            <Card className="border border-rose-200 dark:border-rose-900/40">

              <div className="text-center py-8">

                <XCircle className="w-10 h-10 mx-auto text-rose-500 mb-3" />

                <p className="text-rose-600 dark:text-rose-400 font-medium">
                  {jobsError}
                </p>

                <Button
                  variant="primary"
                  size="sm"
                  className="mt-4"
                  onClick={() =>
                    window.location.reload()
                  }
                >
                  Try Again
                </Button>

              </div>

            </Card>

          )}

        {/* Empty */}

        {!loadingJobs &&
          !jobsError &&
          recommendedJobs.length ===
            0 && (

            <Card className="border border-slate-200 dark:border-slate-700">

              <div className="text-center py-10">

                <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center mb-4">

                  <Briefcase className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />

                </div>

                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  No recommended jobs yet
                </h3>

                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto">
                  Complete your profile and add your skills
                  to receive personalized job recommendations.
                </p>

              </div>

            </Card>

          )}

        {/* Jobs */}

        {!loadingJobs &&
          !jobsError &&
          recommendedJobs.length >
            0 && (

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {recommendedJobs.map(
                (job) => {

                  const jobId =
                    job?._id ||
                    job?.id

                  return (
                    <JobCard
                      key={jobId}
                      job={job}
                      showMatchScore={
                        true
                      }
                      isSaved={savedJobIds.includes(
                        jobId
                      )}
                      onSave={
                        handleSaveJob
                      }
                    />
                  )
                }
              )}

            </div>

          )}

      </section>

      {/* =================================================
          UPCOMING INTERVIEWS
      ================================================= */}

      <Card className="border border-slate-200/80 dark:border-slate-700/70 shadow-sm">

        <div className="flex items-center justify-between mb-6">

          <div>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Upcoming Interviews
            </h2>

            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Your scheduled interview applications
            </p>

          </div>

          <Calendar className="w-5 h-5 text-indigo-500" />

        </div>

        {/* ERROR */}

        {interviewsError && (

          <div className="py-6 text-center text-sm text-rose-500">
            {interviewsError}
          </div>

        )}

        {/* LOADING */}

        {!interviewsError &&
          loadingInterviews && (

            <div className="flex items-center justify-center py-8">

              <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />

              <span className="ml-3 text-sm text-slate-500 dark:text-slate-400">
                Loading interviews...
              </span>

            </div>

          )}

        {/* UPCOMING LIST */}

        {!loadingInterviews &&
          !interviewsError &&
          upcomingInterviews.length >
            0 && (

            <div className="space-y-3">

              {upcomingInterviews.map(
                (interview) => {

                  const jobTitle =
                    getInterviewJobTitle(
                      interview
                    )

                  const companyName =
                    getInterviewCompany(
                      interview
                    )

                  return (
                    <div
                      key={
                        interview._id
                      }
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/40"
                    >

                      <div className="flex items-start gap-4">

                        <div className="w-11 h-11 rounded-xl bg-indigo-100 dark:bg-indigo-500/10 flex items-center justify-center shrink-0">

                          <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />

                        </div>

                        <div>

                          <h3 className="font-semibold text-slate-900 dark:text-white">
                            {jobTitle}
                          </h3>

                          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            {companyName}
                          </p>

                          <div className="flex flex-wrap items-center gap-3 mt-2">

                            <span className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 dark:text-indigo-400">

                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />

                              Interview stage

                            </span>

                            <span className="text-xs text-slate-500 dark:text-slate-400">

                              {formatInterviewDate(
                                interview
                              )}

                            </span>

                            <span className="text-xs text-slate-500 dark:text-slate-400">

                              {formatInterviewTime(
                                interview
                              )}

                            </span>

                          </div>

                        </div>

                      </div>

                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() =>
                          handleJoinInterview(
                            interview
                          )
                        }
                      >

                        <span className="flex items-center gap-2">

                          Join Interview

                          <ArrowUpRight className="w-4 h-4" />

                        </span>

                      </Button>

                    </div>
                  )
                }
              )}

            </div>

          )}

        {/* EMPTY */}

        {!loadingInterviews &&
          !interviewsError &&
          upcomingInterviews.length ===
            0 && (

            <div className="py-8 text-center">

              <Calendar className="w-10 h-10 mx-auto mb-3 text-slate-300 dark:text-slate-600" />

              <p className="text-sm text-slate-500 dark:text-slate-400">
                No upcoming interviews scheduled
              </p>

            </div>

          )}

      </Card>

      {/* =================================================
          PROFILE COMPLETION
      ================================================= */}

      {profileCompletion < 100 && (

        <Card className="border border-indigo-100 dark:border-indigo-900/40 bg-gradient-to-r from-indigo-50 to-white dark:from-indigo-950/30 dark:to-slate-900">

          <div className="flex flex-col md:flex-row md:items-center gap-5">

            <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-500/10 flex items-center justify-center shrink-0">

              <TrendingUp className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />

            </div>

            <div className="flex-1">

              <div className="flex items-center justify-between mb-2">

                <div>

                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    Complete your profile
                  </h3>

                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    A complete profile helps employers understand
                    your skills and experience.
                  </p>

                </div>

                <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  {profileCompletion}%
                </span>

              </div>

              <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">

                <div
                  className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                  style={{
                    width: `${profileCompletion}%`,
                  }}
                />

              </div>

            </div>

          </div>

        </Card>

      )}

    </div>
  )
}

export default SeekerDashboard