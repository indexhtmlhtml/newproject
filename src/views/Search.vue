<template>
  <div class="search-container" v-show="isPageReady">
    <header class="header">
      <div class="header-content">
        <div class="left-section">
          <button class="nav-btn" @click="router.push('/home')">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
            <span class="btn-text">返回主页</span>
            <span class="btn-hover">← Back</span>
          </button>
        </div>
        <div class="center-section">
          <h1>
            <span class="title-highlight">AI</span> 全网搜索
            <span class="title-decoration"></span>
          </h1>
          <p class="subtitle">
            <span class="ai-badge">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                <path fill="currentColor" d="M21.67 18.17l-5.3-5.3h-.99l-2.54 2.54v.99l5.3 5.3c.39.39 1.02.39 1.41 0l2.12-2.12c.39-.38.39-1.02 0-1.41zm-2.83 1.42l-4.24-4.24.71-.71 4.24 4.24-.71.71z"/>
                <path fill="currentColor" d="M17.34 10.19l1.41-1.41 2.12 2.12c1.17-1.17 1.17-3.07 0-4.24l-3.54-3.54-1.41 1.41V1.71l-.7-.71-3.54 3.54.71.71h2.83l-1.41 1.41 1.06 1.06-2.89 2.89-4.13-4.13V5.06L4.83 2.04 2 4.87 5.03 7.9h1.41l4.13 4.13-.85.85H7.6l-5.3 5.3c-.39.39-.39 1.02 0 1.41l2.12 2.12c.39.39 1.02.39 1.41 0l5.3-5.3v-2.12l5.15-5.15 1.06 1.05zm-7.98 5.15l-4.24 4.24-.71-.71 4.24-4.24.71.71z"/>
              </svg>
              AI 驱动
            </span>
            <span class="divider">·</span>
            <span class="feature-badge">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                <path fill="currentColor" d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
                <path fill="currentColor" d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
              </svg>
              实时搜索
            </span>
            <span class="divider">·</span>
            <span class="feature-badge">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                <path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/>
                <path fill="currentColor" d="M7 12h2v5H7zm4-7h2v12h-2zm4 4h2v8h-2z"/>
              </svg>
              智能分析
            </span>
          </p>
        </div>
        <div class="right-section">
          <button class="nav-btn" @click="toggleFullscreen">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
              <path fill="currentColor" d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
            </svg>
            <span class="btn-text">全屏</span>
            <span class="btn-hover">全屏模式</span>
          </button>
        </div>
      </div>
    </header>

    <main class="main-content">
      <div class="search-box">
        <div class="search-input-wrapper">
          <div class="search-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
              <path fill="currentColor" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
          </div>
          <input 
            type="text" 
            v-model="searchQuery"
            placeholder="您想要什么题目，直接告诉我吧..."
            class="search-input"
            @keyup.enter="handleSearch"
            @input="handleInput"
            ref="searchInput"
          >
          <div v-if="searchQuery" class="clear-btn" @click="clearSearch">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
              <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </div>
          <button 
            class="search-btn" 
            @click="handleSearch" 
            :disabled="isSearching || !searchQuery.trim()"
          >
            <div v-if="!isSearching" class="search-btn-text">搜索</div>
            <div v-else class="spinner"></div>
          </button>
        </div>

        <div class="search-filters">
          <div class="filter-group">
            <label>搜索范围</label>
            <div class="filter-options">
              <button 
                v-for="scope in searchScopes" 
                :key="scope.value"
                :class="['filter-btn', { active: currentScope === scope.value }]"
                @click="currentScope = scope.value"
              >
                {{ scope.label }}
              </button>
            </div>
          </div>
          
          <div class="filter-group">
            <label>来源限制</label>
            <div class="filter-options">
              <button 
                v-for="limit in searchLimits" 
                :key="limit.value"
                :class="['filter-btn', { active: currentLimit === limit.value }]"
                @click="currentLimit = limit.value"
              >
                {{ limit.label }}
              </button>
            </div>
          </div>
          
          <div class="filter-group">
            <label>时间范围</label>
            <div class="filter-options">
              <button 
                v-for="time in timeRanges" 
                :key="time.value"
                :class="['filter-btn', { active: currentTimeRange === time.value }]"
                @click="currentTimeRange = time.value"
              >
                {{ time.label }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 搜索结果区域 -->
      <div class="search-results">
        <div class="results-container">
          <!-- 左侧搜索结果 -->
          <div class="search-content">
            <div class="search-header">
              <h2>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M19.5 3h-15A1.5 1.5 0 003 4.5v15A1.5 1.5 0 004.5 21h15a1.5 1.5 0 001.5-1.5v-15A1.5 1.5 0 0019.5 3zm-15 16.5v-15h15v15h-15z"/>
                  <path fill="currentColor" d="M6 7h12v2H6zm0 4h12v2H6zm0 4h8v2H6z"/>
                </svg>
                搜索结果
              </h2>
              <span class="search-info" v-if="!isSearching && streamedContent.length > 0">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
                为您找到相关结果
              </span>
              <span class="search-info" v-else-if="!isSearching">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M11 17h2v-6h-2v6zm1-15C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM11 9h2V7h-2v2z"/>
                </svg>
                请输入关键词开始搜索
              </span>
            </div>

            <!-- 加载状态 -->
            <div v-if="isSearching" class="loading-state">
              <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <p>正在搜索中...</p>
            </div>

            <!-- 搜索结果内容 -->
            <div v-else-if="streamedContent.length > 0" class="results-list" ref="responseContainer">
              <div class="response-content">
                <template v-for="(line, index) in streamedContent" :key="index">
                  <div :class="getLineClass(line)" class="content-line" v-html="formatLine(line)">
                  </div>
                </template>
              </div>
            </div>
            <!-- 空状态 -->
            <div v-else class="empty-state">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24">
                <path fill="#ccc" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
              <p>暂无搜索结果</p>
            </div>
          </div>
          
          <!-- 右侧相关搜索 -->
          <div class="related-content">
            <div class="related-section">
              <h3>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z"/>
                </svg>
                相关问题
              </h3>
              <div class="related-items">
                <div v-for="(item, index) in aiSuggestedQuestions" 
                     :key="index" 
                     class="related-item"
                     @click="searchQuery = item; handleSearch()">
                  {{ item }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
  <div v-if="!isPageReady" class="page-loading">
    <div class="loading-spinner"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const searchQuery = ref('')
const isSearching = ref(false)
const showResults = ref(false)
const streamedContent = ref([])
const aiSuggestedQuestions = ref([])
const searchInput = ref(null)
const responseContainer = ref(null)
const showSuggestions = ref(false)
const suggestions = ref([])
const searchHistory = ref([])
let searchTimeout = null
let currentResponse = ''

const currentScope = ref('all')
const currentTimeRange = ref('all')
const currentLimit = ref('all')

const isPageReady = ref(false)

// Coze API 配置
const COZE_API_URL = 'https://api.coze.cn/open_api/v2/chat'
const COZE_BOT_ID = '7463013505835679807'

// 搜索范围选项
const searchScopes = [
  { label: '全部', value: 'all' },
  { label: '文章', value: 'articles' },
  { label: '问答', value: 'qa' },
  { label: '代码', value: 'code' },
  { label: '视频', value: 'videos' }
]

// 时间范围选项
const timeRanges = [
  { label: '不限', value: 'all' },
  { label: '一天内', value: '1d' },
  { label: '一周内', value: '1w' },
  { label: '一月内', value: '1m' },
  { label: '一年内', value: '1y' }
]

// 搜索限制选项
const searchLimits = [
  { label: '全部来源', value: 'all' },
  { label: '官方文档', value: 'docs' },
  { label: '技术社区', value: 'community' },
  { label: '博客', value: 'blogs' },
  { label: '开源项目', value: 'github' }
]

// 切换全屏
const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}

// 处理输入
const handleInput = () => {
  // 清空搜索建议
  showSuggestions.value = false
}

// 清空搜索
const clearSearch = () => {
  searchQuery.value = ''
  searchInput.value?.focus()
}

onMounted(() => {
  // 延迟显示页面内容，等待之前的页面完全消失
  setTimeout(() => {
    isPageReady.value = true
    searchInput.value?.focus()
  }, 100)
  
  // 加载搜索历史
  try {
    const savedHistory = localStorage.getItem('searchHistory')
    if (savedHistory) {
      searchHistory.value = JSON.parse(savedHistory)
    }
  } catch (error) {
    console.error('加载搜索历史失败:', error)
  }
})

onUnmounted(() => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
})

