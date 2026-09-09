import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { Button, Input, Card } from '../../components/common'
import authApi from '../../services/authApi'


export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email.trim()) {
      setError('Email is required')
      setMessage('')
      return
    }

    setError('')
    setMessage('')
    setLoading(true)

    try {
      await authApi.forgotPassword(email.trim())

      setMessage(
        'If an account exists with this email, a password reset link has been sent.'
      )
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Unable to send reset link. Please try again.'
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
            Forgot Password?
          </h1>

          <p className="text-slate-500 dark:text-slate-400">
            Enter your email and we'll help you reset your password.
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

            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setError('')
                setMessage('')
              }}
              icon={<Mail className="w-5 h-5" />}
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              loading={loading}
              disabled={loading}
            >
              Send Reset Link
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

export default ForgotPasswordPage