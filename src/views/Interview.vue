<template>
  <div class="interview-container">
    <header class="header">
      <div class="header-content">
        <button class="nav-btn" @click="router.back()">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
          返回
        </button>
        <div class="interview-status" v-if="currentInterviewer">
          <div class="status-indicator"></div>
          <span>面试进行中</span>
          <span class="duration">{{ formatDuration }}</span>
        </div>
        <div class="header-title">
          <h1>AI 模拟面试</h1>
          <p class="subtitle">通过 AI 技术提供专业的技术面试体验</p>
        </div>
        <div class="header-actions">
          <button class="nav-btn" @click="toggleFullscreen">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
              <path fill="currentColor" d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
            </svg>
            全屏模式
          </button>
          <button class="nav-btn" @click="toggleGuidance">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
              <path fill="currentColor" d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z"/>
            </svg>
            面试指南
          </button>
        </div>
      </div>
    </header>

    <main class="main-content">
      <!-- 面试指南弹窗 -->
      <div v-if="showGuidance" class="guidance-modal" @click="showGuidance = false">
        <div class="guidance-content" @click.stop>
          <div class="guidance-header">
            <h3>面试技巧与建议</h3>
            <button class="close-btn" @click="showGuidance = false">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
          </div>
          <div class="guidance-body">
            <div class="tip-section">
              <h4>回答技巧</h4>
              <ul>
                <li>使用 STAR 法则回答问题：情境(Situation)、任务(Task)、行动(Action)、结果(Result)</li>
                <li>清晰简洁地表达，突出关键点</li>
                <li>适时举例说明，增加说服力</li>
                <li>如果不理解问题，可以请面试官解释</li>
              </ul>
            </div>
            <div class="tip-section">
              <h4>注意事项</h4>
              <ul>
                <li>保持专业的态度和用语</li>
                <li>诚实回答，不要虚构经历</li>
                <li>展示解决问题的思路过程</li>
                <li>适时反问，展示求知欲</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- 面试进行中 -->
      <div v-if="currentInterviewer" class="interview-layout">
        <div class="interview-sidebar">
          <div class="sidebar-tabs">
            <button 
              v-for="tab in ['面试官', '进度']" 
              :key="tab"
              :class="['tab-btn', { active: currentTab === tab }]"
              @click="currentTab = tab"
            >
              {{ tab }}
            </button>
          </div>
          
          <div v-if="currentTab === '面试官'" class="tab-content">
            <div class="interviewer-info">
              <div class="avatar-wrapper">
                <img :src="currentInterviewer.avatar" :alt="currentInterviewer.name">
                <div class="online-indicator"></div>
              </div>
              <div class="info-text">
                <h3>{{ currentInterviewer.name }}</h3>
                <p class="title">{{ currentInterviewer.title }}</p>
                <p class="company">{{ currentInterviewer.company }}</p>
              </div>
            </div>
            <div class="interviewer-description">
              <h4>专业领域</h4>
              <p>{{ currentInterviewer.description }}</p>
              <h4>面试风格</h4>
              <ul>
                <li v-for="style in currentInterviewer.styles" :key="style">{{ style }}</li>
              </ul>
            </div>
          </div>
          
          <div v-else class="tab-content">
            <div class="interview-progress">
              <h4>面试进度</h4>
              <div class="progress-steps">
                <div v-for="(step, index) in interviewSteps" 
                     :key="index"
                     :class="['step', getStepStatus(index)]">
                  <div class="step-icon">{{ index + 1 }}</div>
                  <span>{{ step }}</span>
                  <div class="step-line" v-if="index < interviewSteps.length - 1"></div>
                </div>
              </div>
            </div>
            <div class="progress-summary">
              <div class="summary-item">
                <span class="label">已完成问题</span>
                <span class="value">{{ completedQuestions }}</span>
              </div>
              <div class="summary-item">
                <span class="label">平均回答时长</span>
                <span class="value">{{ avgResponseTime }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="chat-container">
          <div class="chat-header">
            <h2>面试对话</h2>
            <div class="chat-actions">
              <button class="action-btn" @click="clearChat">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2.46-7.12l1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14l-2.13-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4z"/>
                </svg>
                清空对话
              </button>
              <button class="end-btn" @click="endInterview">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
                结束面试
              </button>
            </div>
          </div>

          <div class="messages" ref="messagesContainer">
            <div class="messages-date-divider">
              <span>{{ formatDate(new Date()) }}</span>
            </div>
            <div v-for="(message, index) in messages" 
                 :key="index"
                 :class="['message', message.role]">
              <div class="message-avatar" v-if="message.role === 'assistant'">
                <img :src="currentInterviewer.avatar" :alt="currentInterviewer.name">
              </div>
              <div class="message-content">{{ message.content }}</div>
              <div class="message-time">{{ formatTime(message.timestamp) }}</div>
            </div>
          </div>
          
          <div class="input-container">
            <textarea 
              v-model="currentMessage"
              @keydown.enter.prevent="sendMessage"
              placeholder="输入你的回答..."
              :disabled="isLoading"
              @input="autoGrow"
              ref="messageInput"
            ></textarea>
            <div class="input-actions">
              <div class="input-tools">
                <button class="hint-btn" @click="toggleGuidance">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
                  </svg>
                  面试技巧
                </button>
                <button class="hint-btn" @click="clearInput">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                  </svg>
                  清空输入
                </button>
              </div>
              <button 
                class="send-btn"
                @click="sendMessage"
                :disabled="isLoading || !currentMessage.trim()">
                {{ isLoading ? '思考中...' : '发送' }}
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 面试官选择页面 -->
      <div v-else class="interviewer-selection">
        <div class="selection-filters">
          <div class="search-box">
            <input 
              type="text" 
              v-model="searchQuery"
              placeholder="搜索面试官或技术方向..."
            >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
              <path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
          </div>
          
          <div class="filter-tags">
            <button 
              v-for="tag in filterTags" 
              :key="tag"
              :class="['filter-tag', { active: selectedTags.includes(tag) }]"
              @click="toggleTag(tag)"
            >
              {{ tag }}
            </button>
          </div>
        </div>

        <div class="interviewers-grid">
          <div v-for="interviewer in filteredInterviewers" 
               :key="interviewer.id" 
               class="interviewer-card"
               @click="selectInterviewer(interviewer)">
            <div class="card-main">
              <img :src="interviewer.avatar" :alt="interviewer.name" class="avatar">
              <div class="info">
                <div class="name-title">
                  <h3>{{ interviewer.name }}</h3>
                  <span class="online-badge" v-if="interviewer.online">在线</span>
                </div>
                <p class="title">{{ interviewer.title }}</p>
                <p class="company">{{ interviewer.company }}</p>
              </div>
            </div>
            
            <div class="card-details">
              <div class="stats">
                <div class="stat">
                  <span class="value">{{ interviewer.experience }}年</span>
                  <span class="label">面试经验</span>
                </div>
                <div class="stat">
                  <span class="value">{{ interviewer.rating }}分</span>
                  <span class="label">面试评分</span>
                </div>
              </div>
              
              <div class="expertise">
                <span v-for="tag in interviewer.tags" 
                      :key="tag" 
                      class="expertise-tag">
                  {{ tag }}
                </span>
              </div>
              
              <button class="start-btn" :disabled="!interviewer.online">
                {{ interviewer.online ? '开始面试' : '暂时离线' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed } from 'vue'
import { useRouter } from 'vue-router'
import { INTERVIEWERS } from '../config/interviewers'

const router = useRouter()
const messages = ref([])
const currentMessage = ref('')
const isLoading = ref(false)
const error = ref(null)
const currentInterviewer = ref(null)
const messagesContainer = ref(null)
const showGuidance = ref(false)

const directions = ['全部', '前端开发', '后端开发', '算法', '系统架构']
const selectedDirection = ref('全部')

// 搜索和筛选
const searchQuery = ref('')
const selectedTags = ref([])

// 根据搜索和筛选条件过滤面试官
const filteredInterviewers = computed(() => {
  let result = INTERVIEWERS
  
  // 搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(interviewer => 
      interviewer.name.toLowerCase().includes(query) ||
      interviewer.title.toLowerCase().includes(query) ||
      interviewer.tags.some(tag => tag.toLowerCase().includes(query))
    )
  }
  
  // 方向过滤
  if (selectedDirection.value !== '全部') {
    result = result.filter(interviewer => 
      interviewer.direction === selectedDirection.value
    )
  }
  
  return result
})

