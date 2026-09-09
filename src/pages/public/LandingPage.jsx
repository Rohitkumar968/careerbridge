import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Briefcase, Users, TrendingUp, ArrowRight, CheckCircle, Zap, Star } from 'lucide-react'
import { Button, Card } from '../../components/common'
import { JobCard, CompanyCard } from '../../components/jobs'
import { mockJobs, mockCompanies } from '../../data/mockData'

export const LandingPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchLocation, setSearchLocation] = useState('')

  const stats = [
    { label: '10,000+', description: 'Active Jobs',    icon: Briefcase },
    { label: '5,000+',  description: 'Companies',      icon: Users },
    { label: '25,000+', description: 'Candidates',     icon: Users },
    { label: '95%',     description: 'Match Accuracy', icon: TrendingUp },
  ]

  const features = [
    { title: 'AI Resume Analyzer',  description: 'Instant AI feedback with ATS scoring and improvement tips.' },
    { title: 'Smart Job Matching',  description: 'Skill-based matching surfaces the right roles automatically.' },
    { title: 'Interview Prep',      description: 'AI-guided preparation tailored to each role and company.' },
    { title: 'Candidate Ranking',   description: 'Recruiters get ranked shortlists — no manual screening.' },
  ]

  const seekerSteps = [
    { number: '01', title: 'Create Profile',  description: 'Build your professional profile in minutes' },
    { number: '02', title: 'Upload Resume',   description: 'AI analyzes and scores your resume instantly' },
    { number: '03', title: 'Get Matches',     description: 'Receive curated AI-powered job recommendations' },
    { number: '04', title: 'Apply & Track',   description: 'Apply with one click and track every application' },
  ]

  const recruiterSteps = [
    { number: '01', title: 'Company Profile', description: 'Set up your employer brand page' },
    { number: '02', title: 'Post Jobs',        description: 'Publish openings in under 5 minutes' },
    { number: '03', title: 'AI Shortlisting',  description: 'Get ranked candidates automatically' },
    { number: '04', title: 'Hire Faster',      description: 'Manage pipeline and schedule interviews' },
  ]

  return (
    <div className="bg-surface dark:bg-surface-dark">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-20 pb-28 px-4 sm:px-6 lg:px-8">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-hero-gradient dark:bg-hero-gradient-dark" />
        {/* Decorative blobs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-20 blur-3xl" style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }} />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full opacity-15 blur-3xl" style={{ background: 'radial-gradient(circle, #4f46e5, transparent)' }} />

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-12">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-primary-200 dark:border-primary-800 bg-white dark:bg-primary-950 text-primary-700 dark:text-primary-300">
              <Zap className="w-3.5 h-3.5" />
              AI-Powered Recruitment Platform
            </div>

            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-6 leading-tight tracking-tight">
              Find the Right Opportunity.<br />
              <span className="text-brand-gradient">Build Your Future.</span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed">
              CareerBridge connects talented professionals with great companies using AI-powered job matching and intelligent recruitment tools.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/jobs">
                <Button size="lg">
                  Find Jobs
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" size="lg">Post a Job</Button>
              </Link>
            </div>
          </div>

          {/* Search bar */}
          <Card className="max-w-3xl mx-auto shadow-brand">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Role or Skill</label>
                <input
                  type="text"
                  placeholder="React Developer, Designer…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-white placeholder-slate-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Location</label>
                <input
                  type="text"
                  placeholder="City or Remote"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-white placeholder-slate-400"
                />
              </div>
              <div className="flex items-end">
                <Link to="/jobs" className="w-full">
                  <Button className="w-full">
                    <Search className="w-4 h-4" />
                    Search Jobs
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.label} className="text-center">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl mb-3" style={{ background: 'linear-gradient(135deg, #eef2ff, #f5f3ff)' }}>
                    <Icon className="w-5 h-5 text-primary-600" />
                  </div>
                  <div className="text-3xl font-extrabold text-slate-900 dark:text-white">{stat.label}</div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{stat.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Featured Jobs ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-sm font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-1">Opportunities</p>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Featured Jobs</h2>
            </div>
            <Link to="/jobs" className="hidden sm:flex items-center gap-1 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 transition-colors">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
            {mockJobs.slice(0, 3).map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
          <div className="text-center sm:hidden">
            <Link to="/jobs">
              <Button variant="outline">View All Jobs <ArrowRight className="w-4 h-4" /></Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-1">Simple Process</p>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">How It Works</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            {[
              { title: 'For Job Seekers', steps: seekerSteps },
              { title: 'For Recruiters',  steps: recruiterSteps },
            ].map(({ title, steps }) => (
              <div key={title}>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-7">{title}</h3>
                <div className="space-y-5">
                  {steps.map((step, i) => (
                    <div key={step.number} className="flex gap-4 items-start">
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white shadow-brand" style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}>
                        {step.number}
                      </div>
                      <div className="pt-1">
                        <h4 className="font-semibold text-slate-900 dark:text-white text-sm">{step.title}</h4>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI Features ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-1">Intelligence Built In</p>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Powered by AI</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((feature, i) => (
              <Card key={feature.title} className="hover:border-primary-200 dark:hover:border-primary-800">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: 'linear-gradient(135deg, #eef2ff, #f5f3ff)' }}>
                  <CheckCircle className="w-5 h-5 text-primary-600" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2 text-sm">{feature.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Companies ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-sm font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-1">Top Employers</p>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Featured Companies</h2>
            </div>
            <Link to="/companies" className="hidden sm:flex items-center gap-1 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 transition-colors">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {mockCompanies.map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' }} />
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-20 blur-3xl bg-white" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full opacity-10 blur-3xl bg-white" />
        <div className="relative max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 leading-tight">
            Ready to take the next step in your career?
          </h2>
          <p className="text-indigo-200 mb-8 text-lg">
            Join thousands of professionals who found their dream job on CareerBridge.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/register">
              <Button variant="custom" size="lg" className="bg-white text-primary-700 hover:bg-slate-50 shadow-lg focus:ring-white focus:ring-offset-primary-700">
                Get Started Free
              </Button>
            </Link>
            <Link to="/jobs">
              <Button variant="custom" size="lg" className="border-2 border-white/70 text-white hover:bg-white/10 bg-transparent focus:ring-white">
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
