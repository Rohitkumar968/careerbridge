import React from 'react'

export const Input = ({
  label,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-2.5 bg-white dark:bg-slate-700 border ${
          error
            ? 'border-red-400 focus:ring-red-400'
            : 'border-slate-300 dark:border-slate-600 focus:ring-primary-500'
        } rounded-lg text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${className}`}
        {...props}
      />
      {error && (
        <p className="text-red-500 text-xs mt-1.5">{error}</p>
      )}
    </div>
  )
}

export default Input
