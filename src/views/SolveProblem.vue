<template>
  <div class="solve-problem">
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>加载中...</p>
    </div>
    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
      <button @click="router.push('/problems')">返回题目列表</button>
    </div>
    <template v-else>
      <header class="header">
        <div class="header-content">
          <div class="left-section">
            <button class="back-btn" @click="router.back()">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
              </svg>
            </button>
          </div>
          <div class="center-section">
            <div class="tabs">
              <button 
                class="tab-btn" 
                :class="{ active: activeTab === 'description' }"
                @click="handleTabClick('description')"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6z"/>
                </svg>
                题目描述
              </button>
              <button 
                class="tab-btn" 
                :class="{ active: activeTab === 'solution' }"
                @click="handleTabClick('solution')"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2z"/>
                </svg>
                题解
              </button>
              <button 
                class="tab-btn" 
                :class="{ active: activeTab === 'analysis' }"
                @click="handleTabClick('analysis')"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/>
                  <path fill="currentColor" d="M7 12h2v5H7zm4-3h2v8h-2zm4-3h2v11h-2z"/>
                </svg>
                成绩分析
              </button>
            </div>
          </div>
        </div>
      </header>

      <main class="main-content">
        <!-- 左侧面板：题目描述 -->
        <div class="description-panel" :class="{ 'panel-collapsed': !showDescription }">
          <div class="panel-header">
            <h2>题目描述</h2>
            <button class="toggle-btn" @click="toggleDescription">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                <path fill="currentColor" d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>
              </svg>
            </button>
          </div>
          <!-- 题目描述内容 -->
          <div class="problem-info">
            <div class="problem-header">
              <h1 class="problem-title">{{ problem?.id }}. {{ problem?.title }}</h1>
              <div class="problem-tags">
                <span :class="['difficulty', problem?.difficulty?.toLowerCase()]">
                  {{ problem?.difficulty }}
                </span>
                <span class="tag">相关标签</span>
                <span class="tag">相关企业</span>
              </div>
            </div>

            <div class="problem-stats">
              <div class="stat-item">
                <span class="stat-label">通过率</span>
                <span class="stat-value success">{{ problem?.acceptanceRate }}%</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">提交次数</span>
                <span class="stat-value">{{ problem?.submissions }}</span>
              </div>
            </div>

            <div class="problem-content">
              <div v-html="problem?.description"></div>
            </div>
            
            <div class="examples">
              <div v-for="(example, index) in problem?.examples" 
                   :key="index" 
                   class="example">
                <p class="example-title">示例 {{ index + 1 }}：</p>
                <div class="example-content">
                  <p><strong>输入：</strong>{{ example.input }}</p>
                  <p><strong>输出：</strong>{{ example.output }}</p>
                  <p v-if="example.explanation"><strong>解释：</strong>{{ example.explanation }}</p>
                </div>
              </div>
            </div>

            <div class="constraints">
              <h3>提示：</h3>
              <ul v-html="problem?.constraints"></ul>
            </div>
          </div>
        </div>

        <!-- 右侧面板：代码编辑器 -->
        <div class="editor-panel" :class="{ 'panel-expanded': !showDescription }">
          <div class="panel-header">
            <div class="editor-controls">
              <select v-model="selectedLanguage" class="language-select">
                <option value="cpp">C++</option>
                <option value="java">Java</option>
                <option value="python">Python</option>
              </select>
              <button class="reset-btn" @click="resetCode">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
                </svg>
                重置
              </button>
            </div>
          </div>

          <div class="editor-container">
            <textarea 
              v-model="code"
              class="code-editor"
              @input="handleCodeChange"
            ></textarea>
          </div>

          <div class="editor-footer">
            <button 
              class="run-btn"
              :disabled="isRunning"
              @click="handleRunCode"
            >
              运行代码
            </button>
            <button 
              class="submit-btn"
              :disabled="isSubmitting"
              @click="submitCode"
            >
              提交
            </button>
          </div>
        </div>
      </main>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Chart from 'chart.js/auto'
import { getProblem, runCode as runCodeAPI, submitCodeToAI } from '../services/problems'
import { getProblemStats, getSubmissions } from '@/services/jieti'
import { useProblemsStore } from '../stores/problems'

const route = useRoute()
const router = useRouter()
const problemsStore = useProblemsStore()
const problem = ref(null)
const activeTab = ref('description')
const code = ref('')
const selectedLanguage = ref('cpp')
const isRunning = ref(false)
const isSubmitting = ref(false)
const problemStats = ref({
  totalSubmissions: 0,
  acceptedSubmissions: 0,
  acceptanceRate: 0
})
const submissions = ref([])

