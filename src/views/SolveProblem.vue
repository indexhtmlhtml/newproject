<template>
  <div class="solve-problem">
    <header class="header">
      <div class="header-content">
        <div class="left-section">
          <button class="back-btn" @click="router.back()">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
            {{ t('common.back') }}
          </button>
          <h1 class="page-title">{{ problem?.title || t('problems.solve') }}</h1>
        </div>
        <div class="timer" v-if="timeLeft">
          {{ formatTime(timeLeft) }}
        </div>
      </div>
    </header>

    <main class="main-content">
      <div class="problem-container" v-if="problem">
        <!-- 问题描述 -->
        <section class="problem-description">
          <div class="description-content" v-html="formatDescription(problem.description)"></div>
        </section>

        <!-- 示例 -->
        <section class="examples" v-if="problem.examples?.length">
          <h3>{{ t('problems.examples') }}</h3>
          <div class="example-list">
            <div v-for="(example, index) in problem.examples" :key="index" class="example-item">
              <div class="example-header">{{ t('problems.example') }} {{ index + 1 }}</div>
              <div class="example-content">
                <div class="input">
                  <div class="label">{{ t('problems.input') }}:</div>
                  <pre>{{ example.input }}</pre>
                </div>
                <div class="output">
                  <div class="label">{{ t('problems.output') }}:</div>
                  <pre>{{ example.output }}</pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 代码编辑器 -->
        <section class="code-editor">
          <div class="editor-header">
            <select v-model="selectedLanguage" class="language-select">
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
            </select>
            <div class="editor-actions">
              <button class="action-btn" @click="resetCode">
                {{ t('problems.reset') }}
              </button>
              <button class="run-btn" @click="runCode" :disabled="isRunning">
                <span v-if="!isRunning">{{ t('problems.run') }}</span>
                <span v-else class="loading-spinner"></span>
              </button>
              <button class="submit-btn" @click="submitCode" :disabled="isSubmitting">
                <span v-if="!isSubmitting">{{ t('problems.submit') }}</span>
                <span v-else class="loading-spinner"></span>
              </button>
            </div>
          </div>
          <div class="editor-body">
            <textarea
              v-model="code"
              :placeholder="t('problems.codePlaceholder')"
              spellcheck="false"
              @keydown.tab.prevent="handleTab"
            ></textarea>
          </div>
        </section>

        <!-- 运行结果 -->
        <section class="results" v-if="testResults.length">
          <h3>{{ t('problems.results') }}</h3>
          <div class="result-list">
            <div 
              v-for="(result, index) in testResults" 
              :key="index"
              :class="['result-item', result.status]"
            >
              <div class="result-header">
                {{ t('problems.testCase') }} {{ index + 1 }}:
                <span class="status">{{ t(`problems.${result.status}`) }}</span>
              </div>
              <div class="result-details" v-if="result.status === 'error'">
                <pre>{{ result.error }}</pre>
              </div>
              <div class="result-details" v-else>
                <div class="input">
                  <div class="label">{{ t('problems.input') }}:</div>
                  <pre>{{ result.input }}</pre>
                </div>
                <div class="expected">
                  <div class="label">{{ t('problems.expected') }}:</div>
                  <pre>{{ result.expected }}</pre>
                </div>
                <div class="actual">
                  <div class="label">{{ t('problems.actual') }}:</div>
                  <pre>{{ result.actual }}</pre>
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
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { getProblem, runCode as runCodeAPI, submitSolution } from '../services/problems'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

const problem = ref(null)
const code = ref('')
const selectedLanguage = ref('python')
const isRunning = ref(false)
const isSubmitting = ref(false)
const testResults = ref([])
const timeLeft = ref(null)
let timer = null

// 格式化问题描述（支持 Markdown）
const formatDescription = (description) => {
  // 这里可以使用 markdown-it 等库来解析 Markdown
  return description
}

// 格式化时间显示
const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