// 获取行的类名
const getLineClass = (line) => {
  if (line.match(/^\d+\./)) return 'result-item'
  if (line.includes('来源：')) return 'source-line'
  if (line.includes('时间：')) return 'time-line'
  return ''
}

// 格式化行内容
const formatLine = (line) => {
  // 处理链接
  let formattedLine = line.replace(/^\s+/, '')
  
  // 将URL转换为可点击的链接，同时移除括号
  formattedLine = formattedLine.replace(
    /\(?(https?:\/\/[^\s)]+)\)?/g, 
    '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
  )
  
  // 移除可能包含的 JSON 字符串
  formattedLine = formattedLine.replace(/{[^}]+}/g, '')
  
  // 移除多余的空格和换行
  formattedLine = formattedLine.trim()
  
  return formattedLine
}

const handleSearch = async () => {
  if (!searchQuery.value.trim() || isSearching.value) return
  
  isSearching.value = true
  streamedContent.value = []
  aiSuggestedQuestions.value = []
  currentResponse = ''
  
  try {
    const searchParams = {
      conversation_id: "search_" + Date.now(),
      bot_id: COZE_BOT_ID,
      user: "29032201862555",
      query: `请搜索关于 "${searchQuery.value}" 的内容。
        搜索范围: ${currentScope.value}
        来源限制: ${currentLimit.value}
        时间范围: ${currentTimeRange.value}
        同时请提供5个相关的问题建议。
        请只返回搜索结果和相关问题，不要返回任何API调用信息。
        请按以下格式返回：
        ---搜索结果---
        1. 结果1
        2. 结果2
        ...
        ---相关问题---
        1. 问题1
        2. 问题2
        ...`,
      stream: true
    }

    console.log('Sending request with params:', searchParams)

    const response = await fetch(COZE_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_COZE_API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'Host': 'api.coze.cn',
        'Connection': 'keep-alive'
      },
      body: JSON.stringify(searchParams)
    })

    console.log('Request body:', JSON.stringify(searchParams, null, 2))
    console.log('Response status:', response.status)

    if (response.status === 401 || response.status === 403) {
      console.error('Authentication failed:', await response.json())
      throw new Error('API authentication failed. Please check your API key.')
    }

    if (!response.ok) {
      const errorText = await response.text()
      console.error('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        body: errorText
      })
      throw new Error(`API request failed: ${response.status} - ${errorText || response.statusText}`)
    }

    const reader = response.body.getReader()
    
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      
      const chunk = new TextDecoder().decode(value)
      console.log('Received chunk:', chunk)
      
      const lines = chunk.split('\n')
      
      for (const line of lines) {
        if (line.startsWith('data:')) {
          try {
            const jsonStr = line.slice(5).trim()
            if (!jsonStr) continue
            
            const data = JSON.parse(jsonStr)
            console.log('Parsed data:', data)
            
            if (data.event === 'message' && data.message?.content) {
              const content = data.message.content
              
              // 过滤掉包含 JSON 格式的 API 调用信息
              if (content.includes('{') && content.includes('}')) {
                continue
              }
              
              // 累加内容
              currentResponse += content
              
              // 分离搜索结果和相关问题
              if (currentResponse.includes('---相关问题---')) {
                const [results, questions] = currentResponse.split('---相关问题---')
                
                // 处理搜索结果
                const processedResults = results
                  .replace('---搜索结果---', '')
                  .trim()
                  .replace(/\n{3,}/g, '\n\n')
                
                // 更新流式内容
                streamedContent.value = processedResults.split('\n')
                
                // 处理相关问题
                const questionsList = questions
                  .trim()
                  .split('\n')
                  .filter(q => q.trim())
                  .map(q => q.replace(/^\d+\.\s*/, '').trim())
                
                aiSuggestedQuestions.value = questionsList
              } else {
                // 直接更新流式内容
                streamedContent.value = currentResponse.split('\n')
              }
              
              // 滚动到底部
              if (responseContainer.value) {
                responseContainer.value.scrollTop = responseContainer.value.scrollHeight
              }
            } else if (data.event === 'done') {
              return
            }
          } catch (error) {
            console.warn('Failed to parse streaming response:', error)
            continue
          }
        }
      }
    }

  } catch (error) {
    console.error('Search failed:', error)
    console.error('Full error details:', {
      message: error.message,
      response: streamedContent.value,
      stack: error.stack
    })
    streamedContent.value = []
  } finally {
    isSearching.value = false
  }
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const openResult = (result) => {
  // TODO: 实现结果点击处理
  console.log('打开结果:', result)
}