const codeTemplates = {
  cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        
    }
};`,
  java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        
    }
}`,
  python: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        `
}

const initCode = () => {
  code.value = codeTemplates[selectedLanguage.value]
}

const handleTabClick = async (tab) => {
  activeTab.value = tab
  if (tab === 'analysis') {
    await loadAnalysisData()
    // 初始化图表
    const canvas = document.querySelector('.submission-chart canvas')
    if (canvas) {
      initChart(canvas)
    }
  }
}

const loadAnalysisData = async () => {
  try {
    const [stats, submissionHistory] = await Promise.all([
      getProblemStats(route.params.id),
      getSubmissions(route.params.id)
    ])
    problemStats.value = stats
    submissions.value = submissionHistory
  } catch (error) {
    console.error('Failed to load analysis data:', error)
  }
}

const formatTime = (timestamp) => {
  const now = Date.now()
  const diff = now - timestamp
  if (diff < 3600000) {
    return `${Math.floor(diff / 60000)}分钟前`
  } else if (diff < 86400000) {
    return `${Math.floor(diff / 3600000)}小时前`
  }
  return new Date(timestamp).toLocaleDateString()
}

const handleRunCode = async () => {
  if (isRunning.value) return
  
  try {
    isRunning.value = true
    const result = await runCodeAPI(route.params.id, code.value, selectedLanguage.value)
    // 处理运行结果
    console.log('Run result:', result)
  } catch (error) {
    console.error('Run code failed:', error)
  } finally {
    isRunning.value = false
  }
}

const submitCode = async () => {
  if (isSubmitting.value) return
  
  try {
    isSubmitting.value = true
    const result = await submitCodeToAI(route.params.id, code.value, selectedLanguage.value)
    // 处理提交结果
    console.log('Submit result:', result)
  } catch (error) {
    console.error('Submit code failed:', error)
  } finally {
    isSubmitting.value = false
  }
}

const resetCode = () => {
  if (confirm('确定要重置代码吗？这将清除所有更改。')) {
    initCode()
  }
}

const loading = ref(true)
const error = ref(null)

const showDescription = ref(true)

const toggleDescription = () => {
  showDescription.value = !showDescription.value
}

onMounted(async () => {
  try {
    loading.value = true
    error.value = null
    const { id } = route.params
    if (!id) {
      throw new Error('题目ID不存在')
    }
    
    const storeProblem = problemsStore.getCurrentProblem()
    if (storeProblem && storeProblem.id === id) {
      problem.value = storeProblem
    } else {
      const response = await getProblem(id)
      if (response.data) {
        const problemData = {
          ...response.data,
          difficulty: response.data.difficulty || 'Medium',
          acceptanceRate: response.data.acceptanceRate || 0,
          submissions: response.data.submissions || 0
        }
        problem.value = problemData
        problemsStore.setCurrentProblem(problemData)
      } else {
        throw new Error('题目不存在')
      }
    }
    initCode()
  } catch (error) {
    console.error('Failed to fetch problem:', error)
    error.value = error.message || '加载题目失败'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
/* 基础布局 */
.solve-problem {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f5f7fa;
}

/* 头部样式 */
.header {
  background: white;
  border-bottom: 1px solid #e4e7ed;
  padding: 0 24px;
  height: 64px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1440px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.left-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border: none;
  background: none;
  color: #606266;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: #f5f7fa;
}

.center-section {
  flex: 1;
  display: flex;
  justify-content: center;
}

.tabs {
  display: flex;
  gap: 24px;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: none;
  background: none;
  color: #606266;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.3s ease;
}

.tab-btn.active {
  color: var(--primary-color, #4F6EF7);
  border-bottom-color: var(--primary-color, #4F6EF7);
}

/* 主要内容区域 */
.main-content {
  display: flex;
  gap: 16px;
  padding: 16px;
  height: calc(100vh - 64px);
  overflow: hidden;
}

.description-panel,
.editor-panel {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.description-panel {
  flex: 1;
  overflow-y: auto;
  min-width: 400px;
}

.editor-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.panel-header {
  padding: 16px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.toggle-btn {
  padding: 4px;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.toggle-btn:hover {
  background: var(--background-color);
}

.panel-collapsed {
  flex: 0;
  min-width: 0;
  width: 40px;
  overflow: hidden;
}

.panel-expanded {
  flex: 2;
}

.editor-controls {
  display: flex;
  gap: 16px;
  align-items: center;
}

.language-select {
  padding: 6px 12px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: white;
}

.reset-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.reset-btn:hover {
  background: var(--background-color);
}

/* 加载状态和错误状态样式 */
.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 示例和约束样式 */
.examples {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.example {
  background: #f5f7fa;
  border-radius: 8px;
  padding: 16px;
}

.example-title {
  font-weight: 600;
  margin-bottom: 12px;
  color: #303133;
}

.example-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: #606266;
}

.constraints {
  margin-top: 24px;
}

.constraints h3 {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 16px;
}

.constraints ul {
  list-style-type: disc;
  padding-left: 24px;
  color: #606266;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-content {
    flex-direction: column;
    height: auto;
  }
  
  .description-panel {
    min-width: 100%;
  }
  
  .panel-collapsed {
    width: 100%;
    height: 40px;
  }
}
</style> 