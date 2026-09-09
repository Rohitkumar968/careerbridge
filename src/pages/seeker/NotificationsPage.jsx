import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Bell,
  CheckCheck,
  Trash2,
  BellOff,
  Loader,
  RefreshCw,
} from 'lucide-react'

import { Card, Button } from '../../components/common'

import {
  fetchNotifications,
  markAsRead,
  markAllAsRead,
  removeNotification,
} from '../../store/slices/notificationSlice'

const TYPE_STYLES = {
  application:
    'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400',

  interview:
    'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400',

  job:
    'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400',

  status:
    'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400',

  system:
    'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
}

const formatDate = (timestamp) => {
  if (!timestamp) return ''

  const date = new Date(timestamp)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  const now = new Date()

  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)

  if (diffMins < 1) {
    return 'Just now'
  }

  if (diffMins < 60) {
    return `${diffMins}m ago`
  }

  const diffHours = Math.floor(diffMins / 60)

  if (diffHours < 24) {
    return `${diffHours}h ago`
  }

  const diffDays = Math.floor(diffHours / 24)

  if (diffDays < 7) {
    return `${diffDays}d ago`
  }

  return date.toLocaleDateString()
}

export const NotificationsPage = () => {
  const dispatch = useDispatch()

  const {
    notifications = [],
    unreadCount = 0,
    loading = false,
    error = null,
  } = useSelector((state) => state.notifications || {})

  // ==========================================
  // FETCH NOTIFICATIONS WHEN PAGE OPENS
  // ==========================================
  useEffect(() => {
    const token = localStorage.getItem('token')

    if (!token) {
      console.warn('Notifications: No token found')
      return
    }

    dispatch(fetchNotifications())
  }, [dispatch])

  // ==========================================
  // REFRESH
  // ==========================================
  const handleRefresh = () => {
    const token = localStorage.getItem('token')

    if (!token) {
      return
    }

    dispatch(fetchNotifications())
  }

  // ==========================================
  // MARK AS READ
  // ==========================================
  const handleMarkAsRead = (id) => {
    if (!id) return

    dispatch(markAsRead(id))
  }

  // ==========================================
  // MARK ALL AS READ
  // ==========================================
  const handleMarkAllAsRead = () => {
    if (unreadCount === 0) return

    dispatch(markAllAsRead())
  }

  // ==========================================
  // DELETE
  // ==========================================
  const handleDelete = (id) => {
    if (!id) return

    dispatch(removeNotification(id))
  }

  return (
    <div className="space-y-6">

      {/* ======================================
          HEADER
      ====================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            Notifications
          </h1>

          <p className="text-gray-600 dark:text-gray-400">
            {loading
              ? 'Loading notifications...'
              : unreadCount > 0
                ? `${unreadCount} unread notification${
                    unreadCount > 1 ? 's' : ''
                  }`
                : 'All caught up'}
          </p>
        </div>

        <div className="flex items-center gap-2">

          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw
              className={`w-4 h-4 ${
                loading ? 'animate-spin' : ''
              }`}
            />

            Refresh
          </Button>

          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllAsRead}
              disabled={loading}
            >
              <CheckCheck className="w-4 h-4" />

              Mark all as read
            </Button>
          )}

        </div>
      </div>

      {/* ======================================
          ERROR
      ====================================== */}
      {error && (
        <Card className="p-4 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">

          <div className="flex items-center justify-between gap-4">

            <div>
              <p className="font-medium text-red-700 dark:text-red-400">
                Unable to load notifications
              </p>

              <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                {error}
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
            >
              Try again
            </Button>

          </div>
        </Card>
      )}

      {/* ======================================
          LOADING
      ====================================== */}
      {loading && notifications.length === 0 && (
        <Card className="py-16 text-center">

          <Loader className="w-10 h-10 animate-spin text-primary-600 mx-auto mb-4" />

          <p className="text-gray-600 dark:text-gray-400">
            Loading notifications...
          </p>

        </Card>
      )}

      {/* ======================================
          EMPTY
      ====================================== */}
      {!loading && notifications.length === 0 && !error && (
        <Card className="py-16 text-center">

          <BellOff className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />

          <p className="text-lg font-medium text-gray-500 dark:text-gray-400">
            No notifications yet
          </p>

          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            You'll see updates about your applications and interviews here
          </p>

          <Button
            variant="outline"
            size="sm"
            className="mt-5"
            onClick={handleRefresh}
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>

        </Card>
      )}

      {/* ======================================
          NOTIFICATION LIST
      ====================================== */}
      {notifications.length > 0 && (
        <div className="space-y-3">

          {notifications.map((notification) => {

            const id =
              notification.id ||
              notification._id

            const isRead =
              Boolean(
                notification.read ??
                notification.isRead
              )

            const type =
              notification.type || 'system'

            return (
              <div
                key={id}
                className={`flex items-start gap-4 p-4 rounded-xl border transition-colors ${
                  isRead
                    ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                    : 'bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800'
                }`}
              >

                {/* ICON */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    TYPE_STYLES[type] ||
                    TYPE_STYLES.system
                  }`}
                >
                  <Bell className="w-5 h-5" />
                </div>

                {/* CONTENT */}
                <div className="flex-1 min-w-0">

                  {notification.title && (
                    <p
                      className={`text-sm font-semibold mb-1 ${
                        isRead
                          ? 'text-gray-700 dark:text-gray-300'
                          : 'text-gray-900 dark:text-white'
                      }`}
                    >
                      {notification.title}
                    </p>
                  )}

                  <p
                    className={`text-sm ${
                      isRead
                        ? 'text-gray-500 dark:text-gray-400'
                        : 'text-gray-700 dark:text-gray-200'
                    }`}
                  >
                    {notification.message}
                  </p>

                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                    {formatDate(
                      notification.createdAt ||
                      notification.timestamp
                    )}
                  </p>

                </div>

                {/* ACTIONS */}
                <div className="flex items-center gap-1 flex-shrink-0">

                  {!isRead && (
                    <button
                      type="button"
                      onClick={() =>
                        handleMarkAsRead(id)
                      }
                      title="Mark as read"
                      className="p-2 text-primary-600 hover:bg-primary-100 dark:hover:bg-primary-900 rounded-lg transition"
                    >
                      <CheckCheck className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(id)
                    }
                    title="Delete"
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                </div>

              </div>
            )
          })}

        </div>
      )}

    </div>
  )
}

export default NotificationsPage