import React, { useEffect, useState } from 'react'
import {
  Settings as SettingsIcon,
  Save,
  RotateCcw,
  Bell,
  Shield,
  Globe,
  Mail,
  Briefcase,
  CheckCircle,
} from 'lucide-react'

import {
  Card,
  Button,
  Input,
} from '../../components/common'

const DEFAULT_SETTINGS = {
  platformName: 'CareerBridge',
  adminEmail: '',
  maintenanceMode: false,
  emailNotifications: true,
  jobNotifications: true,
  applicationNotifications: true,
  requireJobApproval: false,
}

const AdminSettings = () => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [saved, setSaved] = useState(false)

  // =====================================================
  // LOAD SETTINGS
  // =====================================================

  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem(
        'careerbridge_admin_settings'
      )

      if (savedSettings) {
        setSettings({
          ...DEFAULT_SETTINGS,
          ...JSON.parse(savedSettings),
        })
      }
    } catch (error) {
      console.error('Load settings error:', error)
    }
  }, [])

  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    setSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))

    setSaved(false)
  }

  // =====================================================
  // SAVE SETTINGS
  // =====================================================

  const handleSave = () => {
    try {
      localStorage.setItem(
        'careerbridge_admin_settings',
        JSON.stringify(settings)
      )

      setSaved(true)

      setTimeout(() => {
        setSaved(false)
      }, 3000)
    } catch (error) {
      console.error('Save settings error:', error)
      alert('Failed to save settings')
    }
  }

  // =====================================================
  // RESET SETTINGS
  // =====================================================

  const handleReset = () => {
    const confirmed = window.confirm(
      'Are you sure you want to reset all admin settings?'
    )

    if (!confirmed) return

    setSettings(DEFAULT_SETTINGS)

    localStorage.setItem(
      'careerbridge_admin_settings',
      JSON.stringify(DEFAULT_SETTINGS)
    )

    setSaved(false)
  }

  // =====================================================
  // TOGGLE COMPONENT
  // =====================================================

  const Toggle = ({
    name,
    checked,
    onChange,
  }) => {
    return (
      <button
        type="button"
        onClick={() =>
          onChange({
            target: {
              name,
              type: 'checkbox',
              checked: !checked,
            },
          })
        }
        className={`relative h-6 w-11 rounded-full transition ${
          checked
            ? 'bg-indigo-600'
            : 'bg-gray-300 dark:bg-gray-700'
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
            checked
              ? 'left-6'
              : 'left-1'
          }`}
        />
      </button>
    )
  }

  return (
    <div className="space-y-6">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>

          <div className="flex items-center gap-3">

            <div className="rounded-xl bg-indigo-50 p-3 dark:bg-indigo-900/30">

              <SettingsIcon
                size={28}
                className="text-indigo-600"
              />

            </div>

            <div>

              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Admin Settings
              </h1>

              <p className="mt-1 text-gray-500 dark:text-gray-400">
                Manage CareerBridge administration preferences
              </p>

            </div>

          </div>

        </div>


        <div className="flex gap-3">

          <Button
            variant="outline"
            onClick={handleReset}
          >
            <RotateCcw
              size={18}
              className="mr-2"
            />

            Reset
          </Button>

          <Button onClick={handleSave}>

            <Save
              size={18}
              className="mr-2"
            />

            Save Changes

          </Button>

        </div>

      </div>


      {/* =================================================
          SUCCESS MESSAGE
      ================================================= */}

      {saved && (

        <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-green-700 dark:border-green-900/40 dark:bg-green-900/20 dark:text-green-400">

          <CheckCircle size={20} />

          <span className="font-medium">
            Settings saved successfully.
          </span>

        </div>

      )}


      {/* =================================================
          PLATFORM SETTINGS
      ================================================= */}

      <Card>

        <div className="border-b border-gray-200 p-6 dark:border-gray-700">

          <div className="flex items-center gap-3">

            <Globe
              size={22}
              className="text-indigo-600"
            />

            <div>

              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Platform Settings
              </h2>

              <p className="text-sm text-gray-500">
                Basic CareerBridge platform information
              </p>

            </div>

          </div>

        </div>


        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">

          {/* Platform Name */}

          <div>

            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Platform Name
            </label>

            <Input
              name="platformName"
              value={settings.platformName}
              onChange={handleChange}
              placeholder="CareerBridge"
            />

          </div>


          {/* Admin Email */}

          <div>

            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Admin Email
            </label>

            <Input
              type="email"
              name="adminEmail"
              value={settings.adminEmail}
              onChange={handleChange}
              placeholder="admin@careerbridge.com"
            />

          </div>

        </div>

      </Card>


      {/* =================================================
          NOTIFICATION SETTINGS
      ================================================= */}

      <Card>

        <div className="border-b border-gray-200 p-6 dark:border-gray-700">

          <div className="flex items-center gap-3">

            <Bell
              size={22}
              className="text-purple-600"
            />

            <div>

              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Notification Settings
              </h2>

              <p className="text-sm text-gray-500">
                Control admin notification preferences
              </p>

            </div>

          </div>

        </div>


        <div className="divide-y divide-gray-200 dark:divide-gray-700">

          {/* Email Notifications */}

          <div className="flex items-center justify-between p-6">

            <div className="flex items-center gap-4">

              <div className="rounded-lg bg-gray-100 p-3 dark:bg-gray-800">

                <Mail size={20} />

              </div>

              <div>

                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Email Notifications
                </h3>

                <p className="text-sm text-gray-500">
                  Receive important platform notifications
                </p>

              </div>

            </div>

            <Toggle
              name="emailNotifications"
              checked={settings.emailNotifications}
              onChange={handleChange}
            />

          </div>


          {/* Job Notifications */}

          <div className="flex items-center justify-between p-6">

            <div className="flex items-center gap-4">

              <div className="rounded-lg bg-gray-100 p-3 dark:bg-gray-800">

                <Briefcase size={20} />

              </div>

              <div>

                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Job Notifications
                </h3>

                <p className="text-sm text-gray-500">
                  Notifications about newly posted jobs
                </p>

              </div>

            </div>

            <Toggle
              name="jobNotifications"
              checked={settings.jobNotifications}
              onChange={handleChange}
            />

          </div>


          {/* Application Notifications */}

          <div className="flex items-center justify-between p-6">

            <div className="flex items-center gap-4">

              <div className="rounded-lg bg-gray-100 p-3 dark:bg-gray-800">

                <Bell size={20} />

              </div>

              <div>

                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Application Notifications
                </h3>

                <p className="text-sm text-gray-500">
                  Notifications about job applications
                </p>

              </div>

            </div>

            <Toggle
              name="applicationNotifications"
              checked={settings.applicationNotifications}
              onChange={handleChange}
            />

          </div>

        </div>

      </Card>


      {/* =================================================
          SECURITY & JOB SETTINGS
      ================================================= */}

      <Card>

        <div className="border-b border-gray-200 p-6 dark:border-gray-700">

          <div className="flex items-center gap-3">

            <Shield
              size={22}
              className="text-red-600"
            />

            <div>

              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Security & Job Controls
              </h2>

              <p className="text-sm text-gray-500">
                Administrative controls for CareerBridge
              </p>

            </div>

          </div>

        </div>


        <div className="divide-y divide-gray-200 dark:divide-gray-700">

          {/* Maintenance Mode */}

          <div className="flex items-center justify-between p-6">

            <div>

              <h3 className="font-semibold text-gray-900 dark:text-white">
                Maintenance Mode
              </h3>

              <p className="text-sm text-gray-500">
                Enable maintenance mode for the platform
              </p>

            </div>

            <Toggle
              name="maintenanceMode"
              checked={settings.maintenanceMode}
              onChange={handleChange}
            />

          </div>


          {/* Job Approval */}

          <div className="flex items-center justify-between p-6">

            <div>

              <h3 className="font-semibold text-gray-900 dark:text-white">
                Require Job Approval
              </h3>

              <p className="text-sm text-gray-500">
                Require admin approval before publishing jobs
              </p>

            </div>

            <Toggle
              name="requireJobApproval"
              checked={settings.requireJobApproval}
              onChange={handleChange}
            />

          </div>

        </div>

      </Card>


      {/* =================================================
          SAVE FOOTER
      ================================================= */}

      <div className="flex justify-end">

        <Button onClick={handleSave}>

          <Save
            size={18}
            className="mr-2"
          />

          Save Settings

        </Button>

      </div>

    </div>
  )
}

export default AdminSettings