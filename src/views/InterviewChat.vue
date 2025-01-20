<template>
  <div class="interview-chat">
    <header class="chat-header">
      <div class="header-main">
        <div class="header-left">
          <button class="back-btn" @click="handleBack">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
          </button>
          <div class="nav-breadcrumb">
            <span @click="router.push('/home')">首页</span>
            <span class="separator">/</span>
            <span @click="router.push('/interview')">面试官</span>
            <span class="separator">/</span>
            <span class="current">面试中</span>
          </div>
        </div>

        <div class="header-center">
          <div class="interviewer-profile">
            <div class="avatar-wrapper">
              <img :src="interviewer?.avatar" :alt="interviewer?.name">
              <span class="online-dot"></span>
            </div>
            <div class="interviewer-info">
              <h2>{{ interviewer?.name }}</h2>
              <div class="interviewer-tags">
                <span class="tag experience">{{ interviewer?.experience }}年经验</span>
                <span class="tag">{{ interviewer?.title }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="header-right">
          <div class="resume-upload">
            <input
              type="file"
              ref="fileInput"
              accept=".pdf"
              @change="handleFileUpload"
              class="hidden-input"
            />
            <button 
              class="upload-btn"
              @click="triggerFileUpload"
              :class="{ 'uploaded': isUploaded, 'uploading': isUploading }"
            >
              <svg v-if="!isUploaded" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                <path fill="currentColor" d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11zM8 15.01l1.41 1.41L11 14.84V19h2v-4.16l1.59 1.59L16 15.01 12.01 11z"/>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
              </svg>
              <span>{{ uploadButtonText }}</span>
              <div v-if="isUploading" class="upload-progress"></div>
            </button>
          </div>
          <div class="header-actions">
            <button class="action-btn" @click="toggleGuidance" title="面试指南">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
              </svg>
            </button>
            <button class="action-btn" @click="toggleFullscreen">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                <path fill="currentColor" d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>

    <div class="guidance-modal" v-if="showGuidance" @click.self="toggleGuidance">
      <div class="modal-content">
        <h3>面试指南</h3>
        <div class="guidance-steps">
          <div v-for="(step, index) in interviewSteps" 
               :key="index"
               :class="['step', getStepStatus(index)]">
            <div class="step-number">{{ index + 1 }}</div>
            <div class="step-content">
              <h4>{{ step.title }}</h4>
              <p>{{ step.description }}</p>
            </div>
          </div>
        </div>
        <button class="close-btn" @click="toggleGuidance">关闭</button>
      </div>
    </div>

    <main class="chat-main">
      <div class="messages" ref="messagesContainer">
        <div class="interview-start-info" v-if="messages.length === 0">
          <div class="avatar-large">
            <img :src="interviewer?.avatar" :alt="interviewer?.name">
          </div>
          <h3>{{ interviewer?.name }}</h3>
          <p>{{ interviewer?.description }}</p>
          <div class="tags">
            <span v-for="tag in interviewer?.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
        </div>
        <div v-for="(message, index) in messages" 
             :key="index" 
             :class="['message', message.role]">
          <div class="message-avatar">
            <img :src="message.role === 'assistant' ? interviewer?.avatar : userAvatar" 
                :alt="message.role === 'assistant' ? interviewer?.name : '我'">
          </div>
          <div class="message-content">
            <div class="message-info">
              <span class="sender">{{ message.role === 'assistant' ? interviewer?.name : '我' }}</span>
              <span class="time">{{ formatTime(message.timestamp) }}</span>
            </div>
            <div class="message-text" v-html="message.content"></div>
          </div>
        </div>
        <div v-if="isLoading" class="message assistant loading">
          <div class="message-avatar">
            <img :src="interviewer?.avatar" :alt="interviewer?.name">
          </div>
          <div class="message-content">
            <div class="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>
    </main>

    <footer class="chat-footer">
      <div class="input-container">
        <div class="input-wrapper">
          <textarea 
            v-model="currentMessage"
            @keyup.enter.exact="sendMessage"
            @keydown.enter.exact.prevent
            placeholder="输入消息..."
            :disabled="isLoading"
            @input="autoGrow"
            rows="1"
          ></textarea>
          <div class="input-actions">
            <button class="action-icon" title="结束面试" @click="endInterview">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
            <button class="action-icon" title="上传图片">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                <path fill="currentColor" d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4.86 8.86l-3 3.87L9 13.14 6 17h12l-3.86-5.14z"/>
              </svg>
            </button>
            <button class="action-icon" title="插入代码片段">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                <path fill="currentColor" d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
              </svg>
            </button>
          </div>
        </div>
        <button 
          class="send-btn"
          @click="sendMessage"
          :disabled="isLoading || !currentMessage.trim()"
        >
          发送
        </button>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { INTERVIEWERS } from '../config/interviewers'

const router = useRouter()
const route = useRoute()
const messages = ref([])
const currentMessage = ref('')
const isLoading = ref(false)
const interviewer = ref(null)
const messagesContainer = ref(null)
const startTime = ref(null)
const showGuidance = ref(false)
const fileInput = ref(null)
const resumeFile = ref(null)
const isUploading = ref(false)
const isUploaded = ref(false)

const interviewSteps = [
  {
    title: '基础知识',
    description: '考察基本概念和原理的理解'
  },
  {
    title: '技术深度',
    description: '探讨核心技术的实现原理'
  },
  {
    title: '实战经验',
    description: '讨论实际项目中的问题解决'
  },
  {
    title: '综合能力',
    description: '评估系统设计和架构思维'
  }
]

const getStepStatus = (index) => {
  if (currentStep.value > index + 1) return 'completed'
  if (currentStep.value === index + 1) return 'active'
  return ''
}

const toggleGuidance = () => {
  showGuidance.value = !showGuidance.value
}

const handleBack = async () => {
  if (messages.value.length > 0) {
    const result = await showConfirmDialog(
      '结束面试',
      '确定要结束当前面试吗？您的面试记录将会保存。'
    )
    if (result) {
      await saveInterviewRecord()
      router.push('/interview')
    }
  } else {
    router.push('/interview')
  }
}

const showConfirmDialog = (title, message) => {
  return new Promise((resolve) => {
    const result = window.confirm(message)
    resolve(result)
  })
}

const saveInterviewRecord = async () => {
  try {
    const record = {
      id: conversationId.value,
      interviewer: interviewer.value,
      startTime: startTime.value,
      endTime: Date.now(),
      messages: messages.value,
    }
    localStorage.setItem(`interview_record_${record.id}`, JSON.stringify(record))
  } catch (err) {
    console.error('Save interview record error:', err)
  }
}

const switchToNotes = () => {
  console.log('Switch to notes mode')
}

// Coze API 配置
const COZE_API = {
  BASE_URL: 'https://api.coze.cn/open_api/v2/chat',
  BOT_ID: '7456723652143398963',
  USER_ID: '3329463097',
  HEADERS: {
    'Authorization': 'Bearer pat_NEwlEOoIK70kvHq0lKQ2fwgH1bh2tgldcYvUu44hwuev0htrCKBIWb8NEdTD3RDX',
    'Content-Type': 'application/json',
    'Accept': '*/*',
    'Host': 'api.coze.cn',
    'Connection': 'keep-alive'
  }
}

// 生成会话ID
const conversationId = ref(`interview_${Date.now()}`)

// 处理流式响应
const handleStreamResponse = async (response, updateCallback) => {
  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      
      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''
      
      for (const line of lines) {
        if (line.trim() === '') continue
        if (!line.startsWith('data:')) continue
        
        const data = JSON.parse(line.slice(5))
        if (data.event === 'message' && !data.is_finish) {
          updateCallback(data.message.content)
        }
      }
    }
  } catch (err) {
    console.error('Stream processing error:', err)
    throw err
  }
}

