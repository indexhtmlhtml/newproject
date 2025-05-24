import axios from 'axios'

const API_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions'
const API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY

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

    let prompt = `请生成一份详细的中文编程能力测试试卷，要求如下：

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

    const response = await axios.post(API_URL, {
      model: 'qwen-plus',
      messages: [
        {
          role: "system",
          content: "You are a professional programming exam expert. Always return valid JSON without any comments."
        },
        {
          role: 'user',
          content: `${DEEPSEEK_PROMPT}\n\n${prompt}\n\n注意：请返回纯 JSON 格式，不要包含任何注释或其他内容。`
        }
      ],
    }, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    })

    console.log('API Request:', {
      model: 'qwen-plus',
      messages: [
        { role: 'system' },
        { role: 'user' }
      ]
    })

    const result = response.data.choices[0].message.content.trim()
    console.log('Raw AI response:', result)

    try {
      // 清理可能的注释
      let cleanedResult = result
        .replace(/\/\*[\s\S]*?\*\//g, '') // 移除多行注释
        .replace(/\/\/.*/g, '')           // 移除单行注释
        .replace(/^\s*[\r\n]/gm, '')      // 移除空行
        .replace(/,\s*([\]}])/g, '$1')    // 移除尾随逗号
        .trim()

      // 尝试提取 JSON
      const jsonMatch = cleanedResult.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        console.error('No valid JSON found in response')
        throw new Error('Invalid response format')
      }

      const jsonStr = jsonMatch[0]
      console.log('Cleaned JSON:', jsonStr)

      // 解析 JSON
      const paper = JSON.parse(jsonStr)

      // 验证必要字段
      if (!paper.title || !paper.difficulty || !paper.duration || !paper.totalScore) {
        throw new Error('Missing required fields in paper')
      }

      // 验证题目数量
      Object.entries(questionCounts).forEach(([type, count]) => {
        if (!Array.isArray(paper[type]) || paper[type].length !== count) {
          throw new Error(`Invalid ${type} question count`)
        }
      })

      // 保存到历史记录
      savePaperToHistory(paper)
      
      return paper
    } catch (error) {
      console.error('Error parsing AI response:', error)
      console.error('Raw response:', result)
      throw new Error('Failed to generate valid paper format')
    }
  } catch (error) {
    console.error('Error generating paper:', error)
    throw error
  }
}

// 评分函数
export const gradePaperAnswers = async (paper, answers) => {
  try {
    let totalScore = 0;
    const scores = {
      choice: 0,
      programming: 0,
      completion: 0,
      truefalse: 0,
      shortanswer: 0,
      matching: 0
    };

    // 评分选择题、判断题等客观题
    ['choice', 'truefalse', 'completion'].forEach(type => {
      if (paper[type] && answers[type]) {
        paper[type].forEach((question, index) => {
          if (answers[type][index] === question.answer) {
            scores[type] += question.score;
            totalScore += question.score;
          }
        });
      }
    });
    
    // 单独处理匹配题，因为需要比较数组
    if (paper.matching && answers.matching) {
      paper.matching.forEach((question, index) => {
        // 检查用户答案是否正确
        // 新规则：匹配题必须全对才得分，错一个就得0分
        let isFullyCorrect = true;
        
        // 确保用户答案有效
        if (Array.isArray(answers.matching[index]) && 
            answers.matching[index].length === question.answer.length) {
          
          // 检查每个匹配是否正确
          for (let leftIndex = 0; leftIndex < question.answer.length; leftIndex++) {
            // 在匹配题中，answer格式为 [[leftIndex, rightIndex], ...]
            const correctRightIndex = question.answer.find(pair => pair[0] === leftIndex)?.[1];
            const userRightIndex = answers.matching[index][leftIndex];
            
            // 如果任何一个匹配不正确，则整个题得0分
            if (userRightIndex !== correctRightIndex) {
              isFullyCorrect = false;
              break;
            }
          }
        } else {
          // 用户答案格式无效
          isFullyCorrect = false;
        }
        
        // 全对才得分
        if (isFullyCorrect) {
          scores.matching += question.score;
          totalScore += question.score;
        }
      });
    }

    // 使用 AI 评分编程题
    if (paper.programming && answers.programming) {
      for (let i = 0; i < paper.programming.length; i++) {
        const question = paper.programming[i];
        const userAnswer = answers.programming[i];
        
        if (!userAnswer) continue;

        const response = await axios.post(API_URL, {
          model: 'qwen-plus',
          messages: [
            {
              role: "system",
              content: "You are a professional programming grading assistant. Always respond in JSON format."
            },
            {
              role: 'user',
              content: `请以JSON格式评分，格式如下：
              {
                "score": 分数(0-10),
                "feedback": "评分反馈"
              }
              
              评分标准：
              1. 代码功能完整性（50%）：代码是否实现了所需功能
              2. 代码效率（20%）：时间和空间复杂度是否合理
              3. 代码规范性（20%）：命名、格式是否规范
              4. 代码可读性（10%）：代码是否易于理解
              
              题目描述：${question.content}
              参考答案：${question.answer}
              学生答案：${userAnswer}
              题目分值：10分`
            }
          ],
        }, {
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
          }
        })

        let content = response.data.choices[0].message.content.trim();
        console.log('Raw AI response:', content);

        try {
          // 尝试从响应中提取 JSON
          const jsonMatch = content.match(/\{[\s\S]*\}/);
          if (!jsonMatch) {
            console.error('No JSON found in response');
            throw new Error('Invalid response format');
          }
          
          const jsonStr = jsonMatch[0].trim();
          console.log('Extracted JSON:', jsonStr);
          
          const result = JSON.parse(jsonStr);
          
          // 验证结果格式
          if (typeof result.score !== 'number' || typeof result.feedback !== 'string') {
            throw new Error('Invalid result format');
          }

          const score = Math.min(Math.max(0, result.score), 10);
          scores.programming += score;
          totalScore += score;
          
          answers.programming[i] = {
            code: userAnswer,
            score: score,
            feedback: result.feedback
          };
        } catch (error) {
          console.error('Error processing AI response:', error);
          // 使用默认评分
          answers.programming[i] = {
            code: userAnswer,
            score: 0,
            feedback: "评分系统出错，请重试"
          };
        }
      }
    }

    // 使用 AI 评分简答题
    if (paper.shortanswer && answers.shortanswer) {
      for (let i = 0; i < paper.shortanswer.length; i++) {
        const question = paper.shortanswer[i];
        const userAnswer = answers.shortanswer[i];
        
        if (!userAnswer) continue;

        const response = await axios.post(API_URL, {
          model: 'qwen-plus',
          messages: [
            {
              role: "system",
              content: "You are a professional programming grading assistant."
            },
            {
              role: 'user',
              content: `你是一个编程简答题评分助手。请根据答案要点评分，并给出得分理由。
              满分为10分。请直接返回一个 JSON 对象（不要包含任何其他格式或标记），格式如下：
              {
                "score": 得分（0-10分）,
                "feedback": "评分反馈"
              }`
            },
            {
              role: 'user',
              content: `
              题目：${question.content}
              参考答案要点：${question.answer}
              学生答案：${userAnswer}
              题目分值：10分
              
              请评分并给出反馈。`
            }
          ],
        }, {
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
          }
        })

        let content = response.data.choices[0].message.content.trim();
        // 如果内容被包裹在代码块中，提取出 JSON 部分
        if (content.startsWith('```')) {
          content = content.replace(/^```(?:json)?\n|\n```$/g, '');
        }
        const result = JSON.parse(content);

        const score = Math.min(Math.max(0, result.score), 10);
        scores.shortanswer += score;
        totalScore += score;
        
        // 保存AI的评分反馈
        answers.shortanswer[i] = {
          answer: userAnswer,
          score: score,
          feedback: result.feedback
        };
      }
    }

    return {
      totalScore,
      scores,
      answers // 包含了AI的评分反馈
    };
  } catch (error) {
    console.error('Error grading paper:', error);
    throw error;
  }
}

export const submitAnswerToAI = async (problemId, userAnswer, language) => {
  try {
    const response = await axios.post(`http://localhost:3005/api/proxy/coze/submit`, {
      problemId,
      code: userAnswer,
      language
    })
    return response.data // 返回 AI 的批改结果
  } catch (error) {
    console.error('Error submitting answer:', error)
    throw error
  }
} 