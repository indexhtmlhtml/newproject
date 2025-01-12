<template>
  <div class="analysis-page">
    <header class="header">
      <div class="header-content">
        <button class="back-btn" @click="router.back()">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
          {{ t('common.back') }}
        </button>
        <h1>{{ t('analysis.title') }}</h1>
      </div>
    </header>

    <main class="main-content">
      <ScoreAnalysis />
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import ScoreAnalysis from '../components/ScoreAnalysis.vue'

const router = useRouter()
const { t } = useI18n()
</script>

<style scoped>
.analysis-page {
  min-height: 100vh;
  background: #f5f7ff;
}

.header {
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 16px 0;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
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
  background: transparent;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: #f5f5f5;
  color: #4F6EF7;
}

.main-content {
  max-width: 1200px;
  margin: 32px auto;
  padding: 0 20px;
}
</style> 