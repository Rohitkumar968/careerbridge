import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  candidates: [],
  selectedCandidate: null,
  loading: false,
  error: null,
}

const candidateSlice = createSlice({
  name: 'candidates',
  initialState,
  reducers: {
    setCandidates: (state, action) => {
      state.candidates = action.payload
    },
    setSelectedCandidate: (state, action) => {
      state.selectedCandidate = action.payload
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
  },
})

export const { setCandidates, setSelectedCandidate, setLoading, setError } = candidateSlice.actions
export default candidateSlice.reducer
