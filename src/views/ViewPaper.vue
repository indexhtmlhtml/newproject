<template>
  <div class="view-paper">
    <header class="header">
      <div class="header-content">
        <div class="left-section">
          <button class="back-btn" @click="router.back()">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
            返回
          </button>
          <h1 class="page-title">查看试卷</h1>
        </div>
        <div class="actions">
          <button class="action-btn" @click="startSolving">
            开始答题
          </button>
          <button class="action-btn" @click="downloadPaper">
            下载试卷
          </button>
        </div>
      </div>
    </header>

    <main class="main-content">
      <div v-if="paper" class="paper-content">
        <div class="paper-header">
          <h2>{{ paper.title }}</h2>
          <div class="paper-info">
            <span>难度：{{ paper.difficulty }}</span>
            <span>时长：{{ paper.duration }}分钟</span>
            <span>总分：{{ paper.totalScore }}分</span>
            <span>生成时间：{{ formatDate(paper.generatedAt) }}</span>
          </div>
        </div>

        <!-- 选择题部分 -->
        <div v-if="paper?.choice?.length" class="question-section">
          <h3>{{ t('paper.questionTypes.choice') }}</h3>
          <div v-for="(question, index) in paper.choice" :key="index" class="question-item">
            <div class="question-header">
              <span class="question-number">{{ index + 1 }}</span>
              <span class="question-score">({{ question.score }}分)</span>
            </div>
            <div class="question-content">{{ question.content }}</div>
            <div class="options-list">
              <div v-for="(optionValue, optionKey) in question.options" 
                     :key="optionKey" 
                     class="option-item">
                <span class="option-label">{{ optionKey }}</span>
                <span>{{ optionValue }}</span>
              </div>
            </div>
            <div v-if="showAnswers" class="answer">
              <strong>答案：</strong>{{ question.answer }}
            </div>
          </div>
        </div>

        <!-- 编程题部分 -->
        <div v-if="paper?.programming?.length" class="question-section">
          <h3>{{ t('paper.questionTypes.programming') }}</h3>
          <div v-for="(question, index) in paper.programming" :key="index" class="question-item">
            <div class="question-header">
              <span class="question-number">{{ index + 1 }}</span>
              <span class="question-score">({{ question.score }}分)</span>
            </div>
            <div class="question-content">{{ question.content }}</div>
            <div v-if="showAnswers" class="answer">
              <strong>参考答案：</strong>
              <pre><code>{{ question.answer }}</code></pre>
            </div>
          </div>
        </div>

        <!-- 填空题部分 -->
        <div v-if="paper?.completion?.length" class="question-section">
          <h3>{{ t('paper.questionTypes.completion') }}</h3>
          <div v-for="(question, index) in paper.completion" :key="index" class="question-item">
            <div class="question-header">
              <span class="question-number">{{ index + 1 }}</span>
              <span class="question-score">({{ question.score }}分)</span>
            </div>
            <div class="question-content">{{ question.content }}</div>
            <div v-if="showAnswers" class="answer">
              <strong>答案：</strong>{{ question.answer }}
            </div>
          </div>
        </div>

        <!-- 判断题部分 -->
        <div v-if="paper?.truefalse?.length" class="question-section">
          <h3>{{ t('paper.questionTypes.truefalse') }}</h3>
          <div v-for="(question, index) in paper.truefalse" :key="index" class="question-item">
            <div class="question-header">
              <span class="question-number">{{ index + 1 }}</span>
              <span class="question-score">({{ question.score }}分)</span>
            </div>
            <div class="question-content">{{ question.content }}</div>
            <div class="options-list">
              <div class="option-item">
                <label>
                  <span>{{ t('paper.true') }}</span>
                </label>
              </div>
              <div class="option-item">
                <label>
                  <span>{{ t('paper.false') }}</span>
                </label>
              </div>
            </div>
            <div v-if="showAnswers" class="answer">
              <strong>答案：</strong>{{ question.answer ? t('paper.true') : t('paper.false') }}
            </div>
          </div>
        </div>

        <!-- 简答题部分 -->
        <div v-if="paper?.shortanswer?.length" class="question-section">
          <h3>{{ t('paper.questionTypes.shortanswer') }}</h3>
          <div v-for="(question, index) in paper.shortanswer" :key="index" class="question-item">
            <div class="question-header">
              <span class="question-number">{{ index + 1 }}</span>
              <span class="question-score">({{ question.score }}分)</span>
            </div>
            <div class="question-content">{{ question.content }}</div>
            <div v-if="showAnswers" class="answer">
              <strong>答案：</strong>
              <div class="answer-content">{{ question.answer }}</div>
            </div>
          </div>
        </div>

        <!-- 匹配题部分 -->
        <div v-if="paper?.matching?.length" class="question-section">
          <h3>{{ t('paper.questionTypes.matching') }}</h3>
          <div v-for="(question, index) in paper.matching" :key="index" class="question-item">
            <div class="question-header">
              <span class="question-number">{{ index + 1 }}</span>
              <span class="question-score">({{ question.score }}分)</span>
            </div>
            <div class="question-content">{{ question.content }}</div>
            <div class="matching-items">
              <div class="left-items">
                <div v-for="(item, i) in question.leftItems" :key="i" class="matching-item">
                  {{ i + 1 }}. {{ item }}
                </div>
              </div>
              <div class="right-items">
                <div v-for="(item, i) in question.rightItems" :key="i" class="matching-item">
                  {{ String.fromCharCode(65 + i) }}. {{ item }}
                </div>
              </div>
            </div>
            <div v-if="showAnswers" class="answer">
              <strong>答案：</strong>
              <div class="answer-pairs">
                <div v-for="(pair, i) in question.answer" :key="i" class="answer-pair">
                  {{ pair[0] + 1 }} → {{ String.fromCharCode(65 + pair[1]) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="no-paper">
        未找到试卷信息
      </div>
    </main>

    <div class="floating-controls">
      <button class="toggle-btn" @click="toggleAnswers">
        {{ showAnswers ? '隐藏答案' : '显示答案' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { downloadPaperAsWord } from '@/utils/download'
import { getPaperHistory } from '@/services/paper'

const router = useRouter()
const { t } = useI18n()
const paper = ref(null)
const showAnswers = ref(false)

onMounted(() => {
  // 从 URL 获取试卷 ID
  const urlParams = new URLSearchParams(window.location.search)
  const paperId = urlParams.get('id')
  
  if (paperId) {
    // 从历史记录中获取对应的试卷
    const history = getPaperHistory()
    paper.value = history[paperId]
  } else {
    // 尝试从 localStorage 获取最新生成的试卷
    const paperData = localStorage.getItem('currentPaper')
    if (paperData) {
      paper.value = JSON.parse(paperData)
    }
  }
})

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString()
}

const toggleAnswers = () => {
  showAnswers.value = !showAnswers.value
}

const startSolving = () => {
  if (paper.value) {
    // 清除之前的答案记录
    localStorage.removeItem('paperAnswers')
    // 清除之前的开始时间记录
    localStorage.removeItem('examStartTime')
    // 清除之前的答题状态
    localStorage.removeItem('answerState')
    
    // 保存当前试卷
    localStorage.setItem('currentPaper', JSON.stringify(paper.value))
    router.push('/solve-paper')
  }
}

const downloadPaper = () => {
  if (!paper.value) return
  downloadPaperAsWord(paper.value)
}
</script>

<style scoped>
.view-paper {
  min-height: 100vh;
  background: #f5f7ff;
}

.header {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 16px 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
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
  transition: all 0.3s ease;
}

.back-btn:hover {
  color: #4F6EF7;
}

.actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #4F6EF7;
  color: white;
}

.action-btn:hover {
  background: #3D5CE5;
  transform: translateY(-1px);
}

.main-content {
  max-width: 1000px;
  margin: 24px auto;
  padding: 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.paper-header {
  text-align: center;
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 2px solid #eee;
}

.paper-info {
  display: flex;
  justify-content: center;
  gap: 24px;
  color: #666;
  margin-top: 12px;
}

.question-section {
  margin-bottom: 32px;
}

.question-section h3 {
  margin-bottom: 20px;
  color: #333;
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
}

.option-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.option-item:hover {
  background: #f5f7ff;
}

.option-item.selected {
  background: #e8f0fe;
  border: 1px solid #4F6EF7;
}

.option-item input[type="radio"] {
  width: 18px;
  height: 18px;
  accent-color: #4F6EF7;
}

.answer {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px dashed #ddd;
}

.answer pre {
  margin-top: 8px;
  padding: 12px;
  background: #f1f3f5;
  border-radius: 4px;
  overflow-x: auto;
}

.floating-controls {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 100;
}

.toggle-btn {
  padding: 12px 24px;
  background: #4F6EF7;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.toggle-btn:hover {
  background: #3D5CE5;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.no-paper {
  text-align: center;
  padding: 48px;
  color: #999;
}

.answer-content {
  margin-top: 8px;
  white-space: pre-wrap;
  line-height: 1.6;
}

.matching-items {
  display: flex;
  gap: 2rem;
  margin-top: 1rem;
}

.left-items,
.right-items {
  flex: 1;
}

.matching-item {
  padding: 0.5rem;
  margin: 0.5rem 0;
  background: #f5f5f5;
  border-radius: 4px;
}
</style> 