import express from 'express'
import cors from 'cors'
import WebSocket from 'ws'
import crypto from 'crypto'

const app = express()

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
    
    let isResponseSent = false

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
      try {
        const response = JSON.parse(data.toString())
        console.log('Received WebSocket message:', response)
        
        if (response.payload && response.payload.choices) {
          responseText += response.payload.choices.text || ''
        }
        if (response.header.code !== 0) {
          ws.close()
          if (!isResponseSent) {
            isResponseSent = true
            res.status(500).json({
              error: 'Chat API Error',
              details: response.header.message
            })
          }
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error)
      }
    })

    // 添加超时处理
    const timeout = setTimeout(() => {
      if (!isResponseSent) {
        isResponseSent = true
        ws.close()
        res.status(504).json({
          error: 'Timeout',
          message: 'WebSocket connection timed out'
        })
      }
    }, 30000) // 30 秒超时

    ws.on('close', () => {
      clearTimeout(timeout)
      console.log('WebSocket closed')
      if (responseText && !isResponseSent) {
        isResponseSent = true
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
      clearTimeout(timeout)
      console.error('WebSocket error:', error)
      if (!isResponseSent) {
        isResponseSent = true
        res.status(500).json({
          error: 'WebSocket error',
          message: error.message
        })
      }
    })

  } catch (error) {
    console.error('Chat API Error:', error)
    res.status(500).json({
      error: 'Chat request failed',
      message: error.message
    })
  }
})

// 生成试卷路由
app.post('/api/generate-paper', async (req, res) => {
  try {
    const { duration, totalScore, difficulty, questionTypes, language } = req.body
    console.log('Received paper generation request:', req.body)
    
    // 创建 WebSocket 连接
    const ws = new WebSocket(getAuthUrl())
    
    let isResponseSent = false

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
            max_tokens: 4096
          }
        },
        payload: {
          message: {
            text: [{
              role: 'system',
              content: `你是一个专业的编程考试出题专家。请根据以下要求生成一份完整的编程试卷：
                - 考试时长：${duration}分钟
                - 总分：${totalScore}分
                - 难度：${difficulty}
                
                题型要求：
                ${Object.entries(questionTypes)
                  .map(([type, config]) => 
                    `- ${config.name}：${config.count}道，每题${config.score}分`
                  ).join('\n')}
                
                请确保：
                1. 题目难度符合要求，${difficulty === 'easy' ? '使用基础概念和简单逻辑' : 
                   difficulty === 'medium' ? '包含中等复杂度的算法和数据结构' : 
                   '涉及高级算法和系统设计'}
                2. 选择题必须包含4个选项(A/B/C/D)，且只有一个正确答案
                3. 编程题必须包含：
                   - 清晰的问题描述
                   - 输入输出格式说明
                   - 示例输入输出
                   - 完整的参考答案（包含代码）
                4. 填空题应该简洁明确，答案应该是关键的代码片段或概念
                5. 每道题目都要包含分值标注
                
                请用${language === 'zh' ? '中文' : '英文'}回答，
                并以如下JSON格式返回：
                {
                  "title": "试卷标题",
                  "choice": [
                    {
                      "content": "题目描述",
                      "score": 分值,
                      "options": {
                        "A": "选项A",
                        "B": "选项B",
                        "C": "选项C",
                        "D": "选项D"
                      },
                      "answer": "正确选项字母"
                    }
                  ],
                  "programming": [
                    {
                      "content": "题目描述",
                      "score": 分值,
                      "example": {
                        "input": "示例输入",
                        "output": "示例输出"
                      },
                      "answer": "参考答案代码"
                    }
                  ],
                  "completion": [
                    {
                      "content": "题目描述",
                      "score": 分值,
                      "answer": "答案"
                    }
                  ]
                }`
            }]
          }
        }
      }
      
      console.log('Sending to WebSocket:', JSON.stringify(requestData, null, 2))
      ws.send(JSON.stringify(requestData))
    })

    let responseText = ''
    
    ws.on('message', (data) => {
      try {
        const response = JSON.parse(data.toString())
        console.log('Received WebSocket message:', response)
        
        if (response.payload && response.payload.choices) {
          responseText += response.payload.choices.text || ''
        }
        if (response.header.code !== 0) {
          ws.close()
          if (!isResponseSent) {
            isResponseSent = true
            res.status(500).json({
              error: 'Paper generation error',
              details: response.header.message
            })
          }
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error)
      }
    })

    ws.on('close', () => {
      console.log('WebSocket closed')
      if (responseText && !isResponseSent) {
        try {
          const paper = JSON.parse(responseText)
          isResponseSent = true
          res.json(paper)
        } catch (error) {
          console.error('Failed to parse paper:', error)
          if (!isResponseSent) {
            isResponseSent = true
            res.status(500).json({
              error: 'Invalid paper format',
              details: error.message
            })
          }
        }
      }
    })

    ws.on('error', (error) => {
      console.error('WebSocket error:', error)
      if (!isResponseSent) {
        isResponseSent = true
        res.status(500).json({
          error: 'WebSocket error',
          message: error.message
        })
      }
    })

  } catch (error) {
    console.error('Paper generation error:', error)
    res.status(500).json({
      error: 'Paper generation failed',
      message: error.message
    })
  }
})

