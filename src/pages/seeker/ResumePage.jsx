import React, { useEffect, useState } from 'react'
import {
  FileText,
  Download,
  Trash2,
  Upload,
  CheckCircle,
  Eye,
  Loader2,
  AlertCircle,
  RefreshCw,
  Sparkles,
  LayoutTemplate,
  Award,
  TrendingUp,
  ShieldCheck,
} from 'lucide-react'

import {
  Card,
  Button,
  FileUpload,
  Badge,
  ProgressBar,
} from '../../components/common'

import api from '../../services/api'

// =====================================================
// SCORE COLOR
// =====================================================

const getScoreColor = (score) => {
  if (score >= 80) {
    return {
      text: 'text-green-600 dark:text-green-400',
      label: 'Excellent',
    }
  }

  if (score >= 60) {
    return {
      text: 'text-yellow-600 dark:text-yellow-400',
      label: 'Good',
    }
  }

  return {
    text: 'text-red-600 dark:text-red-400',
    label: 'Needs Improvement',
  }
}

// =====================================================
// SCORE CARD
// =====================================================

const ScoreCard = ({
  title,
  score,
  description,
  icon: Icon,
}) => {
  const safeScore = Math.min(
    100,
    Math.max(0, Number(score) || 0)
  )

  const scoreStyle = getScoreColor(safeScore)

  const circumference = 264
  const offset =
    circumference -
    (circumference * safeScore) / 100

  return (
    <Card>
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/40">
              <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>

            <h3 className="font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            {description}
          </p>
        </div>

        <Badge
          variant={
            safeScore >= 80
              ? 'success'
              : safeScore >= 60
              ? 'warning'
              : 'danger'
          }
        >
          {scoreStyle.label}
        </Badge>
      </div>

      <div className="flex items-center gap-5">
        <div className="relative w-24 h-24 flex-shrink-0">
          <svg
            className="w-24 h-24 -rotate-90"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-gray-200 dark:text-gray-700"
            />

            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
              className={scoreStyle.text}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
          </svg>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <span
                className={`text-2xl font-bold ${scoreStyle.text}`}
              >
                {safeScore}
              </span>

              <span className="text-xs text-gray-500 dark:text-gray-400 block">
                / 100
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Score
            </span>

            <span
              className={`text-sm font-semibold ${scoreStyle.text}`}
            >
              {safeScore}%
            </span>
          </div>

          <ProgressBar
            value={safeScore}
            max={100}
            showLabel={false}
          />

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
            {safeScore >= 80
              ? 'Your resume performs very well in this area.'
              : safeScore >= 60
              ? 'Your resume has a solid foundation but can be improved.'
              : 'This area needs improvement to strengthen your resume.'}
          </p>
        </div>
      </div>
    </Card>
  )
}

// =====================================================
// RESUME PAGE
// =====================================================

