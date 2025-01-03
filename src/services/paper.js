import axios from 'axios'

const API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY
const API_URL = import.meta.env.VITE_DEEPSEEK_API_URL

export const generatePaper = async (params) => {
  try {
    const response = await axios.post(API_URL, {
      messages: [
        {
          role: 'system',
          content: `你是一个专业的考试出题专家，请根据以下要求生成一份完整的试卷：
            - 考试时长：${params.duration}分钟
            - 总分：${params.totalScore}分
            - 难度：${params.difficulty}
            
            题型要求：
            ${Object.entries(params.questionTypes)
              .map(([type, config]) => 
                `- ${config.name}：${config.count}道，每题${config.score}分`
              ).join('\n')}
            
            请确保：
            1. 题目难度分布合理
            2. 每道题目都包含完整的题目描述和参考答案
            3. 选择题要包含4个选项
            4. 编程题要包含示例输入输出
            5. 总分符合要求
            
            请用${params.language === 'zh' ? '中文' : '英文'}回答，
            并以JSON格式返回，包含试卷信息和所有题目详情。`
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

    return response.data.choices[0].message.content
  } catch (error) {
    console.error('Paper generation error:', error)
    throw error
  }
} 