import axios from 'axios'

const API_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions'
const API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY

const DEEPSEEK_PROMPT = `你是一个专业的编程考试出题专家。请按照以下格式生成试题：

1. 选择题 (choice):
{
  "type": "choice",
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

2. 编程题 (programming):
{
  "type": "programming",
  "content": "题目描述",
  "example": {
    "input": "示例输入",
    "output": "示例输出"
  },
  "answer": "参考代码",
  "score": 分值
}

3. 填空题 (completion):
{
  "type": "completion",
  "content": "题目内容，空格用___表示",
  "answer": "正确答案",
  "score": 分值
}

4. 判断题 (truefalse):
{
  "type": "truefalse",
  "content": "判断题目内容",
  "answer": true或false,
  "score": 分值
}

5. 简答题 (shortanswer):
{
  "type": "shortanswer",
  "content": "题目内容",
  "answer": "参考答案要点",
  "score": 分值
}

6. 匹配题 (matching):
{
  "type": "matching",
  "content": "题目说明",
  "leftItems": ["左边项目1", "左边项目2", ...],
  "rightItems": ["右边项目1", "右边项目2", ...],
  "answer": [
    [0, 2],  // 表示左边第1项匹配右边第3项
    [1, 0],  // 表示左边第2项匹配右边第1项
    ...
  ],
  "score": 分值
}

请确保：

1. 所有题目难度符合要求
2. 答案明确且准确
3. 分值合理分配
4. JSON格式正确
5. 编程相关内容准确无误`

export const getProblem = async (id) => {
  try {
    const response = await axios.get(`/api/proxy/problem/${id}`)
    return response.data
  } catch (error) {
    console.error('Get problem error:', error)
    throw new Error('Failed to load problem')
  }
}

export const runCode = async (problemId, code, language) => {
  try {
    const response = await axios.post(`${API_URL}/problems/${problemId}/run`, {
      code,
      language
    })
    return response.data
  } catch (error) {
    console.error('Run code error:', error)
    throw error
  }
}

export const submitSolution = async (problemId, code, language) => {
  try {
    const response = await axios.post(`${API_URL}/problems/${problemId}/submit`, {
      code,
      language
    })
    return response.data
  } catch (error) {
    console.error('Submit solution error:', error)
    throw error
  }
}

export const generateProblems = async ({ category, count = 5, difficulty = 'random' }) => {
  try {
    const response = await axios.post('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
      model: 'qwen-plus',
      messages: [
        {
          role: 'system',
          content: '你是一个专业的编程题目生成器。请生成符合要求的编程题目，并确保返回严格的JSON格式。不要添加任何额外的标记或说明。'
        },
        {
          role: 'user',
          content: `请生成 ${count} 道${difficulty !== 'random' ? difficulty : ''}编程题目，类别是 ${category}。
            请严格按照以下 JSON 格式返回，不要添加任何额外的标记或说明：
          {
            "problems": [
              {
                  "id": "唯一ID",
                "title": "题目标题",
                  "content": "题目的详细描述",
                  "difficulty": "easy/medium/hard",
                "examples": [
                  {
                      "input": "输入示例",
                      "output": "输出示例",
                      "explanation": "解释说明（可选）"
                  }
                ],
                  "acceptanceRate": "通过率（0-100的数字）"
              }
            ]
          }`
        }
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json'
      }
    })

    const result = response.data.choices[0].message.content
    console.log('Raw AI response:', result)
    
    // 清理和解析 JSON
    const parseJSON = (text) => {
      // 移除所有可能的格式化字符
      const cleaned = text
        .replace(/```json\s*|\s*```/g, '')  // 移除代码块标记
        .replace(/[\u0000-\u001F]+/g, ' ')  // 移除控制字符
        .replace(/\n/g, ' ')                // 将换行转换为空格
        .replace(/\s+/g, ' ')               // 将多个空格合并为一个
        .replace(/,\s*([}\]])/g, '$1')      // 移除尾随逗号
        .trim()

      try {
        return JSON.parse(cleaned)
      } catch (e) {
        // 如果解析失败，尝试提取和修复 JSON
        const match = cleaned.match(/({[\s\S]*})/m)
        if (!match) throw new Error('无法找到有效的 JSON 内容')
        
        // 尝试修复常见的 JSON 格式问题
        let fixedJSON = match[1]
          .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":') // 确保属性名使用双引号
          .replace(/:\s*'([^']*?)'/g, ':"$1"')                 // 将单引号替换为双引号
          .replace(/,(\s*[}\]])/g, '$1')                       // 移除尾随逗号

        return JSON.parse(fixedJSON)
      }
    }

    // 解析 JSON
    const jsonData = parseJSON(result)
    
    if (!jsonData.problems || !Array.isArray(jsonData.problems)) {
      throw new Error('返回的数据格式不正确')
    }

    let problems = jsonData.problems

    // 确保每个题目都有必要的字段
    problems = problems.map(problem => ({
      id: problem.id || Date.now().toString(),
      title: problem.title,
      content: problem.content || problem.description,
      difficulty: problem.difficulty?.toLowerCase() || 'medium',
      examples: problem.examples || [],
      acceptanceRate: problem.acceptanceRate || generateRandomAcceptanceRate(problem.difficulty),
      constraints: problem.constraints || '',
      testCases: problem.testCases || []
    }))

    console.log('Processed problems:', problems)
    return { problems }
  } catch (error) {
    console.error('Generate problems failed:', error)
    if (error.response?.data?.error?.message) {
      throw new Error(error.response.data.error.message)
    }
    throw new Error('生成题目失败，请重试')
  }
}

