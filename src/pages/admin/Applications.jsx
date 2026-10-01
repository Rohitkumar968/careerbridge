import React, { useEffect, useState } from 'react'
import {
  Search,
  FileText,
  User,
  Building2,
  Calendar,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

import { Card, Input, Button, LoadingSpinner } from '../../components/common'
import api from '../../services/api'

const AdminApplications = () => {
  const [applications, setApplications] = useState([])
  const [filteredApplications, setFilteredApplications] = useState([])

  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1,
    limit: 20,
  })

  const loadApplications = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }

      const response = await api.get('/admin/applications', {
        params: {
          page,
          limit: 20,
        },
      })

      const data = response?.data?.data || []

      setApplications(data)
      setFilteredApplications(data)

      if (response?.data?.pagination) {
        setPagination(response.data.pagination)
      }
    } catch (error) {
      console.error(
        'Load applications error:',
        error?.response?.data || error
      )

      setApplications([])
      setFilteredApplications([])
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadApplications()
  }, [page])

  useEffect(() => {
    const keyword = search.trim().toLowerCase()

    if (!keyword) {
      setFilteredApplications(applications)
      return
    }

    const filtered = applications.filter((application) => {
      const applicantName =
        application?.applicant?.name?.toLowerCase() || ''

      const applicantEmail =
        application?.applicant?.email?.toLowerCase() || ''

      const jobTitle =
        application?.job?.title?.toLowerCase() || ''

      const companyName =
        application?.job?.company?.name?.toLowerCase() || ''

      const status =
        application?.status?.toLowerCase() || ''

      return (
        applicantName.includes(keyword) ||
        applicantEmail.includes(keyword) ||
        jobTitle.includes(keyword) ||
        companyName.includes(keyword) ||
        status.includes(keyword)
      )
    })

    setFilteredApplications(filtered)
  }, [search, applications])

  const getStatusClass = (status) => {
    const value = String(status || '').toLowerCase()

    if (
      value === 'accepted' ||
      value === 'approved' ||
      value === 'hired'
    ) {
      return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
    }

    if (
      value === 'rejected' ||
      value === 'declined'
    ) {
      return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    }

    if (
      value === 'interview' ||
      value === 'shortlisted'
    ) {
      return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
    }

    return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
  }

  const formatDate = (date) => {
    if (!date) return '—'

    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Applications Management
          </h1>

          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Manage job applications across CareerBridge
          </p>
        </div>

        <Button
          onClick={() => loadApplications(true)}
          disabled={refreshing}
        >
          <RefreshCw
            size={18}
            className={refreshing ? 'mr-2 animate-spin' : 'mr-2'}
          />

          Refresh
        </Button>

      </div>


      {/* Search */}
      <Card className="p-5">

        <div className="relative">

          <Search
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search applicant, email, job, company, status..."
            className="pl-10"
          />

        </div>

      </Card>


      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

        <Card className="p-5">

          <div className="flex items-center gap-4">

            <div className="rounded-xl bg-indigo-50 p-3 dark:bg-indigo-900/30">
              <FileText
                size={26}
                className="text-indigo-600"
              />
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Total Applications
              </p>

              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {pagination.total || 0}
              </p>
            </div>

          </div>

        </Card>


        <Card className="p-5">

          <div className="flex items-center gap-4">

            <div className="rounded-xl bg-yellow-50 p-3 dark:bg-yellow-900/30">
              <Calendar
                size={26}
                className="text-yellow-600"
              />
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Showing
              </p>

              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {filteredApplications.length}
              </p>
            </div>

          </div>

        </Card>


        <Card className="p-5">

          <div className="flex items-center gap-4">

            <div className="rounded-xl bg-green-50 p-3 dark:bg-green-900/30">
              <User
                size={26}
                className="text-green-600"
              />
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Current Page
              </p>

              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {pagination.page || page}
              </p>
            </div>

          </div>

        </Card>

      </div>


      {/* Applications */}
      <Card className="overflow-hidden">

        {filteredApplications.length === 0 ? (

          <div className="p-12 text-center">

            <FileText
              size={50}
              className="mx-auto mb-4 text-gray-300"
            />

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              No applications found
            </h3>

            <p className="mt-2 text-gray-500">
              No applications match your search.
            </p>

          </div>

        ) : (

          <div className="divide-y divide-gray-200 dark:divide-gray-700">

            {filteredApplications.map((application) => {

              const applicant = application?.applicant
              const job = application?.job
              const company = job?.company

              return (
                <div
                  key={application?._id}
                  className="p-5 transition hover:bg-gray-50 dark:hover:bg-gray-800/40"
                >

                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                    {/* Left */}
                    <div className="min-w-0 flex-1">

                      <div className="flex items-start gap-4">

                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-900/30">
                          <FileText
                            size={24}
                            className="text-indigo-600"
                          />
                        </div>

                        <div className="min-w-0">

                          <h3 className="truncate text-lg font-bold text-gray-900 dark:text-white">
                            {job?.title || 'Job Application'}
                          </h3>

                          <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-500">

                            <span className="flex items-center gap-1">
                              <User size={15} />
                              {applicant?.name || 'Unknown applicant'}
                            </span>

                            <span>
                              {applicant?.email || 'No email'}
                            </span>

                            <span className="flex items-center gap-1">
                              <Building2 size={15} />
                              {company?.name || 'Unknown company'}
                            </span>

                          </div>

                          <div className="mt-3 flex flex-wrap items-center gap-3">

                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusClass(
                                application?.status
                              )}`}
                            >
                              {application?.status || 'pending'}
                            </span>

                            <span className="text-sm text-gray-500">
                              Applied {formatDate(application?.createdAt)}
                            </span>

                          </div>

                        </div>

                      </div>

                    </div>

                  </div>

                </div>
              )
            })}

          </div>

        )}

      </Card>


      {/* Pagination */}
      {pagination.pages > 1 && (

        <div className="flex items-center justify-center gap-4">

          <Button
            variant="outline"
            disabled={page <= 1}
            onClick={() => setPage((current) => current - 1)}
          >
            <ChevronLeft size={18} />
            Previous
          </Button>

          <span className="text-sm text-gray-600 dark:text-gray-300">
            Page {pagination.page} of {pagination.pages}
          </span>

          <Button
            variant="outline"
            disabled={page >= pagination.pages}
            onClick={() => setPage((current) => current + 1)}
          >
            Next
            <ChevronRight size={18} />
          </Button>

        </div>

      )}

    </div>
  )
}

export default AdminApplications