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
        <section v-if="paper.choice?.length" class="question-section">
          <h3>一、选择题</h3>
          <div v-for="(question, index) in paper.choice" :key="index" class="question-item">
            <div class="question-header">
              <span class="question-number">{{ index + 1 }}</span>
              <span class="question-score">({{ question.score }}分)</span>
            </div>
            <div class="question-content">{{ question.content }}</div>
            <div class="options-list">
              <div v-for="(option, idx) in question.options" :key="idx" class="option-item">
                <span class="option-label">{{ String.fromCharCode(65 + idx) }}.</span>
                <span class="option-content">{{ option }}</span>
              </div>
            </div>
            <div v-if="showAnswers" class="answer">
              <strong>答案：</strong>{{ question.answer }}
            </div>
          </div>
        </section>

        <!-- 编程题部分 -->
        <section v-if="paper.programming?.length" class="question-section">
          <h3>二、编程题</h3>
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
        </section>

        <!-- 填空题部分 -->
        <section v-if="paper.completion?.length" class="question-section">
          <h3>三、填空题</h3>
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
        </section>

        <!-- 判断题部分 -->
        <section v-if="paper.truefalse?.length" class="question-section">
          <h3>四、判断题</h3>
          <div v-for="(question, index) in paper.truefalse" :key="index" class="question-item">
            <div class="question-header">
              <span class="question-number">{{ index + 1 }}</span>
              <span class="question-score">({{ question.score }}分)</span>
            </div>
            <div class="question-content">{{ question.content }}</div>
            <div v-if="showAnswers" class="answer">
              <strong>答案：</strong>{{ question.answer ? '正确' : '错误' }}
            </div>
          </div>
        </section>

        <!-- 简答题部分 -->
        <section v-if="paper.shortanswer?.length" class="question-section">
          <h3>五、简答题</h3>
          <div v-for="(question, index) in paper.shortanswer" :key="index" class="question-item">
            <div class="question-header">
              <span class="question-number">{{ index + 1 }}</span>
              <span class="question-score">({{ question.score }}分)</span>
            </div>
            <div class="question-content">{{ question.content }}</div>
            <div v-if="showAnswers" class="answer">
              <strong>参考答案：</strong>
              <div class="answer-content">{{ question.answer }}</div>
            </div>
          </div>
        </section>

        <!-- 匹配题部分 -->
        <section v-if="paper.matching?.length" class="question-section">
          <h3>六、匹配题</h3>
          <div v-for="(question, index) in paper.matching" :key="index" class="question-item">
            <div class="question-header">
              <span class="question-number">{{ index + 1 }}</span>
              <span class="question-score">({{ question.score }}分)</span>
            </div>
            <div class="question-content">{{ question.content }}</div>
            <div class="matching-items">
              <div class="matching-column">
                <div v-for="(item, itemIndex) in question.leftItems" :key="itemIndex" class="matching-item">
                  {{ itemIndex + 1 }}. {{ item }}
                </div>
              </div>
              <div class="matching-column">
                <div v-for="(item, itemIndex) in question.rightItems" :key="itemIndex" class="matching-item">
                  {{ String.fromCharCode(65 + itemIndex) }}. {{ item }}
                </div>
              </div>
            </div>
            <div v-if="showAnswers" class="answer">
              <strong>答案：</strong>
              <div class="answer-pairs">
                <div v-for="[left, right] in question.answer" :key="left" class="answer-pair">
                  {{ left + 1 }} → {{ String.fromCharCode(65 + right) }}
                </div>
              </div>
            </div>
          </div>
        </section>
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
import { downloadPaperAsWord } from '@/utils/download'

const router = useRouter()
const paper = ref(null)
const showAnswers = ref(false)

onMounted(() => {
  const savedPaper = localStorage.getItem('currentPaper')
  if (savedPaper) {
    paper.value = JSON.parse(savedPaper)
  }
})

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString()
}

const toggleAnswers = () => {
  showAnswers.value = !showAnswers.value
}

const startSolving = () => {
  router.push('/solve-paper')
}

const downloadPaper = () => {
  if (paper.value) {
    downloadPaperAsWord(paper.value)
  }
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
  gap: 8px;
}

.option-label {
  font-weight: bold;
  min-width: 24px;
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
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin: 16px 0;
}

.matching-column {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.matching-item {
  padding: 12px;
  background: #f5f7ff;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.matching-item:hover {
  background: #e8f0fe;
}

.answer-pairs {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 8px;
}

.answer-pair {
  padding: 4px 12px;
  background: #e8f0fe;
  border-radius: 4px;
  font-weight: 500;
}
</style> 