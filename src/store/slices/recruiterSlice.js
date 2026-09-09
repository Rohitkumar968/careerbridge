import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  company: null,
  jobs: [],
  applicants: [],
  analytics: null,
  loading: false,
  error: null,
}

const recruiterSlice = createSlice({
  name: 'recruiter',
  initialState,
  reducers: {
    setCompany: (state, action) => {
      state.company = action.payload
    },
    setJobs: (state, action) => {
      state.jobs = action.payload
    },
    addJob: (state, action) => {
      state.jobs.push(action.payload)
    },
    updateJob: (state, action) => {
      const index = state.jobs.findIndex(j => j.id === action.payload.id)
      if (index !== -1) {
        state.jobs[index] = action.payload
      }
    },
    setApplicants: (state, action) => {
      state.applicants = action.payload
    },
    setAnalytics: (state, action) => {
      state.analytics = action.payload
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
  },
})

export const { setCompany, setJobs, addJob, updateJob, setApplicants, setAnalytics, setLoading, setError } = recruiterSlice.actions
export default recruiterSlice.reducer