// 切换标签
const toggleTag = (tag) => {
  const index = selectedTags.value.indexOf(tag)
  if (index === -1) {
    selectedTags.value.push(tag)
  } else {
    selectedTags.value.splice(index, 1)
  }
}

// 格式化消息时间
const formatTime = (timestamp) => {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  return date.toLocaleTimeString('zh-CN', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const toggleGuidance = () => {
  showGuidance.value = !showGuidance.value
}

// 初始化面试
const initializeInterview = async (interviewer) => {
  try {
    isLoading.value = true
    const response = await fetch('/coze-api/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        bot_id: interviewer.id,
        content: [{
          role: 'system',
          content: `你是一位${interviewer.title}面试官。请以专业面试官的身份进行面试，遵循以下规则：
          1. 先简单自我介绍
          2. 从基础知识开始提问
          3. 根据候选人的回答逐步增加难度
          4. 注重考察实际问题解决能力
          5. 每次只问一个问题，等待回答后再继续
          6. 如果回答不够清楚，适时追问`
        }],
        conversation_id: `interview_${Date.now()}`,
      })
    })

    if (!response.ok) {
      throw new Error('面试初始化失败')
    }

    const data = await response.json()
    // 过滤出类型为 answer 的消息
    const answer = data.data.find(msg => msg.type === 'answer')
    messages.value = [{
      role: 'assistant',
      content: answer.content,
      timestamp: Date.now()
    }]
  } catch (err) {
    console.error('Interview initialization error:', err)
    error.value = '面试初始化失败，请重试'
  } finally {
    isLoading.value = false
  }
}

