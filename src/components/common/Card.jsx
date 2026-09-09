import React from 'react'

export const Card = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-card hover:shadow-card-hover transition-shadow duration-200 p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card
