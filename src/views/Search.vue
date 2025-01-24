<template>
  <div class="search-container">
    <header class="header">
      <div class="header-content">
        <div class="left-section">
          <button class="nav-btn" @click="router.push('/home')">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
            <span>返回</span>
          </button>
        </div>
        <div class="center-section">
          <h1>AI 全网搜索</h1>
          <p class="subtitle">通过 AI 技术提供智能搜索服务</p>
        </div>
        <div class="right-section">
          <button class="nav-btn" @click="toggleFullscreen">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
              <path fill="currentColor" d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
            </svg>
            <span>全屏模式</span>
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
            placeholder="输入关键词，按回车搜索..."
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
          <button class="search-btn" @click="handleSearch" :disabled="isSearching">
            <span v-if="!isSearching">搜索</span>
            <div v-else class="spinner"></div>
          </button>
        </div>

        <!-- 搜索建议 -->
        <div v-if="showSuggestions && suggestions.length > 0" class="search-suggestions">
          <div 
            v-for="suggestion in suggestions" 
            :key="suggestion"
            class="suggestion-item"
            @click="selectSuggestion(suggestion)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
              <path fill="currentColor" d="M7 9H2V7h5v2zm0 3H2v2h5v-2zm13.59 7-3.83-3.83c-.8.52-1.74.83-2.76.83-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5c0 1.02-.31 1.96-.83 2.75L22 17.59 20.59 19zM17 11c0-1.65-1.35-3-3-3s-3 1.35-3 3 1.35 3 3 3 3-1.35 3-3zM2 19h10v-2H2v2z"/>
            </svg>
            {{ suggestion }}
          </div>
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
      <div class="search-results" v-if="searchResults.length > 0">
        <div 
          v-for="result in searchResults" 
          :key="result.id" 
          class="result-card"
          @click="openResult(result)"
        >
          <div class="result-header">
            <h3>{{ result.title }}</h3>
            <span class="result-type">{{ result.type }}</span>
          </div>
          <p class="result-description">{{ result.description }}</p>
          <div class="result-meta">
            <span class="source">{{ result.source }}</span>
            <span class="date">{{ formatDate(result.date) }}</span>
          </div>
        </div>
      </div>

      <!-- 空状态展示 -->
      <div v-else-if="hasSearched" class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24">
          <path fill="#ccc" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
        </svg>
        <p>暂无搜索结果</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchQuery = ref('')
const isSearching = ref(false)
const hasSearched = ref(false)
const searchResults = ref([])
const searchInput = ref(null)
const showSuggestions = ref(false)
const suggestions = ref([])
let searchTimeout = null

const currentScope = ref('all')
const currentTimeRange = ref('all')
const currentLimit = ref('all')

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
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  
  if (!searchQuery.value.trim()) {
    showSuggestions.value = false
    return
  }
  
  searchTimeout = setTimeout(async () => {
    // TODO: 实际项目中这里应该调用API获取搜索建议
    suggestions.value = [
      `${searchQuery.value} 教程`,
      `${searchQuery.value} 实例`,
      `${searchQuery.value} 最佳实践`,
      `${searchQuery.value} 面试题`
    ]
    showSuggestions.value = true
  }, 300)
}

// 选择搜索建议
const selectSuggestion = (suggestion) => {
  searchQuery.value = suggestion
  showSuggestions.value = false
  handleSearch()
}

// 清空搜索
const clearSearch = () => {
  searchQuery.value = ''
  showSuggestions.value = false
  searchInput.value?.focus()
}

// 点击外部关闭建议
const handleClickOutside = (event) => {
  const searchBox = document.querySelector('.search-box')
  if (searchBox && !searchBox.contains(event.target)) {
    showSuggestions.value = false
  }
}

onMounted(() => {
  searchInput.value?.focus()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
})

