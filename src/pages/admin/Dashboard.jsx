import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Users,
  Briefcase,
  Building2,
  FileText,
} from 'lucide-react'

import { Card, Button } from '../../components/common'
import { mockUsers, mockJobs } from '../../data/mockData'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

export const AdminDashboard = () => {
  const navigate = useNavigate()

  // =====================================================
  // STATS
  // =====================================================

  const stats = [
    {
      label: 'Total Users',
      value: mockUsers.length,
      icon: Users,
      color: 'primary',
    },
    {
      label: 'Active Jobs',
      value: mockJobs.length,
      icon: Briefcase,
      color: 'success',
    },
    {
      label: 'Companies',
      value: 5,
      icon: Building2,
      color: 'warning',
    },
    {
      label: 'Applications',
      value: 156,
      icon: FileText,
      color: 'info',
    },
  ]

  // =====================================================
  // GROWTH CHART
  // =====================================================

  const chartData = [
    { name: 'Jan', users: 400, jobs: 240 },
    { name: 'Feb', users: 520, jobs: 290 },
    { name: 'Mar', users: 680, jobs: 350 },
    { name: 'Apr', users: 820, jobs: 420 },
    { name: 'May', users: 950, jobs: 480 },
    { name: 'Jun', users: 1100, jobs: 550 },
  ]

  // =====================================================
  // USER DISTRIBUTION
  // =====================================================

  const pieData = [
    {
      name: 'Job Seekers',
      value: 70,
    },
    {
      name: 'Recruiters',
      value: 20,
    },
    {
      name: 'Admins',
      value: 10,
    },
  ]

  const COLORS = [
    '#0ea5e9',
    '#10b981',
    '#f59e0b',
  ]

  // =====================================================
  // QUICK ACTIONS
  // =====================================================

  const handleManageUsers = () => {
    navigate('/admin/users')
  }

  const handleReviewJobs = () => {
    navigate('/admin/jobs')
  }

  const handleViewReports = () => {
    navigate('/admin/reports')
  }

  const handleSettings = () => {
    navigate('/admin/settings')
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="space-y-8">

      {/* =================================================
          HEADER
      ================================================= */}

      <div>

        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
          Admin Dashboard
        </h1>

        <p className="text-gray-600 dark:text-gray-400">
          System overview and management
        </p>

      </div>


      {/* =================================================
          STATS GRID
      ================================================= */}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">

        {stats.map((stat) => {

          const Icon = stat.icon

          return (
            <Card key={stat.label}>

              <div className="flex items-start justify-between">

                <div>

                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </p>

                  <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>

                </div>

                <Icon
                  className={`h-8 w-8 text-${stat.color}-600`}
                />

              </div>

            </Card>
          )
        })}

      </div>


      {/* =================================================
          CHARTS
      ================================================= */}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* Growth Trend */}

        <Card className="lg:col-span-2">

          <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">
            Growth Trend
          </h3>

          <ResponsiveContainer
            width="100%"
            height={300}
          >

            <LineChart data={chartData}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="name" />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="users"
                stroke="#0ea5e9"
                name="Users"
              />

              <Line
                type="monotone"
                dataKey="jobs"
                stroke="#10b981"
                name="Jobs"
              />

            </LineChart>

          </ResponsiveContainer>

        </Card>


        {/* User Distribution */}

        <Card>

          <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">
            User Distribution
          </h3>

          <ResponsiveContainer
            width="100%"
            height={300}
          >

            <PieChart>

              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) =>
                  `${name}: ${value}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >

                {pieData.map((entry, index) => (

                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />

                ))}

              </Pie>

            </PieChart>

          </ResponsiveContainer>

        </Card>

      </div>


      {/* =================================================
          QUICK ACTIONS
      ================================================= */}

      <Card>

        <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">
          Quick Actions
        </h3>


        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">

          {/* Manage Users */}

          <Button
            variant="primary"
            className="w-full"
            onClick={handleManageUsers}
          >
            Manage Users
          </Button>


          {/* Review Jobs */}

          <Button
            variant="secondary"
            className="w-full"
            onClick={handleReviewJobs}
          >
            Review Jobs
          </Button>


          {/* View Reports */}

          <Button
            variant="outline"
            className="w-full"
            onClick={handleViewReports}
          >
            View Reports
          </Button>


          {/* Settings */}

          <Button
            variant="secondary"
            className="w-full"
            onClick={handleSettings}
          >
            Settings
          </Button>

        </div>

      </Card>

    </div>
  )
}

export default AdminDashboard