// 更新相关搜索
const updateRelatedSearches = () => {
  // 这里可以根据实际需求调用API获取相关搜索
  aiSuggestedQuestions.value = [
    `${searchQuery.value} 教程`,
    `${searchQuery.value} 示例`,
    `${searchQuery.value} 最佳实践`,
    `${searchQuery.value} 面试题`,
    `${searchQuery.value} 常见问题`
  ]
}

// 处理流式响应内容
const processStreamedContent = (content) => {
  // 将文本按行分割并过滤空行
  const lines = content.split('\n').filter(line => line.trim() !== '')
  streamedContent.value = lines
}

// 滚动到底部
const scrollToBottom = () => {
  if (responseContainer.value) {
    setTimeout(() => {
      responseContainer.value.scrollTop = responseContainer.value.scrollHeight
    }, 50)
  }
}

// 生成相关问题建议
const generateSuggestedQuestions = async () => {
  try {
    // 基于当前搜索生成相关问题
    const relatedQuestions = [
      `${searchQuery.value}的最佳实践`,
      `如何优化${searchQuery.value}`,
      `${searchQuery.value}常见问题`,
      `${searchQuery.value}相关算法`,
      `${searchQuery.value}的替代方案`
    ]
    aiSuggestedQuestions.value = relatedQuestions
  } catch (error) {
    console.error('生成问题建议失败:', error)
  }
}

