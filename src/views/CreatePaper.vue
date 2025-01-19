<template>
  <div class="create-paper">
    <PaperHistory />
    <nav class="nav-bar">
      <div class="nav-content">
        <div class="nav-left">
          <button class="nav-back" @click="handleBack">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
          </button>
          <div class="nav-divider"></div>
          <h1 class="nav-title">生成试卷</h1>
        </div>
        <div class="nav-right">
          <div class="nav-actions">
            <button class="nav-btn help-btn" title="帮助">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41c0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
              </svg>
            </button>
            <div class="nav-divider"></div>
            <div class="user-info">
              <div class="user-avatar">
                {{ username.charAt(0).toUpperCase() }}
              </div>
              <span class="username">{{ username }}</span>
              <button class="logout-btn" @click="handleLogout" title="退出登录">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>

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
              <h3>题型设置</h3>
            </div>

            <div class="types-dropdown">
              <div class="dropdown-header" @click="openDropdown">
                <span>选择题型</span>
                <svg :class="['dropdown-arrow', { 'open': isDropdownOpen }]" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M7 10l5 5 5-5z"/>
                </svg>
              </div>
              <div v-show="isDropdownOpen" class="dropdown-content" @click.stop>
                <div class="dropdown-close" @click="closeDropdown">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                  </svg>
                </div>
                <div v-for="type in questionTypesList" :key="type.value" class="type-item">
                  <label>
                    <input 
                      type="checkbox" 
                      v-model="selectedTypes" 
                      :value="type.value"
                      @change="handleTypeChange(type.value)"
                    >
                    {{ type.label }}
                  </label>
                  <input 
                    type="number" 
                    v-model="counts[type.value]" 
                    min="0" 
                    :disabled="!selectedTypes.includes(type.value)"
                  >
                </div>
              </div>
            </div>
          </div>

          <!-- 难度选择 -->
          <div class="setting-group">
            <div class="section-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                <path fill="currentColor" d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"/>
              </svg>
              <span>难度选择</span>
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

          <!-- 领域选择 -->
          <div class="setting-group">
            <div class="section-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93z"/>
              </svg>
              <span>题目领域（可多选）</span>
            </div>
            <div class="domain-list">
              <div
                v-for="item in domains"
                :key="item.value"
                :class="['domain-item', { active: selectedDomains.includes(item.value) }]"
                @click="toggleDomain(item.value)"
              >
                <div class="domain-checkbox">
                  <span v-show="selectedDomains.includes(item.value)" class="checkmark">✓</span>
                </div>
                <span class="domain-label">{{ item.label }}</span>
              </div>
            </div>
            <div class="domain-hint" v-if="selectedDomains.length > 0">
              已选择：{{ selectedDomains.map(d => domains.find(item => item.value === d)?.label).join('、') }}
            </div>
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
              <button 
                class="start-solve-btn" 
                @click="startSolving" 
                v-if="!isGenerating"
              >
                <div class="btn-content">
                  <div class="btn-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5l-6 4.5z"/>
                    </svg>
                  </div>
                  <span class="btn-text">开始做题</span>
                </div>
              </button>
              <button class="download-btn" @click="downloadPaper">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                </svg>
                下载试卷
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

              <!-- 判断题部分 -->
              <div v-if="paper.truefalse && paper.truefalse.length" class="question-type-section">
                <h4>判断题</h4>
                <div class="questions-list">
                  <div v-for="(question, index) in paper.truefalse" :key="index" class="question-item">
                    <div class="question-header">
                      <span class="question-number">{{ index + 1 }}</span>
                      <span class="question-score">({{ question.score }}分)</span>
                    </div>
                    <div class="question-content">{{ question.content }}</div>
                    <div class="question-footer">
                      <div class="answer-section" v-if="showAnswers[`truefalse_${index}`]">
                        <div class="question-answer">
                          <span class="answer-label">答案：</span>
                          <span class="answer-content">{{ question.answer ? '正确' : '错误' }}</span>
                        </div>
                      </div>
                      <div class="question-actions">
                        <button class="answer-btn" @click="toggleAnswer('truefalse', index)">
                          {{ showAnswers[`truefalse_${index}`] ? '隐藏答案' : '查看答案' }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 简答题部分 -->
              <div v-if="paper.shortanswer && paper.shortanswer.length" class="question-type-section">
                <h4>简答题</h4>
                <div class="questions-list">
                  <div v-for="(question, index) in paper.shortanswer" :key="index" class="question-item">
                    <div class="question-header">
                      <span class="question-number">{{ index + 1 }}</span>
                      <span class="question-score">({{ question.score }}分)</span>
                    </div>
                    <div class="question-content">{{ question.content }}</div>
                    <div class="question-footer">
                      <div class="answer-section" v-if="showAnswers[`shortanswer_${index}`]">
                        <div class="question-answer">
                          <span class="answer-label">参考答案：</span>
                          <div class="answer-content">{{ question.answer }}</div>
                        </div>
                      </div>
                      <div class="question-actions">
                        <button class="answer-btn" @click="toggleAnswer('shortanswer', index)">
                          {{ showAnswers[`shortanswer_${index}`] ? '隐藏答案' : '查看答案' }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 匹配题部分 -->
              <div v-if="paper.matching && paper.matching.length" class="question-type-section">
                <h4>匹配题</h4>
                <div class="questions-list">
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
                    <div class="question-footer">
                      <div class="answer-section" v-if="showAnswers[`matching_${index}`]">
                        <div class="question-answer">
                          <span class="answer-label">答案：</span>
                          <div class="answer-pairs">
                            <div v-for="[left, right] in question.answer" :key="left" class="answer-pair">
                              {{ left + 1 }} → {{ String.fromCharCode(65 + right) }}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="question-actions">
                        <button class="answer-btn" @click="toggleAnswer('matching', index)">
                          {{ showAnswers[`matching_${index}`] ? '隐藏答案' : '查看答案' }}
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
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useLanguageStore } from '../stores/language'
import { useI18n } from 'vue-i18n'
import { generatePaper, savePaperToHistory } from '../services/paper'
import { downloadPaperAsWord } from '../utils/download'
import PaperHistory from '@/components/PaperHistory.vue'
import { eventBus } from '@/utils/eventBus'

const router = useRouter()
const languageStore = useLanguageStore()
const { t } = useI18n()

const username = ref('')

onMounted(() => {
  // 从 localStorage 获取用户名
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  username.value = user.username || '未登录'
})

const handleLogout = () => {
  if (confirm('确定要退出登录吗？')) {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    router.push('/login')
  }
}

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

// 添加题型列表
const questionTypesList = [
  { value: 'choice', label: '选择题' },
  { value: 'programming', label: '编程题' },
  { value: 'completion', label: '填空题' },
  { value: 'truefalse', label: '判断题' },
  { value: 'shortanswer', label: '简答题' },
  { value: 'matching', label: '匹配题' }
]

// 下拉框状态
const isDropdownOpen = ref(false)

// 切换下拉框
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

// 选中的题型
const selectedTypes = ref(['choice', 'programming', 'completion', 'truefalse', 'shortanswer', 'matching'])

// 题型数量
const counts = ref({
  choice: 5,
  programming: 2,
  completion: 3,
  truefalse: 1,
  shortanswer: 1,
  matching: 1
})

// 处理题型变化
const handleTypeChange = (type) => {
  if (!selectedTypes.value.includes(type)) {
    counts.value[type] = 0
  }
}

// 修改领域选择的数据结构，增加更多领域
const domains = [
  { 
    value: 'frontend', 
    label: '前端开发',
    icon: 'M12 18.178l-4.62-1.256-.328-3.544h2.27l.158 1.844 2.52.667 2.52-.667.26-2.866H6.96l-.635-6.678h11.35l-.227 2.21H8.822l.204 2.256h8.217l-.624 6.778L12 18.178z'
  },
  { 
    value: 'backend', 
    label: '后端开发',
    icon: 'M20 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2zM6.5 17.5l3-3l2 2l3-3l2 2'
  },
  { 
    value: 'algorithm', 
    label: '算法与数据结构',
    icon: 'M15 4v2h3v12h-3v2h5V4zM4 4v16h5v-2H6V6h3V4z'
  },
  { 
    value: 'database', 
    label: '数据库',
    icon: 'M12 3C7.58 3 4 4.79 4 7s3.58 4 8 4 8-1.79 8-4-3.58-4-8-4zM4 9v3c0 2.21 3.58 4 8 4s8-1.79 8-4V9c0 2.21-3.58 4-8 4s-8-1.79-8-4z'
  },
  { 
    value: 'network', 
    label: '计算机网络',
    icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93z'
  },
  {
    value: 'security',
    label: '网络安全',
    icon: 'M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z'
  },
  {
    value: 'devops',
    label: 'DevOps',
    icon: 'M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36l-1.42 1.42C20.04 12.36 20 12.69 20 13c0 4.41-3.59 8-8 8s-8-3.59-8-8 3.59-8 8-8c2.21 0 4.21.89 5.65 2.33L19 2.71C17.01 1.04 14.61 0 12 0z'
  },
  {
    value: 'mobile',
    label: '移动开发',
    icon: 'M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z'
  }
]

const selectedDomains = ref(['frontend']) // 新的多选模式

// 修改 isValid 计算属性
const isValid = computed(() => {
  return (
    Object.values(counts.value).some(count => count > 0) &&
    selectedDomains.value.length > 0 &&
    selectedDifficulty.value
  )
})

// 修改 handleGeneratePaper 函数
const handleGeneratePaper = async () => {
  if (!isValid.value || isGenerating.value) return
  
  try {
    isGenerating.value = true
    let stepIndex = 0
    generatingStatus.value = generatingSteps[0]
    statusInterval = setInterval(() => {
      stepIndex = (stepIndex + 1) % generatingSteps.length
      generatingStatus.value = generatingSteps[stepIndex]
    }, 3000)

    const params = {
      title: '',
      difficulty: selectedDifficulty.value,
      domains: selectedDomains.value,
      counts: counts.value,
      language: 'zh' // 强制使用中文
    }

    const result = await generatePaper(params)
    
    paper.value = {
      ...result,
      title: result.title || t('paper.defaultTitle'),
      difficulty: selectedDifficulty.value,
      domains: selectedDomains.value
    }

    await savePaperToHistory(paper.value)
    eventBus.emit('paperGenerated')
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
    }))
    // 跳转到答题页面
    router.push({
      path: '/solve-paper',
      replace: true
    })
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