// 选择面试官
const selectInterviewer = async (interviewer) => {
  if (interviewer.type !== 'coze') {
    error.value = '该面试官暂不可用'
    return
  }
  
  currentInterviewer.value = interviewer
  localStorage.setItem('currentInterviewer', JSON.stringify(interviewer))
  await initializeInterview(interviewer)
}

// 发送消息
const sendMessage = async () => {
  if (!currentMessage.value.trim() || isLoading.value) return
  
  const messageContent = currentMessage.value
  currentMessage.value = ''
  isLoading.value = true
  
  try {
    const userMessage = {
      role: 'user',
      content: messageContent,
      timestamp: Date.now()
    }
    messages.value.push(userMessage)
    
    const response = await fetch('/coze-api/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        bot_id: currentInterviewer.value.id,
        content: messageContent,
        conversation_id: `interview_${Date.now()}`,
      })
    })
    
    if (!response.ok) {
      throw new Error('发送消息失败')
    }
    
    const data = await response.json()
    // 过滤出类型为 answer 的消息
    const answer = data.data.find(msg => msg.type === 'answer')
    messages.value.push({
      role: 'assistant',
      content: answer.content,
      timestamp: Date.now()
    })
    
    await nextTick()
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  } catch (err) {
    console.error('Send message error:', err)
    error.value = '消息发送失败，请重试'
  } finally {
    isLoading.value = false
  }
}

// 结束面试
const endInterview = async () => {
  if (!confirm('确定要结束面试吗？')) return
  
  try {
    // 请求面试总结
    const response = await fetch('/coze-api/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer pat_DAFNcM7kUKLI`
      },
      body: JSON.stringify({
        bot_id: currentInterviewer.value.id,
        messages: [
          ...messages.value,
          {
            role: 'system',
            content: '请对这次面试进行总结，包括候选人的表现、优势和需要改进的地方。'
          }
        ]
      })
    })
    
    if (response.ok) {
      const data = await response.json()
      messages.value.push({
        role: 'assistant',
        content: data.choices[0].message.content
      })
    }
  } catch (err) {
    console.error('End interview error:', err)
  }
}

