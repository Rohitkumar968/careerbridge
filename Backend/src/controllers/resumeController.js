const path = require('path')
const fs = require('fs')

const pdfParse = require('pdf-parse')
const mammoth = require('mammoth')

const Resume = require('../models/Resume')

// =====================================================
// DELETE FILE HELPER
// =====================================================

const deleteFileIfExists = (filePath) => {
  try {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }
  } catch (error) {
    console.error('File delete error:', error)
  }
}

// =====================================================
// FORMAT RESUME RESPONSE
// =====================================================

const formatResume = (resume) => {
  if (!resume) return null

  return {
    _id: resume._id,
    originalName: resume.originalName,
    fileName: resume.fileName,
    mimeType: resume.mimeType,
    size: resume.size,
    atsScore: resume.atsScore || 0,
    formattingScore: resume.formattingScore || 0,
    status: resume.status,
    skills: resume.skills || [],
    strengths: resume.strengths || [],
    recommendations: resume.recommendations || [],
    uploadedDate: resume.createdAt,
    updatedAt: resume.updatedAt,
  }
}

// =====================================================
// EXTRACT TEXT FROM RESUME
// =====================================================

const extractResumeText = async (filePath, mimeType) => {
  if (!filePath || !fs.existsSync(filePath)) {
    throw new Error('Resume file not found.')
  }

  const buffer = fs.readFileSync(filePath)

  if (mimeType === 'application/pdf') {
    const data = await pdfParse(buffer)
    return data.text || ''
  }

  if (
    mimeType ===
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    const result = await mammoth.extractRawText({
      buffer,
    })

    return result.value || ''
  }

  if (mimeType === 'application/msword') {
    return buffer.toString('utf8')
  }

  throw new Error(
    'Unsupported resume format. Please upload PDF or DOCX.'
  )
}

// =====================================================
// CLEAN TEXT
// =====================================================

