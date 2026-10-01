import React, { useEffect, useMemo, useState } from 'react'
import {
  Search,
  Trash2,
  Edit,
  X,
  Briefcase,
  MapPin,
  Building2,
  RefreshCw,
} from 'lucide-react'

import {
  Button,
  Input,
  Card,
  LoadingSpinner,
} from '../../components/common'

import api from '../../services/api'

const initialForm = {
  title: '',
  description: '',
  location: '',
  category: '',
  employmentType: '',
  experienceLevel: '',
  workMode: '',
  salaryMin: '',
  salaryMax: '',
  status: 'active',
}

const AdminJobs = () => {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const [editingJob, setEditingJob] = useState(null)
  const [form, setForm] = useState(initialForm)
  const [saving, setSaving] = useState(false)

  // =====================================================
  // LOAD JOBS
  // =====================================================

  const loadJobs = async () => {
    try {
      setLoading(true)

      const response = await api.get('/jobs', {
        params: {
          page: 1,
          limit: 100,
          sort: '-createdAt',
        },
      })

      const data = response?.data?.data || []

      setJobs(data)
    } catch (error) {
      console.error('Load jobs error:', error)

      alert(
        error?.response?.data?.message ||
          'Could not load jobs'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadJobs()
  }, [])

  // =====================================================
  // SEARCH
  // =====================================================

  const filteredJobs = useMemo(() => {
    const keyword = search.trim().toLowerCase()

    if (!keyword) {
      return jobs
    }

    return jobs.filter((job) => {
      const title = job.title || ''
      const company = job.company?.name || ''
      const location = job.location || ''
      const category = job.category || ''

      return (
        title.toLowerCase().includes(keyword) ||
        company.toLowerCase().includes(keyword) ||
        location.toLowerCase().includes(keyword) ||
        category.toLowerCase().includes(keyword)
      )
    })
  }, [jobs, search])

  // =====================================================
  // EDIT JOB
  // =====================================================

  const handleEdit = (job) => {
    setEditingJob(job)

    setForm({
      title: job.title || '',
      description: job.description || '',
      location: job.location || '',
      category: job.category || '',
      employmentType: job.employmentType || '',
      experienceLevel: job.experienceLevel || '',
      workMode: job.workMode || '',
      salaryMin: job.salaryMin ?? '',
      salaryMax: job.salaryMax ?? '',
      status: job.status || 'active',
    })
  }

  // =====================================================
  // FORM CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // =====================================================
  // UPDATE JOB
  // =====================================================

  const handleUpdate = async (e) => {
    e.preventDefault()

    if (!editingJob?._id) {
      alert('Job ID not found')
      return
    }

    try {
      setSaving(true)

      const payload = {
        title: form.title,
        description: form.description,
        location: form.location,
        category: form.category,
        employmentType: form.employmentType,
        experienceLevel: form.experienceLevel,
        workMode: form.workMode,
        salaryMin:
          form.salaryMin === ''
            ? undefined
            : Number(form.salaryMin),
        salaryMax:
          form.salaryMax === ''
            ? undefined
            : Number(form.salaryMax),
        status: form.status,
      }

      const response = await api.put(
        `/jobs/${editingJob._id}`,
        payload
      )

      const updatedJob = response?.data?.data

      if (updatedJob) {
        setJobs((prev) =>
          prev.map((job) =>
            job._id === updatedJob._id
              ? updatedJob
              : job
          )
        )
      } else {
        await loadJobs()
      }

      setEditingJob(null)
      setForm(initialForm)

      alert('Job updated successfully')
    } catch (error) {
      console.error('Update job error:', error)

      alert(
        error?.response?.data?.message ||
          'Could not update job'
      )
    } finally {
      setSaving(false)
    }
  }

  // =====================================================
  // DELETE JOB
  // =====================================================

  const handleDelete = async (job) => {
    if (!job?._id) {
      alert('Job ID not found')
      return
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${job.title}"?`
    )

    if (!confirmed) {
      return
    }

    try {
      await api.delete(`/jobs/${job._id}`)

      setJobs((prev) =>
        prev.filter((item) => item._id !== job._id)
      )

      alert('Job deleted successfully')
    } catch (error) {
      console.error('Delete job error:', error)

      alert(
        error?.response?.data?.message ||
          'Could not delete job'
      )
    }
  }

  // =====================================================
  // CLOSE EDIT MODAL
  // =====================================================

  const closeEdit = () => {
    if (saving) return

    setEditingJob(null)
    setForm(initialForm)
  }

  // =====================================================
  // STATS
  // =====================================================

  const totalJobs = jobs.length

  const activeJobs = jobs.filter(
    (job) => job.status === 'active'
  ).length

  const inactiveJobs = totalJobs - activeJobs

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

  return (
    <div className="space-y-6">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex items-center justify-between gap-4">

        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Jobs Management
          </h1>

          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Manage all jobs posted on CareerBridge
          </p>
        </div>

        <Button
          variant="outline"
          onClick={loadJobs}
          className="flex items-center gap-2"
        >
          <RefreshCw size={18} />
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
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search jobs, companies, locations..."
            className="pl-11"
          />

        </div>

      </Card>


      {/* =================================================
          STATS
      ================================================= */}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

        <Card className="p-5">
          <div className="flex items-center gap-4">

            <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600 dark:bg-indigo-950">
              <Briefcase size={25} />
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Total Jobs
              </p>

              <p className="text-2xl font-bold">
                {totalJobs}
              </p>
            </div>

          </div>
        </Card>


        <Card className="p-5">
          <div className="flex items-center gap-4">

            <div className="rounded-xl bg-green-50 p-3 text-green-600 dark:bg-green-950">
              <Briefcase size={25} />
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Active Jobs
              </p>

              <p className="text-2xl font-bold">
                {activeJobs}
              </p>
            </div>

          </div>
        </Card>


        <Card className="p-5">
          <div className="flex items-center gap-4">

            <div className="rounded-xl bg-orange-50 p-3 text-orange-600 dark:bg-orange-950">
              <Briefcase size={25} />
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Inactive Jobs
              </p>

              <p className="text-2xl font-bold">
                {inactiveJobs}
              </p>
            </div>

          </div>
        </Card>

      </div>


      {/* =================================================
          JOB LIST
      ================================================= */}

      <div className="space-y-4">

        {filteredJobs.length === 0 ? (

          <Card className="p-10 text-center">

            <Briefcase
              size={45}
              className="mx-auto mb-4 text-gray-400"
            />

            <h3 className="text-lg font-semibold">
              No jobs found
            </h3>

            <p className="mt-1 text-gray-500">
              Try changing your search.
            </p>

          </Card>

        ) : (

          filteredJobs.map((job) => (

            <Card
              key={job._id}
              className="p-6"
            >

              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                {/* JOB INFO */}

                <div className="min-w-0 flex-1">

                  <div className="flex items-start gap-4">

                    <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600 dark:bg-indigo-950">
                      <Briefcase size={25} />
                    </div>

                    <div className="min-w-0">

                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        {job.title}
                      </h2>

                      <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500">

                        <span className="flex items-center gap-1">
                          <Building2 size={16} />
                          {job.company?.name || 'Company'}
                        </span>

                        <span className="flex items-center gap-1">
                          <MapPin size={16} />
                          {job.location || 'Location not specified'}
                        </span>

                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">

                        {job.category && (
                          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium dark:bg-gray-800">
                            {job.category}
                          </span>
                        )}

                        {job.employmentType && (
                          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-950">
                            {job.employmentType}
                          </span>
                        )}

                        {job.workMode && (
                          <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700 dark:bg-purple-950">
                            {job.workMode}
                          </span>
                        )}

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            job.status === 'active'
                              ? 'bg-green-50 text-green-700 dark:bg-green-950'
                              : 'bg-orange-50 text-orange-700 dark:bg-orange-950'
                          }`}
                        >
                          {job.status || 'unknown'}
                        </span>

                      </div>

                      {job.createdAt && (
                        <p className="mt-3 text-xs text-gray-500">
                          Posted{' '}
                          {new Date(
                            job.createdAt
                          ).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                      )}

                    </div>

                  </div>

                </div>


                {/* ACTIONS */}

                <div className="flex shrink-0 gap-3 lg:flex-col">

                  <Button
                    variant="outline"
                    onClick={() => handleEdit(job)}
                    className="flex items-center justify-center gap-2"
                  >
                    <Edit size={17} />
                    Edit
                  </Button>

                  <Button
                    variant="danger"
                    onClick={() => handleDelete(job)}
                    className="flex items-center justify-center gap-2"
                  >
                    <Trash2 size={17} />
                    Delete
                  </Button>

                </div>

              </div>

            </Card>

          ))

        )}

      </div>


      {/* =================================================
          EDIT MODAL
      ================================================= */}

      {editingJob && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900">

            {/* MODAL HEADER */}

            <div className="mb-6 flex items-center justify-between">

              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Edit Job
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Update job information
                </p>
              </div>

              <button
                type="button"
                onClick={closeEdit}
                disabled={saving}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X size={22} />
              </button>

            </div>


            {/* FORM */}

            <form
              onSubmit={handleUpdate}
              className="space-y-5"
            >

              {/* TITLE */}

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Job Title
                </label>

                <Input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Job title"
                  required
                />
              </div>


              {/* DESCRIPTION */}

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={5}
                  required
                  className="w-full rounded-lg border border-gray-300 bg-white p-3 text-sm outline-none focus:border-indigo-500 dark:border-gray-700 dark:bg-gray-800"
                  placeholder="Job description"
                />
              </div>


              {/* LOCATION */}

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Location
                </label>

                <Input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Noida, Uttar Pradesh"
                />
              </div>


              {/* CATEGORY + EMPLOYMENT */}

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Category
                  </label>

                  <Input
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    placeholder="Technology"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Employment Type
                  </label>

                  <Input
                    name="employmentType"
                    value={form.employmentType}
                    onChange={handleChange}
                    placeholder="Full-time"
                  />
                </div>

              </div>


              {/* EXPERIENCE + WORK MODE */}

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Experience Level
                  </label>

                  <Input
                    name="experienceLevel"
                    value={form.experienceLevel}
                    onChange={handleChange}
                    placeholder="Entry Level"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Work Mode
                  </label>

                  <Input
                    name="workMode"
                    value={form.workMode}
                    onChange={handleChange}
                    placeholder="Remote"
                  />
                </div>

              </div>


              {/* SALARY */}

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Minimum Salary
                  </label>

                  <Input
                    type="number"
                    name="salaryMin"
                    value={form.salaryMin}
                    onChange={handleChange}
                    placeholder="30000"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Maximum Salary
                  </label>

                  <Input
                    type="number"
                    name="salaryMax"
                    value={form.salaryMax}
                    onChange={handleChange}
                    placeholder="60000"
                  />
                </div>

              </div>


              {/* STATUS */}

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Status
                </label>

                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 dark:border-gray-700 dark:bg-gray-800"
                >
                  <option value="active">
                    Active
                  </option>

                  <option value="inactive">
                    Inactive
                  </option>

                  <option value="closed">
                    Closed
                  </option>
                </select>
              </div>


              {/* BUTTONS */}

              <div className="flex justify-end gap-3 border-t pt-5">

                <Button
                  type="button"
                  variant="outline"
                  onClick={closeEdit}
                  disabled={saving}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={saving}
                >
                  {saving
                    ? 'Updating...'
                    : 'Update Job'}
                </Button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  )
}

export default AdminJobs