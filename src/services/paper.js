import axios from 'axios'

const API_URL = 'https://api.deepseek.com'
const API_KEY = 'sk-1bb183d7bd70432e9f0deafbbfe89bb9'

// 添加保存和获取试卷历史的函数
const HISTORY_KEY = 'paper_history'
const FREE_HISTORY_LIMIT = 3

// 添加 DEEPSEEK_PROMPT 常量
const DEEPSEEK_PROMPT = `你是一个专业的编程考试出题专家。请按照以下格式生成试题：
{
  "title": "试卷标题",
  "difficulty": "难度",
  "duration": 时长(分钟),
  "totalScore": 总分值,
  "choice": [
    {
      "content": "题目内容",
      "options": {
        "A": "选项A",
        "B": "选项B",
        "C": "选项C",
        "D": "选项D"
      },
      "answer": "正确选项字母",
      "score": 分值
    }
  ],
  "programming": [
    {
      "content": "题目描述",
      "example": {
        "input": "示例输入",
        "output": "示例输出"
      },
      "answer": "参考代码",
      "score": 分值
    }
  ],
  "completion": [
    {
      "content": "题目内容，空格用___表示",
      "answer": "正确答案",
      "score": 分值
    }
  ],
  "truefalse": [
    {
      "content": "判断题目内容",
      "answer": true或false,
      "score": 分值
    }
  ],
  "shortanswer": [
    {
      "content": "题目内容",
      "answer": "参考答案要点",
      "score": 分值
    }
  ],
  "matching": [
    {
      "content": "题目说明",
      "leftItems": ["左边项目1", "左边项目2"],
      "rightItems": ["右边项目1", "右边项目2"],
      "answer": [
        [0, 1],  // 表示左边第1项匹配右边第2项
        [1, 0]   // 表示左边第2项匹配右边第1项
      ],
      "score": 分值
    }
  ]
}`

// 保存试卷到历史记录
export const savePaperToHistory = (paper) => {
  try {
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]')
    
    // 添加生成时间
    const paperWithTimestamp = {
      ...paper,
      generatedAt: new Date().toISOString()
    }
    
    // 限制免费用户的历史记录数量
    if (history.length >= FREE_HISTORY_LIMIT) {
      history.pop() // 移除最旧的记录
    }
    
    // 将新试卷添加到历史记录开头
    history.unshift(paperWithTimestamp)
    
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
  } catch (error) {
    console.error('Error saving paper to history:', error)
  }
}

// 获取历史记录
export const getPaperHistory = () => {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]')
  } catch (error) {
    console.error('Error getting paper history:', error)
    return []
  }
}

// 清除历史记录
export const clearPaperHistory = () => {
  localStorage.setItem(HISTORY_KEY, '[]')
}

export const generatePaper = async (params) => {
  try {
    // 设置默认的题目数量
    const defaultQuestionCounts = {
      choice: 3,
      programming: 1,
      completion: 0,
      truefalse: 0,
      shortanswer: 0,
      matching: 0
    }
    
    // 使用传入的 counts 参数，如果没有则使用默认值
    const questionCounts = {
      choice: params.counts?.choice || defaultQuestionCounts.choice,
      programming: params.counts?.programming || defaultQuestionCounts.programming,
      completion: params.counts?.completion || defaultQuestionCounts.completion,
      truefalse: params.counts?.truefalse || defaultQuestionCounts.truefalse,
      shortanswer: params.counts?.shortanswer || defaultQuestionCounts.shortanswer,
      matching: params.counts?.matching || defaultQuestionCounts.matching
    }

    let prompt = `请生成一份详细的编程能力测试试卷，要求如下：

    领域要求：${Array.isArray(params.domains) ? params.domains.map(domain => {
      const domainNames = {
        frontend: '前端开发',
        backend: '后端开发',
        database: '数据库',
        algorithm: '算法'
      }
      return domainNames[domain] || domain
    }).join('、') : '综合'}

    难度要求：${params.difficulty || '中等'}
    时长要求：${params.duration || 60}分钟
    总分要求：${params.totalScore || 100}分

    题型要求（必须严格按照以下数量生成）：
    {
      "choice": ${questionCounts.choice},
      "programming": ${questionCounts.programming},
      "completion": ${questionCounts.completion},
      "truefalse": ${questionCounts.truefalse},
      "shortanswer": ${questionCounts.shortanswer},
      "matching": ${questionCounts.matching}
    }

    请注意：
    1. 必须返回完整的 JSON 格式数据
    2. 每种题型必须严格按照指定数量生成
    3. 即使数量为 0 的题型也必须返回空数组
    4. 所有题目必须包含完整的题目内容、答案和分值
    5. 总分值必须符合要求
    6. 难度必须符合要求
    7. 题目内容必须与指定领域相关

    返回格式示例：
    {
      "title": "试卷标题",
      "difficulty": "${params.difficulty}",
      "duration": ${params.duration},
      "totalScore": ${params.totalScore},
      "choice": [], // 长度必须为 ${questionCounts.choice}
      "programming": [], // 长度必须为 ${questionCounts.programming}
      "completion": [], // 长度必须为 ${questionCounts.completion}
      "truefalse": [], // 长度必须为 ${questionCounts.truefalse}
      "shortanswer": [], // 长度必须为 ${questionCounts.shortanswer}
      "matching": [] // 长度必须为 ${questionCounts.matching}
    }`

    const response = await axios.post(`${API_URL}/v1/chat/completions`, {
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: DEEPSEEK_PROMPT
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 4000
    }, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    })

    const result = response.data.choices[0].message.content
    
    // 从响应中提取并解析 JSON
    const jsonMatch = result.match(/```json\s*([\s\S]*?)\s*```/) || result.match(/{[\s\S]*}/)
    
    if (!jsonMatch) {
      throw new Error('Invalid response format')
    }
    
    const paper = JSON.parse(jsonMatch[1] || jsonMatch[0])
    
    // 验证必要字段
    if (!paper.title || !paper.difficulty || !paper.duration || !paper.totalScore) {
      throw new Error('Missing required fields in paper')
    }

    // 验证题目数量
    const validateQuestionCount = (type) => {
      const required = questionCounts[type]
      const actual = paper[type]?.length || 0
      if (required !== actual) {
        throw new Error(`${type} question count mismatch: required ${required}, got ${actual}`)
      }
    }

    // 验证所有题型数量
    ['choice', 'programming', 'completion', 'truefalse', 'shortanswer', 'matching'].forEach(validateQuestionCount)

    // 保存到历史记录
    savePaperToHistory(paper)

    return paper
  } catch (error) {
    console.error('Error generating paper:', error)
    throw error
  }
}