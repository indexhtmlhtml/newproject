<template>
  <div class="solve-problem">
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>加载中...</p>
    </div>
    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
      <button @click="router.push('/problems')">返回题目列表</button>
    </div>
    <template v-else>
    <header class="header">
      <div class="header-content">
        <div class="left-section">
          <button class="back-btn" @click="router.back()">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
          </button>
        </div>
      </div>
    </header>

    <main class="main-content">
        <!-- 左侧面板：题目描述 -->
        <div class="description-panel" :class="{ 'panel-collapsed': !showDescription }">
          <div class="panel-header">
            <h2>题目描述</h2>
            <button class="toggle-btn" @click="toggleDescription">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                <path fill="currentColor" :d="showDescription 
                  ? 'M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z'
                  : 'M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z'"/>
              </svg>
            </button>
          </div>
          <!-- 题目描述内容 -->
          <div class="problem-info">
            <div class="problem-header">
              <h1 class="problem-title"> {{ problem?.title }}</h1>
              <div class="problem-tags">
                <span :class="['difficulty', problem?.difficulty?.toLowerCase()]">
                  {{ problem?.difficulty }}
                </span>
                <span class="tag">相关标签</span>
                <span class="tag">相关企业</span>
              </div>
            </div>

            <div class="problem-stats">
              <div class="stat-item">
                <span class="stat-label">通过率</span>
                <span class="stat-value success">{{ problem?.acceptanceRate }}%</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">提交次数</span>
                <span class="stat-value">{{ problem?.totalSubmissions }}</span>
              </div>
            </div>

            <div class="problem-content">
              <div v-html="problem?.description"></div>
            </div>
            
            <div class="examples">
              <div v-for="(example, index) in problem?.examples" 
                   :key="index" 
                   class="example">
                <p class="example-title">示例 {{ index + 1 }}：</p>
              <div class="example-content">
                  <p><strong>输入：</strong>{{ example.input }}</p>
                  <p><strong>输出：</strong>{{ example.output }}</p>
                  <p v-if="example.explanation"><strong>解释：</strong>{{ example.explanation }}</p>
                </div>
                </div>
              </div>

            <div class="constraints">
              <h3>提示：</h3>
              <ul v-html="problem?.constraints"></ul>
            </div>
          </div>
        </div>

        <!-- 右侧面板：代码编辑器 -->
        <div class="editor-panel" :class="{ 'panel-expanded': !showDescription }">
          <div class="panel-header">
            <div class="editor-controls">
            <select v-model="selectedLanguage" class="language-select">
              <option value="c">C</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
            </select>
            <div class="editor-actions">
                <button 
                  class="action-btn template-btn" 
                  @click="generateTemplateCode"
                  :disabled="isGenerating"
                  :style="{
    backgroundColor: isGenerating ? 'gray' : 'white',
    color: isGenerating ? 'lightgray' : 'black'
  }"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6z"/>
                  </svg>
                  {{ isGenerating ? '生成中...' : '生成模板' }}
              </button>
                <button class="action-btn solution-btn" @click="openSolution" :disabled="loadingSolution">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z"/>
                  </svg>
                  <span>{{ loadingSolution ? '加载中...' : '查看题解' }}</span>
                  <div v-if="loadingSolution" class="loading-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
              </button>
            </div>
          </div>
          </div>

          <div class="editor-container">
            <textarea
              v-model="code"
              class="code-editor"
              @input="handleCodeChange"
            ></textarea>
          </div>

          <div class="editor-footer">
            <button 
              class="run-btn"
              :disabled="isRunning"
              @click="handleRunCode"
            >
              运行代码
            </button>
            <button 
              class="submit-btn"
              :disabled="isSubmitting"
              @click="submitCode"
            >
              提交
            </button>
              </div>
              </div>

        <!-- 题解模态框 -->
        <div v-if="showSolution" class="solution-modal">
          <div class="modal-overlay" @click="showSolution = false"></div>
          <div class="modal-container">
            <div class="modal-header">
              <h2>题目解析</h2>
              <button class="close-btn" @click="showSolution = false">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
                </div>
            
            <div class="modal-content">
              <!-- 加载状态 -->
              <div v-if="loadingSolution" class="loading-state">
                <div class="loading-spinner"></div>
                <p>正在生成题解...</p>
                </div>

              <!-- 错误状态 -->
              <div v-else-if="solutionError" class="error-state">
                <p>{{ solutionError }}</p>
                <button @click="openSolution">重试</button>
                </div>

              <!-- 题解内容 -->
              <div v-else-if="solution" class="solution-content">
                <div class="solution-section">
                  <h3>题目分析</h3>
                  <p>{{ solution.analysis }}</p>
              </div>
                <div class="solution-section">
                  <h3>解题方法</h3>
                  <div v-for="(approach, index) in solution.approaches" 
                       :key="index" 
                       class="approach">
                    <h4>{{ approach.name }}</h4>
                    <p>{{ approach.description }}</p>
                    <div class="complexity">
                      <span>时间复杂度: {{ approach.timeComplexity }}</span>
                      <span>空间复杂度: {{ approach.spaceComplexity }}</span>
            </div>
                    <div class="code-implementations">
                      <div class="code-header">
                        <select v-model="selectedLanguage" class="language-select">
                          <option value="c">C</option>
                          <option value="python">Python</option>
                          <option value="java">Java</option>
                        </select>
          </div>
                      <pre><code>{{ approach.code[selectedLanguage] }}</code></pre>
                    </div>
                  </div>
                </div>
                <div class="solution-section">
                  <h3>解题技巧</h3>
                  <ul>
                    <li v-for="(tip, index) in solution.tips" :key="index">
                      {{ tip }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 提交结果模态框 -->
        <div v-if="submissionModal.show" class="modal">
          <div class="modal-overlay" @click="closeModal"></div>
          <div class="modal-container">
            <div class="modal-header">
              <h2>{{ submissionModal.title }}</h2>
              <button class="close-btn" @click="closeModal">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            </div>
            <div class="modal-content" v-html="submissionModal.content"></div>
          </div>
      </div>
    </main>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Chart from 'chart.js/auto'
import { getProblem, runCode as runCodeAPI, submitCodeToAI } from '../services/problems'
import { getProblemStats, getSubmissions } from '@/services/jieti'
import { useProblemsStore } from '../stores/problems'
import axios from 'axios'
import MonacoEditor from '../components/MonacoEditor.vue'
import { submitAnswerToAI } from '../services/paper'

const route = useRoute()
const router = useRouter()
const problemsStore = useProblemsStore()
const problem = ref(null)
const showSolution = ref(false)
const code = ref('')
const selectedLanguage = ref('c')
const isRunning = ref(false)
const isSubmitting = ref(false)
const problemStats = ref({
  totalSubmissions: 0,
  acceptedSubmissions: 0,
  acceptanceRate: 0
})
const submissions = ref([])
const solution = ref(null)
const loadingSolution = ref(false)
const solutionError = ref(null)
const submissionStatus = ref({
  status: '',
  message: ''
})
const submissionModal = ref({
  show: false,
  title: '',
  content: ''
})
const isGenerating = ref(false)
const isSolutionLoading = ref(false)
const userAnswer = ref('')
const gradingResult = ref(null)

const generateTemplate = async (problem, language) => {
  try {
    const response = await axios.post('https://api.deepseek.com/v1/chat/completions', {
      model: "deepseek-coder",
      messages: [
        {
          role: "system",
          content: `你是一个编程助手。请生成简洁的代码模板，只包含：
            1. 必要的函数声明
            2. 基本的参数和返回类型
            3. 不要包含任何实现逻辑
            4. 模板包含注释，并指出哪一部分是待实现的
            `
        },
        {
          role: "user",
          content: `根据题目"${problem.title}"生成${language}的最简代码模板。
            输入示例：${problem.examples?.[0]?.input || ''}
            输出示例：${problem.examples?.[0]?.output || ''}`
        }
      ],
      temperature: 0.1,
      max_tokens: 150
    }, {
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json'
      }
    })

    return response.data.choices[0].message.content.trim()
  } catch (error) {
    console.error('Failed to generate template:', error)
    // 简化基础模板
    const basicTemplates = {
      cpp: 'class Solution {\npublic:\n    void solve() {\n    }\n};',
      java: 'class Solution {\n    public void solve() {\n    }\n}',
      python: 'def solve():\n    pass'
    }
    return basicTemplates[language] || ''
  }
}

