# CareerBridge - Feature Documentation

## 📋 Complete Feature List

### 🏠 Landing Page
**Location**: `/`

**Sections**:
1. **Hero Section**
   - Headline: "Find the Right Opportunity. Build Your Future."
   - Subheading with platform description
   - CTA buttons: "Find Jobs" and "Hire Talent"
   - Advanced search bar with job title, location, and search button

2. **Statistics Section**
   - 10,000+ Jobs
   - 5,000+ Companies
   - 25,000+ Candidates
   - 95% Match Accuracy

3. **Featured Jobs**
   - Display 3 featured jobs with full details
   - Job cards with company logo, title, location, salary, skills
   - "View All Jobs" button

4. **How It Works**
   - For Job Seekers: 4-step process
   - For Recruiters: 4-step process

5. **AI Features Section**
   - AI Resume Analyzer
   - Smart Job Matching
   - Interview Preparation
   - Candidate Ranking

6. **CTA Section**
   - "Ready to take the next step in your career?"
   - Buttons: "Find Your Dream Job" and "Start Hiring"

7. **Footer**
   - Company info and links
   - Social media icons

---

## 🔍 Job Search & Discovery

### Jobs Page
**Location**: `/jobs`

**Features**:
- Advanced filtering sidebar (desktop) / drawer (mobile)
- Filters: keyword, location, job type, experience level, salary range, remote
- Sort options: relevant, newest, salary high-to-low, salary low-to-high
- Job cards with match score
- Save/unsave jobs
- Responsive pagination
- "1,248 jobs found" counter

**Filters**:
- Keyword search
- Location
- Job Type (Full-time, Part-time, Contract)
- Experience Level (Entry, Mid, Senior)
- Salary Range slider
- Remote toggle

---

### Job Details Page
**Location**: `/jobs/:id`

**Sections**:
1. **Header**
   - Job title, company name, company logo
   - Location, salary, job type, experience
   - Posted date, applicant count

2. **Main Content**
   - Job description
   - Responsibilities (bullet points)
   - Requirements (bullet points)
   - Required skills (badges)
   - Benefits (bullet points)
   - About company section

3. **Sidebar**
   - Apply Now button
   - Save Job button
   - Share button
   - AI Match Score (95%)
   - Your Skills vs Required
   - Missing Skills
   - Similar Jobs

4. **Apply Modal**
   - Cover letter textarea
   - Submit button with loading state

---

## 🏢 Companies

### Companies Page
**Location**: `/companies`

**Features**:
- Search companies by name, industry, location
- Company cards with:
  - Logo
  - Name
  - Rating and reviews
  - Description
  - Location
  - Company size
  - "View Company" button

---

### Company Details Page
**Location**: `/companies/:id`

**Sections**:
1. **Header**
   - Company logo
   - Company name
   - Rating and reviews
   - Industry badge
   - Company size badge

2. **About Section**
   - Company description

3. **Open Positions**
   - List of jobs from this company
   - Job cards with full details

---

## 🔐 Authentication

### Login Page
**Location**: `/login`

**Features**:
- Email input
- Password input with show/hide toggle
- Remember me checkbox
- Forgot password link
- Sign in button
- Google login placeholder
- Sign up link

**Validation**:
- Email required
- Password required
- Error messages displayed

---

### Register Page
**Location**: `/register`

**Features**:
- Role selection (Job Seeker / Recruiter)
- Name input
- Email input
- Password input with strength indicator
- Confirm password input
- Terms & Conditions checkbox
- Create Account button
- Sign in link

**Password Strength**:
- Visual indicator (weak, fair, good, strong, very strong)
- Requirements: 8+ chars, uppercase, lowercase, numbers, special chars

---

## 👤 Job Seeker Dashboard

### Dashboard Home
**Location**: `/dashboard`

**Sections**:
1. **Welcome Section**
   - "Good morning, [Name]! 👋"
   - What's happening with your job search

2. **Stats Cards** (4 cards)
   - Applications count
   - Interviews count
   - Saved Jobs count
   - Profile Completion %

3. **Application Overview**
   - Visual breakdown: Applied, Screening, Interview, Selected, Rejected
   - Count for each status

4. **Recommended Jobs**
   - AI-powered recommendations
   - Job cards with match score
   - 4 featured jobs

5. **Upcoming Interviews**
   - Interview cards with:
     - Company name
     - Position
     - Date and time
     - Interview type
     - Join Interview button

---

### Applications Page
**Location**: `/dashboard/applications`

**Features**:
- Tabbed view: All, Applied, Screening, Interview, Selected, Rejected
- Application cards showing:
  - Job title
  - Company
  - Applied date
  - Status badge
  - Last updated
  - Next step
  - View Details button
- Pagination (6 items per page)
- Tab counts

