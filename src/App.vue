<template>
  <router-view v-slot="{ Component }">
    <transition 
      name="page" 
      @before-leave="beforeLeave"
      @enter="enter"
      @after-enter="afterEnter"
    >
      <component :is="Component" :key="locale" />
    </transition>
  </router-view>
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

// 过渡动画钩子
const beforeLeave = (el) => {
  el.style.position = 'absolute'
  el.style.width = '100%'
  el.style.zIndex = '1'
}

const enter = (el) => {
  el.style.position = 'absolute'
  el.style.width = '100%'
  el.style.zIndex = '2'
}

const afterEnter = (el) => {
  el.style.position = ''
  el.style.width = ''
  el.style.zIndex = ''
}
</script>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-enter-from {
  transform: translateY(20px);
}

.page-leave-to {
  transform: translateY(-20px);
}

/* 确保过渡期间内容不会跳动 */
#app {
  position: relative;
  min-height: 100vh;
  overflow-x: hidden;
}

/* 添加全局过渡效果 */
* {
  transition: color 0.3s ease,
             background-color 0.3s ease,
             border-color 0.3s ease,
             box-shadow 0.3s ease,
             transform 0.3s ease;
}

/* 添加页面容器样式 */
.home-container,
.login-container,
.register-container,
.problems-container,
.interview-container {
  position: absolute;
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7ff 0%, #e9ecff 100%);
}
</style>