const cleanText = (text) => {
  return String(text || '')
    .replace(/\r/g, ' ')
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

// =====================================================
// SKILL DATABASE
// =====================================================

const SKILL_KEYWORDS = [
  'javascript',
  'typescript',
  'react',
  'react.js',
  'next.js',
  'node.js',
  'node',
  'express',
  'express.js',
  'mongodb',
  'mysql',
  'postgresql',
  'sql',
  'html',
  'css',
  'tailwind',
  'bootstrap',
  'redux',
  'redux toolkit',
  'rest api',
  'rest apis',
  'api',
  'git',
  'github',
  'docker',
  'aws',
  'azure',
  'java',
  'python',
  'c++',
  'c#',
  'php',
  'angular',
  'vue',
  'figma',
  'ui/ux',
  'machine learning',
  'data analysis',
  'excel',
  'power bi',
  'tableau',
]

// =====================================================
// DETECT SKILLS
// =====================================================

const detectSkills = (text) => {
  const lowerText = text.toLowerCase()
  const detected = []

  SKILL_KEYWORDS.forEach((skill) => {
    if (lowerText.includes(skill.toLowerCase())) {
      detected.push(skill)
    }
  })

  return [...new Set(detected)]
}

// =====================================================
// CHECK SECTION
// =====================================================

const hasSection = (text, keywords) => {
  const lowerText = text.toLowerCase()

  return keywords.some((keyword) =>
    lowerText.includes(keyword.toLowerCase())
  )
}

// =====================================================
// FORMATTING ANALYSIS
// =====================================================

const analyzeFormatting = (rawText) => {
  const originalText = String(rawText || '')
  const text = cleanText(originalText)

  let score = 0

  const formattingRecommendations = []
  const formattingStrengths = []

  // SECTION STRUCTURE

  const sectionGroups = [
    [
      'summary',
      'professional summary',
      'profile',
      'objective',
      'career objective',
    ],
    [
      'skills',
      'technical skills',
      'core skills',
    ],
    [
      'experience',
      'work experience',
      'professional experience',
      'employment',
      'internship',
    ],
    [
      'education',
      'academic background',
    ],
    [
      'projects',
      'project experience',
      'personal projects',
    ],
    [
      'certifications',
      'certification',
      'achievements',
      'achievement',
      'awards',
      'award',
    ],
  ]

  let sectionCount = 0

  sectionGroups.forEach((group) => {
    if (hasSection(text, group)) {
      sectionCount++
    }
  })

  if (sectionCount >= 5) {
    score += 25

    formattingStrengths.push(
      'Resume has a clear and well-organized section structure.'
    )
  } else if (sectionCount >= 4) {
    score += 20

    formattingStrengths.push(
      'Resume contains most important professional sections.'
    )
  } else if (sectionCount >= 3) {
    score += 14

    formattingRecommendations.push(
      'Organize the resume into clear sections such as Summary, Skills, Experience, Education, and Projects.'
    )
  } else {
    score += 7

    formattingRecommendations.push(
      'Improve the resume structure by adding clearly separated professional sections.'
    )
  }

  // CONTACT INFORMATION

  const hasEmail =
    /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(
      originalText
    )

  const hasPhone =
    /(?:\+?\d{1,3}[-.\s]?)?(?:\d{10}|\d{3}[-.\s]\d{3}[-.\s]\d{4})/.test(
      originalText
    )

  const lowerText = text.toLowerCase()

  const hasLinkedIn = lowerText.includes('linkedin')
  const hasGithub = lowerText.includes('github')

  if (hasEmail) score += 4
  if (hasPhone) score += 4
  if (hasLinkedIn) score += 4
  if (hasGithub) score += 3

  const contactScore =
    (hasEmail ? 1 : 0) +
    (hasPhone ? 1 : 0) +
    (hasLinkedIn ? 1 : 0) +
    (hasGithub ? 1 : 0)

  if (contactScore >= 4) {
    formattingStrengths.push(
      'Contact information is complete and easy to identify.'
    )
  } else if (contactScore >= 2) {
    formattingRecommendations.push(
      'Keep email, phone, LinkedIn, and GitHub details together in the header.'
    )
  } else {
    formattingRecommendations.push(
      'Improve the contact header by clearly presenting email, phone, and professional links.'
    )
  }

  // BULLET STRUCTURE

  const bulletMatches =
    originalText.match(
      /(^|\n)\s*(?:[-•●▪◦*]|\d+[.)])\s+/gm
    ) || []

  const bulletCount = bulletMatches.length

  if (bulletCount >= 12) {
    score += 20

    formattingStrengths.push(
      'Uses bullet points effectively for professional content.'
    )
  } else if (bulletCount >= 7) {
    score += 16

    formattingStrengths.push(
      'Good use of bullet points for readability.'
    )
  } else if (bulletCount >= 3) {
    score += 10

    formattingRecommendations.push(
      'Use more concise bullet points for experience and project descriptions.'
    )
  } else {
    score += 5

    formattingRecommendations.push(
      'Use bullet points instead of large blocks of text to improve readability.'
    )
  }

  // LINE STRUCTURE

  const lines = originalText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  const lineCount = lines.length

  const longLines = lines.filter(
    (line) => line.length > 180
  ).length

  if (lineCount >= 25 && longLines <= 3) {
    score += 15

    formattingStrengths.push(
      'Content is divided into readable lines and sections.'
    )
  } else if (lineCount >= 15 && longLines <= 6) {
    score += 11

    formattingStrengths.push(
      'Resume has a reasonably readable text structure.'
    )
  } else if (longLines > 8) {
    score += 5

    formattingRecommendations.push(
      'Break long paragraphs into shorter bullet points for better readability.'
    )
  } else {
    score += 7

    formattingRecommendations.push(
      'Improve spacing and line structure to make the resume easier to scan.'
    )
  }

  // RESUME LENGTH

  const wordCount = text
    .split(/\s+/)
    .filter(Boolean).length

  if (wordCount >= 400 && wordCount <= 900) {
    score += 15

    formattingStrengths.push(
      'Resume length is concise and recruiter-friendly.'
    )
  } else if (wordCount >= 300 && wordCount <= 1200) {
    score += 12

    formattingStrengths.push(
      'Resume contains an appropriate amount of content.'
    )
  } else if (wordCount < 300) {
    score += 6

    formattingRecommendations.push(
      'Resume is short. Add relevant projects, achievements, skills, or experience.'
    )
  } else {
    score += 7

    formattingRecommendations.push(
      'Resume contains a lot of content. Remove unnecessary information and keep it concise.'
    )
  }

  score = Math.min(100, Math.max(0, score))

  return {
    formattingScore: score,
    formattingStrengths: [
      ...new Set(formattingStrengths),
    ],
    formattingRecommendations: [
      ...new Set(formattingRecommendations),
    ],
  }
}

// =====================================================
// ATS ANALYSIS
// =====================================================

