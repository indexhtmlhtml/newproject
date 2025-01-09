import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3005/api'

export const startInterview = async (interviewerId) => {
  try {
    const response = await axios.post(`${API_URL}/interview/start`, {
      interviewerId
    })
    return response.data
  } catch (error) {
    console.error('Start interview error:', error)
    throw error
  }
}

export const sendInterviewMessage = async (params) => {
  try {
    const response = await axios.post(`${API_URL}/interview/message`, params)
    return response.data
  } catch (error) {
    console.error('Send message error:', error)
    throw error
  }
} 