<template>
  <div class="login-container">
    <div class="content-wrapper animate-in">
      <div class="left-section">
        <h1 class="title">Sign In to<br>Open the World</h1>
        
        <p class="register-tip">
          If you don't have an account,<br>
          you can <a href="#" class="register-link" @click.prevent="goToRegister">Register here</a>.
        </p>
      </div>

      <div class="right-section">
        <div class="form">
          <div class="input-group">
            <input 
              type="email" 
              v-model="email" 
              placeholder="mail@mail.com" 
              class="input"
              :class="{ 'input-filled': email }"
            >
            <span class="input-highlight"></span>
          </div>
          
          <div class="input-group">
            <div class="password-wrapper">
              <input 
                :type="showPassword ? 'text' : 'password'" 
                v-model="password" 
                placeholder="Password" 
                class="input"
                :class="{ 'input-filled': password }"
              >
              <button class="toggle-password" @click="showPassword = !showPassword">
                <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5s5 2.24 5 5s-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3s3-1.34 3-3s-1.34-3-3-3z"/>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12 7c2.76 0 5 2.24 5 5c0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75c-1.73-4.39-6-7.5-11-7.5c-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28l.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5c1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22L21 20.73L3.27 3L2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65c0 1.66 1.34 3 3 3c.22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53c-2.76 0-5-2.24-5-5c0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15l.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
                </svg>
              </button>
            </div>
            <span class="input-highlight"></span>
          </div>
          <div class="recovery">
            <a href="#" class="recovery-link">Recovery password</a>
          </div>
          <button class="sign-in-btn" @click="handleLogin" :class="{ 'button-loading': isLoading }">
            <span v-if="!isLoading">Sign In</span>
            <span v-else class="loading-spinner"></span>
          </button>

          <div class="social-login">
            <p class="continue-with">or continue with</p>
            <div class="social-buttons">
              <button class="social-btn qq">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path fill="#12B7F5" d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm.5 4.5c-2.725 0-4.937 2.116-4.937 4.724 0 .77.155 1.507.435 2.18-.446.537-.713 1.155-.713 1.813 0 .558.21 1.07.56 1.506-.048.21-.074.427-.074.65 0 1.17.838 2.127 1.876 2.127.606 0 1.142-.31 1.475-.78.42.13.87.2 1.34.2.486 0 .95-.074 1.383-.21.332.47.868.78 1.474.78 1.038 0 1.876-.956 1.876-2.126 0-.223-.026-.44-.074-.65.35-.436.56-.948.56-1.506 0-.658-.267-1.276-.713-1.813.28-.673.435-1.41.435-2.18 0-2.608-2.212-4.724-4.937-4.724zm0 1c2.17 0 3.937 1.67 3.937 3.724 0 .66-.147 1.286-.412 1.854l-.2.425.29.367c.335.425.535.91.535 1.423 0 .356-.1.693-.275.987l-.244.41.098.467c.033.16.052.326.052.495 0 .62-.438 1.127-.876 1.127-.3 0-.562-.18-.722-.438l-.23-.37-.42.13c-.39.12-.807.186-1.24.186-.42 0-.824-.062-1.202-.177l-.42-.13-.23.37c-.16.258-.423.438-.722.438-.438 0-.876-.506-.876-1.127 0-.17.02-.334.052-.495l.098-.467-.244-.41c-.175-.294-.275-.63-.275-.987 0-.514.2-.998.535-1.423l.29-.367-.2-.425c-.265-.568-.412-1.195-.412-1.854 0-2.054 1.767-3.724 3.937-3.724z"/>
                </svg>
              </button>
              <button class="social-btn wechat">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path fill="#07C160" d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.49.49 0 0 1 .177-.554C23.36 18.228 24.4 16.523 24.4 14.6c0-3.37-3.217-5.701-7.462-5.742zm-2.73 2.87c.534 0 .968.44.968.982a.976.976 0 0 1-.968.983.976.976 0 0 1-.969-.983c0-.542.435-.982.969-.982zm4.844 0c.534 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.968-.983c0-.542.434-.982.968-.982z"/>
                </svg>
              </button>
              <button class="social-btn weibo">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path fill="#E6162D" d="M15.727 10.783c-.236-.104-.398-.17-.275-.615.27-.899.297-1.676.005-2.232-.55-1.045-2.055-0.988-3.775-.028 0 0-.541.236-.403-.192.265-.853.225-1.566-.187-1.977-0.93-.93-3.402.035-5.524 2.157-1.587 1.587-2.51 3.271-2.51 4.723 0 2.781 3.565 4.468 7.057 4.468 4.576 0 7.62-2.659 7.62-4.77 0-1.276-1.077-2-2.008-2.303zm-4.989 6.061c-2.784 0.275-5.187-0.984-5.367-2.812-0.181-1.828 1.933-3.533 4.717-3.808s5.187 0.984 5.367 2.812c0.181 1.828-1.933 3.533-4.717 3.808z"/>
                  <path fill="#E6162D" d="M21.727 5.269c-1.115-1.237-2.76-1.708-4.278-1.377l-0.001 0c-0.35 0.077-0.572 0.422-0.495 0.772 0.077 0.35 0.422 0.572 0.772 0.495 1.075-0.234 2.238 0.099 3.027 0.973 0.789 0.874 1.004 2.066 0.665 3.11h0c-0.11 0.34 0.077 0.706 0.417 0.816 0.339 0.11 0.706-0.077 0.816-0.417h0c0.479-1.473 0.178-3.135-0.937-4.372z"/>
                  <path fill="#E6162D" d="M19.095 7.095c-0.543-0.603-1.344-0.832-2.083-0.67-0.303 0.066-0.495 0.365-0.429 0.668 0.066 0.303 0.365 0.495 0.668 0.429v0c0.359-0.078 0.747 0.033 1.010 0.326 0.264 0.293 0.335 0.692 0.222 1.041h0c-0.095 0.294 0.067 0.611 0.361 0.706 0.294 0.095 0.611-0.067 0.706-0.361v0c0.236-0.731 0.087-1.536-0.456-2.139z"/>
                  <path fill="#E6162D" d="M10.477 14.959c-0.139 0.239-0.441 0.348-0.677 0.242-0.232-0.104-0.301-0.376-0.163-0.609 0.14-0.232 0.43-0.338 0.663-0.237 0.235 0.098 0.311 0.367 0.177 0.604zm-1.169 1.527c-0.383 0.609-1.205 0.877-1.823 0.597-0.602-0.273-0.783-0.977-0.399-1.568 0.38-0.587 1.173-0.849 1.78-0.593 0.611 0.259 0.81 0.96 0.442 1.564zm1.017-3.091c-1.883-0.493-4.015 0.445-4.833 2.116-0.837 1.711-0.028 3.611 1.887 4.228 1.975 0.635 4.302-0.338 5.121-2.182 0.809-1.814-0.253-3.671-2.176-4.162z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const isLoading = ref(false)