const generateTemplateCode = async () => {
  if (!problem.value || isGenerating.value) return
  
  try {
    isGenerating.value = true
    code.value = await generateTemplate(problem.value, selectedLanguage.value)
  } catch (error) {
    console.error('Failed to generate template:', error)
  } finally {
    isGenerating.value = false
  }
}

const loadAnalysisData = async () => {
  try {
    const [stats, submissionHistory] = await Promise.all([
      getProblemStats(route.params.id),
      getSubmissions(route.params.id)
    ])
    problemStats.value = stats
    submissions.value = submissionHistory
  } catch (error) {
    console.error('Failed to load analysis data:', error)
  }
}

const formatTime = (timestamp) => {
  const now = Date.now()
  const diff = now - timestamp
  if (diff < 3600000) {
    return `${Math.floor(diff / 60000)}分钟前`
  } else if (diff < 86400000) {
    return `${Math.floor(diff / 3600000)}小时前`
  }
  return new Date(timestamp).toLocaleDateString()
}

const handleRunCode = async () => {
  if (isRunning.value) return
  
  try {
    isRunning.value = true
    const result = await runCodeAPI(route.params.id, code.value, selectedLanguage.value)
    // 处理运行结果
    console.log('Run result:', result)
  } catch (error) {
    console.error('Run code failed:', error)
  } finally {
    isRunning.value = false
  }
}