// 初始化面试
const initializeInterview = async () => {
  try {
    isLoading.value = true
    startTime.value = Date.now()
    
    let currentResponse = ''
    messages.value = [{
      role: 'assistant',
      content: '',
      timestamp: Date.now()
    }]

    const response = await fetch(COZE_API.BASE_URL, {
      method: 'POST',
      headers: COZE_API.HEADERS,
      body: JSON.stringify({
        conversation_id: conversationId.value,
        bot_id: COZE_API.BOT_ID,
        user: COZE_API.USER_ID,
        query: "你好面试官",
        stream: true,
        custom_variables: {
          bot_name: "java面试官"
        }
      })
    })

    if (!response.ok) {
      throw new Error('面试初始化失败')
    }

    await handleStreamResponse(response, (content) => {
      currentResponse += content
      messages.value[0].content = currentResponse
    })

  } catch (err) {
    console.error('Interview initialization error:', err)
    messages.value = [{
      role: 'assistant',
      content: '初始化失败，请刷新页面重试',
      timestamp: Date.now()
    }]
  } finally {
    isLoading.value = false
  }
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
    
    let currentResponse = ''
    messages.value.push({
      role: 'assistant',
      content: '',
      timestamp: Date.now()
    })

    const response = await fetch(COZE_API.BASE_URL, {
      method: 'POST',
      headers: COZE_API.HEADERS,
      body: JSON.stringify({
        conversation_id: conversationId.value,
        bot_id: COZE_API.BOT_ID,
        user: COZE_API.USER_ID,
        query: messageContent,
        stream: true,
        custom_variables: {
          bot_name: "java面试官"
        }
      })
    })
    
    if (!response.ok) {
      throw new Error('发送消息失败')
    }
    
    await handleStreamResponse(response, (content) => {
      currentResponse += content
      messages.value[messages.value.length - 1].content = currentResponse
    })
    
    await nextTick()
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  } catch (err) {
    console.error('Send message error:', err)
    messages.value.push({
      role: 'assistant',
      content: '消息发送失败，请重试',
      timestamp: Date.now()
    })
  } finally {
    isLoading.value = false
  }
}

