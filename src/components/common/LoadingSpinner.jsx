import React from 'react'
import { Loader } from 'lucide-react'

export const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader className={`${sizes[size]} animate-spin text-primary-600`} />
    </div>
  )
}

export default LoadingSpinner
