import { createSlice } from '@reduxjs/toolkit'

const savedToken = localStorage.getItem('token')
const savedUser = localStorage.getItem('user')

let parsedUser = null

try {
  parsedUser = savedUser ? JSON.parse(savedUser) : null
} catch {
  parsedUser = null
  localStorage.removeItem('user')
}

const initialState = {
  user: parsedUser,
  token: savedToken || null,
  isAuthenticated: !!savedToken,
  loading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',

  initialState,

  reducers: {
    loginStart: (state) => {
      state.loading = true
      state.error = null
    },

    loginSuccess: (state, action) => {
      state.loading = false
      state.error = null

      const user = action.payload?.user || null
      const token = action.payload?.token || null

      state.user = user
      state.token = token
      state.isAuthenticated = !!token

      if (token) {
        localStorage.setItem('token', token)
      }

      if (user) {
        localStorage.setItem('user', JSON.stringify(user))
      }
    },

    loginFailure: (state, action) => {
      state.loading = false
      state.error = action.payload || 'Login failed'
      state.user = null
      state.token = null
      state.isAuthenticated = false

      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },

    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.loading = false
      state.error = null

      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },

    setUser: (state, action) => {
      state.user = action.payload || null

      if (action.payload) {
        localStorage.setItem(
          'user',
          JSON.stringify(action.payload)
        )
      } else {
        localStorage.removeItem('user')
      }
    },

    clearAuth: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.loading = false
      state.error = null

      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
  },
})

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  setUser,
  clearAuth,
} = authSlice.actions

export default authSlice.reducer