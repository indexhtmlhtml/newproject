const express = require('express')
const router = express.Router()
const { Configuration, OpenAIApi } = require('openai')

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

// 生成题目
router.post('/generate/problems', async (req, res) => {
  try {
    const { category, count, difficulty, language } = req.body

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{
        role: "system",
        content: "你是一个专业的编程教师，擅长出编程题目。"
      }, {
        role: "user",
        content: `请生成一道${difficulty}难度的${category}编程题目...`
      }],
      temperature: 0.7,
      max_tokens: 2048,
      n: count
    })

    res.json(completion.data.choices)
  } catch (error) {
    console.error('OpenAI API Error:', error)
    res.status(500).json({ error: 'Failed to generate problems' })
  }
})

// 生成题解
router.post('/generate/solutions', async (req, res) => {
  try {
    const { problems, language } = req.body

    const solutions = await Promise.all(problems.map(problem => 
      openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{
          role: "system",
          content: "你是一个专业的编程导师，擅长解答编程题目。"
        }, {
          role: "user",
          content: `请为这道题目生成详细的解答...`
        }]
      })
    ))

    res.json(solutions.map(s => s.data.choices[0]))
  } catch (error) {
    console.error('OpenAI API Error:', error)
    res.status(500).json({ error: 'Failed to generate solutions' })
  }
})

module.exports = router 