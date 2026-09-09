# CareerBridge — Backend API

Production-ready REST API for the CareerBridge AI-Powered Job & Recruitment Platform.
Built with Node.js, Express.js, MongoDB, and Mongoose.

---

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Auth**: JWT + bcryptjs
- **Security**: Helmet, CORS, express-rate-limit, express-mongo-sanitize
- **File Upload**: Multer
- **Logging**: Morgan

---

## Folder Structure

```
Backend/
├── src/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── jobController.js
│   │   ├── companyController.js
│   │   ├── applicationController.js
│   │   ├── interviewController.js
│   │   ├── resumeController.js
│   │   ├── recruiterController.js
│   │   ├── aiController.js
│   │   ├── notificationController.js
│   │   ├── dashboardController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   ├── authMiddleware.js      # JWT protect + role authorize
│   │   ├── errorMiddleware.js     # Global error handler
│   │   └── uploadMiddleware.js    # Multer file upload
│   ├── models/
│   │   ├── User.js
│   │   ├── Job.js
│   │   ├── Company.js
│   │   ├── Application.js
│   │   ├── Interview.js
│   │   ├── Resume.js
│   │   └── Notification.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── jobRoutes.js
│   │   ├── companyRoutes.js
│   │   ├── applicationRoutes.js
│   │   ├── interviewRoutes.js
│   │   ├── resumeRoutes.js
│   │   ├── recruiterRoutes.js
│   │   ├── aiRoutes.js
│   │   ├── notificationRoutes.js
│   │   ├── dashboardRoutes.js
│   │   └── adminRoutes.js
│   ├── services/
│   │   └── aiService.js           # AI integration (OpenAI-compatible)
│   ├── utils/
│   │   ├── generateToken.js
│   │   ├── createNotification.js
│   │   └── seed.js
│   ├── app.js                     # Express app setup
│   └── server.js                  # Entry point
├── uploads/                       # Resume file uploads (git-ignored)
├── .env.example
├── .gitignore
└── package.json
```

---

## Installation

```bash
cd Backend
npm install
```

---

## Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

| Variable        | Description                              | Default                        |
|-----------------|------------------------------------------|--------------------------------|
| `PORT`          | Server port                              | `5000`                         |
| `NODE_ENV`      | Environment                              | `development`                  |
| `MONGO_URI`     | MongoDB connection string                | `mongodb://localhost:27017/careerbridge` |
| `JWT_SECRET`    | Secret key for JWT signing               | *(required)*                   |
| `JWT_EXPIRES_IN`| JWT expiry duration                      | `7d`                           |
| `CLIENT_URL`    | Frontend URL for CORS                    | `http://localhost:5173`        |
| `AI_API_KEY`    | OpenAI API key (optional)                | *(leave blank for fallback)*   |

---

## Running Locally

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server starts at: `http://localhost:5000`
Health check: `GET http://localhost:5000/api/health`

---

## Seed Database

Creates demo admin, recruiter, seeker, companies, and jobs:

```bash
npm run seed
```

**Demo credentials after seeding:**

| Role      | Email                          | Password        |
|-----------|--------------------------------|-----------------|
| Admin     | admin@careerbridge.dev         | Admin@1234      |
| Recruiter | recruiter@careerbridge.dev     | Recruiter@1234  |
| Seeker    | seeker@careerbridge.dev        | Seeker@1234     |

---

## API Overview

All responses follow this format:

```json
{ "success": true, "data": {} }
{ "success": false, "message": "Error description" }
```

### Authentication — `/api/auth`

| Method | Endpoint                  | Auth | Description          |
|--------|---------------------------|------|----------------------|
| POST   | `/register`               | No   | Register new user    |
| POST   | `/login`                  | No   | Login                |
| POST   | `/logout`                 | Yes  | Logout               |
| GET    | `/me`                     | Yes  | Get current user     |
| PUT    | `/profile`                | Yes  | Update profile       |
| PUT    | `/change-password`        | Yes  | Change password      |

### Jobs — `/api/jobs`

| Method | Endpoint              | Auth         | Description              |
|--------|-----------------------|--------------|--------------------------|
| GET    | `/`                   | No           | List/search/filter jobs  |
| GET    | `/:id`                | No           | Get job details          |
| POST   | `/`                   | Recruiter    | Create job               |
| PUT    | `/:id`                | Recruiter    | Update job               |
| DELETE | `/:id`                | Recruiter    | Delete job               |
| GET    | `/saved`              | Seeker       | Get saved jobs           |
| GET    | `/recommended`        | Yes          | AI-recommended jobs      |
| POST   | `/:id/save`           | Seeker       | Save a job               |
| DELETE | `/:id/save`           | Seeker       | Unsave a job             |

### Companies — `/api/companies`

| Method | Endpoint  | Auth      | Description       |
|--------|-----------|-----------|-------------------|
| GET    | `/`       | No        | List companies    |
| GET    | `/:id`    | No        | Company details   |
| POST   | `/`       | Recruiter | Create company    |
| PUT    | `/:id`    | Recruiter | Update company    |
| DELETE | `/:id`    | Recruiter | Delete company    |

### Applications — `/api/applications`

