import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  Sun,
  Moon,
  Bell,
  Lock,
  LogOut,
  User,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'
import axios from 'axios'

import { Card, Button } from '../../components/common'
import { toggleTheme } from '../../store/slices/themeSlice'
import { logout } from '../../store/slices/authSlice'

export const SettingsPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { mode } = useSelector((state) => state.theme)
  const { user } = useSelector((state) => state.auth)

  // =====================================================
  // NOTIFICATION PREFERENCES
  // =====================================================
  const [notifPrefs, setNotifPrefs] = useState({
    applications: true,
    interviews: true,
    jobMatches: true,
    marketing: false,
  })

  // =====================================================
  // PASSWORD STATE
  // =====================================================
  const [showPasswordForm, setShowPasswordForm] = useState(false)

  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordSuccess, setPasswordSuccess] = useState('')
  const [passwordError, setPasswordError] = useState('')

  // =====================================================
  // LOGOUT
  // =====================================================
  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  // =====================================================
  // NOTIFICATION TOGGLE
  // =====================================================
  const toggleNotif = (key) => {
    setNotifPrefs((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  // =====================================================
  // PASSWORD INPUT
  // =====================================================
  const handlePasswordChange = (e) => {
    const { name, value } = e.target

    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }))

    setPasswordError('')
    setPasswordSuccess('')
  }

  // =====================================================
  // CHANGE PASSWORD
  // =====================================================
  const handleChangePassword = async (e) => {
    e.preventDefault()

    setPasswordError('')
    setPasswordSuccess('')

    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = passwordData

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Please fill in all password fields.')
      return
    }

    if (newPassword.length < 6) {
      setPasswordError(
        'New password must be at least 6 characters long.'
      )
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(
        'New password and confirm password do not match.'
      )
      return
    }

    if (currentPassword === newPassword) {
      setPasswordError(
        'New password must be different from current password.'
      )
      return
    }

    try {
      setPasswordLoading(true)

      const token = localStorage.getItem('token')

      if (!token) {
        setPasswordError('Your session has expired. Please login again.')
        return
      }

      const response = await axios.put(
        '/api/auth/change-password',
        {
          currentPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )

      setPasswordSuccess(
        response.data?.message ||
        'Password changed successfully.'
      )

      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })

    } catch (error) {
      console.error(
        'Change password error:',
        error.response?.data || error.message
      )

      setPasswordError(
        error.response?.data?.message ||
        'Failed to change password. Please check your current password.'
      )
    } finally {
      setPasswordLoading(false)
    }
  }

  // =====================================================
  // PASSWORD FORM TOGGLE
  // =====================================================
  const togglePasswordForm = () => {
    setShowPasswordForm((prev) => !prev)

    setPasswordError('')
    setPasswordSuccess('')
  }

  return (
    <div className="space-y-6 max-w-2xl">

      {/* =================================================
          HEADER
      ================================================= */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
          Settings
        </h1>

        <p className="text-gray-600 dark:text-gray-400">
          Manage your account preferences
        </p>
      </div>

      {/* =================================================
          ACCOUNT
      ================================================= */}
      <Card>

        <div className="flex items-center gap-3 mb-4">

          <User className="w-5 h-5 text-gray-500" />

          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Account
          </h2>

        </div>

        <div className="space-y-3 text-sm">

          <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">

            <span className="text-gray-600 dark:text-gray-400">
              Name
            </span>

            <span className="font-medium text-gray-900 dark:text-white">
              {user?.name || '—'}
            </span>

          </div>

          <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">

            <span className="text-gray-600 dark:text-gray-400">
              Email
            </span>

            <span className="font-medium text-gray-900 dark:text-white">
              {user?.email || '—'}
            </span>

          </div>

          <div className="flex justify-between items-center py-2">

            <span className="text-gray-600 dark:text-gray-400">
              Role
            </span>

            <span className="font-medium text-gray-900 dark:text-white capitalize">
              {user?.role?.replace('_', ' ') || '—'}
            </span>

          </div>

        </div>

        <div className="mt-4">

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/profile')}
          >
            Edit Profile
          </Button>

        </div>

      </Card>

      {/* =================================================
          APPEARANCE
      ================================================= */}
      <Card>

        <div className="flex items-center gap-3 mb-4">

          {mode === 'dark' ? (
            <Moon className="w-5 h-5 text-gray-500" />
          ) : (
            <Sun className="w-5 h-5 text-gray-500" />
          )}

          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Appearance
          </h2>

        </div>

        <div className="flex items-center justify-between">

          <div>

            <p className="font-medium text-gray-900 dark:text-white">
              Theme
            </p>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Currently using {mode} mode
            </p>

          </div>

          <button
            type="button"
            onClick={() => dispatch(toggleTheme())}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              mode === 'dark'
                ? 'bg-primary-600'
                : 'bg-gray-300'
            }`}
          >

            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                mode === 'dark'
                  ? 'translate-x-6'
                  : 'translate-x-1'
              }`}
            />

          </button>

        </div>

      </Card>

      {/* =================================================
          NOTIFICATIONS
      ================================================= */}
      <Card>

        <div className="flex items-center gap-3 mb-4">

          <Bell className="w-5 h-5 text-gray-500" />

          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Notification Preferences
          </h2>

        </div>

        <div className="space-y-4">

          {[
            {
              key: 'applications',
              label: 'Application updates',
              desc: 'Status changes on your applications',
            },
            {
              key: 'interviews',
              label: 'Interview reminders',
              desc: 'Upcoming interview notifications',
            },
            {
              key: 'jobMatches',
              label: 'New job matches',
              desc: 'Jobs that match your profile',
            },
            {
              key: 'marketing',
              label: 'Tips & promotions',
              desc: 'Career tips and platform news',
            },
          ].map(({ key, label, desc }) => (

            <div
              key={key}
              className="flex items-center justify-between"
            >

              <div>

                <p className="font-medium text-gray-900 dark:text-white text-sm">
                  {label}
                </p>

                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {desc}
                </p>

              </div>

              <button
                type="button"
                onClick={() => toggleNotif(key)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifPrefs[key]
                    ? 'bg-primary-600'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >

                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifPrefs[key]
                      ? 'translate-x-6'
                      : 'translate-x-1'
                  }`}
                />

              </button>

            </div>

          ))}

        </div>

      </Card>

      {/* =================================================
          SECURITY
      ================================================= */}
      <Card>

        <div className="flex items-center gap-3 mb-4">

          <Lock className="w-5 h-5 text-gray-500" />

          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Security
          </h2>

        </div>

        <div>

          <p className="font-medium text-gray-900 dark:text-white">
            Change Password
          </p>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-4">
            Update your account password securely.
          </p>

          {/* CHANGE PASSWORD BUTTON */}
          {!showPasswordForm && (
            <Button
              variant="outline"
              size="sm"
              onClick={togglePasswordForm}
            >
              <Lock className="w-4 h-4 mr-2" />
              Change Password
            </Button>
          )}

          {/* PASSWORD FORM */}
          {showPasswordForm && (
            <form
              onSubmit={handleChangePassword}
              className="space-y-4 mt-4"
            >

              {/* CURRENT PASSWORD */}
              <div>

                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Current Password
                </label>

                <div className="relative">

                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter current password"
                    autoComplete="current-password"
                    className="w-full px-3 py-2.5 pr-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowCurrentPassword((prev) => !prev)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>

                </div>

              </div>

              {/* NEW PASSWORD */}
              <div>

                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  New Password
                </label>

                <div className="relative">

                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter new password"
                    autoComplete="new-password"
                    className="w-full px-3 py-2.5 pr-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowNewPassword((prev) => !prev)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>

                </div>

                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Minimum 6 characters
                </p>

              </div>

              {/* CONFIRM PASSWORD */}
              <div>

                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Confirm New Password
                </label>

                <div className="relative">

                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Confirm new password"
                    autoComplete="new-password"
                    className="w-full px-3 py-2.5 pr-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword((prev) => !prev)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>

                </div>

              </div>

              {/* SUCCESS */}
              {passwordSuccess && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-sm">

                  <CheckCircle className="w-5 h-5 flex-shrink-0" />

                  <span>
                    {passwordSuccess}
                  </span>

                </div>
              )}

              {/* ERROR */}
              {passwordError && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">

                  <AlertCircle className="w-5 h-5 flex-shrink-0" />

                  <span>
                    {passwordError}
                  </span>

                </div>
              )}

              {/* BUTTONS */}
              <div className="flex flex-wrap gap-2">

                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium transition"
                >
                  {passwordLoading
                    ? 'Changing...'
                    : 'Update Password'}
                </button>

                <button
                  type="button"
                  onClick={togglePasswordForm}
                  disabled={passwordLoading}
                  className="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium transition"
                >
                  Cancel
                </button>

              </div>

            </form>
          )}

        </div>

      </Card>

      {/* =================================================
          LOGOUT
      ================================================= */}
      <Card>

        <div className="flex items-center justify-between">

          <div>

            <p className="font-medium text-gray-900 dark:text-white">
              Sign out
            </p>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Sign out of your account on this device
            </p>

          </div>

          <Button
            variant="danger"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>

        </div>

      </Card>

    </div>
  )
}

export default SettingsPage