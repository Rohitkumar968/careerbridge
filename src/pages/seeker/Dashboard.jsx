import React from 'react'
import { useSelector } from 'react-redux'
import { Briefcase, FileText, Bookmark, Calendar, TrendingUp, CheckCircle } from 'lucide-react'
import { Card, Badge, Button, ProgressBar } from '../../components/common'
import { JobCard } from '../../components/jobs'
import { mockJobs, mockApplications, mockInterviews } from '../../data/mockData'

export const SeekerDashboard = () => {
  const { user } = useSelector(state => state.auth)

  const stats = [
    { label: 'Applications', value: mockApplications.length, icon: Briefcase, color: 'primary' },
    { label: 'Interviews', value: mockInterviews.length, icon: Calendar, color: 'success' },
    { label: 'Saved Jobs', value: 5, icon: Bookmark, color: 'warning' },
    { label: 'Profile', value: '85%', icon: TrendingUp, color: 'info' },
  ]

  const applicationStats = {
    applied: mockApplications.filter(a => a.status === 'applied').length,
    screening: mockApplications.filter(a => a.status === 'screening').length,
    interview: mockApplications.filter(a => a.status === 'interview').length,
    selected: mockApplications.filter(a => a.status === 'selected').length,
    rejected: mockApplications.filter(a => a.status === 'rejected').length,
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Good morning, {user?.name}! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Here's what's happening with your job search
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                    {stat.value}
                  </p>
                </div>
                <Icon className={`w-8 h-8 text-${stat.color}-600`} />
              </div>
            </Card>
          )
        })}
      </div>

      {/* Application Status */}
      <Card>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Application Overview
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'Applied', value: applicationStats.applied, color: 'gray' },
            { label: 'Screening', value: applicationStats.screening, color: 'warning' },
            { label: 'Interview', value: applicationStats.interview, color: 'primary' },
            { label: 'Selected', value: applicationStats.selected, color: 'success' },
            { label: 'Rejected', value: applicationStats.rejected, color: 'danger' },
          ].map((status) => (
            <div key={status.label} className="text-center">
              <div className={`text-2xl font-bold text-${status.color}-600 mb-1`}>
                {status.value}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{status.label}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Recommended Jobs */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Recommended for You
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockJobs.slice(0, 4).map((job) => (
            <JobCard key={job.id} job={job} showMatchScore={true} />
          ))}
        </div>
      </div>

      {/* Upcoming Interviews */}
      {mockInterviews.length > 0 && (
        <Card>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Upcoming Interviews
          </h2>
          <div className="space-y-4">
            {mockInterviews.map((interview) => (
              <div
                key={interview.id}
                className="flex items-start justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {interview.position}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {interview.company} • {interview.type}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    {new Date(interview.date).toLocaleDateString()} at {interview.time}
                  </p>
                </div>
                <Button variant="primary" size="sm">
                  Join Interview
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}

export default SeekerDashboard
