import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Search,
  Briefcase,
  Users,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  Zap,
  Building2,
} from 'lucide-react'

import { Button, Card } from '../../components/common'
import { JobCard } from '../../components/jobs'
import api from '../../services/api'

export const LandingPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchLocation, setSearchLocation] = useState('')

  const [jobs, setJobs] = useState([])
  const [companies, setCompanies] = useState([])

  const [loadingJobs, setLoadingJobs] = useState(true)
  const [loadingCompanies, setLoadingCompanies] = useState(true)

  // =====================================================
  // LOAD REAL JOBS + COMPANIES
  // =====================================================

  useEffect(() => {
    const loadLandingData = async () => {
      try {
        const [jobsRes, companiesRes] = await Promise.all([
          api.get('/jobs', {
            params: {
              status: 'active',
              limit: 3,
              page: 1,
            },
          }),

          api.get('/companies', {
            params: {
              limit: 3,
              page: 1,
            },
          }),
        ])

        setJobs(jobsRes.data?.data || [])
        setCompanies(companiesRes.data?.data || [])
      } catch (error) {
        console.error('Landing page data error:', error)
      } finally {
        setLoadingJobs(false)
        setLoadingCompanies(false)
      }
    }

    loadLandingData()
  }, [])

  // =====================================================
  // STATS
  // =====================================================

  const stats = [
    {
      label: '10,000+',
      description: 'Active Jobs',
      icon: Briefcase,
    },
    {
      label: '5,000+',
      description: 'Companies',
      icon: Users,
    },
    {
      label: '25,000+',
      description: 'Candidates',
      icon: Users,
    },
    {
      label: '95%',
      description: 'Match Accuracy',
      icon: TrendingUp,
    },
  ]

  // =====================================================
  // FEATURES
  // =====================================================

  const features = [
    {
      title: 'AI Resume Analyzer',
      description:
        'Instant AI feedback with ATS scoring and improvement tips.',
    },
    {
      title: 'Smart Job Matching',
      description:
        'Skill-based matching surfaces the right roles automatically.',
    },
    {
      title: 'Interview Prep',
      description:
        'AI-guided preparation tailored to each role and company.',
    },
    {
      title: 'Candidate Ranking',
      description:
        'Recruiters get ranked shortlists — no manual screening.',
    },
  ]

  // =====================================================
  // JOB SEEKER STEPS
  // =====================================================

  const seekerSteps = [
    {
      number: '01',
      title: 'Create Profile',
      description: 'Build your professional profile in minutes',
    },
    {
      number: '02',
      title: 'Upload Resume',
      description: 'AI analyzes and scores your resume instantly',
    },
    {
      number: '03',
      title: 'Get Matches',
      description: 'Receive curated AI-powered job recommendations',
    },
    {
      number: '04',
      title: 'Apply & Track',
      description: 'Apply with one click and track every application',
    },
  ]

  // =====================================================
  // RECRUITER STEPS
  // =====================================================

  const recruiterSteps = [
    {
      number: '01',
      title: 'Company Profile',
      description: 'Set up your employer brand page',
    },
    {
      number: '02',
      title: 'Post Jobs',
      description: 'Publish openings in under 5 minutes',
    },
    {
      number: '03',
      title: 'AI Shortlisting',
      description: 'Get ranked candidates automatically',
    },
    {
      number: '04',
      title: 'Hire Faster',
      description: 'Manage pipeline and schedule interviews',
    },
  ]

  // =====================================================
  // SEARCH
  // =====================================================

  const handleSearch = () => {
    const params = new URLSearchParams()

    if (searchQuery.trim()) {
      params.set('q', searchQuery.trim())
    }

    if (searchLocation.trim()) {
      params.set('location', searchLocation.trim())
    }

    const queryString = params.toString()

    window.location.href = queryString
      ? `/jobs?${queryString}`
      : '/jobs'
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="bg-surface dark:bg-surface-dark">

      {/* =================================================
          HERO
      ================================================= */}

      <section className="relative overflow-hidden px-4 pb-28 pt-20 sm:px-6 lg:px-8">

        <div className="absolute inset-0 bg-hero-gradient dark:bg-hero-gradient-dark" />

        <div
          className="absolute -right-24 -top-24 h-96 w-96 rounded-full opacity-20 blur-3xl"
          style={{
            background:
              'radial-gradient(circle, #7c3aed, transparent)',
          }}
        />

        <div
          className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full opacity-15 blur-3xl"
          style={{
            background:
              'radial-gradient(circle, #4f46e5, transparent)',
          }}
        />

        <div className="relative mx-auto max-w-7xl">

          <div className="mb-12 text-center">

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-200 bg-white px-4 py-1.5 text-sm font-medium text-primary-700 dark:border-primary-800 dark:bg-primary-950 dark:text-primary-300">

              <Zap className="h-3.5 w-3.5" />

              AI-Powered Recruitment Platform

            </div>


            <h1 className="mb-6 text-5xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white md:text-6xl">

              Find the Right Opportunity.
              <br />

              <span className="text-brand-gradient">
                Build Your Future.
              </span>

            </h1>


            <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-400">

              CareerBridge connects talented professionals with great
              companies using AI-powered job matching and intelligent
              recruitment tools.

            </p>


            <div className="flex flex-col justify-center gap-3 sm:flex-row">

              <Link to="/jobs">

                <Button size="lg">

                  Find Jobs

                  <ArrowRight className="h-4 w-4" />

                </Button>

              </Link>


              <Link to="/register">

                <Button
                  variant="outline"
                  size="lg"
                >
                  Post a Job
                </Button>

              </Link>

            </div>

          </div>


          {/* SEARCH */}

          <Card className="mx-auto max-w-3xl shadow-brand">

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">

              <div>

                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">

                  Role or Skill

                </label>

                <input
                  type="text"
                  placeholder="React Developer, Designer…"
                  value={searchQuery}
                  onChange={(e) =>
                    setSearchQuery(e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch()
                    }
                  }}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                />

              </div>


              <div>

                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">

                  Location

                </label>

                <input
                  type="text"
                  placeholder="City or Remote"
                  value={searchLocation}
                  onChange={(e) =>
                    setSearchLocation(e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch()
                    }
                  }}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                />

              </div>


              <div className="flex items-end">

                <Button
                  className="w-full"
                  onClick={handleSearch}
                >

                  <Search className="h-4 w-4" />

                  Search Jobs

                </Button>

              </div>

            </div>

          </Card>

        </div>

      </section>


      {/* =================================================
          STATS
      ================================================= */}

      <section className="border-y border-slate-200 bg-white px-4 py-14 dark:border-slate-800 dark:bg-slate-900 sm:px-6 lg:px-8">

        <div className="mx-auto max-w-7xl">

          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">

            {stats.map((stat) => {

              const Icon = stat.icon

              return (

                <div
                  key={stat.label}
                  className="text-center"
                >

                  <div
                    className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{
                      background:
                        'linear-gradient(135deg, #eef2ff, #f5f3ff)',
                    }}
                  >

                    <Icon className="h-5 w-5 text-primary-600" />

                  </div>


                  <div className="text-3xl font-extrabold text-slate-900 dark:text-white">

                    {stat.label}

                  </div>


                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">

                    {stat.description}

                  </p>

                </div>

              )

            })}

          </div>

        </div>

      </section>


      {/* =================================================
          FEATURED JOBS
      ================================================= */}

      <section className="px-4 py-20 sm:px-6 lg:px-8">

        <div className="mx-auto max-w-7xl">

          <div className="mb-10 flex items-end justify-between">

            <div>

              <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">

                Opportunities

              </p>

              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">

                Featured Jobs

              </h2>

            </div>


            <Link
              to="/jobs"
              className="hidden items-center gap-1 text-sm font-semibold text-primary-600 transition-colors hover:text-primary-700 dark:text-primary-400 sm:flex"
            >

              View all

              <ArrowRight className="h-4 w-4" />

            </Link>

          </div>


          <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">

            {loadingJobs ? (

              <div className="col-span-full py-10 text-center text-slate-500 dark:text-slate-400">

                Loading jobs...

              </div>

            ) : jobs.length > 0 ? (

              jobs.slice(0, 3).map((job) => (

                <JobCard
                  key={job._id || job.id}
                  job={{
                    ...job,
                    id: job._id || job.id,
                  }}
                />

              ))

            ) : (

              <div className="col-span-full py-10 text-center text-slate-500 dark:text-slate-400">

                No active jobs available right now.

              </div>

            )}

          </div>


          <div className="text-center sm:hidden">

            <Link to="/jobs">

              <Button variant="outline">

                View All Jobs

                <ArrowRight className="h-4 w-4" />

              </Button>

            </Link>

          </div>

        </div>

      </section>


      {/* =================================================
          HOW IT WORKS
      ================================================= */}

      <section className="border-y border-slate-200 bg-white px-4 py-20 dark:border-slate-800 dark:bg-slate-900 sm:px-6 lg:px-8">

        <div className="mx-auto max-w-7xl">

          <div className="mb-14 text-center">

            <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">

              Simple Process

            </p>

            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">

              How It Works

            </h2>

          </div>


          <div className="grid gap-12 md:grid-cols-2">

            {[
              {
                title: 'For Job Seekers',
                steps: seekerSteps,
              },
              {
                title: 'For Recruiters',
                steps: recruiterSteps,
              },
            ].map(({ title, steps }) => (

              <div key={title}>

                <h3 className="mb-7 text-xl font-bold text-slate-900 dark:text-white">

                  {title}

                </h3>


                <div className="space-y-5">

                  {steps.map((step) => (

                    <div
                      key={step.number}
                      className="flex items-start gap-4"
                    >

                      <div
                        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white shadow-brand"
                        style={{
                          background:
                            'linear-gradient(135deg, #4f46e5, #7c3aed)',
                        }}
                      >

                        {step.number}

                      </div>


                      <div className="pt-1">

                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white">

                          {step.title}

                        </h4>

                        <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">

                          {step.description}

                        </p>

                      </div>

                    </div>

                  ))}

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>


      {/* =================================================
          AI FEATURES
      ================================================= */}

      <section className="px-4 py-20 sm:px-6 lg:px-8">

        <div className="mx-auto max-w-7xl">

          <div className="mb-12 text-center">

            <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">

              Intelligence Built In

            </p>

            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">

              Powered by AI

            </h2>

          </div>


          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">

            {features.map((feature) => (

              <Card
                key={feature.title}
                className="hover:border-primary-200 dark:hover:border-primary-800"
              >

                <div
                  className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{
                    background:
                      'linear-gradient(135deg, #eef2ff, #f5f3ff)',
                  }}
                >

                  <CheckCircle className="h-5 w-5 text-primary-600" />

                </div>


                <h3 className="mb-2 text-sm font-semibold text-slate-900 dark:text-white">

                  {feature.title}

                </h3>


                <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">

                  {feature.description}

                </p>

              </Card>

            ))}

          </div>

        </div>

      </section>


      {/* =================================================
          FEATURED COMPANIES
      ================================================= */}

      <section className="border-y border-slate-200 bg-white px-4 py-20 dark:border-slate-800 dark:bg-slate-900 sm:px-6 lg:px-8">

        <div className="mx-auto max-w-7xl">

          <div className="mb-10 flex items-end justify-between">

            <div>

              <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">

                Top Employers

              </p>

              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">

                Featured Companies

              </h2>

            </div>


            <Link
              to="/companies"
              className="hidden items-center gap-1 text-sm font-semibold text-primary-600 transition-colors hover:text-primary-700 dark:text-primary-400 sm:flex"
            >

              View all

              <ArrowRight className="h-4 w-4" />

            </Link>

          </div>


          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

            {loadingCompanies ? (

              <div className="col-span-full py-10 text-center text-slate-500 dark:text-slate-400">

                Loading companies...

              </div>

            ) : companies.length > 0 ? (

              companies.slice(0, 3).map((company) => (

                <Card
                  key={company._id || company.id}
                  className="transition-shadow hover:shadow-lg"
                >

                  {/* Company Header */}

                  <div className="flex items-start gap-4">

                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-primary-100 dark:bg-primary-900/40">

                      {company.logo ? (

                        <img
                          src={company.logo}
                          alt={company.name || 'Company'}
                          className="h-14 w-14 object-cover"
                        />

                      ) : (

                        <Building2 className="h-7 w-7 text-primary-600" />

                      )}

                    </div>


                    <div className="min-w-0">

                      <h3 className="truncate text-lg font-bold text-slate-900 dark:text-white">

                        {company.name || 'Company'}

                      </h3>


                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">

                        {company.industry || 'Company'}

                      </p>

                    </div>

                  </div>


                  {/* Description */}

                  <p className="mt-5 line-clamp-3 text-sm text-slate-600 dark:text-slate-400">

                    {company.description ||
                      'Explore career opportunities and discover jobs from this company.'}

                  </p>


                  {/* Company Info */}

                  <div className="mt-5 space-y-2 text-sm">

                    <div className="flex items-center justify-between gap-3">

                      <span className="text-slate-500 dark:text-slate-400">

                        📍 {company.location || 'Location not specified'}

                      </span>

                    </div>


                    <div className="flex items-center justify-between">

                      <span className="text-slate-500 dark:text-slate-400">

                        Active Jobs

                      </span>

                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-400">

                        {company.activeJobs || 0}

                      </span>

                    </div>

                  </div>


                  {/* View Company */}

                  <Link
                    to={`/companies/${company._id || company.id}`}
                    className="mt-5 block"
                  >

                    <Button
                      variant="outline"
                      className="w-full"
                    >

                      View Company

                      <ArrowRight className="h-4 w-4" />

                    </Button>

                  </Link>

                </Card>

              ))

            ) : (

              <div className="col-span-full py-10 text-center text-slate-500 dark:text-slate-400">

                No companies available right now.

              </div>

            )}

          </div>

        </div>

      </section>


      {/* =================================================
          CTA
      ================================================= */}

      <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">

        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
          }}
        />

        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white opacity-20 blur-3xl" />

        <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-white opacity-10 blur-3xl" />


        <div className="relative mx-auto max-w-3xl text-center">

          <h2 className="mb-4 text-3xl font-extrabold leading-tight text-white md:text-4xl">

            Ready to take the next step in your career?

          </h2>


          <p className="mb-8 text-lg text-indigo-200">

            Join thousands of professionals who found their dream job
            on CareerBridge.

          </p>


          <div className="flex flex-col justify-center gap-3 sm:flex-row">

            <Link to="/register">

              <Button
                variant="custom"
                size="lg"
                className="bg-white text-primary-700 shadow-lg hover:bg-slate-50 focus:ring-white focus:ring-offset-primary-700"
              >

                Get Started Free

              </Button>

            </Link>


            <Link to="/jobs">

              <Button
                variant="custom"
                size="lg"
                className="border-2 border-white/70 bg-transparent text-white hover:bg-white/10 focus:ring-white"
              >

                Browse Jobs

              </Button>

            </Link>

          </div>

        </div>

      </section>

    </div>
  )
}

export default LandingPage