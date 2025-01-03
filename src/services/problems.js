import axios from 'axios'

const API_URL = '/api'

export const getProblem = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/problems/${id}`)
    return response.data
  } catch (error) {
    console.error('Get problem error:', error)
    throw new Error('Failed to load problem')
  }
}

export const runCode = async (params) => {
  try {
    const response = await axios.post(`${API_URL}/run-code`, params)
    return response.data
  } catch (error) {
    console.error('Run code error:', error)
    throw new Error('Failed to run code')
  }
}

export const submitSolution = async (params) => {
  try {
    const response = await axios.post(`${API_URL}/submit-solution`, params)
    return response.data
  } catch (error) {
    console.error('Submit solution error:', error)
    throw new Error('Failed to submit solution')
  }
} 