<template>
  <div class="solve-problem">
    <header class="header">
      <div class="header-content">
        <button class="back-btn" @click="router.back()">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
          {{ t('common.back') }}
        </button>
        <h1>{{ problem?.title }}</h1>
        <div class="timer" v-if="timeLeft">{{ formatTime(timeLeft) }}</div>
      </div>
    </header>

    <main class="main-content">
      <div class="problem-container" v-if="problem">
        <section class="problem-description">
          <h2>{{ t('problems.description') }}</h2>
          <div class="description-content">{{ problem.description }}</div>
        </section>

        <section class="answer-section">
          <div class="answer-input">
            <h3>{{ t('problems.yourAnswer') }}</h3>
            <textarea 
              v-model="userAnswer"
              :placeholder="t('problems.answerPlaceholder')"
              rows="6"
            ></textarea>
          </div>

          <div class="action-buttons">
            <button 
              class="submit-btn" 
              @click="submitAnswer"
              :disabled="!userAnswer.trim()"
            >
              {{ t('problems.submit') }}
            </button>
            <button class="show-answer-btn" @click="toggleAnswer">
              {{ showAnswer ? t('problems.hideAnswer') : t('problems.showAnswer') }}
            </button>
          </div>

          <div v-if="showAnswer" class="reference-answer">
            <h3>{{ t('problems.referenceAnswer') }}</h3>
            <div class="answer-content">{{ problem.answer }}</div>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const route = useRoute()
const { t } = useI18n()

const problem = ref(null)
const userAnswer = ref('')
const showAnswer = ref(false)
const timeLeft = ref(null)

const toggleAnswer = () => {
  showAnswer.value = !showAnswer.value
}

const submitAnswer = async () => {
  try {
    // 这里添加提交答案的逻辑
    alert(t('problems.submitSuccess'))
    router.back()
  } catch (error) {
    console.error('Submit answer error:', error)
  }
}

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

onMounted(() => {
  // 这里添加获取题目详情的逻辑
  problem.value = {
    title: '示例题目',
    description: '这是一个示例题目的描述...',
    answer: '这是参考答案...'
  }
})
</script>

<style scoped>
.solve-problem {
  min-height: 100vh;
  background: #f5f7ff;
}

.header {
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 16px 0;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
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
  border-radius: 8px;
  background: transparent;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
}

.main-content {
  max-width: 1200px;
  margin: 32px auto;
  padding: 0 20px;
}

.problem-container {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
}

.answer-section {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #eee;
}

textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  resize: vertical;
  font-family: inherit;
}

.action-buttons {
  display: flex;
  gap: 16px;
  margin-top: 16px;
}

.submit-btn, .show-answer-btn {
  padding: 8px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-btn {
  background: var(--vt-c-primary);
  color: white;
}

.show-answer-btn {
  background: transparent;
  border: 1px solid var(--vt-c-primary);
  color: var(--vt-c-primary);
}

.reference-answer {
  margin-top: 24px;
  padding: 16px;
  background: #f5f7ff;
  border-radius: 8px;
}
</style> 