export const ResumePage = () => {
  const [resume, setResume] = useState(null)

  const [loading, setLoading] =
    useState(true)

  const [uploading, setUploading] =
    useState(false)

  const [deleting, setDeleting] =
    useState(false)

  const [viewing, setViewing] =
    useState(false)

  const [downloading, setDownloading] =
    useState(false)

  const [analyzing, setAnalyzing] =
    useState(false)

  const [showUpload, setShowUpload] =
    useState(false)

  const [error, setError] =
    useState('')

  // =====================================================
  // LOAD RESUME
  // =====================================================

  const loadResume = async () => {
    try {
      setLoading(true)
      setError('')

      const response =
        await api.get('/resume')

      if (response.data?.success) {
        setResume(response.data.data)
      } else {
        setResume(null)
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setResume(null)
      } else {
        console.error(
          'Load resume error:',
          err
        )

        setError(
          err.response?.data?.message ||
            'Unable to load resume.'
        )
      }
    } finally {
      setLoading(false)
    }
  }

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    loadResume()
  }, [])

  // =====================================================
  // UPLOAD RESUME
  // =====================================================

  const handleFileSelect = async (file) => {
    if (!file) return

    setError('')

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ]

    if (!allowedTypes.includes(file.type)) {
      setError(
        'Only PDF, DOC and DOCX files are allowed.'
      )
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError(
        'Resume size must be less than 5 MB.'
      )
      return
    }

    try {
      setUploading(true)

      const formData = new FormData()

      formData.append('resume', file)

      const response = await api.post(
        '/resume/upload',
        formData
      )

      if (response.data?.success) {
        setResume(response.data.data)

        setShowUpload(false)

        alert(
          'Resume uploaded and analyzed successfully!'
        )
      }
    } catch (err) {
      console.error(
        'Upload resume error:',
        err
      )

      setError(
        err.response?.data?.message ||
          'Failed to upload resume.'
      )
    } finally {
      setUploading(false)
    }
  }

  // =====================================================
  // VIEW RESUME
  // =====================================================

  const handleView = async () => {
    try {
      setViewing(true)
      setError('')

      const response = await api.get(
        '/resume/view',
        {
          responseType: 'blob',
        }
      )

      const contentType =
        response.headers['content-type'] ||
        resume?.mimeType ||
        'application/pdf'

      const blob = new Blob(
        [response.data],
        {
          type: contentType,
        }
      )

      const url =
        window.URL.createObjectURL(blob)

      window.open(
        url,
        '_blank',
        'noopener,noreferrer'
      )

      setTimeout(() => {
        window.URL.revokeObjectURL(url)
      }, 60000)
    } catch (err) {
      console.error(
        'View resume error:',
        err
      )

      setError(
        err.response?.data?.message ||
          'Unable to open resume.'
      )
    } finally {
      setViewing(false)
    }
  }

  // =====================================================
  // DOWNLOAD RESUME
  // =====================================================

  const handleDownload = async () => {
    try {
      setDownloading(true)
      setError('')

      const response = await api.get(
        '/resume/download',
        {
          responseType: 'blob',
        }
      )

      const contentType =
        response.headers['content-type'] ||
        resume?.mimeType ||
        'application/octet-stream'

      const blob = new Blob(
        [response.data],
        {
          type: contentType,
        }
      )

      const url =
        window.URL.createObjectURL(blob)

      const link =
        document.createElement('a')

      link.href = url

      link.download =
        resume?.originalName ||
        'resume.pdf'

      document.body.appendChild(link)

      link.click()

      link.remove()

      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error(
        'Download resume error:',
        err
      )

      setError(
        err.response?.data?.message ||
          'Unable to download resume.'
      )
    } finally {
      setDownloading(false)
    }
  }

  // =====================================================
  // DELETE RESUME
  // =====================================================

  const handleDelete = async () => {
    const confirmed =
      window.confirm(
        'Are you sure you want to delete your resume?\n\nThis action cannot be undone.'
      )

    if (!confirmed) return

    try {
      setDeleting(true)
      setError('')

      const response =
        await api.delete('/resume')

      if (response.data?.success) {
        setResume(null)
        setShowUpload(false)

        alert(
          'Resume deleted successfully!'
        )
      }
    } catch (err) {
      console.error(
        'Delete resume error:',
        err
      )

      setError(
        err.response?.data?.message ||
          'Unable to delete resume.'
      )
    } finally {
      setDeleting(false)
    }
  }

  // =====================================================
  // RE-ANALYZE
  // =====================================================

  const handleAnalyze = async () => {
    try {
      setAnalyzing(true)
      setError('')

      const response =
        await api.post('/resume/analyze')

      if (response.data?.success) {
        setResume(response.data.data)

        alert(
          'Resume analyzed successfully!'
        )
      }
    } catch (err) {
      console.error(
        'Analyze resume error:',
        err
      )

      setError(
        err.response?.data?.message ||
          'Unable to analyze resume.'
      )
    } finally {
      setAnalyzing(false)
    }
  }

  // =====================================================
  // CANCEL UPLOAD
  // =====================================================

  const handleCancelUpload = () => {
    setShowUpload(false)
    setError('')
  }

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            My Resume
          </h1>

          <p className="text-gray-600 dark:text-gray-400">
            Manage and analyze your resume
          </p>
        </div>

        <Card className="py-16">
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="w-10 h-10 text-primary-600 animate-spin mb-4" />

            <p className="text-gray-600 dark:text-gray-400">
              Loading your resume...
            </p>
          </div>
        </Card>
      </div>
    )
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary-100 dark:bg-primary-900/40">
              <FileText className="w-7 h-7 text-primary-600 dark:text-primary-400" />
            </div>

            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              My Resume
            </h1>
          </div>

          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage, analyze and optimize your resume
          </p>
        </div>

        {resume && (
          <Button
            variant="outline"
            onClick={loadResume}
            disabled={loading}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        )}
      </div>

      {/* ERROR */}

      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />

          <div className="flex-1">
            <p className="font-medium text-red-700 dark:text-red-400">
              {error}
            </p>
          </div>

          <button
            onClick={() => setError('')}
            className="text-red-500 hover:text-red-700 text-xl"
          >
            ×
          </button>
        </div>
      )}

      {/* NO RESUME */}

      {!resume && !showUpload && (
        <Card className="text-center py-16">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center">
            <FileText className="w-10 h-10 text-primary-600 dark:text-primary-400" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            No Resume Uploaded
          </h2>

          <p className="text-gray-600 dark:text-gray-400 mb-7 max-w-lg mx-auto">
            Upload your resume to get an ATS compatibility
            score, formatting analysis, detected skills and
            personalized recommendations.
          </p>

          <Button
            variant="primary"
            onClick={() => {
              setError('')
              setShowUpload(true)
            }}
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Resume
          </Button>
        </Card>
      )}

      {/* UPLOAD */}

      {showUpload && (
        <Card>
          <div className="mb-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/40">
                <Upload className="w-5 h-5 text-primary-600" />
              </div>

              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {resume
                  ? 'Replace Resume'
                  : 'Upload Resume'}
              </h2>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              PDF, DOC or DOCX • Maximum 5 MB
            </p>
          </div>

          {uploading ? (
            <div className="border-2 border-dashed border-primary-300 dark:border-primary-700 rounded-xl py-14 text-center">
              <Loader2 className="w-10 h-10 mx-auto text-primary-600 animate-spin mb-4" />

              <p className="font-medium text-gray-900 dark:text-white">
                Uploading and analyzing resume...
              </p>

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Please wait while we analyze your resume
              </p>
            </div>
          ) : (
            <FileUpload
              onFileSelect={handleFileSelect}
              accept=".pdf,.doc,.docx"
              label="Upload Resume"
            />
          )}

          {!uploading && (
            <Button
              variant="secondary"
              className="w-full mt-4"
              onClick={handleCancelUpload}
            >
              Cancel
            </Button>
          )}
        </Card>
      )}

      {/* RESUME DETAILS */}

      {resume && !showUpload && (
        <>
          <Card>
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">

              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary-100 dark:bg-primary-900/40 rounded-xl">
                  <FileText className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-lg break-all">
                    {resume.originalName ||
                      'resume.pdf'}
                  </h3>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Uploaded{' '}
                    {resume.uploadedDate
                      ? new Date(
                          resume.uploadedDate
                        ).toLocaleDateString()
                      : 'Recently'}
                  </p>

                  {resume.size && (
                    <p className="text-xs text-gray-500 mt-1">
                      {(
                        resume.size /
                        1024 /
                        1024
                      ).toFixed(2)}{' '}
                      MB
                    </p>
                  )}
                </div>
              </div>

              <Badge
                variant={
                  resume.status === 'analyzed'
                    ? 'success'
                    : 'warning'
                }
              >
                {resume.status === 'analyzed'
                  ? 'Analyzed'
                  : 'Uploaded'}
              </Badge>
            </div>

            {/* ACTIONS */}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">

              <Button
                variant="primary"
                onClick={handleDownload}
                disabled={downloading}
              >
                {downloading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}

                {downloading
                  ? 'Downloading...'
                  : 'Download'}
              </Button>

              <Button
                variant="secondary"
                onClick={handleView}
                disabled={viewing}
              >
                {viewing ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Eye className="w-4 h-4 mr-2" />
                )}

                {viewing
                  ? 'Opening...'
                  : 'View'}
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  setError('')
                  setShowUpload(true)
                }}
              >
                <Upload className="w-4 h-4 mr-2" />
                Replace
              </Button>

              <Button
                variant="outline"
                onClick={handleAnalyze}
                disabled={analyzing}
              >
                {analyzing ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 mr-2" />
                )}

                {analyzing
                  ? 'Analyzing...'
                  : 'Re-analyze'}
              </Button>

              <Button
                variant="danger"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4 mr-2" />
                )}

                {deleting
                  ? 'Deleting...'
                  : 'Delete'}
              </Button>
            </div>
          </Card>

          {/* SCORE */}

          <div>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-primary-600" />

              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Resume Score
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

              <ScoreCard
                title="ATS Score"
                score={resume.atsScore}
                description="Compatibility with Applicant Tracking Systems"
                icon={ShieldCheck}
              />

              <ScoreCard
                title="Formatting Score"
                score={resume.formattingScore}
                description="Resume structure, readability and formatting"
                icon={LayoutTemplate}
              />
            </div>
          </div>

          {/* PERFORMANCE */}

          <Card>
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/40">
                <Award className="w-5 h-5 text-primary-600" />
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Resume Performance
                </h3>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Quick overview of your resume quality
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
                <p className="text-xs text-gray-500 mb-1">
                  ATS Score
                </p>

                <p className="text-2xl font-bold text-primary-600">
                  {resume.atsScore ?? 0}%
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
                <p className="text-xs text-gray-500 mb-1">
                  Formatting
                </p>

                <p className="text-2xl font-bold text-primary-600">
                  {resume.formattingScore ?? 0}%
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
                <p className="text-xs text-gray-500 mb-1">
                  Skills Found
                </p>

                <p className="text-2xl font-bold text-primary-600">
                  {resume.skills?.length ?? 0}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
                <p className="text-xs text-gray-500 mb-1">
                  Recommendations
                </p>

                <p className="text-2xl font-bold text-primary-600">
                  {resume.recommendations?.length ?? 0}
                </p>
              </div>
            </div>
          </Card>

          {/* SKILLS */}

          <Card>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Skills Detected
                </h3>

                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Technical skills found in your resume
                </p>
              </div>

              <Badge variant="primary">
                {resume.skills?.length ?? 0} Skills
              </Badge>
            </div>

            {resume.skills?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {resume.skills.map(
                  (skill, index) => (
                    <Badge
                      key={`${skill}-${index}`}
                      variant="primary"
                    >
                      {skill}
                    </Badge>
                  )
                )}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                No skills detected.
              </p>
            )}
          </Card>

          {/* STRENGTHS */}

          <Card>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              Resume Strengths
            </h3>

            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
              Areas where your resume performs well
            </p>

            {resume.strengths?.length > 0 ? (
              <ul className="space-y-3">
                {resume.strengths.map(
                  (strength, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/10"
                    >
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />

                      <span className="text-gray-700 dark:text-gray-300 text-sm">
                        {strength}
                      </span>
                    </li>
                  )
                )}
              </ul>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                No strengths available.
              </p>
            )}
          </Card>

          {/* RECOMMENDATIONS */}

          <Card>
            <div className="flex items-center gap-3 mb-1">
              <Sparkles className="w-5 h-5 text-primary-600" />

              <h3 className="font-semibold text-gray-900 dark:text-white">
                Improvement Recommendations
              </h3>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
              Suggestions to improve your ATS performance
            </p>

            {resume.recommendations?.length > 0 ? (
              <ul className="space-y-3">
                {resume.recommendations.map(
                  (
                    recommendation,
                    index
                  ) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-lg bg-primary-50 dark:bg-primary-900/10"
                    >
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-600 text-xs font-bold flex-shrink-0">
                        {index + 1}
                      </span>

                      <span className="text-gray-700 dark:text-gray-300 text-sm pt-0.5">
                        {recommendation}
                      </span>
                    </li>
                  )
                )}
              </ul>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                No recommendations available.
              </p>
            )}
          </Card>
        </>
      )}
    </div>
  )
}

// =====================================================
// DEFAULT EXPORT
// =====================================================

export default ResumePage