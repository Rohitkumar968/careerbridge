import React from 'react'

export const ProgressBar = ({ value, max = 100, label, showLabel = true, className = '' }) => {
  const percentage = Math.min(100, Math.round((value / max) * 100))

  return (
    <div className={className}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
          <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">{percentage}%</span>
        </div>
      )}
      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${percentage}%`,
            background: 'linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%)',
          }}
        />
      </div>
    </div>
  )
}

export default ProgressBar
