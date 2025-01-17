// 获取问题统计数据
export const getProblemStats = async (problemId) => {
  try {
    // 实际项目中这里应该调用后端 API
    return {
      totalSubmissions: 125,
      acceptedSubmissions: 98,
      acceptanceRate: 78.4
    }
  } catch (error) {
    console.error('Failed to get problem stats:', error)
    throw error
  }
}

// 获取提交历史
export const getSubmissions = async (problemId) => {
  try {
    // 模拟数据
    return [
      {
        id: 1,
        timestamp: Date.now() - 3600000,
        status: 'Accepted',
        runtime: 56,
        memory: 8.2
      },
      {
        id: 2,
        timestamp: Date.now() - 7200000,
        status: 'Wrong Answer',
        runtime: 48,
        memory: 7.8
      },
      {
        id: 3,
        timestamp: Date.now() - 86400000,
        status: 'Accepted',
        runtime: 52,
        memory: 8.0
      },
      {
        id: 4,
        timestamp: Date.now() - 172800000,
        status: 'Time Limit Exceeded',
        runtime: 120,
        memory: 9.1
      }
    ]
  } catch (error) {
    console.error('Failed to get submissions:', error)
    throw error
  }
}
