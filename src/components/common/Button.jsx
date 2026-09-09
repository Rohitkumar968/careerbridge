import React from 'react'
import { Loader } from 'lucide-react'

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary:   'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 shadow-brand hover:shadow-brand-lg focus:ring-primary-500',
    secondary: 'bg-secondary-600 text-white hover:bg-secondary-700 active:bg-secondary-800 focus:ring-secondary-500',
    outline:   'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950 focus:ring-primary-500',
    ghost:     'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100 focus:ring-slate-400',
    danger:    'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus:ring-red-500',
    custom:    '',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  }

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  )
}

export default Button
