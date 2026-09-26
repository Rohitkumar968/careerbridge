import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setTheme } from './store/slices/themeSlice'

// Layouts
import PublicLayout from './layouts/PublicLayout'
import DashboardLayout from './layouts/DashboardLayout'

// Public Pages
import {
  LandingPage,
  JobsPage,
  JobDetailsPage,
  CompaniesPage,
  CompanyDetailsPage,
  NotFoundPage,
} from './pages/public'

// Auth Pages
import {
  LoginPage,
  RegisterPage,
  ForgotPasswordPage,
  ResetPasswordPage,
} from './pages/auth'

// Seeker Pages
import {
  SeekerDashboard,
  ApplicationsPage,
  ApplicationDetailsPage,
  InterviewsPage,
  InterviewDetailsPage,
  ResumePage,
  AIAssistantPage,
  ProfilePage,
  NotificationsPage,
  RecommendationsPage,
  SavedJobsPage,
  SettingsPage,
} from './pages/seeker'

// Recruiter Pages
import {
  RecruiterDashboard,
  PostJobPage,
  ScheduleInterviewPage,
} from './pages/recruiter'

// Admin Pages
import { AdminDashboard } from './pages/admin'

// Protected Route
import ProtectedRoute from './routes/ProtectedRoute'

function App() {
  const dispatch = useDispatch()

  const { mode } = useSelector((state) => state.theme)

  useEffect(() => {
    dispatch(setTheme(mode))
  }, [mode, dispatch])

  return (
    <Router>
      <Routes>

        {/* =====================================================
            PUBLIC ROUTES
        ===================================================== */}

        <Route element={<PublicLayout />}>

          <Route
            path="/"
            element={<LandingPage />}
          />

          <Route
            path="/jobs"
            element={<JobsPage />}
          />

          <Route
            path="/jobs/:id"
            element={<JobDetailsPage />}
          />

          <Route
            path="/companies"
            element={<CompaniesPage />}
          />

          <Route
            path="/companies/:id"
            element={<CompanyDetailsPage />}
          />

        </Route>


        {/* =====================================================
            AUTH ROUTES
        ===================================================== */}

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/register"
          element={<RegisterPage />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPasswordPage />}
        />

        <Route
          path="/reset-password/:token"
          element={<ResetPasswordPage />}
        />


        {/* =====================================================
            JOB SEEKER ROUTES
        ===================================================== */}

        <Route
          element={
            <ProtectedRoute requiredRole="job_seeker">
              <DashboardLayout role="job_seeker" />
            </ProtectedRoute>
          }
        >

          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={<SeekerDashboard />}
          />

          {/* Jobs */}
          <Route
            path="/dashboard/jobs"
            element={<JobsPage />}
          />

          {/* Applications */}
          <Route
            path="/dashboard/applications"
            element={<ApplicationsPage />}
          />

          <Route
            path="/dashboard/applications/:id"
            element={<ApplicationDetailsPage />}
          />

          {/* Interviews */}
          <Route
            path="/dashboard/interviews"
            element={<InterviewsPage />}
          />

          <Route
            path="/dashboard/interviews/:id"
            element={<InterviewDetailsPage />}
          />

          {/* Resume */}
          <Route
            path="/dashboard/resume"
            element={<ResumePage />}
          />

          {/* AI Assistant */}
          <Route
            path="/dashboard/ai-assistant"
            element={<AIAssistantPage />}
          />

          {/* Recommended Jobs */}
          <Route
            path="/dashboard/recommended"
            element={<RecommendationsPage />}
          />

          {/* Saved Jobs */}
          <Route
            path="/dashboard/saved"
            element={<SavedJobsPage />}
          />

          {/* Profile */}
          <Route
            path="/profile"
            element={<ProfilePage />}
          />

          {/* Notifications */}
          <Route
            path="/notifications"
            element={<NotificationsPage />}
          />

          {/* Settings */}
          <Route
            path="/settings"
            element={<SettingsPage />}
          />

        </Route>


        {/* =====================================================
            RECRUITER ROUTES
        ===================================================== */}

        <Route
          element={
            <ProtectedRoute requiredRole="recruiter">
              <DashboardLayout role="recruiter" />
            </ProtectedRoute>
          }
        >

          {/* Recruiter Dashboard */}
          <Route
            path="/recruiter"
            element={<RecruiterDashboard />}
          />

          {/* Post New Job */}
          <Route
            path="/recruiter/jobs/create"
            element={<PostJobPage />}
          />

          {/* Schedule & Manage Interviews */}
          <Route
            path="/recruiter/interviews/schedule"
            element={<ScheduleInterviewPage />}
          />

        </Route>


        {/* =====================================================
            ADMIN ROUTES
        ===================================================== */}

        <Route
          element={
            <ProtectedRoute requiredRole="admin">
              <DashboardLayout role="admin" />
            </ProtectedRoute>
          }
        >

          <Route
            path="/admin"
            element={<AdminDashboard />}
          />

        </Route>


        {/* =====================================================
            404
        ===================================================== */}

        <Route
          path="*"
          element={<NotFoundPage />}
        />

      </Routes>
    </Router>
  )
}

export default App