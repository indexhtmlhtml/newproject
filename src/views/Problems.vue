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

          <div class="problem-actions">
            <button class="solve-btn" @click="solveProblem(problem.id)">
              {{ t('problems.solve') }}
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { messages } from '../locales'

const router = useRouter()
const route = useRoute()
const category = route.params.category
const currentLocale = ref('zh')
const searchQuery = ref('')
const difficulty = ref('')

// 模拟题目数据
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

const solveProblem = (id) => {
  router.push(`/problems/${route.params.category}/${id}/solve`)
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
</style> 