const showModal = (modal) => {
  submissionModal.value = {
    show: true,
    title: modal.title,
    content: modal.content
  }
}

const closeModal = () => {
  submissionModal.value.show = false
}

const submitCode = async () => {
  if (isSubmitting.value) return
  
  try {
    isSubmitting.value = true
    // 更新提交状态
    submissionStatus.value = {
      status: 'submitting',
      message: '正在评估代码...'
    }
const API_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions'
    const response = await axios.post(API_URL,{
      model: 'qwen-plus',
      messages: [
        {
          role: "system",
          content: `你是一个专业的代码评估专家。请评估提交的代码是否正确解决了问题，并按照以下JSON格式返回评估结果：
          {
            "success": true/false,
            "score": 0-100的分数,
            "time_complexity": "时间复杂度分析",
            "space_complexity": "空间复杂度分析",
            "correctness": "代码正确性分析",
            "test_cases": [
              {
                "input": "测试用例输入",
                "expected": "期望输出",
                "actual": "实际输出",
                "passed": true/false
              }
            ],
            "suggestions": ["改进建议1", "改进建议2"]
          }`
        },
        {
          role: "user",
          content: `请评估以下代码：
          题目：${problem.value.title}
          描述：${problem.value.content || problem.value.description || ''}
          编程语言：${selectedLanguage.value}
          代码：
          ${code.value}`
        }
      ],
      response_format: { type: "json_object" }
    }, {
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json'
      }
    })

    const result = JSON.parse(response.data.choices[0].message.content)
    
    // 显示评估结果
    showSubmissionResult(result)

  } catch (error) {
    console.error('Submit code failed:', error)
    submissionStatus.value = {
      status: 'error',
      message: '提交失败，请稍后重试'
    }
  } finally {
    isSubmitting.value = false
  }
}

