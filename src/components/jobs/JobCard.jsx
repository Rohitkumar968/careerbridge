import React from 'react'
import { Link } from 'react-router-dom'
import {
  MapPin,
  Briefcase,
  DollarSign,
  Bookmark,
  BookmarkCheck,
  Zap,
  Share2,
} from 'lucide-react'
import { Badge, Button } from '../common'

const JobCard = ({
  job,
  onSave,
  onShare,
  isSaved = false,
  showMatchScore = false,
}) => {
  // =====================================================
  // JOB ID
  // IMPORTANT: Prefer MongoDB _id
  // =====================================================
  const jobId = job?._id || job?.id

  // =====================================================
  // COMPANY
  // =====================================================
  const companyName =
    job?.company?.name ||
    (typeof job?.company === 'string'
      ? job.company
      : '') ||
    job?.companyName ||
    'Company'

  const companyLogo =
    job?.company?.logo ||
    job?.companyLogo ||
    job?.logo ||
    ''

  const fallbackLogo =
    'https://ui-avatars.com/api/?name=' +
    encodeURIComponent(companyName) +
    '&background=6366f1&color=fff&size=128'

  const logoUrl =
    companyLogo || fallbackLogo

  // =====================================================
  // JOB INFORMATION
  // =====================================================
  const location =
    job?.location ||
    job?.company?.location ||
    'Location not specified'

  const jobType =
    job?.employmentType ||
    job?.jobType ||
    'Full-time'

  const experience =
    job?.experienceLevel ||
    job?.experience ||
    'Not specified'

  const workMode =
    job?.workMode ||
    (job?.remote === true
      ? 'Remote'
      : '')

  // =====================================================
  // SALARY
  // Supports:
  // salary: { min, max }
  // salaryMin / salaryMax
  // =====================================================
  const salaryMin =
    job?.salary?.min ??
    job?.salaryMin ??
    null

  const salaryMax =
    job?.salary?.max ??
    job?.salaryMax ??
    null

  const hasSalary =
    salaryMin !== null ||
    salaryMax !== null

  const formatSalary = (value) => {
    if (
      value === null ||
      value === undefined ||
      value === ''
    ) {
      return ''
    }

    if (typeof value === 'number') {
      return value.toLocaleString('en-IN')
    }

    return value
  }

  const salaryText = (() => {
    if (!hasSalary) {
      return 'Salary not specified'
    }

    if (
      salaryMin !== null &&
      salaryMax !== null
    ) {
      return `${formatSalary(
        salaryMin
      )} - ${formatSalary(salaryMax)}`
    }

    if (salaryMin !== null) {
      return `From ${formatSalary(
        salaryMin
      )}`
    }

    return `Up to ${formatSalary(
      salaryMax
    )}`
  })()

  // =====================================================
  // SKILLS
  // =====================================================
  const skills = Array.isArray(job?.skills)
    ? job.skills
    : []

  // =====================================================
  // MATCH SCORE
  // =====================================================
  const matchScore =
    job?.matchScore ??
    job?.matchPercentage ??
    null

  // =====================================================
  // IMAGE ERROR
  // =====================================================
  const handleImageError = (event) => {
    if (
      event.currentTarget.src !==
      fallbackLogo
    ) {
      event.currentTarget.src =
        fallbackLogo
    }
  }

  // =====================================================
  // SAVE / UNSAVE
  // =====================================================
  const handleSave = (event) => {
    event.preventDefault()
    event.stopPropagation()

    if (!jobId) {
      console.error(
        'Save job error: Job ID missing',
        job
      )
      return
    }

    if (onSave) {
      onSave(jobId)
    }
  }

  // =====================================================
  // SHARE
  // =====================================================
  const handleShare = async (event) => {
    event.preventDefault()
    event.stopPropagation()

    if (!jobId) {
      return
    }

    const shareUrl =
      `${window.location.origin}/jobs/${jobId}`

    const shareData = {
      title:
        job?.title ||
        'Job Opportunity',

      text:
        `Check out this job: ${
          job?.title ||
          'Job Opportunity'
        } at ${companyName}`,

      url: shareUrl,
    }

    try {
      // Mobile / supported browsers
      if (navigator.share) {
        await navigator.share(
          shareData
        )
        return
      }

      // Clipboard
      if (
        navigator.clipboard &&
        window.isSecureContext
      ) {
        await navigator.clipboard.writeText(
          shareUrl
        )

        alert(
          'Job link copied to clipboard!'
        )

        return
      }

      // Fallback clipboard
      const textArea =
        document.createElement(
          'textarea'
        )

      textArea.value = shareUrl

      document.body.appendChild(
        textArea
      )

      textArea.select()

      document.execCommand('copy')

      document.body.removeChild(
        textArea
      )

      alert(
        'Job link copied to clipboard!'
      )
    } catch (error) {
      if (
        error?.name ===
        'AbortError'
      ) {
        return
      }

      console.error(
        'Job share error:',
        error
      )

      if (onShare) {
        onShare(job)
      }
    }
  }

  // =====================================================
  // INVALID JOB
  // =====================================================
  if (!jobId) {
    return null
  }

  // =====================================================
  // UI
  // =====================================================
  return (
    <div className="group bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-card hover:shadow-card-hover transition-all duration-200 p-5 flex flex-col">

      {/* =================================================
          HEADER
      ================================================= */}
      <div className="flex items-start justify-between gap-4 mb-4">

        <div className="flex items-center gap-3 min-w-0">

          {/* Company Logo */}
          <img
            src={logoUrl}
            alt={companyName}
            onError={handleImageError}
            className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 flex-shrink-0"
          />

          {/* Company */}
          <div className="min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-white truncate">
              {companyName}
            </h3>

            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
              {location}
            </p>
          </div>

        </div>

        {/* Match Score */}
        {showMatchScore &&
          matchScore !== null && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs font-semibold flex-shrink-0">
              <Zap size={13} />
              {matchScore}%
            </div>
          )}

      </div>

      {/* =================================================
          JOB TITLE
      ================================================= */}
      <div className="mb-4">

        <h2 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2">
          {job?.title ||
            'Untitled Job'}
        </h2>

        {job?.category && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {job.category}
          </p>
        )}

      </div>

      {/* =================================================
          JOB META
      ================================================= */}
      <div className="space-y-2.5 mb-4">

        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <MapPin
            size={16}
            className="flex-shrink-0"
          />

          <span className="truncate">
            {location}
          </span>
        </div>

        {/* Job Type */}
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <Briefcase
            size={16}
            className="flex-shrink-0"
          />

          <span>
            {jobType}
          </span>

          {workMode && (
            <>
              <span className="text-gray-300 dark:text-gray-600">
                •
              </span>

              <span>
                {workMode}
              </span>
            </>
          )}
        </div>

        {/* Salary */}
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <DollarSign
            size={16}
            className="flex-shrink-0"
          />

          <span className="truncate">
            {salaryText}
          </span>
        </div>

        {/* Experience */}
        <div className="text-sm text-gray-600 dark:text-gray-300">
          <span className="font-medium">
            Experience:
          </span>{' '}
          {experience}
        </div>

      </div>

      {/* =================================================
          SKILLS
      ================================================= */}
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-5">

          {skills
            .slice(0, 5)
            .map((skill, index) => (
              <Badge
                key={`${skill}-${index}`}
                variant="secondary"
              >
                {skill}
              </Badge>
            ))}

          {skills.length > 5 && (
            <span className="text-xs text-gray-500 dark:text-gray-400 self-center">
              +{skills.length - 5}
            </span>
          )}

        </div>
      )}

      {/* =================================================
          FOOTER BUTTONS
      ================================================= */}
      <div className="flex gap-2 mt-auto">

        {/* View Details */}
        <Link
          to={`/jobs/${jobId}`}
          className="flex-1"
        >
          <Button
            variant="primary"
            className="w-full"
          >
            View Details
          </Button>
        </Link>

        {/* Save / Unsave */}
        <button
          type="button"
          onClick={handleSave}
          title={
            isSaved
              ? 'Remove saved job'
              : 'Save job'
          }
          className={`w-11 h-11 rounded-lg border flex items-center justify-center transition ${
            isSaved
              ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
        >
          {isSaved ? (
            <BookmarkCheck
              size={19}
            />
          ) : (
            <Bookmark
              size={19}
            />
          )}
        </button>

        {/* Share */}
        <button
          type="button"
          onClick={handleShare}
          title="Share job"
          className="w-11 h-11 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center transition"
        >
          <Share2 size={19} />
        </button>

      </div>

    </div>
  )
}

// =====================================================
// EXPORTS
// IMPORTANT: Both exports are included so this works:
// import JobCard from './JobCard'
// AND
// import { JobCard } from './JobCard'
// =====================================================
export { JobCard }
export default JobCard