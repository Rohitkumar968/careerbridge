require('dotenv').config()

const dns = require('dns')

// MongoDB Atlas SRV DNS resolution fix
dns.setServers([
  '8.8.8.8',
  '1.1.1.1',
])

const mongoose = require('mongoose')

const Job = require('./src/models/Job')
const Company = require('./src/models/Company')
const User = require('./src/models/User')

// =====================================================
// MONGODB CONNECTION
// =====================================================

const MONGO_URI = process.env.MONGO_URI

// =====================================================
// COMPANIES
// =====================================================

const companiesData = [
  {
    name: 'TechNova Solutions',
    industry: 'Information Technology',
    location: 'Bangalore, India',
    companySize: '201-500',
    foundedYear: 2018,
  },
  {
    name: 'CodeCraft Technologies',
    industry: 'Software Development',
    location: 'Hyderabad, India',
    companySize: '51-200',
    foundedYear: 2019,
  },
  {
    name: 'InnovateX Labs',
    industry: 'Technology',
    location: 'Pune, India',
    companySize: '51-200',
    foundedYear: 2020,
  },
  {
    name: 'CloudMatrix Systems',
    industry: 'Cloud Computing',
    location: 'Noida, India',
    companySize: '201-500',
    foundedYear: 2017,
  },
  {
    name: 'NextGen Digital',
    industry: 'Digital Solutions',
    location: 'Delhi, India',
    companySize: '51-200',
    foundedYear: 2021,
  },
  {
    name: 'WebSphere Technologies',
    industry: 'Web Development',
    location: 'Gurgaon, India',
    companySize: '201-500',
    foundedYear: 2016,
  },
  {
    name: 'DataCore Analytics',
    industry: 'Data & Analytics',
    location: 'Mumbai, India',
    companySize: '51-200',
    foundedYear: 2019,
  },
  {
    name: 'AppVertex Solutions',
    industry: 'Mobile & Web Technology',
    location: 'Chennai, India',
    companySize: '51-200',
    foundedYear: 2020,
  },
  {
    name: 'SoftPeak Technologies',
    industry: 'Software Development',
    location: 'Noida, India',
    companySize: '201-500',
    foundedYear: 2018,
  },
  {
    name: 'DevSphere Labs',
    industry: 'Technology',
    location: 'Bangalore, India',
    companySize: '51-200',
    foundedYear: 2022,
  },
  {
    name: 'PixelWave Digital',
    industry: 'Digital Technology',
    location: 'Pune, India',
    companySize: '51-200',
    foundedYear: 2021,
  },
  {
    name: 'CodeBridge Systems',
    industry: 'IT Services',
    location: 'Hyderabad, India',
    companySize: '201-500',
    foundedYear: 2017,
  },
  {
    name: 'TechOrbit Innovations',
    industry: 'Software & AI',
    location: 'Delhi, India',
    companySize: '51-200',
    foundedYear: 2020,
  },
  {
    name: 'StackForge Technologies',
    industry: 'Software Development',
    location: 'Gurgaon, India',
    companySize: '51-200',
    foundedYear: 2019,
  },
  {
    name: 'DigitalCore Solutions',
    industry: 'IT Services',
    location: 'Mumbai, India',
    companySize: '201-500',
    foundedYear: 2016,
  },
]

// =====================================================
// JOBS
// =====================================================

