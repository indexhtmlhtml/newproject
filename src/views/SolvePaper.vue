<template>
  <div class="solve-paper">
    <header class="header">
      <div class="header-content">
        <div class="left-section">
          <button class="back-btn" @click="confirmExit">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
            {{ t('common.back') }}
          </button>
          <div class="exam-info">
            <h1>{{ paper?.title || t('paper.defaultTitle') }}</h1>
            <div class="exam-meta">
              <span class="duration">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8s8 3.58 8 8s-3.58 8-8 8z"/>
                  <path fill="currentColor" d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                </svg>
                {{ paper?.duration }}分钟
              </span>
              <span class="total-score">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 2h1.5v3l2-3h1.7l-2 3 2 3h-1.7l-2-3v3H12V5zM7 5h2c1.1 0 2 .9 2 2v1.5c0 1.1-.9 2-2 2h-1v3H7V5zm0 4h1c.55 0 1-.45 1-1V6c0-.55-.45-1-1-1H7v4z"/>
                </svg>
                总分：{{ paper?.totalScore || 100 }}
              </span>
            </div>
          </div>
        </div>
        <div class="timer-display">
          <div class="time-remaining">
            <div class="time-value">{{ formatTime(timeLeft) }}</div>
            <div class="time-label">剩余时间</div>
          </div>
        </div>
      </div>
    </header>

    <main class="main-content">
      <nav class="question-nav">
        <div class="nav-section" v-if="paper?.choice?.length">
          <div class="section-title">
            <span>选择题</span>
            <span class="count">{{ getCompletedCount('choice') }}/{{ paper.choice.length }}</span>
          </div>
          <div class="question-dots">
            <button 
              v-for="(_, index) in paper.choice" 
              :key="`choice_${index}`"
              class="dot"
              :class="{
                'completed': isQuestionAnswered('choice', index),
                'current': currentType === 'choice' && currentIndex === index
              }"
              @click="scrollToQuestion('choice', index)"
            >
              {{ index + 1 }}
            </button>
          </div>
        </div>

        <div class="nav-section" v-if="paper?.programming?.length">
          <div class="section-title">
            <span>编程题</span>
            <span class="count">{{ getCompletedCount('programming') }}/{{ paper.programming.length }}</span>
          </div>
          <div class="question-dots">
            <button 
              v-for="(_, index) in paper.programming" 
              :key="`programming_${index}`"
              class="dot"
              :class="{
                'completed': answers.programming[index]?.trim() !== '',
                'current': currentType === 'programming' && currentIndex === index
              }"
              @click="scrollToQuestion('programming', index)"
            >
              {{ index + 1 }}
            </button>
          </div>
        </div>

        <div class="nav-section" v-if="paper?.completion?.length">
          <div class="section-title">
            <span>填空题</span>
            <span class="count">{{ getCompletedCount('completion') }}/{{ paper.completion.length }}</span>
          </div>
          <div class="question-dots">
            <button 
              v-for="(_, index) in paper.completion" 
              :key="`completion_${index}`"
              class="dot"
              :class="{
                'completed': answers.completion[index]?.trim() !== '',
                'current': currentType === 'completion' && currentIndex === index
              }"
              @click="scrollToQuestion('completion', index)"
            >
              {{ index + 1 }}
            </button>
          </div>
        </div>

        <div class="nav-section" v-if="paper?.truefalse?.length">
          <div class="section-title">
            <span>判断题</span>
            <span class="count">{{ getCompletedCount('truefalse') }}/{{ paper.truefalse.length }}</span>
          </div>
          <div class="question-dots">
            <button 
              v-for="(_, index) in paper.truefalse" 
              :key="`truefalse_${index}`"
              class="dot"
              :class="{
                'completed': answers.truefalse[index] !== null,
                'current': currentType === 'truefalse' && currentIndex === index
              }"
              @click="scrollToQuestion('truefalse', index)"
            >
              {{ index + 1 }}
            </button>
          </div>
        </div>

        <div class="nav-section" v-if="paper?.shortanswer?.length">
          <div class="section-title">
            <span>简答题</span>
            <span class="count">{{ getCompletedCount('shortanswer') }}/{{ paper.shortanswer.length }}</span>
          </div>
          <div class="question-dots">
            <button 
              v-for="(_, index) in paper.shortanswer" 
              :key="`shortanswer_${index}`"
              class="dot"
              :class="{
                'completed': answers.shortanswer[index]?.trim() !== '',
                'current': currentType === 'shortanswer' && currentIndex === index
              }"
              @click="scrollToQuestion('shortanswer', index)"
            >
              {{ index + 1 }}
            </button>
          </div>
        </div>

        <div class="nav-section" v-if="paper?.matching?.length">
          <div class="section-title">
            <span>匹配题</span>
            <span class="count">{{ getCompletedCount('matching') }}/{{ paper.matching.length }}</span>
          </div>
          <div class="question-dots">
            <button 
              v-for="(_, index) in paper.matching" 
              :key="`matching_${index}`"
              class="dot"
              :class="{
                'completed': isMatchingQuestionAnswered(index),
                'current': currentType === 'matching' && currentIndex === index
              }"
              @click="scrollToQuestion('matching', index)"
            >
              {{ index + 1 }}
            </button>
          </div>
        </div>
      </nav>

      <div class="questions-container">
        <section v-if="paper?.choice?.length" class="question-section">
          <h2>选择题</h2>
          <div class="questions-list">
            <div v-for="(question, index) in paper.choice" 
                 :key="index" 
                 :id="`choice_${index}`"
                 class="question-item">
              <div class="question-header">
                <div class="question-info">
                  <span class="question-number">{{ index + 1 }}</span>
                  <span class="question-score">{{ question.score }}分</span>
                </div>
                <div class="question-status" v-if="isQuestionAnswered('choice', index)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                  </svg>
                  已作答
                </div>
              </div>
              <div class="question-content" v-html="formatQuestionContent(question.content)"></div>
              <div class="options-list">
                <div v-for="(optionValue, optionKey) in question.options" 
                     :key="optionKey"
                     :class="['option-item', { 
                       selected: answers.choice[index] === optionKey
                     }]"
                     @click="selectAnswer('choice', index, optionKey)">
                  <label>
                    <input type="radio" 
                           :name="`choice-${index}`" 
                           :value="optionKey"
                           :checked="answers.choice[index] === optionKey"
                           @change="selectAnswer('choice', index, optionKey)">
                    <span class="option-label">{{ optionKey }}</span>
                    <span>{{ optionValue }}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section v-if="paper?.programming?.length" class="question-section">
          <h2>编程题</h2>
          <div class="questions-list">
            <div v-for="(question, index) in paper.programming" 
                 :key="index" 
                 :id="`programming_${index}`"
                 class="question-item">
              <div class="question-header">
                <div class="question-info">
                  <span class="question-number">{{ index + 1 }}</span>
                  <span class="question-score">{{ question.score }}分</span>
                </div>
                <div class="question-status" v-if="answers.programming[index]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                  </svg>
                  已作答
                </div>
              </div>
              <div class="question-content" v-html="formatQuestionContent(question.content)"></div>
              <textarea 
                v-model="answers.programming[index]"
                :placeholder="t('problems.answerPlaceholder')"
                rows="6"
                class="code-textarea"
              ></textarea>
            </div>
          </div>
        </section>

        <section v-if="paper?.completion?.length" class="question-section">
          <h2>填空题</h2>
          <div class="questions-list">
            <div v-for="(question, index) in paper.completion" 
                 :key="index" 
                 :id="`completion_${index}`"
                 class="question-item">
              <div class="question-header">
                <div class="question-info">
                  <span class="question-number">{{ index + 1 }}</span>
                  <span class="question-score">{{ question.score }}分</span>
                </div>
                <div class="question-status" v-if="answers.completion[index]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                  </svg>
                  已作答
                </div>
              </div>
              <div class="question-content" v-html="formatQuestionContent(question.content)"></div>
              <input 
                type="text" 
                v-model="answers.completion[index]"
                :placeholder="t('problems.answerPlaceholder')"
                class="completion-input"
              >
            </div>
          </div>
        </section>

        <section v-if="paper?.truefalse?.length" class="question-section">
          <h2>判断题</h2>
          <div class="questions-list">
            <div v-for="(question, index) in paper.truefalse" 
                 :key="index" 
                 :id="`truefalse_${index}`"
                 class="question-item">
              <div class="question-header">
                <div class="question-info">
                  <span class="question-number">{{ index + 1 }}</span>
                  <span class="question-score">{{ question.score }}分</span>
                </div>
                <div class="question-status" v-if="answers.truefalse[index] !== null">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                  </svg>
                  已作答
                </div>
              </div>
              <div class="question-content" v-html="formatQuestionContent(question.content)"></div>
              <div class="truefalse-options">
                <label class="radio-label">
                  <input type="radio" 
                         v-model="answers.truefalse[index]" 
                         :name="`truefalse_${index}`" 
                         :value="true"> 正确
                </label>
                <label class="radio-label">
                  <input type="radio" 
                         v-model="answers.truefalse[index]" 
                         :name="`truefalse_${index}`" 
                         :value="false"> 错误
                </label>
              </div>
            </div>
          </div>
        </section>

        <section v-if="paper?.shortanswer?.length" class="question-section">
          <h2>简答题</h2>
          <div class="questions-list">
            <div v-for="(question, index) in paper.shortanswer" 
                 :key="index" 
                 :id="`shortanswer_${index}`"
                 class="question-item">
              <div class="question-header">
                <div class="question-info">
                  <span class="question-number">{{ index + 1 }}</span>
                  <span class="question-score">{{ question.score }}分</span>
                </div>
                <div class="question-status" v-if="answers.shortanswer[index]?.trim()">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                  </svg>
                  已作答
                </div>
              </div>
              <div class="question-content" v-html="formatQuestionContent(question.content)"></div>
              <textarea 
                v-model="answers.shortanswer[index]"
                :placeholder="t('problems.answerPlaceholder')"
                rows="4"
                class="answer-textarea"
              ></textarea>
            </div>
          </div>
        </section>

        <section v-if="paper?.matching?.length" class="question-section">
          <h2>匹配题</h2>
          <div class="questions-list">
            <div v-for="(question, index) in paper.matching" 
                 :key="index" 
                 :id="`matching_${index}`"
                 class="question-item">
              <div class="question-header">
                <div class="question-info">
                  <span class="question-number">{{ index + 1 }}</span>
                  <span class="question-score">{{ question.score }}分</span>
                </div>
              </div>
              <div class="question-content" v-html="formatQuestionContent(question.content)"></div>
              <div class="matching-container">
                <div class="matching-column">
                  <div v-for="(item, itemIndex) in question.leftItems" 
                       :key="`left_${itemIndex}`"
                       class="matching-item">
                    {{ item }}
                  </div>
                </div>
                <div class="matching-column">
                  <select 
                    v-for="(_, itemIndex) in question.leftItems"
                    :key="`select_${itemIndex}`"
                    v-model="answers.matching[index][itemIndex]"
                    class="matching-select">
                    <option value="">请选择</option>
                    <option 
                      v-for="(rightItem, rightIndex) in question.rightItems"
                      :key="rightIndex"
                      :value="rightIndex">
                      {{ rightItem }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div class="submit-wrapper">
        <div class="submit-container">
          <div class="submit-info">
            <div class="time-info">
              <div class="time-left">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8s8 3.58 8 8s-3.58 8-8 8z"/>
                  <path fill="currentColor" d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                </svg>
                {{ formatTime(timeLeft) }}
              </div>
            </div>
            <div class="progress-info">
              <div class="progress-text">
                <span>已完成 {{ completedCount }}/{{ totalQuestions }}</span>
                <span>{{ Math.round(completedCount/totalQuestions * 100) }}%</span>
              </div>
              <div class="progress-bar">
                <div class="progress" :style="{ width: `${completedCount/totalQuestions * 100}%` }"></div>
              </div>
            </div>
          </div>
          <button class="submit-btn" @click="submitPaper" :disabled="completedCount === 0">
            {{ t('paper.submit') }}
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
const startTime = ref(null)

// 修改初始化答案对象的方式
const answers = ref({
  choice: [],
  programming: [],
  completion: [],
  truefalse: [],
  shortanswer: [],
  matching: []
})

// 修改选择答案的函数
const selectAnswer = (type, index, value) => {
  if (!answers.value[type]) {
    answers.value[type] = []
  }
  
  switch (type) {
    case 'choice':
      // 直接保存选项值（A、B、C、D）
      answers.value.choice[index] = value
      // 自动保存到 localStorage
      saveAnswers()
      break
    case 'truefalse':
      answers.value.truefalse[index] = value === 'true'
      break
    case 'programming':
    case 'completion':
    case 'shortanswer':
      answers.value[type][index] = value
      break
    case 'matching':
      if (!answers.value.matching[index]) {
        answers.value.matching[index] = []
      }
      answers.value.matching[index] = value
      break
  }
}

// 修改保存答案的函数
const saveAnswers = () => {
  const formattedAnswers = {
    ...answers.value,
    choice: answers.value.choice.map(answer => answer || '')
  }
  localStorage.setItem('paperAnswers', JSON.stringify({
    answers: formattedAnswers,
    timestamp: Date.now()
  }))
}

const formatTime = (seconds) => {
  if (typeof seconds !== 'number' || isNaN(seconds)) {
    return '00:00'
  }
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

const submitPaper = () => {
  // 计算用时（秒）
  const usedTime = startTime.value ? Math.floor((Date.now() - startTime.value) / 1000) : 0
  
  // 确保选择题答案正确保存
  const formattedAnswers = {
    ...answers.value,
    choice: answers.value.choice.map(answer => answer || '')  // 确保未答题时为空字符串
  }

  // 保存答案和用时
  localStorage.setItem('paperAnswers', JSON.stringify({
    answers: formattedAnswers,
    usedTime: usedTime
  }))
  
  router.push('/paper-result')
}

onMounted(() => {
  // 记录开始时间
  startTime.value = Date.now()
  localStorage.setItem('examStartTime', startTime.value.toString())
  
  // 从 localStorage 获取试卷数据
  const paperData = localStorage.getItem('currentPaper')
  if (paperData) {
    paper.value = JSON.parse(paperData)
    
    // 确保清除所有之前的答案记录
    localStorage.removeItem('paperAnswers')
    localStorage.removeItem('answerState')
    
    // 初始化全新的答案对象
    initializeAnswers()
    
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

// 修改完成题目计数的逻辑
const completedCount = computed(() => {
  let count = 0;
  
  // 选择题计数
  if (answers.value.choice) {
    count += answers.value.choice.filter(answer => answer !== null).length;
  }
  
  // 编程题计数
  if (answers.value.programming) {
    count += answers.value.programming.filter(answer => answer && answer.trim() !== '').length;
  }
  
  // 填空题计数
  if (answers.value.completion) {
    count += answers.value.completion.filter(answer => answer && answer.trim() !== '').length;
  }

  // 判断题计数
  if (answers.value.truefalse) {
    count += answers.value.truefalse.filter(answer => answer !== null).length;
  }

  // 简答题计数
  if (answers.value.shortanswer) {
    count += answers.value.shortanswer.filter(answer => answer && answer.trim() !== '').length;
  }

  // 匹配题计数
  if (answers.value.matching) {
    count += answers.value.matching.filter(answer => 
      Array.isArray(answer) && 
      answer.length > 0 && 
      answer.every(item => item !== null && item !== '')
    ).length;
  }
  
  return count;
})

// 修改总题目数计数
const totalQuestions = computed(() => {
  let count = 0;
  if (paper.value) {
    count += paper.value.choice?.length || 0;
    count += paper.value.programming?.length || 0;
    count += paper.value.completion?.length || 0;
    count += paper.value.truefalse?.length || 0;
    count += paper.value.shortanswer?.length || 0;
    count += paper.value.matching?.length || 0;
  }
  return count;
})

// 添加当前题目追踪
const currentType = ref(null)
const currentIndex = ref(0)

// 获取每种题型的完成数量
const getCompletedCount = (type) => {
  if (!answers.value[type]) return 0
  
  switch (type) {
    case 'choice':
      return answers.value[type].filter(answer => 
        answer !== undefined && 
        answer !== null && 
        answer !== ''
      ).length
    case 'truefalse':
      return answers.value[type].filter(answer => answer !== null).length
    case 'programming':
    case 'completion':
    case 'shortanswer':
      return answers.value[type].filter(answer => answer?.trim() !== '').length
    case 'matching':
      if (!paper.value?.matching?.length) return 0
      return answers.value[type].filter((answer, index) => isMatchingQuestionAnswered(index)).length
    default:
      return 0
  }
}

// 修改滚动到指定题目的函数
const scrollToQuestion = (type, index) => {
  currentType.value = type
  currentIndex.value = index
  
  // 使用 requestAnimationFrame 确保 DOM 更新后再滚动
  requestAnimationFrame(() => {
    const element = document.getElementById(`${type}_${index}`)
    if (element) {
      // 计算滚动位置，考虑固定导航栏的高度
      const headerHeight = document.querySelector('.header').offsetHeight
      const navHeight = document.querySelector('.question-nav').offsetHeight
      const viewportHeight = window.innerHeight
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - (viewportHeight / 2) + (element.offsetHeight / 2)

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
      
      // 添加高亮效果
      element.classList.add('highlight')
      setTimeout(() => {
        element.classList.remove('highlight')
      }, 1500)
    }
  })
}

// 监听滚动以更新当前题目
onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const [type, index] = entry.target.id.split('_')
        currentType.value = type
        currentIndex.value = parseInt(index)
      }
    })
  }, { threshold: 0.5 })

  // 观察所有题目
  document.querySelectorAll('.question-item').forEach(item => {
    observer.observe(item)
  })
})