// 生成随机通过率
function generateRandomAcceptanceRate(difficulty) {
  const ranges = {
    easy: { min: 65, max: 85 },
    medium: { min: 45, max: 65 },
    hard: { min: 25, max: 45 }
  }
  const range = ranges[difficulty?.toLowerCase()] || ranges.medium
  return (Math.random() * (range.max - range.min) + range.min).toFixed(1)
}

export const submitCodeToAI = async (problemId, code, language) => {
  try {
    console.log('Submitting code:', {
      problemId,
      language,
      codeLength: code.length,
      code: code.substring(0, 100) + '...' // 只显示部分代码
    })
    
    const response = await axios.post('https://www.coze.cn/open/api/v2/chat/completions', {
      bot_id: "7460331284762787877",
      messages: [
        {
          role: "system",
         content: "你是一个专业的代码评估助手，请严格按照指定的 JSON 格式返回评估结果。"
        },
        {
          role: "user",
          content: `Please evaluate the correctness of the following ${language} code.
Problem ID: ${problemId}
Code:
${code}

Please return the evaluation result in the following JSON format:
{
  "success": true/false,
  "score": score (0-100),
  "time": execution time (ms),
  "memory": memory consumption (MB),
  "message": "Evaluation Information",
  "testcases": [
    {
      "input": "Test Case Input",
      "output": "Code Output",
      "expected": "Expected Output",
      "passed": true/false
    }
  ]
}`
        }
      ],
      stream: false,
      temperature: 0.7,
      top_p: 0.95,
      presence_penalty: 0,
      frequency_penalty: 0
    }, {
      headers: {
        'Authorization': `Bearer pat_DAFNcM7kUKLI7I3JbbYFALleLJcik6CksPhgme4KOHx7QLjkx2u6OXYf4FyMzp28`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 30000
    })

    console.log('API Response:', {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      data: response.data
    })
    
    if (!response.data || typeof response.data !== 'object') {
      console.error('Invalid response format:', response.data)
      throw new Error('服务器返回格式错误')
    }
    
    return response.data
  } catch (error) {
    console.group('Submission Error Details')
    console.error('Error object:', {
      name: error.name,
      message: error.message,
      code: error.code,
      stack: error.stack?.split('\n')
    })
    console.error('Response details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      headers: error.response?.headers,
      data: error.response?.data
    })
    console.error('Request details:', {
      method: error.config?.method,
      url: error.config?.url,
      headers: error.config?.headers,
      data: error.config?.data
    })
    console.groupEnd()
    
    return {
      status: 'error',
      message: error.response?.data?.message || error.message || '提交失败，请稍后重试',
      testcases: []
    }
  }
}