const handleLogin = async () => {
  isLoading.value = true
  // 模拟登录延迟
  await new Promise(resolve => setTimeout(resolve, 1500))
  isLoading.value = false
  router.push('/home')
}

const goToRegister = () => {
  router.push('/register')
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7ff 0%, #e9ecff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.content-wrapper {
  display: flex;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.left-section {
  flex: 1;
  padding: 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.right-section {
  flex: 1;
  padding: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.title {
  font-size: 48px;
  font-weight: bold;
  margin-bottom: 24px;
  line-height: 1.2;
}

.register-tip {
  color: #666;
  font-size: 16px;
  line-height: 1.5;
}

.register-link {
  color: #4F6EF7;
  text-decoration: none;
}

.form {
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.input {
  width: 100%;
  padding: 16px;
  border: 1px solid #E1E1E1;
  border-radius: 8px;
  font-size: 16px;
  background: white;
}

.password-wrapper {
  position: relative;
}

.toggle-password {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
}

.recovery {
  text-align: right;
}

.recovery-link {
  color: #666;
  text-decoration: none;
  font-size: 14px;
}

.sign-in-btn {
  background: #4F6EF7;
  color: white;
  border: none;
  padding: 16px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 8px;
}

.social-login {
  margin-top: 32px;
  text-align: center;
}

.continue-with {
  color: #666;
  margin-bottom: 16px;
}

.social-buttons {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.social-btn {
  width: 48px;
  height: 48px;
  border: 1px solid #E1E1E1;
  border-radius: 8px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.social-btn:hover {
  background: #f5f5f5;
  transform: translateY(-2px);
}

.social-btn svg {
  width: 24px;
  height: 24px;
}

.social-btn.apple {
  color: #000;
}

@media (max-width: 768px) {
  .content-wrapper {
    flex-direction: column;
    margin: 20px;
  }

  .left-section,
  .right-section {
    padding: 40px;
  }

  .title {
    font-size: 36px;
  }
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

.input-group {
  position: relative;
  width: 100%;
}

.input {
  transition: all 0.3s ease;
  border: 2px solid transparent;
  background: rgba(255, 255, 255, 0.9);
}

.input:focus {
  border-color: #4F6EF7;
  box-shadow: 0 0 0 4px rgba(79, 110, 247, 0.1);
  outline: none;
}

.input-filled {
  background: white;
  border-color: #E1E1E1;
}

.input-highlight {
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: #4F6EF7;
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.input:focus + .input-highlight {
  width: 100%;
}

.sign-in-btn {
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.sign-in-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(79, 110, 247, 0.2);
}

.sign-in-btn:active {
  transform: translateY(0);
}

.button-loading {
  color: transparent;
}

.loading-spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  margin-top: -10px;
  margin-left: -10px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.social-btn {
  transform: scale(1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.social-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.toggle-password {
  opacity: 0.6;
  transition: opacity 0.3s ease;
}

.toggle-password:hover {
  opacity: 1;
}

.register-link {
  position: relative;
  display: inline-block;
}

.register-link::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 2px;
  bottom: -2px;
  left: 0;
  background-color: #4F6EF7;
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.register-link:hover::after {
  transform: scaleX(1);
}

/* 添加一些微妙的动画延迟 */
.social-buttons button:nth-child(1) { animation-delay: 0.1s; }
.social-buttons button:nth-child(2) { animation-delay: 0.2s; }
.social-buttons button:nth-child(3) { animation-delay: 0.3s; }

.social-btn.qq:hover {
  background: #e6f7ff;
}

.social-btn.wechat:hover {
  background: #f0fff0;
}

.social-btn.weibo:hover {
  background: #fff0f0;
}
</style> 