// 修改答案初始化
const initializeAnswers = () => {
  if (!paper.value) return;
  
  // 重置所有答案为初始状态
  answers.value = {
    choice: new Array(paper.value.choice?.length || 0),
    programming: Array(paper.value.programming?.length || 0).fill(''),
    completion: Array(paper.value.completion?.length || 0).fill(''),
    truefalse: Array(paper.value.truefalse?.length || 0).fill(null),
    shortanswer: Array(paper.value.shortanswer?.length || 0).fill(''),
    matching: Array(paper.value.matching?.length || 0).fill([])
  }
}

// 添加格式化选择题答案的方法
const formatChoiceAnswer = (index) => {
  const answer = answers.value.choice[index]
  if (answer === null) return ''
  return String.fromCharCode(65 + answer)
}

// 修改匹配题的答案处理
const handleMatchingAnswer = (questionIndex, itemIndex, value) => {
  if (!answers.value.matching[questionIndex]) {
    answers.value.matching[questionIndex] = []
  }
  answers.value.matching[questionIndex][itemIndex] = value === '' ? null : Number(value)
}

// 添加判断匹配题是否已作答的方法
const isMatchingQuestionAnswered = (index) => {
  const answer = answers.value.matching[index]
  return Array.isArray(answer) && 
         answer.length === paper.value.matching[index].leftItems.length && 
         answer.some(item => item !== null && item !== undefined && item !== '')
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

// 添加判断题目是否已作答的函数
const isQuestionAnswered = (type, index) => {
  if (!answers.value[type]) return false
  
  switch (type) {
    case 'choice':
      // 确保选择题答案存在且不为空
      return answers.value.choice[index] !== undefined && 
             answers.value.choice[index] !== null && 
             answers.value.choice[index] !== ''
    case 'truefalse':
      return answers.value.truefalse[index] !== null
    case 'programming':
    case 'completion':
    case 'shortanswer':
      return answers.value[type][index]?.trim() !== ''
    case 'matching':
      return isMatchingQuestionAnswered(index)
    default:
      return false
  }
}
</script>

<style scoped>
.solve-paper {
  min-height: 100vh;
  background: #f5f7ff;
}

.header {
  background: white;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left-section {
  display: flex;
  align-items: center;
  gap: 24px;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #f8f9fa;
  border: none;
  border-radius: 8px;
  color: #1a73e8;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: #eef2ff;
  transform: translateY(-1px);
}

.exam-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.exam-info h1 {
  font-size: 20px;
  color: #1a1a1a;
  margin: 0;
}

.exam-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  color: #666;
  font-size: 14px;
}

.duration, .total-score {
  display: flex;
  align-items: center;
  gap: 4px;
}

.timer-display {
  background: #1a73e8;
  padding: 12px 24px;
  border-radius: 12px;
  color: white;
  text-align: center;
  min-width: 140px;
}

.time-remaining {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.time-value {
  font-size: 24px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.time-label {
  font-size: 12px;
  opacity: 0.8;
}

.main-content {
  max-width: 1200px;
  margin: 32px auto;
  padding: 0 24px;
  display: grid;
  gap: 24px;
}

.questions-container {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
}

.question-section {
  margin-bottom: 40px;
}

.question-section h2 {
  font-size: 20px;
  color: #1a1a1a;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
}

.question-item {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  scroll-margin-top: 160px;
}

.question-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0,0,0,0.12);
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.question-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.question-number {
  width: 36px;
  height: 36px;
  background: #1a73e8;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(26, 115, 232, 0.2);
}

.question-score {
  font-size: 16px;
  color: #666;
  font-weight: 500;
}

.question-status {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #4CAF50;
  font-size: 14px;
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
  padding: 12px;
  background: linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 20%);
  z-index: 100;
}

.submit-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 12px 20px;
  background: white;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.submit-info {
  display: flex;
  align-items: center;
  gap: 24px;
}

.time-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.time-left {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 16px;
  font-weight: 600;
  color: #1a73e8;
}

.progress-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 200px;
}

