require('dotenv').config()

const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const connectDB = require('../config/db')

const User = require('../models/User')
const Company = require('../models/Company')
const Job = require('../models/Job')

const seed = async () => {
  await connectDB()
  console.log('Connected to MongoDB. Seeding...')

  // Clear existing data
  await Promise.all([
    User.deleteMany(),
    Company.deleteMany(),
    Job.deleteMany(),
  ])
  console.log('Cleared existing data.')

  // ── Users ──────────────────────────────────────────────────────────────────
  const users = await User.create([
    {
      name: 'Admin User',
      email: 'admin@careerbridge.dev',
      password: 'Admin@1234',
      role: 'admin',
      isActive: true,
    },
    {
      name: 'Sarah Recruiter',
      email: 'recruiter@careerbridge.dev',
      password: 'Recruiter@1234',
      role: 'recruiter',
      location: 'San Francisco, CA',
      bio: 'Senior talent acquisition specialist with 8 years of experience.',
      isActive: true,
    },
    {
      name: 'John Seeker',
      email: 'seeker@careerbridge.dev',
      password: 'Seeker@1234',
      role: 'seeker',
      location: 'New York, NY',
      bio: 'Full-stack developer passionate about building great products.',
      skills: ['React', 'Node.js', 'MongoDB', 'JavaScript', 'TypeScript'],
      experience: [
        {
          title: 'Frontend Developer',
          company: 'WebAgency',
          startDate: '2021-06',
          endDate: '2023-12',
          description: 'Built responsive React applications for enterprise clients.',
        },
      ],
      education: [
        {
          degree: 'B.Sc. Computer Science',
          institution: 'State University',
          year: '2021',
        },
      ],
      isActive: true,
    },
  ])

  const [, recruiter, seeker] = users
  console.log('Created users.')

  // ── Companies ──────────────────────────────────────────────────────────────
  const companies = await Company.create([
    {
      name: 'TechCorp Inc.',
      description: 'Leading technology company focused on cloud solutions and AI.',
      website: 'https://techcorp.example.com',
      industry: 'Technology',
      location: 'San Francisco, CA',
      companySize: '1000-5000',
      foundedYear: 2010,
      recruiter: recruiter._id,
    },
    {
      name: 'StartupXYZ',
      description: 'Fast-growing startup disrupting the fintech space.',
      website: 'https://startupxyz.example.com',
      industry: 'Fintech',
      location: 'New York, NY',
      companySize: '50-200',
      foundedYear: 2019,
      recruiter: recruiter._id,
    },
  ])

  const [techcorp, startup] = companies
  console.log('Created companies.')

  // ── Jobs ───────────────────────────────────────────────────────────────────
  await Job.create([
    {
      title: 'Senior React Developer',
      description: 'We are looking for an experienced React developer to lead our frontend team. You will architect scalable UI components and mentor junior developers.',
      company: techcorp._id,
      recruiter: recruiter._id,
      location: 'San Francisco, CA',
      employmentType: 'Full-time',
      workMode: 'Remote',
      experienceLevel: 'Senior',
      salaryMin: 120000,
      salaryMax: 160000,
      skills: ['React', 'TypeScript', 'Node.js', 'GraphQL'],
      category: 'Engineering',
      status: 'active',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Full Stack MERN Developer',
      description: 'Join our growing engineering team to build and scale our core product. You will work across the full stack using MongoDB, Express, React, and Node.js.',
      company: startup._id,
      recruiter: recruiter._id,
      location: 'New York, NY',
      employmentType: 'Full-time',
      workMode: 'Hybrid',
      experienceLevel: 'Mid',
      salaryMin: 100000,
      salaryMax: 140000,
      skills: ['MongoDB', 'Express', 'React', 'Node.js', 'JavaScript'],
      category: 'Engineering',
      status: 'active',
      deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'DevOps Engineer',
      description: 'Manage and optimize our cloud infrastructure on AWS. Implement CI/CD pipelines and ensure high availability of our services.',
      company: techcorp._id,
      recruiter: recruiter._id,
      location: 'Remote',
      employmentType: 'Full-time',
      workMode: 'Remote',
      experienceLevel: 'Senior',
      salaryMin: 130000,
      salaryMax: 170000,
      skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Terraform'],
      category: 'DevOps',
      status: 'active',
      deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'UI/UX Designer',
      description: 'Create beautiful and intuitive user experiences for our web and mobile products. Collaborate closely with product and engineering teams.',
      company: startup._id,
      recruiter: recruiter._id,
      location: 'New York, NY',
      employmentType: 'Full-time',
      workMode: 'On-site',
      experienceLevel: 'Mid',
      salaryMin: 80000,
      salaryMax: 110000,
      skills: ['Figma', 'UI Design', 'UX Research', 'Prototyping'],
      category: 'Design',
      status: 'active',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Product Manager',
      description: 'Lead product strategy and roadmap for our flagship SaaS product. Work with cross-functional teams to deliver exceptional user value.',
      company: techcorp._id,
      recruiter: recruiter._id,
      location: 'San Francisco, CA',
      employmentType: 'Full-time',
      workMode: 'Hybrid',
      experienceLevel: 'Lead',
      salaryMin: 130000,
      salaryMax: 170000,
      skills: ['Product Strategy', 'Analytics', 'Agile', 'Leadership'],
      category: 'Product',
      status: 'active',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  ])

  console.log('Created jobs.')

  console.log('\n✅ Seed complete!\n')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('Demo credentials:')
  console.log('  Admin    → admin@careerbridge.dev     / Admin@1234')
  console.log('  Recruiter→ recruiter@careerbridge.dev / Recruiter@1234')
  console.log('  Seeker   → seeker@careerbridge.dev    / Seeker@1234')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  process.exit(0)
}

seed().catch((err) => {
  console.error('Seed failed:', err.message)
  process.exit(1)
})
