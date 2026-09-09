const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const rateLimit = require('express-rate-limit')
const mongoSanitize = require('express-mongo-sanitize')
const path = require('path')

const { errorHandler, notFound } = require('./middleware/errorMiddleware')

// Route imports
const authRoutes = require('./routes/authRoutes')
const jobRoutes = require('./routes/jobRoutes')
const companyRoutes = require('./routes/companyRoutes')
const applicationRoutes = require('./routes/applicationRoutes')
const interviewRoutes = require('./routes/interviewRoutes')
const resumeRoutes = require('./routes/resumeRoutes')
const recruiterRoutes = require('./routes/recruiterRoutes')
const aiRoutes = require('./routes/aiRoutes')
const notificationRoutes = require('./routes/notificationRoutes')
const dashboardRoutes = require('./routes/dashboardRoutes')
const adminRoutes = require('./routes/adminRoutes')

const app = express()

// Trust proxy (required for Render / reverse proxies)
app.set('trust proxy', 1)

// Security headers
app.use(helmet())

// CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL,
].filter(Boolean)

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, Postman)
      if (!origin) return callback(null, true)
      if (allowedOrigins.includes(origin)) return callback(null, true)
      callback(new Error(`CORS policy: origin ${origin} not allowed`))
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
})
app.use('/api', limiter)

// Stricter limiter for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many auth attempts, please try again later.' },
})
app.use('/api/auth/login', authLimiter)
app.use('/api/auth/register', authLimiter)

// Body parsing
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(cookieParser())

// MongoDB injection sanitization
app.use(mongoSanitize())

// HTTP request logging (dev only)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'CareerBridge API is running', env: process.env.NODE_ENV })
})

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/jobs', jobRoutes)
app.use('/api/companies', companyRoutes)
app.use('/api/applications', applicationRoutes)
app.use('/api/interviews', interviewRoutes)
app.use('/api/resume', resumeRoutes)
app.use('/api/recruiter', recruiterRoutes)
app.use('/api/ai', aiRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/admin', adminRoutes)

// 404 handler
app.use(notFound)

// Global error handler
app.use(errorHandler)

module.exports = app
