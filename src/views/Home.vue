<template>
  <div class="home-container">
    <header class="header">
      <div class="header-content">
        <h1 class="logo">CodeWorld</h1>
        <div class="user-section">
          <div class="language-selector">
            <button class="lang-btn" @click="toggleLanguageMenu">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52 0 0014.07 6H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/>
              </svg>
              {{ currentLocale === 'en' ? 'English' : currentLocale === 'zh' ? '中文' : '日本語' }}
            </button>
            <div v-if="showLanguageMenu" class="language-menu">
              <button 
                v-for="(lang, name) in languages" 
                :key="lang"
                @click="changeLanguage(lang)"
                :class="{ active: currentLocale === lang }"
              >
                {{ name }}
              </button>
            </div>
          </div>
          <button class="user-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3s-3-1.34-3-3s1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22c.03-1.99 4-3.08 6-3.08c1.99 0 5.97 1.09 6 3.08c-1.29 1.94-3.5 3.22-6 3.22z"/>
            </svg>
            <span>User Name</span>
          </button>
          <button class="logout-btn" @click="logout">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path fill="currentColor" d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
            </svg>
            <span>{{ t('nav.logout') }}</span>
          </button>
        </div>
      </div>
    </header>

    <main class="main-content animate-in">
      <h2 class="welcome-text">{{ t('home.welcome') }}</h2>
      <p class="subtitle">{{ t('home.subtitle') }}</p>

      <button class="ai-assistant-btn" @click="showChat = true">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6s6-2.69 6-6s-2.69-6-6-6zm0 9c-1.66 0-3-1.34-3-3s1.34-3 3-3s3 1.34 3 3s-1.34 3-3 3z"/>
        </svg>
        <span>{{ t('ai.button') }}</span>
      </button>

      <div v-if="showChat" class="chat-modal">
        <div class="chat-modal-content">
          <div class="chat-modal-header">
            <h3>{{ t('ai.title') }}</h3>
            <button class="close-btn" @click="showChat = false">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path fill="currentColor" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41z"/>
              </svg>
            </button>
          </div>
          <AIChatBox :currentLocale="currentLocale" />
        </div>
      </div>

      <div class="categories-grid">
        <div v-for="(category, key) in categories" 
             :key="key" 
             class="category-card" 
             @click="goToSection(key)">
          <div class="card-icon" v-html="category.icon.template"></div>
          <h3>{{ t(`home.categories.${key}.title`) }}</h3>
          <p>{{ t(`home.categories.${key}.desc`) }}</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { messages } from '../locales'
import AIChatBox from '../components/AIChatBox.vue'

const router = useRouter()
const currentLocale = ref('en')
const showLanguageMenu = ref(false)
const showChat = ref(false)

// 定义所有类别及其图标
const categories = {
  algorithms: {
    icon: {
      template: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
        <path fill="#4F6EF7" d="M20.5 11H19V7c0-1.1-.9-2-2-2h-4V3.5C13 2.12 11.88 1 10.5 1S8 2.12 8 3.5V5H4c-1.1 0-1.99.9-1.99 2v3.8H3.5c1.49 0 2.7 1.21 2.7 2.7s-1.21 2.7-2.7 2.7H2V20c0 1.1.9 2 2 2h3.8v-1.5c0-1.49 1.21-2.7 2.7-2.7s2.7 1.21 2.7 2.7V22H17c1.1 0 2-.9 2-2v-4h1.5c1.38 0 2.5-1.12 2.5-2.5S21.88 11 20.5 11z"/>
      </svg>`
    }
  },
  database: {
    icon: {
      template: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
        <path fill="#00BCD4" d="M12 3C7.58 3 4 4.79 4 7s3.58 4 8 4s8-1.79 8-4s-3.58-4-8-4M4 9v3c0 2.21 3.58 4 8 4s8-1.79 8-4V9c0 2.21-3.58 4-8 4s-8-1.79-8-4m0 5v3c0 2.21 3.58 4 8 4s8-1.79 8-4v-3c0 2.21-3.58 4-8 4s-8-1.79-8-4z"/>
      </svg>`
    }
  },
  network: {
    icon: {
      template: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
        <path fill="#FF5722" d="M15 20c0 .55-.45 1-1 1s-1-.45-1-1v-3h-4v3c0 .55-.45 1-1 1s-1-.45-1-1v-3H6c-.55 0-1-.45-1-1V8c0-.55.45-1 1-1h12c.55 0 1 .45 1 1v8c0 .55-.45 1-1 1h-1v3c0 .55-.45 1-1 1s-1-.45-1-1v-3h-4v3zm-7-5h8V9H8v6z"/>
      </svg>`
    }
  },
  os: {
    icon: {
      template: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
        <path fill="#4CAF50" d="M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7v2H8v2h8v-2h-2v-2h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H3V4h18v12z"/>
      </svg>`
    }
  },
  frontend: {
    icon: {
      template: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
        <path fill="#FF9800" d="M12 18.178l-4.62-1.256-.328-3.544h2.27l.158 1.844 2.52.667 2.52-.667.26-2.866H6.96l-.635-6.678h11.35l-.227 2.21H8.822l.204 2.256h8.217l-.624 6.778L12 18.178z"/>
      </svg>`
    }
  },
  backend: {
    icon: {
      template: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
        <path fill="#607D8B" d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
      </svg>`
    }
  },
  security: {
    icon: {
      template: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
        <path fill="#F44336" d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12c5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
      </svg>`
    }
  },
  ai: {
    icon: {
      template: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
        <path fill="#9C27B0" d="M21 10.5h-1.5v-2c0-.83-.67-1.5-1.5-1.5h-2V5.5c0-1.1-.9-2-2-2h-2c-1.1 0-2 .9-2 2v1.5h-2c-.83 0-1.5.67-1.5 1.5v2H5c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2h1.5v2c0 .83.67 1.5 1.5 1.5h2v1.5c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2v-1.5h2c.83 0 1.5-.67 1.5-1.5v-2H21c1.1 0 2-.9 2-2v-2c0-1.1-.9-2-2-2z"/>
      </svg>`
    }
  },
  cloud: {
    icon: {
      template: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
        <path fill="#03A9F4" d="M19.35 10.04C18.67 6.59 15.64 4 12 4C9.11 4 6.6 5.64 5.35 8.04C2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5c0-2.64-2.05-4.78-4.65-4.96z"/>
      </svg>`
    }
  },
  mobile: {
    icon: {
      template: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
        <path fill="#4CAF50" d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/>
      </svg>`
    }
  },
  architecture: {
    icon: {
      template: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
        <path fill="#795548" d="M22 9V7h-2V5c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-2h2v-2h-2v-2h2v-2h-2V9h2zm-4 10H4V5h14v14zM6 13h5v4H6zm6-6h4v3h-4zM6 7h5v5H6zm6 4h4v6h-4z"/>
      </svg>`
    }
  },
  testing: {
    icon: {
      template: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
        <path fill="#8BC34A" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l4.59-4.58L18 11l-6 6z"/>
      </svg>`
    }
  }
}