watch(searchQuery, () => {
  if (searchQuery.value.trim()) {
    updateRelatedSearches()
  }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

.search-container {
  min-height: 100vh;
  background: var(--vt-c-bg);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  letter-spacing: -0.2px;
  animation: fadeIn 0.3s ease;
  padding-top: -3px;
}

.header {
  background: linear-gradient(120deg, #ffffff, #f8f9ff, #ffffff);
  box-shadow: 0 2px 12px rgba(79, 110, 247, 0.08);
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid rgba(79, 110, 247, 0.1);
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px) saturate(180%);
  margin-top: -4px;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 8px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.left-section {
  flex: 0 0 auto;
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 1px solid #eee;
  border-radius: 20px;
  background: transparent;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  position: relative;
  height: 36px;
}

.nav-btn .btn-text,
.nav-btn .btn-hover {
  position: absolute;
  left: 40px;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.nav-btn .btn-text {
  transform: translateY(0) translateX(0);
  opacity: 1;
}

.nav-btn .btn-hover {
  opacity: 0;
  transform: translateY(0) translateX(-10px);
}

.nav-btn:hover .btn-text {
  opacity: 0;
  transform: translateY(0) translateX(10px);
}

.nav-btn:hover .btn-hover {
  opacity: 1;
  transform: translateY(0) translateX(0);
}

.nav-btn svg {
  position: absolute;
  left: 12px;
  width: 24px;
  height: 24px;
}

.center-section {
  flex: 1;
  text-align: center;
  min-width: 0;
}

.center-section h1 {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0;
  margin-bottom: 4px;
  position: relative;
  display: inline-block;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.title-highlight {
  color: var(--vt-c-primary);
  background: linear-gradient(135deg, var(--vt-c-primary), var(--vt-c-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  padding-right: 4px;
}

.title-decoration {
  position: absolute;
  top: -8px;
  right: -12px;
  width: 20px;
  height: 20px;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="%234F6EF7" d="M12 2L9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2z"/></svg>') no-repeat center;
  opacity: 0.2;
  transform: rotate(-15deg);
}

.center-section .subtitle {
  font-size: 14px;
  color: #666;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 0;
  margin-top: 0;
}

.right-section {
  flex: 0 0 auto;
}

.nav-btn {
  padding: 8px;
  background: transparent;
  border: none;
  border-radius: 8px;
  color: var(--vt-c-text-light-2);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  width: 40px;
  height: 36px;
  overflow: hidden;
}

.nav-btn .btn-text,
.nav-btn .btn-hover {
  position: absolute;
  left: 40px;
  white-space: nowrap;
  transition: all 0.3s ease;
}

.nav-btn .btn-text {
  opacity: 0;
}

.nav-btn .btn-hover {
  opacity: 0;
  transform: translateX(-10px);
}

.nav-btn:hover {
  width: 100px;
  background: rgba(79, 110, 247, 0.1);
  color: var(--vt-c-primary);
}

.nav-btn:hover .btn-hover {
  opacity: 1;
  transform: translateX(0);
}

.nav-btn svg {
  position: absolute;
  left: 10px;
  top: 8px;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 8px 24px 32px;
}

.search-box {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px;
  position: relative;
}

.search-box::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100vw;
  height: 100%;
  background: linear-gradient(180deg, rgba(79, 110, 247, 0.05) 0%, rgba(79, 110, 247, 0) 100%);
  z-index: -1;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(79, 110, 247, 0.1);
  border: 1px solid #eee;
  transition: all 0.3s ease;
  margin-bottom: 24px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  height: 56px;
}

.search-input-wrapper::before {
  content: '';
  position: absolute;
  inset: -2px;
  background: linear-gradient(135deg, var(--vt-c-primary), var(--vt-c-secondary));
  border-radius: 14px;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}

.search-input-wrapper:focus-within::before {
  opacity: 0.5;
}

.search-input-wrapper:focus-within {
  box-shadow: 0 8px 30px rgba(79, 110, 247, 0.15);
  border-color: var(--vt-c-primary);
  transform: translateY(-1px);
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--vt-c-text-light-2);
}

.clear-btn {
  position: absolute;
  right: 100px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  transition: all 0.3s ease;
  color: #999;
  z-index: 2;
}

.search-btn {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  padding: 8px 24px;
  border-radius: 8px;
  background: linear-gradient(135deg, var(--vt-c-primary), var(--vt-c-secondary));
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  margin-left: 8px;
  min-width: 80px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(79, 110, 247, 0.2);
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-btn-text {
  color: white;
  font-weight: 500;
  font-size: 14px;
}

.search-btn:hover {
  transform: translateY(-50%) scale(1.02);
  box-shadow: 0 4px 12px rgba(79, 110, 247, 0.3);
}

.search-input {
  width: 100%;
  padding: 12px 140px 12px 48px;
  border: none;
  outline: none;
  font-size: 15px;
  background: transparent;
  color: #333;
  font-family: inherit;
}

.search-input:focus {
  outline: none;
}

.search-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    120deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  transition: 0.5s;
}

.search-btn:hover::before {
  left: 100%;
}

.search-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.search-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  margin-top: 24px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
  min-width: 200px;
}

.filter-group label {
  font-size: 14px;
  color: #444;
  font-weight: 500;
  margin-bottom: 4px;
  position: relative;
  display: inline-block;
}

.filter-group label::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 1px;
  background: #eee;
}

.filter-options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 4px 0;
}

.filter-btn {
  padding: 6px 12px;
  border: 1px solid #eee;
  border-radius: 20px;
  background: white;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 13px;
  position: relative;
  overflow: hidden;
}

.filter-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(120deg, transparent, rgba(79, 110, 247, 0.1), transparent);
  transition: 0.5s;
}

.filter-btn:hover::before {
  left: 100%;
}

.filter-btn.active {
  background: rgba(79, 110, 247, 0.1);
  color: var(--vt-c-primary);
  border-color: var(--vt-c-primary);
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(79, 110, 247, 0.1);
}

.filter-btn:hover {
  border-color: var(--vt-c-primary);
  color: var(--vt-c-primary);
  background: rgba(79, 110, 247, 0.05);
}

.search-results {
  display: grid;
  gap: 16px;
  margin-top: 24px;
  position: relative;
}

.result-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #eee;
}

