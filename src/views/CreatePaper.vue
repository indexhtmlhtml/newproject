<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { messages } from '../locales'

const router = useRouter()
const currentLocale = ref('en') // 添加当前语言设置
const selectedCategories = ref([])
const selectedDifficulty = ref('medium')
const timeLimit = ref(90)

// 添加 categories 数据
const categories = {
  algorithms: true,
  database: true,
  network: true,
  os: true,
  frontend: true,
  backend: true,
  security: true,
  ai: true,
  cloud: true,
  mobile: true,
  architecture: true,
  testing: true
}

// 添加翻译函数
const t = (key) => {
  const keys = key.split('.')
  let result = messages[currentLocale.value]
  for (const k of keys) {
    if (!result) return key
    result = result[k]
  }
  return result || key
}

const questionTypes = ref([
  { id: 'multipleChoice', count: 0, max: 10 },
  { id: 'programming', count: 0, max: 5 },
  { id: 'shortAnswer', count: 0, max: 5 },
  { id: 'analysis', count: 0, max: 3 }
])

// ... 其他代码保持不变 ...
</script>

<style scoped>
/* 添加一些样式改进 */
.header {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 16px 0;
  margin-bottom: 32px;
}

.header-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title {
  font-size: 24px;
  color: #333;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  background: #f5f7ff;
  color: #4F6EF7;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: #e9ecff;
  transform: translateX(-4px);
}

.category-checkbox input[type="checkbox"] {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 2px solid #4F6EF7;
  cursor: pointer;
}

.category-checkbox:has(input:checked) {
  background: #e9ecff;
  border: 2px solid #4F6EF7;
}

.difficulty-option input[type="radio"] {
  display: none;
}

.difficulty-option span {
  display: block;
  padding: 12px;
  border-radius: 8px;
  background: #f5f7ff;
  cursor: pointer;
  transition: all 0.3s ease;
}

.difficulty-option input[type="radio"]:checked + span {
  background: #4F6EF7;
  color: white;
}

.time-selector input[type="range"] {
  -webkit-appearance: none;
  width: 100%;
  height: 8px;
  border-radius: 4px;
  background: #f5f7ff;
  outline: none;
}

.time-selector input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #4F6EF7;
  cursor: pointer;
  transition: all 0.3s ease;
}

.time-selector input[type="range"]::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

.time-display {
  min-width: 80px;
  text-align: right;
  color: #666;
}

/* 添加响应式设计改进 */
@media (max-width: 768px) {
  .paper-config {
    margin: 20px;
  }

  .categories-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }

  .question-types {
    grid-template-columns: 1fr;
  }

  .difficulty-selector {
    flex-direction: column;
  }

  .difficulty-option {
    margin-bottom: 8px;
  }
}
</style>