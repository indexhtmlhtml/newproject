import axios from 'axios'

const API_URL = 'https://api.deepseek.com'
const API_KEY = 'sk-1bb183d7bd70432e9f0deafbbfe89bb9'

export const generatePaper = async (params) => {
  try {
    // 构建更简单的 prompt
    let prompt = `请生成一份编程试卷，包含以下内容：

题型要求：
${Object.entries(params.counts)
  .filter(([_, count]) => count > 0)
  .map(([type, count]) => {
    const types = {
      choice: '选择题',
      programming: '编程题',
      completion: '填空题',
      truefalse: '判断题',
      shortanswer: '简答题',
      matching: '匹配题'
    }
    return `- ${types[type]}: ${count}道`
  })
  .join('\n')}

基本要求：
1. 总分：${params.totalScore}分
2. 时长：${params.duration}分钟
3. 难度：${params.difficulty}
4. 所有题目必须与编程相关
5. 分值合理分配

请严格按照以下JSON格式返回（不要添加任何其他内容）：

{
  "title": "编程能力测试",
  "duration": ${params.duration},
  "totalScore": ${params.totalScore},
  "difficulty": "${params.difficulty}",
  "choice": [
    {
      "content": "题目内容",
      "options": {
        "A": "选项A",
        "B": "选项B",
        "C": "选项C",
        "D": "选项D"
      },
      "answer": "A",
      "score": 5
    }
  ],
  "programming": [
    {
      "content": "题目描述",
      "example": {
        "input": "输入示例",
        "output": "输出示例"
      },
      "answer": "代码答案",
      "score": 10
    }
  ],
  "completion": [
    {
      "content": "题目内容___空格处___",
      "answer": "答案",
      "score": 5
    }
  ],
  "truefalse": [
    {
      "content": "判断题内容",
      "answer": true,
      "score": 5
    }
  ],
  "shortanswer": [
    {
      "content": "简答题内容",
      "answer": "答案要点",
      "score": 10
    }
  ],
  "matching": [
    {
      "content": "匹配题说明",
      "leftItems": ["左项1", "左项2"],
      "rightItems": ["右项1", "右项2"],
      "answer": [[0,1], [1,0]],
      "score": 10
    }
  ]
}`

    try {
      const response = await axios.post(`${API_URL}/v1/chat/completions`, {
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: "你是一个专业的编程考试出题专家。请严格按照给定的JSON格式生成试卷，不要添加任何额外的文本或标记。确保生成的是合法的JSON字符串。"
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.2, // 进一步降低随机性
        max_tokens: 4096,
        top_p: 0.95
      }, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      })

      const result = response.data.choices[0].message.content
      console.log('Raw API response:', result)

      // 尝试直接解析返回的内容
      try {
        const paper = JSON.parse(result)
        
        // 验证基本结构
        if (!paper || typeof paper !== 'object') {
          throw new Error('Invalid paper structure')
        }

        // 验证必需字段
        const requiredFields = ['title', 'duration', 'totalScore', 'difficulty']
        for (const field of requiredFields) {
          if (!(field in paper)) {
            throw new Error(`Missing required field: ${field}`)
          }
        }

        // 验证题型数量
        Object.entries(params.counts).forEach(([type, count]) => {
          if (count > 0 && (!paper[type] || !Array.isArray(paper[type]) || paper[type].length !== count)) {
            throw new Error(`Invalid ${type} questions count: expected ${count}, got ${paper[type]?.length || 0}`)
          }
        })

        return paper

      } catch (parseError) {
        console.error('JSON parse error:', parseError)
        console.error('Raw content:', result)
        throw new Error('Failed to parse paper JSON')
      }

    } catch (axiosError) {
      console.error('API call failed:', axiosError.response?.data || axiosError.message)
      throw new Error('Failed to generate paper')
    }

  } catch (error) {
    console.error('Paper generation error:', error)
    throw error
  }
} 