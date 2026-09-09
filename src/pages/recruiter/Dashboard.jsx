import React from 'react'
import { Briefcase, Users, CheckCircle, Calendar, TrendingUp } from 'lucide-react'
import { Card, Button } from '../../components/common'
import { mockJobs, mockCandidates } from '../../data/mockData'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

export const RecruiterDashboard = () => {
  const stats = [
    { label: 'Active Jobs', value: mockJobs.length, icon: Briefcase, color: 'primary' },
    { label: 'Total Applicants', value: 156, icon: Users, color: 'success' },
    { label: 'Shortlisted', value: 24, icon: CheckCircle, color: 'warning' },
    { label: 'Interviews', value: 8, icon: Calendar, color: 'info' },
  ]

  const chartData = [
    { name: 'Jan', applications: 40, hired: 4 },
    { name: 'Feb', applications: 65, hired: 8 },
    { name: 'Mar', applications: 85, hired: 12 },
    { name: 'Apr', applications: 120, hired: 18 },
    { name: 'May', applications: 95, hired: 14 },
    { name: 'Jun', applications: 140, hired: 22 },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Recruiter Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your hiring pipeline and track performance
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

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
            Applications Over Time
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="applications" stroke="#0ea5e9" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
            Hiring Performance
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="hired" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button variant="primary" className="w-full">
            Post New Job
          </Button>
          <Button variant="secondary" className="w-full">
            View Applicants
          </Button>
          <Button variant="outline" className="w-full">
            Schedule Interview
          </Button>
        </div>
      </Card>

      {/* Recent Applicants */}
      <Card>
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
          Recent Applicants
        </h3>
        <div className="space-y-3">
          {mockCandidates.slice(0, 3).map((candidate) => (
            <div
              key={candidate.id}
              className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{candidate.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{candidate.experience}</p>
              </div>
              <Button variant="outline" size="sm">
                View Profile
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default RecruiterDashboard