// 添加错误处理函数
const handleApiError = (error) => {
  console.error('API Error:', error)
  return {
    role: 'assistant',
    content: '系统出现错误，请稍后重试',
    timestamp: Date.now()
  }
}

// 格式化时间
const formatTime = (timestamp) => {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  return date.toLocaleTimeString('zh-CN', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

// 格式化持续时间
const formatDuration = computed(() => {
  if (!startTime.value) return '00:00'
  const diff = Math.floor((Date.now() - startTime.value) / 1000)
  const minutes = Math.floor(diff / 60)
  const seconds = diff % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

// 切换全屏
const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}

// 组件加载时初始化面试官和面试
onMounted(async () => {
  const interviewerId = route.params.id
  const savedInterviewer = localStorage.getItem('currentInterviewer')
  
  if (savedInterviewer) {
    interviewer.value = JSON.parse(savedInterviewer)
  } else {
    interviewer.value = INTERVIEWERS.find(i => i.id === interviewerId)
    if (!interviewer.value) {
      router.push('/interview')
      return
    }
  }
  
  await initializeInterview()
})

// 添加计算当前面试轮次的逻辑
const currentStep = computed(() => {
  return Math.min(Math.ceil(messages.value.length / 4), 4)
})

// 生成随机用户头像
const userAvatar = computed(() => {
  const seed = localStorage.getItem('userAvatarSeed') || Math.random().toString(36).substring(7)
  if (!localStorage.getItem('userAvatarSeed')) {
    localStorage.setItem('userAvatarSeed', seed)
  }
  return `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9&backgroundType=gradientLinear&scale=85`
})

const triggerFileUpload = () => {
  fileInput.value.click()
}

const uploadButtonText = computed(() => {
  if (isUploading.value) return '上传中...'
  if (isUploaded.value) return '简历已上传'
  return '上传简历'
})

const handleFileUpload = async (event) => {
  const file = event.target.files[0]
  if (file && file.type === 'application/pdf') {
    try {
      isUploading.value = true
      resumeFile.value = file
      
      // 向面试官发送简历内容
      const response = await fetch(COZE_API.BASE_URL, {
        method: 'POST',
        headers: COZE_API.HEADERS,
        body: JSON.stringify({
          conversation_id: conversationId.value,
          bot_id: COZE_API.BOT_ID,
          user: COZE_API.USER_ID,
          query: `我上传了一份简历，文件名是：${file.name}，这是一份 PDF 格式的简历，请帮我分析一下我的简历内容，并针对简历内容进行面试。`,
          stream: true,
          custom_variables: {
            bot_name: "java面试官"
          }
        })
      })

      if (!response.ok) {
        throw new Error('简历上传失败')
      }

      // 添加用户的上传消息
      messages.value.push({
        role: 'user',
        content: `已上传简历：${file.name}`,
        timestamp: Date.now()
      })

      // 处理面试官的响应
      let currentResponse = ''
      messages.value.push({
        role: 'assistant',
        content: '',
        timestamp: Date.now()
      })

      await handleStreamResponse(response, (content) => {
        currentResponse += content
        messages.value[messages.value.length - 1].content = currentResponse
      })

      isUploaded.value = true
      
    } catch (error) {
      console.error('Resume upload error:', error)
      alert('简历上传失败，请重试')
    } finally {
      isUploading.value = false
    }
  } else {
    alert('请上传 PDF 格式的简历')
  }
}
</script>

<style scoped>
.interview-chat {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f0f2f5;
}

.chat-header {
  background: white;
  padding: 12px 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-main {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  padding: 16px 24px;
  gap: 32px;
  background: white;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-center {
  justify-self: center;
  max-width: 600px;
  width: 100%;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 24px;
}

.interviewer-profile {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 20px;
  background: linear-gradient(to right, #f8f9fa, #f5f7ff);
  border-radius: 16px;
  border: 1px solid rgba(79, 110, 247, 0.1);
  transition: all 0.3s ease;
}

.interviewer-profile:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(79, 110, 247, 0.08);
}

.interviewer-tags {
  display: flex;
  gap: 8px;
  margin-top: 6px;
}

.tag {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.3px;
}

.tag.experience {
  background: rgba(76, 175, 80, 0.1);
  color: #43a047;
  border: 1px solid rgba(76, 175, 80, 0.2);
}

.interview-stats {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 14px;
  color: #666;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #666;
  border-radius: 8px;
  transition: all 0.3s;
}

.back-btn:hover {
  background: rgba(79, 110, 247, 0.1);
  color: #4F6EF7;
}

.nav-breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
  margin-left: 16px;
}

.nav-breadcrumb span {
  cursor: pointer;
}

.nav-breadcrumb span:hover:not(.current) {
  color: #4F6EF7;
}

.nav-breadcrumb .separator {
  color: #999;
  cursor: default;
}

.nav-breadcrumb .current {
  color: #333;
  cursor: default;
}

.step-indicator {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  background: #f8f9fa;
  border-radius: 20px;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.step-text {
  font-size: 14px;
  font-weight: 500;
  color: #4F6EF7;
}

.step-dots {
  display: flex;
  gap: 4px;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #e0e0e0;
  transition: all 0.3s ease;
}

.dot.active {
  background: #4F6EF7;
  transform: scale(1.2);
}

.interview-duration {
  padding: 8px 16px;
  background: #f8f9fa;
  border-radius: 20px;
  font-family: 'Roboto Mono', monospace;
  font-size: 14px;
  color: #666;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.header-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 8px;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #666;
  border-radius: 8px;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn:hover {
  background: rgba(79, 110, 247, 0.1);
  color: #4F6EF7;
  transform: translateY(-1px);
}

.interviewer-info h2 {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.chat-main {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  scroll-behavior: smooth;
  background: linear-gradient(135deg, #f5f7ff 0%, #eef1f9 100%);
}

.messages {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 0 20px;
}

.message {
  display: flex;
  gap: 12px;
  max-width: 85%;
  opacity: 0;
  animation: fadeIn 0.3s ease forwards;
  position: relative;
  transform-origin: left center;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message.user {
  flex-direction: row-reverse;
  margin-left: auto;
  transform-origin: right center;
}

.message-avatar {
  position: relative;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  z-index: 1;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  border: 2px solid white;
}

.message-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.message-avatar img:hover {
  transform: scale(1.1);
}

.message-content {
  max-width: 70%;
  padding: 12px 16px;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.message.user .message-content {
  background: linear-gradient(135deg, #4F6EF7 0%, #3D5CE5 100%);
  color: white;
  border-radius: 12px 2px 12px 12px;
  box-shadow: 0 4px 15px rgba(79, 110, 247, 0.2);
  backdrop-filter: blur(10px);
}

.message.assistant .message-content {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 2px 12px 12px 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(10px);
}

.message.assistant .message-content::after,
.message.user .message-content::after {
  content: '';
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  border-radius: inherit;
  opacity: 0.1;
  background: linear-gradient(to bottom right, rgba(255,255,255,0.4), rgba(255,255,255,0));
  pointer-events: none;
}

.message-info {
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.sender {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.message.user .sender {
  color: white;
}

.time {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.4);
  margin-left: 8px;
}

.message.user .time {
  color: rgba(255, 255, 255, 0.8);
}

.message-text {
  font-size: 15px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
  letter-spacing: 0.3px;
  position: relative;
  z-index: 1;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}

.typing-indicator {
  display: flex;
  gap: 6px;
  padding: 8px 16px;
  justify-content: center;
  min-width: 60px;
  opacity: 0.8;
  background: rgba(79, 110, 247, 0.1);
  border-radius: 12px;
}

.typing-indicator span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #4F6EF7;
  opacity: 0.6;
  animation: typing 1.4s infinite ease-in-out;
  box-shadow: 0 2px 4px rgba(79, 110, 247, 0.2);
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 100% { 
    transform: translateY(0); 
    opacity: 0.6;
  }
  50% { 
    transform: translateY(-6px); 
    opacity: 1;
    box-shadow: 0 4px 8px rgba(79, 110, 247, 0.3);
  }
}

.chat-footer {
  background: rgba(255, 255, 255, 0.9);
  padding: 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  position: sticky;
  bottom: 0;
  box-shadow: 0 -2px 20px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(10px);
}

.input-container {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  gap: 12px;
  align-items: flex-end;
}

.input-wrapper {
  flex: 1;
  position: relative;
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  transition: all 0.3s;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.input-wrapper:focus-within {
  border-color: #4F6EF7;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(79, 110, 247, 0.15);
}

.input-actions {
  position: absolute;
  bottom: 8px;
  right: 8px;
  display: flex;
  gap: 8px;
}

.action-icon {
  padding: 4px;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #999;
  border-radius: 4px;
  transition: all 0.2s;
}

.action-icon:hover {
  background: #f0f2f5;
  color: #4F6EF7;
}

textarea {
  border: none;
  padding: 14px 18px;
  padding-right: 100px;
  width: 100%;
  min-height: 24px;
  line-height: 1.5;
  font-size: 15px;
  color: #333;
  resize: none;
  background: transparent;
}

textarea:focus {
  outline: none;
}

textarea::placeholder {
  color: #999;
  font-size: 14px;
}

.send-btn {
  padding: 10px 28px;
  background: linear-gradient(135deg, #4F6EF7, #3D5CE5);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  height: 44px;
  font-weight: 500;
  letter-spacing: 0.5px;
  transition: all 0.3s;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
}

.send-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #3D5CE5, #2D4CD5);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(79, 110, 247, 0.25);
}

.send-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.avatar-wrapper {
  position: relative;
  width: 40px;
  height: 40px;
  margin-right: 12px;
}

.interviewer-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.online-dot {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #4CAF50;
  border: 2px solid white;
}

.interviewer-info {
  display: flex;
  flex-direction: column;
}

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
}

.modal-content {
  background: white;
  border-radius: 12px;
  padding: 24px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
}

.guidance-steps {
  margin: 20px 0;
}

.step {
  display: flex;
  gap: 16px;
  padding: 16px;
  border-left: 2px solid #eee;
  margin-left: 20px;
}

.step.completed {
  border-left-color: #4CAF50;
}

.step.active {
  border-left-color: #4F6EF7;
}

.step-number {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #eee;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: -13px;
}

.step.completed .step-number {
  background: #4CAF50;
  color: white;
}

.step.active .step-number {
  background: #4F6EF7;
  color: white;
}

.close-btn {
  width: 100%;
  padding: 12px;
  background: #f0f2f5;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 16px;
}

.close-btn:hover {
  background: #e4e6e9;
}

.hidden-input {
  display: none;
}

.resume-upload {
  margin-right: 16px;
}

.upload-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #f8f9fa;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  color: #666;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}

.upload-btn:hover {
  background: rgba(79, 110, 247, 0.1);
  color: #4F6EF7;
  border-color: #4F6EF7;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(79, 110, 247, 0.1);
}

.upload-btn.uploaded {
  background: #4CAF50;
  color: white;
  border-color: #4CAF50;
}

.upload-btn.uploaded:hover {
  background: #43A047;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.2);
}

.upload-btn.uploading {
  pointer-events: none;
  opacity: 0.8;
}

.upload-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background: rgba(255, 255, 255, 0.5);
  animation: progress 1s infinite linear;
}

@keyframes progress {
  0% {
    width: 0;
    opacity: 0.1;
  }
  50% {
    width: 100%;
    opacity: 0.3;
  }
  100% {
    width: 0;
    opacity: 0.1;
  }
}

.upload-btn svg {
  flex-shrink: 0;
}

.upload-btn span {
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style> 