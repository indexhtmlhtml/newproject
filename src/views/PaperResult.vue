<template>
  <div class="paper-result">
    <header class="header">
      <div class="header-content">
        <button class="back-btn" @click="handleBack">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
          {{ t('common.back') }}
        </button>
        <h1>{{ paper?.title || t('paper.defaultTitle') }}</h1>
      </div>
    </header>

    <main class="main-content">
      <div class="result-card">
        <!-- 总分展示区域 -->
        <div class="score-overview">
          <div class="total-score-card">
            <div class="score-circle">
              <svg viewBox="0 0 36 36" class="score-circle-svg">
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#eee" stroke-width="3"/>
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#4CAF50" stroke-width="3" :stroke-dasharray="`${scorePercentage}, 100`"/>
              </svg>
              <div class="score-text">
                <span class="current-score">{{ totalScore }}</span>
                <span class="total-score">/{{ paper?.totalScore || 100 }}</span>
              </div>
            </div>
            <div class="score-label">{{ t('paper.totalScore') }}</div>
          </div>

          <!-- 分类得分卡片 -->
          <div class="score-cards">
            <div class="score-type-card" v-for="(score, type) in scores" :key="type">
              <div class="card-header">
                <span class="card-title">{{ t(`paper.questionTypes.${type}`) }}</span>
                <span class="card-score">{{ score }}/{{ maxScores[type] }}</span>
              </div>
              <div class="progress-bar">
                <div class="progress" :style="{ width: `${(score/maxScores[type])*100}%` }"></div>
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
              <div class="question-content">{{ question.content }}</div>
              <div class="answer-comparison">
                <div class="answer-item">
                  <div class="answer-label">{{ t('paper.yourAnswer') }}</div>
                  <div :class="['answer-value', answers.choice[index] === question.answer ? 'correct' : 'wrong']">
                    {{ answers.choice[index] || t('paper.noAnswer') }}
                  </div>
                </div>
                <div class="answer-item">
                  <div class="answer-label">{{ t('paper.correctAnswer') }}</div>
                  <div class="answer-value correct">{{ question.answer }}</div>
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
              <div class="question-content">{{ question.content }}</div>
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
              <div class="question-content">{{ question.content }}</div>
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
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const { t } = useI18n()

const paper = ref(null)
const answers = ref(null)
const scores = ref({ choice: 0, programming: 0, completion: 0 })
const maxScores = ref({ choice: 0, programming: 0, completion: 0 })

const totalScore = computed(() => {
  return scores.value.choice + scores.value.programming + scores.value.completion
})

onMounted(() => {
  // 从 localStorage 获取试卷和答案数据
  const paperData = localStorage.getItem('currentPaper')
  const answersData = localStorage.getItem('paperAnswers')
  
  if (paperData && answersData) {
    paper.value = JSON.parse(paperData)
    answers.value = JSON.parse(answersData)
    calculateScores()
  } else {
    router.push('/home')
  }
})

const calculateScores = () => {
  // 计算各题型得分
  if (paper.value.choice) {
    scores.value.choice = paper.value.choice.reduce((sum, q, i) => {
      maxScores.value.choice += q.score
      return sum + (answers.value.choice[i] === q.answer ? q.score : 0)
    }, 0)
  }
  
  // 编程题和填空题的得分计算
  if (paper.value.programming) {
    scores.value.programming = paper.value.programming.reduce((sum, q, i) => {
      maxScores.value.programming += q.score
      // 这里可以添加更复杂的评分逻辑
      return sum + (answers.value.programming[i] === q.answer ? q.score : 0)
    }, 0)
  }

  if (paper.value.completion) {
    scores.value.completion = paper.value.completion.reduce((sum, q, i) => {
      maxScores.value.completion += q.score
      return sum + (answers.value.completion[i] === q.answer ? q.score : 0)
    }, 0)
  }
}

// 添加返回按钮处理函数
const handleBack = () => {
  // 清除答案数据
  localStorage.removeItem('paperAnswers')
  // 返回到试卷生成页面
  router.push('/create-paper')
}
</script>

<style scoped>
.paper-result {
  min-height: 100vh;
  background: #f5f7ff;
}

.header {
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 16px 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  gap: 16px;
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
</style> 