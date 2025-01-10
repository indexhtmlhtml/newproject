<template>
  <div class="interview-container">
    <!-- 错误提示 -->
    <div v-if="error" class="error-message">
      <div class="error-content">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
        </svg>
        <p>{{ error }}</p>
        <button @click="retryInitialize">重试</button>
      </div>
    </div>

    <!-- 服务器错误提示 -->
    <div v-if="serverError" class="server-error-message">
      <div class="error-content">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path fill="currentColor" d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
        </svg>
        <div>
          <p class="error-title">服务器连接错误</p>
          <p class="error-desc">{{ serverError }}</p>
        </div>
        <button @click="serverError = null">关闭</button>
      </div>
    </div>

    <header class="header">
      <div class="header-content">
        <button class="back-btn" @click="router.back()">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
          {{ t('common.back') }}
        </button>
        <h1>{{ t('interview.title') }}</h1>
      </div>
    </header>

    <main class="main-content">
      <!-- 面试模式选择 -->
      <section v-if="!interviewMode" class="mode-selection">
        <h2>选择面试模式</h2>
        <div class="mode-grid">
          <div class="mode-card" @click="selectMode('ai')">
            <div class="mode-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5c0-2.21-1.79-4-4-4z"/>
              </svg>
            </div>
            <h3>AI 模拟面试</h3>
            <p>由 AI 面试官进行专业的技术面试</p>
          </div>
          <div class="mode-card" @click="selectMode('human')">
            <div class="mode-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24">
                <path fill="currentColor" d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
              </svg>
            </div>
            <h3>真人面试</h3>
            <p>与真实面试官进行在线面试</p>
          </div>
        </div>
      </section>

      <!-- AI 面试官选择 -->
      <section class="interviewers-section" v-if="interviewMode === 'ai' && !currentInterviewer">
        <h2>{{ t('interview.selectInterviewer') }}</h2>
        <div class="interviewers-grid">
          <div 
            v-for="interviewer in INTERVIEWERS" 
            :key="interviewer.id"
            class="interviewer-card"
            @click="selectInterviewer(interviewer)"
          >
            <img :src="interviewer.avatar" :alt="interviewer.name" class="interviewer-avatar">
            <div class="interviewer-info">
              <h3>{{ interviewer.name }}</h3>
              <p class="title">{{ interviewer.title }}</p>
              <p class="company">{{ interviewer.company }}</p>
              <p class="description">{{ interviewer.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 真人面试准备 -->
      <section v-if="interviewMode === 'human'" class="human-interview">
        <h2>真人面试</h2>
        <p>此功能正在开发中...</p>
      </section>

      <!-- 面试进行中 -->
      <section v-if="interviewMode === 'ai' && currentInterviewer" class="interview-section">
        <div class="interview-header">
          <div class="interviewer-profile">
            <img :src="currentInterviewer.avatar" :alt="currentInterviewer.name">
            <div class="profile-info">
              <h3>{{ currentInterviewer.name }}</h3>
              <p>{{ currentInterviewer.title }} @ {{ currentInterviewer.company }}</p>
            </div>
          </div>
          <button class="end-btn" @click="endInterview">
            {{ t('interview.end') }}
          </button>
        </div>

        <div class="chat-container" ref="chatContainer">
          <div 
            v-for="(message, index) in messages" 
            :key="index"
            :class="['message', message.role]"
          >
            <div class="message-content" v-html="formatMessage(message.content)"></div>
          </div>
          <div v-if="isTyping" class="message interviewer">
            <div class="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>

        <div class="input-container">
          <textarea 
            v-model="userInput"
            :placeholder="t('interview.inputPlaceholder')"
            @keydown.enter.prevent="sendMessage"
            :disabled="isTyping"
          ></textarea>
          <button 
            class="send-btn" 
            @click="sendMessage"
            :disabled="isTyping || !userInput.trim()"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </button>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { INTERVIEWERS } from '../config/interviewers'
import { startInterview, sendInterviewMessage } from '../services/interview'

const router = useRouter()
const { t } = useI18n()

const messages = ref([])
const userInput = ref('')
const isTyping = ref(false)
const currentInterviewer = ref(null)
const chatContainer = ref(null)
const error = ref(null)
const serverError = ref(null)
const initializeAttempts = ref(0)
const MAX_INIT_ATTEMPTS = 3
const interviewMode = ref(null) // 'ai' or 'human'

// 初始化 SDK
const initializeSDK = () => {
  try {
    console.log('Attempting to initialize Coze SDK...')
    
    if (typeof window.CozeWebSDK === 'undefined') {
      console.error('CozeWebSDK is not defined')
      throw new Error('面试系统未能正确加载，请刷新页面重试')
    }

    if (typeof window.initCozeChat !== 'function') {
      console.error('initCozeChat function is not defined')
      throw new Error('初始化函数未找到')
    }

    window.initCozeChat()
    console.log('Coze SDK initialized successfully')
    error.value = null
    return true
  } catch (e) {
    console.error('Failed to initialize Coze SDK:', e)
    error.value = e.message
    return false
  }
}

// 重试初始化
const retryInitialize = async () => {
  if (initializeAttempts.value >= MAX_INIT_ATTEMPTS) {
    error.value = '初始化失败次数过多，请刷新页面重试'
    return
  }

  initializeAttempts.value++
  console.log(`Retrying initialization (attempt ${initializeAttempts.value}/${MAX_INIT_ATTEMPTS})`)
  
  await new Promise(resolve => setTimeout(resolve, 1000))
  initializeSDK()
}

onMounted(() => {
  console.log('Component mounted, checking SDK...')
  if (!initializeSDK()) {
    console.log('Initial SDK initialization failed, will retry in 1 second...')
    setTimeout(retryInitialize, 1000)
  }
})

const selectInterviewer = async (interviewer) => {
  if (error.value) {
    alert('面试系统未准备就绪，请先解决错误')
    return
  }

  try {
    currentInterviewer.value = interviewer
    isTyping.value = true
    serverError.value = null
    
    messages.value.push({
      role: 'system',
      content: '正在连接面试官...'
    })
    
    const response = await startInterview(interviewer.id)
    messages.value = messages.value.filter(m => m.role !== 'system')
    
    if (!response || !response.message) {
      throw new Error('未收到面试官响应')
    }
    
    messages.value.push({
      role: 'assistant',
      content: response.message
    })
  } catch (error) {
    console.error('Failed to start interview:', error)
    serverError.value = error.message
    messages.value = messages.value.filter(m => m.role !== 'system')
    messages.value.push({
      role: 'system',
      content: `启动面试失败: ${error.message}。请检查：
      1. 网络连接是否正常
      2. 面试服务器是否运行
      3. 如果问题持续，请刷新页面重试`
    })
    currentInterviewer.value = null
  } finally {
    isTyping.value = false
  }
}

const sendMessage = async () => {
  if (!userInput.value.trim() || isTyping.value) return

  const message = userInput.value
  userInput.value = ''
  
  try {
    messages.value.push({
      role: 'user',
      content: message
    })
    
    isTyping.value = true
    const response = await sendInterviewMessage({ message })
    
    messages.value.push({
      role: 'assistant',
      content: response.message
    })
  } catch (error) {
    console.error('Failed to send message:', error)
    alert(t('interview.error'))
  } finally {
    isTyping.value = false
  }
}

const endInterview = () => {
  if (confirm(t('interview.confirmEnd'))) {
    currentInterviewer.value = null
    messages.value = []
  }
}

const formatMessage = (content) => {
  return content
    .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
}

const scrollToBottom = () => {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

watch(messages, () => {
  nextTick(scrollToBottom)
})

const selectMode = (mode) => {
  interviewMode.value = mode
  if (mode === 'ai') {
    // 加载 Coze SDK
    loadCozeSDK()
  }
}

const loadCozeSDK = () => {
  if (document.querySelector('#coze-sdk')) {
    return
  }

  const script = document.createElement('script')
  script.id = 'coze-sdk'
  script.src = 'https://lf-cdn.coze.cn/obj/unpkg/flow-platform/chat-app-sdk/1.1.0-beta.0/libs/cn/index.js'
  script.onload = () => {
    new CozeWebSDK.WebChatClient({
      config: {
        bot_id: '7456723652143398963',
      },
      componentProps: {
        title: 'AI面试官',
      },
      onError: (error) => {
        console.error('Coze chat error:', error)
        serverError.value = '面试系统出现错误，请刷新页面重试'
      },
      onReady: () => {
        console.log('Coze chat ready')
      }
    })
  }
  script.onerror = () => {
    serverError.value = '面试系统加载失败，请检查网络连接'
  }
  document.body.appendChild(script)
}
</script>

<style scoped>
.interview-container {
  min-height: 100vh;
  background: #f5f7ff;
}

.header {
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 84px 16px 16px;
}

.interviewers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  margin-top: 24px;
}

.interviewer-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #eee;
}

.interviewer-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(79, 110, 247, 0.15);
  border-color: #4F6EF7;
}

