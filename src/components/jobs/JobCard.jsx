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
  const jobId = job?._id || job?.id

  const companyName =
    job?.company?.name ||
    (typeof job?.company === 'string' ? job.company : '') ||
    job?.companyName ||
    'Company'

  const logo =
    job?.company?.logo ||
    job?.logo ||
    job?.companyLogo ||
    ''

  const fallbackLogo =
    'https://ui-avatars.com/api/?name=' +
    encodeURIComponent(companyName) +
    '&background=6366f1&color=fff&size=128'

  const logoUrl = logo || fallbackLogo

  const location =
    job?.location ||
    job?.company?.location ||
    'Location not specified'

  const jobType =
    job?.jobType ||
    job?.employmentType ||
    'Full-time'

  const experience =
    job?.experience ||
    job?.experienceLevel ||
    'Not specified'

  const isRemote =
    job?.remote === true ||
    job?.workMode === 'Remote'

  const salaryMin =
    job?.salary?.min ??
    job?.salaryMin ??
    0

  const salaryMax =
    job?.salary?.max ??
    job?.salaryMax ??
    0

  const skills = Array.isArray(job?.skills)
    ? job.skills
    : []

  const matchScore = job?.matchScore ?? 0

  const handleImageError = (event) => {
    event.currentTarget.src = fallbackLogo
  }

  const handleSave = () => {
    if (jobId && onSave) {
      onSave(jobId)
    }
  }

  // ================================
  // SHARE JOB
  // ================================
  const handleShare = async () => {
    if (!jobId) return

    const shareUrl = `${window.location.origin}/jobs/${jobId}`

    const shareData = {
      title: job?.title || 'Job Opportunity',
      text: `Check out this job: ${job?.title || 'Job Opportunity'} at ${companyName}`,
      url: shareUrl,
    }

    try {
      // Mobile / supported browsers
      if (navigator.share) {
        await navigator.share(shareData)
        return
      }

      // Desktop fallback - copy link
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl)
        alert('Job link copied to clipboard!')
        return
      }

      // Older browser fallback
      const textArea = document.createElement('textarea')
      textArea.value = shareUrl
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)

      alert('Job link copied to clipboard!')
    } catch (error) {
      // User cancelled native share
      if (error?.name === 'AbortError') {
        return
      }

      console.error('Job share error:', error)

      // Parent callback if provided
      if (onShare) {
        onShare(job)
      }
    }
  }

  return (
    <div className="group bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-card hover:shadow-card-hover transition-all duration-200 p-5 flex flex-col">

      {/* Header */}
      <div className="flex items-start justify-between mb-4">

        <div className="flex items-start gap-3 flex-1 min-w-0">

          <img
            src={logoUrl}
            alt={companyName}
            onError={handleImageError}
            className="w-11 h-11 rounded-lg object-cover border border-slate-200 dark:border-slate-700 flex-shrink-0 bg-slate-100"
          />

          <div className="min-w-0">

            <h3 className="font-semibold text-slate-900 dark:text-white text-base truncate">
              {job?.title || 'Untitled Job'}
            </h3>

            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 truncate">
              {companyName}
            </p>

          </div>

        </div>

        {showMatchScore && (
          <div className="flex-shrink-0 ml-2 flex flex-col items-center">

            <div className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-600">
              <Zap className="w-3 h-3" />
              {matchScore}%
            </div>

            <p className="text-xs text-slate-400 mt-1">
              match
            </p>

          </div>
        )}

      </div>

      {/* Job information */}
      <div className="space-y-2 mb-4 text-sm text-slate-500 dark:text-slate-400">

        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 flex-shrink-0" />

          <span className="truncate">
            {location}
            {isRemote ? ' · Remote' : ''}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Briefcase className="w-4 h-4 flex-shrink-0" />

          <span>
            {jobType} · {experience}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 flex-shrink-0" />

          <span>
            {salaryMin || salaryMax
              ? `$${Number(salaryMin).toLocaleString()} - $${Number(salaryMax).toLocaleString()}`
              : 'Salary not specified'}
          </span>
        </div>

      </div>

      {/* Skills */}
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">

          {skills.slice(0, 3).map((skill, index) => (
            <Badge
              key={`${skill}-${index}`}
              variant="gray"
            >
              {skill}
            </Badge>
          ))}

          {skills.length > 3 && (
            <Badge variant="gray">
              +{skills.length - 3}
            </Badge>
          )}

        </div>
      )}

      {/* Actions */}
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

        {/* Save */}
        <button
          type="button"
          onClick={handleSave}
          className={`p-2 rounded-lg border ${
            isSaved
              ? 'border-primary-300 bg-primary-50 text-primary-600'
              : 'border-slate-300 text-slate-400 hover:text-primary-600'
          }`}
          title={isSaved ? 'Remove bookmark' : 'Save job'}
        >
          {isSaved ? (
            <BookmarkCheck
              style={{
                width: '18px',
                height: '18px',
              }}
            />
          ) : (
            <Bookmark
              style={{
                width: '18px',
                height: '18px',
              }}
            />
          )}
        </button>

        {/* Share */}
        <button
          type="button"
          onClick={handleShare}
          className="p-2 rounded-lg border border-slate-300 text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-slate-700 transition"
          title="Share job"
        >
          <Share2
            style={{
              width: '18px',
              height: '18px',
            }}
          />
        </button>

      </div>

    </div>
  )
}

export { JobCard }

export default JobCard