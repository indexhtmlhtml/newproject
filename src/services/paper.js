import axios from 'axios'

const API_KEY = 'sk-1bb183d7bd70432e9f0deafbbfe89bb9'
const API_URL = 'https://api.deepseek.com/v1/chat/completions'

// 辅助函数：清理 Markdown 中的 JSON
const extractJSON = (text) => {
  // 移除 Markdown 代码块标记
  const jsonMatch = text.match(/```(?:json)?\s*({[\s\S]*?})\s*```/) || 
                   text.match(/({[\s\S]*})/)
  if (jsonMatch) {
    return jsonMatch[1].trim()
  }
  throw new Error('无法从响应中提取 JSON 数据')
}

export const generatePaper = async (params) => {
  try {
    console.log('Generating paper with params:', params)

    const response = await axios.post(API_URL, {
      messages: [
        {
          role: 'system',
          content: `你是一个专业的编程考试出题专家。请根据以下要求生成一份完整的编程试卷：
            - 考试时长：${params.duration}分钟
            - 总分：${params.totalScore}分
            - 难度：${params.difficulty}
            
            题型要求：
            ${Object.entries(params.questionTypes)
              .filter(([_, config]) => config.count > 0)
              .map(([type, config]) => 
                `- ${type === 'choice' ? '选择题' : 
                   type === 'programming' ? '编程题' : '填空题'}：${config.count}道，每题${config.score}分`
              ).join('\n')}
            
            请确保：
            1. 题目难度符合要求，${params.difficulty === 'easy' ? '使用基础概念和简单逻辑' : 
               params.difficulty === 'medium' ? '包含中等复杂度的算法和数据结构' : 
               '涉及高级算法和系统设计'}
            2. 选择题必须包含4个选项(A/B/C/D)，且只有一个正确答案
            3. 编程题必须包含：
               - 清晰的问题描述
               - 输入输出格式说明
               - 示例输入输出
               - 完整的参考答案（包含代码）
            4. 填空题应该简洁明确，答案应该是关键的代码片段或概念
            5. 每道题目都要包含分值标注
            
            请用${params.language === 'zh' ? '中文' : '英文'}回答，
            并以JSON格式返回如下结构的数据（不要包含任何其他说明文字）：
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
        }
      ],
      model: 'deepseek-coder',
      temperature: 0.7,
      max_tokens: 4096
    }, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    })

    console.log('API Response:', response.data)

    try {
      const result = response.data.choices[0].message.content
      console.log('Raw result:', result)

      // 从响应中提取并解析 JSON
      const jsonStr = extractJSON(result)
      console.log('Extracted JSON string:', jsonStr)
      
      const paper = JSON.parse(jsonStr)
      console.log('Parsed paper:', paper)
      
      // 验证试卷格式
      if (!paper.title) {
        throw new Error('缺少试卷标题')
      }

      // 验证每种题型的数量
      Object.entries(params.questionTypes)
        .filter(([_, config]) => config.count > 0)
        .forEach(([type, config]) => {
          const questions = paper[type] || []
          if (questions.length !== config.count) {
            throw new Error(`${type === 'choice' ? '选择题' : 
                            type === 'programming' ? '编程题' : '填空题'}数量不符合要求：
                            期望 ${config.count} 题，实际 ${questions.length} 题`)
          }
        })
      
      return paper
    } catch (error) {
      console.error('Failed to parse paper result:', error)
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      })
      throw new Error(`试卷格式错误：${error.message}`)
    }
  } catch (error) {
    console.error('Paper generation error:', error)
    console.error('Error details:', {
      response: error.response?.data,
      request: error.request,
      message: error.message
    })
    
    if (error.response) {
      const message = error.response.data.error?.message || 
                     error.response.data.error || 
                     '生成试卷失败，请重试'
      throw new Error(`API错误：${message}`)
    } else if (error.request) {
      throw new Error('无法连接到服务器，请检查网络连接')
    } else {
      throw new Error(`请求错误：${error.message}`)
    }
  }
} 