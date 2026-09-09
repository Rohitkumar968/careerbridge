import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { Card, Pagination } from '../../components/common'
import { ApplicationCard } from '../../components/applications'

const API_URL = '/api/applications'
const ITEMS_PER_PAGE = 6

const getAuthConfig = () => {
  const token = localStorage.getItem('token')

  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  }
}

export const ApplicationsPage = () => {
  const { token } = useSelector((state) => state.auth)

  const [applications, setApplications] = useState([])
  const [activeTab, setActiveTab] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // ==========================================
  // FETCH ALL REAL APPLICATIONS
  // ==========================================
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true)
        setError('')

        const authToken =
          token || localStorage.getItem('token')

        if (!authToken) {
          setError('Please login again.')
          return
        }

        const response = await axios.get(
          `${API_URL}?page=1&limit=100`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
              'Content-Type': 'application/json',
            },
          }
        )

        const data = response.data?.data || []

        setApplications(data)
      } catch (err) {
        console.error(
          'Applications fetch error:',
          err.response?.data || err.message
        )

        setError(
          err.response?.data?.message ||
          'Failed to load applications'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchApplications()
  }, [token])

  // ==========================================
  // STATUS NORMALIZATION
  // ==========================================
  const normalizeStatus = (status) => {
    const value = String(status || '')
      .toLowerCase()
      .trim()

    if (value === 'screening') return 'reviewing'
    if (value === 'selected') return 'hired'

    return value
  }

  // ==========================================
  // TABS
  // ==========================================
  const tabs = [
    {
      id: 'all',
      label: 'All',
      count: applications.length,
    },
    {
      id: 'applied',
      label: 'Applied',
      count: applications.filter(
        (a) => normalizeStatus(a.status) === 'applied'
      ).length,
    },
    {
      id: 'reviewing',
      label: 'Reviewing',
      count: applications.filter(
        (a) => normalizeStatus(a.status) === 'reviewing'
      ).length,
    },
    {
      id: 'shortlisted',
      label: 'Shortlisted',
      count: applications.filter(
        (a) => normalizeStatus(a.status) === 'shortlisted'
      ).length,
    },
    {
      id: 'interview',
      label: 'Interview',
      count: applications.filter(
        (a) => normalizeStatus(a.status) === 'interview'
      ).length,
    },
    {
      id: 'hired',
      label: 'Hired',
      count: applications.filter(
        (a) => normalizeStatus(a.status) === 'hired'
      ).length,
    },
    {
      id: 'rejected',
      label: 'Rejected',
      count: applications.filter(
        (a) => normalizeStatus(a.status) === 'rejected'
      ).length,
    },
  ]

  // ==========================================
  // FILTER
  // ==========================================
  const filteredApplications =
    activeTab === 'all'
      ? applications
      : applications.filter(
          (application) =>
            normalizeStatus(application.status) === activeTab
        )

  // ==========================================
  // PAGINATION
  // ==========================================
  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredApplications.length / ITEMS_PER_PAGE
    )
  )

  const paginatedApplications =
    filteredApplications.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    )

  // ==========================================
  // LOADING
  // ==========================================
  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Applications
          </h1>

          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Loading your applications...
          </p>
        </div>

        <Card className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto" />

          <p className="mt-4 text-gray-500">
            Fetching applications
          </p>
        </Card>
      </div>
    )
  }

  // ==========================================
  // ERROR
  // ==========================================
  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Applications
          </h1>
        </div>

        <Card className="text-center py-12">
          <p className="text-red-500 font-medium">
            {error}
          </p>
        </Card>
      </div>
    )
  }

  // ==========================================
  // PAGE
  // ==========================================
  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          My Applications
        </h1>

        <p className="text-gray-600 dark:text-gray-400">
          Track and manage all your job applications
        </p>
      </div>

      {/* TABS */}
      <Card>
        <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-700 pb-4">

          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id)
                setCurrentPage(1)
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {tab.label}

              <span className="ml-2 text-sm">
                ({tab.count})
              </span>
            </button>
          ))}

        </div>
      </Card>

      {/* APPLICATIONS */}
      {paginatedApplications.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {paginatedApplications.map(
              (application) => (
                <ApplicationCard
                  key={
                    application._id ||
                    application.id
                  }
                  application={application}
                />
              )
            )}

          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </>
      ) : (
        <Card className="text-center py-12">

          <p className="text-lg font-medium text-gray-600 dark:text-gray-300">
            No applications yet
          </p>

          <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
            Jobs you apply for will appear here.
          </p>

        </Card>
      )}

    </div>
  )
}

export default ApplicationsPage