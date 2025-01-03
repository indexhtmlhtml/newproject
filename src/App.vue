<template>
  <router-view></router-view>
</template>

<script setup>
import { watch } from 'vue'
import { useLanguageStore } from './stores/language'
import { useI18n } from 'vue-i18n'

const languageStore = useLanguageStore()
const { locale } = useI18n()

// 监听语言变化
watch(() => languageStore.currentLanguage, (newLang) => {
  locale.value = newLang
})
</script>
