<template>
  <div class="solve-paper">
    <header class="header">
      <div class="header-content">
        <button class="back-btn" @click="confirmExit">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
          {{ t('common.back') }}
        </button>
        <h1>{{ paper?.title || t('paper.defaultTitle') }}</h1>
        <div class="timer">{{ formatTime(timeLeft) }}</div>
      </div>
    </header>

    <main class="main-content">
      <div class="questions-container">
        <!-- 选择题 -->
        <section v-if="paper?.choice?.length" class="question-section">
          <h2>{{ t('paper.questionTypes.choice') }}</h2>
          <div class="questions-list">
            <div v-for="(question, index) in paper.choice" 
                 :key="index" 
                 class="question-item">
              <div class="question-header">
                <span class="question-number">{{ index + 1 }}</span>
                <span class="question-score">({{ question.score }}分)</span>
              </div>
              <div class="question-content">{{ question.content }}</div>
              <div class="options-list">
                <label v-for="(option, key) in question.options" 
                       :key="key" 
                       class="option-item">
                  <input type="radio" 
                         :name="`choice_${index}`"
                         :value="key"
                         v-model="answers.choice[index]">
                  <span class="option-text">{{ key }}. {{ option }}</span>
                </label>
              </div>
            </div>
          </div>
        </section>

        <!-- 编程题 -->
        <section v-if="paper?.programming?.length" class="question-section">
          <h2>{{ t('paper.questionTypes.programming') }}</h2>
          <div class="questions-list">
            <div v-for="(question, index) in paper.programming" 
                 :key="index" 
                 class="question-item">
              <div class="question-header">
                <span class="question-number">{{ index + 1 }}</span>
                <span class="question-score">({{ question.score }}分)</span>
              </div>
              <div class="question-content">{{ question.content }}</div>
              <textarea 
                v-model="answers.programming[index]"
                :placeholder="t('problems.answerPlaceholder')"
                rows="6"
                class="code-textarea"
              ></textarea>
            </div>
          </div>
        </section>

        <!-- 填空题 -->
        <section v-if="paper?.completion?.length" class="question-section">
          <h2>{{ t('paper.questionTypes.completion') }}</h2>
          <div class="questions-list">
            <div v-for="(question, index) in paper.completion" 
                 :key="index" 
                 class="question-item">
              <div class="question-header">
                <span class="question-number">{{ index + 1 }}</span>
                <span class="question-score">({{ question.score }}分)</span>
              </div>
              <div class="question-content">{{ question.content }}</div>
              <input 
                type="text" 
                v-model="answers.completion[index]"
                :placeholder="t('problems.answerPlaceholder')"
                class="completion-input"
              >
            </div>
          </div>
        </section>
      </div>

      <div class="submit-wrapper">
        <div class="submit-container">
          <div class="submit-info">
            <div class="time-left">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path fill="currentColor" d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8s8 3.58 8 8s-3.58 8-8 8zm.5-13H11v6l5.25 3.15l.75-1.23l-4.5-2.67z"/>
              </svg>
              <span>{{ formatTime(timeLeft) }}</span>
            </div>
            <div class="question-progress">
              已完成 {{ completedQuestions }}/{{ totalQuestions }} 题
            </div>
          </div>
          <button class="submit-btn" @click="submitPaper" :disabled="!canSubmit">
            <div class="submit-btn-content">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path fill="currentColor" d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
              </svg>
              <span>{{ t('paper.submit') }}</span>
            </div>
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const { t } = useI18n()

const paper = ref(null)
const timeLeft = ref(0)
const timer = ref(null)

// 初始化答案对象
const answers = ref({
  choice: [],
  programming: [],
  completion: []
})

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

const confirmExit = () => {
  if (confirm(t('paper.confirmExit'))) {
    clearInterval(timer.value)
    router.back()
  }
}

const submitPaper = async () => {
  try {
    // 保存答案到 localStorage
    localStorage.setItem('paperAnswers', JSON.stringify(answers.value))
    
    // 清除计时器
    clearInterval(timer.value)
    
    // 跳转到结果页面
    router.push('/paper-result')
  } catch (error) {
    console.error('Submit paper error:', error)
  }
}

