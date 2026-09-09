import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import themeReducer from './slices/themeSlice'
import jobReducer from './slices/jobSlice'
import applicationReducer from './slices/applicationSlice'
import notificationReducer from './slices/notificationSlice'
import interviewReducer from './slices/interviewSlice'
import resumeReducer from './slices/resumeSlice'
import recruiterReducer from './slices/recruiterSlice'
import candidateReducer from './slices/candidateSlice'
import adminReducer from './slices/adminSlice'
import aiReducer from './slices/aiSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    jobs: jobReducer,
    applications: applicationReducer,
    notifications: notificationReducer,
    interviews: interviewReducer,
    resume: resumeReducer,
    recruiter: recruiterReducer,
    candidates: candidateReducer,
    admin: adminReducer,
    ai: aiReducer,
  },
})

export default store