// 语言相关函数
const toggleLanguageMenu = () => {
  showLanguageMenu.value = !showLanguageMenu.value
}

const changeLanguage = (lang) => {
  currentLocale.value = lang
  showLanguageMenu.value = false
}

const t = (key) => {
  const keys = key.split('.')
  let result = messages[currentLocale.value]
  for (const k of keys) {
    result = result[k]
  }
  return result
}

const logout = () => {
  router.push('/login')
}

const goToSection = (section) => {
  router.push(`/problems/${section}`)
}

const languages = {
  'English': 'en',
  '中文': 'zh',
  '日本語': 'ja'
}
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7ff 0%, #e9ecff 100%);
}

.header {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 16px 0;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 24px;
  font-weight: bold;
  color: #4F6EF7;
}

.user-section {
  display: flex;
  gap: 16px;
  align-items: center;
}

.user-btn, .logout-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: transparent;
  color: #666;
}

.user-btn:hover, .logout-btn:hover {
  background: #f5f5f5;
  color: #4F6EF7;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.welcome-text {
  font-size: 36px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 16px;
  color: #333;
}

.subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 48px;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  padding: 20px 0;
}

.category-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
}

.category-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(79, 110, 247, 0.15);
  border-color: #4F6EF7;
}

.card-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 16px;
  background: #f5f7ff;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.category-card:hover .card-icon {
  background: #4F6EF7;
}

.category-card:hover .card-icon svg path {
  fill: white;
}

.category-card h3 {
  font-size: 20px;
  margin-bottom: 8px;
  color: #333;
}

.category-card p {
  color: #666;
  font-size: 14px;
  line-height: 1.5;
}

.animate-in {
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (min-width: 1200px) {
  .categories-grid {
    grid-template-columns: repeat(4, 1fr); /* 在大屏幕上显示4列 */
  }
}

@media (min-width: 768px) and (max-width: 1199px) {
  .categories-grid {
    grid-template-columns: repeat(3, 1fr); /* 在中等屏幕上显示3列 */
  }
}

@media (min-width: 576px) and (max-width: 767px) {
  .categories-grid {
    grid-template-columns: repeat(2, 1fr); /* 在小屏幕上显示2列 */
  }
}

@media (max-width: 575px) {
  .categories-grid {
    grid-template-columns: 1fr; /* 在超小屏幕上显示1列 */
  }
}

@media (max-width: 768px) {
  .welcome-text {
    font-size: 28px;
  }

  .header-content {
    flex-direction: column;
    gap: 16px;
  }

  .user-section {
    width: 100%;
    justify-content: center;
  }
}

/* 添加语言选择器样式 */
.language-selector {
  position: relative;
}

.lang-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: transparent;
  color: #666;
}

.lang-btn:hover {
  background: #f5f5f5;
  color: #4F6EF7;
}

.language-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  z-index: 1000;
  min-width: 120px;
}

.language-menu button {
  display: block;
  width: 100%;
  padding: 12px 24px;
  border: none;
  background: transparent;
  cursor: pointer;
  text-align: left;
  transition: all 0.3s ease;
  font-size: 14px;
}

.language-menu button:hover {
  background: #f5f5f5;
}

.language-menu button.active {
  color: #4F6EF7;
  background: #f5f7ff;
}

.ai-assistant-btn {
  position: fixed;
  right: 30px;
  bottom: 30px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: #4F6EF7;
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(79, 110, 247, 0.2);
  transition: all 0.3s ease;
  z-index: 100;
}

.ai-assistant-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(79, 110, 247, 0.3);
}

.ai-assistant-btn svg {
  width: 24px;
  height: 24px;
}

.chat-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.chat-modal-content {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 800px;
  height: 80vh;
  display: flex;
  flex-direction: column;
  animation: slideUp 0.3s ease;
}

.chat-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #eee;
}

.chat-modal-header h3 {
  margin: 0;
  font-size: 20px;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: #666;
  transition: all 0.3s ease;
}

.close-btn:hover {
  color: #333;
  transform: rotate(90deg);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
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

/* 修改 AIChatBox 容器样式 */
:deep(.chat-box) {
  height: calc(80vh - 70px);
  border-radius: 0 0 16px 16px;
  box-shadow: none;
}
</style>