// 修改下拉框控制逻辑
const openDropdown = () => {
  isDropdownOpen.value = true
}

const closeDropdown = () => {
  isDropdownOpen.value = false
}

// 添加点击外部关闭指令
const vClickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event)
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent)
  }
}

// 注册自定义指令
const directives = {
  'click-outside': vClickOutside
}

// 当领域改变时重置不兼容的题型
watch(selectedDomains, (newDomains) => {
  if (newDomains.length === 0) {
    selectedDomains.value = ['frontend'] // 默认至少选择一个领域
  }
})

// 处理领域选择
const toggleDomain = (domainValue) => {
  const index = selectedDomains.value.indexOf(domainValue)
  if (index === -1) {
    selectedDomains.value.push(domainValue)
  } else {
    selectedDomains.value.splice(index, 1)
  }
}

// 修改返回按钮的处理函数
const handleBack = () => {
  router.push({
    path: '/home',
    replace: true
  })
}
</script>

<style scoped>
.create-paper {
  min-height: 100vh;
  background: #f5f7ff;
}

.nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  z-index: 100;
  height: 60px;
  display: flex;
  align-items: center;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.nav-back {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 50%;
}

.nav-back:hover {
  color: #4F6EF7;
  background: rgba(79, 110, 247, 0.1);
}