// 处理 Tab 键
const handleTab = (e) => {
  const start = e.target.selectionStart
  const end = e.target.selectionEnd
  code.value = code.value.substring(0, start) + '    ' + code.value.substring(end)
  e.target.selectionStart = e.target.selectionEnd = start + 4
}

// 重置代码
const resetCode = () => {
  if (confirm(t('problems.confirmReset'))) {
    code.value = problem.value.template || ''
  }
}

// 运行代码
const runCode = async () => {
  try {
    isRunning.value = true
    const response = await runCodeAPI({
      problemId: problem.value.id,
      code: code.value,
      language: selectedLanguage.value
    })
    testResults.value = response.results
  } catch (error) {
    console.error('Run code error:', error)
    testResults.value = [{
      status: 'error',
      error: error.message
    }]
  } finally {
    isRunning.value = false
  }
}

// 提交代码
const submitCode = async () => {
  try {
    isSubmitting.value = true
    const response = await submitSolution({
      problemId: problem.value.id,
      code: code.value,
      language: selectedLanguage.value
    })
    if (response.success) {
      alert(t('problems.submitSuccess'))
      router.push(`/problems/${route.params.category}`)
    }
  } catch (error) {
    console.error('Submit code error:', error)
    alert(error.message)
  } finally {
    isSubmitting.value = false
  }
}

// 初始化计时器
const initTimer = () => {
  if (problem.value.timeLimit) {
    timeLeft.value = problem.value.timeLimit * 60
    timer = setInterval(() => {
      if (timeLeft.value > 0) {
        timeLeft.value--
      } else {
        clearInterval(timer)
        submitCode()
      }
    }, 1000)
  }
}

onMounted(async () => {
  try {
    const { id } = route.params
    problem.value = await getProblem(id)
    code.value = problem.value.template || ''
    initTimer()
  } catch (error) {
    console.error('Failed to load problem:', error)
    alert(error.message)
    router.push(`/problems/${route.params.category}`)
  }
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<style scoped>
.solve-problem {
  min-height: 100vh;
  background: #f8f9fa;
}

.header {
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  color: #666;
  cursor: pointer;
  transition: color 0.3s;
}

.back-btn:hover {
  color: #4F6EF7;
}

.timer {
  font-size: 24px;
  font-weight: bold;
  color: #4F6EF7;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 16px;
}

.problem-container {
  display: grid;
  gap: 24px;
}

.problem-description {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.examples {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.example-list {
  display: grid;
  gap: 16px;
}

.example-item {
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
}

.example-header {
  padding: 8px 16px;
  background: #f8f9fa;
  font-weight: bold;
}

.example-content {
  padding: 16px;
}

.input, .output {
  margin-bottom: 8px;
}

.label {
  font-weight: bold;
  margin-bottom: 4px;
}

pre {
  background: #f8f9fa;
  padding: 8px;
  border-radius: 4px;
  overflow-x: auto;
}

.code-editor {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  overflow: hidden;
}

.editor-header {
  padding: 16px;
  background: #f8f9fa;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.language-select {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.editor-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
}

.run-btn, .submit-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
}

.run-btn {
  background: #28a745;
}

.submit-btn {
  background: #4F6EF7;
}

.editor-body {
  padding: 16px;
}

textarea {
  width: 100%;
  min-height: 400px;
  padding: 16px;
  border: 1px solid #eee;
  border-radius: 4px;
  font-family: monospace;
  resize: vertical;
}

.results {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.result-list {
  display: grid;
  gap: 16px;
}

.result-item {
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
}

.result-item.success {
  border-color: #28a745;
}

.result-item.error {
  border-color: #dc3545;
}

.result-header {
  padding: 8px 16px;
  background: #f8f9fa;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status {
  font-weight: bold;
}

.result-item.success .status {
  color: #28a745;
}

.result-item.error .status {
  color: #dc3545;
}

.result-details {
  padding: 16px;
}

.loading-spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style> 