---

### Interviews Page
**Location**: `/dashboard/interviews`

**Features**:
- Tabs: Upcoming, Past
- Interview cards with:
  - Company name
  - Position
  - Interviewer name
  - Date and time
  - Interview type (Technical, HR, etc.)
  - Meeting link
  - Status badge
- Buttons: Join Interview, Reschedule, View Details

---

### Resume Page
**Location**: `/dashboard/resume`

**Features**:
1. **Current Resume Display**
   - File name
   - Upload date
   - Status badge (Analyzed/Analyzing)
   - Buttons: Download, View, Replace, Delete

2. **ATS Score**
   - Score out of 100
   - Progress bar
   - Feedback message

3. **Skills Detected**
   - List of detected skills as badges

4. **Strengths**
   - List of resume strengths with checkmarks

5. **Recommendations**
   - AI-generated improvement suggestions

6. **Upload Area**
   - Drag-and-drop file upload
   - Supported formats: PDF, DOCX

---

### AI Career Assistant
**Location**: `/dashboard/ai-assistant`

**Features**:
- Chat interface with message history
- User messages (right-aligned, blue)
- AI messages (left-aligned, gray)
- Typing indicator
- Suggested prompts:
  - "How can I improve my resume?"
  - "What skills should I learn for a MERN developer job?"
  - "Find jobs matching my skills"
  - "Prepare me for a React interview"
- Input field with send button
- Responsive chat area

---

## 💼 Recruiter Dashboard

### Recruiter Dashboard Home
**Location**: `/recruiter`

**Sections**:
1. **Stats Cards** (4 cards)
   - Active Jobs
   - Total Applicants
   - Shortlisted
   - Interviews

2. **Charts**
   - Applications over time (line chart)
   - Hiring performance (bar chart)

3. **Quick Actions**
   - Post New Job button
   - View Applicants button
   - Schedule Interview button

4. **Recent Applicants**
   - List of recent applicants
   - Name, experience level
   - View Profile button

---

### Post Job Page
**Location**: `/recruiter/jobs/create`

**Form Sections**:
1. **Basic Information**
   - Job Title
   - Department
   - Employment Type (Full-time, Part-time, Contract, Internship)
   - Work Mode (On-site, Remote, Hybrid)
   - Location

2. **Salary & Experience**
   - Minimum Salary
   - Maximum Salary
   - Required Experience

3. **Job Details**
   - Job Description (textarea)
   - Responsibilities (textarea)
   - Requirements (textarea)
   - Required Skills (comma-separated)
   - Benefits (textarea)
   - Application Deadline (date picker)

**Buttons**:
- Save Draft
- Publish Job

**Validation**:
- Required fields marked
- Error messages displayed
- Loading state on submit

---

## 👨‍💼 Admin Dashboard

### Admin Dashboard Home
**Location**: `/admin`

**Sections**:
1. **Stats Cards** (4 cards)
   - Total Users
   - Active Jobs
   - Companies
   - Applications

2. **Charts**
   - Growth Trend (line chart with users and jobs)
   - User Distribution (pie chart)

3. **Quick Actions**
   - Manage Users
   - Review Jobs
   - View Reports
   - Settings

---

## 🎨 UI Components

### Button Component
**Variants**: primary, secondary, outline, danger
**Sizes**: sm, md, lg
**States**: normal, loading, disabled
**Features**: Icon support, loading spinner

### Input Component
**Features**:
- Label
- Placeholder
- Error message
- Icon support
- Validation state

### Select Component
**Features**:
- Label
- Options array
- Error message
- Validation state

### Card Component
**Features**:
- Rounded corners
- Shadow
- Hover effect
- Dark mode support

### Badge Component
**Variants**: primary, success, warning, danger, gray
**Features**: Inline display, color-coded

### Modal Component
**Features**:
- Title
- Close button
- Customizable size
- Overlay
- Smooth animations

### Toast Component
**Types**: success, error, info
**Features**:
- Auto-dismiss
- Close button
- Icon
- Customizable duration

### Pagination Component
**Features**:
- Previous/Next buttons
- Page numbers
- Current page highlight
- Disabled states

### ProgressBar Component
**Features**:
- Percentage display
- Label
- Smooth animation
- Color-coded

### FileUpload Component
**Features**:
- Drag-and-drop
- File preview
- Clear button
- Supported formats display

---

## 🌙 Dark Mode

**Features**:
- Toggle button in navbar
- Persistent preference (localStorage)
- Smooth transitions
- All components support dark mode
- Tailwind dark classes used throughout

**Implementation**:
- Redux themeSlice manages mode
- localStorage persists preference
- HTML element gets 'dark' class
- All colors have dark variants

