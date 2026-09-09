import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API_URL = '/api/notifications'

const getAuthConfig = () => {
  const token = localStorage.getItem('token')

  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
  }
}

// ========================================
// FETCH NOTIFICATIONS
// ========================================
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token')

      if (!token) {
        return rejectWithValue('Please login first')
      }

      const response = await axios.get(
        API_URL,
        getAuthConfig()
      )

      const data = response.data?.data || []

      return {
        notifications: data,
        unreadCount:
          response.data?.unreadCount ??
          data.filter((n) => !n.isRead).length,
      }
    } catch (error) {
      console.error(
        'FETCH NOTIFICATIONS ERROR:',
        error.response?.data || error.message
      )

      return rejectWithValue(
        error.response?.data?.message ||
        'Failed to load notifications'
      )
    }
  }
)

// ========================================
// MARK ONE AS READ
// ========================================
export const markAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (id, { rejectWithValue }) => {
    try {
      if (!id) {
        return rejectWithValue('Notification ID missing')
      }

      const response = await axios.put(
        `${API_URL}/${id}/read`,
        {},
        getAuthConfig()
      )

      return response.data?.data
    } catch (error) {
      console.error(
        'MARK NOTIFICATION READ ERROR:',
        error.response?.data || error.message
      )

      return rejectWithValue(
        error.response?.data?.message ||
        'Failed to mark notification as read'
      )
    }
  }
)

// ========================================
// MARK ALL AS READ
// ========================================
export const markAllAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async (_, { rejectWithValue }) => {
    try {
      await axios.put(
        `${API_URL}/read-all`,
        {},
        getAuthConfig()
      )

      return true
    } catch (error) {
      console.error(
        'MARK ALL READ ERROR:',
        error.response?.data || error.message
      )

      return rejectWithValue(
        error.response?.data?.message ||
        'Failed to mark all notifications as read'
      )
    }
  }
)

// ========================================
// DELETE NOTIFICATION
// ========================================
export const removeNotification = createAsyncThunk(
  'notifications/removeNotification',
  async (id, { rejectWithValue }) => {
    try {
      if (!id) {
        return rejectWithValue('Notification ID missing')
      }

      await axios.delete(
        `${API_URL}/${id}`,
        getAuthConfig()
      )

      return id
    } catch (error) {
      console.error(
        'DELETE NOTIFICATION ERROR:',
        error.response?.data || error.message
      )

      return rejectWithValue(
        error.response?.data?.message ||
        'Failed to delete notification'
      )
    }
  }
)

// ========================================
// INITIAL STATE
// ========================================
const initialState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
}

// ========================================
// SLICE
// ========================================
const notificationSlice = createSlice({
  name: 'notifications',

  initialState,

  reducers: {
    clearNotifications: (state) => {
      state.notifications = []
      state.unreadCount = 0
      state.loading = false
      state.error = null
    },
  },

  extraReducers: (builder) => {
    builder

      // ==================================
      // FETCH
      // ==================================
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true
        state.error = null
      })

      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false
        state.error = null

        const rawNotifications =
          action.payload?.notifications || []

        state.notifications = rawNotifications.map((notification) => ({
          ...notification,

          // MongoDB ID
          id: notification._id,

          // Backend -> frontend
          read: Boolean(notification.isRead),
        }))

        state.unreadCount =
          action.payload?.unreadCount ??
          state.notifications.filter(
            (notification) => !notification.read
          ).length
      })

      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false
        state.error =
          action.payload || 'Failed to load notifications'
      })

      // ==================================
      // MARK ONE AS READ
      // ==================================
      .addCase(markAsRead.fulfilled, (state, action) => {
        const updatedNotification = action.payload

        if (!updatedNotification?._id) {
          return
        }

        const notification = state.notifications.find(
          (item) =>
            item.id === updatedNotification._id
        )

        if (notification && !notification.read) {
          notification.read = true
          notification.isRead = true

          state.unreadCount = Math.max(
            0,
            state.unreadCount - 1
          )
        }
      })

      // ==================================
      // MARK ALL
      // ==================================
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.notifications.forEach((notification) => {
          notification.read = true
          notification.isRead = true
        })

        state.unreadCount = 0
      })

      // ==================================
      // DELETE
      // ==================================
      .addCase(
        removeNotification.fulfilled,
        (state, action) => {
          const id = action.payload

          const notification =
            state.notifications.find(
              (item) => item.id === id
            )

          if (
            notification &&
            !notification.read
          ) {
            state.unreadCount = Math.max(
              0,
              state.unreadCount - 1
            )
          }

          state.notifications =
            state.notifications.filter(
              (item) => item.id !== id
            )
        }
      )
  },
})

export const {
  clearNotifications,
} = notificationSlice.actions

export default notificationSlice.reducer