const jobsData = [
  {
    title: 'Full Stack MERN Developer',
    description:
      'Build scalable web applications using MongoDB, Express.js, React.js and Node.js.',
    location: 'Bangalore, India',
    employmentType: 'Full-time',
    workMode: 'Hybrid',
    experienceLevel: '1-3 Years',
    salaryMin: 600000,
    salaryMax: 1000000,
    skills: [
      'React.js',
      'Node.js',
      'Express.js',
      'MongoDB',
      'JavaScript',
    ],
    category: 'Technology',
  },

  {
    title: 'Frontend React Developer',
    description:
      'Develop responsive and modern user interfaces using React.js and Tailwind CSS.',
    location: 'Hyderabad, India',
    employmentType: 'Full-time',
    workMode: 'Remote',
    experienceLevel: '0-1 Years',
    salaryMin: 450000,
    salaryMax: 750000,
    skills: [
      'React.js',
      'JavaScript',
      'HTML5',
      'CSS3',
      'Tailwind CSS',
    ],
    category: 'Technology',
  },

  {
    title: 'Node.js Backend Developer',
    description:
      'Develop REST APIs and backend services using Node.js and Express.js.',
    location: 'Pune, India',
    employmentType: 'Full-time',
    workMode: 'Hybrid',
    experienceLevel: '1-3 Years',
    salaryMin: 550000,
    salaryMax: 900000,
    skills: [
      'Node.js',
      'Express.js',
      'MongoDB',
      'REST APIs',
      'JavaScript',
    ],
    category: 'Technology',
  },

  {
    title: 'Junior Software Developer',
    description:
      'Work with an experienced development team to build and maintain software applications.',
    location: 'Noida, India',
    employmentType: 'Full-time',
    workMode: 'On-site',
    experienceLevel: '0-1 Years',
    salaryMin: 350000,
    salaryMax: 600000,
    skills: [
      'JavaScript',
      'React.js',
      'Git',
      'HTML5',
      'CSS3',
    ],
    category: 'Software Development',
  },

  {
    title: 'JavaScript Developer',
    description:
      'Create modern web applications and reusable frontend components.',
    location: 'Delhi, India',
    employmentType: 'Full-time',
    workMode: 'Remote',
    experienceLevel: '1-3 Years',
    salaryMin: 500000,
    salaryMax: 850000,
    skills: [
      'JavaScript',
      'React.js',
      'TypeScript',
      'Git',
      'REST APIs',
    ],
    category: 'Technology',
  },

  {
    title: 'Backend Developer',
    description:
      'Design and implement secure backend APIs and database integrations.',
    location: 'Gurgaon, India',
    employmentType: 'Full-time',
    workMode: 'Hybrid',
    experienceLevel: '1-3 Years',
    salaryMin: 550000,
    salaryMax: 950000,
    skills: [
      'Node.js',
      'Express.js',
      'MongoDB',
      'REST APIs',
      'JWT',
    ],
    category: 'Software Development',
  },

  {
    title: 'React Developer Intern',
    description:
      'Learn and contribute to production React applications with a professional development team.',
    location: 'Bangalore, India',
    employmentType: 'Internship',
    workMode: 'Hybrid',
    experienceLevel: '0-1 Years',
    salaryMin: 150000,
    salaryMax: 250000,
    skills: [
      'React.js',
      'JavaScript',
      'HTML5',
      'CSS3',
      'Git',
    ],
    category: 'Technology',
  },

  {
    title: 'Software Engineer',
    description:
      'Design, develop and maintain reliable software applications for business users.',
    location: 'Mumbai, India',
    employmentType: 'Full-time',
    workMode: 'On-site',
    experienceLevel: '1-3 Years',
    salaryMin: 600000,
    salaryMax: 1100000,
    skills: [
      'JavaScript',
      'Node.js',
      'React.js',
      'SQL',
      'Git',
    ],
    category: 'Software Development',
  },

  {
    title: 'Frontend Developer',
    description:
      'Build responsive and accessible interfaces for web products.',
    location: 'Chennai, India',
    employmentType: 'Full-time',
    workMode: 'Remote',
    experienceLevel: '1-3 Years',
    salaryMin: 500000,
    salaryMax: 850000,
    skills: [
      'React.js',
      'JavaScript',
      'CSS3',
      'Tailwind CSS',
      'TypeScript',
    ],
    category: 'Web Development',
  },

  {
    title: 'Full Stack Developer',
    description:
      'Develop complete web applications across frontend, backend and database layers.',
    location: 'Noida, India',
    employmentType: 'Full-time',
    workMode: 'Hybrid',
    experienceLevel: '1-3 Years',
    salaryMin: 650000,
    salaryMax: 1100000,
    skills: [
      'React.js',
      'Node.js',
      'MongoDB',
      'Express.js',
      'JavaScript',
    ],
    category: 'Technology',
  },

  {
    title: 'Cloud Support Engineer',
    description:
      'Support cloud-based applications and assist with deployment and infrastructure tasks.',
    location: 'Hyderabad, India',
    employmentType: 'Full-time',
    workMode: 'On-site',
    experienceLevel: '1-3 Years',
    salaryMin: 500000,
    salaryMax: 800000,
    skills: [
      'AWS',
      'Linux',
      'Docker',
      'Git',
      'JavaScript',
    ],
    category: 'Cloud Computing',
  },

  {
    title: 'Data Analyst',
    description:
      'Analyze business data and create reports and dashboards for decision making.',
    location: 'Mumbai, India',
    employmentType: 'Full-time',
    workMode: 'Hybrid',
    experienceLevel: '1-3 Years',
    salaryMin: 450000,
    salaryMax: 750000,
    skills: [
      'SQL',
      'Excel',
      'Python',
      'Data Analysis',
      'Power BI',
    ],
    category: 'Data Analytics',
  },

  {
    title: 'AI Software Developer',
    description:
      'Develop intelligent software features and integrate AI services into web applications.',
    location: 'Delhi, India',
    employmentType: 'Full-time',
    workMode: 'Remote',
    experienceLevel: '1-3 Years',
    salaryMin: 700000,
    salaryMax: 1200000,
    skills: [
      'JavaScript',
      'Python',
      'AI',
      'REST APIs',
      'React.js',
    ],
    category: 'Artificial Intelligence',
  },

  {
    title: 'UI Developer',
    description:
      'Create polished, responsive and user-friendly interfaces for digital products.',
    location: 'Pune, India',
    employmentType: 'Full-time',
    workMode: 'Hybrid',
    experienceLevel: '0-1 Years',
    salaryMin: 400000,
    salaryMax: 650000,
    skills: [
      'HTML5',
      'CSS3',
      'JavaScript',
      'React.js',
      'Tailwind CSS',
    ],
    category: 'Web Development',
  },

  {
    title: 'MERN Stack Developer',
    description:
      'Build and maintain modern full-stack applications using the MERN technology stack.',
    location: 'Gurgaon, India',
    employmentType: 'Full-time',
    workMode: 'Remote',
    experienceLevel: '1-3 Years',
    salaryMin: 600000,
    salaryMax: 1050000,
    skills: [
      'MongoDB',
      'Express.js',
      'React.js',
      'Node.js',
      'JavaScript',
    ],
    category: 'Technology',
  },

  {
    title: 'Software Developer Intern',
    description:
      'Assist developers in building, testing and improving web applications.',
    location: 'Bangalore, India',
    employmentType: 'Internship',
    workMode: 'On-site',
    experienceLevel: '0-1 Years',
    salaryMin: 120000,
    salaryMax: 220000,
    skills: [
      'JavaScript',
      'React.js',
      'Git',
      'HTML5',
      'CSS3',
    ],
    category: 'Software Development',
  },

  {
    title: 'REST API Developer',
    description:
      'Design and implement scalable REST APIs for modern web applications.',
    location: 'Hyderabad, India',
    employmentType: 'Full-time',
    workMode: 'Hybrid',
    experienceLevel: '1-3 Years',
    salaryMin: 550000,
    salaryMax: 900000,
    skills: [
      'Node.js',
      'Express.js',
      'REST APIs',
      'MongoDB',
      'JWT',
    ],
    category: 'Backend Development',
  },

  {
    title: 'React TypeScript Developer',
    description:
      'Build maintainable frontend applications using React and TypeScript.',
    location: 'Noida, India',
    employmentType: 'Full-time',
    workMode: 'Remote',
    experienceLevel: '1-3 Years',
    salaryMin: 600000,
    salaryMax: 1000000,
    skills: [
      'React.js',
      'TypeScript',
      'JavaScript',
      'Tailwind CSS',
      'Git',
    ],
    category: 'Frontend Development',
  },
]

