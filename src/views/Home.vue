<template>
  <div class="home-container">
    <header class="header">
      <div class="header-content">
        <h1 class="logo">CodeWorld</h1>
        <div class="user-section">
          <button class="nav-btn analysis-btn" @click="router.push('/analysis')">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path fill="#666" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 10h2v7H7zm4-3h2v10h-2zm4 6h2v4h-2z"/>
            </svg>
            <span>{{ t('analysis.title') }}</span>
          </button>
          <button class="nav-btn interview-btn" @click="router.push('/interview')">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path fill="currentColor" d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
            </svg>
            <span>{{ t('interview.title') }}</span>
            <span class="hot-tag">HOT</span>
          </button>
          <div class="language-selector">
            <button class="lang-btn" @click="toggleLanguageMenu">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52 0 0014.07 6H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/>
              </svg>
              {{ Object.entries(languages).find(([_, code]) => code === languageStore.currentLanguage)?.[0] || '中文' }}
            </button>
            <transition 
              name="menu" 
              @before-enter="beforeEnter"
              @enter="enter"
              @leave="leave"
              @after-leave="afterLeave"
            >
              <div v-if="showLanguageMenu" class="language-menu">
                <button 
                  v-for="(lang, name) in languages" 
                  :key="lang"
                  @click="changeLanguage(lang)"
                  :class="{ active: languageStore.currentLanguage === lang }"
                  :style="{ '--delay': `${index * 0.05}s` }"
                >
                  {{ name }}
                </button>
              </div>
            </transition>
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

      <div class="special-features">
        <div class="feature-card" @click="router.push('/create-paper')">
          <div class="feature-icon">
            <div class="icon-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                <path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/>
                <path fill="currentColor" d="M11 7h2v10h-2zm-4 4h10v2H7z"/>
              </svg>
            </div>
          </div>
          <div class="feature-content">
            <h3>{{ t('paper.createPaper') }}</h3>
            <p>{{ t('paper.createPaperDesc') }}</p>
            <div class="feature-meta">
              <span class="meta-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8s8 3.58 8 8s-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                </svg>
                2-5 分钟
              </span>
              <span class="meta-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6C7.8 12.16 7 10.63 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z"/>
                </svg>
                AI 生成
              </span>
            </div>
          </div>
        </div>
      </div>

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
          <div class="chat-modal-body">
            <AIChatBox />
          </div>
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

      <section class="analysis-section">
        <ScoreAnalysis />
      </section>

      <!-- 添加面试官选择区域 -->
      <div class="interview-section">
        <h2 class="section-title">AI 模拟面试</h2>
        <div class="interviewer-grid">
          <div v-for="interviewer in interviewers" 
               :key="interviewer.id" 
               class="interviewer-card"
               @click="startInterview(interviewer)">
            <div class="interviewer-avatar">
              <img :src="interviewer.avatar" :alt="interviewer.name">
              <div class="online-status" :class="{ active: interviewer.online }"></div>
            </div>
            <div class="interviewer-info">
              <h3 class="interviewer-name">{{ interviewer.name }}</h3>
              <p class="interviewer-title">{{ interviewer.title }}</p>
              <p class="interviewer-company">{{ interviewer.company }}</p>
              <div class="interviewer-tags">
                <span v-for="tag in interviewer.tags" 
                      :key="tag" 
                      class="tag">{{ tag }}</span>
              </div>
            </div>
            <button class="start-btn">开始面试</button>
          </div>
        </div>
      </div>

      <!-- 原有的试卷生成部分 -->
      <div class="paper-section">
        <!-- ... 保持原有内容不变 ... -->
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { messages } from '../locales'
import AIChatBox from '../components/AIChatBox.vue'
import { useLanguageStore } from '../stores/language'
import { useI18n } from 'vue-i18n'
import ScoreAnalysis from '../components/ScoreAnalysis.vue'

const router = useRouter()
const languageStore = useLanguageStore()
const { t } = useI18n()
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
  document.body.classList.add('language-transition')
  languageStore.setLanguage(lang)
  showLanguageMenu.value = false
  setTimeout(() => {
    document.body.classList.remove('language-transition')
  }, 400)
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

const beforeEnter = (el) => {
  el.style.transformOrigin = 'top right'
  el.style.transform = 'scale(0.95) translateY(-10px)'
  el.style.opacity = '0'
  el.style.filter = 'blur(4px)'
}

const enter = (el, done) => {
  el.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  requestAnimationFrame(() => {
    el.style.transform = 'scale(1) translateY(0)'
    el.style.opacity = '1'
    el.style.filter = 'blur(0)'
  })
}

const leave = (el, done) => {
  el.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  el.style.transform = 'scale(0.95) translateY(-10px)'
  el.style.opacity = '0'
  el.style.filter = 'blur(4px)'
  setTimeout(done, 300)
}

const afterLeave = (el) => {
  el.style.transform = ''
  el.style.opacity = ''
  el.style.filter = ''
}

// 面试官数据
const interviewers = ref([
  {
    id: '7456723652143398963', // Coze BOT ID
    name: 'James Chen',
    title: 'Java技术专家',
    company: 'ByteDance',
    avatar: '/images/interviewers/java.png',
    online: true,
    tags: ['Java', 'Spring Boot', '分布式系统'],
    type: 'coze',
    description: '8年Java开发经验，专注于分布式系统和高并发架构设计'
  },
  {
    id: 'frontend-1',
    name: 'Sarah Zhang',
    title: '前端架构师',
    company: 'Alibaba',
    avatar: '/images/interviewers/frontend.png',
    online: true,
    tags: ['Vue', 'React', '前端工程化'],
    type: 'gpt',
    description: '6年前端开发经验，精通现代前端框架和工程化实践'
  }
])

