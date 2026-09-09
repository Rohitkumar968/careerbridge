# CareerBridge - AI-Powered Job & Recruitment Platform

A modern, production-quality MERN frontend application for connecting job seekers, recruiters, and administrators. Built with React, Vite, Tailwind CSS, Redux Toolkit, and modern best practices.

## 🚀 Features

### For Job Seekers
- **Smart Job Search** - Advanced filtering and sorting
- **AI-Powered Matching** - Get job recommendations based on your profile
- **Application Tracking** - Track all your applications in one place
- **Interview Management** - Schedule and manage interviews
- **Resume Analysis** - AI-powered resume analyzer with ATS scoring
- **AI Career Assistant** - ChatGPT-style career guidance
- **Saved Jobs** - Bookmark jobs for later

### For Recruiters
- **Job Management** - Post and manage job listings
- **Applicant Tracking** - Track candidates through the hiring pipeline
- **AI Candidate Ranking** - Automatically rank candidates
- **Interview Scheduling** - Manage interview schedules
- **Analytics Dashboard** - Track hiring metrics and performance
- **Company Profile** - Manage company information

### For Admins
- **User Management** - Manage all users and roles
- **Job Moderation** - Approve/reject job postings
- **System Analytics** - View platform-wide statistics
- **Reports** - Generate and view reports

### General Features
- **Dark Mode** - Full dark mode support with persistence
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Professional UI** - Modern, clean design with smooth animations
- **Accessibility** - Keyboard-friendly and accessible components
- **State Management** - Redux Toolkit for global state
- **API Integration** - Axios with interceptors for API calls

## 📁 Project Structure

```
src/
├── assets/              # Images, icons, etc.
├── components/
│   ├── common/         # Reusable components (Button, Input, Card, etc.)
│   ├── layout/         # Layout components (Navbar, Sidebar, Footer)
│   ├── jobs/           # Job-related components
│   ├── applications/   # Application components
│   ├── recruiter/      # Recruiter-specific components
│   ├── candidate/      # Candidate components
│   ├── ai/             # AI feature components
│   └── admin/          # Admin components
├── pages/
│   ├── public/         # Public pages (Landing, Jobs, Companies, etc.)
│   ├── auth/           # Authentication pages (Login, Register)
│   ├── seeker/         # Job seeker dashboard pages
│   ├── recruiter/      # Recruiter dashboard pages
│   └── admin/          # Admin dashboard pages
├── layouts/            # Page layouts
├── routes/             # Route protection and configuration
├── store/
│   └── slices/         # Redux slices for state management
├── services/           # API services
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── data/               # Mock data
├── App.jsx             # Main app component
├── main.jsx            # Entry point
└── index.css           # Global styles
```

## 🛠️ Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Charts**: Recharts
- **Date Handling**: date-fns

## 📦 Installation

### Prerequisites
- Node.js 16+ and npm/yarn

### Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd careerbridge
```

2. **Install dependencies**
```bash
npm install
```

3. **Create environment file**
```bash
cp .env.example .env
```

4. **Update .env with your API URL**
```
VITE_API_URL=http://localhost:5000/api
```

5. **Start development server**
```bash
npm run dev
```

The application will open at `http://localhost:5173`

## 🚀 Building for Production

```bash
npm run build
npm run preview
```

## 📝 Available Routes

### Public Routes
- `/` - Landing page
- `/jobs` - Job search page
- `/jobs/:id` - Job details
- `/companies` - Companies listing
- `/companies/:id` - Company details
- `/login` - Login page
- `/register` - Registration page

### Job Seeker Routes (Protected)
- `/dashboard` - Dashboard home
- `/dashboard/jobs` - Find jobs
- `/dashboard/applications` - My applications
- `/dashboard/interviews` - My interviews
- `/dashboard/resume` - Resume management
- `/dashboard/ai-assistant` - AI career assistant

### Recruiter Routes (Protected)
- `/recruiter` - Dashboard
- `/recruiter/jobs/create` - Post new job

### Admin Routes (Protected)
- `/admin` - Admin dashboard

## 🔐 Authentication

The app uses mock authentication for demonstration. In production:

