<template>
  <div class="problems-container">
    <header class="header">
      <div class="header-content">
        <div class="left-section">
          <button class="back-btn" @click="goBack">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
            {{ t('problems.back') }}
          </button>
          <h1 class="page-title">{{ t(`home.categories.${category}.title`) }}</h1>
        </div>
        
        <div class="filters">
          <div class="search-box">
            <input 
              type="text" 
              v-model="searchQuery" 
              :placeholder="t('problems.searchPlaceholder')"
            >
          </div>
          
          <select v-model="difficulty" class="difficulty-filter">
            <option value="">{{ t('problems.allDifficulties') }}</option>
            <option value="easy">{{ t('problems.easy') }}</option>
            <option value="medium">{{ t('problems.medium') }}</option>
            <option value="hard">{{ t('problems.hard') }}</option>
          </select>
        </div>
      </div>
    </header>

    <main class="main-content">
      <div class="ai-actions">
        <button class="ai-btn generate-problems" @click="generateProblems">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path fill="currentColor" d="M19 11c0-3.87-3.13-7-7-7-3.22 0-5.93 2.18-6.74 5.15C2.82 9.71 1 11.89 1 14.5 1 17.54 3.46 20 6.5 20h12c2.49 0 4.5-2.01 4.5-4.5 0-2.19-1.56-4-3.63-4.38zM14 13v4h-4v-4H7l5-5 5 5h-3z"/>
          </svg>
          {{ t('problems.generateProblems') }}
        </button>
        <button class="ai-btn generate-solutions" @click="generateSolutions">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          {{ t('problems.generateSolutions') }}
        </button>
      </div>

      <div v-if="isGenerating" class="generation-dialog">
        <div class="dialog-content">
          <div class="generation-status">
            <div class="loading-spinner"></div>
            <p>{{ generationStatus }}</p>
          </div>
          <div class="progress-bar">
            <div class="progress" :style="{ width: `${generationProgress}%` }"></div>
          </div>
        </div>
      </div>

      <div class="problems-list">
        <div v-for="problem in filteredProblems" 
             :key="problem.id" 
             class="problem-card"
             :class="problem.difficulty">
          <div class="problem-status">
            <span class="status-icon" :class="problem.status"></span>
          </div>
          
          <div class="problem-info">
            <h3 class="problem-title">{{ problem.title }}</h3>
            <p class="problem-desc">{{ problem.description }}</p>
            
            <div class="problem-meta">
              <span class="difficulty-tag" :class="problem.difficulty">
                {{ t(`problems.${problem.difficulty}`) }}
              </span>
              <span class="success-rate">
                {{ t('problems.successRate', { rate: problem.successRate }) }}
              </span>
            </div>
          </div>

          <button class="solve-btn" @click="solveProblem(problem.id)">
            {{ t('problems.solve') }}
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { messages } from '../locales'
import { generateProblems, generateSolutions, generateHints } from '../services/ai'

const router = useRouter()
const route = useRoute()
const category = route.params.category
const currentLocale = ref('zh')
const searchQuery = ref('')
const difficulty = ref('')

const problems = ref([
  {
    id: 1,
    title: '两数之和',
    description: '给定一个整数数组 nums 和一个目标值 target，请你在该数组中找出和为目标值的那两个整数。',
    difficulty: 'easy',
    successRate: '44.5%',
    status: 'solved'
  },
  {
    id: 2,
    title: '最长回文子串',
    description: '给定一个字符串 s，找到 s 中最长的回文子串。',
    difficulty: 'medium',
    successRate: '32.1%',
    status: 'attempted'
  },
  {
    id: 3,
    title: '正则表达式匹配',
    description: '给你一个字符串 s 和一个字符规律 p，请你来实现一个支持 "." 和 "*" 的正则表达式匹配。',
    difficulty: 'hard',
    successRate: '28.4%',
    status: 'unsolved'
  }
])

const filteredProblems = computed(() => {
  return problems.value.filter(problem => {
    const matchesSearch = problem.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         problem.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesDifficulty = !difficulty.value || problem.difficulty === difficulty.value
    return matchesSearch && matchesDifficulty
  })
})

const goBack = () => {
  router.push('/home')
}

const solveProblem = (problemId) => {
  console.log(`Solving problem ${problemId}`)
}

const t = (key, params = {}) => {
  const keys = key.split('.')
  let result = messages[currentLocale.value]
  for (const k of keys) {
    if (!result) return key
    result = result[k]
  }
  if (typeof result === 'string') {
    return result.replace(/\{(\w+)\}/g, (_, key) => params[key] || '')
  }
  return key
}

const isGenerating = ref(false)
const generationProgress = ref(0)
const generationStatus = ref('')

