import express from 'express'
import cors from 'cors'
import axios from 'axios'

const app = express()
const PORT = 3005

// CORS 和安全配置
app.use(cors({
  origin: ['http://localhost:3003', 'http://localhost:3000'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}))

// 添加安全头
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "default-src 'self'; worker-src blob:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; connect-src 'self' https://api.coze.cn");
  next()
})

app.use(express.json())

// 请求日志中间件
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`)
  console.log('Request body:', req.body)
  next()
})

// Coze API 配置
const COZE_CONFIG = {
  API_URL: 'https://api.coze.cn',
  BOT_ID: '7456723652143398963',
  TOKEN: 'pat_DAFNcM7kUKLI7I3JbbYFALleLJcik6CksPhgme4KOHx7QLjkx2u6OXYf4FyMzp28',
  HEADERS: {
    'Authorization': 'Bearer pat_DAFNcM7kUKLI7I3JbbYFALleLJcik6CksPhgme4KOHx7QLjkx2u6OXYf4FyMzp28',
    'Content-Type': 'application/json'
  }
}

// 开始面试
app.post('/api/interview/start', async (req, res) => {
  try {
    console.log('[Interview Start] Starting interview...')
    
    // 获取面试官信息
    const botInfoResponse = await axios.get(
      `${COZE_CONFIG.API_URL}/v1/bot/get_online_info?bot_id=${COZE_CONFIG.BOT_ID}`,
      { headers: COZE_CONFIG.HEADERS }
    )
    
    if (botInfoResponse.data.code !== 0) {
      throw new Error(botInfoResponse.data.msg || 'Failed to get bot info')
    }
    
    const botInfo = botInfoResponse.data.data
    
    // 发送初始消息
    const requestBody = {
      bot_id: COZE_CONFIG.BOT_ID,
      messages: [{
        role: 'user',
        content: botInfo.onboarding_info.prologue || '你好，我准备好开始面试了。'
      }],
      stream: false
    }
    
    const response = await axios.post(
      `${COZE_CONFIG.API_URL}/v2/chat/completions`,
      requestBody,
      { headers: COZE_CONFIG.HEADERS }
    )
    
    if (response.data.code !== 0) {
      throw new Error(response.data.msg || 'Failed to get chat response')
    }
    
    res.json({
      message: response.data.message.content,
      sessionId: `interview_${Date.now()}`,
      suggestedQuestions: botInfo.onboarding_info.suggested_questions || []
    })
  } catch (error) {
    console.error('[Interview Start] Error:', error)
    res.status(500).json({
      error: 'Failed to start interview',
      details: error.message
    })
  }
})

// 发送面试消息
app.post('/api/interview/message', async (req, res) => {
  try {
    const { message, sessionId } = req.body
    console.log('[Interview Message]', { message, sessionId })
    
    const requestBody = {
      bot_id: COZE_CONFIG.BOT_ID,
      messages: [{
        role: 'user',
        content: message
      }],
      stream: false
    }
    
    const response = await axios.post(
      `${COZE_CONFIG.API_URL}/v2/chat/completions`,
      requestBody,
      { headers: COZE_CONFIG.HEADERS }
    )
    
    if (response.data.code !== 0) {
      throw new Error(response.data.msg || 'Failed to get chat response')
    }
    
    res.json({
      message: response.data.message.content
    })
  } catch (error) {
    console.error('[Interview Message] Error:', error)
    res.status(500).json({
      error: 'Failed to send message',
      details: error.message
    })
  }
})

// 启动服务器
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${PORT}`)
})

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Closing server...')
  server.close(() => {
    console.log('Server closed')
    process.exit(0)
  })
})

// 错误处理
server.on('error', (error) => {
  console.error('Server error:', error)
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use`)
    process.exit(1)
  }
})

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Promise Rejection:', error)
}) 