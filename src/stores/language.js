import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useLanguageStore = defineStore('language', () => {
  // 从 localStorage 获取初始语言，如果没有则默认为中文
  const currentLanguage = ref(localStorage.getItem('language') || 'zh')

  // 切换语言
  function setLanguage(lang) {
    currentLanguage.value = lang
    localStorage.setItem('language', lang)
  }

  return {
    currentLanguage,
    setLanguage
  }
}) 