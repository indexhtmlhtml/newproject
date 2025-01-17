import { defineStore } from 'pinia'

export const useProblemsStore = defineStore({
  id: 'problems',
  state: () => ({
    currentProblem: null,
    problemsByCategory: {}
  }),
  
  actions: {
    setCurrentProblem(problem) {
      if (!problem || !problem.id) {
        console.error('Invalid problem data:', problem)
        return
      }
      this.currentProblem = problem
    },
    
    getCurrentProblem() {
      return this.currentProblem
    },

    getProblemsByCategory(category) {
      if (!category) {
        console.error('Category is required')
        return []
      }
      return this.problemsByCategory[category] || []
    },

    addProblems(category, problems) {
      if (!category || !Array.isArray(problems)) {
        console.error('Invalid parameters:', { category, problems })
        return
      }
      if (!this.problemsByCategory[category]) {
        this.problemsByCategory[category] = []
      }
      this.problemsByCategory[category] = [
        ...this.problemsByCategory[category],
        ...problems.map(p => ({
          id: p.id || p.problemId || Date.now().toString(),
          ...p
        }))
      ]
    },

    deleteProblem(category, problemId) {
      if (this.problemsByCategory[category]) {
        this.problemsByCategory[category] = this.problemsByCategory[category]
          .filter(p => p.id !== problemId)
      }
    }
  },

  getters: {
    currentProblemDetails: (state) => state.currentProblem,
    totalProblemsCount: (state) => {
      return Object.values(state.problemsByCategory)
        .reduce((total, problems) => total + problems.length, 0)
    }
  }
}) 