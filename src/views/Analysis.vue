<template>
  <div class="analysis-page">
    <div class="page-header">
      <h1>成绩分析</h1>
      <p class="subtitle">查看您的面试表现和能力评估</p>
    </div>
    
    <ScoreAnalysis />
  </div>
</template>

<script setup>
import ScoreAnalysis from '../components/ScoreAnalysis.vue';
</script>

<style scoped>
.analysis-page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 24px;
}

.page-header h1 {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
}

.subtitle {
  font-size: 16px;
  color: #666;
}
</style> 