const analyzeResumeContent = (rawText) => {
  const text = cleanText(rawText)
  const lowerText = text.toLowerCase()

  let score = 0

  const skills = detectSkills(text)

  const strengths = []
  const recommendations = []

  // CONTACT INFORMATION

  const hasEmail =
    /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(
      text
    )

  const hasPhone =
    /(?:\+?\d{1,3}[-.\s]?)?(?:\d{10}|\d{3}[-.\s]\d{3}[-.\s]\d{4})/.test(
      text
    )

  const hasLinkedIn =
    lowerText.includes('linkedin')

  const hasGithub =
    lowerText.includes('github')

  if (hasEmail) {
    score += 5
  } else {
    recommendations.push(
      'Add a professional email address.'
    )
  }

  if (hasPhone) {
    score += 5
  } else {
    recommendations.push(
      'Add a valid phone number.'
    )
  }

  if (hasLinkedIn) {
    score += 3
  } else {
    recommendations.push(
      'Add your LinkedIn profile URL.'
    )
  }

  if (hasGithub) {
    score += 2
  } else {
    recommendations.push(
      'Add your GitHub profile if you have technical projects.'
    )
  }

  // SUMMARY

  const hasSummary = hasSection(text, [
    'summary',
    'professional summary',
    'profile',
    'objective',
    'career objective',
  ])

  if (hasSummary) {
    score += 10

    strengths.push(
      'Professional summary is included.'
    )
  } else {
    recommendations.push(
      'Add a concise professional summary tailored to the job.'
    )
  }

  // SKILLS

  if (skills.length >= 10) {
    score += 20

    strengths.push(
      'Strong technical skills section with multiple relevant skills.'
    )
  } else if (skills.length >= 6) {
    score += 15

    strengths.push(
      'Good range of technical skills detected.'
    )

    recommendations.push(
      'Add more job-relevant technical keywords.'
    )
  } else if (skills.length >= 3) {
    score += 10

    recommendations.push(
      'Expand your skills section with more relevant technologies.'
    )
  } else if (skills.length > 0) {
    score += 5

    recommendations.push(
      'Add a dedicated technical skills section.'
    )
  } else {
    recommendations.push(
      'Add technical and job-specific skills.'
    )
  }

  // EXPERIENCE

  const hasExperience = hasSection(text, [
    'experience',
    'work experience',
    'professional experience',
    'employment',
    'internship',
    'intern',
  ])

  if (hasExperience) {
    score += 15

    strengths.push(
      'Work experience or internship section detected.'
    )
  } else {
    recommendations.push(
      'Add work experience, internship, or relevant practical experience.'
    )
  }

  // EDUCATION

  const hasEducation = hasSection(text, [
    'education',
    'b.tech',
    'btech',
    'bachelor',
    'master',
    'degree',
    'university',
    'college',
  ])

  if (hasEducation) {
    score += 10

    strengths.push(
      'Education details are included.'
    )
  } else {
    recommendations.push(
      'Add your education details.'
    )
  }

  // PROJECTS

  const hasProjects = hasSection(text, [
    'projects',
    'project experience',
    'personal projects',
    'academic projects',
  ])

  if (hasProjects) {
    score += 10

    strengths.push(
      'Projects section is included.'
    )
  } else {
    recommendations.push(
      'Add relevant projects with technologies and measurable results.'
    )
  }

  // CERTIFICATIONS / ACHIEVEMENTS

  const hasAchievements = hasSection(text, [
    'certification',
    'certifications',
    'achievement',
    'achievements',
    'award',
    'awards',
  ])

  if (hasAchievements) {
    score += 5

    strengths.push(
      'Certifications or achievements detected.'
    )
  } else {
    recommendations.push(
      'Consider adding relevant certifications, awards, or achievements.'
    )
  }

  // ACTION WORDS / METRICS

  const actionWords = [
    'developed',
    'created',
    'built',
    'implemented',
    'designed',
    'managed',
    'optimized',
    'improved',
    'led',
    'delivered',
    'integrated',
    'automated',
  ]

  const metricWords = [
    '%',
    'percent',
    'users',
    'projects',
    'revenue',
    'performance',
    'increase',
    'decrease',
    'reduced',
    'improved',
  ]

  const actionWordCount = actionWords.filter(
    (word) => lowerText.includes(word)
  ).length

  const metricWordCount = metricWords.filter(
    (word) => lowerText.includes(word)
  ).length

  if (actionWordCount >= 4) {
    score += 3

    strengths.push(
      'Uses strong action-oriented language.'
    )
  } else {
    recommendations.push(
      'Use stronger action verbs such as developed, implemented, optimized, and delivered.'
    )
  }

  if (metricWordCount >= 2) {
    score += 2

    strengths.push(
      'Includes measurable results or achievements.'
    )
  } else {
    recommendations.push(
      'Add measurable results such as percentages, users, performance improvements, or project outcomes.'
    )
  }

  // LENGTH

  const wordCount = text
    .split(/\s+/)
    .filter(Boolean).length

  if (wordCount >= 300 && wordCount <= 1200) {
    score += 5

    strengths.push(
      'Resume contains an appropriate amount of content.'
    )
  } else if (wordCount < 300) {
    score += 2

    recommendations.push(
      'Resume appears too short. Add more relevant experience, projects, skills, or achievements.'
    )
  } else {
    score += 3

    recommendations.push(
      'Consider removing unnecessary content and keeping the resume concise.'
    )
  }

  score = Math.min(100, Math.max(0, score))

  return {
    atsScore: score,
    skills,
    strengths: [
      ...new Set(strengths),
    ],
    recommendations: [
      ...new Set(recommendations),
    ],
    wordCount,
  }
}

