/**
 * CareerBridge AI Service
 * Google Gemini using @google/genai
 *
 * Fast streaming version
 */

const { GoogleGenAI } = require('@google/genai')

const getApiKey = () => {
  return process.env.GEMINI_API_KEY
}

const getModel = () => {
  // Gemini 3.6 Flash is stable and supports minimal thinking.
  return process.env.GEMINI_MODEL || 'gemini-3.6-flash'
}

const getAI = () => {
  const apiKey = getApiKey()

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured')
  }

  return new GoogleGenAI({
    apiKey,
  })
}

/**
 * Detect very simple greetings.
 *
 * This avoids an unnecessary Gemini API call for:
 * hello / hi / hey etc.
 *
 * Result: instant response.
 */
const isSimpleGreeting = (message) => {
  const text = message
    .trim()
    .toLowerCase()
    .replace(/[!?.,]/g, '')

  const greetings = [
    'hello',
    'hi',
    'hey',
    'hii',
    'hiii',
    'helo',
    'good morning',
    'good afternoon',
    'good evening',
  ]

  return greetings.includes(text)
}

/**
 * Instant greeting
 */
const getGreeting = (user) => {
  const name = user?.name || 'there'

  return `Hello ${name}! 👋

I'm your CareerBridge AI Assistant.

I can help you with:
• Resume improvement
• ATS optimization
• Interview preparation
• Job search strategies
• Career planning
• MERN / React preparation

What would you like help with today?`
}

/**
 * Normal non-streaming Gemini call.
 *
 * Used for resume analysis.
 */
const callGemini = async (prompt, options = {}) => {
  const ai = getAI()

  const response = await ai.models.generateContent({
    model: getModel(),
    contents: prompt,

    config: {
      maxOutputTokens: options.maxOutputTokens || 300,

      thinkingConfig: {
        thinkingLevel: 'minimal',
      },

      ...(options.responseMimeType
        ? {
            responseMimeType: options.responseMimeType,
          }
        : {}),
    },
  })

  const text = response?.text

  if (!text) {
    throw new Error('Gemini returned an empty response')
  }

  return text.trim()
}

/**
 * Fast streaming Career Assistant.
 *
 * onChunk receives text immediately as Gemini generates it.
 */
const chatStream = async (message, user, onChunk) => {
  if (!getApiKey()) {
    const fallback = `Hi ${user?.name || 'there'}!

Gemini AI is not configured.

Please add GEMINI_API_KEY to Backend/.env.`

    onChunk(fallback)
    return
  }

  /**
   * Instant response for simple greetings.
   */
  if (isSimpleGreeting(message)) {
    onChunk(getGreeting(user))
    return
  }

  const ai = getAI()

  const systemInstruction = `
You are CareerBridge AI, a professional career assistant.

Candidate:
Name: ${user?.name || 'User'}
Role: ${user?.role || 'candidate'}
Skills: ${
    Array.isArray(user?.skills) && user.skills.length
      ? user.skills.join(', ')
      : 'Not provided'
  }

Rules:
- Answer the user's question directly.
- Be concise and useful.
- Prefer 100-180 words.
- Use simple professional language.
- For programming questions, provide technically correct guidance.
- For resume questions, provide ATS-friendly advice.
- For interview questions, give practical preparation.
- For career questions, give actionable steps.
- Do not invent candidate information.
- Do not unnecessarily repeat the question.
`

  const prompt = `
${systemInstruction}

User question:
${message}

Answer now.
`

  try {
    const stream = await ai.models.generateContentStream({
      model: getModel(),
      contents: prompt,

      config: {
        maxOutputTokens: 350,

        // Reduce unnecessary reasoning time.
        thinkingConfig: {
          thinkingLevel: 'minimal',
        },
      },
    })

    let hasReceivedText = false

    for await (const chunk of stream) {
      const text = chunk?.text

      if (text) {
        hasReceivedText = true
        onChunk(text)
      }
    }

    if (!hasReceivedText) {
      throw new Error('Gemini returned an empty response')
    }
  } catch (error) {
    console.error(
      'Gemini streaming error:',
      error?.message || error
    )

    throw error
  }
}

/**
 * Normal chat method.
 *
 * Kept for compatibility with existing controller/routes.
 */
const chat = async (message, user) => {
  let result = ''

  await chatStream(
    message,
    user,
    (chunk) => {
      result += chunk
    }
  )

  return result || 'I could not generate a response.'
}

/**
 * Resume Analysis
 */
const analyzeResumeText = async (user) => {
  const detectedSkills =
    Array.isArray(user?.skills)
      ? user.skills
      : []

  let atsScore = 40

  if (user?.name) atsScore += 5
  if (user?.bio) atsScore += 10

  if (detectedSkills.length >= 3) {
    atsScore += 15
  }

  if (detectedSkills.length >= 6) {
    atsScore += 10
  }

  if (
    Array.isArray(user?.experience) &&
    user.experience.length > 0
  ) {
    atsScore += 10
  }

  if (
    Array.isArray(user?.education) &&
    user.education.length > 0
  ) {
    atsScore += 10
  }

  atsScore = Math.min(atsScore, 100)

  const strengths = []
  const improvements = []

  if (detectedSkills.length > 0) {
    strengths.push('Technical skills are listed')
  } else {
    improvements.push(
      'Add your technical skills to your profile'
    )
  }

  if (user?.bio) {
    strengths.push('Professional summary present')
  } else {
    improvements.push(
      'Add a professional summary/bio'
    )
  }

  if (
    Array.isArray(user?.experience) &&
    user.experience.length > 0
  ) {
    strengths.push('Work experience included')
  } else {
    improvements.push(
      'Add your work experience'
    )
  }

  if (
    Array.isArray(user?.education) &&
    user.education.length > 0
  ) {
    strengths.push('Education details present')
  } else {
    improvements.push(
      'Add your education details'
    )
  }

  /**
   * Gemini resume suggestions
   */
  if (getApiKey()) {
    try {
      const prompt = `
You are an expert ATS resume reviewer.

Analyze this candidate profile.

Name:
${user?.name || 'Not provided'}

Skills:
${detectedSkills.join(', ') || 'None'}

Bio:
${user?.bio || 'Not provided'}

Experience:
${JSON.stringify(user?.experience || [])}

Education:
${JSON.stringify(user?.education || [])}

Give exactly 3 practical resume improvement tips.

Return ONLY valid JSON:

{
  "tips": [
    "tip 1",
    "tip 2",
    "tip 3"
  ]
}
`

      const aiResponse = await callGemini(prompt, {
        maxOutputTokens: 250,
        responseMimeType: 'application/json',
      })

      const cleanResponse = aiResponse
        .replace(/```json/gi, '')
        .replace(/```/g, '')
        .trim()

      const parsed = JSON.parse(cleanResponse)

      if (
        parsed &&
        Array.isArray(parsed.tips)
      ) {
        improvements.push(...parsed.tips)
      }
    } catch (error) {
      console.error(
        'Gemini resume analysis error:',
        error?.message || error
      )
    }
  }

  return {
    atsScore,
    skills: detectedSkills,
    strengths,
    improvements,
  }
}

module.exports = {
  chat,
  chatStream,
  analyzeResumeText,
}