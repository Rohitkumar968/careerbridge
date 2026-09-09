import React, { useEffect } from 'react'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'

export const Toast = ({ message, type = 'info', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [onClose, duration])

  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <AlertCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
  }

  const colors = {
    success: 'bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-200',
    error: 'bg-red-50 text-red-800 dark:bg-red-900 dark:text-red-200',
    info: 'bg-blue-50 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  }

  return (
    <div className={`flex items-center gap-3 p-4 rounded-lg ${colors[type]} animate-fade-in`}>
      {icons[type]}
      <span className="flex-1">{message}</span>
      <button onClick={onClose} className="hover:opacity-70">
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

export default Toast