const generateProblems = async () => {
  try {
    isGenerating.value = true
    generationStatus.value = t('problems.generatingProblems')
    
    const updateProgress = setInterval(() => {
      if (generationProgress.value < 90) {
        generationProgress.value += 10
      }
    }, 500)

    const newProblems = await generateProblems({
      category: category,
      count: 5,
      difficulty: difficulty.value || 'mixed',
      language: currentLocale.value
    })

    clearInterval(updateProgress)
    generationProgress.value = 100

    problems.value = [...problems.value, ...newProblems]

    showNotification(t('problems.generationSuccess'))

  } catch (error) {
    console.error('Failed to generate problems:', error)
    showNotification(t('problems.generationError'), 'error')
  } finally {
    setTimeout(() => {
      isGenerating.value = false
      generationProgress.value = 0
    }, 500)
  }
}

const generateSolutions = async () => {
  try {
    isGenerating.value = true
    generationStatus.value = t('problems.generatingSolutions')
    
    const updateProgress = setInterval(() => {
      if (generationProgress.value < 90) {
        generationProgress.value += 10
      }
    }, 500)

    const solutions = await generateSolutions({
      problems: problems.value,
      language: currentLocale.value,
      includeExplanation: true
    })

    clearInterval(updateProgress)
    generationProgress.value = 100

    problems.value = problems.value.map((problem, index) => ({
      ...problem,
      solution: solutions[index]
    }))

    showNotification(t('problems.solutionsGenerated'))

  } catch (error) {
    console.error('Failed to generate solutions:', error)
    showNotification(t('problems.generationError'), 'error')
  } finally {
    setTimeout(() => {
      isGenerating.value = false
      generationProgress.value = 0
    }, 500)
  }
}

const getHints = async (problemId) => {
  try {
    const problem = problems.value.find(p => p.id === problemId)
    const hints = await generateHints({
      problemId,
      difficulty: problem.difficulty,
      count: 3
    })
    
    problems.value = problems.value.map(p => 
      p.id === problemId ? { ...p, hints } : p
    )

  } catch (error) {
    console.error('Failed to generate hints:', error)
    showNotification(t('problems.hintsError'), 'error')
  }
}
</script>

<style scoped>
.problems-container {
  min-height: 100vh;
  background: #f5f7ff;
}

.header {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 16px 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  background: #f5f7ff;
  color: #4F6EF7;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: #e9ecff;
  transform: translateX(-4px);
}

.page-title {
  font-size: 24px;
  color: #333;
  margin: 0;
}

.filters {
  display: flex;
  gap: 16px;
}

.search-box input {
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  width: 240px;
  font-size: 14px;
}

.difficulty-filter {
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
  cursor: pointer;
}

.main-content {
  max-width: 1200px;
  margin: 32px auto;
  padding: 0 20px;
}

.problems-list {
  display: grid;
  gap: 16px;
}

.problem-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 20px;
  transition: all 0.3s ease;
}

.problem-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.status-icon {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
}

.status-icon.solved {
  background: #4CAF50;
}

.status-icon.attempted {
  background: #FF9800;
}

.status-icon.unsolved {
  background: #ddd;
}

.problem-info {
  flex: 1;
}

.problem-title {
  font-size: 18px;
  color: #333;
  margin: 0 0 8px;
}

.problem-desc {
  color: #666;
  font-size: 14px;
  margin: 0 0 12px;
}

.problem-meta {
  display: flex;
  align-items: center;
  gap: 16px;
}

.difficulty-tag {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.difficulty-tag.easy {
  background: #E8F5E9;
  color: #4CAF50;
}

.difficulty-tag.medium {
  background: #FFF3E0;
  color: #FF9800;
}

.difficulty-tag.hard {
  background: #FFEBEE;
  color: #F44336;
}

.success-rate {
  font-size: 12px;
  color: #666;
}

.solve-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  background: #4F6EF7;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.solve-btn:hover {
  background: #3D5CE5;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 16px;
  }

  .filters {
    width: 100%;
    flex-direction: column;
  }

  .search-box input {
    width: 100%;
  }

  .problem-card {
    flex-direction: column;
    text-align: center;
  }

  .problem-meta {
    justify-content: center;
  }
}

.ai-actions {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.ai-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.ai-btn.generate-problems {
  background: #4F6EF7;
  color: white;
}

.ai-btn.generate-solutions {
  background: #E8F5E9;
  color: #4CAF50;
}

.ai-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.generation-dialog {
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

.dialog-content {
  background: white;
  padding: 24px;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
}

.generation-status {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.loading-spinner {
  width: 24px;
  height: 24px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #4F6EF7;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.progress-bar {
  height: 6px;
  background: #f3f3f3;
  border-radius: 3px;
  overflow: hidden;
}

.progress {
  height: 100%;
  background: #4F6EF7;
  transition: width 0.3s ease;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style> 