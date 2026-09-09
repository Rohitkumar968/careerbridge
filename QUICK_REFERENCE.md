# CareerBridge - Quick Reference Guide

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 📂 File Locations

### Components
- **Common Components**: `src/components/common/`
- **Layout Components**: `src/components/layout/`
- **Job Components**: `src/components/jobs/`
- **Application Components**: `src/components/applications/`

### Pages
- **Public Pages**: `src/pages/public/`
- **Auth Pages**: `src/pages/auth/`
- **Seeker Pages**: `src/pages/seeker/`
- **Recruiter Pages**: `src/pages/recruiter/`
- **Admin Pages**: `src/pages/admin/`

### State Management
- **Redux Store**: `src/store/index.js`
- **Redux Slices**: `src/store/slices/`

### API Services
- **API Configuration**: `src/services/api.js`
- **API Services**: `src/services/*Api.js`

### Routing
- **Main App**: `src/App.jsx`
- **Protected Route**: `src/routes/ProtectedRoute.jsx`
- **Layouts**: `src/layouts/`

---

## 🎨 Common Components Usage

### Button
```jsx
import { Button } from '../components/common'

<Button variant="primary" size="md" loading={false}>
  Click Me
</Button>
```

### Input
```jsx
import { Input } from '../components/common'

<Input
  label="Email"
  type="email"
  placeholder="you@example.com"
  value={value}
  onChange={(e) => setValue(e.target.value)}
  error={errors.email}
/>
```

### Card
```jsx
import { Card } from '../components/common'

<Card>
  <h3>Card Title</h3>
  <p>Card content</p>
</Card>
```

### Badge
```jsx
import { Badge } from '../components/common'

<Badge variant="primary">Active</Badge>
```

### Modal
```jsx
import { Modal } from '../components/common'

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Modal Title"
>
  Modal content
</Modal>
```

---

## 🔄 Redux Usage

### Dispatch Action
```jsx
import { useDispatch } from 'react-redux'
import { setJobs } from '../store/slices/jobSlice'

const dispatch = useDispatch()
dispatch(setJobs(jobsArray))
```

### Select State
```jsx
import { useSelector } from 'react-redux'

const { jobs, loading } = useSelector(state => state.jobs)
const { user } = useSelector(state => state.auth)
```

### Async Action Example
```jsx
const handleSearch = async (query) => {
  dispatch(setLoading(true))
  try {
    const response = await jobApi.searchJobs(query)
    dispatch(setJobs(response.data))
  } catch (error) {
    dispatch(setError(error.message))
  } finally {
    dispatch(setLoading(false))
  }
}
```

---

## 🌐 API Integration

### Using API Services
```jsx
import { jobApi } from '../services/jobApi'

// Get all jobs
const jobs = await jobApi.getJobs({ page: 1 })

// Get job by ID
const job = await jobApi.getJobById(1)

// Search jobs
const results = await jobApi.searchJobs('React')

// Save job
await jobApi.saveJob(jobId)
```

### Error Handling
```jsx
try {
  const response = await jobApi.getJobs()
  dispatch(setJobs(response.data))
} catch (error) {
  if (error.response?.status === 401) {
    // Handle unauthorized
  } else if (error.response?.status === 404) {
    // Handle not found
  } else {
    dispatch(setError(error.message))
  }
}
```

---

## 🛣️ Routing

### Public Route
```jsx
<Route path="/jobs" element={<JobsPage />} />
```

### Protected Route
```jsx
<Route
  element={
    <ProtectedRoute requiredRole="job_seeker">
      <DashboardLayout role="job_seeker" />
    </ProtectedRoute>
  }
>
  <Route path="/dashboard" element={<SeekerDashboard />} />
</Route>
```

### Navigate Programmatically
```jsx
import { useNavigate } from 'react-router-dom'

const navigate = useNavigate()
navigate('/jobs')
navigate(`/jobs/${jobId}`)
navigate(-1) // Go back
```

---

## 🎨 Styling

### Tailwind Classes
```jsx
// Colors
className="text-primary-600 bg-primary-100 dark:bg-primary-900"

// Spacing
className="p-4 m-2 gap-3"

// Responsive
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"

// Dark mode
className="dark:bg-gray-800 dark:text-white"

// Hover effects
className="hover:bg-gray-100 dark:hover:bg-gray-700"
```

### Custom CSS
```css
/* In index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom styles */
.custom-class {
  @apply p-4 rounded-lg shadow-md;
}
```

---

## 🌙 Dark Mode

### Toggle Theme
```jsx
import { useDispatch } from 'react-redux'
import { toggleTheme } from '../store/slices/themeSlice'

const dispatch = useDispatch()
dispatch(toggleTheme())
```

### Check Current Theme
```jsx
import { useSelector } from 'react-redux'

const { mode } = useSelector(state => state.theme)
// mode is 'light' or 'dark'
```

---

## 📱 Responsive Design

### Breakpoints
```jsx
// Mobile first approach
className="text-sm md:text-base lg:text-lg"

// Grid
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"

// Flex
className="flex flex-col md:flex-row"

// Display
className="hidden md:block"
```

---

## 🔐 Authentication

