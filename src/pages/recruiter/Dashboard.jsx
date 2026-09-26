import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import {
  Briefcase,
  Users,
  CheckCircle,
  Calendar,
  XCircle,
  UserRound,
  MapPin,
  Mail,
  ExternalLink,
  RefreshCw,
} from 'lucide-react'

import { Card, Button } from '../../components/common'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts'

import api from '../../services/api'

const RecruiterDashboard = () => {
  const navigate = useNavigate()

  const { user } = useSelector(
    (state) => state.auth
  )

  // =====================================================
  // STATE
  // =====================================================

  const [jobs, setJobs] = useState([])
  const [applications, setApplications] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [selectedApplicant, setSelectedApplicant] =
    useState(null)

  // =====================================================
  // LOAD REAL RECRUITER DATA
  // =====================================================

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError('')

      const [
        jobsResponse,
        applicationsResponse,
      ] = await Promise.all([
        api.get('/jobs', {
          params: {
            status: 'active',
            limit: 100,
          },
        }),

        api.get('/applications', {
          params: {
            limit: 100,
          },
        }),
      ])

      const jobsData =
        jobsResponse?.data?.data || []

      const applicationsData =
        applicationsResponse?.data?.data || []

      // =================================================
      // CURRENT RECRUITER ID
      // =================================================

      const recruiterId =
        user?._id || user?.id

      // =================================================
      // ONLY THIS RECRUITER'S JOBS
      // =================================================

      const recruiterJobs = recruiterId
        ? jobsData.filter((job) => {
            const jobRecruiter =
              job?.recruiter

            const jobRecruiterId =
              typeof jobRecruiter === 'object'
                ? jobRecruiter?._id ||
                  jobRecruiter?.id
                : jobRecruiter

            return (
              String(jobRecruiterId) ===
              String(recruiterId)
            )
          })
        : jobsData

      setJobs(recruiterJobs)

      // =================================================
      // FILTER APPLICATIONS
      // =================================================

      const recruiterJobIds = new Set(
        recruiterJobs
          .map(
            (job) =>
              job?._id || job?.id
          )
          .filter(Boolean)
          .map(String)
      )

      const recruiterApplications =
        applicationsData.filter(
          (application) => {
            const applicationJob =
              application?.job

            const applicationJobId =
              typeof applicationJob ===
              'object'
                ? applicationJob?._id ||
                  applicationJob?.id
                : applicationJob

            if (!applicationJobId) {
              return false
            }

            return recruiterJobIds.has(
              String(applicationJobId)
            )
          }
        )

      setApplications(
        recruiterApplications
      )
    } catch (err) {
      console.error(
        'Recruiter dashboard error:',
        err
      )

      setError(
        err?.response?.data?.message ||
          'Unable to load recruiter dashboard data.'
      )

      setJobs([])
      setApplications([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [user?._id])

  // =====================================================
  // STATUS NORMALIZER
  // =====================================================

  const getStatus = (application) => {
    return String(
      application?.status || ''
    )
      .toLowerCase()
      .trim()
  }

  // =====================================================
  // STATS
  // =====================================================

  const activeJobs = jobs.filter(
    (job) =>
      String(job?.status).toLowerCase() ===
      'active'
  )

  const totalApplicants =
    applications.length

  const shortlistedApplicants =
    applications.filter((application) =>
      [
        'shortlisted',
        'shortlist',
      ].includes(
        getStatus(application)
      )
    ).length

  const interviewApplicants =
    applications.filter((application) =>
      [
        'interview',
        'interview_scheduled',
        'interview-scheduled',
        'interview scheduled',
      ].includes(
        getStatus(application)
      )
    ).length

  const hiredApplicants =
    applications.filter((application) =>
      [
        'selected',
        'hired',
        'accepted',
      ].includes(
        getStatus(application)
      )
    ).length

  const screeningApplicants =
    applications.filter(
      (application) =>
        getStatus(application) ===
        'screening'
    ).length

  // =====================================================
  // STATS CARDS
  // =====================================================

  const stats = [
    {
      label: 'Active Jobs',
      value: activeJobs.length,
      icon: Briefcase,
      iconClass:
        'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400',
    },
    {
      label: 'Total Applicants',
      value: totalApplicants,
      icon: Users,
      iconClass:
        'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400',
    },
    {
      label: 'Shortlisted',
      value: shortlistedApplicants,
      icon: CheckCircle,
      iconClass:
        'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400',
    },
    {
      label: 'Interviews',
      value: interviewApplicants,
      icon: Calendar,
      iconClass:
        'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400',
    },
  ]

  // =====================================================
  // APPLICATIONS OVER TIME
  // =====================================================

  const applicationsOverTime =
    useMemo(() => {
      const now = new Date()
      const months = []

      for (let i = 5; i >= 0; i--) {
        const date = new Date(
          now.getFullYear(),
          now.getMonth() - i,
          1
        )

        months.push({
          key: `${date.getFullYear()}-${date.getMonth()}`,
          name: date.toLocaleString(
            'en-US',
            {
              month: 'short',
            }
          ),
          applications: 0,
        })
      }

      applications.forEach(
        (application) => {
          const rawDate =
            application?.createdAt ||
            application?.appliedAt ||
            application?.applicationDate

          if (!rawDate) return

          const date = new Date(
            rawDate
          )

          if (
            Number.isNaN(
              date.getTime()
            )
          ) {
            return
          }

          const key =
            `${date.getFullYear()}-${date.getMonth()}`

          const month =
            months.find(
              (item) =>
                item.key === key
            )

          if (month) {
            month.applications += 1
          }
        }
      )

      return months
    }, [applications])

  // =====================================================
  // HIRING PERFORMANCE
  // =====================================================

  const hiringPerformance =
    useMemo(() => {
      return [
        {
          name: 'Applied',
          value: totalApplicants,
        },
        {
          name: 'Screening',
          value: screeningApplicants,
        },
        {
          name: 'Shortlisted',
          value: shortlistedApplicants,
        },
        {
          name: 'Interview',
          value: interviewApplicants,
        },
        {
          name: 'Selected',
          value: hiredApplicants,
        },
      ]
    }, [
      totalApplicants,
      screeningApplicants,
      shortlistedApplicants,
      interviewApplicants,
      hiredApplicants,
    ])

  // =====================================================
  // RECENT APPLICANTS
  // =====================================================

  const recentApplicants =
    useMemo(() => {
      return [...applications]
        .sort((a, b) => {
          const dateA =
            new Date(
              a?.createdAt ||
                a?.appliedAt ||
                0
            ).getTime()

          const dateB =
            new Date(
              b?.createdAt ||
                b?.appliedAt ||
                0
            ).getTime()

          return dateB - dateA
        })
        .slice(0, 5)
    }, [applications])

  // =====================================================
  // APPLICANT HELPERS
  // =====================================================

  const getApplicant = (
    application
  ) => {
    return (
      application?.applicant ||
      application?.candidate ||
      application?.user ||
      application?.seeker ||
      {}
    )
  }

  const getApplicantName = (
    application
  ) => {
    const applicant =
      getApplicant(application)

    return (
      applicant?.name ||
      applicant?.fullName ||
      application?.applicantName ||
      application?.candidateName ||
      'Candidate'
    )
  }

  const getApplicantEmail = (
    application
  ) => {
    const applicant =
      getApplicant(application)

    return (
      applicant?.email ||
      application?.email ||
      'Email not available'
    )
  }

  const getApplicantLocation = (
    application
  ) => {
    const applicant =
      getApplicant(application)

    return (
      applicant?.location ||
      application?.location ||
      'Location not available'
    )
  }

  // =====================================================
  // JOB TITLE
  // =====================================================

  const getApplicationJob = (
    application
  ) => {
    const job =
      application?.job

    if (
      job &&
      typeof job === 'object'
    ) {
      return (
        job?.title ||
        'Job'
      )
    }

    const jobId =
      application?.job

    const matchedJob =
      jobs.find(
        (item) =>
          String(
            item?._id ||
              item?.id
          ) ===
          String(jobId)
      )

    return (
      matchedJob?.title ||
      'Job'
    )
  }

  // =====================================================
  // STATUS BADGE
  // =====================================================

  const getStatusBadge = (
    application
  ) => {
    const status =
      getStatus(application)

    const config = {
      applied: {
        label: 'Applied',
        className:
          'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200',
      },

      screening: {
        label: 'Screening',
        className:
          'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
      },

      shortlisted: {
        label: 'Shortlisted',
        className:
          'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400',
      },

      interview: {
        label: 'Interview',
        className:
          'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
      },

      interview_scheduled: {
        label: 'Interview',
        className:
          'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
      },

      'interview-scheduled': {
        label: 'Interview',
        className:
          'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
      },

      selected: {
        label: 'Selected',
        className:
          'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
      },

      hired: {
        label: 'Hired',
        className:
          'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
      },

      rejected: {
        label: 'Rejected',
        className:
          'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400',
      },
    }

    return (
      config[status] || {
        label:
          application?.status ||
          'Unknown',
        className:
          'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200',
      }
    )
  }

  // =====================================================
  // VIEW APPLICANT
  // =====================================================

  const handleViewApplicant = (
    application
  ) => {
    setSelectedApplicant(
      application
    )
  }

  // =====================================================
  // QUICK ACTIONS
  // =====================================================

  const handlePostJob = () => {
    navigate(
      '/recruiter/jobs/create'
    )
  }

  const handleViewApplicants = () => {
    document
      .getElementById(
        'recent-applicants'
      )
      ?.scrollIntoView({
        behavior: 'smooth',
      })
  }

  // =====================================================
  // IMPORTANT:
  // REVIEW INTERVIEWS
  // =====================================================

  const handleReviewInterviews = () => {
    navigate(
      '/recruiter/interviews/schedule'
    )
  }

  // =====================================================
  // SCHEDULE INTERVIEW
  // =====================================================

  const handleScheduleInterview = () => {
    navigate(
      '/recruiter/interviews/schedule'
    )
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="space-y-8 pb-10">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">

        <div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-3">

            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />

            Recruiter Dashboard

          </div>

          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">

            Welcome back,{' '}
            {user?.name || 'Recruiter'}! 👋

          </h1>

          <p className="text-slate-500 dark:text-slate-400 mt-2">

            Manage your hiring pipeline and track your recruitment activity.

          </p>

        </div>

        <Button
          variant="primary"
          onClick={handlePostJob}
        >
          <span className="flex items-center gap-2">

            <Briefcase className="w-4 h-4" />

            Post New Job

          </span>
        </Button>

      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <Card className="border border-rose-200 dark:border-rose-900/40">

          <div className="flex items-center justify-between gap-4">

            <div className="flex items-center gap-3">

              <XCircle className="w-5 h-5 text-rose-500" />

              <p className="text-sm text-rose-600 dark:text-rose-400">
                {error}
              </p>

            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={
                loadDashboardData
              }
            >
              <span className="flex items-center gap-2">

                <RefreshCw className="w-4 h-4" />

                Retry

              </span>
            </Button>

          </div>

        </Card>
      )}

      {/* =================================================
          STATS
      ================================================= */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

        {stats.map((stat) => {
          const Icon = stat.icon

          return (
            <Card
              key={stat.label}
              className="border border-slate-200/80 dark:border-slate-700/70 shadow-sm hover:shadow-md transition-shadow duration-200"
            >

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    {stat.label}
                  </p>

                  <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                    {loading
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
        })}

      </div>

      {/* =================================================
          CHARTS
      ================================================= */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Applications Over Time */}

        <Card className="border border-slate-200/80 dark:border-slate-700/70 shadow-sm">

          <div className="mb-5">

            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Applications Over Time
            </h3>

            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Actual applications received during the last 6 months
            </p>

          </div>

          <ResponsiveContainer
            width="100%"
            height={300}
          >

            <LineChart
              data={
                applicationsOverTime
              }
            >

              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="name"
              />

              <YAxis
                allowDecimals={false}
              />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="applications"
                stroke="#4f46e5"
                strokeWidth={3}
                dot={{
                  r: 4,
                }}
                activeDot={{
                  r: 6,
                }}
              />

            </LineChart>

          </ResponsiveContainer>

        </Card>

        {/* Hiring Performance */}

        <Card className="border border-slate-200/80 dark:border-slate-700/70 shadow-sm">

          <div className="mb-5">

            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Hiring Pipeline
            </h3>

            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Current application status breakdown
            </p>

          </div>

          <ResponsiveContainer
            width="100%"
            height={300}
          >

            <BarChart
              data={
                hiringPerformance
              }
            >

              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="name"
              />

              <YAxis
                allowDecimals={false}
              />

              <Tooltip />

              <Bar
                dataKey="value"
                fill="#10b981"
                radius={[
                  6,
                  6,
                  0,
                  0,
                ]}
              />

            </BarChart>

          </ResponsiveContainer>

        </Card>

      </div>

      {/* =================================================
          PIPELINE SUMMARY
      ================================================= */}

      <Card className="border border-slate-200/80 dark:border-slate-700/70 shadow-sm">

        <div className="mb-5">

          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Hiring Pipeline
          </h3>

          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time application status summary
          </p>

        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">

          {[
            {
              label: 'Applied',
              value:
                applications.filter(
                  (a) =>
                    getStatus(a) ===
                    'applied'
                ).length,
              className:
                'text-slate-700 dark:text-slate-200',
            },

            {
              label: 'Screening',
              value:
                screeningApplicants,
              className:
                'text-amber-600 dark:text-amber-400',
            },

            {
              label: 'Shortlisted',
              value:
                shortlistedApplicants,
              className:
                'text-indigo-600 dark:text-indigo-400',
            },

            {
              label: 'Interview',
              value:
                interviewApplicants,
              className:
                'text-blue-600 dark:text-blue-400',
            },

            {
              label: 'Selected',
              value:
                hiredApplicants,
              className:
                'text-emerald-600 dark:text-emerald-400',
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 p-4 text-center"
            >

              <p
                className={`text-2xl font-bold ${item.className}`}
              >
                {loading
                  ? '—'
                  : item.value}
              </p>

              <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
                {item.label}
              </p>

            </div>
          ))}

        </div>

      </Card>

      {/* =================================================
          RECENT APPLICANTS
      ================================================= */}

      <Card
        id="recent-applicants"
        className="border border-slate-200/80 dark:border-slate-700/70 shadow-sm"
      >

        <div className="flex items-center justify-between mb-6">

          <div>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Recent Applicants
            </h3>

            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Latest candidates who applied to your jobs
            </p>

          </div>

          <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
            {applications.length} total
          </span>

        </div>

        {loading ? (
          <div className="space-y-3">

            {[1, 2, 3].map(
              (item) => (
                <div
                  key={item}
                  className="animate-pulse h-20 rounded-xl bg-slate-100 dark:bg-slate-800"
                />
              )
            )}

          </div>
        ) : recentApplicants.length ===
          0 ? (
          <div className="py-10 text-center">

            <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center mb-4">

              <Users className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />

            </div>

            <h4 className="font-semibold text-slate-900 dark:text-white">
              No applicants yet
            </h4>

            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Applicants will appear here when candidates apply to your jobs.
            </p>

          </div>
        ) : (
          <div className="space-y-3">

            {recentApplicants.map(
              (application) => {

                const applicant =
                  getApplicant(
                    application
                  )

                const status =
                  getStatusBadge(
                    application
                  )

                return (
                  <div
                    key={
                      application?._id ||
                      application?.id
                    }
                    className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors"
                  >

                    <div className="flex items-center gap-4">

                      <div className="w-11 h-11 rounded-xl bg-indigo-100 dark:bg-indigo-500/10 flex items-center justify-center shrink-0 overflow-hidden">

                        {applicant?.avatar ? (
                          <img
                            src={
                              applicant.avatar
                            }
                            alt={
                              getApplicantName(
                                application
                              )
                            }
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <UserRound className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        )}

                      </div>

                      <div className="min-w-0">

                        <p className="font-semibold text-slate-900 dark:text-white truncate">
                          {getApplicantName(
                            application
                          )}
                        </p>

                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {getApplicationJob(
                            application
                          )}
                        </p>

                      </div>

                    </div>

                    <div className="flex flex-wrap items-center gap-3">

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${status.className}`}
                      >
                        {status.label}
                      </span>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleViewApplicant(
                            application
                          )
                        }
                      >
                        View Profile
                      </Button>

                    </div>

                  </div>
                )
              }
            )}

          </div>
        )}

      </Card>

      {/* =================================================
          QUICK ACTIONS
      ================================================= */}

      <Card className="border border-slate-200/80 dark:border-slate-700/70 shadow-sm">

        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-5">
          Quick Actions
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

          {/* POST JOB */}

          <Button
            variant="primary"
            className="w-full"
            onClick={handlePostJob}
          >

            <span className="flex items-center justify-center gap-2">

              <Briefcase className="w-4 h-4" />

              Post New Job

            </span>

          </Button>

          {/* VIEW APPLICANTS */}

          <Button
            variant="secondary"
            className="w-full"
            onClick={handleViewApplicants}
          >

            <span className="flex items-center justify-center gap-2">

              <Users className="w-4 h-4" />

              View Applicants

            </span>

          </Button>

          {/* REVIEW INTERVIEWS */}

          <Button
            variant="outline"
            className="w-full"
            onClick={
              handleReviewInterviews
            }
          >

            <span className="flex items-center justify-center gap-2">

              <Calendar className="w-4 h-4" />

              Review Interviews

            </span>

          </Button>

          {/* SCHEDULE INTERVIEW */}

          <Button
            variant="outline"
            className="w-full"
            onClick={
              handleScheduleInterview
            }
          >

            <span className="flex items-center justify-center gap-2">

              <Calendar className="w-4 h-4" />

              Schedule Interview

            </span>

          </Button>

        </div>

      </Card>

      {/* =================================================
          APPLICANT PROFILE MODAL
      ================================================= */}

      {selectedApplicant && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm"
          onClick={() =>
            setSelectedApplicant(
              null
            )
          }
        >

          <div
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* HEADER */}

            <div className="p-6 border-b border-slate-200 dark:border-slate-700">

              <div className="flex items-start justify-between gap-4">

                <div className="flex items-center gap-4">

                  <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-500/10 flex items-center justify-center overflow-hidden">

                    {getApplicant(
                      selectedApplicant
                    )?.avatar ? (
                      <img
                        src={
                          getApplicant(
                            selectedApplicant
                          ).avatar
                        }
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserRound className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
                    )}

                  </div>

                  <div>

                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                      {getApplicantName(
                        selectedApplicant
                      )}
                    </h2>

                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {getApplicationJob(
                        selectedApplicant
                      )}
                    </p>

                  </div>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedApplicant(
                      null
                    )
                  }
                  className="w-9 h-9 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 text-xl"
                >
                  ×
                </button>

              </div>

            </div>

            {/* BODY */}

            <div className="p-6 space-y-6">

              {/* CONTACT */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60">

                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm mb-1">

                    <Mail className="w-4 h-4" />

                    Email

                  </div>

                  <p className="font-medium text-slate-900 dark:text-white break-all">
                    {getApplicantEmail(
                      selectedApplicant
                    )}
                  </p>

                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60">

                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm mb-1">

                    <MapPin className="w-4 h-4" />

                    Location

                  </div>

                  <p className="font-medium text-slate-900 dark:text-white">
                    {getApplicantLocation(
                      selectedApplicant
                    )}
                  </p>

                </div>

              </div>

              {/* STATUS */}

              <div>

                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
                  Application Status
                </p>

                {(() => {
                  const status =
                    getStatusBadge(
                      selectedApplicant
                    )

                  return (
                    <span
                      className={`inline-flex px-3 py-1.5 rounded-full text-sm font-semibold ${status.className}`}
                    >
                      {status.label}
                    </span>
                  )
                })()}

              </div>

              {/* EXPERIENCE */}

              {getApplicant(
                selectedApplicant
              )?.experience && (
                <div>

                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                    Experience
                  </h3>

                  <p className="text-sm text-slate-600 dark:text-slate-400">

                    {Array.isArray(
                      getApplicant(
                        selectedApplicant
                      ).experience
                    )
                      ? getApplicant(
                          selectedApplicant
                        )
                          .experience
                          .map(
                            (item) =>
                              item?.title ||
                              item?.position ||
                              item?.role ||
                              'Experience'
                          )
                          .join(', ')
                      : String(
                          getApplicant(
                            selectedApplicant
                          ).experience
                        )}

                  </p>

                </div>
              )}

              {/* SKILLS */}

              {Array.isArray(
                getApplicant(
                  selectedApplicant
                )?.skills
              ) &&
                getApplicant(
                  selectedApplicant
                ).skills.length >
                  0 && (
                  <div>

                    <h3 className="font-semibold text-slate-900 dark:text-white mb-3">
                      Skills
                    </h3>

                    <div className="flex flex-wrap gap-2">

                      {getApplicant(
                        selectedApplicant
                      ).skills.map(
                        (skill, index) => (
                          <span
                            key={`${skill}-${index}`}
                            className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 text-sm font-medium"
                          >
                            {typeof skill ===
                            'string'
                              ? skill
                              : skill?.name ||
                                'Skill'}
                          </span>
                        )
                      )}

                    </div>

                  </div>
                )}

              {/* RESUME */}

              {selectedApplicant?.resume && (
                <a
                  href={
                    typeof selectedApplicant.resume ===
                    'string'
                      ? selectedApplicant.resume
                      : selectedApplicant.resume?.url
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  View Resume
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}

            </div>

            {/* FOOTER */}

            <div className="p-6 border-t border-slate-200 dark:border-slate-700 flex justify-end">

              <Button
                variant="outline"
                onClick={() =>
                  setSelectedApplicant(
                    null
                  )
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

export default RecruiterDashboard