.progress-text {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #666;
}

.progress-bar {
  height: 6px;
  background: #e0e0e0;
  border-radius: 3px;
  overflow: hidden;
}

.progress {
  height: 100%;
  background: #4CAF50;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.submit-btn {
  padding: 8px 24px;
  background: #1a73e8;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-btn:hover:not(:disabled) {
  background: #1557b0;
  transform: translateY(-1px);
}

.submit-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.question-nav {
  position: sticky;
  top: 80px;
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  margin-bottom: 24px;
}

.nav-section {
  margin-bottom: 16px;
}

.nav-section:last-child {
  margin-bottom: 0;
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  color: #666;
  font-size: 14px;
}

.count {
  background: #f0f4ff;
  padding: 4px 8px;
  border-radius: 12px;
  color: #1a73e8;
  font-weight: 500;
}

.question-dots {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.dot {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid #e0e0e0;
  background: white;
  color: #666;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none;
}

.dot:hover {
  border-color: #1a73e8;
  color: #1a73e8;
  transform: translateY(-1px);
}

.dot.completed {
  background: #e8f5e9;
  border-color: #4CAF50;
  color: #2e7d32;
}

.dot.current {
  background: #1a73e8;
  border-color: #1a73e8;
  color: white;
  box-shadow: 0 2px 8px rgba(26, 115, 232, 0.3);
}

.dot:active {
  transform: scale(0.95);
}

/* 优化题目容器样式 */
.questions-container {
  padding-bottom: 100px;
}

.question-item {
  scroll-margin-top: 100px;
}

/* 优化选项样式 */
.option-item {
  position: relative;
  padding-left: 48px;
}

.option-item input[type="radio"] {
  position: absolute;
  left: 16px;
}

/* 添加编程题的工具栏 */
.code-toolbar {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.toolbar-btn {
  padding: 4px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background: white;
  color: #666;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.toolbar-btn:hover {
  background: #f8f9fa;
  border-color: #1a73e8;
  color: #1a73e8;
}

/* 添加高亮动画效果 */
@keyframes highlight {
  0% {
    background: #fff;
    transform: translateY(0);
  }
  50% {
    background: #e8f0fe;
    transform: translateY(-2px);
  }
  100% {
    background: #fff;
    transform: translateY(0);
  }
}

.question-item.highlight {
  animation: highlight 1.5s ease;
}

/* 添加响应式布局 */
@media (max-width: 768px) {
  .question-nav {
    position: fixed;
    bottom: 80px;
    left: 0;
    right: 0;
    top: auto;
    margin: 12px;
    z-index: 99;
  }

  .question-dots {
    max-height: 120px;
    overflow-y: auto;
    padding: 8px;
  }

  .questions-container {
    padding-bottom: 200px;
  }
}

/* 添加新题型样式 */
.truefalse-options {
  display: flex;
  gap: 24px;
  margin-top: 16px;
}

.answer-textarea {
  width: 100%;
  min-height: 120px;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  resize: vertical;
  margin-top: 16px;
}

.matching-container {
  display: flex;
  gap: 32px;
  margin-top: 16px;
}

.matching-column {
  flex: 1;
}

.matching-item {
  padding: 12px;
  background: #f5f7ff;
  border-radius: 8px;
  margin-bottom: 12px;
}

.matching-select {
  width: 100%;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 12px;
  background: white;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.radio-label input[type="radio"] {
  width: 18px;
  height: 18px;
  accent-color: var(--vt-c-primary);
}

.answer-textarea {
  width: 100%;
  min-height: 120px;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  resize: vertical;
  margin-top: 16px;
  font-family: inherit;
}

.matching-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-top: 16px;
}

.matching-item {
  padding: 12px;
  background: #f5f7ff;
  border-radius: 8px;
  margin-bottom: 12px;
}

.matching-select {
  width: 100%;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 12px;
  background: white;
  cursor: pointer;
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

/* 添加行号样式（可选） */
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

/* 保留选项标签样式 */
.option-label {
  color: #666;
  margin-right: 8px;
}
</style> 