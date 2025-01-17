<template>
  <div class="problem-list">
    <div v-for="problem in problems" 
         :key="problem.id" 
         class="problem-item"
         @click="goToProblem(problem.id)">
      <!-- 现有的题目展示内容 -->
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToProblem = (problemId) => {
  router.push(`/problem/${problemId}`)
}
</script> 