.interviewer-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-bottom: 16px;
}

.interviewer-info h3 {
  margin: 0 0 8px;
  color: #333;
}

.interviewer-info .title {
  color: #4F6EF7;
  margin: 0 0 4px;
}

.interviewer-info .company {
  color: #666;
  margin: 0 0 8px;
}

.interviewer-info .description {
  color: #666;
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
}

.interview-section {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  height: calc(100vh - 100px);
  display: flex;
  flex-direction: column;
}

.interview-header {
  padding: 16px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.interviewer-profile {
  display: flex;
  align-items: center;
  gap: 12px;
}

.interviewer-profile img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
}

.chat-container {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.message {
  margin-bottom: 16px;
  max-width: 80%;
}

.message.interviewer {
  margin-right: auto;
}

.message.candidate {
  margin-left: auto;
}

.message-content {
  padding: 12px 16px;
  border-radius: 12px;
  background: #f5f7ff;
  line-height: 1.5;
}

.message.candidate .message-content {
  background: #4F6EF7;
  color: white;
}

.input-container {
  padding: 16px;
  border-top: 1px solid #eee;
  display: flex;
  gap: 12px;
}

textarea {
  flex: 1;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  resize: none;
  height: 48px;
  line-height: 24px;
}

.send-btn {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background: #4F6EF7;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.send-btn:hover:not(:disabled) {
  background: #3D5CE5;
}

.send-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.typing-indicator {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 12px 16px;
  background: #f5f7ff;
  border-radius: 12px;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  background: #4F6EF7;
  border-radius: 50%;
  display: inline-block;
  animation: bounce 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
.typing-indicator span:nth-child(2) { animation-delay: -0.16s; }

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

.sdk-loading {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.9);
  z-index: 1000;
}

.sdk-loading p {
  margin-top: 16px;
  color: #666;
  font-size: 16px;
}

.sdk-loading p.error {
  color: #dc3545;
}

.retry-btn {
  margin-top: 16px;
  padding: 8px 24px;
  background: #4F6EF7;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-btn:hover {
  background: #3D5CE5;
}

.error-message {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: #fff;
  padding: 16px 24px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  border-left: 4px solid #dc3545;
}

.error-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.error-content svg {
  color: #dc3545;
  flex-shrink: 0;
}

.error-content p {
  margin: 0;
  color: #333;
}

.error-content button {
  padding: 4px 12px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.error-content button:hover {
  background: #c82333;
}

.server-error-message {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: #fff;
  padding: 16px 24px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  border-left: 4px solid #ffc107;
}

.error-title {
  font-weight: bold;
  margin: 0 0 4px;
  color: #333;
}

.error-desc {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.mode-selection {
  padding: 40px 0;
}

.mode-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-top: 24px;
}

.mode-card {
  background: white;
  border-radius: 12px;
  padding: 32px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #eee;
}

.mode-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(79, 110, 247, 0.15);
  border-color: #4F6EF7;
}

.mode-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
  background: #f5f7ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4F6EF7;
}

.mode-card h3 {
  margin: 0 0 12px;
  color: #333;
}

.mode-card p {
  margin: 0;
  color: #666;
}

.human-interview {
  text-align: center;
  padding: 40px;
  background: white;
  border-radius: 12px;
  margin-top: 24px;
}
</style> 