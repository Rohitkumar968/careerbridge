import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Eye, EyeOff } from 'lucide-react'
import { Button, Input, Card } from '../../components/common'
import { loginSuccess } from '../../store/slices/authSlice'
import authApi from '../../services/authApi'

export const RegisterPage = () => {
  const [role, setRole] = useState('job_seeker')
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const passwordStrength = (password) => {
    if (!password) return 0
    let strength = 0
    if (password.length >= 8) strength++
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (/[^a-zA-Z\d]/.test(password)) strength++
    return strength
  }

  const strength = passwordStrength(formData.password)
  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong']

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name) newErrors.name = 'Name is required'
    if (!formData.email) newErrors.email = 'Email is required'
    if (!formData.password) newErrors.password = 'Password is required'
    if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters'
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    setApiError('')
    try {
      const response = await authApi.register({ name: formData.name, email: formData.email, password: formData.password, role })
      const { token, user } = response.data.data
      dispatch(loginSuccess({ token, user }))
      if (user.role === 'recruiter') navigate('/recruiter')
      else navigate('/dashboard')
    } catch (err) {
      setApiError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-hero-gradient dark:bg-hero-gradient-dark flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2.5 mb-4">
            <div className="cb-logo-mark shadow-brand">
              CB
            </div>
            <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Career<span className="text-brand-gradient">Bridge</span>
            </span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Create Account</h1>
          <p className="text-slate-500 dark:text-slate-400">Join thousands of professionals</p>
        </div>

        <Card>
          {apiError && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{apiError}</p>
            </div>
          )}

          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">I am a</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('job_seeker')}
                className={`p-3 rounded-lg border-2 transition-all ${
                  role === 'job_seeker'
                    ? 'border-primary-600 bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300'
                    : 'border-slate-300 dark:border-slate-600 hover:border-primary-300 text-slate-700 dark:text-slate-300'
                }`}
              >
                <p className="font-semibold text-sm">Job Seeker</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Find jobs</p>
              </button>
              <button
                type="button"
                onClick={() => setRole('recruiter')}
                className={`p-3 rounded-lg border-2 transition-all ${
                  role === 'recruiter'
                    ? 'border-primary-600 bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300'
                    : 'border-slate-300 dark:border-slate-600 hover:border-primary-300 text-slate-700 dark:text-slate-300'
                }`}
              >
                <p className="font-semibold text-sm">Recruiter</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Hire talent</p>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={errors.name}
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={errors.email}
            />

            <div>
              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  error={errors.password}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-10 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {formData.password && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        strength === 1 ? 'w-1/4 bg-red-500' :
                        strength === 2 ? 'w-1/2 bg-amber-500' :
                        strength === 3 ? 'w-3/4 bg-primary-500' :
                        'w-full bg-emerald-500'
                      }`}
                    />
                  </div>
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    {strengthLabels[strength - 1]}
                  </span>
                </div>
              )}
            </div>

            <div className="relative">
              <Input
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                error={errors.confirmPassword}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-10 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <label className="flex items-start gap-2">
              <input type="checkbox" className="rounded mt-1 accent-primary-600" required />
              <span className="text-sm text-slate-600 dark:text-slate-400">
                I agree to the{' '}
                <Link to="/terms" className="text-primary-600 hover:text-primary-700 font-medium">Terms & Conditions</Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-primary-600 hover:text-primary-700 font-medium">Privacy Policy</Link>
              </span>
            </label>

            <Button type="submit" variant="primary" className="w-full" loading={isLoading}>
              Create Account
            </Button>
          </form>

          <p className="text-center text-slate-500 dark:text-slate-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold">Sign in</Link>
          </p>
        </Card>
      </div>
    </div>
  )
}

export default RegisterPage