// 添加错误处理中间件
app.use((err, req, res, next) => {
  console.error('Global error handler:', err)
  res.status(500).json({
    error: 'Server error',
    message: err.message
  })
})

// 处理 404 错误
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.url}`
  })
})

// 模拟题目数据
const problems = {
  '1': {
    id: '1',
    title: '两数之和',
    description: `给定一个整数数组 nums 和一个目标值 target，请你在该数组中找出和为目标值的那两个整数，并返回他们的数组下标。

你可以假设每种输入只会对应一个答案。但是，数组中同一个元素不能使用两遍。

**示例:**

\`\`\`
给定 nums = [2, 7, 11, 15], target = 9
因为 nums[0] + nums[1] = 2 + 7 = 9
所以返回 [0, 1]
\`\`\``,
    difficulty: 'easy',
    examples: [
      {
        input: '[2, 7, 11, 15]\n9',
        output: '[0, 1]'
      },
      {
        input: '[3, 2, 4]\n6',
        output: '[1, 2]'
      }
    ],
    template: `def twoSum(nums, target):
    # 在这里写下你的代码
    pass

# 测试代码
nums = [2, 7, 11, 15]
target = 9
print(twoSum(nums, target))`,
    testCases: [
      {
        input: {
          nums: [2, 7, 11, 15],
          target: 9
        },
        expected: [0, 1]
      },
      {
        input: {
          nums: [3, 2, 4],
          target: 6
        },
        expected: [1, 2]
      }
    ]
  }
  // 可以添加更多题目...
}

// 获取题目详情
app.get('/api/problems/:id', (req, res) => {
  const problem = problems[req.params.id]
  if (problem) {
    res.json(problem)
  } else {
    res.status(404).json({ error: 'Problem not found' })
  }
})

// 运行代码
app.post('/api/run-code', (req, res) => {
  const { problemId, code, language } = req.body
  const problem = problems[problemId]

  if (!problem) {
    return res.status(404).json({ error: 'Problem not found' })
  }

  // 模拟代码运行结果
  const results = problem.testCases.map((testCase, index) => ({
    status: Math.random() > 0.5 ? 'success' : 'error',
    input: JSON.stringify(testCase.input),
    expected: JSON.stringify(testCase.expected),
    actual: JSON.stringify([0, 1]),
    error: null
  }))

  res.json({ results })
})

// 提交解答
app.post('/api/submit-solution', (req, res) => {
  const { problemId, code, language } = req.body
  const problem = problems[problemId]

  if (!problem) {
    return res.status(404).json({ error: 'Problem not found' })
  }

  // 模拟提交结果
  res.json({
    success: true,
    message: '提交成功！',
    results: problem.testCases.map((testCase, index) => ({
      status: 'success',
      input: JSON.stringify(testCase.input),
      expected: JSON.stringify(testCase.expected),
      actual: JSON.stringify([0, 1])
    }))
  })
})

const PORT = 3005
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${PORT}`)
})

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Promise Rejection:', error)
}) 