.result-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border-color: var(--vt-c-primary);
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.result-header h3 {
  margin: 0;
  font-size: 18px;
  color: var(--vt-c-text-light-1);
  font-weight: 500;
  line-height: 1.4;
}

.result-type {
  padding: 4px 12px;
  background: rgba(79, 110, 247, 0.1);
  color: var(--vt-c-primary);
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.result-description {
  color: #666;
  font-size: 14px;
  line-height: 1.6;
  margin: 8px 0;
  white-space: pre-line;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.result-meta {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #999;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f5f5f5;
}

.source {
  display: flex;
  align-items: center;
  gap: 4px;
}

.source::before {
  content: '';
  display: inline-block;
  width: 4px;
  height: 4px;
  background: currentColor;
  border-radius: 50%;
}

.empty-state {
  text-align: center;
  padding: 48px 0;
  color: #999;
  background: white;
  border-radius: 12px;
  margin: 16px 0;
  position: relative;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.empty-state::before,
.empty-state::after {
  content: '';
  position: absolute;
  width: 200px;
  height: 200px;
  background: linear-gradient(135deg, rgba(79, 110, 247, 0.05), transparent);
  border-radius: 50%;
}

.empty-state::before {
  top: -100px;
  left: -100px;
}

.empty-state::after {
  bottom: -100px;
  right: -100px;
}

.results-container {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 24px;
  min-height: calc(100vh - 300px);
  height: 100%;
}

.search-content {
  background: white;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #eee;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
}

.search-header {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
}

.search-header h2 {
  font-size: 20px;
  font-weight: 500;
  color: var(--vt-c-text-light-1);
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.search-header h2 svg {
  color: var(--vt-c-primary);
}

.search-info {
  font-size: 14px;
  color: var(--vt-c-text-light-2);
  display: flex;
  align-items: center;
  gap: 4px;
}

.search-info svg {
  color: var(--vt-c-primary);
}

.loading-state {
  position: relative;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.loading-state p {
  margin-top: 16px;
  color: var(--vt-c-text-light-2);
}

.results-list {
  min-height: 400px;
  height: 100%;
  overflow-y: auto;
  padding: 16px;
  background: linear-gradient(145deg, #ffffff, #f8f9ff);
  border-radius: 12px;
  flex: 1;
  box-shadow: inset 0 2px 8px rgba(79, 110, 247, 0.05);
  margin-bottom: 16px;
}

.response-content {
  line-height: 1.6;
  white-space: pre-wrap;
  font-size: 15px;
  color: var(--vt-c-text-light-1);
  padding: 0 16px;
  overflow-wrap: break-word;
  height: 100%;
}

.response-content a {
  color: var(--vt-c-primary);
  text-decoration: none;
  transition: all 0.2s ease;
}

.response-content a:hover {
  text-decoration: underline;
  opacity: 0.8;
}

.content-line {
  margin: 8px 0;
  animation: fadeIn 0.3s ease;
}

.result-item {
  background: white;
  padding: 20px;
  border-radius: 12px;
  margin: 16px 0;
  box-shadow: 0 4px 20px rgba(79, 110, 247, 0.05);
  border: 1px solid #eee;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(8px);
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.85));
  display: grid;
  gap: 12px;
  font-size: 15px;
  line-height: 1.7;
  transform-origin: center;
  will-change: transform;
}

.result-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 3px;
  height: 100%;
  background: linear-gradient(to bottom, var(--vt-c-primary), var(--vt-c-secondary));
  opacity: 0;
  transition: all 0.3s ease;
}

.result-item:hover::after {
  content: '';
  position: absolute;
  top: 12px;
  right: 12px;
  width: 24px;
  height: 24px;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="%234F6EF7" opacity="0.2" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10H7v-2h10v2z"/></svg>') no-repeat center;
  opacity: 0.5;
  transition: all 0.3s ease;
}

.result-item:hover {
  transform: scale(1.01) translateY(-2px);
  box-shadow: 0 8px 30px rgba(79, 110, 247, 0.15);
  border-color: var(--vt-c-primary);
  background: white;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

.empty-state svg {
  animation: float 3s ease-in-out infinite;
  margin-bottom: 16px;
}

.related-content {
  background: white;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #eee;
  height: 100%;
  position: sticky;
  top: 100px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  background: linear-gradient(165deg, #ffffff, #f8f9ff);
  backdrop-filter: blur(8px);
}

.related-section {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.related-section h3 {
  font-size: 16px;
  font-weight: 500;
  color: var(--vt-c-text-light-1);
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
}

.related-section h3 svg {
  color: var(--vt-c-primary);
}

.related-section h3::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 100%;
  height: 1px;
  background: linear-gradient(to right, var(--vt-c-primary), transparent);
}

.related-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
  overflow-y: auto;
}

/* 自定义滚动条样式 */
.related-items::-webkit-scrollbar {
  width: 6px;
}

.related-items::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.related-items::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 3px;
}

.related-items::-webkit-scrollbar-thumb:hover {
  background: #999;
}

.search-item {
  margin: 16px 0;
  line-height: 1.6;
  padding: 16px;
  border: 1px solid #eee;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.search-item:hover {
  border-color: var(--vt-c-primary);
  background: rgba(79, 110, 247, 0.02);
}

.item-number {
  color: var(--vt-c-primary);
  font-weight: 500;
  margin-right: 8px;
}

.item-source, .item-time {
  font-size: 14px;
  color: #666;
  margin-top: 4px;
  display: inline-block;
  margin-right: 16px;
}

.item-source span, .item-time span {
  color: var(--vt-c-text-light-1);
}

.related-item {
  padding: 12px 16px;
  background: white;
  border-radius: 8px;
  font-size: 14px;
  color: var(--vt-c-text-light-1);
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(79, 110, 247, 0.03);
  border: 1px solid #eee;
  position: relative;
  padding-left: 40px;
  background: linear-gradient(145deg, #ffffff, #f8f9ff);
  font-weight: 500;
  letter-spacing: -0.2px;
}

.related-item::before {
  content: '?';
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  background: linear-gradient(135deg, var(--vt-c-primary), var(--vt-c-secondary));
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  opacity: 0.8;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(79, 110, 247, 0.2);
}

.related-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(79, 110, 247, 0.1);
  border-color: var(--vt-c-primary);
  background: white;
}

.related-item:hover::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, transparent, rgba(79, 110, 247, 0.05));
  border-radius: 0 12px 0 12px;
}

@media (max-width: 1024px) {
  .results-container {
    grid-template-columns: 1fr;
  }
}

/* 添加自定义滚动条样式 */
.results-list::-webkit-scrollbar {
  width: 8px;
}

.results-list::-webkit-scrollbar-track {
  background: rgba(79, 110, 247, 0.05);
  border-radius: 4px;
}

.results-list::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, var(--vt-c-primary), var(--vt-c-secondary));
  border-radius: 4px;
  border: 2px solid transparent;
  background-clip: padding-box;
}