### Login
```jsx
import { useDispatch } from 'react-redux'
import { loginSuccess } from '../store/slices/authSlice'

const dispatch = useDispatch()
dispatch(loginSuccess({
  user: userData,
  token: jwtToken
}))
```

### Logout
```jsx
import { logout } from '../store/slices/authSlice'

dispatch(logout())
```

### Check Authentication
```jsx
const { isAuthenticated, user } = useSelector(state => state.auth)

if (!isAuthenticated) {
  // Show login page
}
```

---

## 📝 Form Handling

### Form State
```jsx
const [formData, setFormData] = useState({
  email: '',
  password: '',
})

const [errors, setErrors] = useState({})

const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value
  })
}
```

### Validation
```jsx
const validateForm = () => {
  const newErrors = {}
  if (!formData.email) newErrors.email = 'Email is required'
  if (!formData.password) newErrors.password = 'Password is required'
  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
}
```

### Submit
```jsx
const handleSubmit = async (e) => {
  e.preventDefault()
  if (!validateForm()) return

  try {
    const response = await authApi.login(formData)
    dispatch(loginSuccess(response.data))
    navigate('/dashboard')
  } catch (error) {
    setErrors({ submit: error.message })
  }
}
```

---

## 🔔 Notifications

### Add Notification
```jsx
import { useDispatch } from 'react-redux'
import { addNotification } from '../store/slices/notificationSlice'

const dispatch = useDispatch()
dispatch(addNotification({
  type: 'application',
  title: 'Application Received',
  message: 'Your application has been received'
}))
```

### Mark as Read
```jsx
dispatch(markAsRead(notificationId))
```

---

## 🎯 Common Patterns

### Loading State
```jsx
const { loading } = useSelector(state => state.jobs)

if (loading) return <LoadingSpinner />

return <JobsList jobs={jobs} />
```

### Error Handling
```jsx
const { error } = useSelector(state => state.jobs)

if (error) return <ErrorState message={error} />

return <JobsList jobs={jobs} />
```

### Empty State
```jsx
if (jobs.length === 0) {
  return <EmptyState
    title="No jobs found"
    description="Try adjusting your filters"
  />
}

return <JobsList jobs={jobs} />
```

### Pagination
```jsx
const [currentPage, setCurrentPage] = useState(1)
const itemsPerPage = 10
const totalPages = Math.ceil(items.length / itemsPerPage)

const paginatedItems = items.slice(
  (currentPage - 1) * itemsPerPage,
  currentPage * itemsPerPage
)

<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={setCurrentPage}
/>
```

---

## 🐛 Debugging

### Redux DevTools
```jsx
// Install Redux DevTools browser extension
// Automatically works with Redux Toolkit
```

### Console Logging
```jsx
console.log('State:', state)
console.log('Props:', props)
console.log('Error:', error)
```

### React DevTools
```jsx
// Install React DevTools browser extension
// Inspect component tree and props
```

---

## 📚 File Templates

### New Page Component
```jsx
import React from 'react'
import { Card, Button } from '../components/common'

export const NewPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Page Title</h1>
      <Card>
        <p>Page content</p>
      </Card>
    </div>
  )
}

export default NewPage
```

### New Redux Slice
```jsx
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  data: [],
  loading: false,
  error: null,
}

const newSlice = createSlice({
  name: 'newFeature',
  initialState,
  reducers: {
    setData: (state, action) => {
      state.data = action.payload
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
  },
})

export const { setData, setLoading, setError } = newSlice.actions
export default newSlice.reducer
```

### New API Service
```jsx
import api from './api'

export const newApi = {
  getAll: () => api.get('/endpoint'),
  getById: (id) => api.get(`/endpoint/${id}`),
  create: (data) => api.post('/endpoint', data),
  update: (id, data) => api.put(`/endpoint/${id}`, data),
  delete: (id) => api.delete(`/endpoint/${id}`),
}

export default newApi
```

---

## 🚀 Performance Tips

### Memoization
```jsx
import { useMemo } from 'react'

const memoizedValue = useMemo(() => {
  return expensiveCalculation(data)
}, [data])
```

### Lazy Loading
```jsx
import { lazy, Suspense } from 'react'

const LazyComponent = lazy(() => import('./Component'))

<Suspense fallback={<LoadingSpinner />}>
  <LazyComponent />
</Suspense>
```

### Code Splitting
```jsx
// React Router automatically code splits
<Route path="/jobs" element={<JobsPage />} />
```

---

## 📖 Documentation Links

- [React Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Redux Toolkit](https://redux-toolkit.js.org)
- [React Router](https://reactrouter.com)
- [Axios](https://axios-http.com)

---

## 🆘 Troubleshooting

### Port Already in Use
```bash
npm run dev -- --port 3000
```

### Clear Cache
```bash
rm -rf node_modules package-lock.json
npm install
```

### Build Issues
```bash
npm run build
# Check dist folder
npm run preview
```

---

## 📞 Quick Links

- **README.md** - Full documentation
- **SETUP.md** - Setup guide
- **FEATURES.md** - Feature list
- **PROJECT_SUMMARY.md** - Project overview

---

**Happy coding! 🚀**
