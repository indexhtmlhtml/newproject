import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3005/api'

// 创建 axios 实例
const interviewClient = axios.create({
  baseURL: API_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 错误处理函数
const handleAxiosError = (error) => {
  if (error.code === 'ECONNABORTED') {
    throw new Error('连接超时，请检查网络连接')
  }
  if (error.response) {
    const status = error.response.status
    switch (status) {
      case 404:
        throw new Error('面试服务未找到，请确认服务器是否正常运行')
      case 500:
        throw new Error('面试服务器内部错误，请稍后重试')
      default:
        throw new Error(`服务器响应错误 (${status})`)
    }
  }
  if (error.request) {
    throw new Error('无法连接到面试服务器，请检查网络连接')
  }
  throw new Error(`未知错误: ${error.message}`)
}

// 开始面试
export const startInterview = async (interviewerId) => {
  try {
    console.log('Starting interview with interviewer:', interviewerId)
    const response = await interviewClient.post('/interview/start', {
      interviewerId,
      bot_id: '7456723652143398963'
    })
    
    if (!response.data || !response.data.message) {
      throw new Error('服务器返回数据格式错误')
    }
    
    return response.data
  } catch (error) {
    console.error('Interview start error:', error)
    handleAxiosError(error)
  }
}

// 发送消息
export const sendInterviewMessage = async (params) => {
  try {
    console.log('Sending message:', params)
    const response = await interviewClient.post('/interview/message', {
      ...params,
      bot_id: '7456723652143398963'
    })
    
    if (!response.data || !response.data.message) {
      throw new Error('服务器返回数据格式错误')
    }
    
    return response.data
  } catch (error) {
    console.error('Send message error:', error)
    handleAxiosError(error)
  }
} 