// =====================================================
// ANALYZE RESUME FILE
// =====================================================

const analyzeResumeFile = async (
  filePath,
  mimeType
) => {
  const text = await extractResumeText(
    filePath,
    mimeType
  )

  if (!text || text.trim().length < 20) {
    throw new Error(
      'Unable to extract enough text from this resume. Please upload a readable PDF or DOCX file.'
    )
  }

  const atsAnalysis =
    analyzeResumeContent(text)

  const formattingAnalysis =
    analyzeFormatting(text)

  return {
    ...atsAnalysis,
    ...formattingAnalysis,
  }
}

// =====================================================
// UPLOAD RESUME
// =====================================================

const uploadResume = async (
  req,
  res,
  next
) => {
  let uploadedFilePath = null

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please select a resume file.',
      })
    }

    uploadedFilePath = req.file.path

    const analysis =
      await analyzeResumeFile(
        req.file.path,
        req.file.mimetype
      )

    const existingResume =
      await Resume.findOne({
        user: req.user._id,
      })

    // REPLACE EXISTING RESUME

    if (existingResume) {
      const oldFilePath =
        existingResume.filePath

      existingResume.originalName =
        req.file.originalname

      existingResume.fileName =
        req.file.filename

      existingResume.filePath =
        req.file.path

      existingResume.mimeType =
        req.file.mimetype

      existingResume.size =
        req.file.size

      existingResume.atsScore =
        analysis.atsScore

      existingResume.formattingScore =
        analysis.formattingScore

      existingResume.status =
        'analyzed'

      existingResume.skills =
        analysis.skills

      existingResume.strengths = [
        ...new Set([
          ...analysis.strengths,
          ...analysis.formattingStrengths,
        ]),
      ]

      existingResume.recommendations = [
        ...new Set([
          ...analysis.recommendations,
          ...analysis.formattingRecommendations,
        ]),
      ]

      await existingResume.save()

      uploadedFilePath = null

      if (
        oldFilePath &&
        oldFilePath !== req.file.path
      ) {
        deleteFileIfExists(oldFilePath)
      }

      return res.json({
        success: true,
        message:
          'Resume replaced and analyzed successfully.',
        data:
          formatResume(existingResume),
      })
    }

    // CREATE NEW RESUME

    const resume =
      await Resume.create({
        user: req.user._id,
        originalName:
          req.file.originalname,
        fileName:
          req.file.filename,
        filePath:
          req.file.path,
        mimeType:
          req.file.mimetype,
        size:
          req.file.size,
        atsScore:
          analysis.atsScore,
        formattingScore:
          analysis.formattingScore,
        status:
          'analyzed',
        skills:
          analysis.skills,
        strengths: [
          ...new Set([
            ...analysis.strengths,
            ...analysis.formattingStrengths,
          ]),
        ],
        recommendations: [
          ...new Set([
            ...analysis.recommendations,
            ...analysis.formattingRecommendations,
          ]),
        ],
      })

    uploadedFilePath = null

    return res.status(201).json({
      success: true,
      message:
        'Resume uploaded and analyzed successfully.',
      data:
        formatResume(resume),
    })
  } catch (error) {
    if (uploadedFilePath) {
      deleteFileIfExists(
        uploadedFilePath
      )
    }

    next(error)
  }
}

// =====================================================
// GET RESUME
// =====================================================

const getResume = async (
  req,
  res,
  next
) => {
  try {
    const resume =
      await Resume.findOne({
        user: req.user._id,
      })

    if (!resume) {
      return res.status(404).json({
        success: false,
        message:
          'No resume uploaded yet.',
      })
    }

    return res.json({
      success: true,
      data:
        formatResume(resume),
    })
  } catch (error) {
    next(error)
  }
}

