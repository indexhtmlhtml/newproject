import axios from 'axios'

const API_URL = 'https://api.deepseek.com'
const API_KEY = 'sk-1bb183d7bd70432e9f0deafbbfe89bb9'

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

export const generateProblems = async (params) => {
  try {
    const response = await axios.post(`${API_URL}/v1/chat/completions`, {
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: `你是一个专业的编程题目生成专家。请生成 ${params.count} 道${
            params.difficulty === 'easy' ? '简单' : 
            params.difficulty === 'medium' ? '中等' : '困难'
          }难度的${params.category}编程题目。

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
                "difficulty": "${params.difficulty}",
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