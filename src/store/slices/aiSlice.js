import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  chatMessages: [],
  resumeAnalysis: null,
  jobMatches: [],
  loading: false,
  error: null,
}

const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    addChatMessage: (state, action) => {
      state.chatMessages.push(action.payload)
    },
    setChatMessages: (state, action) => {
      state.chatMessages = action.payload
    },
    setResumeAnalysis: (state, action) => {
      state.resumeAnalysis = action.payload
    },
    setJobMatches: (state, action) => {
      state.jobMatches = action.payload
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    clearChat: (state) => {
      state.chatMessages = []
    },
  },
})

export const { addChatMessage, setChatMessages, setResumeAnalysis, setJobMatches, setLoading, setError, clearChat } = aiSlice.actions
export default aiSlice.reducer