// =====================================================
// SEED DATABASE
// =====================================================

const seedDatabase = async () => {
  try {
    // Check MongoDB URI
    if (!MONGO_URI) {
      throw new Error(
        'MONGO_URI is missing in Backend/.env'
      )
    }

    console.log('Connecting to MongoDB...')

    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    })

    console.log('MongoDB connected successfully')

    // =================================================
    // FIND RECRUITER
    // =================================================

    let recruiter = await User.findOne({
      role: 'recruiter',
      isActive: true,
    })

    // If recruiter doesn't exist, try admin
    if (!recruiter) {
      recruiter = await User.findOne({
        role: 'admin',
        isActive: true,
      })
    }

    if (!recruiter) {
      throw new Error(
        'No active recruiter/admin user found. Please create a recruiter account first.'
      )
    }

    console.log(
      `Using recruiter: ${
        recruiter.name || recruiter.email
      }`
    )

    // =================================================
    // COUNTERS
    // =================================================

    let companyCount = 0
    let jobCount = 0

    const companies = []

    // =================================================
    // CREATE / REUSE COMPANIES
    // =================================================

    console.log('')
    console.log('Creating companies...')

    for (const companyData of companiesData) {
      let company = await Company.findOne({
        name: companyData.name,
      })

      if (!company) {
        company = await Company.create({
          ...companyData,

          recruiter: recruiter._id,

          description:
            `${companyData.name} is a growing technology company building modern digital products and software solutions.`,

          website: '',

          logo: '',
        })

        companyCount++

        console.log(
          `Company created: ${company.name}`
        )
      } else {
        console.log(
          `Company already exists: ${company.name}`
        )
      }

      companies.push(company)
    }

    // =================================================
    // CREATE JOBS
    // =================================================

    console.log('')
    console.log('Creating jobs...')

    for (
      let i = 0;
      i < jobsData.length;
      i++
    ) {
      const jobData = jobsData[i]

      // Distribute jobs among companies
      const company =
        companies[i % companies.length]

      // Avoid duplicate jobs
      const existingJob =
        await Job.findOne({
          title: jobData.title,
          company: company._id,
        })

      if (existingJob) {
        console.log(
          `Job already exists: ${jobData.title}`
        )

        continue
      }

      // Deadline 30+ days from today
      const deadline = new Date()

      deadline.setDate(
        deadline.getDate() + 30 + i
      )

      await Job.create({
        ...jobData,

        company: company._id,

        recruiter: recruiter._id,

        deadline,

        status: 'active',

        applicantsCount: 0,
      })

      jobCount++

      console.log(
        `Job created: ${jobData.title}`
      )
    }

    // =================================================
    // FINAL RESULT
    // =================================================

    console.log('')
    console.log(
      '======================================'
    )
    console.log(
      'CareerBridge seed completed successfully'
    )
    console.log(
      '======================================'
    )

    console.log(
      `New companies added: ${companyCount}`
    )

    console.log(
      `New jobs added: ${jobCount}`
    )

    console.log(
      `Companies in seed list: ${companies.length}`
    )

    console.log(
      `Jobs in seed list: ${jobsData.length}`
    )

    console.log(
      '======================================'
    )
  } catch (error) {
    console.error('')
    console.error('SEED ERROR:')
    console.error(error.message)
  } finally {
    await mongoose.connection.close()

    console.log(
      'MongoDB connection closed'
    )
  }
}

// =====================================================
// START
// =====================================================

seedDatabase()