// 组件加载时检查是否有未完成的面试
onMounted(() => {
  const savedInterviewer = localStorage.getItem('currentInterviewer')
  if (savedInterviewer) {
    currentInterviewer.value = JSON.parse(savedInterviewer)
    initializeInterview(currentInterviewer.value)
  }
})

const interviewSteps = [
  '基础知识',
  '技术深度',
  '实战经验',
  '综合能力'
]

const getStepStatus = (index) => {
  const currentStep = Math.floor(messages.value.length / 4)
  if (index < currentStep) return 'completed'
  if (index === currentStep) return 'active'
  return ''
}

// 格式化持续时间
const formatDuration = computed(() => {
  if (!currentInterviewer.value) return ''
  const start = new Date(currentInterviewer.value.startTime || Date.now())
  const now = new Date()
  const diff = Math.floor((now - start) / 1000)
  const minutes = Math.floor(diff / 60)
  const seconds = diff % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
})

// 自动调整文本框高度
const autoGrow = (e) => {
  e.target.style.height = 'auto'
  e.target.style.height = (e.target.scrollHeight) + 'px'
}

// 清空输入
const clearInput = () => {
  currentMessage.value = ''
  if (messageInput.value) {
    messageInput.value.style.height = '80px'
  }
}

// 清空对话
const clearChat = () => {
  if (confirm('确定要清空所有对话记录吗？')) {
    messages.value = []
  }
}

// 切换全屏
const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}
</script>

<style scoped>
.interview-container {
  min-height: 100vh;
  background: #f5f7ff;
}

.header {
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 1px solid #eee;
  border-radius: 20px;
  background: white;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-btn:hover {
  border-color: #4F6EF7;
  color: #4F6EF7;
  background: #f5f7ff;
}

.main-content {
  max-width: 1200px;
  margin: 24px auto;
  padding: 0 24px;
}

/* 面试官选择页面样式 */
.selection-filters {
  margin-bottom: 32px;
}

.search-box {
  position: relative;
  max-width: 400px;
  margin-bottom: 20px;
}

.search-box input {
  width: 100%;
  padding: 12px 40px 12px 16px;
  border: 1px solid #eee;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
}

.search-box input:focus {
  border-color: #4F6EF7;
  box-shadow: 0 0 0 3px rgba(79, 110, 247, 0.1);
  outline: none;
}

.search-box svg {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
}

.filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.filter-tag {
  padding: 6px 16px;
  border: 1px solid #eee;
  border-radius: 20px;
  background: white;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-tag.active {
  background: #4F6EF7;
  color: white;
  border-color: #4F6EF7;
}

.interviewers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 24px;
}

.interviewer-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.interviewer-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.card-main {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}

.avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
}

.name-title {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 4px;
}

.online-badge {
  padding: 2px 8px;
  background: #22c55e;
  color: white;
  border-radius: 12px;
  font-size: 12px;
}

.title {
  color: #666;
  margin-bottom: 4px;
}

.company {
  color: #999;
  font-size: 14px;
}

.stats {
  display: flex;
  gap: 24px;
  margin-bottom: 16px;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat .value {
  font-size: 18px;
  font-weight: 600;
  color: #4F6EF7;
}

.stat .label {
  font-size: 12px;
  color: #666;
}

.expertise {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.expertise-tag {
  padding: 4px 12px;
  background: #f0f5ff;
  color: #4F6EF7;
  border-radius: 16px;
  font-size: 12px;
}

.start-btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  background: #4F6EF7;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.start-btn:hover:not(:disabled) {
  background: #3D5CE5;
}

.start-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .interviewers-grid {
    grid-template-columns: 1fr;
  }
}

/* 面试聊天界面样式 */
.interview-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 24px;
  height: calc(100vh - 120px);
}

.interview-sidebar {
  background: white;
  border-radius: 12px;
  padding: 20px;
}