// 开始面试
const startInterview = (interviewer) => {
  // 存储当前面试官信息
  localStorage.setItem('currentInterviewer', JSON.stringify(interviewer))
  
  // 跳转到面试页面
  router.push({
    path: '/interview',
    query: {
      id: interviewer.id,
      type: interviewer.type
    }
  })
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
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 8px;
  margin-top: 8px;
  z-index: 1000;
  backdrop-filter: blur(8px);
  background: rgba(255, 255, 255, 0.95);
}

.menu-enter-active,
.menu-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.menu-enter-from,
.menu-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.language-menu button {
  display: block;
  width: 100%;
  padding: 8px 16px;
  text-align: left;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: left;
  opacity: 0;
  transform: translateY(10px);
  animation: slideIn 0.3s ease forwards;
  animation-delay: var(--delay);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.language-menu button:hover {
  background: #f5f7ff;
  transform: translateX(5px) scale(1.02);
  box-shadow: 0 2px 8px rgba(79, 110, 247, 0.1);
}

.language-menu button.active {
  color: #4F6EF7;
  background: #f0f2ff;
  font-weight: 500;
  position: relative;
}

.language-menu button.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: #4F6EF7;
  transform: scaleY(0);
  transition: transform 0.2s ease;
}

.language-menu button.active:hover::before {
  transform: scaleY(1);
}

/* 语言按钮动画 */
.lang-btn {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.lang-btn:hover {
  background: rgba(79, 110, 247, 0.1);
  transform: translateY(-1px);
}

.lang-btn:active {
  transform: translateY(0);
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
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.chat-modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 800px;
  height: 80vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-modal-header {
  padding: 16px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-modal-body {
  flex: 1;
  overflow: hidden;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: #666;
  transition: color 0.3s;
}

.close-btn:hover {
  color: #4F6EF7;
}

.special-features {
  margin-bottom: 32px;
  padding: 0 20px;
}

.feature-card {
  background: linear-gradient(135deg, #4F6EF7 0%, #3D5CE5 100%);
  color: white;
  padding: 24px;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 24px;
  max-width: 600px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(79, 110, 247, 0.2);
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at top right, rgba(255,255,255,0.1) 0%, transparent 60%);
}

.feature-icon {
  position: relative;
  z-index: 1;
}

.icon-wrapper {
  background: rgba(255, 255, 255, 0.2);
  padding: 16px;
  border-radius: 12px;
  backdrop-filter: blur(8px);
  transition: all 0.3s ease;
}

.feature-card:hover .icon-wrapper {
  transform: scale(1.1);
  background: rgba(255, 255, 255, 0.3);
}

.feature-content {
  position: relative;
  z-index: 1;
  flex: 1;
}

.feature-content h3 {
  margin: 0 0 8px;
  font-size: 24px;
  font-weight: 600;
}

.feature-content p {
  margin: 0;
  opacity: 0.8;
  font-size: 16px;
  line-height: 1.5;
}

.feature-meta {
  display: flex;
  gap: 16px;
  margin-top: 16px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  opacity: 0.8;
}

.meta-item svg {
  opacity: 0.9;
}

@media (max-width: 640px) {
  .feature-card {
    flex-direction: column;
    text-align: center;
    padding: 32px 20px;
  }

  .feature-meta {
    justify-content: center;
  }
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  height: 64px;
}

.nav-btn {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: #4F6EF7;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-btn:hover {
  background: rgba(79, 110, 247, 0.1);
}

.interview-btn {
  margin-right: 16px;
}

.interview-btn svg {
  width: 20px;
  height: 20px;
}

.user-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.hot-tag {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ff4d4f;
  color: white;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 12px;
  font-weight: bold;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(255, 77, 79, 0.7);
  }
  70% {
    transform: scale(1.1);
    box-shadow: 0 0 0 10px rgba(255, 77, 79, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(255, 77, 79, 0);
  }
}

/* 添加全局语言切换过渡效果 */
:global(.language-transition) * {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.analysis-section {
  max-width: 1200px;
  margin: 32px auto;
  padding: 0 20px;
}

/* 添加成绩分析按钮样式 */
.analysis-btn {
  color: #666;
  display: flex;
  align-items: center;
  gap: 8px;
}

.analysis-btn svg {
  width: 20px;
  height: 20px;
}

.analysis-btn:hover {
  color: #4F6EF7;
  background: rgba(79, 110, 247, 0.1);
}

.analysis-btn:hover svg path {
  fill: #4F6EF7;
}

/* 添加面试官相关样式 */
.interview-section {
  padding: 24px;
  margin-bottom: 32px;
}

.section-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 24px;
  color: #333;
}

.interviewer-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.interviewer-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
}

.interviewer-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
}

.interviewer-avatar {
  position: relative;
  width: 80px;
  height: 80px;
  margin-bottom: 16px;
}

.interviewer-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.online-status {
  position: absolute;
  bottom: 4px;
  right: 4px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #ddd;
  border: 2px solid white;
}

.online-status.active {
  background: #22c55e;
}

.interviewer-info {
  margin-bottom: 16px;
}

.interviewer-name {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.interviewer-title {
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
}

.interviewer-company {
  font-size: 14px;
  color: #888;
  margin-bottom: 12px;
}

.interviewer-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.tag {
  padding: 4px 12px;
  background: #f0f5ff;
  color: #4F6EF7;
  border-radius: 16px;
  font-size: 12px;
}

.start-btn {
  width: 100%;
  padding: 12px;
  background: #4F6EF7;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.start-btn:hover {
  background: #3D5CE5;
}

@media (max-width: 768px) {
  .interviewer-grid {
    grid-template-columns: 1fr;
  }
}
</style>