.nav-divider {
  width: 1px;
  height: 24px;
  background: #eee;
}

.nav-title {
  margin: 0;
  font-size: 18px;
  color: #333;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 24px;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.nav-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 50%;
}

.nav-btn:hover {
  color: #4F6EF7;
  background: rgba(79, 110, 247, 0.1);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 4px;
  border-radius: 24px;
  transition: all 0.3s ease;
}

.user-info:hover {
  background: rgba(0, 0, 0, 0.05);
}

.user-avatar {
  width: 32px;
  height: 32px;
  background: #4F6EF7;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  text-transform: uppercase;
}

.username {
  font-weight: 500;
  color: #333;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px;
}

.logout-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 50%;
  opacity: 0.7;
}

.logout-btn:hover {
  color: #ff4d4f;
  background: rgba(255, 77, 79, 0.1);
  opacity: 1;
}

.main-content {
  margin-top: 60px;
  padding: 24px;
}

.paper-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 32px;
  align-items: start;
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
  margin-bottom: 24px;
  color: #333;
  padding-bottom: 12px;
  border-bottom: 1px solid #eee;
}

.config-section {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
  max-width: 480px;
  margin: 0 auto;
  position: sticky;
  top: 84px; /* nav-bar height (60px) + padding */
  height: calc(100vh - 108px); /* 100vh - nav-bar height - padding */
  overflow-y: auto;
}

