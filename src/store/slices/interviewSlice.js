import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  interviews: [],
  loading: false,
  error: null,
}

const interviewSlice = createSlice({
  name: 'interviews',
  initialState,
  reducers: {
    setInterviews: (state, action) => {
      state.interviews = action.payload
    },
    addInterview: (state, action) => {
      state.interviews.push(action.payload)
    },
    updateInterview: (state, action) => {
      const index = state.interviews.findIndex(i => i.id === action.payload.id)
      if (index !== -1) {
        state.interviews[index] = action.payload
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
  },
})

export const { setInterviews, addInterview, updateInterview, setLoading, setError } = interviewSlice.actions
export default interviewSlice.reducer
