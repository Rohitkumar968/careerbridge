import React, { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Lock, Eye, EyeOff, ArrowLeft, CheckCircle } from 'lucide-react'
import { Button, Input, Card } from '../../components/common'
import authApi from '../../services/authApi'

export const ResetPasswordPage = () => {
  const { token } = useParams()
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError('')
    setMessage('')

    if (!token) {
      setError('Invalid or missing reset token.')
      return
    }

    if (!password || !confirmPassword) {
      setError('Please enter and confirm your new password.')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)

    try {
      const response = await authApi.resetPassword(token, password)

      setMessage(
        response.data?.message || 'Password reset successfully.'
      )

      // Backend reset-password ke baad login token deta hai,
      // isliye user ko login page par bhej rahe hain.
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Unable to reset password. The link may be invalid or expired.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-hero-gradient dark:bg-hero-gradient-dark flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2.5 mb-4">
            <div className="cb-logo-mark shadow-brand">
              CB
            </div>

            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              Career<span className="text-brand-gradient">Bridge</span>
            </span>
          </div>

          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Reset Password
          </h1>

          <p className="text-slate-500 dark:text-slate-400">
            Create a new password for your account.
          </p>
        </div>

        {/* Card */}
        <Card>

          {/* Success Message */}
          {message && (
            <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />

                <p className="text-sm text-green-600 dark:text-green-400">
                  {message}
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">
                {error}
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* New Password */}
            <div className="relative">
              <Input
                label="New Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter new password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError('')
                }}
                icon={<Lock className="w-5 h-5" />}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-10 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <Input
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value)
                  setError('')
                }}
                icon={<Lock className="w-5 h-5" />}
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                className="absolute right-3 top-10 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Password Requirements */}
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Password must contain at least 8 characters.
            </div>

            {/* Submit */}
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              loading={loading}
              disabled={loading}
            >
              Reset Password
            </Button>

          </form>

          {/* Back to Login */}
          <div className="text-center mt-6">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
          </div>

        </Card>
      </div>
    </div>
  )
}

export default ResetPasswordPage