/* 添加滚动条样式 */
.config-section::-webkit-scrollbar {
  width: 6px;
}

.config-section::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.config-section::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 3px;
}

.config-section::-webkit-scrollbar-thumb:hover {
  background: #999;
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
  margin-top: 16px;
}

.difficulty-option {
  flex: 1;
  position: relative;
}

.difficulty-option input[type="radio"] {
  display: none;
}

.difficulty-option span {
  display: block;
  padding: 12px;
  text-align: center;
  background: white;
  border: 2px solid #eee;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  color: #333;
}

.difficulty-option input[type="radio"]:checked + span {
  background: rgba(var(--vt-c-primary-rgb), 0.1);
  color: var(--vt-c-primary);
  border-color: var(--vt-c-primary);
  box-shadow: 0 2px 8px rgba(var(--vt-c-primary-rgb), 0.2);
  transform: translateY(-1px);
  font-weight: 600;
}

.difficulty-option:hover span {
  background: rgba(var(--vt-c-primary-rgb), 0.05);
  border-color: var(--vt-c-primary);
  transform: translateY(-1px);
}

.generate-btn {
  margin-top: 32px;
  margin-bottom: 24px;
  width: 100%;
  padding: 16px;
  background: #4F6EF7;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
  overflow: hidden;
  font-weight: 500;
  letter-spacing: 1px;
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
  height: calc(100vh - 108px);
  overflow-y: auto;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
  position: relative;
}

/* 添加预览区滚动条样式 */
.preview-section::-webkit-scrollbar {
  width: 6px;
}

.preview-section::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.preview-section::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 3px;
}

