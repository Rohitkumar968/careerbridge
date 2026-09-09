import React from 'react'
import { User } from 'lucide-react'

export const Avatar = ({ src, alt = 'Avatar', size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  }

  return (
    <div
      className={`${sizes[size]} rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 ${className}`}
      style={!src ? { background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' } : {}}
    >
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <User className="w-1/2 h-1/2 text-white" />
      )}
    </div>
  )
}

export default Avatar
