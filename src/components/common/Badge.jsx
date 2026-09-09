import React from 'react'

export const Badge = ({ children, variant = 'primary', className = '' }) => {
  const variants = {
    primary:   'bg-primary-100 text-primary-700 dark:bg-primary-950 dark:text-primary-300',
    secondary: 'bg-secondary-100 text-secondary-700 dark:bg-secondary-950 dark:text-secondary-300',
    success:   'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
    warning:   'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
    danger:    'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
    accent:    'bg-accent-100 text-accent-700 dark:bg-accent-950 dark:text-accent-300',
    gray:      'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}

export default Badge