1. Replace mock login/register with real API calls
2. Store JWT tokens securely
3. Implement proper session management
4. Add OAuth integration (Google, GitHub, etc.)

### Mock Credentials
- Email: any@example.com
- Password: any password (8+ characters)

## 🎨 Customization

### Colors
Edit `tailwind.config.js` to customize the primary color scheme:

```javascript
colors: {
  primary: {
    // Customize primary color palette
  }
}
```

### Dark Mode
Dark mode is automatically applied based on user preference stored in localStorage. Toggle with the theme button in the navbar.

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

All components are fully responsive and tested across all breakpoints.

## 🔄 State Management

Redux Toolkit slices are organized by feature:

- `authSlice` - Authentication state
- `jobSlice` - Jobs and filtering
- `applicationSlice` - Job applications
- `interviewSlice` - Interview management
- `resumeSlice` - Resume data
- `recruiterSlice` - Recruiter-specific data
- `candidateSlice` - Candidate information
- `adminSlice` - Admin data
- `aiSlice` - AI features
- `notificationSlice` - Notifications
- `themeSlice` - Theme preferences

## 🔌 API Integration

API services are organized in `src/services/`:

- `authApi` - Authentication endpoints
- `jobApi` - Job-related endpoints
- `applicationApi` - Application endpoints
- `resumeApi` - Resume endpoints
- `interviewApi` - Interview endpoints
- `recruiterApi` - Recruiter endpoints
- `aiApi` - AI feature endpoints
- `adminApi` - Admin endpoints

### Adding API Calls

1. Create/update service in `src/services/`
2. Dispatch Redux actions in components
3. Handle loading/error states

Example:
```javascript
import { jobApi } from '../services/jobApi'

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

## 🧩 Reusable Components

### Common Components
- `Button` - Customizable button with variants
- `Input` - Text input with validation
- `Select` - Dropdown select
- `Card` - Container component
- `Badge` - Status badges
- `Avatar` - User avatars
- `Modal` - Dialog component
- `Toast` - Notifications
- `LoadingSpinner` - Loading indicator
- `ProgressBar` - Progress indicator
- `Pagination` - Page navigation
- `FileUpload` - File upload component
- `EmptyState` - Empty state UI
- `ConfirmDialog` - Confirmation dialog

### Feature Components
- `JobCard` - Job listing card
- `CompanyCard` - Company card
- `ApplicationCard` - Application card

## 🎯 Best Practices Implemented

✅ Component composition and reusability
✅ Proper error handling and validation
✅ Loading states for async operations
✅ Responsive design patterns
✅ Accessibility (WCAG 2.1)
✅ Dark mode support
✅ Clean code structure
✅ Redux best practices
✅ API service abstraction
✅ Environment configuration
✅ Mock data for development
✅ Smooth animations and transitions

## 🚀 Performance Optimizations

- Code splitting with React Router
- Lazy loading of components
- Optimized re-renders with Redux
- Efficient CSS with Tailwind
- Image optimization
- Smooth animations with CSS transitions

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Redux Toolkit](https://redux-toolkit.js.org)
- [React Router](https://reactrouter.com)
- [Axios](https://axios-http.com)

## 🤝 Contributing

This is a demonstration project. For production use:

1. Connect to a real backend API
2. Implement proper authentication
3. Add comprehensive error handling
4. Implement proper logging
5. Add unit and integration tests
6. Set up CI/CD pipeline

## 📄 License

This project is provided as-is for educational and demonstration purposes.

## 🎓 Learning Resources

This project demonstrates:
- Modern React patterns and hooks
- Redux state management
- Responsive design with Tailwind CSS
- Component composition
- API integration with Axios
- Routing with React Router
- Dark mode implementation
- Form validation and handling
- Accessibility best practices

## 🐛 Known Limitations

- Uses mock data and authentication
- No real backend integration
- No persistent data storage
- No real-time features
- No email notifications

## 🔮 Future Enhancements

- Real backend API integration
- WebSocket for real-time updates
- Video interview integration
- Advanced analytics
- Machine learning recommendations
- Mobile app (React Native)
- Email notifications
- Payment integration

---

**Built with ❤️ for modern recruitment**
