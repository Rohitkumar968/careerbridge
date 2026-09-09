import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  users: [],
  jobs: [],
  companies: [],
  applications: [],
  stats: null,
  loading: false,
  error: null,
}

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload
    },
    setJobs: (state, action) => {
      state.jobs = action.payload
    },
    setCompanies: (state, action) => {
      state.companies = action.payload
    },
    setApplications: (state, action) => {
      state.applications = action.payload
    },
    setStats: (state, action) => {
      state.stats = action.payload
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
  },
})

export const { setUsers, setJobs, setCompanies, setApplications, setStats, setLoading, setError } = adminSlice.actions
export default adminSlice.reducer