onMounted(() => {
  // 从 localStorage 获取试卷数据
  const paperData = localStorage.getItem('currentPaper')
  if (paperData) {
    paper.value = JSON.parse(paperData)
    
    // 初始化答案数组
    if (paper.value.choice) {
      answers.value.choice = new Array(paper.value.choice.length).fill('')
    }
    if (paper.value.programming) {
      answers.value.programming = new Array(paper.value.programming.length).fill('')
    }
    if (paper.value.completion) {
      answers.value.completion = new Array(paper.value.completion.length).fill('')
    }
    
    // 设置计时器
    if (paper.value.duration) {
      timeLeft.value = paper.value.duration * 60
      timer.value = setInterval(() => {
        timeLeft.value--
        if (timeLeft.value <= 0) {
          clearInterval(timer.value)
          submitPaper() // 时间到自动提交
        }
      }, 1000)
    }
  } else {
    router.push('/home')
  }
})

onBeforeUnmount(() => {
  if (timer.value) {
    clearInterval(timer.value)
  }
})

// 添加计算属性
const totalQuestions = computed(() => {
  return (paper.value?.choice?.length || 0) +
         (paper.value?.programming?.length || 0) +
         (paper.value?.completion?.length || 0)
})

const completedQuestions = computed(() => {
  return answers.value.choice.filter(a => a !== '').length +
         answers.value.programming.filter(a => a !== '').length +
         answers.value.completion.filter(a => a !== '').length
})

const canSubmit = computed(() => {
  return completedQuestions.value > 0
})
</script>

<style scoped>
.solve-paper {
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
  justify-content: space-between;
}

.timer {
  font-size: 24px;
  font-weight: bold;
  color: var(--vt-c-primary);
  padding: 8px 16px;
  background: #eef2ff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(79, 110, 247, 0.1);
}

.main-content {
  max-width: 1200px;
  margin: 32px auto;
  padding: 0 20px;
}

.questions-container {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
}

.question-section {
  margin-bottom: 32px;
}

.question-item {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.question-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0,0,0,0.12);
}

.question-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.question-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: var(--vt-c-primary);
  color: white;
  border-radius: 50%;
  font-weight: bold;
}

.question-score {
  color: #666;
  font-weight: 500;
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #f8f9fa;
}

.option-item:hover {
  background: #eef2ff;
}

.option-item input[type="radio"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: var(--vt-c-primary);
}

.option-text {
  font-size: 16px;
  color: #333;
}

.code-textarea {
  width: 100%;
  padding: 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.6;
  resize: vertical;
  min-height: 150px;
  background: #f8f9fa;
  transition: all 0.3s ease;
}

.code-textarea:focus {
  border-color: var(--vt-c-primary);
  box-shadow: 0 0 0 3px rgba(79, 110, 247, 0.1);
  outline: none;
}

.completion-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
  background: #f8f9fa;
}

.completion-input:focus {
  border-color: var(--vt-c-primary);
  box-shadow: 0 0 0 3px rgba(79, 110, 247, 0.1);
  outline: none;
}

.submit-wrapper {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background: linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 20%);
  z-index: 100;
}

.submit-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background: #1a73e8;
  border-radius: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 8px 30px rgba(26, 115, 232, 0.3);
}

.submit-info {
  display: flex;
  gap: 24px;
  color: white;
}

.time-left {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
  font-weight: 600;
}

.question-progress {
  display: flex;
  align-items: center;
  font-size: 16px;
  opacity: 0.9;
}

.submit-btn {
  padding: 12px 32px;
  background: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-btn:not(:disabled) {
  color: #1a73e8;
}

.submit-btn:disabled {
  background: rgba(255, 255, 255, 0.5);
  color: rgba(0, 0, 0, 0.3);
  cursor: not-allowed;
}

.submit-btn:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.submit-btn-content {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
}
</style> 