<template>
  <div class="paper-history" :class="{ 'expanded': isExpanded }">
    <!-- 历史记录切换按钮 -->
    <div class="history-toggle" @click="toggleExpand">
      <div class="toggle-content">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" 
          :class="{ 'rotate': isExpanded }">
          <path fill="currentColor" d="M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0 0 13 21a9 9 0 0 0 0-18zm-1 5v5l4.25 2.52.77-1.28-3.52-2.09V8z"/>
        </svg>
        <span>历史记录</span>
        <div v-if="history.length" class="history-badge">{{ history.length }}</div>
      </div>
    </div>

    <!-- 历史记录内容 -->
    <div class="history-content" v-show="isExpanded">
      <div class="content-header">
        <h3>生成历史</h3>
        <button v-if="history.length" class="clear-btn" @click="clearHistory">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
            <path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
          </svg>
          清空
        </button>
      </div>

      <div v-if="history.length > 0" class="history-list">
        <div v-for="(paper, index) in history" :key="index" class="history-item">
          <div class="history-item-content">
            <div class="item-header">
              <h4>{{ paper.title }}</h4>
              <span class="date">{{ formatDate(paper.generatedAt) }}</span>
            </div>
            <div class="item-info">
              <span class="info-tag difficulty">{{ paper.difficulty }}</span>
              <span class="info-tag">{{ paper.duration }}分钟</span>
              <span class="info-tag">{{ paper.totalScore }}分</span>
            </div>
            <div class="item-stats">
              <div v-for="(count, type) in getQuestionCounts(paper)" :key="type" class="stat-item">
                <span class="stat-label">{{ getQuestionTypeName(type) }}</span>
                <span class="stat-value">{{ count }}</span>
              </div>
            </div>
          </div>
          <div class="item-actions">
            <button class="action-btn view" @click="viewPaper(paper, index)" title="查看试卷">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
              </svg>
            </button>
            <button class="action-btn delete" @click="deletePaper(index)" title="删除">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                <path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div v-else class="no-history">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24">
          <path fill="currentColor" d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0 0 13 21a9 9 0 0 0 0-18zm-1 5v5l4.25 2.52.77-1.28-3.52-2.09V8z"/>
        </svg>
        <p>暂无生成历史</p>
      </div>
      
      <div v-if="!isPremium && totalHistory > FREE_HISTORY_LIMIT" class="premium-tip">
        <div class="tip-content">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
            <path fill="currentColor" d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
          </svg>
          <span>升级到高级版可查看更多历史记录</span>
        </div>
        <button class="upgrade-btn" @click="showUpgradeTip">
          立即升级
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { getPaperHistory, savePaperToHistory, clearPaperHistory } from '@/services/paper'
import { eventBus } from '@/utils/eventBus'

const router = useRouter()
const history = ref([])
const totalHistory = ref(0)
const isPremium = ref(false)
const FREE_HISTORY_LIMIT = 3
const isExpanded = ref(false)

onMounted(async () => {
  loadHistory()
  eventBus.on('paperGenerated', loadHistory)
})

onUnmounted(() => {
  eventBus.off('paperGenerated', loadHistory)
})

const loadHistory = () => {
  history.value = getPaperHistory()
  totalHistory.value = getPaperHistory(true).length
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (date.toDateString() === today.toDateString()) {
    return `今天 ${date.toLocaleTimeString()}`
  } else if (date.toDateString() === yesterday.toDateString()) {
    return `昨天 ${date.toLocaleTimeString()}`
  } else {
    return date.toLocaleString()
  }
}

const getQuestionCounts = (paper) => {
  const counts = {}
  const types = ['choice', 'programming', 'completion', 'truefalse', 'shortanswer', 'matching']
  types.forEach(type => {
    if (paper[type]?.length) {
      counts[type] = paper[type].length
    }
  })
  return counts
}

const getQuestionTypeName = (type) => {
  const names = {
    choice: '选择题',
    programming: '编程题',
    completion: '填空题',
    truefalse: '判断题',
    shortanswer: '简答题',
    matching: '匹配题'
  }
  return names[type]
}

const viewPaper = (paper, index) => {
  localStorage.setItem('currentPaper', JSON.stringify(paper))
  router.push(`/view-paper?id=${index}`)
}

const deletePaper = (index) => {
  if (confirm('确定要删除这份试卷吗？')) {
    const newHistory = [...history.value]
    newHistory.splice(index, 1)
    localStorage.setItem('paper_history', JSON.stringify(newHistory))
    loadHistory()
  }
}

const clearHistory = () => {
  if (confirm('确定要清空所有历史记录吗？')) {
    clearPaperHistory()
    loadHistory()
  }
}

const showUpgradeTip = () => {
  alert('升级到高级版即可查看所有历史记录！')
}

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}
</script>

<style scoped>
.paper-history {
  position: fixed;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  background: white;
  border-radius: 12px 0 0 12px;
  box-shadow: -2px 0 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  z-index: 1000;
}

.history-toggle {
  padding: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.toggle-content {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  font-size: 0.9em;
}

.history-toggle:hover {
  background: #f5f7ff;
}

.history-toggle svg {
  transition: transform 0.3s ease;
}

.history-toggle svg.rotate {
  transform: rotate(180deg);
}

.history-badge {
  background: #4F6EF7;
  color: white;
  padding: 2px 6px;
  border-radius: 12px;
  font-size: 0.8em;
}

.history-content {
  width: 360px;
  max-height: 80vh;
  overflow-y: auto;
  border-top: 1px solid #eee;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #eee;
}

.content-header h3 {
  margin: 0;
  font-size: 1.1em;
  color: #333;
}

.clear-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
}

.clear-btn:hover {
  color: #ff4d4f;
}

.history-list {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.history-item {
  background: #f8f9fa;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.history-item:hover {
  background: #f1f3f5;
  transform: translateX(-4px);
}

.history-item-content {
  padding: 12px;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.item-header h4 {
  margin: 0;
  font-size: 1em;
  color: #333;
}

.date {
  font-size: 0.85em;
  color: #999;
}

.item-info {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.info-tag {
  padding: 2px 8px;
  background: #e8f0fe;
  color: #4F6EF7;
  border-radius: 4px;
  font-size: 0.85em;
}

.info-tag.difficulty {
  background: #f6ffed;
  color: #52c41a;
}

.item-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.85em;
  color: #666;
}

.stat-label::after {
  content: ':';
}

.item-actions {
  display: flex;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.02);
}

.action-btn {
  padding: 6px;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 4px;
}

.action-btn.view {
  color: #4F6EF7;
}

.action-btn.view:hover {
  background: rgba(79, 110, 247, 0.1);
}

.action-btn.delete {
  color: #ff4d4f;
}

.action-btn.delete:hover {
  background: rgba(255, 77, 79, 0.1);
}

.no-history {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48px 24px;
  color: #999;
}

.no-history svg {
  margin-bottom: 16px;
  opacity: 0.5;
}

.premium-tip {
  padding: 16px;
  background: #f5f7ff;
  border-top: 1px solid #eee;
}

.tip-content {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #4F6EF7;
  margin-bottom: 12px;
}

.upgrade-btn {
  width: 100%;
  padding: 8px;
  background: #4F6EF7;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.upgrade-btn:hover {
  background: #3D5CE5;
  transform: translateY(-1px);
}

/* 自定义滚动条 */
.history-content::-webkit-scrollbar {
  width: 6px;
}

.history-content::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.history-content::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 3px;
}

.history-content::-webkit-scrollbar-thumb:hover {
  background: #999;
}
</style> 