.chat-container {
  background: white;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.message {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  margin-bottom: 24px;
  animation: slideIn 0.3s ease-out;
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

.message.assistant {
  margin-right: auto;
}

.message.user {
  margin-left: auto;
}

.message-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
}

.message-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.message-content {
  padding: 16px;
  border-radius: 12px;
  background: #f5f7ff;
  line-height: 1.6;
  white-space: pre-wrap;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.message.user .message-content {
  background: linear-gradient(135deg, #4F6EF7 0%, #3D5CE5 100%);
  color: white;
}

.message-time {
  font-size: 12px;
  color: #999;
  margin-top: 8px;
  text-align: right;
}

.input-container {
  padding: 20px;
  border-top: 1px solid #eee;
}

textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #eee;
  border-radius: 8px;
  resize: none;
  height: 80px;
}

.input-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
}

.hint-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 1px solid #eee;
  border-radius: 20px;
  background: white;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
}

.hint-btn:hover {
  border-color: #4F6EF7;
  color: #4F6EF7;
}

.send-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #4F6EF7 0%, #3D5CE5 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.send-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(79, 110, 247, 0.2);
}

.header-title {
  display: flex;
  flex-direction: column;
}

.subtitle {
  font-size: 14px;
  color: #666;
  margin-top: 4px;
}

.interview-stats {
  display: flex;
  justify-content: space-around;
  padding: 16px 0;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  margin: 16px 0;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-size: 20px;
  font-weight: 600;
  color: #4F6EF7;
}

.stat-label {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
}

.step {
  position: relative;
  padding: 16px;
  border-radius: 12px;
  background: #f8faff;
  margin-bottom: 16px;
  transition: all 0.3s ease;
}

.step-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #ccc;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

.step.completed .step-icon {
  background: #4CAF50;
}

.step.active .step-icon {
  background: #4F6EF7;
}

.step-line {
  position: absolute;
  left: 24px;
  bottom: -16px;
  width: 2px;
  height: 16px;
  background: #eee;
}

.step.completed .step-line {
  background: #4CAF50;
}

.step.active .step-line {
  background: #4F6EF7;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #eee;
}

.end-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 1px solid #ff4d4f;
  color: #ff4d4f;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.end-btn:hover {
  background: #fff1f0;
}

.avatar-wrapper {
  position: relative;
  width: 80px;
  height: 80px;
}

.online-indicator {
  position: absolute;
  bottom: 4px;
  right: 4px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #22c55e;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* 添加新样式 */
.guidance-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.guidance-content {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.guidance-header {
  padding: 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.guidance-header h3 {
  font-size: 20px;
  color: #333;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: #666;
  transition: all 0.3s ease;
}

.close-btn:hover {
  color: #333;
  transform: rotate(90deg);
}

.guidance-body {
  padding: 20px;
}

.tip-section {
  margin-bottom: 24px;
}

.tip-section h4 {
  color: #4F6EF7;
  margin-bottom: 12px;
  font-size: 16px;
}

.tip-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tip-section li {
  position: relative;
  padding-left: 24px;
  margin-bottom: 12px;
  color: #666;
  line-height: 1.5;
}

.tip-section li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 8px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #4F6EF7;
}

/* 响应式优化 */
@media (max-width: 768px) {
  .interview-layout {
    grid-template-columns: 1fr;
  }
  
  .interview-sidebar {
    display: none;
  }
  
  .guidance-content {
    width: 95%;
    margin: 10px;
  }
}

.interview-status {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: #f0f5ff;
  border-radius: 20px;
  color: #4F6EF7;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #4F6EF7;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(79, 110, 247, 0.7);
  }
  
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 6px rgba(79, 110, 247, 0);
  }
  
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(79, 110, 247, 0);
  }
}

.duration {
  font-size: 12px;
  color: #666;
}

.sidebar-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.tab-btn {
  flex: 1;
  padding: 8px;
  border: none;
  border-radius: 8px;
  background: #f5f7ff;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab-btn.active {
  background: #4F6EF7;
  color: white;
}

.messages-date-divider {
  text-align: center;
  margin: 24px 0;
  position: relative;
}

.messages-date-divider::before,
.messages-date-divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 40%;
  height: 1px;
  background: #eee;
}

.messages-date-divider::before {
  left: 0;
}

.messages-date-divider::after {
  right: 0;
}

.messages-date-divider span {
  background: white;
  padding: 0 16px;
  color: #999;
  font-size: 12px;
}
</style> 