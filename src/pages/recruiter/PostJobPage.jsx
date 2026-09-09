import React, { useState } from 'react'
import { Button, Input, Select, Card } from '../../components/common'

export const PostJobPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    employmentType: 'Full-time',
    workMode: 'On-site',
    location: '',
    salaryMin: '',
    salaryMax: '',
    experience: '',
    skills: '',
    description: '',
    responsibilities: '',
    requirements: '',
    benefits: '',
    deadline: '',
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = () => {
    const newErrors = {}
    if (!formData.title) newErrors.title = 'Job title is required'
    if (!formData.location) newErrors.location = 'Location is required'
    if (!formData.description) newErrors.description = 'Job description is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e, isDraft = false) => {
    e.preventDefault()
    if (!isDraft && !validateForm()) return

    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    alert(isDraft ? 'Job saved as draft!' : 'Job published successfully!')
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

      <Card>
        <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
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
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                error={errors.title}
              />

              <Input
                label="Department"
                placeholder="e.g., Engineering"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Employment Type"
                  value={formData.employmentType}
                  onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
                  options={[
                    { value: 'Full-time', label: 'Full-time' },
                    { value: 'Part-time', label: 'Part-time' },
                    { value: 'Contract', label: 'Contract' },
                    { value: 'Internship', label: 'Internship' },
                  ]}
                />

                <Select
                  label="Work Mode"
                  value={formData.workMode}
                  onChange={(e) => setFormData({ ...formData, workMode: e.target.value })}
                  options={[
                    { value: 'On-site', label: 'On-site' },
                    { value: 'Remote', label: 'Remote' },
                    { value: 'Hybrid', label: 'Hybrid' },
                  ]}
                />
              </div>

              <Input
                label="Location"
                placeholder="e.g., San Francisco, CA"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
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
                  placeholder="100000"
                  value={formData.salaryMin}
                  onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value })}
                />

                <Input
                  label="Maximum Salary"
                  type="number"
                  placeholder="150000"
                  value={formData.salaryMax}
                  onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value })}
                />
              </div>

              <Input
                label="Required Experience"
                placeholder="e.g., 5+ years"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Responsibilities
                </label>
                <textarea
                  placeholder="List key responsibilities..."
                  value={formData.responsibilities}
                  onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Requirements
                </label>
                <textarea
                  placeholder="List required qualifications..."
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <Input
                label="Required Skills (comma-separated)"
                placeholder="React, JavaScript, Node.js"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Benefits
                </label>
                <textarea
                  placeholder="List job benefits..."
                  value={formData.benefits}
                  onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <Input
                label="Application Deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="secondary"
              onClick={(e) => handleSubmit(e, true)}
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
