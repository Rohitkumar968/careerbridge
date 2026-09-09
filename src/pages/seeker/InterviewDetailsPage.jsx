import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Calendar,
  Clock,
  Video,
  User,
  Building2,
  MapPin,
  ExternalLink,
} from 'lucide-react'

import { Card, Badge, Button } from '../../components/common'
import { mockInterviews } from '../../data/mockData'

export const InterviewDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const interview = mockInterviews.find(
    (item) => String(item.id) === String(id)
  )

  if (!interview) {
    return (
      <div className="space-y-6">

        <Button
          variant="outline"
          onClick={() => navigate('/dashboard/interviews')}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Interviews
        </Button>

        <Card className="text-center py-12">

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Interview Not Found
          </h1>

          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The interview you are looking for does not exist.
          </p>

          <Button
            variant="primary"
            onClick={() => navigate('/dashboard/interviews')}
          >
            Go to Interviews
          </Button>

        </Card>

      </div>
    )
  }

  const handleJoinInterview = () => {
    if (!interview.meetingLink) {
      alert('Meeting link is not available.')
      return
    }

    window.open(
      interview.meetingLink,
      '_blank',
      'noopener,noreferrer'
    )
  }

  return (
    <div className="space-y-6">

      {/* BACK BUTTON */}

      <Button
        variant="outline"
        onClick={() => navigate('/dashboard/interviews')}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Interviews
      </Button>

      {/* HEADER */}

      <Card>

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">

          <div>

            <p className="text-sm text-primary-600 dark:text-primary-400 font-medium mb-2">
              Interview Details
            </p>

            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {interview.position}
            </h1>

            <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">
              {interview.company}
            </p>

          </div>

          <Badge variant="primary">
            {interview.status}
          </Badge>

        </div>

      </Card>

      {/* INTERVIEW INFORMATION */}

      <Card>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Interview Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* COMPANY */}

          <div className="flex items-start gap-3">

            <Building2 className="w-5 h-5 text-primary-600 mt-1" />

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Company
              </p>

              <p className="font-medium text-gray-900 dark:text-white">
                {interview.company}
              </p>
            </div>

          </div>

          {/* INTERVIEWER */}

          <div className="flex items-start gap-3">

            <User className="w-5 h-5 text-primary-600 mt-1" />

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Interviewer
              </p>

              <p className="font-medium text-gray-900 dark:text-white">
                {interview.interviewer}
              </p>
            </div>

          </div>

          {/* DATE */}

          <div className="flex items-start gap-3">

            <Calendar className="w-5 h-5 text-primary-600 mt-1" />

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Date
              </p>

              <p className="font-medium text-gray-900 dark:text-white">
                {new Date(interview.date).toLocaleDateString(
                  'en-US',
                  {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  }
                )}
              </p>
            </div>

          </div>

          {/* TIME */}

          <div className="flex items-start gap-3">

            <Clock className="w-5 h-5 text-primary-600 mt-1" />

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Time
              </p>

              <p className="font-medium text-gray-900 dark:text-white">
                {interview.time}
              </p>
            </div>

          </div>

          {/* TYPE */}

          <div className="flex items-start gap-3">

            <Video className="w-5 h-5 text-primary-600 mt-1" />

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Interview Type
              </p>

              <p className="font-medium text-gray-900 dark:text-white">
                {interview.type}
              </p>
            </div>

          </div>

          {/* LOCATION */}

          <div className="flex items-start gap-3">

            <MapPin className="w-5 h-5 text-primary-600 mt-1" />

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Location
              </p>

              <p className="font-medium text-gray-900 dark:text-white">
                Online
              </p>
            </div>

          </div>

        </div>

      </Card>

      {/* MEETING */}

      <Card>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
          Join Interview
        </h2>

        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Use the button below to join your scheduled interview.
        </p>

        <Button
          variant="primary"
          onClick={handleJoinInterview}
        >
          <Video className="w-4 h-4" />
          Join Interview
          <ExternalLink className="w-4 h-4" />
        </Button>

      </Card>

    </div>
  )
}

export default InterviewDetailsPage