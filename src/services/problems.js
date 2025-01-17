import axios from 'axios'

const API_URL = 'https://api.deepseek.com'
const API_KEY = 'sk-1bb183d7bd70432e9f0deafbbfe89bb9'

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

export const generateProblems = async (params) => {
  // 如果没有指定难度或选择了随机，则随机选择难度
  const difficulties = ['easy', 'medium', 'hard']
  const getRandomDifficulty = () => {
    const index = Math.floor(Math.random() * difficulties.length)
    return difficulties[index]
  }

  try {
    const response = await axios.post(`${API_URL}/v1/chat/completions`, {
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: `你是一个专业的编程题目生成专家。请生成 ${params.count} 道${
            !params.difficulty || params.difficulty === 'random' ? '随机' :
            params.difficulty === 'easy' ? '简单' :
            params.difficulty === 'medium' ? '中等' : '困难'
          }难度的${params.category}编程题目。
          ${!params.difficulty || params.difficulty === 'random' ? 
            '请确保生成的题目难度分布均匀，包含简单、中等和困难题目。' : ''}

        
          每道题目必须包含：
          1. 标题
          2. 详细描述
          3. 输入输出格式说明
          4. 示例输入输出
          5. 参考答案代码
          
          请以JSON格式返回，格式如下：
          {
            "problems": [
              {
                "title": "题目标题",
                "description": "题目描述",
                "difficulty": "${!params.difficulty || params.difficulty === 'random' ? 
                  getRandomDifficulty() : params.difficulty}",
                "category": "${params.category}",
                "examples": [
                  {
                    "input": "示例输入",
                    "output": "示例输出"
                  }
                ],
                "solution": "参考答案代码"
              }
            ]
          }`
        }
      ],
      temperature: 0.7,
      max_tokens: 4096
    }, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    })

    const result = response.data.choices[0].message.content
    console.log('Raw result:', result)
    
    // 从响应中提取并解析 JSON
    const jsonStr = result.match(/```json\s*([\s\S]*?)\s*```/) || 
                   result.match(/{[\s\S]*}/)
    
    if (!jsonStr) {
      throw new Error('No JSON found in response')
    }
    
    const jsonData = JSON.parse(jsonStr[1] || jsonStr[0])
    console.log('Parsed data:', jsonData)
    
    if (!jsonData.problems || !Array.isArray(jsonData.problems)) {
      throw new Error('Invalid problems format')
    }
    
    return { problems: jsonData.problems }
  } catch (error) {
    console.error('Generate problems error:', error)
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error.message)
    }
    throw new Error('Failed to generate problems')
  }
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
          content: `请评估以下${language}代码的正确性。
问题ID: ${problemId}
代码:
${code}

请按照以下JSON格式返回评估结果：
{
  "success": true/false,
  "score": 分数(0-100),
  "time": 运行时间(ms),
  "memory": 内存消耗(MB),
  "message": "评估信息",
  "testcases": [
    {
      "input": "测试用例输入",
      "output": "代码输出",
      "expected": "期望输出",
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