const handleSearch = async () => {
  if (!searchQuery.value.trim() || isSearching.value) return
  
  isSearching.value = true
  hasSearched.value = true
  
  try {
    // TODO: 实现实际的搜索逻辑
    await new Promise(resolve => setTimeout(resolve, 1000)) // 模拟搜索延迟
    
    // 根据搜索范围和限制构建搜索参数
    const searchParams = {
      query: searchQuery.value,
      scope: currentScope.value,
      timeRange: currentTimeRange.value,
      limit: currentLimit.value
    }
    
    console.log('搜索参数:', searchParams)
    
    // 模拟搜索结果
    searchResults.value = [
      {
        id: 1,
        title: '如何优化React应用性能',
        type: '文章',
        source: currentLimit.value === 'docs' ? 'React官方文档' : 'React中文社区',
        description: '本文详细介绍了React应用性能优化的多种方法，包括使用useMemo、useCallback等hooks，以及代码分割、懒加载等技术。',
        date: new Date('2024-01-15')
      },
      // 更多结果...
    ]
  } catch (error) {
    console.error('搜索失败:', error)
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
</script>

<style scoped>
.search-container {
  min-height: 100vh;
  background: var(--vt-c-bg);
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

.left-section {
  display: flex;
  align-items: center;
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
}

.nav-btn:hover {
  border-color: #4F6EF7;
  color: #4F6EF7;
  background: rgba(79, 110, 247, 0.1);
}

.center-section {
  text-align: center;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.center-section h1 {
  font-size: 20px;
  font-weight: 500;
  color: #333;
  margin: 0;
  margin-bottom: 4px;
}

.center-section .subtitle {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.right-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.nav-btn {
  padding: 8px;
  background: transparent;
  border: none;
  border-radius: 8px;
  color: var(--vt-c-text-light-2);
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-btn:hover {
  background: rgba(79, 110, 247, 0.1);
  color: var(--vt-c-primary);
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px;
}

.search-box {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 24px;
}

.search-input-wrapper {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  max-width: 800px;
  margin: 0 auto 20px;
  position: relative;
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
  right: 120px;
  top: 50%;
  transform: translateY(-50%);
  padding: 4px;
  cursor: pointer;
  color: var(--vt-c-text-light-2);
  border-radius: 50%;
  transition: all 0.3s ease;
}

.clear-btn:hover {
  background: rgba(0, 0, 0, 0.05);
  color: var(--vt-c-text-light-1);
}

.search-input {
  flex: 1;
  padding: 12px 20px;
  padding-left: 48px;
  border: 2px solid #ddd;
  border-radius: 12px;
  font-size: 16px;
  transition: all 0.3s ease;
  background: var(--vt-c-white);
  color: var(--vt-c-text-light-1);
}

.search-input:focus {
  outline: none;
  border-color: var(--vt-c-primary);
  box-shadow: 0 0 0 3px rgba(79, 110, 247, 0.1);
}

.search-btn {
  padding: 12px 24px;
  min-width: 100px;
  background: var(--vt-c-primary);
  border: none;
  border-radius: 12px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 500;
}

.search-btn:hover:not(:disabled) {
  background: var(--vt-c-primary-dark);
  transform: translateY(-1px);
}

.search-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.search-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
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
  border: 1px solid #ddd;
  border-radius: 20px;
  background: transparent;
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  position: relative;
  overflow: hidden;
}

.filter-btn:hover {
  border-color: var(--vt-c-primary);
  color: var(--vt-c-primary);
  background: rgba(79, 110, 247, 0.05);
}

.filter-btn.active {
  background: rgba(79, 110, 247, 0.15);
  color: var(--vt-c-primary);
  border-color: var(--vt-c-primary);
  opacity: 1 !important;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(79, 110, 247, 0.1);
}

.filter-btn.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 24px;
  height: 2px;
  background: var(--vt-c-primary);
  border-radius: 2px;
}

.search-results {
  display: grid;
  gap: 16px;
}

.result-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.result-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
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
}

.result-meta {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #999;
}

.empty-state {
  text-align: center;
  padding: 48px 0;
  color: #999;
}

.empty-state svg {
  margin-bottom: 16px;
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

.search-suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 104px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-top: 8px;
  z-index: 100;
  max-height: 300px;
  overflow-y: auto;
}

.suggestion-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--vt-c-text-light-2);
}

.suggestion-item:hover {
  background: var(--vt-c-bg-mute);
  color: var(--vt-c-text-light-1);
}

.suggestion-item svg {
  opacity: 0.5;
}

.suggestion-item:hover svg {
  opacity: 1;
}

@media (max-width: 768px) {
  .search-filters {
    flex-direction: column;
    gap: 16px;
  }
  
  .filter-options {
    overflow-x: auto;
    padding-bottom: 8px;
  }
  
  .filter-btn {
    white-space: nowrap;
  }
}
</style> 