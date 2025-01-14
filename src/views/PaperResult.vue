<template>
  <div class="paper-result">
    <header class="header">
      <div class="header-content">
        <div class="left-section">
          <button class="back-button" @click="handleBack">
            <div class="button-content">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
              </svg>
              <span>返回</span>
            </div>
            <div class="button-background"></div>
          </button>
          <h1 class="page-title">{{ paper?.title || '编程能力测试' }}</h1>
        </div>
      </div>
    </header>

    <main class="main-content">
      <!-- 成绩总览卡片 -->
      <div class="result-overview">
        <div class="score-circle-container">
          <div class="score-circle">
            <svg viewBox="0 0 36 36" class="score-circle-svg">
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#eee" stroke-width="3"/>
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" :stroke="getScoreColor(scorePercentage)" stroke-width="3" :stroke-dasharray="`${scorePercentage}, 100`"/>
            </svg>
            <div class="score-text">
              <span class="current-score">{{ totalScore }}</span>
              <span class="total-score">/{{ totalMaxScore }}</span>
            </div>
          </div>
          <div class="score-label">总分</div>
        </div>

        <!-- 统计数据卡片 -->
        <div class="stats-cards">
          <div class="stat-card">
            <div class="stat-value">{{ totalScore }}</div>
            <div class="stat-label">总分</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ correctCount }}</div>
            <div class="stat-label">答对题数</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ wrongCount }}</div>
            <div class="stat-label">答错题数</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ accuracy }}%</div>
            <div class="stat-label">正确率</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ formattedTimeUsed }}</div>
            <div class="stat-label">用时</div>
          </div>
        </div>

        <!-- 成绩等级 -->
        <div class="score-level" :style="{ color: scoreLevel.text.color }">
          {{ scoreLevel.text }}
        </div>
      </div>

      <!-- 分类得分图表 -->
      <div class="score-analysis">
        <h3>分类得分分析</h3>
        <div class="analysis-grid">
          <div v-for="item in typeAnalysis" :key="item.type" class="analysis-card">
            <div class="analysis-header">
              <h4>{{ item.type }}</h4>
              <div class="score-badge" :style="{ backgroundColor: getScoreColor(item.percentage) }">
                {{ item.score }}/{{ item.maxScore }}
              </div>
            </div>
            <div class="analysis-stats">
              <div class="stat-row">
                <span>题目数量</span>
                <span>{{ item.questionCount }}题</span>
              </div>
              <div class="stat-row">
                <span>正确题数</span>
                <span>{{ item.correctCount }}题</span>
              </div>
              <div class="stat-row">
                <span>错误题数</span>
                <span>{{ item.wrongCount }}题</span>
              </div>
              <div class="stat-row">
                <span>完成率</span>
                <span>{{ item.completionRate }}%</span>
              </div>
              <div class="stat-row">
                <span>正确率</span>
                <span>{{ item.accuracyRate }}%</span>
              </div>
            </div>
            <div class="progress-bar">
              <div class="progress" 
                   :style="{ 
                     width: `${item.percentage}%`,
                     backgroundColor: getScoreColor(item.percentage)
                   }">
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 题型完成情况 -->
      <div class="completion-analysis">
        <h3>题型完成情况</h3>
        <div class="completion-grid">
          <div v-for="(score, type) in scores" 
               :key="type"
               v-if="maxScores[type] > 0" 
               class="completion-card">
            <div class="completion-header">
              <span>{{ getQuestionTypeName(type) }}</span>
              <span class="completion-score">{{ score }}/{{ maxScores[type] }}</span>
            </div>
            <div class="completion-stats">
              <div class="stat-item">
                <span>完成率</span>
                <span>{{ getCompletionRate(type) }}%</span>
              </div>
              <div class="stat-item">
                <span>正确率</span>
                <span>{{ getAccuracyRate(type) }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 答题回顾区域 -->
      <div class="review-section">
        <h3>{{ t('paper.review') }}</h3>
        
        <!-- 选择题回顾 -->
        <div v-if="paper?.choice?.length" class="question-section">
          <div class="section-header">
            <h4>{{ t('paper.questionTypes.choice') }}</h4>
            <span class="section-score">{{ scores.choice }}/{{ maxScores.choice }}</span>
          </div>
          <div v-for="(question, index) in paper.choice" :key="index" class="question-item">
            <div class="question-header">
              <span class="question-number">{{ index + 1 }}</span>
              <span :class="['status-badge', answers.choice[index] === question.answer ? 'correct' : 'wrong']">
                {{ answers.choice[index] === question.answer ? t('paper.correct') : t('paper.wrong') }}
              </span>
            </div>
            <div class="question-content" v-html="formatQuestionContent(question.content)"></div>
            <div class="answer-comparison">
              <div class="user-answer" :class="{ correct: isChoiceCorrect(index) }">
                <strong>{{ t('paper.yourAnswer') }}：</strong>
                <span v-if="answers.choice[index]">{{ answers.choice[index] }}</span>
                <span v-else>{{ t('paper.noAnswer') }}</span>
              </div>
              <div class="correct-answer">
                <strong>{{ t('paper.correctAnswer') }}：</strong>
                {{ question.answer }}
              </div>
            </div>
          </div>
        </div>

        <!-- 编程题回顾 -->
        <div v-if="paper?.programming?.length" class="question-section">
          <div class="section-header">
            <h4>{{ t('paper.questionTypes.programming') }}</h4>
            <span class="section-score">{{ scores.programming }}/{{ maxScores.programming }}</span>
          </div>
          <div v-for="(question, index) in paper.programming" :key="index" class="question-item">
            <div class="question-header">
              <span class="question-number">{{ index + 1 }}</span>
              <span :class="['status-badge', answers.programming[index] === question.answer ? 'correct' : 'wrong']">
                {{ answers.programming[index] === question.answer ? t('paper.correct') : t('paper.wrong') }}
              </span>
            </div>
            <div class="question-content" v-html="formatQuestionContent(question.content)"></div>
            <!-- 添加示例输入输出 -->
            <div v-if="question.example" class="example-section">
              <div class="example-item">
                <div class="example-label">{{ t('paper.example.input') }}</div>
                <pre class="example-code">{{ question.example.input }}</pre>
              </div>
              <div class="example-item">
                <div class="example-label">{{ t('paper.example.output') }}</div>
                <pre class="example-code">{{ question.example.output }}</pre>
              </div>
            </div>
            <div class="answer-comparison">
              <div class="answer-item">
                <div class="answer-label">{{ t('paper.yourAnswer') }}</div>
                <pre :class="['answer-code', answers.programming[index] === question.answer ? 'correct' : 'wrong']">
                  {{ answers.programming[index] || t('paper.noAnswer') }}
                </pre>
              </div>
              <div class="answer-item">
                <div class="answer-label">{{ t('paper.correctAnswer') }}</div>
                <pre class="answer-code correct">{{ question.answer }}</pre>
              </div>
            </div>
          </div>
        </div>

        <!-- 填空题回顾 -->
        <div v-if="paper?.completion?.length" class="question-section">
          <div class="section-header">
            <h4>{{ t('paper.questionTypes.completion') }}</h4>
            <span class="section-score">{{ scores.completion }}/{{ maxScores.completion }}</span>
          </div>
          <div v-for="(question, index) in paper.completion" :key="index" class="question-item">
            <div class="question-header">
              <span class="question-number">{{ index + 1 }}</span>
              <span :class="['status-badge', answers.completion[index] === question.answer ? 'correct' : 'wrong']">
                {{ answers.completion[index] === question.answer ? t('paper.correct') : t('paper.wrong') }}
              </span>
            </div>
            <div class="question-content" v-html="formatQuestionContent(question.content)"></div>
            <div class="answer-comparison">
              <div class="answer-item">
                <div class="answer-label">{{ t('paper.yourAnswer') }}</div>
                <div :class="['answer-value', answers.completion[index] === question.answer ? 'correct' : 'wrong']">
                  {{ answers.completion[index] || t('paper.noAnswer') }}
                </div>
              </div>
              <div class="answer-item">
                <div class="answer-label">{{ t('paper.correctAnswer') }}</div>
                <div class="answer-value correct">{{ question.answer }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 判断题回顾 -->
        <div v-if="paper?.truefalse?.length" class="question-section">
          <div class="section-header">
            <h4>判断题</h4>
            <span class="section-score">{{ scores.truefalse }}/{{ maxScores.truefalse }}</span>
          </div>
          <div v-for="(question, index) in paper.truefalse" :key="index" class="question-item">
            <div class="question-header">
              <span class="question-number">{{ index + 1 }}</span>
              <span :class="['status-badge', answers.truefalse[index] === question.answer ? 'correct' : 'wrong']">
                {{ answers.truefalse[index] === question.answer ? t('paper.correct') : t('paper.wrong') }}
              </span>
            </div>
            <div class="question-content" v-html="formatQuestionContent(question.content)"></div>
            <div class="answer-review">
              <div class="answer-item">
                <div class="answer-label">{{ t('paper.yourAnswer') }}</div>
                <div :class="['answer-text', answers.truefalse[index] === question.answer ? 'correct' : 'wrong']">
                  {{ answers.truefalse[index] === null ? t('paper.noAnswer') : answers.truefalse[index] ? t('paper.true') : t('paper.false') }}
                </div>
              </div>
              <div class="answer-item">
                <div class="answer-label">{{ t('paper.correctAnswer') }}</div>
                <div class="answer-text correct">{{ question.answer ? t('paper.true') : t('paper.false') }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 简答题回顾 -->
        <div v-if="paper?.shortanswer?.length" class="question-section">
          <div class="section-header">
            <h4>简答题</h4>
            <span class="section-score">{{ scores.shortanswer }}/{{ maxScores.shortanswer }}</span>
          </div>
          <div v-for="(question, index) in paper.shortanswer" :key="index" class="question-item">
            <div class="question-header">
              <span class="question-number">{{ index + 1 }}</span>
              <span class="question-score">{{ question.score }}分</span>
            </div>
            <div class="question-content" v-html="formatQuestionContent(question.content)"></div>
            <div class="answer-review">
              <div class="answer-item">
                <div class="answer-label">{{ t('paper.yourAnswer') }}</div>
                <div class="answer-text">{{ answers.shortanswer[index] || t('paper.noAnswer') }}</div>
              </div>
              <div class="answer-item">
                <div class="answer-label">{{ t('paper.correctAnswer') }}</div>
                <div class="answer-text">{{ question.answer }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 匹配题回顾 -->
        <div v-if="paper?.matching?.length" class="question-section">
          <div class="section-header">
            <h4>匹配题</h4>
            <span class="section-score">{{ scores.matching }}/{{ maxScores.matching }}</span>
          </div>
          <div v-for="(question, index) in paper.matching" :key="index" class="question-item">
            <div class="question-header">
              <span class="question-number">{{ index + 1 }}</span>
              <span :class="['status-badge', isMatchingCorrect(index) ? 'correct' : 'wrong']">
                {{ isMatchingCorrect(index) ? t('paper.correct') : t('paper.wrong') }}
              </span>
            </div>
            <div class="question-content" v-html="formatQuestionContent(question.content)"></div>
            <div class="matching-review">
              <!-- 显示用户的匹配答案 -->
              <div class="user-matching">
                <div class="answer-label">{{ t('paper.yourAnswer') }}</div>
                <div v-for="(leftItem, leftIndex) in question.leftItems" :key="leftIndex" class="matching-pair">
                  <div class="left-item">{{ leftItem }}</div>
                  <span class="arrow">→</span>
                  <div class="right-item">
                    {{ answers.matching[index]?.[leftIndex] !== undefined ? 
                       question.rightItems[answers.matching[index][leftIndex]] : 
                       t('paper.noAnswer') }}
                  </div>
                </div>
              </div>
              <!-- 显示正确答案 -->
              <div class="correct-matching">
                <div class="answer-label">{{ t('paper.correctAnswer') }}</div>
                <div v-for="[leftIndex, rightIndex] in question.answer" :key="leftIndex" class="matching-pair">
                  <div class="left-item">{{ question.leftItems[leftIndex] }}</div>
                  <span class="arrow">→</span>
                  <div class="right-item">{{ question.rightItems[rightIndex] }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const { t } = useI18n()

const paper = ref(null)
const answers = ref(null)
const timeUsed = ref(0)
const scores = ref({
  choice: 0,
  programming: 0,
  completion: 0,
  truefalse: 0,
  shortanswer: 0,
  matching: 0
})
const maxScores = ref({
  choice: 0,
  programming: 0,
  completion: 0,
  truefalse: 0,
  shortanswer: 0,
  matching: 0
})

// 修改总分上限计算
const totalMaxScore = computed(() => {
  return Object.entries(paper.value || {}).reduce((total, [type, questions]) => {
    if (!Array.isArray(questions)) return total
    
    switch (type) {
      case 'choice':
      case 'completion':
      case 'truefalse':
        // 累加每道题的分数
        return total + questions.reduce((sum, q) => sum + (parseInt(q.score) || 0), 0)
      case 'programming':
        // 编程题固定10分
        return total + (questions.length > 0 ? 10 : 0)
      case 'shortanswer':
        // 简答题取第一道题的分数
        return total + (questions[0]?.score ? parseInt(questions[0].score) : 0)
      case 'matching':
        // 匹配题固定10分
        return total + (questions.length > 0 ? 10 : 0)
      default:
        return total
    }
  }, 0)
})

// 修改总分显示计算
const totalScore = computed(() => {
  let total = 0
  Object.entries(scores.value).forEach(([type, score]) => {
    if (paper.value?.[type]?.length > 0) {
      total += parseInt(score) || 0
    }
  })
  return total
})

// 修改总分百分比计算
const scorePercentage = computed(() => {
  let maxTotal = 0
  
  // 计算所有题型的总分
  Object.entries(maxScores.value).forEach(([type, score]) => {
    if (paper.value?.[type]?.length > 0) {
      maxTotal += score || 0
    }
  })
  
  if (maxTotal === 0) return 0
  return Math.round((totalScore.value / maxTotal) * 100) || 0
})

// 修改正确率计算
const accuracy = computed(() => {
  const total = correctCount.value + wrongCount.value
  if (total === 0) return 0
  return Math.round((correctCount.value / total) * 100) || 0
})

// 修改用时显示
const formattedTimeUsed = computed(() => {
  if (!timeUsed.value || isNaN(timeUsed.value)) return '未记录'
  
  const minutes = Math.floor(timeUsed.value / 60)
  const seconds = timeUsed.value % 60
  
  if (minutes === 0) {
    return `${seconds}秒`
  }
  return `${minutes}分${seconds}秒`
})

// 修改 getCorrectCount 函数
const getCorrectCount = (type) => {
  if (!paper.value?.[type] || !answers.value?.[type]) return 0
  
  try {
    return paper.value[type].filter((q, i) => {
      if (!q || !answers.value[type][i]) return false
      
      if (type === 'matching') {
        return JSON.stringify(answers.value[type][i]) === JSON.stringify(q.answer)
      }
      return answers.value[type][i] === q.answer
    }).length
  } catch (error) {
    console.error(`Error counting correct answers for ${type}:`, error)
    return 0
  }
}

// 修改 correctCount 计算属性
const correctCount = computed(() => {
  if (!paper.value || !answers.value) return 0
  
  let count = 0
  Object.entries(scores.value).forEach(([type, score]) => {
    if (type === 'shortanswer') return // 跳过简答题
    count += getCorrectCount(type)
  })
  return count
})

// 修改 wrongCount 计算属性
const wrongCount = computed(() => {
  if (!paper.value || !answers.value) return 0
  
  let count = 0
  Object.entries(scores.value).forEach(([type, score]) => {
    if (type === 'shortanswer') return // 跳过简答题
    count += getWrongCount(type)
  })
  return count
})

// 添加题型分析数据
const typeAnalysis = computed(() => {
  if (!paper.value || !answers.value) return []
  
  return Object.entries(scores.value).map(([type, score]) => {
    if (maxScores.value[type] === 0) return null
    
    return {
      type: getQuestionTypeName(type),
      score,
      maxScore: maxScores.value[type],
      percentage: Math.round((score / maxScores.value[type]) * 100),
      completionRate: getCompletionRate(type),
      accuracyRate: getAccuracyRate(type),
      questionCount: paper.value[type]?.length || 0,
      correctCount: getCorrectCount(type),
      wrongCount: getWrongCount(type)
    }
  }).filter(Boolean)
})

// 添加成绩等级评定
const scoreLevel = computed(() => {
  const percentage = Number(scorePercentage.value)
  if (percentage >= 90) return { text: '优秀', color: '#4CAF50' }
  if (percentage >= 80) return { text: '良好', color: '#2196F3' }
  if (percentage >= 70) return { text: '中等', color: '#FFC107' }
  if (percentage >= 60) return { text: '及格', color: '#FF9800' }
  return { text: '不及格', color: '#F44336' }
})

onMounted(() => {
  // 获取答案数据
  const savedData = localStorage.getItem('paperAnswers')
  const savedPaper = localStorage.getItem('currentPaper')
  
  let parsedAnswers = null
  let parsedPaper = null
  
  try {
    if (savedPaper) {
      parsedPaper = JSON.parse(savedPaper)
      paper.value = parsedPaper
    }
    
    if (savedData) {
      const data = JSON.parse(savedData)
      if (data.answers) {
        parsedAnswers = data.answers
        timeUsed.value = data.usedTime || 0
      } else {
        parsedAnswers = data
      }
      answers.value = parsedAnswers
    }
    
    // 只有当试卷和答案都存在时才计算分数
    if (parsedPaper && parsedAnswers) {
      calculateScores()
    }
  } catch (error) {
    console.error('Error parsing data:', error)
  }
})

// 修改格式化时间的函数
const formatTime = (seconds) => {
  if (typeof seconds !== 'number' || isNaN(seconds)) {
    return '0分0秒'
  }
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}分${remainingSeconds}秒`
}

// 修改计算分数的函数
const calculateScores = () => {
  // 重置分数
  Object.keys(scores.value).forEach(type => {
    scores.value[type] = 0
    maxScores.value[type] = 0
  })
  
  // 如果没有试卷或答案数据，直接返回
  if (!paper.value || !answers.value) return
  
  // 遍历所有题型计算分数
  Object.entries(paper.value).forEach(([type, questions]) => {
    if (!Array.isArray(questions)) return

    questions.forEach((q, i) => {
      // 确保分数是有效数字
      const questionScore = parseInt(q.score) || 0

      switch (type) {
        case 'choice':
        case 'completion':
        case 'truefalse':
          maxScores.value[type] += questionScore
          if (answers.value[type] && answers.value[type][i] === q.answer) {
            scores.value[type] += questionScore
          }
          break
        case 'programming':
          // 编程题每道题10分
          maxScores.value[type] = 10
          if (answers.value[type] && answers.value[type][i]?.trim() === q.answer?.trim()) {
            scores.value[type] = 10
          }
          break
        case 'shortanswer':
          // 简答题只计算一次总分
          maxScores.value[type] = questionScore
          break
        case 'matching':
          // 匹配题每道题10分
          maxScores.value[type] = 10
          if (isMatchingCorrect(i)) {
            scores.value[type] = 10
          }
          break
      }
    })
  })
}

// 修改匹配题判断函数
const isMatchingCorrect = (index) => {
  if (!paper.value?.matching?.[index] || !answers.value?.matching?.[index]) return false
  
  const question = paper.value.matching[index]
  const answer = answers.value.matching[index]
  
  // 确保答案数组完整且所有选项都已选择
  if (!Array.isArray(answer) || answer.length !== question.leftItems.length) return false
  
  // 检查每个匹配是否正确
  return question.answer.every(([leftIndex, rightIndex]) => answer[leftIndex] === rightIndex)
}

// 添加返回按钮处理函数
const handleBack = () => {
  // 清除答案数据
  localStorage.removeItem('paperAnswers')
  // 返回到试卷生成页面
  router.push('/create-paper')
}

// 添加新的方法
const getQuestionTypeName = (type) => {
  const types = {
    choice: '选择题',
    programming: '编程题',
    completion: '填空题',
    truefalse: '判断题',
    shortanswer: '简答题',
    matching: '匹配题'
  }
  return types[type]
}

const getScoreColor = (percentage) => {
  if (percentage >= 90) return '#4CAF50'
  if (percentage >= 75) return '#2196F3'
  if (percentage >= 60) return '#FFC107'
  return '#F44336'
}

// 修改 getWrongCount 函数
const getWrongCount = (type) => {
  if (!paper.value?.[type] || !answers.value?.[type]) return 0
  
  try {
    const totalQuestions = paper.value[type].length
    const correctAnswers = getCorrectCount(type)
    return totalQuestions - correctAnswers
  } catch (error) {
    console.error(`Error counting wrong answers for ${type}:`, error)
    return 0
  }
}

// 修改 getCompletionRate 函数
const getCompletionRate = (type) => {
  if (!paper.value?.[type] || !answers.value?.[type]) return 0
  const answered = answers.value[type].filter(a => a !== null && a !== '').length
  return Math.round((answered / paper.value[type].length) * 100)
}

// 修改 getAccuracyRate 函数
const getAccuracyRate = (type) => {
  if (!paper.value?.[type] || !answers.value?.[type] || type === 'shortanswer') return 0
  return Math.round((getCorrectCount(type) / paper.value[type].length) * 100)
}

// 添加代码格式化函数
const formatQuestionContent = (content) => {
  if (!content) return ''
  
  // 使用正则表达式匹配代码块
  return content.replace(/```([\s\S]*?)```/g, (match, code) => {
    return `<pre class="code-block"><code>${escapeHtml(code.trim())}</code></pre>`
  }).replace(/`([^`]+)`/g, (match, code) => {
    return `<code class="inline-code">${escapeHtml(code)}</code>`
  })
}

// HTML转义函数
const escapeHtml = (unsafe) => {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

const checkAnswer = (question, userAnswer) => {
  if (!userAnswer) return false
  
  // 处理选择题答案
  if (question.type === 'choice') {
    // 将用户答案转换为大写字母
    const normalizedUserAnswer = typeof userAnswer === 'string' 
      ? userAnswer.toUpperCase() 
      : String.fromCharCode(65 + Number(userAnswer))
    
    // 将正确答案转换为大写字母
    const normalizedCorrectAnswer = typeof question.answer === 'string'
      ? question.answer.toUpperCase()
      : String.fromCharCode(65 + Number(question.answer))
      
    return normalizedUserAnswer === normalizedCorrectAnswer
  }
  
  // 处理判断题答案
  if (question.type === 'truefalse') {
    return userAnswer === question.answer
  }
  
  // 处理其他类型题目
  return userAnswer === question.answer
}

const calculateScore = () => {
  let totalScore = 0
  
  // 计算选择题分数
  paper.value.choice?.forEach((q, index) => {
    if (checkAnswer(q, userAnswers.value.choice?.[index])) {
      totalScore += q.score
    }
  })
  
  // 计算判断题分数
  paper.value.truefalse?.forEach((q, index) => {
    if (checkAnswer(q, userAnswers.value.truefalse?.[index])) {
      totalScore += q.score
    }
  })
  
  // ... 其他题型的分数计算
  
  return totalScore
}

// 修改选择题判断函数
const isChoiceCorrect = (index) => {
  if (!paper.value?.choice?.[index] || !answers.value?.choice?.[index]) return false
  
  const userAnswer = answers.value.choice[index]
  const correctAnswer = paper.value.choice[index].answer
  
  return userAnswer === correctAnswer
}

// 添加获取用户答案显示文本的函数
const getUserAnswerText = (type, index) => {
  if (!answers.value?.[type]?.[index]) return t('paper.noAnswer')
  
  switch (type) {
    case 'choice':
      return answers.value.choice[index] || t('paper.noAnswer')
    case 'truefalse':
      return answers.value.truefalse[index] ? t('paper.true') : t('paper.false')
    case 'programming':
    case 'completion':
    case 'shortanswer':
      return answers.value[type][index] || t('paper.noAnswer')
    case 'matching':
      if (!answers.value.matching[index]) return t('paper.noAnswer')
      return formatMatchingAnswer(answers.value.matching[index])
    default:
      return t('paper.noAnswer')
  }
}

// 添加获取正确答案显示文本的函数
const getCorrectAnswerText = (type, index) => {
  if (!paper.value?.[type]?.[index]) return ''
  
  switch (type) {
    case 'choice':
      return paper.value.choice[index].answer
    case 'truefalse':
      return paper.value.truefalse[index].answer ? t('paper.true') : t('paper.false')
    case 'programming':
    case 'completion':
    case 'shortanswer':
      return paper.value[type][index].answer
    case 'matching':
      return formatMatchingAnswer(paper.value.matching[index].answer)
    default:
      return ''
  }
}
</script>

<style scoped>
.paper-result {
  min-height: 100vh;
  background: #f5f7ff;
}

.header {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  padding: 16px 0;
  color: #333;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.left-section {
  display: flex;
  align-items: center;
  gap: 20px;
}

.back-button {
  position: relative;
  border: none;
  background: transparent;
  padding: 8px 16px;
  color: #666;
  font-size: 16px;
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.button-content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 8px;
}

.button-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.05);
  transform: translateX(-100%);
  transition: transform 0.3s ease;
}

.back-button:hover .button-background {
  transform: translateX(0);
}

.back-button:hover {
  transform: translateY(-2px);
  color: #1a73e8;
}

.back-button:active {
  transform: translateY(0);
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
  color: #333;
}

.main-content {
  max-width: 1200px;
  margin: 32px auto;
  padding: 0 20px;
}

.result-card {
  background: white;
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.score-overview {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 32px;
  margin-bottom: 48px;
}

.total-score-card {
  text-align: center;
}

.score-circle {
  position: relative;
  width: 200px;
  height: 200px;
  margin: 0 auto 16px;
}

.score-circle-svg {
  transform: rotate(-90deg);
  overflow: visible;
}

.score-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.current-score {
  font-size: 48px;
  font-weight: bold;
  color: #4CAF50;
}

.total-score {
  font-size: 24px;
  color: #666;
}

.score-label {
  font-size: 18px;
  color: #333;
  font-weight: 500;
}

.score-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.score-type-card {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 16px;
  transition: transform 0.3s ease;
}

.score-type-card:hover {
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.card-title {
  font-weight: 500;
  color: #333;
}

.card-score {
  font-weight: bold;
  color: #4CAF50;
}

.progress-bar {
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.progress {
  height: 100%;
  background: #4CAF50;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.review-section {
  margin-top: 48px;
  border-top: 1px solid #eee;
  padding-top: 32px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-score {
  font-size: 18px;
  font-weight: 500;
  color: #4CAF50;
}

.question-item {
  background: #f8f9fa;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 20px;
}

.question-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.question-number {
  width: 32px;
  height: 32px;
  background: #1a73e8;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
}

.status-badge.correct {
  background: #e8f5e9;
  color: #2e7d32;
}

.status-badge.wrong {
  background: #ffebee;
  color: #c62828;
}

.answer-comparison {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px dashed #ddd;
}

.answer-item {
  background: white;
  padding: 16px;
  border-radius: 12px;
}

.answer-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.answer-value {
  font-weight: 500;
  padding: 8px 12px;
  border-radius: 8px;
}

.answer-value.correct {
  background: #e8f5e9;
  color: #2e7d32;
}

.answer-value.wrong {
  background: #ffebee;
  color: #c62828;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.question-item {
  animation: slideIn 0.3s ease;
}

.example-section {
  margin: 16px 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.example-item {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 12px;
}

.example-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.example-code, .answer-code {
  font-family: 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.5;
  padding: 12px;
  border-radius: 8px;
  background: #f1f3f4;
  overflow-x: auto;
  white-space: pre-wrap;
  margin: 0;
}

.answer-code {
  background: #fff;
}

.answer-code.correct {
  background: #e8f5e9;
  color: #2e7d32;
}

.answer-code.wrong {
  background: #ffebee;
  color: #c62828;
}

.matching-review {
  margin-top: 16px;
  display: grid;
  gap: 24px;
}

.matching-pair {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.left-item, .right-item {
  padding: 8px 12px;
  background: #f5f7ff;
  border-radius: 6px;
  flex: 1;
}

.arrow {
  color: #666;
  font-weight: bold;
}

.correct-matching {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px dashed #eee;
}

.answer-text {
  white-space: pre-wrap;
  background: #f8f9fa;
  padding: 12px;
  border-radius: 8px;
  font-family: inherit;
}

.result-overview {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 24px;
  margin-bottom: 32px;
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.stat-card {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  text-align: center;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #1a73e8;
  margin-bottom: 8px;
}

.stat-label {
  color: #666;
  font-size: 14px;
}

.chart-container {
  margin-top: 16px;
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.bar-chart {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.chart-bar {
  display: flex;
  align-items: center;
  gap: 16px;
}

.bar-label {
  width: 80px;
  text-align: right;
  color: #666;
}

.bar-wrapper {
  flex: 1;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}

.bar {
  height: 24px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  color: white;
  font-size: 14px;
  transition: width 0.3s ease;
}

.completion-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.completion-card {
  background: white;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.completion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #eee;
}

.completion-score {
  font-weight: 600;
  color: #1a73e8;
}

.completion-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-item span:first-child {
  color: #666;
  font-size: 14px;
}

.stat-item span:last-child {
  font-weight: 600;
  color: #1a73e8;
}

.score-level {
  position: absolute;
  top: -12px;
  right: -12px;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 18px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background: white;
}

.analysis-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.analysis-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.analysis-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.score-badge {
  padding: 4px 12px;
  border-radius: 16px;
  color: white;
  font-weight: 500;
}

.analysis-stats {
  margin-bottom: 16px;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px dashed #eee;
}

.stat-row:last-child {
  border-bottom: none;
}

.stat-icon {
  color: #1a73e8;
  margin-bottom: 8px;
}

.result-overview {
  position: relative;
  overflow: hidden;
}

.score-circle {
  position: relative;
  width: 180px;
  height: 180px;
  margin: 0 auto;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
}

.stats-cards {
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border-radius: 16px;
  padding: 24px;
}

.stat-card {
  transform: translateY(0);
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
}

@media (max-width: 768px) {
  .result-overview {
    grid-template-columns: 1fr;
  }
  
  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .analysis-grid {
    grid-template-columns: 1fr;
  }

  .header-content {
    padding: 0 16px;
  }

  .left-section {
    gap: 12px;
  }

  .page-title {
    font-size: 20px;
  }
}

/* 添加代码块样式 */
:deep(.code-block) {
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 16px;
  border-radius: 8px;
  margin: 12px 0;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.5;
  overflow-x: auto;
  white-space: pre;
}

:deep(.inline-code) {
  background: #f3f3f3;
  color: #e83e8c;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 0.9em;
}

/* 添加代码高亮样式 */
:deep(.code-block) {
  position: relative;
}

:deep(.code-block::before) {
  content: 'Code';
  position: absolute;
  top: 0;
  right: 0;
  background: #333;
  color: #fff;
  padding: 2px 8px;
  font-size: 12px;
  border-radius: 0 8px 0 8px;
  opacity: 0.8;
}

/* 优化代码块滚动条 */
:deep(.code-block::-webkit-scrollbar) {
  height: 8px;
}

:deep(.code-block::-webkit-scrollbar-track) {
  background: #2d2d2d;
  border-radius: 4px;
}

:deep(.code-block::-webkit-scrollbar-thumb) {
  background: #666;
  border-radius: 4px;
}

:deep(.code-block::-webkit-scrollbar-thumb:hover) {
  background: #888;
}

/* 添加行号样式 */
:deep(.code-block code) {
  counter-reset: line;
  display: block;
}

:deep(.code-block code > span) {
  display: block;
  line-height: 1.5;
  position: relative;
  padding-left: 3em;
}

:deep(.code-block code > span::before) {
  counter-increment: line;
  content: counter(line);
  position: absolute;
  left: -1em;
  width: 2.5em;
  text-align: right;
  color: #666;
  padding-right: 1em;
  border-right: 1px solid #444;
}

/* 优化答案代码显示 */
.answer-code {
  background: #1e1e1e !important;
  color: #d4d4d4 !important;
  padding: 16px !important;
  border-radius: 8px !important;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace !important;
  font-size: 14px !important;
  line-height: 1.5 !important;
  overflow-x: auto !important;
  white-space: pre !important;
  margin: 12px 0 !important;
}

.answer-code.correct {
  border-left: 4px solid #4CAF50 !important;
}

.answer-code.wrong {
  border-left: 4px solid #F44336 !important;
}

/* 优化问题内容的整体样式 */
.question-content {
  font-size: 16px;
  line-height: 1.6;
  color: #333;
  margin: 16px 0;
}

.question-content p {
  margin: 12px 0;
}
</style> 