export const generateProblem = async (params) => {
  try {
    // 打印请求信息
    console.log('Generating problem with params:', params)
    
    const requestBody = {
      model: 'qwen-plus',
      messages: [
        {
          role: 'system',
          content: 'You are a professional programming problem generator. Always use Chinese and return valid JSON.'
        },
        {
          role: 'user',
          content: `请生成一道中文编程题目，要求如下：
          1. 难度：${params.difficulty}
          2. 领域：${params.domain}
          3. 所有内容必须使用中文
          4. 返回格式必须是JSON：
          {
            "id": "唯一ID",
            "title": "题目标题",
            "content": "题目描述",
            "difficulty": "${params.difficulty}",
            "domain": "${params.domain}",
            "testcases": [
              {
                "input": "测试输入",
                "output": "期望输出"
              }
            ],
            "template": {
              "python": "Python代码模板",
              "javascript": "JavaScript代码模板",
              "java": "Java代码模板"
            }
          }`
        }
      ]
    }

    console.log('API Request:', {
      url: API_URL,
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: requestBody
    })

    const response = await axios.post(API_URL, requestBody, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    })

    console.log('API Response:', response.data)

    const result = response.data.choices[0].message.content.trim()
    try {
      // 清理可能的注释
      let cleanedResult = result
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/\/\/.*/g, '')
        .replace(/^\s*[\r\n]/gm, '')
        .replace(/,\s*([\]}])/g, '$1')
        .trim()

      // 尝试提取 JSON
      const jsonMatch = cleanedResult.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('Invalid response format')
      }

      const parsedResult = JSON.parse(jsonMatch[0])
      console.log('Parsed result:', parsedResult)
      return parsedResult
    } catch (error) {
      console.error('Error parsing problem:', error)
      console.error('Raw response:', result)
      throw new Error('Failed to parse problem')
    }
  } catch (error) {
    console.error('Error generating problem:', error)
    throw error
  }
}

export const getSolution = async (problemId) => {
  try {
    const response = await axios.post(API_URL, {
      model: 'qwen-plus',
      messages: [
        {
          role: 'system',
          content: 'You are a professional programming solution expert. Always use Chinese and return valid JSON.'
        },
        {
          role: 'user',
          content: `请用中文为题目 ${problemId} 生成详细的解题思路和代码实现，格式如下：
          {
            "approach": "解题思路说明",
            "complexity": {
              "time": "时间复杂度",
              "space": "空间复杂度"
            },
            "solutions": {
              "python": "Python代码实现",
              "javascript": "JavaScript代码实现",
              "java": "Java代码实现"
            }
          }`
        }
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    })

    console.log('API Response:', response.data)
    const result = response.data.choices[0].message.content.trim()
    try {
      // 清理可能的注释
      let cleanedResult = result
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/\/\/.*/g, '')
        .replace(/^\s*[\r\n]/gm, '')
        .replace(/,\s*([\]}])/g, '$1')
        .trim()

      // 尝试提取 JSON
      const jsonMatch = cleanedResult.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('Invalid response format')
      }

      return JSON.parse(jsonMatch[0])
    } catch (error) {
      console.error('Error parsing solution:', error)
      console.error('Raw response:', result)
      throw new Error('Failed to parse solution')
    }
  } catch (error) {
    console.error('Error getting solution:', error)
    throw error
  }
}

export const getTemplate = async (problemId, language) => {
  try {
    const response = await axios.post(API_URL, {
      model: 'qwen-plus',
      messages: [
        {
          role: 'system',
          content: 'You are a professional programming template generator.'
        },
        {
          role: 'user',
          content: `Please generate a ${language} language code template for problem ${problemId}, in the following format:
          {
            "template": "Code Template",
            "comments": "Comment Description"
          }`
        }
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    })

    const result = response.data.choices[0].message.content.trim()
    return JSON.parse(result)
  } catch (error) {
    console.error('Error getting template:', error)
    throw error
  }
} 