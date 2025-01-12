import axios from 'axios'

const API_URL = 'https://api.deepseek.com'
const API_KEY = 'sk-1bb183d7bd70432e9f0deafbbfe89bb9'

export const generatePaper = async (params) => {
  try {
    let prompt = `请生成一份详细的编程能力测试试卷，要求如下：

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
3. 整体难度：${params.difficulty}
4. 所有题目必须与编程相关，且要有详细的上下文和背景说明
5. 分值根据题目难度和复杂度合理分配
6. 避免知识点重复，每道题考察不同的知识点
7. 相似题型不要重复出现

题干设计要求：
1. 题干复杂度要有层次：
   - 30%基础题目：简短清晰的题干，直接考察核心知识点
   - 40%中等题目：包含一定的场景描述和条件设定
   - 30%复杂题目：完整的业务场景、系统设计或多个知识点结合

2. 选择题要求：
   - 包含实际工作场景，如：
     * "在一个高并发的微服务系统中，服务A需要调用服务B，出现了循环依赖问题..."
     * "某电商平台的订单系统面临性能瓶颈，分析以下代码的时间复杂度..."
   - 包含代码分析题，如：
     * 给出一段包含多线程或设计模式的代码，分析其潜在问题
     * 展示一个数据库查询优化场景，分析不同方案的性能影响
   - 答案选项要包含详细的技术原理解释

3. 编程题要求：
   - 结合实际业务场景，如：
     * "设计一个订单分库分表的数据迁移方案，要求不影响线上业务..."
     * "实现一个高性能的缓存淘汰算法，要求支持并发访问..."
   - 包含系统设计类题目：
     * 完整的技术架构设计
     * 性能指标要求
     * 可扩展性考虑
     * 异常处理方案
   - 代码实现题目要有完整的约束条件和边界情况

4. 填空题要求：
   - 关键代码实现，如：
     * 分布式锁的核心实现代码
     * 设计模式的关键结构
     * 性能优化的核心逻辑
   - 包含实际工程实践中的代码片段

5. 判断题要求：
   - 涉及实际工程中的常见误区
   - 包含性能优化相关的最佳实践
   - 架构设计的权衡取舍
   - 新技术应用的场景判断

6. 简答题要求：
   - 系统设计题，如：
     * "设计一个支持百万用户同时在线的聊天系统..."
     * "设计一个支持秒杀的订单系统，要求考虑并发、性能、可靠性..."
   - 问题诊断题，如：
     * "生产环境出现了内存泄漏，给出排查步骤和解决方案..."
     * "数据库查询突然变慢，如何定位和优化..."
   - 技术选型题，如：
     * "比较不同消息队列的优劣，并说明在不同场景下的选择依据..."

7. 匹配题要求：
   - 技术场景与解决方案匹配
   - 性能问题与优化方案匹配
   - 架构模式与应用场景匹配
   - 确保选项之间有明确的区分度

每种题型都要求：
1. 70%题目要基于实际工程场景
2. 包含完整的业务背景描述
3. 明确的技术约束条件
4. 详细的性能和可靠性要求
5. 完整的测试用例和边界条件
6. 答案要包含详细的解题思路和技术原理

知识点分布要求：
1. 编程基础知识（数据类型、控制结构等）
2. 算法与数据结构（不同类型的算法和数据结构）
3. 面向对象编程概念
4. 设计模式与架构
5. 数据库与存储
6. 网络编程
7. 性能优化
8. 安全性考虑
9. 工程实践
10. 新技术应用

注意事项：
1. 题目描述要完整，包含必要的上下文信息
2. 涉及代码的题目要给出完整的代码片段
3. 系统设计类题目要考虑实际的技术约束
4. 性能相关的题目要给出具体的性能指标
5. 确保题目难度分布合理，简单题和复杂题都要有

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
        temperature: 0.2,
        max_tokens: 4096,
        top_p: 0.95
      }, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 120000
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