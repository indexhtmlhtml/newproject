import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useProblemsStore = defineStore('problems', () => {
  // 从 localStorage 获取已保存的题目，如果没有则为空对象
  const problems = ref(JSON.parse(localStorage.getItem('problems')) || {})
  
  // 添加题目
  const addProblems = (category, newProblems) => {
    if (!problems.value[category]) {
      problems.value[category] = []
    }
    
    // 为每个题目生成唯一 ID
    const problemsWithIds = newProblems.map((problem, index) => ({
      ...problem,
      id: `${category}-${Date.now()}-${index}`,
      createdAt: new Date().toISOString()
    }))
    
    problems.value[category] = [
      ...problems.value[category],
      ...problemsWithIds
    ]
    
    // 保存到 localStorage
    saveToLocalStorage()
  }
  
  // 删除题目
  const deleteProblem = (category, problemId) => {
    if (problems.value[category]) {
      problems.value[category] = problems.value[category].filter(
        p => p.id !== problemId
      )
      saveToLocalStorage()
    }
  }
  
  // 获取指定分类的所有题目
  const getProblemsByCategory = (category) => {
    return problems.value[category] || []
  }
  
  // 获取单个题目
  const getProblemById = (category, id) => {
    return problems.value[category]?.find(p => p.id === id)
  }
  
  // 保存到 localStorage
  const saveToLocalStorage = () => {
    localStorage.setItem('problems', JSON.stringify(problems.value))
  }
  
  return {
    problems,
    addProblems,
    deleteProblem,
    getProblemsByCategory,
    getProblemById
  }
}) 