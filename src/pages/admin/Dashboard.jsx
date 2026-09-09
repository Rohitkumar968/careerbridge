import React from 'react'
import { Users, Briefcase, Building2, FileText, TrendingUp } from 'lucide-react'
import { Card, Button } from '../../components/common'
import { mockUsers, mockJobs } from '../../data/mockData'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

export const AdminDashboard = () => {
  const stats = [
    { label: 'Total Users', value: mockUsers.length, icon: Users, color: 'primary' },
    { label: 'Active Jobs', value: mockJobs.length, icon: Briefcase, color: 'success' },
    { label: 'Companies', value: 5, icon: Building2, color: 'warning' },
    { label: 'Applications', value: 156, icon: FileText, color: 'info' },
  ]

  const chartData = [
    { name: 'Jan', users: 400, jobs: 240 },
    { name: 'Feb', users: 520, jobs: 290 },
    { name: 'Mar', users: 680, jobs: 350 },
    { name: 'Apr', users: 820, jobs: 420 },
    { name: 'May', users: 950, jobs: 480 },
    { name: 'Jun', users: 1100, jobs: 550 },
  ]

  const pieData = [
    { name: 'Job Seekers', value: 70 },
    { name: 'Recruiters', value: 20 },
    { name: 'Admins', value: 10 },
  ]

  const COLORS = ['#0ea5e9', '#10b981', '#f59e0b']

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          System overview and management
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
            Growth Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="users" stroke="#0ea5e9" name="Users" />
              <Line type="monotone" dataKey="jobs" stroke="#10b981" name="Jobs" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
            User Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Button variant="primary" className="w-full">
            Manage Users
          </Button>
          <Button variant="secondary" className="w-full">
            Review Jobs
          </Button>
          <Button variant="outline" className="w-full">
            View Reports
          </Button>
          <Button variant="secondary" className="w-full">
            Settings
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default AdminDashboard
