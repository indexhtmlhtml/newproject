<template>
  <div class="interview-container">
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
      <!-- 面试官选择 -->
      <section class="interviewers-section" v-if="!currentInterviewer">
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

      <!-- 面试进行中 -->
      <section v-else class="interview-section">
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
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { INTERVIEWERS } from '../config/interviewers'
import { startInterview, sendInterviewMessage } from '../services/interview'

const router = useRouter()
const { t } = useI18n()

const currentInterviewer = ref(null)
const messages = ref([])
const userInput = ref('')
const isTyping = ref(false)
const chatContainer = ref(null)

const selectInterviewer = async (interviewer) => {
  currentInterviewer.value = interviewer
  isTyping.value = true
  
  try {
    const response = await startInterview(interviewer.id)
    messages.value.push({
      role: 'interviewer',
      content: response.message
    })
  } catch (error) {
    console.error('Failed to start interview:', error)
    ElMessage.error(t('interview.error'))
    currentInterviewer.value = null
  } finally {
    isTyping.value = false
  }
}

const sendMessage = async () => {
  if (!userInput.value.trim() || isTyping.value) return

  const message = userInput.value.trim()
  userInput.value = ''
  
  messages.value.push({
    role: 'candidate',
    content: message
  })
  
  await nextTick()
  scrollToBottom()
  
  isTyping.value = true
  
  try {
    const response = await sendInterviewMessage({
      interviewerId: currentInterviewer.value.id,
      message
    })
    
    messages.value.push({
      role: 'interviewer',
      content: response.message
    })
  } catch (error) {
    console.error('Failed to send message:', error)
    ElMessage.error(t('interview.error'))
    messages.value.push({
      role: 'system',
      content: t('interview.error')
    })
  } finally {
    isTyping.value = false
    await nextTick()
    scrollToBottom()
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
</style> 