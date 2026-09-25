import React, { useState } from 'react'
import { Button, Input, Select, Card } from '../../components/common'
import api from '../../services/api'

export const PostJobPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    employmentType: 'Full-time',
    workMode: 'On-site',
    location: '',
    salaryMin: '',
    salaryMax: '',
    experience: '1-3 Years',
    skills: '',
    description: '',
    responsibilities: '',
    requirements: '',
    benefits: '',
    deadline: '',
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [apiError, setApiError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Job title is required'
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Job description is required'
    }

    if (!formData.experience) {
      newErrors.experience = 'Required experience is required'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    setErrors((prev) => ({
      ...prev,
      [field]: '',
    }))

    setApiError('')
    setSuccessMessage('')
  }

  const handleSubmit = async (e, isDraft = false) => {
    e.preventDefault()

    setApiError('')
    setSuccessMessage('')

    if (!isDraft && !validateForm()) {
      return
    }

    try {
      setIsSubmitting(true)

      const payload = {
        title: formData.title.trim(),
        department: formData.department.trim(),
        employmentType: formData.employmentType,
        workMode: formData.workMode,
        location: formData.location.trim(),

        salary: {
          min: Number(formData.salaryMin) || 0,
          max: Number(formData.salaryMax) || 0,
        },

        experienceLevel: formData.experience,

        skills: formData.skills
          .split(',')
          .map((skill) => skill.trim())
          .filter(Boolean),

        description: formData.description.trim(),

        responsibilities: formData.responsibilities
          .split('\n')
          .map((item) => item.trim())
          .filter(Boolean),

        requirements: formData.requirements
          .split('\n')
          .map((item) => item.trim())
          .filter(Boolean),

        benefits: formData.benefits
          .split('\n')
          .map((item) => item.trim())
          .filter(Boolean),

        deadline: formData.deadline || null,

        status: isDraft ? 'draft' : 'active',
      }

      const response = await api.post('/jobs', payload)

      if (response.data?.success) {
        setSuccessMessage(
          isDraft
            ? 'Job saved as draft successfully!'
            : 'Job published successfully!'
        )

        setFormData({
          title: '',
          department: '',
          employmentType: 'Full-time',
          workMode: 'On-site',
          location: '',
          salaryMin: '',
          salaryMax: '',
          experience: '1-3 Years',
          skills: '',
          description: '',
          responsibilities: '',
          requirements: '',
          benefits: '',
          deadline: '',
        })

        setErrors({})
      } else {
        setApiError(
          response.data?.message || 'Unable to create job.'
        )
      }
    } catch (err) {
      console.error('Create job error:', err)

      setApiError(
        err.response?.data?.message ||
          'Unable to create job. Please try again.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Post a New Job
        </h1>

        <p className="text-gray-600 dark:text-gray-400">
          Create a job posting to attract top talent
        </p>
      </div>

      {successMessage && (
        <div className="p-4 rounded-lg border border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800">
          <p className="text-sm font-medium text-green-700 dark:text-green-400">
            {successMessage}
          </p>
        </div>
      )}

      {apiError && (
        <div className="p-4 rounded-lg border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
          <p className="text-sm font-medium text-red-700 dark:text-red-400">
            {apiError}
          </p>
        </div>
      )}

      <Card>
        <form
          onSubmit={(e) => handleSubmit(e, false)}
          className="space-y-6"
        >
          {/* Basic Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Basic Information
            </h3>

            <div className="space-y-4">
              <Input
                label="Job Title"
                placeholder="e.g., Senior React Developer"
                value={formData.title}
                onChange={(e) =>
                  handleChange('title', e.target.value)
                }
                error={errors.title}
              />

              <Input
                label="Department"
                placeholder="e.g., Engineering"
                value={formData.department}
                onChange={(e) =>
                  handleChange('department', e.target.value)
                }
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Employment Type"
                  value={formData.employmentType}
                  onChange={(e) =>
                    handleChange(
                      'employmentType',
                      e.target.value
                    )
                  }
                  options={[
                    {
                      value: 'Full-time',
                      label: 'Full-time',
                    },
                    {
                      value: 'Part-time',
                      label: 'Part-time',
                    },
                    {
                      value: 'Contract',
                      label: 'Contract',
                    },
                    {
                      value: 'Internship',
                      label: 'Internship',
                    },
                  ]}
                />

                <Select
                  label="Work Mode"
                  value={formData.workMode}
                  onChange={(e) =>
                    handleChange(
                      'workMode',
                      e.target.value
                    )
                  }
                  options={[
                    {
                      value: 'On-site',
                      label: 'On-site',
                    },
                    {
                      value: 'Remote',
                      label: 'Remote',
                    },
                    {
                      value: 'Hybrid',
                      label: 'Hybrid',
                    },
                  ]}
                />
              </div>

              <Input
                label="Location"
                placeholder="e.g., Noida, Uttar Pradesh"
                value={formData.location}
                onChange={(e) =>
                  handleChange('location', e.target.value)
                }
                error={errors.location}
              />
            </div>
          </div>

          {/* Salary & Experience */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Salary & Experience
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Minimum Salary"
                  type="number"
                  placeholder="50000"
                  value={formData.salaryMin}
                  onChange={(e) =>
                    handleChange(
                      'salaryMin',
                      e.target.value
                    )
                  }
                />

                <Input
                  label="Maximum Salary"
                  type="number"
                  placeholder="100000"
                  value={formData.salaryMax}
                  onChange={(e) =>
                    handleChange(
                      'salaryMax',
                      e.target.value
                    )
                  }
                />
              </div>

              <Select
                label="Required Experience"
                value={formData.experience}
                onChange={(e) =>
                  handleChange(
                    'experience',
                    e.target.value
                  )
                }
                options={[
                  {
                    value: '0-1 Years',
                    label: '0-1 Years',
                  },
                  {
                    value: '1-3 Years',
                    label: '1-3 Years',
                  },
                  {
                    value: '3-5 Years',
                    label: '3-5 Years',
                  },
                  {
                    value: '5-8 Years',
                    label: '5-8 Years',
                  },
                  {
                    value: '8+ Years',
                    label: '8+ Years',
                  },
                ]}
              />
            </div>
          </div>

          {/* Job Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Job Details
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Job Description
                </label>

                <textarea
                  placeholder="Describe the role and responsibilities..."
                  value={formData.description}
                  onChange={(e) =>
                    handleChange(
                      'description',
                      e.target.value
                    )
                  }
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                />

                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Responsibilities
                </label>

                <textarea
                  placeholder="List key responsibilities, one per line..."
                  value={formData.responsibilities}
                  onChange={(e) =>
                    handleChange(
                      'responsibilities',
                      e.target.value
                    )
                  }
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Requirements
                </label>

                <textarea
                  placeholder="List required qualifications, one per line..."
                  value={formData.requirements}
                  onChange={(e) =>
                    handleChange(
                      'requirements',
                      e.target.value
                    )
                  }
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <Input
                label="Required Skills (comma-separated)"
                placeholder="React, JavaScript, Node.js"
                value={formData.skills}
                onChange={(e) =>
                  handleChange(
                    'skills',
                    e.target.value
                  )
                }
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Benefits
                </label>

                <textarea
                  placeholder="List job benefits, one per line..."
                  value={formData.benefits}
                  onChange={(e) =>
                    handleChange(
                      'benefits',
                      e.target.value
                    )
                  }
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <Input
                label="Application Deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) =>
                  handleChange(
                    'deadline',
                    e.target.value
                  )
                }
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="secondary"
              onClick={(e) =>
                handleSubmit(e, true)
              }
              loading={isSubmitting}
            >
              Save Draft
            </Button>

            <Button
              type="submit"
              variant="primary"
              loading={isSubmitting}
            >
              Publish Job
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default PostJobPage