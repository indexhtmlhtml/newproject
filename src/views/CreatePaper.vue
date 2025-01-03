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
      <div class="paper-config">
        <section class="config-section">
          <h2>{{ t('paper.settings') }}</h2>
          
          <!-- 题型配置 -->
          <div class="question-types">
            <h3>{{ t('paper.questionTypes.title') }}</h3>
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
            <h3>{{ t('paper.difficulty') }}</h3>
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
            <h3>{{ t('paper.duration') }}</h3>
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
            <h3>{{ t('paper.totalScore') }}</h3>
            <input 
              type="number" 
              v-model="totalScore" 
              min="50" 
              max="150" 
              step="10"
            >
          </div>

          <!-- 生成按钮 -->
          <button 
            class="generate-btn" 
            @click="handleGeneratePaper"
            :disabled="isGenerating || !isValid"
          >
            <span v-if="!isGenerating">{{ t('paper.generate') }}</span>
            <span v-else class="loading-spinner"></span>
          </button>
        </section>

        <!-- 预览区域 -->
        <section class="preview-section" v-if="paper">
          <h2>{{ t('paper.preview') }}</h2>
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
                    <div v-if="question.answer" class="question-answer">
                      <strong>{{ t('paper.answer') }}:</strong> {{ question.answer }}
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
                    <div v-if="question.answer" class="question-answer">
                      <strong>{{ t('paper.answer') }}:</strong>
                      <pre>{{ question.answer }}</pre>
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
                    <div v-if="question.answer" class="question-answer">
                      <strong>{{ t('paper.answer') }}:</strong> {{ question.answer }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { generatePaper as generatePaperAPI } from '../services/paper'

const router = useRouter()
const currentLocale = ref('zh')

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
const paper = ref(null)

// 验证配置是否有效
const isValid = computed(() => {
  const hasQuestions = questionTypes.value.some(type => type.count > 0)
  const totalQuestions = questionTypes.value.reduce((sum, type) => sum + type.count, 0)
  return hasQuestions && totalQuestions <= 20
})

// 翻译函数
const t = (key) => {
  // 这里使用简单的翻译实现，实际项目中应该使用 i18n 插件
  const translations = {
    'common.back': '返回',
    'paper.title': '智能组卷',
    'paper.settings': '试卷设置',
    'paper.questionTypes.title': '题型设置',
    'paper.questionTypes.choice': '选择题',
    'paper.questionTypes.programming': '编程题',
    'paper.questionTypes.completion': '填空题',
    'paper.difficulty': '难度等级',
    'paper.duration': '考试时长（分钟）',
    'paper.totalScore': '总分',
    'paper.generate': '生成试卷',
    'paper.generating': '正在生成...',
    'paper.preview': '试卷预览',
    'problems.easy': '简单',
    'problems.medium': '中等',
    'problems.hard': '困难'
  }
  return translations[key] || key
}

// 生成试卷
const handleGeneratePaper = async () => {
  try {
    isGenerating.value = true
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
      language: currentLocale.value
    }

    const result = await generatePaperAPI(params)
    paper.value = result
  } catch (error) {
    console.error('Failed to generate paper:', error)
    alert('生成试卷失败，请重试')
  } finally {
    isGenerating.value = false
  }
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

.paper-config {
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 24px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.config-section {
  padding: 24px;
  border-right: 1px solid #eee;
}

.config-section h2,
.config-section h3 {
  margin: 0 0 16px;
  color: #333;
}

.type-grid {
  display: grid;
  gap: 16px;
}

.type-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  margin-top: 24px;
  background: #4F6EF7;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.generate-btn:hover:not(:disabled) {
  background: #3D5CE5;
}

.generate-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
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
</style>