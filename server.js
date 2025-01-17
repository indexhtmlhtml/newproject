import express from 'express'
import cors from 'cors'
import axios from 'axios'
import WebSocket from 'ws'
import crypto from 'crypto'

const app = express()

// 添加更详细的 CORS 配置
app.use(cors({
  origin: ['http://localhost:3003', 'http://localhost:3000'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}))

app.use(express.json())

// 添加请求日志中间件
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`)
  next()
})

// 星火大模型配置
const SPARK_CONFIG = {
  APPID: '3b4054d4',
  API_SECRET: 'ZGUwZWM5NDNmOTdkMGIzYjFiMDQ5NjAw',
  API_KEY: 'c844821bb151c360b96840040731ca26',
  WS_URL: 'wss://spark-api.xf-yun.com/v2.1/chat'
}

// 生成鉴权URL
const getAuthUrl = () => {
  const host = 'spark-api.xf-yun.com'
  const path = '/v2.1/chat'
  const date = new Date().toUTCString()
  const algorithm = 'hmac-sha256'
  const headers = 'host date request-line'
  const requestLine = `GET ${path} HTTP/1.1`
  
  const signatureOrigin = `host: ${host}\ndate: ${date}\n${requestLine}`
  const signature = crypto
    .createHmac('sha256', SPARK_CONFIG.API_SECRET)
    .update(signatureOrigin)
    .digest('base64')
  
  const authorizationOrigin = `api_key="${SPARK_CONFIG.API_KEY}", algorithm="${algorithm}", headers="${headers}", signature="${signature}"`
  const authorization = Buffer.from(authorizationOrigin).toString('base64')
  
  return `${SPARK_CONFIG.WS_URL}?authorization=${authorization}&date=${encodeURI(date)}&host=${host}`
}

// 测试路由
app.get('/api/test', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' })
})

// AI 聊天路由
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body
    console.log('Received chat request:', messages)
    
    if (!messages || !Array.isArray(messages)) {
      throw new Error('Invalid messages format')
    }

    // 创建 WebSocket 连接
    const ws = new WebSocket(getAuthUrl())
    
    ws.on('open', () => {
      console.log('WebSocket connected')
      
      // 发送消息
      const requestData = {
        header: {
          app_id: SPARK_CONFIG.APPID
        },
        parameter: {
          chat: {
            domain: "general",
            temperature: 0.7,
            max_tokens: 2048
          }
        },
        payload: {
          message: {
            text: messages.map(msg => ({
              role: msg.role,
              content: msg.content
            }))
          }
        }
      }
      
      console.log('Sending to WebSocket:', JSON.stringify(requestData, null, 2))
      ws.send(JSON.stringify(requestData))
    })

    let responseText = ''
    
    ws.on('message', (data) => {
      const response = JSON.parse(data.toString())
      console.log('Received WebSocket message:', response)
      
      if (response.payload && response.payload.choices) {
        responseText += response.payload.choices.text || ''
      }
      if (response.header.code !== 0) {
        ws.close()
        res.status(500).json({
          error: 'Chat API Error',
          details: response.header.message
        })
      }
    })

    ws.on('close', () => {
      console.log('WebSocket closed')
      if (responseText) {
        res.json({
          choices: [{
            message: {
              role: 'assistant',
              content: responseText
            }
          }]
        })
      }
    })

    ws.on('error', (error) => {
      console.error('WebSocket error:', error)
      res.status(500).json({
        error: 'WebSocket error',
        message: error.message
      })
    })

  } catch (error) {
    console.error('Chat API Error:', error)
    res.status(500).json({
      error: 'Chat request failed',
      message: error.message
    })
  }
})

const PORT = 3002
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${PORT}`)
})

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Promise Rejection:', error)
}) 