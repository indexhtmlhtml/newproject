<template>
  <div class="create-paper">
    <header class="header">
      <div class="header-content">
        <div class="left-section">
          <button class="back-btn" @click="router.back()">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
            {{ t('common.back') }}
          </button>
          <h1 class="page-title">{{ t('paper.title') }}</h1>
        </div>
      </div>
    </header>

    <main class="main-content">
      <div class="paper-container">
        <!-- 左侧配置区域 -->
        <section class="config-section">
          <div class="section-header">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path fill="currentColor" d="M19.14 12.94c.04-.3.06-.61.06-.94c0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6s3.6 1.62 3.6 3.6s-1.62 3.6-3.6 3.6z"/>
            </svg>
            <h2>{{ t('paper.settings') }}</h2>
          </div>

          <!-- 题型配置 -->
          <div class="question-types">
            <div class="section-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                <path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/>
                <path fill="currentColor" d="M11 7h2v10h-2zm-4 4h10v2H7z"/>
              </svg>
              <h3>{{ t('paper.questionTypes.title') }}</h3>
            </div>

            <div class="type-grid">
              <div v-for="type in questionTypes" :key="type.id" class="type-item">
                <label>{{ t(`paper.questionTypes.${type.id}`) }}</label>
                <div class="type-controls">
                  <input 
                    type="number" 
                    v-model="type.count" 
                    min="0" 
                    :max="type.max"
                  >
                  <span class="count-label">题</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 难度选择 -->
          <div class="difficulty-section">
            <div class="section-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 2L4 8v12h16V8l-8-6zm0 2.8L18 10v8H6v-8l6-5.2z"/>
              </svg>
              <h3>{{ t('paper.difficulty') }}</h3>
            </div>

            <div class="difficulty-options">
              <label 
                v-for="diff in difficulties" 
                :key="diff.value" 
                class="difficulty-option"
              >
                <input 
                  type="radio" 
                  v-model="selectedDifficulty" 
                  :value="diff.value"
                >
                <span>{{ t(`problems.${diff.value}`) }}</span>
              </label>
            </div>
          </div>

          <!-- 时长设置 -->
          <div class="duration-section">
            <div class="section-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                <path fill="currentColor" d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8s8 3.58 8 8s-3.58 8-8 8zm.5-13H11v6l5.25 3.15l.75-1.23l-4.5-2.67z"/>
              </svg>
              <h3>{{ t('paper.duration') }}</h3>
            </div>

            <div class="duration-control">
              <input 
                type="range" 
                v-model="duration" 
                min="30" 
                max="180" 
                step="30"
              >
              <span class="duration-value">{{ duration }} min</span>
            </div>
          </div>

          <!-- 总分设置 -->
          <div class="score-section">
            <div class="section-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                <path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/>
                <path fill="currentColor" d="M11 7h2v10h-2zm-4 4h10v2H7z"/>
              </svg>
              <h3>{{ t('paper.totalScore') }}</h3>
            </div>

            <input 
              type="number" 
              v-model="totalScore" 
              min="50" 
              max="150" 
              step="10"
              class="score-input"
            >
          </div>

          <!-- 生成按钮 -->
          <button 
            class="generate-btn" 
            @click="handleGeneratePaper"
            :disabled="isGenerating || !isValid"
          >
            <div class="btn-content">
              <span v-if="!isGenerating">{{ t('paper.generate') }}</span>
              <div v-else class="generating-status">
                <div class="progress-bar">
                  <div class="progress-indicator"></div>
                </div>
                <span class="status-text">{{ generatingStatus }}</span>
              </div>
            </div>
          </button>
        </section>

        <!-- 右侧预览区域 -->
        <section v-if="paper" class="preview-section">
          <div class="preview-header">
            <h2>{{ t('paper.preview') }}</h2>
            <div class="preview-actions">
              <button class="start-solve-btn" @click="startSolving" v-if="!isGenerating">
                <div class="btn-content">
                  <div class="btn-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5l-6 4.5z"/>
                    </svg>
                  </div>
                  <div class="btn-text">
                    <span class="primary-text">{{ t('paper.startSolving') }}</span>
                    <span class="secondary-text">{{ duration }}分钟</span>
                  </div>
                </div>
              </button>
              <button class="download-btn" @click="downloadPaper">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                </svg>
                {{ t('paper.download') }}
              </button>
            </div>
          </div>
          
          <div class="paper-preview">
            <div class="paper-header">
              <h3>{{ paper.title || t('paper.defaultTitle') }}</h3>
              <div class="paper-info">
                <span>{{ t('paper.duration') }}: {{ duration }}分钟</span>
                <span>{{ t('paper.totalScore') }}: {{ totalScore }}分</span>
                <span>{{ t('paper.difficulty') }}: {{ t(`problems.${selectedDifficulty}`) }}</span>
              </div>
            </div>
            
            <div class="questions-section">
              <!-- 选择题部分 -->
              <div v-if="paper.choice && paper.choice.length" class="question-type-section">
                <h4>{{ t('paper.questionTypes.choice') }}</h4>
                <div class="questions-list">
                  <div v-for="(question, index) in paper.choice" :key="index" class="question-item">
                    <div class="question-header">
                      <span class="question-number">{{ index + 1 }}</span>
                      <span class="question-score">({{ question.score }}分)</span>
                    </div>
                    <div class="question-content">{{ question.content }}</div>
                    <div class="options-list">
                      <div v-for="(option, key) in question.options" :key="key" class="option-item">
                        <span class="option-label">{{ key }}.</span>
                        <span class="option-content">{{ option }}</span>
                      </div>
                    </div>
                    <div class="question-footer">
                      <div class="answer-section" v-if="showAnswers[`choice_${index}`]">
                        <div class="question-answer">
                          <strong>{{ t('paper.answer') }}:</strong> {{ question.answer }}
                        </div>
                      </div>
                      <div class="question-actions">
                        <button class="answer-btn" @click="toggleAnswer('choice', index)">
                          {{ showAnswers[`choice_${index}`] ? t('problems.hideAnswer') : t('problems.showAnswer') }}
                        </button>
                        <button class="solve-btn" @click="solveProblem(question, 'choice', index)">
                          {{ t('problems.solve') }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 编程题部分 -->
              <div v-if="paper.programming && paper.programming.length" class="question-type-section">
                <h4>{{ t('paper.questionTypes.programming') }}</h4>
                <div class="questions-list">
                  <div v-for="(question, index) in paper.programming" :key="index" class="question-item">
                    <div class="question-header">
                      <span class="question-number">{{ index + 1 }}</span>
                      <span class="question-score">({{ question.score }}分)</span>
                    </div>
                    <div class="question-content">{{ question.content }}</div>
                    <div v-if="question.example" class="example-section">
                      <div class="example-input">
                        <strong>{{ t('paper.example.input') }}:</strong>
                        <pre>{{ question.example.input }}</pre>
                      </div>
                      <div class="example-output">
                        <strong>{{ t('paper.example.output') }}:</strong>
                        <pre>{{ question.example.output }}</pre>
                      </div>
                    </div>
                    <div class="question-footer">
                      <div class="answer-section" v-if="showAnswers[`programming_${index}`]">
                        <div class="question-answer">
                          <strong>{{ t('paper.answer') }}:</strong>
                          <pre>{{ question.answer }}</pre>
                        </div>
                      </div>
                      <div class="question-actions">
                        <button class="answer-btn" @click="toggleAnswer('programming', index)">
                          {{ showAnswers[`programming_${index}`] ? t('problems.hideAnswer') : t('problems.showAnswer') }}
                        </button>
                        <button class="solve-btn" @click="solveProblem(question, 'programming', index)">
                          {{ t('problems.solve') }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 填空题部分 -->
              <div v-if="paper.completion && paper.completion.length" class="question-type-section">
                <h4>{{ t('paper.questionTypes.completion') }}</h4>
                <div class="questions-list">
                  <div v-for="(question, index) in paper.completion" :key="index" class="question-item">
                    <div class="question-header">
                      <span class="question-number">{{ index + 1 }}</span>
                      <span class="question-score">({{ question.score }}分)</span>
                    </div>
                    <div class="question-content">{{ question.content }}</div>
                    <div class="question-footer">
                      <div class="answer-section" v-if="showAnswers[`completion_${index}`]">
                        <div class="question-answer">
                          <strong>{{ t('paper.answer') }}:</strong> {{ question.answer }}
                        </div>
                      </div>
                      <div class="question-actions">
                        <button class="answer-btn" @click="toggleAnswer('completion', index)">
                          {{ showAnswers[`completion_${index}`] ? t('problems.hideAnswer') : t('problems.showAnswer') }}
                        </button>
                        <button class="solve-btn" @click="solveProblem(question, 'completion', index)">
                          {{ t('problems.solve') }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 生成中的加载动画 -->
        <div v-if="isGenerating && !paper" class="generating-overlay">
          <div class="generating-animation">
            <svg class="paper-icon" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/>
              <path d="M11 7h2v10h-2zm-4 4h10v2H7z"/>
            </svg>
            <div class="generating-text">
              {{ generatingStatus }}
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useLanguageStore } from '../stores/language'
import { useI18n } from 'vue-i18n'
import { generatePaper as generatePaperAPI } from '../services/paper'
import { downloadPaperAsWord } from '../utils/download'

const router = useRouter()
const languageStore = useLanguageStore()
const { t } = useI18n()

// 题型配置
const questionTypes = ref([
  { id: 'choice', name: '选择题', count: 5, max: 10, score: 4 },
  { id: 'programming', name: '编程题', count: 2, max: 5, score: 15 },
  { id: 'completion', name: '填空题', count: 3, max: 5, score: 5 }
])

// 难度配置
const difficulties = [
  { value: 'easy', label: '简单' },
  { value: 'medium', label: '中等' },
  { value: 'hard', label: '困难' }
]

const selectedDifficulty = ref('medium')
const duration = ref(90)
const totalScore = ref(100)
const isGenerating = ref(false)
const generatingStatus = ref('')
const generatingSteps = [
  '正在分析题型要求...',
  '正在设计题目结构...',
  '正在生成题目内容...',
  '正在优化答案解析...',
  '正在完善试卷格式...'
]
let statusInterval
const paper = ref(null)

// 添加答案显示状态管理
const showAnswers = ref({})

// 切换答案显示/隐藏
const toggleAnswer = (type, index) => {
  const key = `${type}_${index}`
  showAnswers.value[key] = !showAnswers.value[key]
}

// 验证配置是否有效
const isValid = computed(() => {
  const hasQuestions = questionTypes.value.some(type => type.count > 0)
  const totalQuestions = questionTypes.value.reduce((sum, type) => sum + type.count, 0)
  return hasQuestions && totalQuestions <= 20
})

// 生成试卷
const handleGeneratePaper = async () => {
  if (!isValid.value || isGenerating.value) return
  
  try {
    isGenerating.value = true
    // 开始状态更新循环
    let stepIndex = 0
    generatingStatus.value = generatingSteps[0]
    statusInterval = setInterval(() => {
      stepIndex = (stepIndex + 1) % generatingSteps.length
      generatingStatus.value = generatingSteps[stepIndex]
    }, 3000)

    const params = {
      duration: duration.value,
      totalScore: totalScore.value,
      difficulty: selectedDifficulty.value,
      questionTypes: questionTypes.value.reduce((acc, type) => {
        acc[type.id] = {
          name: type.name,
          count: type.count,
          score: type.score
        }
        return acc
      }, {}),
      language: languageStore.currentLanguage
    }

    const result = await generatePaperAPI(params)
    paper.value = result
  } catch (error) {
    console.error('Failed to generate paper:', error)
    alert(t('paper.generateError'))
  } finally {
    isGenerating.value = false
    clearInterval(statusInterval)
  }
}

const downloadPaper = () => {
  if (!paper.value) return
  downloadPaperAsWord(paper.value)
}

const startSolving = () => {
  if (paper.value) {
    // 保存试卷数据到 localStorage
    localStorage.setItem('currentPaper', JSON.stringify({
      ...paper.value,
      duration: duration.value,
      totalScore: totalScore.value
    }))
    // 跳转到答题页面
    router.push('/solve-paper')
  }
}

// 添加做题方法
const solveProblem = (question, type, index) => {
  // 保存当前题目信息到 localStorage
  localStorage.setItem('currentQuestion', JSON.stringify({
    question,
    type,
    index,
    paperTitle: paper.value.title || t('paper.defaultTitle')
  }))
  // 跳转到做题页面
  router.push('/solve-problem')
}
</script>

<style scoped>
.create-paper {
  min-height: 100vh;
  background: #f5f7ff;
}

.header {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 16px 0;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
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
  padding: 8px 16px;
  border: none;
  background: none;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-btn:hover {
  color: #4F6EF7;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.paper-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 32px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  color: #4F6EF7;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  color: #666;
}

.config-section {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
}

.type-grid {
  display: grid;
  gap: 16px;
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
}

.type-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  background: white;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.type-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.type-controls input {
  width: 60px;
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.difficulty-options {
  display: flex;
  gap: 12px;
}

.difficulty-option {
  flex: 1;
}

.difficulty-option input[type="radio"] {
  display: none;
}

.difficulty-option span {
  display: block;
  padding: 8px;
  text-align: center;
  background: #f5f7ff;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.difficulty-option input[type="radio"]:checked + span {
  background: #4F6EF7;
  color: white;
}

.duration-control {
  display: flex;
  align-items: center;
  gap: 16px;
}

.duration-control input[type="range"] {
  flex: 1;
}

.generate-btn {
  width: 100%;
  padding: 12px;
  background: #4F6EF7;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
  overflow: hidden;
}

.generate-btn:hover:not(:disabled) {
  background: #3D5CE5;
  transform: translateY(-1px);
}

.generate-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.btn-content {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 24px;
}

.preview-section {
  padding: 24px;
  background: #f8f9fa;
  overflow-y: auto;
  max-height: 800px;
}

.loading-spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255,255,255,0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .paper-config {
    grid-template-columns: 1fr;
  }
  
  .config-section {
    border-right: none;
    border-bottom: 1px solid #eee;
  }
}

.paper-preview {
  background: white;
  padding: 32px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.paper-header {
  text-align: center;
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 2px solid #eee;
}

.paper-header h3 {
  font-size: 24px;
  margin-bottom: 16px;
}

.paper-info {
  display: flex;
  justify-content: center;
  gap: 24px;
  color: #666;
}

.question-type-section {
  margin-bottom: 32px;
}

.question-type-section h4 {
  font-size: 18px;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
}

.question-item {
  margin-bottom: 24px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.question-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.question-number {
  font-weight: bold;
}

.question-score {
  color: #666;
}

.question-content {
  margin-bottom: 16px;
  line-height: 1.6;
}

.options-list {
  display: grid;
  gap: 12px;
  margin-bottom: 16px;
}

.option-item {
  display: flex;
  gap: 8px;
}

.option-label {
  font-weight: bold;
  min-width: 24px;
}

.example-section {
  margin: 16px 0;
  padding: 16px;
  background: white;
  border-radius: 4px;
}

.example-section pre {
  margin: 8px 0;
  padding: 8px;
  background: #f1f3f5;
  border-radius: 4px;
  overflow-x: auto;
}

.question-answer {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px dashed #ddd;
}

.question-answer pre {
  margin-top: 8px;
  padding: 12px;
  background: #f1f3f5;
  border-radius: 4px;
  overflow-x: auto;
}

.score-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.preview-actions {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}

.start-solve-btn {
  display: flex;
  align-items: center;
  padding: 16px 32px;
  background: #1a73e8;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 20px rgba(26, 115, 232, 0.2);
}

.start-solve-btn:hover {
  background: #1557b0;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(26, 115, 232, 0.3);
}

.btn-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.btn-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: white;
}

.btn-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  color: white;
}

.primary-text {
  font-size: 18px;
  font-weight: 600;
}

.secondary-text {
  font-size: 14px;
  opacity: 0.8;
}

.download-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #4F6EF7;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.download-btn:hover {
  background: #3D5CE5;
  transform: translateY(-1px);
}

.download-btn svg {
  transition: transform 0.3s ease;
}

.download-btn:hover svg {
  transform: translateY(2px);
}

.generating-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.generating-animation {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.paper-icon {
  width: 64px;
  height: 64px;
  fill: #4F6EF7;
  animation: pulse 2s infinite;
}

.generating-text {
  font-size: 18px;
  color: #333;
  text-align: center;
  min-width: 200px;
}

.generating-status {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.progress-bar {
  width: 100%;
  height: 4px;
  background: rgba(79, 110, 247, 0.2);
  border-radius: 2px;
  overflow: hidden;
}

.progress-indicator {
  height: 100%;
  background: #4F6EF7;
  width: 30%;
  border-radius: 2px;
  animation: progress 2s infinite;
}

.status-text {
  font-size: 14px;
  color: #666;
  white-space: nowrap;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}

@keyframes progress {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(400%);
  }
}

.paper-actions {
  display: flex;
  gap: 16px;
  margin-top: 16px;
}

.start-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 24px;
  background: var(--vt-c-primary);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.start-btn:hover {
  background: var(--vt-c-secondary);
  transform: translateY(-2px);
}

.start-btn svg {
  width: 20px;
  height: 20px;
}

.question-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

.solve-btn {
  padding: 8px 16px;
  background: var(--vt-c-primary);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.solve-btn:hover {
  background: var(--vt-c-secondary);
  transform: translateY(-2px);
}

.question-footer {
  margin-top: 16px;
  border-top: 1px dashed #eee;
  padding-top: 16px;
}

.question-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.answer-btn {
  padding: 8px 16px;
  background: transparent;
  color: var(--vt-c-primary);
  border: 1px solid var(--vt-c-primary);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.answer-btn:hover {
  background: rgba(79, 110, 247, 0.1);
}

.answer-section {
  margin-bottom: 16px;
  padding: 12px;
  background: #f5f7ff;
  border-radius: 8px;
}
</style>