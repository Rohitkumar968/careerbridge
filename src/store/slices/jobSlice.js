import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  jobs: [],
  selectedJob: null,
  loading: false,
  error: null,
  filters: {
    keyword: '',
    location: '',
    jobType: '',
    experienceLevel: '',
    salaryRange: [0, 200000],
    remote: false,
  },
  sort: 'relevant',
}

const jobSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    setJobs: (state, action) => {
      state.jobs = action.payload
    },
    setSelectedJob: (state, action) => {
      state.selectedJob = action.payload
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    setSort: (state, action) => {
      state.sort = action.payload
    },
    resetFilters: (state) => {
      state.filters = initialState.filters
    },
  },
})

export const { setJobs, setSelectedJob, setLoading, setError, setFilters, setSort, resetFilters } = jobSlice.actions
export default jobSlice.reducer