.results-list::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, var(--vt-c-secondary), var(--vt-c-primary));
  border: 1px solid transparent;
}

/* 添加动画效果 */
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

.loading-state {
  position: relative;
  overflow: hidden;
}

.loading-state::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    rgba(79, 110, 247, 0.02) 25%,
    rgba(79, 110, 247, 0.05) 50%,
    rgba(79, 110, 247, 0.02) 75%
  );
  animation: shimmer 2s infinite linear;
}

.page-loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--vt-c-bg);
  z-index: 1000;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(79, 110, 247, 0.1);
  border-top-color: var(--vt-c-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.typing-indicator {
  display: flex;
  gap: 4px;
  justify-content: center;
  margin-bottom: 16px;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  background: var(--vt-c-primary);
  border-radius: 50%;
  animation: pulse 1.5s infinite;
  opacity: 0.6;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.6;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
}

.ai-badge,
.feature-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.3s ease;
  transform-origin: center;
  transition: all 0.3s ease;
}

.ai-badge {
  background: rgba(0, 0, 0, 0.04);
  color: #666;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.feature-badge {
  background: rgba(0, 0, 0, 0.04);
  color: #666;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.ai-badge:hover,
.feature-badge:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  background: rgba(0, 0, 0, 0.06);
}

.ai-badge svg,
.feature-badge svg {
  width: 18px;
  height: 18px;
}

.divider {
  color: #ddd;
  font-weight: 300;
  margin: 0 4px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .header-content {
    padding: 12px 16px;
    gap: 16px;
  }
  
  .nav-btn {
    padding: 6px 12px;
    font-size: 13px;
  }
  
  .nav-btn svg {
    width: 20px;
    height: 20px;
  }
  
  .center-section h1 {
    font-size: 18px;
  }
  
  .center-section .subtitle {
    flex-wrap: wrap;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .header-content {
    flex-wrap: wrap;
  }
  
  .center-section {
    order: -1;
    width: 100%;
    margin-bottom: 12px;
  }
  
  .left-section,
  .right-section {
    flex: 1;
  }
}

.search-results::before {
  content: '';
  position: absolute;
  top: -40px;
  left: 50%;
  transform: translateX(-50%);
  width: 100vw;
  height: 100vh;
  background: radial-gradient(circle at center, rgba(79, 110, 247, 0.05) 0%, transparent 70%);
  z-index: -1;
  pointer-events: none;
}
</style> 