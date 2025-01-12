<template>
  <div class="score-analysis">
    <div class="analysis-header">
      <h2>{{ t('analysis.title') }}</h2>
      <div class="time-filter">
        <select v-model="timeRange">
          <option value="week">{{ t('analysis.lastWeek') }}</option>
          <option value="month">{{ t('analysis.lastMonth') }}</option>
          <option value="year">{{ t('analysis.lastYear') }}</option>
        </select>
      </div>
    </div>

    <div class="analysis-content">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-title">{{ t('analysis.totalProblems') }}</div>
          <div class="stat-value">{{ stats.totalProblems }}</div>
          <div class="stat-trend" :class="stats.problemsTrend > 0 ? 'up' : 'down'">
            {{ stats.problemsTrend }}%
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-title">{{ t('analysis.averageScore') }}</div>
          <div class="stat-value">{{ stats.averageScore }}</div>
          <div class="stat-trend" :class="stats.scoreTrend > 0 ? 'up' : 'down'">
            {{ stats.scoreTrend }}%
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-title">{{ t('analysis.successRate') }}</div>
          <div class="stat-value">{{ stats.successRate }}%</div>
          <div class="stat-trend" :class="stats.successTrend > 0 ? 'up' : 'down'">
            {{ stats.successTrend }}%
          </div>
        </div>
      </div>

      <div class="chart-container">
        <h3>{{ t('analysis.progressChart') }}</h3>
        <!-- 这里可以使用图表库如 Chart.js 或 ECharts -->
        <div class="chart-placeholder">
          <!-- 图表将在这里渲染 -->
        </div>
      </div>

      <div class="category-analysis">
        <h3>{{ t('analysis.categoryPerformance') }}</h3>
        <div class="category-grid">
          <div v-for="category in categoryStats" 
               :key="category.name" 
               class="category-card">
            <div class="category-name">{{ t(`home.categories.${category.name}.title`) }}</div>
            <div class="category-score">{{ category.score }}</div>
            <div class="progress-bar">
              <div class="progress" :style="{ width: category.progress + '%' }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const timeRange = ref('week')

// 模拟数据
const stats = ref({
  totalProblems: 156,
  problemsTrend: 12,
  averageScore: 85,
  scoreTrend: 5,
  successRate: 78,
  successTrend: -2
})

const categoryStats = ref([
  { name: 'algorithms', score: 85, progress: 85 },
  { name: 'database', score: 92, progress: 92 },
  { name: 'network', score: 78, progress: 78 },
  { name: 'frontend', score: 88, progress: 88 },
  { name: 'backend', score: 75, progress: 75 },
  { name: 'security', score: 82, progress: 82 }
])

onMounted(() => {
  // 这里可以添加获取实际数据的逻辑
})
</script>

<style scoped>
.score-analysis {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.analysis-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.time-filter select {
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.stat-card {
  background: #f5f7ff;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
}

.stat-title {
  color: #666;
  font-size: 14px;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
}

.stat-trend {
  font-size: 14px;
  padding: 4px 8px;
  border-radius: 12px;
  display: inline-block;
}

.stat-trend.up {
  background: #e6fff0;
  color: #00bd7e;
}

.stat-trend.down {
  background: #ffe6e6;
  color: #ff4d4f;
}

.chart-container {
  margin-bottom: 32px;
}

.chart-placeholder {
  height: 300px;
  background: #f5f7ff;
  border-radius: 12px;
  margin-top: 16px;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 16px;
}

.category-card {
  background: #f5f7ff;
  padding: 16px;
  border-radius: 12px;
}

.category-name {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.category-score {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
}

.progress-bar {
  height: 6px;
  background: #e0e0e0;
  border-radius: 3px;
  overflow: hidden;
}

.progress {
  height: 100%;
  background: var(--vt-c-primary);
  border-radius: 3px;
  transition: width 0.3s ease;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .category-grid {
    grid-template-columns: 1fr;
  }
}
</style> 