// =====================================================
// VIEW RESUME
// =====================================================

const viewResume = async (
  req,
  res,
  next
) => {
  try {
    const resume =
      await Resume.findOne({
        user: req.user._id,
      })

    if (!resume) {
      return res.status(404).json({
        success: false,
        message:
          'Resume not found.',
      })
    }

    if (
      !resume.filePath ||
      !fs.existsSync(resume.filePath)
    ) {
      return res.status(404).json({
        success: false,
        message:
          'Resume file is missing from server.',
      })
    }

    res.setHeader(
      'Content-Type',
      resume.mimeType ||
        'application/pdf'
    )

    const safeFileName =
      String(
        resume.originalName ||
          'resume.pdf'
      ).replace(
        /["\r\n]/g,
        ''
      )

    // IMPORTANT:
    // Normal single quotes are used here.
    // No template literal/backtick.

    res.setHeader(
      'Content-Disposition',
      'inline; filename="' +
        safeFileName +
        '"'
    )

    return res.sendFile(
      path.resolve(
        resume.filePath
      )
    )
  } catch (error) {
    next(error)
  }
}

// =====================================================
// DOWNLOAD RESUME
// =====================================================

const downloadResume = async (
  req,
  res,
  next
) => {
  try {
    const resume =
      await Resume.findOne({
        user: req.user._id,
      })

    if (!resume) {
      return res.status(404).json({
        success: false,
        message:
          'Resume not found.',
      })
    }

    if (
      !resume.filePath ||
      !fs.existsSync(resume.filePath)
    ) {
      return res.status(404).json({
        success: false,
        message:
          'Resume file is missing from server.',
      })
    }

    return res.download(
      path.resolve(
        resume.filePath
      ),
      resume.originalName ||
        'resume.pdf'
    )
  } catch (error) {
    next(error)
  }
}

// =====================================================
// DELETE RESUME
// =====================================================

const deleteResume = async (
  req,
  res,
  next
) => {
  try {
    const resume =
      await Resume.findOne({
        user: req.user._id,
      })

    if (!resume) {
      return res.status(404).json({
        success: false,
        message:
          'Resume not found.',
      })
    }

    deleteFileIfExists(
      resume.filePath
    )

    await Resume.deleteOne({
      _id: resume._id,
    })

    return res.json({
      success: true,
      message:
        'Resume deleted successfully.',
    })
  } catch (error) {
    next(error)
  }
}

// =====================================================
// RE-ANALYZE RESUME
// =====================================================

const analyzeResume = async (
  req,
  res,
  next
) => {
  try {
    const resume =
      await Resume.findOne({
        user: req.user._id,
      })

    if (!resume) {
      return res.status(404).json({
        success: false,
        message:
          'Upload a resume first.',
      })
    }

    if (
      !resume.filePath ||
      !fs.existsSync(resume.filePath)
    ) {
      return res.status(404).json({
        success: false,
        message:
          'Resume file is missing from server.',
      })
    }

    const analysis =
      await analyzeResumeFile(
        resume.filePath,
        resume.mimeType
      )

    resume.status =
      'analyzed'

    resume.atsScore =
      analysis.atsScore

    resume.formattingScore =
      analysis.formattingScore

    resume.skills =
      analysis.skills

    resume.strengths = [
      ...new Set([
        ...analysis.strengths,
        ...analysis.formattingStrengths,
      ]),
    ]

    resume.recommendations = [
      ...new Set([
        ...analysis.recommendations,
        ...analysis.formattingRecommendations,
      ]),
    ]

    await resume.save()

    return res.json({
      success: true,
      message:
        'Resume analyzed successfully.',
      data:
        formatResume(resume),
    })
  } catch (error) {
    next(error)
  }
}

// =====================================================
// GET RESUME ANALYSIS
// =====================================================

const getResumeAnalysis = async (
  req,
  res,
  next
) => {
  try {
    const resume =
      await Resume.findOne({
        user: req.user._id,
      })

    if (!resume) {
      return res.status(404).json({
        success: false,
        message:
          'Resume not found.',
      })
    }

    return res.json({
      success: true,
      data: {
        atsScore:
          resume.atsScore || 0,

        formattingScore:
          resume.formattingScore || 0,

        status:
          resume.status,

        skills:
          resume.skills || [],

        strengths:
          resume.strengths || [],

        recommendations:
          resume.recommendations || [],
      },
    })
  } catch (error) {
    next(error)
  }
}

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  uploadResume,
  getResume,
  viewResume,
  downloadResume,
  deleteResume,
  analyzeResume,
  getResumeAnalysis,
}