import React from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const normalizeRole = (role) => {
  if (role === 'job_seeker') return 'seeker'
  return role
}

const ProtectedRoute = ({ children, requiredRole }) => {
  const auth = useSelector((state) => state.auth)

  const isAuthenticated = auth?.isAuthenticated
  const user = auth?.user

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (
    requiredRole &&
    normalizeRole(user?.role) !== normalizeRole(requiredRole)
  ) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute