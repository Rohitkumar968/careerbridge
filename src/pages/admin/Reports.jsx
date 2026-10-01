import React, { useEffect, useState } from 'react'
import {
  BarChart3,
  Users,
  Briefcase,
  FileText,
  RefreshCw,
  CheckCircle,
  Clock,
  XCircle,
} from 'lucide-react'

import { Card, Button, LoadingSpinner } from '../../components/common'
import api from '../../services/api'

const AdminReports = () => {
  const [reports, setReports] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const loadReports = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }

      const response = await api.get('/admin/reports')

      setReports(response?.data?.data || null)
    } catch (error) {
      console.error(
        'Load reports error:',
        error?.response?.data || error
      )

      setReports(null)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadReports()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  const last30Days = reports?.last30Days || {}

  const applicationsByStatus =
    reports?.applicationsByStatus || []

  const getStatusIcon = (status) => {
    const value = String(status || '').toLowerCase()

    if (
      value === 'accepted' ||
      value === 'approved' ||
      value === 'hired'
    ) {
      return (
        <CheckCircle
          size={22}
          className="text-green-600"
        />
      )
    }

    if (
      value === 'rejected' ||
      value === 'declined'
    ) {
      return (
        <XCircle
          size={22}
          className="text-red-600"
        />
      )
    }

    return (
      <Clock
        size={22}
        className="text-yellow-600"
      />
    )
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Reports & Analytics
          </h1>

          <p className="mt-1 text-gray-500 dark:text-gray-400">
            CareerBridge platform activity for the last 30 days
          </p>
        </div>

        <Button
          onClick={() => loadReports(true)}
          disabled={refreshing}
        >
          <RefreshCw
            size={18}
            className={
              refreshing
                ? 'mr-2 animate-spin'
                : 'mr-2'
            }
          />

          Refresh
        </Button>

      </div>


      {/* 30 Days Stats */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

        {/* Users */}
        <Card className="p-6">

          <div className="flex items-center gap-4">

            <div className="rounded-xl bg-indigo-50 p-3 dark:bg-indigo-900/30">
              <Users
                size={28}
                className="text-indigo-600"
              />
            </div>

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                New Users
              </p>

              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {last30Days.newUsers || 0}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Last 30 days
              </p>
            </div>

          </div>

        </Card>


        {/* Jobs */}
        <Card className="p-6">

          <div className="flex items-center gap-4">

            <div className="rounded-xl bg-green-50 p-3 dark:bg-green-900/30">
              <Briefcase
                size={28}
                className="text-green-600"
              />
            </div>

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                New Jobs
              </p>

              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {last30Days.newJobs || 0}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Last 30 days
              </p>
            </div>

          </div>

        </Card>


        {/* Applications */}
        <Card className="p-6">

          <div className="flex items-center gap-4">

            <div className="rounded-xl bg-purple-50 p-3 dark:bg-purple-900/30">
              <FileText
                size={28}
                className="text-purple-600"
              />
            </div>

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                New Applications
              </p>

              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {last30Days.newApplications || 0}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Last 30 days
              </p>
            </div>

          </div>

        </Card>

      </div>


      {/* Application Status */}
      <Card>

        <div className="border-b border-gray-200 p-6 dark:border-gray-700">

          <div className="flex items-center gap-3">

            <BarChart3
              size={24}
              className="text-indigo-600"
            />

            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Applications by Status
              </h2>

              <p className="text-sm text-gray-500">
                Current application status distribution
              </p>
            </div>

          </div>

        </div>


        {applicationsByStatus.length === 0 ? (

          <div className="p-10 text-center">

            <FileText
              size={45}
              className="mx-auto mb-3 text-gray-300"
            />

            <p className="text-gray-500">
              No application status data available.
            </p>

          </div>

        ) : (

          <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">

            {applicationsByStatus.map((item) => (

              <div
                key={item?._id || 'unknown'}
                className="rounded-xl border border-gray-200 p-5 dark:border-gray-700"
              >

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-3">

                    <div className="rounded-lg bg-gray-100 p-2 dark:bg-gray-800">
                      {getStatusIcon(item?._id)}
                    </div>

                    <span className="font-semibold capitalize text-gray-900 dark:text-white">
                      {item?._id || 'Unknown'}
                    </span>

                  </div>

                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {item?.count || 0}
                  </span>

                </div>

              </div>

            ))}

          </div>

        )}

      </Card>


      {/* Report Information */}
      <Card className="p-6">

        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          Report Information
        </h2>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">

          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">

            <p className="text-sm text-gray-500">
              Report Period
            </p>

            <p className="mt-1 font-semibold text-gray-900 dark:text-white">
              Last 30 Days
            </p>

          </div>

          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">

            <p className="text-sm text-gray-500">
              Data Source
            </p>

            <p className="mt-1 font-semibold text-gray-900 dark:text-white">
              CareerBridge Database
            </p>

          </div>

          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">

            <p className="text-sm text-gray-500">
              Status
            </p>

            <p className="mt-1 font-semibold text-green-600">
              Live Data
            </p>

          </div>

        </div>

      </Card>

    </div>
  )
}

export default AdminReports