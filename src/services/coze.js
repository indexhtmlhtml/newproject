// 初始化聊天客户端
export const initChatClient = () => {
  if (typeof window.initCozeChat === 'function') {
    try {
      window.initCozeChat()
      return true
    } catch (error) {
      console.error('Failed to initialize Coze chat client:', error)
      return false
    }
  }
  return false
}

// 检查 SDK 是否已加载
export const checkSDKLoaded = () => {
  return new Promise((resolve, reject) => {
    if (window.CozeWebSDK) {
      resolve(true)
      return
    }

    let checkCount = 0
    const maxChecks = 20
    const interval = setInterval(() => {
      checkCount++
      if (window.CozeWebSDK) {
        clearInterval(interval)
        resolve(true)
      } else if (checkCount >= maxChecks) {
        clearInterval(interval)
        reject(new Error('SDK load timeout'))
      }
    }, 500)
  })
}

// 创建聊天会话
export const createChatSession = () => {
  if (!window.CozeWebSDK) {
    throw new Error('SDK not loaded')
  }

  return {
    sendMessage: async (message) => {
      // 消息会由 WebChatClient 自动处理
      return {
        content: message,
        timestamp: Date.now()
      }
    },
    destroy: () => {
      // WebChatClient 会自动处理清理工作
    }
  }
} 