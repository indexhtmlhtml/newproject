<template>
  <div class="chat-box">
    <div class="chat-messages" ref="messagesContainer">
      <div v-for="(message, index) in messages" 
           :key="index" 
           :class="['message', message.role]">
        <div class="message-content" v-html="formatMessage(message.content)"></div>
      </div>
      <div v-if="isLoading" class="message assistant loading">
        <div class="typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
    
    <div class="chat-input">
      <input 
        type="text" 
        v-model="userInput"
        @keyup.enter="sendMessage"
        :placeholder="t('ai.placeholder')"
        :disabled="isLoading"
      >
      <button 
        @click="sendMessage" 
        :disabled="isLoading || !userInput.trim()"
        class="send-btn"
      >
        <span v-if="!isLoading">{{ t('ai.send') }}</span>
        <span v-else class="loading-spinner"></span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
import { messages as i18nMessages } from '../locales'
import { useLanguageStore } from '../stores/language'
import { useI18n } from 'vue-i18n'

const languageStore = useLanguageStore()
const { t } = useI18n()
const API_URL = 'https://api.deepseek.com/v1/chat/completions'
const API_KEY = 'sk-1bb183d7bd70432e9f0deafbbfe89bb9'
const messages = ref([
  {
    role: 'assistant',
    content: t('ai.greeting')
  }
])
const userInput = ref('')
const isLoading = ref(false)
const messagesContainer = ref(null)

const formatMessage = (content) => {
  return content
    .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    setTimeout(() => {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }, 100)
  }
}

const sendMessage = async () => {
  if (!userInput.value.trim() || isLoading.value) return

  const userMessage = {
    role: 'user',
    content: userInput.value.trim()
  }

  try {
    messages.value.push(userMessage)
    userInput.value = ''
    isLoading.value = true

    console.log('Sending message:', {
      userMessage,
      currentLanguage: languageStore.currentLanguage
    })

    const response = await axios.post(API_URL, {
      messages: [
        {
          role: 'system',
          content: `你是一个专业的编程助手，请用${languageStore.currentLanguage === 'zh' ? '中文' : 
                                                languageStore.currentLanguage === 'ja' ? '日语' : 
                                                '英文'}回答问题。`
        },
        ...messages.value
      ],
      model: 'deepseek-coder',
      temperature: 0.7,
      max_tokens: 2048
    }, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    })

    console.log('API Response:', response.data)

    const assistantMessage = {
      role: 'assistant',
      content: response.data.choices?.[0]?.message?.content || '抱歉，我现在无法回答。请稍后再试。'
    }

    messages.value.push(assistantMessage)
  } catch (error) {
    console.error('Chat error:', error)
    messages.value.push({
      role: 'assistant',
      content: `错误：${error.response?.data?.error || error.message || '发生未知错误'}`
    })
  } finally {
    isLoading.value = false
    scrollToBottom()
  }
}

// 监听语言变化，更新欢迎消息
watch(() => languageStore.currentLanguage, () => {
  messages.value = [{
    role: 'assistant',
    content: t('ai.greeting')
  }]
})

onMounted(() => {
  messages.value = [{
    role: 'assistant',
    content: t('ai.greeting')
  }]
})
</script>

<style scoped>
.chat-box {
  background: white;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message {
  max-width: 80%;
  padding: 12px 16px;
  border-radius: 12px;
  line-height: 1.5;
  margin-bottom: 16px;
  animation: slideIn 0.3s ease;
}

.message.user {
  align-self: flex-end;
  background: #4F6EF7;
  color: white;
}

.message.assistant {
  align-self: flex-start;
  background: #f5f7ff;
  color: #333;
}

.message.system {
  align-self: center;
  background: #fff3cd;
  color: #856404;
  font-size: 0.9em;
}

.chat-input {
  display: flex;
  gap: 8px;
  padding: 16px;
  background: #f5f7ff;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
}

.chat-input input {
  flex: 1;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
}

.send-btn {
  padding: 0 24px;
  background: #4F6EF7;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.send-btn:hover:not(:disabled) {
  background: #3D5CE5;
}

.send-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
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

.message pre {
  background: #f8f9fa;
  padding: 12px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 8px 0;
}

.message code {
  font-family: monospace;
}

.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 12px 16px;
  background: #f0f2ff;
  border-radius: 16px;
  width: fit-content;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  background: #4F6EF7;
  border-radius: 50%;
  display: inline-block;
  opacity: 0.4;
  animation: typing 1.4s infinite;
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
    opacity: 0.4;
  }
  50% {
    transform: translateY(-4px);
    opacity: 0.8;
  }
}

.message.loading {
  opacity: 0.8;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 0.8;
    transform: translateY(0);
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style> 