.preview-section::-webkit-scrollbar-thumb:hover {
  background: #999;
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
  .paper-container {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .config-section {
    max-width: 100%;
    position: relative;
    top: 0;
    height: auto;
    overflow-y: visible;
  }
  
  .preview-section {
    height: auto;
    min-height: 500px;
  }
}

@media (max-width: 480px) {
  .domain-list {
    grid-template-columns: 1fr;
  }
  
  .difficulty-options {
    flex-direction: column;
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
  gap: 8px;
  padding: 8px 16px;
  background: #4F6EF7;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  min-width: 120px;
}

.start-solve-btn:hover {
  background: #3D5CE5;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(79, 110, 247, 0.2);
}

.btn-content {
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
  width: 100%;
}

.btn-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
}

.btn-text {
  font-size: 14px;
  font-weight: 500;
  color: white;
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

.question-types {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.type-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.type-item label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.type-item input[type="checkbox"] {
  width: 18px;
  height: 18px;
  accent-color: #1a73e8;
}

.type-item input[type="number"] {
  width: 80px;
  padding: 8px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  text-align: center;
}

.type-item input[type="number"]:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

.matching-items {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-top: 16px;
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
}

.answer-pairs {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.answer-pair {
  padding: 4px 12px;
  background: #e8f0fe;
  border-radius: 4px;
  font-weight: 500;
}

.answer-content {
  white-space: pre-wrap;
  line-height: 1.5;
}

.types-dropdown {
  position: relative;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.dropdown-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.3s;
}

.dropdown-header:hover {
  background-color: #f5f7ff;
}

.dropdown-arrow {
  transition: transform 0.3s;
}

.dropdown-arrow.open {
  transform: rotate(180deg);
}

.dropdown-content {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 12px;
  margin-top: 8px;
  z-index: 100;
}

.dropdown-close {
  display: flex;
  justify-content: flex-end;
  padding: 4px;
  margin-bottom: 8px;
  cursor: pointer;
}

.dropdown-close svg {
  color: #666;
  transition: color 0.3s ease;
}

.dropdown-close:hover svg {
  color: #1a73e8;
}

/* 添加动画效果 */
.dropdown-content {
  animation: slideDown 0.2s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.history-section {
  margin-bottom: 30px;
}

/* 新增多选列表样式 */
.domain-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-top: 12px;
  padding: 4px;
  margin-bottom: 12px;
}

.domain-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: white;
  border: 2px solid #eee;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
  min-height: 48px;
  flex: 1;
  min-width: 0;
  position: relative;
  overflow: hidden;
}

.domain-item:hover {
  border-color: var(--vt-c-primary);
  background: rgba(var(--vt-c-primary-rgb), 0.05);
  transform: translateY(-1px);
}

.domain-item.active {
  border-color: var(--vt-c-primary);
  background: rgba(var(--vt-c-primary-rgb), 0.05);
  font-weight: 500;
}

.domain-checkbox {
  width: 20px;
  height: 20px;
  border: 2px solid #ddd;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  background: white;
  flex-shrink: 0;
  position: relative;
}

.domain-item.active .domain-checkbox {
  border-color: var(--vt-c-primary);
  background: white;
  box-shadow: 0 2px 4px rgba(var(--vt-c-primary-rgb), 0.2);
}

.checkmark {
  color: var(--vt-c-primary);
  font-size: 16px;
  font-weight: bold;
  line-height: 1;
  transform: translateY(-2px);
  user-select: none;
}

.domain-label {
  font-size: 14px;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  text-align: left;
}

.domain-item.active .domain-label {
  color: var(--vt-c-primary);
  font-weight: 500;
}

.domain-hint {
  margin-top: 12px;
  font-size: 14px;
  color: #666;
  padding: 12px;
  background: #f5f7ff;
  border-radius: 8px;
  line-height: 1.4;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (max-width: 768px) {
  .domain-list {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .domain-item {
    width: 100%;
    min-width: 0;
  }
}

@media (max-width: 480px) {
  .domain-list {
    grid-template-columns: 1fr;
  }
  
  .domain-item {
    width: 100%;
  }
  
  .difficulty-options {
    flex-direction: column;
  }
  
  .difficulty-option span {
    width: 100%;
    text-align: center;
  }
}

.setting-group {
  margin-bottom: 32px;
  padding: 24px;
  background: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #eee;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.setting-group:hover {
  border-color: var(--vt-c-primary);
  box-shadow: 0 2px 8px rgba(var(--vt-c-primary-rgb), 0.1);
}
</style>