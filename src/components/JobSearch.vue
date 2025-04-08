<template>
  <div class="job-search">
    <div class="search-header">
      <h2>AI 智能求职</h2>
      <p class="subtitle">上传简历或描述需求，为您推荐合适的岗位</p>
    </div>

    <div class="search-form">
      <!-- 简历上传 -->
      <div class="upload-section">
        <input 
          type="file" 
          ref="fileInput"
          @change="handleFileUpload"
          accept=".pdf,.doc,.docx"
          class="hidden"
        >
        <div 
          class="upload-area"
          :class="{ 'has-file': uploadedFile }"
          @click="triggerFileUpload"
          @dragover.prevent
          @drop.prevent="handleFileDrop"
        >
          <template v-if="!uploadedFile">
            <p>点击或拖拽上传简历</p>
            <p class="upload-hint">支持 PDF、Word 格式</p>
          </template>
          <template v-else>
            <div class="file-info">
              <span class="file-name">{{ uploadedFile.name }}</span>
              <button class="remove-file" @click.stop="removeFile">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
                </svg>
              </button>
            </div>
            <p class="upload-success">简历已上传，可以开始匹配</p>
          </template>
        </div>
      </div>

      <!-- 需求描述 -->
      <div class="requirement-section">
        <textarea
          v-model="jobRequirement"
          placeholder="描述您期望的工作岗位、技能要求、工作地点等..."
          rows="4"
        ></textarea>
      </div>

      <button 
        class="search-btn" 
        @click="searchJobs" 
        :disabled="isLoading || (!uploadedFile && !jobRequirement.trim())"
      >
        {{ isLoading ? '搜索中...' : '开始匹配' }}
      </button>

      <div v-if="jobResults.length" class="results-section">
        <h3>推荐岗位</h3>
        <ul>
          <li v-for="job in jobResults" :key="job.id">
            <h4>{{ job.title }} - {{ job.company }}</h4>
            <p>{{ job.location }} | {{ job.salary }}</p>
            <button @click="applyJob(job)">申请</button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const jobRequirement = ref('')
const jobResults = ref([])
const isLoading = ref(false)
const fileInput = ref(null)
const resumeContent = ref('')
const uploadedFile = ref(null)

// 处理文件上传
const handleFileUpload = async (event) => {
  const file = event.target.files[0]
  if (file) {
    try {
      const content = await readFileContent(file)
      resumeContent.value = content
      uploadedFile.value = file
    } catch (error) {
      console.error('读取文件失败:', error)
      alert('读取简历失败，请重试')
    }
  }
}

// 处理文件拖放
const handleFileDrop = async (event) => {
  event.preventDefault()
  const file = event.dataTransfer.files[0]
  if (file) {
    try {
      const content = await readFileContent(file)
      resumeContent.value = content
      uploadedFile.value = file
    } catch (error) {
      console.error('读取文件失败:', error)
      alert('读取简历失败，请重试')
    }
  }
}

// 读取文件内容
const readFileContent = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.onerror = (e) => reject(e)
    
    if (file.type === 'application/pdf') {
      reader.readAsArrayBuffer(file)
    } else {
      reader.readAsText(file)
    }
  })
}

// 触发文件上传
const triggerFileUpload = () => {
  fileInput.value.click()
}

// 移除已上传的文件
const removeFile = () => {
  uploadedFile.value = null
  resumeContent.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// 搜索工作
const searchJobs = async () => {
  isLoading.value = true
  try {
    const response = await axios.post('http://localhost:3005/api/proxy/coze/jobs', {
      requirement: jobRequirement.value,
      resume: resumeContent.value
    })
    
    if (response.data.jobs) {
      jobResults.value = response.data.jobs
    } else {
      throw new Error('未获取到职位信息')
    }
  } catch (error) {
    console.error('搜索工作失败:', error)
    alert('搜索失败，请稍后重试')
  } finally {
    isLoading.value = false
  }
}

const applyJob = (job) => {
  alert(`已申请职位：${job.title}`)
}
</script>

<style scoped>
.job-search {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.search-header {
  text-align: center;
  margin-bottom: 40px;
}

.search-header h2 {
  font-size: 32px;
  color: var(--primary-color);
}

.subtitle {
  color: var(--vt-c-text-secondary);
  font-size: 16px;
}

.search-form {
  max-width: 800px;
  margin: 0 auto;
}

.upload-section {
  margin-bottom: 24px;
}

.hidden {
  display: none;
}

.upload-area {
  border: 2px dashed #ddd;
  border-radius: 8px;
  padding: 40px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.upload-area.has-file {
  border-color: var(--primary-color);
  background: rgba(79, 110, 247, 0.05);
}

.upload-area.dragging {
  border-color: var(--primary-color);
  background: rgba(79, 110, 247, 0.1);
}

.upload-hint {
  margin-top: 8px;
  font-size: 14px;
  color: #666;
}

.requirement-section textarea {
  width: 100%;
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  resize: vertical;
}

.search-btn {
  width: 100%;
  padding: 16px;
  margin-top: 24px;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.results-section {
  margin-top: 20px;
}

.results-section h3 {
  margin-bottom: 10px;
}

.results-section ul {
  list-style: none;
  padding: 0;
}

.results-section li {
  margin-bottom: 15px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

/* 添加文件上传进度和状态提示样式 */
.upload-status {
  margin-top: 8px;
  font-size: 14px;
  color: var(--primary-color);
}

.error-message {
  color: #f56c6c;
  font-size: 14px;
  margin-top: 8px;
}

.file-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 8px;
}

.file-name {
  font-size: 16px;
  color: var(--primary-color);
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.remove-file {
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: #666;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.remove-file:hover {
  background: rgba(0, 0, 0, 0.1);
  color: #f56c6c;
}

.upload-success {
  color: var(--primary-color);
  font-size: 14px;
  margin-top: 8px;
}

/* 禁用状态的搜索按钮样式 */
.search-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}
</style> 