| Method | Endpoint              | Auth      | Description              |
|--------|-----------------------|-----------|--------------------------|
| GET    | `/`                   | Yes       | List applications        |
| GET    | `/stats`              | Yes       | Application stats        |
| GET    | `/:id`                | Yes       | Get application          |
| POST   | `/apply/:jobId`       | Seeker    | Apply for job            |
| PUT    | `/:id/status`         | Recruiter | Update status            |
| POST   | `/:id/withdraw`       | Seeker    | Withdraw application     |
| DELETE | `/:id`                | Yes       | Delete application       |

### Interviews — `/api/interviews`

| Method | Endpoint              | Auth      | Description              |
|--------|-----------------------|-----------|--------------------------|
| GET    | `/`                   | Yes       | List interviews          |
| GET    | `/:id`                | Yes       | Get interview            |
| POST   | `/`                   | Recruiter | Schedule interview       |
| PUT    | `/:id`                | Recruiter | Update interview         |
| POST   | `/:id/cancel`         | Recruiter | Cancel interview         |
| POST   | `/:id/reschedule`     | Recruiter | Reschedule interview     |
| DELETE | `/:id`                | Recruiter | Delete interview         |

### Resume — `/api/resume`

| Method | Endpoint      | Auth | Description          |
|--------|---------------|------|----------------------|
| POST   | `/upload`     | Yes  | Upload resume file   |
| GET    | `/`           | Yes  | Get resume           |
| DELETE | `/`           | Yes  | Delete resume        |
| POST   | `/analyze`    | Yes  | Analyze resume (AI)  |
| GET    | `/analysis`   | Yes  | Get analysis result  |

### Recruiter — `/api/recruiter`

| Method | Endpoint                      | Auth      | Description           |
|--------|-------------------------------|-----------|-----------------------|
| GET    | `/company`                    | Recruiter | Get own company       |
| PUT    | `/company`                    | Recruiter | Update own company    |
| GET    | `/applicants`                 | Recruiter | List applicants       |
| GET    | `/applicants/:id`             | Recruiter | Get applicant         |
| PUT    | `/applicants/:id/status`      | Recruiter | Update status         |
| POST   | `/applicants/:id/shortlist`   | Recruiter | Shortlist candidate   |
| POST   | `/applicants/:id/reject`      | Recruiter | Reject candidate      |
| GET    | `/analytics`                  | Recruiter | Hiring analytics      |

### AI — `/api/ai`

| Method | Endpoint          | Auth | Description                  |
|--------|-------------------|------|------------------------------|
| POST   | `/chat`           | Yes  | Career assistant chat        |
| GET    | `/chat-history`   | Yes  | Chat history                 |
| POST   | `/analyze-resume` | Yes  | AI resume analysis           |
| GET    | `/job-matches`    | Yes  | AI job matches               |
| POST   | `/job-match`      | Yes  | Match specific job to user   |
| GET    | `/ranking/:jobId` | Rec. | Rank candidates for a job    |

### Notifications — `/api/notifications`

| Method | Endpoint          | Auth | Description              |
|--------|-------------------|------|--------------------------|
| GET    | `/`               | Yes  | Get notifications        |
| PUT    | `/read-all`       | Yes  | Mark all as read         |
| PUT    | `/:id/read`       | Yes  | Mark one as read         |
| DELETE | `/:id`            | Yes  | Delete notification      |

### Dashboard — `/api/dashboard`

| Method | Endpoint     | Auth      | Description           |
|--------|--------------|-----------|-----------------------|
| GET    | `/seeker`    | Seeker    | Seeker dashboard data |
| GET    | `/recruiter` | Recruiter | Recruiter dashboard   |
| GET    | `/admin`     | Admin     | Admin dashboard       |

### Admin — `/api/admin`

| Method | Endpoint                  | Auth  | Description         |
|--------|---------------------------|-------|---------------------|
| GET    | `/users`                  | Admin | List all users      |
| GET    | `/users/:id`              | Admin | Get user            |
| PUT    | `/users/:id`              | Admin | Update user         |
| PUT    | `/users/:id/status`       | Admin | Toggle active       |
| POST   | `/users/:id/suspend`      | Admin | Suspend user        |
| DELETE | `/users/:id`              | Admin | Delete user         |
| GET    | `/jobs`                   | Admin | List all jobs       |
| POST   | `/jobs/:id/approve`       | Admin | Approve job         |
| POST   | `/jobs/:id/reject`        | Admin | Reject job          |
| POST   | `/jobs/:id/suspend`       | Admin | Suspend job         |
| DELETE | `/jobs/:id`               | Admin | Delete job          |
| GET    | `/applications`           | Admin | List applications   |
| GET    | `/stats`                  | Admin | Platform stats      |
| GET    | `/reports`                | Admin | Reports             |

---

## Authentication Flow

1. Register or login → receive `{ token, user }` in response
2. Store token in `localStorage` (frontend handles this)
3. Send `Authorization: Bearer <token>` header on protected requests
4. Token expires after `JWT_EXPIRES_IN` (default 7 days)

---

## Deployment (Render)

1. Create a new **Web Service** on [render.com](https://render.com)
2. Set **Root Directory** to `Backend`
3. Set **Build Command**: `npm install`
4. Set **Start Command**: `npm start`
5. Add all environment variables from `.env.example` in the Render dashboard
6. Set `NODE_ENV=production`
7. Set `CLIENT_URL` to your Vercel frontend URL

MongoDB: Use [MongoDB Atlas](https://cloud.mongodb.com) free tier and set `MONGO_URI` to your Atlas connection string.