---

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Mobile Features
- Collapsible sidebar
- Drawer filters
- Stacked cards
- Touch-friendly buttons
- Bottom navigation where appropriate
- No horizontal overflow

### Tablet Features
- Responsive grids
- Collapsible sidebar
- Optimized spacing

### Desktop Features
- Full sidebar
- Multi-column layouts
- Hover effects
- Optimized spacing

---

## 🔔 Notifications

**Types**:
- Application updates
- Interview scheduled
- New job recommendations
- Recruiter messages
- Resume analysis completed

**Features**:
- Unread count badge
- Mark as read
- Mark all as read
- Delete notification
- Notification center

---

## 🔐 Protected Routes

**Job Seeker Routes**:
- Require authentication
- Require role: 'job_seeker'
- Redirect to login if not authenticated
- Redirect to home if wrong role

**Recruiter Routes**:
- Require authentication
- Require role: 'recruiter'
- Redirect to login if not authenticated
- Redirect to home if wrong role

**Admin Routes**:
- Require authentication
- Require role: 'admin'
- Redirect to login if not authenticated
- Redirect to home if wrong role

---

## 🎯 State Management

### Redux Store Structure
```
auth: {
  user, token, isAuthenticated, loading, error
}
theme: {
  mode (light/dark)
}
jobs: {
  jobs, selectedJob, loading, error, filters, sort
}
applications: {
  applications, loading, error, stats
}
notifications: {
  notifications, unreadCount
}
interviews: {
  interviews, loading, error
}
resume: {
  resume, analysis, loading, error
}
recruiter: {
  company, jobs, applicants, analytics, loading, error
}
candidates: {
  candidates, selectedCandidate, loading, error
}
admin: {
  users, jobs, companies, applications, stats, loading, error
}
ai: {
  chatMessages, resumeAnalysis, jobMatches, loading, error
}
```

---

## 🔌 API Integration

### Base URL
```
VITE_API_URL=http://localhost:5000/api
```

### Axios Configuration
- Automatic JWT token attachment
- 401 redirect to login
- Error handling
- Request/response interceptors

### API Services
- authApi
- jobApi
- applicationApi
- resumeApi
- interviewApi
- recruiterApi
- aiApi
- adminApi

---

## ✨ Special Features

### AI Resume Analyzer
- Upload resume (PDF/DOCX)
- Get ATS score (0-100)
- Detect skills
- Identify strengths
- Get improvement recommendations
- See job matches

### AI Job Matching
- Match percentage (0-100%)
- Skill matching
- Experience matching
- Education matching
- Strengths and missing requirements

### AI Career Assistant
- Chat interface
- Suggested prompts
- Message history
- Typing indicator
- Real-time responses

---

## 🎨 Design System

### Colors
- **Primary**: Blue/Indigo (#0ea5e9)
- **Success**: Green (#10b981)
- **Warning**: Yellow (#f59e0b)
- **Danger**: Red (#ef4444)
- **Gray**: Neutral grays

### Typography
- **Headings**: Bold, larger sizes
- **Body**: Regular weight, readable size
- **Labels**: Medium weight, smaller size

### Spacing
- Consistent padding/margin
- 4px base unit
- Responsive spacing

### Shadows
- Subtle shadows for depth
- Hover shadow enhancement
- Dark mode shadow adjustment

### Animations
- Smooth transitions (200ms)
- Fade-in animations
- Slide-up animations
- Loading spinners

---

## 📊 Mock Data

### Jobs (6 samples)
- Senior React Developer
- Full Stack MERN Developer
- UI/UX Designer
- DevOps Engineer
- Product Manager
- Backend Developer (Python)

### Companies (3 samples)
- TechCorp
- StartupXYZ
- DesignStudio

### Applications (3 samples)
- Various statuses (applied, screening, interview)

### Interviews (2 samples)
- Upcoming interviews with details

### Notifications (3 samples)
- Application, interview, job recommendation

### Candidates (2 samples)
- Sample candidate profiles

### Users (2 samples)
- Job seeker and recruiter

---

## 🚀 Performance Features

- Code splitting with React Router
- Lazy loading components
- Optimized re-renders with Redux
- Efficient CSS with Tailwind
- Smooth animations with CSS transitions
- Responsive images
- Optimized bundle size

---

## ♿ Accessibility

- Semantic HTML
- ARIA labels where needed
- Keyboard navigation support
- Color contrast compliance
- Focus indicators
- Error messages linked to inputs
- Form labels properly associated

---

## 🔒 Security Features

- Protected routes with role-based access
- JWT token management
- Secure password handling
- Input validation
- Error handling without exposing sensitive info
- CORS configuration ready
- Environment variables for sensitive data

---

This documentation covers all features implemented in CareerBridge. For implementation details, refer to the code comments and README.md.
