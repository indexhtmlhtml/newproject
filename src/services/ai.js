import axios from 'axios'

const AI_API_BASE_URL = process.env.VUE_APP_AI_API_URL || 'http://localhost:3000/api'
const AI_API_KEY = process.env.VUE_APP_AI_API_KEY

const aiClient = axios.create({
  baseURL: AI_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${AI_API_KEY}`
  }
})

export const generateProblems = async (params) => {
  try {
    const response = await aiClient.post('/generate/problems', {
      category: params.category,
      count: params.count,
      difficulty: params.difficulty,
      language: params.language
    })
    return response.data
  } catch (error) {
    console.error('AI API Error:', error)
    throw error
  }
}

export const generateSolutions = async (params) => {
  try {
    const response = await aiClient.post('/generate/solutions', {
      problems: params.problems,
      language: params.language,
      includeExplanation: true
    })
    return response.data
  } catch (error) {
    console.error('AI API Error:', error)
    throw error
  }
}

export const generateHints = async (params) => {
  try {
    const response = await aiClient.post('/generate/hints', {
      problemId: params.problemId,
      difficulty: params.difficulty,
      count: params.count || 3
    })
    return response.data
  } catch (error) {
    console.error('AI API Error:', error)
    throw error
  }
} 