// 添加提交结果展示模态框
const showSubmissionResult = (result) => {
  const modal = {
    title: result.success ? '提交成功' : '提交失败',
    content: `
      <div class="submission-result">
        <div class="score-section">
          <h3>得分：${result.score}</h3>
          <div class="complexity-info">
            <p>时间复杂度：${result.time_complexity}</p>
            <p>空间复杂度：${result.space_complexity}</p>
          </div>
        </div>
        
        <div class="test-cases">
          <h3>测试用例</h3>
          ${result.test_cases.map((test, index) => `
            <div class="test-case ${test.passed ? 'passed' : 'failed'}">
              <div class="test-header">
                <span>测试用例 ${index + 1}</span>
                <span class="status">${test.passed ? '通过' : '失败'}</span>
              </div>
              <div class="test-details">
                <p>输入：${test.input}</p>
                <p>期望输出：${test.expected}</p>
                <p>实际输出：${test.actual}</p>
              </div>
            </div>
          `).join('')}
        </div>
        
        ${result.suggestions.length > 0 ? `
          <div class="suggestions">
            <h3>改进建议</h3>
            <ul>
              ${result.suggestions.map(suggestion => `<li>${suggestion}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
      </div>
    `
  }
  
  // 显示结果模态框
  showModal(modal)
}

const resetCode = () => {
  if (confirm('确定要重置代码吗？这将清除所有更改。')) {
    initCode()
  }
}

const loading = ref(true)
const error = ref(null)

const showDescription = ref(true)

const toggleDescription = () => {
  showDescription.value = !showDescription.value
}

const openSolution = async () => {
  try {
    showSolution.value = true
    loadingSolution.value = true
    
    if (!problem.value) {
      throw new Error('题目信息未加载完成，请稍后再试')
    }

    console.log('开始生成题解，题目信息:', problem.value)

    const response = await axios.post('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
      model: 'qwen-plus',
      messages: [
        {
          role: "system",
          content: "你是一个专业的编程题解析助手。请用中文详细解释解题思路，并提供多种实现方案。请确保返回的是合法的JSON格式。"
        },
        {
          role: "user",
          content: `请分析以下编程题目并提供详细解答：

题目：${problem.value.title}

描述：${problem.value.content || problem.value.description || ''}

${problem.value.examples ? `
示例：
${problem.value.examples.map((example, index) => `
示例 ${index + 1}：
输入：${example.input}
输出：${example.output}
${example.explanation ? `解释：${example.explanation}` : ''}`).join('\n')}` : ''}

请返回以下格式的JSON（确保是合法的JSON格式）：
{
  "analysis": "详细的题目分析和解题思路",
  "approaches": [
    {
      "name": "解法名称",
      "description": "解法描述",
      "timeComplexity": "时间复杂度",
      "spaceComplexity": "空间复杂度",
      "code": {
        "c": "C语言代码",
        "python": "Python代码",
        "java": "Java代码"
      }
    }
  ],
  "tips": ["解题技巧1", "解题技巧2"]
}`
        }
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json'
      }
    })

    console.log('API 响应:', response.data)

    const result = response.data.choices[0].message.content
    console.log('AI 返回的原始内容:', result)

    try {
      // 提取 ```json 和 ``` 之间的内容
      let cleanedResult = result
        // 提取 ```json 和 ``` 之间的内容
        .match(/```json\n([\s\S]*?)\n```/)?.[1] || result
        .trim();

      console.log('清理后的内容:', cleanedResult)

      solution.value = JSON.parse(cleanedResult)
      console.log('清理后解析成功:', solution.value)

    } catch (e) {
      console.error('JSON 解析失败:', e)
      throw new Error('题解格式错误')
    }

    // 验证解析后的数据结构
    if (!solution.value.analysis || !Array.isArray(solution.value.approaches)) {
      throw new Error('题解格式不完整')
    }

  } catch (error) {
    console.error('生成题解失败:', error)
    solutionError.value = error.message
  } finally {
    loadingSolution.value = false
  }
}

const copyCode = async (code) => {
  try {
    await navigator.clipboard.writeText(code)
    // 可以添加一个复制成功的提示
  } catch (err) {
    console.error('Failed to copy code:', err)
  }
}

// 生成随机统计数据的辅助函数
const generateRandomStats = (difficulty) => {
  // 根据难度设置通过率范围
  let acceptanceRateRange;
  switch (difficulty?.toLowerCase()) {
    case 'easy':
      acceptanceRateRange = { min: 65, max: 85 }; // 简单题 65%-85%
      break;
    case 'medium':
      acceptanceRateRange = { min: 45, max: 65 }; // 中等题 45%-65%
      break;
    case 'hard':
      acceptanceRateRange = { min: 25, max: 45 }; // 困难题 25%-45%
      break;
    default:
      acceptanceRateRange = { min: 45, max: 65 }; // 默认中等难度
  }

  // 生成提交次数，范围根据难度调整
  const submissionRange = {
    easy: { min: 5000, max: 20000 },
    medium: { min: 3000, max: 15000 },
    hard: { min: 1000, max: 10000 }
  };
  
  const range = submissionRange[difficulty?.toLowerCase()] || submissionRange.medium;
  const totalSubmissions = Math.floor(Math.random() * (range.max - range.min)) + range.min;
  
  // 生成通过率
  const acceptanceRate = (
    Math.random() * (acceptanceRateRange.max - acceptanceRateRange.min) + 
    acceptanceRateRange.min
  ).toFixed(1);
  
  const acceptedSubmissions = Math.floor(totalSubmissions * (parseFloat(acceptanceRate) / 100))
  
  return {
    totalSubmissions,
    acceptedSubmissions,
    acceptanceRate: parseFloat(acceptanceRate)
  }
}

// 生成随机提交历史
const generateRandomSubmissions = () => {
  const count = Math.floor(Math.random() * 5) + 3 // 3-7条记录
  const statuses = ['Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Runtime Error']
  const now = Date.now()
  
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    timestamp: now - (Math.random() * 7 * 24 * 3600 * 1000), // 最近7天内
    status: statuses[Math.floor(Math.random() * statuses.length)],
    runtime: Math.floor(Math.random() * 200) + 50, // 50-250ms
    memory: (Math.random() * 5 + 5).toFixed(1) // 5-10MB
  })).sort((a, b) => b.timestamp - a.timestamp)
}

const handleBack = () => {
  router.push('/problems')
}

