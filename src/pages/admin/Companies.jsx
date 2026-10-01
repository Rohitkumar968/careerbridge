import React, { useEffect, useState } from 'react'
import {
  Search,
  Building2,
  MapPin,
  User,
  Briefcase,
  Edit,
  Trash2,
  X,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

import {
  Card,
  Input,
  Button,
  LoadingSpinner,
} from '../../components/common'

import api from '../../services/api'

const AdminCompanies = () => {
  const [companies, setCompanies] = useState([])
  const [filteredCompanies, setFilteredCompanies] = useState([])

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

  const [editingCompany, setEditingCompany] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    industry: '',
    location: '',
    website: '',
    size: '',
  })

  // =====================================================
  // LOAD COMPANIES
  // =====================================================

  const loadCompanies = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }

      const response = await api.get('/companies', {
        params: {
          page,
          limit: 20,
        },
      })

      const data = response?.data?.data || []

      setCompanies(data)
      setFilteredCompanies(data)

      if (response?.data?.pagination) {
        setPagination(response.data.pagination)
      }
    } catch (error) {
      console.error(
        'Load companies error:',
        error?.response?.data || error
      )

      setCompanies([])
      setFilteredCompanies([])
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadCompanies()
  }, [page])

  // =====================================================
  // SEARCH
  // =====================================================

  useEffect(() => {
    const keyword = search.trim().toLowerCase()

    if (!keyword) {
      setFilteredCompanies(companies)
      return
    }

    const filtered = companies.filter((company) => {
      const name =
        company?.name?.toLowerCase() || ''

      const industry =
        company?.industry?.toLowerCase() || ''

      const location =
        company?.location?.toLowerCase() || ''

      const recruiter =
        company?.recruiter?.name?.toLowerCase() || ''

      return (
        name.includes(keyword) ||
        industry.includes(keyword) ||
        location.includes(keyword) ||
        recruiter.includes(keyword)
      )
    })

    setFilteredCompanies(filtered)
  }, [search, companies])

  // =====================================================
  // FORM
  // =====================================================

  const handleInputChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // =====================================================
  // OPEN EDIT
  // =====================================================

  const handleEdit = (company) => {
    setEditingCompany(company)

    setFormData({
      name: company?.name || '',
      description: company?.description || '',
      industry: company?.industry || '',
      location: company?.location || '',
      website: company?.website || '',
      size: company?.size || '',
    })
  }

  // =====================================================
  // CLOSE EDIT
  // =====================================================

  const closeEdit = () => {
    setEditingCompany(null)

    setFormData({
      name: '',
      description: '',
      industry: '',
      location: '',
      website: '',
      size: '',
    })
  }

  // =====================================================
  // UPDATE COMPANY
  // =====================================================

  const handleUpdate = async (e) => {
    e.preventDefault()

    if (!editingCompany?._id) return

    try {
      const response = await api.put(
        `/companies/${editingCompany._id}`,
        formData
      )

      const updatedCompany = response?.data?.data

      setCompanies((prev) =>
        prev.map((company) =>
          company._id === editingCompany._id
            ? {
                ...company,
                ...updatedCompany,
              }
            : company
        )
      )

      closeEdit()

      alert('Company updated successfully')
    } catch (error) {
      console.error(
        'Update company error:',
        error?.response?.data || error
      )

      alert(
        error?.response?.data?.message ||
          'Failed to update company'
      )
    }
  }

  // =====================================================
  // DELETE COMPANY
  // =====================================================

  const handleDelete = async (company) => {
    if (!company?._id) return

    const confirmed = window.confirm(
      `Are you sure you want to delete "${company.name}"?`
    )

    if (!confirmed) return

    try {
      await api.delete(
        `/companies/${company._id}`
      )

      setCompanies((prev) =>
        prev.filter(
          (item) => item._id !== company._id
        )
      )

      setPagination((prev) => ({
        ...prev,
        total: Math.max(0, prev.total - 1),
      }))

      alert('Company deleted successfully')
    } catch (error) {
      console.error(
        'Delete company error:',
        error?.response?.data || error
      )

      alert(
        error?.response?.data?.message ||
          'Failed to delete company'
      )
    }
  }

  // =====================================================
  // HELPERS
  // =====================================================

  const formatWebsite = (website) => {
    if (!website) return null

    return website
      .replace(/^https?:\/\//, '')
      .replace(/\/$/, '')
  }

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="space-y-6">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Companies Management
          </h1>

          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Manage companies registered on CareerBridge
          </p>
        </div>

        <Button
          onClick={() => loadCompanies(true)}
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


      {/* =================================================
          SEARCH
      ================================================= */}

      <Card className="p-5">

        <div className="relative">

          <Search
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            placeholder="Search companies, industry, location, recruiter..."
            className="pl-10"
          />

        </div>

      </Card>


      {/* =================================================
          STATS
      ================================================= */}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

        <Card className="p-5">

          <div className="flex items-center gap-4">

            <div className="rounded-xl bg-indigo-50 p-3 dark:bg-indigo-900/30">

              <Building2
                size={26}
                className="text-indigo-600"
              />

            </div>

            <div>

              <p className="text-sm text-gray-500">
                Total Companies
              </p>

              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {pagination.total || 0}
              </p>

            </div>

          </div>

        </Card>


        <Card className="p-5">

          <div className="flex items-center gap-4">

            <div className="rounded-xl bg-green-50 p-3 dark:bg-green-900/30">

              <Briefcase
                size={26}
                className="text-green-600"
              />

            </div>

            <div>

              <p className="text-sm text-gray-500">
                Active Jobs
              </p>

              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {companies.reduce(
                  (total, company) =>
                    total +
                    Number(company?.activeJobs || 0),
                  0
                )}
              </p>

            </div>

          </div>

        </Card>


        <Card className="p-5">

          <div className="flex items-center gap-4">

            <div className="rounded-xl bg-purple-50 p-3 dark:bg-purple-900/30">

              <User
                size={26}
                className="text-purple-600"
              />

            </div>

            <div>

              <p className="text-sm text-gray-500">
                Showing
              </p>

              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {filteredCompanies.length}
              </p>

            </div>

          </div>

        </Card>

      </div>


      {/* =================================================
          COMPANIES LIST
      ================================================= */}

      <Card className="overflow-hidden">

        {filteredCompanies.length === 0 ? (

          <div className="p-12 text-center">

            <Building2
              size={52}
              className="mx-auto mb-4 text-gray-300"
            />

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              No companies found
            </h3>

            <p className="mt-2 text-gray-500">
              No companies match your search.
            </p>

          </div>

        ) : (

          <div className="divide-y divide-gray-200 dark:divide-gray-700">

            {filteredCompanies.map((company) => (

              <div
                key={company?._id}
                className="p-6 transition hover:bg-gray-50 dark:hover:bg-gray-800/40"
              >

                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                  {/* Company Info */}

                  <div className="flex min-w-0 flex-1 gap-4">

                    {/* Logo */}

                    <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-indigo-50 dark:bg-indigo-900/30">

                      {company?.logo ? (

                        <img
                          src={company.logo}
                          alt={company?.name || 'Company'}
                          className="h-full w-full object-cover"
                        />

                      ) : (

                        <Building2
                          size={28}
                          className="text-indigo-600"
                        />

                      )}

                    </div>


                    {/* Details */}

                    <div className="min-w-0">

                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {company?.name || 'Unnamed Company'}
                      </h3>


                      <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-500">

                        {company?.industry && (
                          <span>
                            {company.industry}
                          </span>
                        )}

                        {company?.location && (

                          <span className="flex items-center gap-1">

                            <MapPin size={15} />

                            {company.location}

                          </span>

                        )}

                        {company?.recruiter?.name && (

                          <span className="flex items-center gap-1">

                            <User size={15} />

                            {company.recruiter.name}

                          </span>

                        )}

                      </div>


                      {/* Tags */}

                      <div className="mt-3 flex flex-wrap gap-2">

                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-400">

                          {company?.activeJobs || 0} Active Jobs

                        </span>

                        {company?.size && (

                          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300">

                            {company.size}

                          </span>

                        )}

                      </div>


                      {/* Website */}

                      {company?.website && (

                        <a
                          href={
                            company.website.startsWith('http')
                              ? company.website
                              : `https://${company.website}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-block text-sm text-indigo-600 hover:underline"
                        >
                          {formatWebsite(company.website)}
                        </a>

                      )}

                    </div>

                  </div>


                  {/* Actions */}

                  <div className="flex shrink-0 gap-3">

                    <Button
                      variant="outline"
                      onClick={() =>
                        handleEdit(company)
                      }
                    >
                      <Edit
                        size={17}
                        className="mr-2"
                      />

                      Edit
                    </Button>

                    <Button
                      variant="danger"
                      onClick={() =>
                        handleDelete(company)
                      }
                    >
                      <Trash2
                        size={17}
                        className="mr-2"
                      />

                      Delete
                    </Button>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </Card>


      {/* =================================================
          PAGINATION
      ================================================= */}

      {pagination.pages > 1 && (

        <div className="flex items-center justify-center gap-4">

          <Button
            variant="outline"
            disabled={page <= 1}
            onClick={() =>
              setPage((current) => current - 1)
            }
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
            onClick={() =>
              setPage((current) => current + 1)
            }
          >
            Next

            <ChevronRight size={18} />
          </Button>

        </div>

      )}


      {/* =================================================
          EDIT MODAL
      ================================================= */}

      {editingCompany && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl dark:bg-gray-900">

            {/* Modal Header */}

            <div className="flex items-center justify-between border-b border-gray-200 p-6 dark:border-gray-700">

              <div>

                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Edit Company
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Update company information
                </p>

              </div>

              <button
                type="button"
                onClick={closeEdit}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X size={22} />
              </button>

            </div>


            {/* Form */}

            <form
              onSubmit={handleUpdate}
              className="space-y-5 p-6"
            >

              {/* Name */}

              <div>

                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Company Name
                </label>

                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Company name"
                  required
                />

              </div>


              {/* Description */}

              <div>

                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Company description"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />

              </div>


              {/* Industry + Location */}

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                <div>

                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Industry
                  </label>

                  <Input
                    name="industry"
                    value={formData.industry}
                    onChange={handleInputChange}
                    placeholder="Technology"
                  />

                </div>


                <div>

                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Location
                  </label>

                  <Input
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Noida, India"
                  />

                </div>

              </div>


              {/* Website + Size */}

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                <div>

                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Website
                  </label>

                  <Input
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="https://example.com"
                  />

                </div>


                <div>

                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Company Size
                  </label>

                  <Input
                    name="size"
                    value={formData.size}
                    onChange={handleInputChange}
                    placeholder="50-100"
                  />

                </div>

              </div>


              {/* Buttons */}

              <div className="flex justify-end gap-3 border-t border-gray-200 pt-5 dark:border-gray-700">

                <Button
                  type="button"
                  variant="outline"
                  onClick={closeEdit}
                >
                  Cancel
                </Button>

                <Button type="submit">
                  <Edit
                    size={17}
                    className="mr-2"
                  />

                  Save Changes
                </Button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  )
}

export default AdminCompanies