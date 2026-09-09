import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  applications: [],
  loading: false,
  error: null,
  stats: {
    applied: 0,
    screening: 0,
    interview: 0,
    selected: 0,
    rejected: 0,
  },
}

const applicationSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {
    setApplications: (state, action) => {
      state.applications = action.payload
    },
    addApplication: (state, action) => {
      state.applications.push(action.payload)
    },
    updateApplication: (state, action) => {
      const index = state.applications.findIndex(app => app.id === action.payload.id)
      if (index !== -1) {
        state.applications[index] = action.payload
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    setStats: (state, action) => {
      state.stats = action.payload
    },
  },
})

export const { setApplications, addApplication, updateApplication, setLoading, setError, setStats } = applicationSlice.actions
export default applicationSlice.reducer
