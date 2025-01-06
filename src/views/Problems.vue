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
          <div class="category-info">
            <h1 class="category-title">{{ t(`home.categories.${category}.title`) }}</h1>
            <p class="category-desc">{{ t(`home.categories.${category}.desc`) }}</p>
          </div>
        </div>

        <div class="right-section">
          <div class="search-box">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
              <path fill="currentColor" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
            <input 
              type="text" 
              v-model="searchQuery" 
              :placeholder="t('problems.searchPlaceholder')"
            >
          </div>

          <select v-model="difficulty" class="difficulty-select">
            <option value="">{{ t('problems.allDifficulties') }}</option>
            <option value="easy">{{ t('problems.easy') }}</option>
            <option value="medium">{{ t('problems.medium') }}</option>
            <option value="hard">{{ t('problems.hard') }}</option>
          </select>

          <button class="generate-btn" @click="showGenerateModal = true">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
              <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            {{ t('problems.batchGenerate') }}
          </button>
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

    <!-- 批量生成模态框 -->
    <div v-if="showGenerateModal" class="modal-overlay" @click="showGenerateModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>{{ t('problems.batchGenerate') }}</h2>
          <button class="close-btn" @click="showGenerateModal = false">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path fill="currentColor" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41z"/>
            </svg>
          </button>
        </div>

        <div class="form-group">
          <label class="form-label">{{ t('problems.count') }}</label>
          <input 
            type="number" 
            v-model="generateConfig.count" 
            min="1" 
            max="10"
            class="form-input"
          >
        </div>

        <div class="form-group">
          <label class="form-label">{{ t('problems.difficulty') }}</label>
          <select 
            v-model="generateConfig.difficulty"
            class="form-select"
          >
            <option value="random">{{ t('problems.random') }}</option>
            <option value="easy">{{ t('problems.easy') }}</option>
            <option value="medium">{{ t('problems.medium') }}</option>
            <option value="hard">{{ t('problems.hard') }}</option>
          </select>
        </div>

        <div class="modal-actions">
          <button 
            class="cancel-btn" 
            @click="showGenerateModal = false"
          >
            {{ t('common.cancel') }}
          </button>
          <button 
            class="confirm-btn" 
            @click="handleGenerateProblems"
            :disabled="isGenerating"
          >
            <span v-if="!isGenerating">{{ t('problems.batchGenerate') }}</span>
            <span v-else class="loading-spinner"></span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useProblemsStore } from '../stores/problems'
import { generateProblems } from '../services/problems'

const router = useRouter()
const route = useRoute()
const { t } = useI18n()
const problemsStore = useProblemsStore()

const category = route.params.category
const problems = ref(problemsStore.getProblemsByCategory(category))
const searchQuery = ref('')
const difficulty = ref('')

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

const showGenerateModal = ref(false)
const generateConfig = ref({
  count: 5,
  difficulty: 'random'
})
const isGenerating = ref(false)

const handleGenerateProblems = async () => {
  try {
    isGenerating.value = true
    const result = await generateProblems({
      category,
      count: generateConfig.value.count,
      difficulty: generateConfig.value.difficulty
    })
    
    problemsStore.addProblems(category, result.problems)
    problems.value = problemsStore.getProblemsByCategory(category)
    
    showGenerateModal.value = false
  } catch (error) {
    console.error('Generate problems failed:', error)
  } finally {
    isGenerating.value = false
  }
}

const deleteProblem = (problemId) => {
  if (confirm(t('problems.confirmDelete'))) {
    problemsStore.deleteProblem(category, problemId)
    problems.value = problemsStore.getProblemsByCategory(category)
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
  border-bottom: 1px solid #eee;
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 16px 0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
}

.left-section {
  display: flex;
  align-items: center;
  gap: 20px;
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
  font-weight: 500;
}

.back-btn:hover {
  background: #e9ecff;
  transform: translateX(-4px);
}

.category-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.category-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.category-desc {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.right-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f5f5f5;
  border-radius: 8px;
  padding: 8px 16px;
  width: 300px;
  transition: all 0.3s ease;
}

.search-box:focus-within {
  background: white;
  box-shadow: 0 0 0 2px #4F6EF7;
}

.search-box svg {
  color: #666;
}

.search-box input {
  border: none;
  background: transparent;
  outline: none;
  font-size: 14px;
  width: 100%;
}

.difficulty-select {
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  font-size: 14px;
  color: #333;
  transition: all 0.3s ease;
}

.difficulty-select:hover {
  border-color: #4F6EF7;
}

.difficulty-select:focus {
  border-color: #4F6EF7;
  box-shadow: 0 0 0 2px rgba(79, 110, 247, 0.2);
  outline: none;
}

.generate-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #4F6EF7;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  font-weight: 500;
}

.generate-btn:hover {
  background: #3D5CE5;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(79, 110, 247, 0.2);
}

@media (max-width: 1024px) {
  .header-content {
    flex-direction: column;
    gap: 16px;
  }
  
  .right-section {
    width: 100%;
    flex-wrap: wrap;
  }
  
  .search-box {
    width: 100%;
  }
}

@media (max-width: 640px) {
  .header {
    padding: 12px 0;
  }
  
  .header-content {
    padding: 0 16px;
  }
  
  .left-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .right-section {
    gap: 12px;
  }
  
  .difficulty-select,
  .generate-btn {
    width: 100%;
  }
  
  .generate-btn {
    justify-content: center;
  }
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

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 24px;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  animation: slideUp 0.3s ease;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.modal-header h2 {
  margin: 0;
  font-size: 20px;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: #666;
  transition: all 0.3s ease;
}

.close-btn:hover {
  color: #333;
  transform: rotate(90deg);
}

.form-group {
  margin: 16px 0;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #666;
}

.form-input,
.form-select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.form-input:focus,
.form-select:focus {
  border-color: #4F6EF7;
  box-shadow: 0 0 0 2px rgba(79, 110, 247, 0.2);
  outline: none;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 24px;
}

.cancel-btn,
.confirm-btn {
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.cancel-btn {
  background: white;
  border: 1px solid #ddd;
}

.confirm-btn {
  background: #4F6EF7;
  color: white;
  border: none;
}

.confirm-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.delete-btn {
  padding: 4px;
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  opacity: 0.6;
  transition: all 0.3s ease;
}

.delete-btn:hover {
  opacity: 1;
  color: #dc3545;
}
</style> 