// =====================================================
// CareerBridge - Dynamic Mock Data
// =====================================================

// Current date
const today = new Date()

// =====================================================
// DATE HELPERS
// =====================================================

// Add / subtract days from current date
const addDays = (days) => {
  const date = new Date(today)
  date.setDate(date.getDate() + days)
  return date
}

// Convert date to YYYY-MM-DD
const formatDate = (date) => {
  return date.toISOString().split('T')[0]
}

// Display date
export const formatDisplayDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

// =====================================================
// AVATAR HELPER
// =====================================================

const avatar = (text) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(
    text
  )}&background=4f46e5&color=fff&size=100`

// =====================================================
// MOCK JOBS
// =====================================================

export const mockJobs = [
  {
    id: 1,
    title: 'Senior React Developer',
    company: 'TechCorp',
    logo: avatar('TechCorp'),
    location: 'San Francisco, CA',
    salary: {
      min: 120000,
      max: 160000,
    },
    jobType: 'Full-time',
    experience: '5+ years',
    skills: ['React', 'JavaScript', 'TypeScript', 'Node.js'],
    description:
      'We are looking for an experienced React Developer to join our engineering team.',
    postedDate: formatDate(addDays(-2)),
    applicants: 24,
    matchScore: 95,
    remote: true,
    workMode: 'Remote',
    industry: 'Technology',
  },

  {
    id: 2,
    title: 'Full Stack MERN Developer',
    company: 'StartupXYZ',
    logo: avatar('StartupXYZ'),
    location: 'New York, NY',
    salary: {
      min: 100000,
      max: 140000,
    },
    jobType: 'Full-time',
    experience: '3+ years',
    skills: ['MongoDB', 'Express', 'React', 'Node.js'],
    description:
      'Join our growing startup as a Full Stack MERN Developer.',
    postedDate: formatDate(addDays(-3)),
    applicants: 18,
    matchScore: 88,
    remote: false,
    workMode: 'On-site',
    industry: 'Technology',
  },

  {
    id: 3,
    title: 'UI/UX Designer',
    company: 'DesignStudio',
    logo: avatar('DesignStudio'),
    location: 'Los Angeles, CA',
    salary: {
      min: 80000,
      max: 120000,
    },
    jobType: 'Full-time',
    experience: '2+ years',
    skills: ['Figma', 'UI Design', 'UX Research', 'Prototyping'],
    description:
      'Create beautiful and intuitive user experiences for modern digital products.',
    postedDate: formatDate(addDays(-4)),
    applicants: 32,
    matchScore: 82,
    remote: true,
    workMode: 'Hybrid',
    industry: 'Design',
  },

  {
    id: 4,
    title: 'DevOps Engineer',
    company: 'CloudSystems',
    logo: avatar('CloudSystems'),
    location: 'Seattle, WA',
    salary: {
      min: 130000,
      max: 170000,
    },
    jobType: 'Full-time',
    experience: '4+ years',
    skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD'],
    description:
      'Manage and optimize our cloud infrastructure and deployment pipelines.',
    postedDate: formatDate(addDays(-5)),
    applicants: 15,
    matchScore: 91,
    remote: true,
    workMode: 'Remote',
    industry: 'Technology',
  },

  {
    id: 5,
    title: 'Product Manager',
    company: 'InnovateCo',
    logo: avatar('InnovateCo'),
    location: 'Boston, MA',
    salary: {
      min: 110000,
      max: 150000,
    },
    jobType: 'Full-time',
    experience: '3+ years',
    skills: ['Product Strategy', 'Analytics', 'Leadership'],
    description:
      'Lead product development, strategy, and cross-functional collaboration.',
    postedDate: formatDate(addDays(-6)),
    applicants: 28,
    matchScore: 79,
    remote: false,
    workMode: 'On-site',
    industry: 'Technology',
  },

  {
    id: 6,
    title: 'Backend Developer (Python)',
    company: 'DataFlow',
    logo: avatar('DataFlow'),
    location: 'Austin, TX',
    salary: {
      min: 105000,
      max: 145000,
    },
    jobType: 'Full-time',
    experience: '2+ years',
    skills: ['Python', 'Django', 'PostgreSQL', 'REST APIs'],
    description:
      'Build scalable backend systems and REST APIs using Python.',
    postedDate: formatDate(addDays(-7)),
    applicants: 22,
    matchScore: 85,
    remote: true,
    workMode: 'Remote',
    industry: 'Technology',
  },
]

// =====================================================
// MOCK COMPANIES
// =====================================================

export const mockCompanies = [
  {
    id: 1,
    name: 'TechCorp',
    logo: avatar('TechCorp'),
    website: 'https://techcorp.com',
    industry: 'Technology',
    size: '1000-5000',
    location: 'San Francisco, CA',
    description:
      'Leading technology company focused on innovation and digital transformation.',
    rating: 4.5,
    reviews: 234,
    activeJobs: 12,
  },

  {
    id: 2,
    name: 'StartupXYZ',
    logo: avatar('StartupXYZ'),
    website: 'https://startupxyz.com',
    industry: 'Technology',
    size: '50-200',
    location: 'New York, NY',
    description:
      'Fast-growing startup building innovative products for modern businesses.',
    rating: 4.2,
    reviews: 89,
    activeJobs: 8,
  },

  {
    id: 3,
    name: 'DesignStudio',
    logo: avatar('DesignStudio'),
    website: 'https://designstudio.com',
    industry: 'Design',
    size: '100-500',
    location: 'Los Angeles, CA',
    description:
      'Creative design agency delivering beautiful digital experiences.',
    rating: 4.7,
    reviews: 156,
    activeJobs: 5,
  },
]

// =====================================================
// MOCK APPLICATIONS
// =====================================================

export const mockApplications = [
  {
    id: 1,
    jobId: 1,
    jobTitle: 'Senior React Developer',
    company: 'TechCorp',
    appliedDate: formatDate(addDays(-5)),
    status: 'screening',
    lastUpdated: formatDate(addDays(-2)),
    nextStep: 'Technical Interview',
  },

  {
    id: 2,
    jobId: 2,
    jobTitle: 'Full Stack MERN Developer',
    company: 'StartupXYZ',
    appliedDate: formatDate(addDays(-7)),
    status: 'applied',
    lastUpdated: formatDate(addDays(-6)),
    nextStep: 'Awaiting Review',
  },

  {
    id: 3,
    jobId: 3,
    jobTitle: 'UI/UX Designer',
    company: 'DesignStudio',
    appliedDate: formatDate(addDays(-4)),
    status: 'interview',
    lastUpdated: formatDate(addDays(-1)),
    nextStep: 'Final Round Interview',
  },
]

// =====================================================
// MOCK INTERVIEWS
// =====================================================

export const mockInterviews = [
  {
    id: 1,
    company: 'TechCorp',
    position: 'Senior React Developer',
    interviewer: 'John Smith',

    // 3 days from today
    date: formatDate(addDays(3)),

    time: '10:00 AM',
    type: 'Technical',

    // Google Meet
    meetingLink: 'https://meet.google.com/tpn-anoj-snw',

    status: 'scheduled',
  },

  {
    id: 2,
    company: 'DesignStudio',
    position: 'UI/UX Designer',
    interviewer: 'Sarah Johnson',

    // 6 days from today
    date: formatDate(addDays(6)),

    time: '2:00 PM',
    type: 'HR Round',

    // Google Meet
    meetingLink: 'https://meet.google.com/tpn-anoj-snw',

    status: 'scheduled',
  },

  {
    id: 3,
    company: 'StartupXYZ',
    position: 'Full Stack MERN Developer',
    interviewer: 'Michael Brown',

    // 10 days from today
    date: formatDate(addDays(10)),

    time: '11:30 AM',
    type: 'Technical',

    // Google Meet
    meetingLink: 'https://meet.google.com/tpn-anoj-snw',

    status: 'scheduled',
  },
]

// =====================================================
// MOCK NOTIFICATIONS
// =====================================================

export const mockNotifications = [
  {
    id: 1,
    type: 'application',
    title: 'Application Received',
    message:
      'Your application for Senior React Developer has been received.',
    read: false,
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
  },

  {
    id: 2,
    type: 'interview',
    title: 'Interview Scheduled',
    message:
      `Your interview with TechCorp is scheduled for ${formatDisplayDate(
        addDays(3)
      )}.`,
    read: false,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },

  {
    id: 3,
    type: 'job',
    title: 'New Job Match',
    message:
      'A new job matching your profile is available.',
    read: true,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },

  {
    id: 4,
    type: 'application',
    title: 'Application Status Updated',
    message:
      'Your application has moved to the screening stage.',
    read: false,
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
  },
]

// =====================================================
// MOCK CANDIDATES
// =====================================================

export const mockCandidates = [
  {
    id: 1,
    name: 'Alice Johnson',
    email: 'alice@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    experience: '5 years',
    skills: ['React', 'JavaScript', 'Node.js'],
    matchScore: 96,
    status: 'screening',
    appliedDate: formatDate(addDays(-5)),
    resume: 'alice_resume.pdf',
  },

  {
    id: 2,
    name: 'Bob Smith',
    email: 'bob@example.com',
    phone: '+1 (555) 234-5678',
    location: 'New York, NY',
    experience: '3 years',
    skills: ['React', 'TypeScript', 'MongoDB'],
    matchScore: 88,
    status: 'applied',
    appliedDate: formatDate(addDays(-7)),
    resume: 'bob_resume.pdf',
  },

  {
    id: 3,
    name: 'Emily Davis',
    email: 'emily@example.com',
    phone: '+1 (555) 345-6789',
    location: 'Austin, TX',
    experience: '4 years',
    skills: ['Node.js', 'Express', 'MongoDB'],
    matchScore: 91,
    status: 'interview',
    appliedDate: formatDate(addDays(-3)),
    resume: 'emily_resume.pdf',
  },
]

// =====================================================
// MOCK USERS
// =====================================================

export const mockUsers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'job_seeker',
    status: 'active',
    joined: formatDate(addDays(-120)),
  },

  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'recruiter',
    status: 'active',
    joined: formatDate(addDays(-100)),
  },

  {
    id: 3,
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    status: 'active',
    joined: formatDate(addDays(-150)),
  },
]