const submitAnswer = async () => {
  try {
    const result = await submitAnswerToAI(problem.value.id, userAnswer.value, problem.value.language)
    gradingResult.value = result
  } catch (error) {
    console.error('提交答案失败:', error)
    alert('提交答案失败，请重试。')
  }
}

onMounted(async () => {
  try {
    loading.value = true
    error.value = null
    const { id } = route.params
    if (!id) {
      throw new Error('题目ID不存在')
    }
    
    const storeProblem = problemsStore.getCurrentProblem()
    // 生成随机统计数据
    const randomStats = generateRandomStats(storeProblem.difficulty)
    
    if (storeProblem && storeProblem.id === id) {
      problem.value = {
        ...storeProblem,
        acceptanceRate: storeProblem.acceptanceRate || randomStats.acceptanceRate,
        totalSubmissions: storeProblem.totalSubmissions || randomStats.totalSubmissions,
        acceptedSubmissions: storeProblem.acceptedSubmissions || randomStats.acceptedSubmissions
      }
    } else {
      const response = await getProblem(id)
      if (response.data) {
        const problemData = {
          ...response.data,
          difficulty: response.data.difficulty || 'Medium'
        }
        // 根据题目难度生成随机统计数据
        const randomStats = generateRandomStats(problemData.difficulty)
        problemData.acceptanceRate = randomStats.acceptanceRate
        problemData.totalSubmissions = randomStats.totalSubmissions
        problemData.acceptedSubmissions = randomStats.acceptedSubmissions
        
        problem.value = problemData
        problemsStore.setCurrentProblem(problemData)
      } else {
        throw new Error('题目不存在')
      }
    }
    
    // 生成随机提交历史
    submissions.value = generateRandomSubmissions()
    
    // 更新问题统计数据
    problemStats.value = {
      totalSubmissions: problem.value.totalSubmissions,
      acceptedSubmissions: problem.value.acceptedSubmissions,
      acceptanceRate: problem.value.acceptanceRate
    }
    
  } catch (error) {
    console.error('Failed to fetch problem:', error)
    error.value = error.message || '加载题目失败'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
/* 基础布局优化 */
.solve-problem {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #fafbfc;
}

/* 头部样式优化 */
.header {
  background: white;
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
  padding: 0 24px;
  height: 64px;
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(8px);
  background: rgba(255, 255, 255, 0.95);
}

.header-content {
  max-width: 1440px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.left-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border: none;
  background: none;
  color: #606266;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: #f5f7fa;
}

/* 主内容区域优化 */
.main-content {
  display: flex;
  gap: 24px;
  padding: 24px;
  height: calc(100vh - 64px);
  overflow: hidden;
  max-width: 1800px;
  margin: 0 auto;
  width: 100%;
}

.description-panel {
  flex: 1;
  min-width: 400px;
  max-width: 800px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.03);
  overflow-y: auto;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: left center;
  border: 1px solid rgba(0, 0, 0, 0.03);
}

.editor-panel {
  flex: 1;
  min-width: 500px;
  max-width: 1000px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.panel-header {
  padding: 16px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.toggle-btn {
  padding: 4px;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.toggle-btn:hover {
  background: var(--background-color);
}

.panel-collapsed {
  flex: 0 0 auto;
  min-width: 48px;
  width: 48px;
  overflow: hidden;
  position: relative;
  transform-origin: left center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.panel-collapsed .panel-header {
  position: absolute;
  top: 0;
  left: 0;
  width: 48px;
  height: 100%;
  padding: 0;
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: white;
  z-index: 10;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.panel-collapsed .toggle-btn {
  margin: 8px 0;
}

.panel-collapsed h2 {
  font-size: 14px;
  white-space: nowrap;
  margin: 8px 0;
}

.editor-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid var(--border-color);
}

.language-select {
  padding: 6px 12px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: white;
}

.reset-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.reset-btn:hover {
  background: var(--background-color);
}

/* 加载状态和错误状态样式 */
.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 示例和约束样式 */
.examples {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.example {
  background: rgba(0, 0, 0, 0.01);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid rgba(0, 0, 0, 0.03);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.example::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: var(--primary-color);
  opacity: 0.3;
}

.example-title {
  font-weight: 600;
  margin-bottom: 12px;
  color: #303133;
}

.example-content {
  font-family: 'Fira Code', monospace;
  background: #fff;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  font-size: 14px;
  line-height: 1.6;
  position: relative;
  overflow-x: auto;
}

.example-content::-webkit-scrollbar {
  height: 6px;
}

.example-content::-webkit-scrollbar-track {
  background: #f5f5f5;
  border-radius: 3px;
}

.example-content::-webkit-scrollbar-thumb {
  background: #ddd;
  border-radius: 3px;
}

.constraints {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  margin: 24px 0;
  border: 1px solid rgba(0, 0, 0, 0.03);
  background: rgba(0, 0, 0, 0.01);
}

.constraints:hover {
  border-color: var(--primary-color);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.constraints h3 {
  color: var(--text-primary);
  font-size: 16px;
  margin-bottom: 12px;
  font-weight: 600;
}

.constraints ul {
  color: var(--text-regular);
  padding-left: 20px;
  line-height: 1.6;
  font-size: 14px;
}

.constraints li {
  margin: 8px 0;
  position: relative;
  padding-left: 8px;
}

.constraints li::before {
  content: '';
  position: absolute;
  left: -12px;
  top: 8px;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--primary-color);
}

/* 暗色主题支持优化 */
@media (prefers-color-scheme: dark) {
  .solve-problem {
    background: #111111;
  }

  .header {
    background: rgba(30, 30, 30, 0.95);
    border-color: rgba(255, 255, 255, 0.05);
  }

  .description-panel {
    background: #1e1e1e;
    border-color: rgba(255, 255, 255, 0.05);
  }

  .example {
    background: rgba(255, 255, 255, 0.02);
    border-color: rgba(255, 255, 255, 0.05);
  }

  .constraints {
    background: rgba(255, 255, 255, 0.02);
    border-color: rgba(255, 255, 255, 0.05);
  }

  .example-content::-webkit-scrollbar-track {
    background: #1e1e1e;
  }

  .example-content::-webkit-scrollbar-thumb {
    background: #444;
  }

  .constraints li::before {
    background: var(--primary-color);
    opacity: 0.8;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-content {
    flex-direction: column;
    height: auto;
  }
  
  .description-panel {
    min-width: 100%;
  }
  
  .panel-collapsed {
    width: 100%;
    height: 40px;
  }
}

/* 代码编辑器样式优化 */
.editor-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #1e1e1e;
  border-radius: 0 0 8px 8px;
  overflow: hidden;
}

.code-editor {
  flex: 1;
  width: 100%;
  min-height: 400px;
  padding: 16px;
  font-family: 'Fira Code', Consolas, Monaco, 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.6;
  color: #d4d4d4;
  background: #1e1e1e;
  border: none;
  resize: none;
  outline: none;
}

.editor-footer {
  display: flex;
  gap: 12px;
  padding: 12px 16px;
  background: #252526;
  border-top: 1px solid #333;
}

.run-btn,
.submit-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.run-btn {
  background: #2d2d2d;
  color: #fff;
}

.submit-btn {
  background: var(--primary-color);
  color: #fff;
}

.run-btn:hover {
  background: #3d3d3d;
}

.submit-btn:hover {
  background: var(--primary-color-dark);
  transform: translateY(-1px);
}

.run-btn:disabled,
.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* 题目描述样式优化 */
.problem-info {
  padding: 24px;
  max-width: 800px;
  margin: 0 auto;
}

.problem-header {
  margin-bottom: 24px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  padding-bottom: 20px;
  position: relative;
}

.problem-header::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100px;
  height: 2px;
  background: var(--primary-color);
  transition: width 0.3s ease;
}

.problem-header:hover::after {
  width: 150px;
}

.problem-title {
  font-size: 22px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 12px;
  line-height: 1.4;
  letter-spacing: -0.01em;
}

.problem-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 16px 0;
}

.difficulty,
.tag {
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: none;
  border: 1px solid;
}

.difficulty.easy {
  background: rgba(103, 194, 58, 0.05);
  color: #67c23a;
  border-color: rgba(103, 194, 58, 0.2);
}

.difficulty.medium {
  background: rgba(230, 162, 60, 0.05);
  color: #e6a23c;
  border-color: rgba(230, 162, 60, 0.2);
}

.difficulty.hard {
  background: rgba(245, 108, 108, 0.05);
  color: #f56c6c;
  border-color: rgba(245, 108, 108, 0.2);
}

.tag {
  background: rgba(0, 0, 0, 0.02);
  color: var(--text-regular);
  border-color: rgba(0, 0, 0, 0.06);
}

.tag:hover {
  background: #e9e9eb;
  transform: translateY(-1px);
}

.problem-stats {
  display: flex;
  gap: 24px;
  padding: 16px 0;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 24px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-label {
  font-size: 13px;
  color: var(--text-secondary);
}

.stat-value {
  font-size: 16px;
  font-weight: 500;
  color: var(--vt-c-text-primary);
}

.stat-value.success {
  color: var(--vt-c-accent);
}

.problem-content {
  color: var(--text-regular);
  line-height: 1.6;
  margin-bottom: 24px;
  font-size: 15px;
  white-space: pre-wrap;
}

/* 示例样式优化 */
.examples {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: 24px 0;
}

.example {
  background: #fafafa;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #eee;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.example:hover {
  border-color: var(--primary-color);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.example-title {
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 12px;
}

.example-content {
  font-family: 'Fira Code', monospace;
  background: #fff;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  font-size: 14px;
  line-height: 1.6;
  position: relative;
  overflow-x: auto;
}

.example-content strong {
  color: #606266;
  font-weight: 600;
}

/* 约束条件样式优化 */
.constraints {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  margin: 24px 0;
  border: 1px solid rgba(0, 0, 0, 0.03);
  background: rgba(0, 0, 0, 0.01);
}

.constraints:hover {
  border-color: var(--primary-color);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.constraints h3 {
  color: var(--text-primary);
  font-size: 16px;
  margin-bottom: 12px;
  font-weight: 600;
}

.constraints ul {
  color: var(--text-regular);
  padding-left: 20px;
  line-height: 1.6;
  font-size: 14px;
}

.constraints li {
  margin: 8px 0;
  position: relative;
  padding-left: 8px;
}

.constraints li::before {
  content: '';
  position: absolute;
  left: -12px;
  top: 8px;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--primary-color);
}

/* 暗色主题支持优化 */
@media (prefers-color-scheme: dark) {
  .solve-problem {
    background: #111111;
  }

  .header {
    background: rgba(30, 30, 30, 0.95);
    border-color: rgba(255, 255, 255, 0.05);
  }

  .description-panel {
    background: #1e1e1e;
    border-color: rgba(255, 255, 255, 0.05);
  }

  .example {
    background: rgba(255, 255, 255, 0.02);
    border-color: rgba(255, 255, 255, 0.05);
  }

  .constraints {
    background: rgba(255, 255, 255, 0.02);
    border-color: rgba(255, 255, 255, 0.05);
  }

  .example-content::-webkit-scrollbar-track {
    background: #1e1e1e;
  }

  .example-content::-webkit-scrollbar-thumb {
    background: #444;
  }

  .constraints li::before {
    background: var(--primary-color);
    opacity: 0.8;
  }
}

/* 滚动条样式 */
.description-panel::-webkit-scrollbar {
  width: 8px;
}

.description-panel::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.description-panel::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 4px;
}

.description-panel::-webkit-scrollbar-thumb:hover {
  background: #999;
}

/* 折叠/展开动画 */
.panel-collapsed,
.panel-expanded {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 响应式优化 */
@media (max-width: 768px) {
  .main-content {
    flex-direction: column;
    height: auto;
    padding: 12px;
  }
  
  .description-panel {
    min-width: 100%;
  }
  
  .panel-collapsed {
    width: 100%;
    height: 40px;
  }

  .problem-title {
    font-size: 20px;
  }

  .problem-tags {
    flex-wrap: wrap;
  }

  .editor-container {
    min-height: 300px;
  }

  .code-editor {
    font-size: 13px;
  }

  .editor-footer {
    flex-direction: column;
    gap: 8px;
  }

  .run-btn,
.submit-btn {
    width: 100%;
    justify-content: center;
  }
}

/* 确保代码编辑器区域不会过度扩展 */
.editor-panel.panel-expanded {
  flex: 1.5;
  max-width: 1200px;
}

/* 添加过渡效果 */
.description-panel,
.editor-panel {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 响应式布局优化 */
@media (max-width: 1200px) {
  .editor-panel {
    min-width: 400px;
  }
  
  .editor-panel.panel-expanded {
    flex: 1.2;
  }
}

@media (max-width: 768px) {
  .main-content {
    flex-direction: column;
    height: auto;
    padding: 12px;
  }
  
  .description-panel {
    min-width: 100%;
  }
  
  .editor-panel {
    min-width: 100%;
    height: 500px;
  }
  
  .panel-collapsed {
  width: 100%;
    height: 48px;
  }

  .panel-collapsed .panel-header {
    width: 100%;
    height: 48px;
    writing-mode: horizontal-tb;
    transform: none;
    padding: 0 16px;
    flex-direction: row;
  }

  .panel-collapsed .toggle-btn {
    transform: rotate(0deg);
  }

  .panel-collapsed h2 {
    margin: 0;
  }
}

/* 内容过渡效果 */
.problem-info {
  opacity: 1;
  transition: opacity 0.2s ease-in;
}

.panel-collapsed .problem-info {
  opacity: 0;
  transition: opacity 0.1s ease-out;
}

/* 题解面板样式 */
.solution-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.modal-container {
  position: relative;
  width: 90%;
  max-width: 900px;
  max-height: 90vh;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  animation: modalSlideIn 0.3s ease;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.modal-header h2 {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.close-btn {
  padding: 8px;
  border: none;
  background: none;
  color: var(--text-secondary);
  cursor: pointer;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.06);
  color: var(--text-primary);
}

.modal-content {
  padding: 24px;
  overflow-y: auto;
  max-height: calc(90vh - 70px);
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 暗色主题支持 */
@media (prefers-color-scheme: dark) {
  .modal-container {
    background: #1e1e1e;
    border: 1px solid rgba(255, 255, 255, 0.05);
  }

  .modal-header {
    border-color: rgba(255, 255, 255, 0.06);
  }
}

/* 添加题解按钮样式 */
.solution-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: white;
  color: var(--text-regular);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.solution-btn:hover {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.solution-btn svg {
  width: 16px;
  height: 16px;
}

@media (prefers-color-scheme: dark) {
  .solution-btn {
    background: #2d2d2d;
    border-color: rgba(255, 255, 255, 0.1);
  }
}

/* 提交结果样式 */
.submission-result {
  padding: 20px;
}

.score-section {
  text-align: center;
  margin-bottom: 24px;
  padding: 20px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 12px;
}

.score-section h3 {
  font-size: 24px;
  color: var(--primary-color);
  margin-bottom: 12px;
}

.complexity-info {
  color: var(--text-secondary);
  font-size: 14px;
}

.test-cases {
  margin: 24px 0;
}

.test-case {
  margin: 12px 0;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
}

.test-header {
  display: flex;
  justify-content: space-between;
  padding: 12px;
  background: rgba(0, 0, 0, 0.02);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.test-case.passed .status {
  color: #67c23a;
}

.test-case.failed .status {
  color: #f56c6c;
}

.test-details {
  padding: 12px;
  font-family: 'Fira Code', monospace;
  font-size: 14px;
}

.suggestions {
  margin-top: 24px;
  padding: 20px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 12px;
}

.suggestions ul {
  margin-top: 12px;
  padding-left: 20px;
}

.suggestions li {
  margin: 8px 0;
  color: var(--text-regular);
}

/* 暗色主题支持 */
@media (prefers-color-scheme: dark) {
  .score-section,
  .test-header,
  .suggestions {
    background: rgba(255, 255, 255, 0.02);
  }

  .test-case {
    border-color: rgba(255, 255, 255, 0.1);
  }
}

/* 通用模态框样式 */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.modal-container {
  position: relative;
  width: 90%;
  max-width: 900px;
  max-height: 90vh;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  animation: modalSlideIn 0.3s ease;
}

.template-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: var(--vt-c-primary);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

.template-btn:hover:not(:disabled) {
  background: var(--vt-c-secondary);
  transform: translateY(-1px);
}

.template-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.template-btn svg {
  width: 16px;
  height: 16px;
}

.editor-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid var(--border-color);
}

.editor-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.primary-btn {
  background: var(--vt-c-primary);
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.primary-btn:hover:not(:disabled) {
  background: var(--vt-c-secondary);
  transform: translateY(-1px);
}

.primary-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.primary-btn svg {
  width: 16px;
  height: 16px;
}

.solution-btn {
  color: var(--vt-c-text-light-2);
  padding: 8px 16px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  transition: all 0.3s ease;
}

.solution-btn:hover {
  color: var(--vt-c-primary);
  background: rgba(79, 110, 247, 0.1);
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

.template-btn {
  background: var(--vt-c-primary);
  color: white;
}

.template-btn:hover:not(:disabled) {
  background: var(--vt-c-secondary);
  transform: translateY(-1px);
}

.template-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.solution-btn {
  background: transparent;
  color: var(--vt-c-text-light-2);
}

.solution-btn:hover {
  color: var(--vt-c-primary);
  background: rgba(79, 110, 247, 0.1);
}

.loading-dots {
  display: inline-flex;
  gap: 4px;
  margin-left: 8px;
}

.loading-dots span {
  width: 4px;
  height: 4px;
  background-color: currentColor;
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out both;
}

.loading-dots span:nth-child(1) { animation-delay: -0.32s; }
.loading-dots span:nth-child(2) { animation-delay: -0.16s; }

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid var(--vt-c-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
  color: var(--vt-c-text-light-2);
}

.loading-state p {
  margin-top: 16px;
  font-size: 14px;
}
</style> 