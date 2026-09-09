import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../components/common'

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white dark:from-gray-800 dark:to-gray-900 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">
          404
        </h1>
        <p className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Page Not Found
        </p>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Sorry, the page you're looking for doesn't exist.
        </p>
        <Link to="/">
          <Button variant="primary" size="lg">
            Go Home
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default NotFoundPage
