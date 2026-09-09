import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  resume: null,
  analysis: null,
  loading: false,
  error: null,
}

const resumeSlice = createSlice({
  name: 'resume',
  initialState,
  reducers: {
    setResume: (state, action) => {
      state.resume = action.payload
    },
    setAnalysis: (state, action) => {
      state.analysis = action.payload
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    clearResume: (state) => {
      state.resume = null
      state.analysis = null
    },
  },
})

export const { setResume, setAnalysis, setLoading, setError, clearResume } = resumeSlice.actions
export default resumeSlice.reducer
