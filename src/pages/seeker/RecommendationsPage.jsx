import React from 'react'
import { useSelector } from 'react-redux'
import { Zap } from 'lucide-react'
import { JobCard } from '../../components/jobs'
import { mockJobs } from '../../data/mockData'

export const RecommendationsPage = () => {
  const { user } = useSelector((state) => state.auth)

  const recommended = [...mockJobs]
    .sort((a, b) => b.matchScore - a.matchScore)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Recommended Jobs</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Jobs matched to your profile{user?.skills?.length ? ` based on: ${user.skills.slice(0, 3).join(', ')}` : ''}
        </p>
      </div>

      <div className="flex items-center gap-2 p-4 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg">
        <Zap className="w-5 h-5 text-primary-600 flex-shrink-0" />
        <p className="text-sm text-primary-700 dark:text-primary-300">
          {recommended.length} jobs recommended for you — sorted by match score
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {recommended.map((job) => (
          <JobCard key={job.id} job={job} showMatchScore />
        ))}
      </div>
    </div>
  )
}

export default RecommendationsPage
