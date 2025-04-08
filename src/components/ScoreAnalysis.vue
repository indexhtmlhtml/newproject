<template>
  <div class="score-analysis">
    <!-- 添加加载状态 -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-spinner"></div>
      <p>加载分析数据中...</p>
    </div>

    <div class="analysis-header">
      <h2>面试表现分析</h2>
      <div class="time-selector">
        <select v-model="timeRange" @change="fetchAnalysisData">
          <option value="week">最近一周</option>
          <option value="month">最近一个月</option>
          <option value="3months">最近三个月</option>
          <option value="all">所有时间</option>
        </select>
      </div>
    </div>

    <!-- 添加数据错误提示 -->
    <div v-if="hasError" class="error-message">
      <i class="fas fa-exclamation-circle"></i>
      <p>{{ errorMessage }}</p>
      <button @click="fetchAnalysisData" class="retry-btn">重试</button>
    </div>

    <!-- 总体表现卡片 -->
    <div class="overview-section" v-if="!hasError">
      <div class="overview-header">
        <h3>总体概览</h3>
        <div class="overview-tips">数据更新时间: {{ lastUpdated }}</div>
      </div>
      
      <div class="overview-cards">
        <div class="stat-card">
          <div class="stat-icon interviews-icon">
            <i class="fas fa-user-tie"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.totalInterviews || 0 }}</div>
            <div class="stat-label">总面试数</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon score-icon">
            <i class="fas fa-chart-line"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.averageScore || 0 }}%</div>
            <div class="stat-label">平均得分</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon strength-icon">
            <i class="fas fa-trophy"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.bestSkill || '无数据' }}</div>
            <div class="stat-label">最优技能</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon weakness-icon">
            <i class="fas fa-bolt"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.weakestSkill || '无数据' }}</div>
            <div class="stat-label">待提升技能</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 两列布局：雷达图和最近面试 -->
    <div class="two-column-section">
      <!-- 雷达图 -->
      <div class="chart-container">
        <h3>技能评估</h3>
        <canvas ref="skillChart" height="220"></canvas>
      </div>

      <!-- 最近面试记录 -->
      <div class="recent-interviews">
        <div class="section-header">
          <h3>最近面试</h3>
          <router-link to="/interview-history" class="view-all">查看全部</router-link>
        </div>
        
        <div v-if="recentInterviews.length > 0" class="interview-list">
          <div 
            v-for="interview in recentInterviews" 
            :key="interview.id" 
            class="interview-item"
            @click="viewInterviewDetail(interview.id)"
          >
            <div class="interview-info">
              <img :src="interview.interviewerAvatar" :alt="interview.interviewer" class="interviewer-avatar">
              <div class="interview-details">
                <div class="interview-position">{{ interview.position }}</div>
                <div class="interview-meta">
                  <span>{{ interview.interviewer }}</span>
                  <span>{{ formatDate(interview.date) }}</span>
                </div>
              </div>
            </div>
            <div class="interview-score" :class="getScoreClass(interview.score)">
              {{ interview.score }}%
            </div>
          </div>
        </div>
        
        <div v-else class="empty-state">
          <i class="fas fa-user-clock empty-icon"></i>
          <p>尚无面试记录</p>
          <router-link to="/interview" class="start-btn">开始第一次面试</router-link>
        </div>
      </div>
    </div>

    <!-- 技能详情 -->
    <div class="skills-section">
      <div class="section-header">
        <h3>技能详情</h3>
        <div class="skill-filter">
          <button 
            v-for="(category, index) in skillCategories" 
            :key="index"
            :class="['category-btn', { active: skillFilter === category.value }]"
            @click="skillFilter = category.value"
          >
            {{ category.label }}
          </button>
        </div>
      </div>
      
      <div class="skills-grid">
        <div 
          v-for="skill in filteredSkills" 
          :key="skill.id" 
          class="skill-card"
          @click="showSkillDetail(skill)"
        >
          <div class="skill-header">
            <div class="skill-name">{{ skill.name }}</div>
            <div class="skill-score" :class="getScoreClass(skill.score)">{{ skill.score }}%</div>
          </div>
          
          <div class="skill-progress">
            <div 
              class="progress-bar" 
              :style="{ width: `${skill.score}%`, backgroundColor: getScoreColor(skill.score) }"
            ></div>
          </div>
          
          <div class="skill-trend">
            <div class="trend-indicator" :class="getTrendClass(skill.trend)">
              <i :class="getTrendIcon(skill.trend)"></i>
              {{ Math.abs(skill.trend) }}%
            </div>
            <div class="question-count">{{ skill.questionCount }} 题</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 学习计划建议 -->
    <div class="learning-plan">
      <div class="section-header">
        <h3>学习计划建议</h3>
        <button @click="generateLearningPlan" class="generate-btn">
          <i class="fas fa-sync-alt"></i> 生成计划
        </button>
      </div>
      
      <div class="plan-items">
        <div 
          v-for="(item, index) in learningItems" 
          :key="index"
          class="plan-item"
        >
          <div class="plan-icon" :class="`plan-${item.type}`">
            <i :class="getPlanIcon(item.type)"></i>
          </div>
          <div class="plan-content">
            <div class="plan-title">{{ item.title }}</div>
            <div class="plan-desc">{{ item.description }}</div>
            <button class="start-learn-btn" @click="startLearningItem(item)">
              开始学习
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 职位匹配推荐 -->
    <div class="job-recommendations">
      <div class="section-header">
        <h3>匹配职位推荐</h3>
        <div class="action-buttons">
          <button 
            @click="refreshJobRecommendations" 
            class="refresh-btn"
            :disabled="isRefreshingJobs"
          >
            <i class="fas fa-sync-alt" :class="{ 'rotating': isRefreshingJobs }"></i> 
            刷新推荐
          </button>
          <router-link to="/search" class="view-more">查看更多</router-link>
        </div>
      </div>
      
      <div v-if="isRefreshingJobs" class="section-loading">
        <div class="small-spinner"></div>
        <span>更新推荐中...</span>
      </div>
      
      <div v-else class="job-grid">
        <div 
          v-for="job in recommendedJobs" 
          :key="job.id" 
          class="job-card"
          @click="viewJobDetails(job.id)"
        >
          <div class="job-logo">
            <img :src="job.companyLogo" :alt="job.company">
          </div>
          <div class="job-details">
            <div class="job-title">{{ job.title }}</div>
            <div class="job-company">{{ job.company }}</div>
            <div class="job-location">{{ job.location }}</div>
            <div class="job-match">
              <div class="match-text">匹配度: {{ job.matchScore }}%</div>
              <div class="match-bar">
                <div 
                  class="match-progress" 
                  :style="{ '--score-width': `${job.matchScore}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 技能详情弹窗 -->
    <div v-if="selectedSkill" class="skill-modal-overlay" @click="closeSkillModal">
      <div class="skill-modal" @click.stop>
        <div class="modal-header">
          <h4>{{ selectedSkill.name }} - 技能详情</h4>
          <button class="close-btn" @click="closeSkillModal">×</button>
        </div>
        <div class="modal-content">
          <div class="skill-detail-score">
            <div class="detail-score-value">{{ selectedSkill.score }}%</div>
            <div class="detail-score-label">掌握度</div>
          </div>
          
          <div class="skill-detail-stats">
            <div class="detail-stat">
              <div class="detail-stat-value">{{ selectedSkill.questionCount }}</div>
              <div class="detail-stat-label">答题数</div>
            </div>
            <div class="detail-stat">
              <div class="detail-stat-value">{{ selectedSkill.correctRate }}%</div>
              <div class="detail-stat-label">正确率</div>
            </div>
            <div class="detail-stat">
              <div class="detail-stat-value">{{ selectedSkill.trend > 0 ? '+' : '' }}{{ selectedSkill.trend }}%</div>
              <div class="detail-stat-label">趋势</div>
            </div>
          </div>
          
          <!-- 添加技能历史趋势图 -->
          <div class="skill-history">
            <h5>历史趋势</h5>
            <canvas ref="skillHistoryChart" height="180"></canvas>
          </div>
          
          <div class="skill-improvement">
            <h5>提升建议</h5>
            <div class="improvement-content">
              {{ selectedSkill.improvement }}
            </div>
          </div>
          
          <div class="skill-actions">
            <button class="practice-btn" @click="goToPracticePage(selectedSkill.name)">
              开始练习
            </button>
            <button class="resource-btn" @click="viewResources(selectedSkill.id)">
              学习资源
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick, watch } from 'vue';
import { useRouter } from 'vue-router';
import Chart from 'chart.js/auto';
import axios from 'axios';

const router = useRouter();
const timeRange = ref('month');
const isLoading = ref(false);
const stats = ref({
  totalInterviews: 0,
  averageScore: 0,
  bestSkill: '',
  weakestSkill: ''
});

const recentInterviews = ref([]);
const skillChart = ref(null);
const chartInstance = ref(null);
const skillFilter = ref('all');
const selectedSkill = ref(null);
const recommendedJobs = ref([]);
const learningItems = ref([]);
const isRefreshingJobs = ref(false);
const skillHistoryChart = ref(null);
const historyChartInstance = ref(null);
const hasError = ref(false);
const errorMessage = ref('');

// 模态窗口状态管理
const isModalOpen = ref(false);
const isSkillModalOpen = computed(() => selectedSkill.value !== null);

// 添加最后更新时间
const lastUpdated = ref(new Date().toLocaleString('zh-CN', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit'
}));

// 关闭技能详情模态窗口
const closeSkillModal = () => {
  selectedSkill.value = null;
  isModalOpen.value = false;
  
  // 销毁历史图表实例
  if (historyChartInstance.value) {
    historyChartInstance.value.destroy();
    historyChartInstance.value = null;
  }
};

// 技能分类
const skillCategories = [
  { label: '全部', value: 'all' },
  { label: '技术能力', value: 'technical' },
  { label: '软技能', value: 'soft' }
];

// 技能列表
const skills = ref([]);

// 过滤技能
const filteredSkills = computed(() => {
  if (skillFilter.value === 'all') {
    return skills.value;
  }
  return skills.value.filter(skill => skill.category === skillFilter.value);
});

// 获取分数等级样式
const getScoreClass = (score) => {
  if (score >= 90) return 'excellent';
  if (score >= 80) return 'good';
  if (score >= 70) return 'moderate';
  if (score >= 60) return 'pass';
  return 'poor';
};

// 获取分数颜色
const getScoreColor = (score) => {
  if (score >= 90) return '#52c41a';
  if (score >= 80) return '#1890ff';
  if (score >= 70) return '#faad14';
  if (score >= 60) return '#fa8c16';
  return '#f5222d';
};

// 获取趋势类名
const getTrendClass = (trend) => {
  if (trend > 0) return 'positive';
  if (trend < 0) return 'negative';
  return 'neutral';
};

// 获取趋势图标
const getTrendIcon = (trend) => {
  if (trend > 0) return 'fas fa-arrow-up';
  if (trend < 0) return 'fas fa-arrow-down';
  return 'fas fa-arrow-right';
};

// 获取计划类型图标
const getPlanIcon = (type) => {
  switch (type) {
    case 'course': return 'fas fa-book';
    case 'practice': return 'fas fa-code';
    case 'interview': return 'fas fa-user-tie';
    default: return 'fas fa-graduation-cap';
  }
};

// 格式化日期
const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

// 获取用户分析数据
const fetchAnalysisData = async () => {
  isLoading.value = true;
  hasError.value = false;
  
  try {
    // 使用真实API替换模拟数据
    const response = await axios.get('/api/user/analysis', {
      params: { timeRange: timeRange.value }
    });
    
    const data = response.data;
    
    // 更新统计数据
    stats.value = {
      totalInterviews: data.totalInterviews,
      averageScore: data.averageScore,
      bestSkill: data.bestSkill,
      weakestSkill: data.weakestSkill
    };
    
    // 更新技能数据
    skills.value = data.skills;
    
    // 更新最近面试
    recentInterviews.value = data.recentInterviews;
    
    // 更新推荐职位
    recommendedJobs.value = data.recommendedJobs;
    
    // 更新学习计划
    learningItems.value = data.learningItems || [];
    
    // 初始化技能历史数据
    initSkillHistory(data.skillHistory);
    
    // 更新最后更新时间
    lastUpdated.value = new Date().toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    await nextTick();
    renderSkillChart();
  } catch (error) {
    console.error('获取分析数据失败:', error);
    hasError.value = true;
    errorMessage.value = '获取数据失败，请稍后再试';
    
    // 使用备用数据确保UI仍然能够展示
    useFallbackData();
  } finally {
    isLoading.value = false;
  }
};

// 使用备用数据
const useFallbackData = () => {
  // 仅在API失败时使用
  stats.value = {
    totalInterviews: 5,
    averageScore: 78,
    bestSkill: 'Java编程',
    weakestSkill: '系统设计'
  };
  
  skills.value = [
    { 
      id: 1, 
      name: 'Java编程', 
      score: 90, 
      trend: 5, 
      questionCount: 32,
      category: 'technical',
      correctRate: 85,
      improvement: '建议深入学习Java虚拟机原理和内存模型，提高对并发编程的理解。'
    },
    // 其他备用技能数据...
  ];
  
  recentInterviews.value = [
    {
      id: 1,
      position: 'Java后端开发',
      interviewer: 'John Smith',
      interviewerAvatar: '/images/interviewers/male1.jpg',
      date: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2天前
      score: 85
    },
    // 其他备用面试数据...
  ];
  
  initSkillHistory();
};

// 初始化技能历史数据 - 使用API数据或生成模拟数据
const initSkillHistory = (apiHistoryData = null) => {
  const historyLabels = ['6月', '7月', '8月', '9月', '10月', '11月'];
  const datasets = {};
  
  if (apiHistoryData) {
    // 使用API提供的历史数据
    skillHistory.value = {
      labels: apiHistoryData.labels || historyLabels,
      datasets: apiHistoryData.datasets || {}
    };
  } else {
    // 没有API数据时生成模拟数据
    skills.value.forEach(skill => {
      // 生成过去6个月的随机数据
      const generateRandomTrend = () => {
        const baseScore = skill.score - (Math.random() * 20);
        const monthlyScores = [];
        let currentScore = baseScore;
        
        for (let i = 0; i < 6; i++) {
          const change = (Math.random() * 8) - 3;
          currentScore += change;
          currentScore = Math.min(Math.max(currentScore, 40), 100);
          monthlyScores.push(Math.round(currentScore));
        }
        
        return monthlyScores;
      };
      
      datasets[skill.id] = generateRandomTrend();
    });
    
    skillHistory.value = {
      labels: historyLabels,
      datasets: datasets
    };
  }
};

// 技能历史数据
const skillHistory = ref({
  labels: [],
  datasets: {}
});

// 渲染技能雷达图
const renderSkillChart = () => {
  if (chartInstance.value) {
    chartInstance.value.destroy();
  }
  
  const ctx = skillChart.value.getContext('2d');
  
  // 确保我们有数据可用
  if (!skills.value || skills.value.length === 0) {
    return;
  }
  
  const skillData = skills.value.slice(0, 6); // 最多显示6项技能
  
  chartInstance.value = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: skillData.map(skill => skill.name),
      datasets: [{
        label: '技能掌握度',
        data: skillData.map(skill => skill.score),
        backgroundColor: 'rgba(79, 110, 247, 0.2)',
        borderColor: 'rgba(79, 110, 247, 0.8)',
        borderWidth: 2,
        pointBackgroundColor: '#4F6EF7',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#4F6EF7'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          min: 0,
          max: 100,
          ticks: {
            stepSize: 20,
            display: false
          },
          pointLabels: {
            font: {
              size: 12
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.1)'
          },
          angleLines: {
            color: 'rgba(0, 0, 0, 0.1)'
          }
        }
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          titleColor: '#333',
          bodyColor: '#666',
          borderColor: '#ddd',
          borderWidth: 1,
          padding: 10,
          displayColors: false,
          callbacks: {
            label: function(context) {
              return context.raw + '%';
            }
          }
        }
      },
      animation: {
        duration: 1500,
        easing: 'easeOutQuart'
      }
    }
  });
};

// 渲染技能历史趋势图
const renderSkillHistoryChart = (skillId) => {
  if (historyChartInstance.value) {
    historyChartInstance.value.destroy();
  }
  
  nextTick(() => {
    if (!skillHistoryChart.value) return;
    
    const ctx = skillHistoryChart.value.getContext('2d');
    const data = skillHistory.value.datasets[skillId];
    
    if (!data) return;
    
    historyChartInstance.value = new Chart(ctx, {
      type: 'line',
      data: {
        labels: skillHistory.value.labels,
        datasets: [{
          label: '掌握度趋势',
          data: data,
          borderColor: '#4F6EF7',
          backgroundColor: 'rgba(79, 110, 247, 0.1)',
          tension: 0.3,
          fill: true
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            min: 0,
            max: 100,
            ticks: {
              stepSize: 20
            }
          }
        },
        animation: {
          duration: 1000
        }
      }
    });
  });
};

// 生成学习计划
const generateLearningPlan = async () => {
  isLoading.value = true;
  try {
    // 调用实际API生成计划
    const response = await axios.post('/api/learning/generate-plan', {
      focusSkill: stats.value.weakestSkill
    });
    
    learningItems.value = response.data.items;
  } catch (error) {
    console.error('生成学习计划失败:', error);
    // 使用备用数据
    learningItems.value = [
      {
        id: 1,
        type: 'course',
        title: '系统设计专家课程',
        description: '由资深架构师讲解大规模分布式系统设计原则和实践',
        link: '/courses/advanced-system-design'
      },
      {
        id: 2,
        type: 'practice',
        title: '系统设计挑战赛',
        description: '参与真实世界的系统设计挑战，提高架构设计能力',
        link: '/challenges/system-design'
      },
      {
        id: 3,
        type: 'interview',
        title: '一对一系统设计辅导',
        description: '与系统架构专家进行定制化辅导，针对你的弱点进行改进',
        link: '/mentorship'
      }
    ];
  } finally {
    isLoading.value = false;
  }
};

// 调整职位推荐刷新功能，增加视觉反馈
const refreshJobRecommendations = async () => {
  if (isRefreshingJobs.value) return; // 防止重复点击
  
  isRefreshingJobs.value = true;
  try {
    // 调用实际API获取推荐职位
    const response = await axios.get('/api/jobs/recommendations', {
      params: { skills: skills.value.map(skill => skill.name).join(',') }
    });
    
    recommendedJobs.value = response.data.jobs;
    
    // 更新最后更新时间
    lastUpdated.value = new Date().toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error('更新职位推荐失败:', error);
    // 使用备用数据
    recommendedJobs.value = [
      {
        id: 4,
        title: 'Java资深开发工程师',
        company: '美团',
        companyLogo: '/images/companies/meituan.png',
        location: '北京',
        matchScore: 94
      },
      {
        id: 5,
        title: '高级后端开发',
        company: '网易',
        companyLogo: '/images/companies/netease.png',
        location: '杭州',
        matchScore: 88
      },
      {
        id: 6,
        title: '系统架构师',
        company: '滴滴',
        companyLogo: '/images/companies/didi.png',
        location: '北京',
        matchScore: 75
      }
    ];
  } finally {
    isRefreshingJobs.value = false;
  }
};

// 查看面试详情
const viewInterviewDetail = (id) => {
  router.push(`/interview-result/${id}`);
};

// 查看职位详情
const viewJobDetails = (id) => {
  router.push(`/job/${id}`);
};

// 显示技能详情
const showSkillDetail = (skill) => {
  selectedSkill.value = skill;
  
  // 等待DOM更新后再渲染图表
  nextTick(() => {
    if (skillHistoryChart.value) {
      renderSkillHistoryChart(skill.id);
    }
  });
};

// 前往练习页面
const goToPracticePage = (skillName) => {
  // 将技能名称作为查询参数传递给练习页面
  router.push({
    path: '/problems/all',
    query: { skillFilter: skillName }
  });
};

// 查看学习资源
const viewResources = (skillId) => {
  router.push(`/resources?skill=${skillId}`);
};

// 开始学习项目
const startLearningItem = (item) => {
  router.push(item.link);
};

// 添加导航相关功能
const startInterviewWithFocus = () => {
  // 基于分析结果创建带有建议改进焦点的面试
  router.push({
    path: '/interview',
    query: { 
      focus: stats.value.weakestSkill,
      mode: 'improvement' 
    }
  });
};

// 监听时间范围变化
watch(timeRange, (newValue) => {
  fetchAnalysisData();
});

// 生命周期钩子
onMounted(() => {
  fetchAnalysisData();
});
</script>

<style scoped>
.score-analysis {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.analysis-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.analysis-header h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
}

.time-selector select {
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #ddd;
  font-size: 14px;
  background-color: white;
  cursor: pointer;
  appearance: none;
  padding-right: 28px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%234F6EF7' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 8px center;
}

.time-selector select:focus {
  outline: none;
  border-color: #4F6EF7;
  box-shadow: 0 0 0 2px rgba(79, 110, 247, 0.2);
}

/* 加载状态 */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #4F6EF7;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 统计卡片 */
.overview-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.stat-card {
  background-color: white;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  font-size: 20px;
  color: white;
}

.interviews-icon {
  background-color: #4F6EF7;
}

.score-icon {
  background-color: #52c41a;
}

.strength-icon {
  background-color: #faad14;
}

.weakness-icon {
  background-color: #f5222d;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

/* 两列布局 */
.two-column-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

/* 图表容器 */
.chart-container {
  background-color: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  height: 320px; /* 控制整体高度 */
}

.chart-container h3 {
  margin-top: 0;
  margin-bottom: 12px;
  font-size: 18px;
  font-weight: 600;
}

/* 最近面试 */
.recent-interviews {
  background-color: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.view-all, .view-more {
  color: #4F6EF7;
  text-decoration: none;
  font-size: 14px;
}

.interview-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 260px;
  overflow-y: auto;
}

.interview-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border-radius: 8px;
  background-color: #f9f9f9;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.interview-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.interview-info {
  display: flex;
  align-items: center;
}

.interviewer-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 12px;
  object-fit: cover;
}

.interview-details {
  display: flex;
  flex-direction: column;
}

.interview-position {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 4px;
}

.interview-meta {
  display: flex;
  gap: 8px;
  font-size: 14px;
  color: #666;
}

.interview-score {
  font-size: 20px;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 4px;
}

.excellent {
  background-color: rgba(82, 196, 26, 0.1);
  color: #52c41a;
}

.good {
  background-color: rgba(24, 144, 255, 0.1);
  color: #1890ff;
}

.moderate {
  background-color: rgba(250, 173, 20, 0.1);
  color: #faad14;
}

.pass {
  background-color: rgba(250, 140, 22, 0.1);
  color: #fa8c16;
}

.poor {
  background-color: rgba(245, 34, 45, 0.1);
  color: #f5222d;
}

/* 技能详情 */
.skills-section {
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.skill-filter {
  display: flex;
  gap: 8px;
}

.category-btn {
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid #ddd;
  background-color: white;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-btn.active {
  background-color: #4F6EF7;
  color: white;
  border-color: #4F6EF7;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.skill-card {
  padding: 16px;
  border-radius: 8px;
  background-color: #f9f9f9;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.skill-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
}

.skill-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.skill-name {
  font-weight: 500;
}

.skill-score {
  font-weight: 700;
}

.skill-progress {
  height: 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 12px;
}

.progress-bar {
  height: 100%;
  border-radius: 4px;
}

.skill-trend {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}

.trend-indicator {
  display: flex;
  align-items: center;
}

.trend-indicator i {
  margin-right: 4px;
}

.trend-indicator.positive {
  color: #52c41a;
}

.trend-indicator.negative {
  color: #f5222d;
}

.trend-indicator.neutral {
  color: #faad14;
}

.question-count {
  color: #666;
}

/* 学习计划 */
.learning-plan {
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.generate-btn {
  background-color: #4F6EF7;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
}

.plan-items {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.plan-item {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  gap: 16px;
}

.plan-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
}

.plan-course {
  background-color: #1890ff;
}

.plan-practice {
  background-color: #52c41a;
}

.plan-interview {
  background-color: #722ed1;
}

.plan-content {
  flex: 1;
}

.plan-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 8px;
}

.plan-desc {
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
}

.start-learn-btn {
  background-color: transparent;
  border: 1px solid #4F6EF7;
  color: #4F6EF7;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.start-learn-btn:hover {
  background-color: #4F6EF7;
  color: white;
}

/* 职位推荐 */
.job-recommendations {
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.job-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.job-card {
  display: flex;
  padding: 16px;
  background-color: #f9f9f9;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.job-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
}

.job-logo {
  width: 48px;
  height: 48px;
  margin-right: 12px;
  border-radius: 8px;
  overflow: hidden;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.job-logo img {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.job-details {
  flex: 1;
}

.job-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 4px;
}

.job-company {
  font-size: 14px;
  margin-bottom: 4px;
}

.job-location {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.job-match {
  font-size: 14px;
}

.match-text {
  margin-bottom: 4px;
  font-weight: 500;
  color: #4F6EF7;
}

.match-bar {
  height: 6px;
  background-color: #f0f0f0;
  border-radius: 3px;
  overflow: hidden;
}

.match-progress {
  height: 100%;
  background-color: #4F6EF7;
  border-radius: 3px;
}

/* 技能详情弹窗 */
.skill-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.skill-modal {
  width: 600px;
  max-width: 90vw;
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.modal-header h4 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
}

.modal-content {
  padding: 20px;
}

.skill-detail-score {
  text-align: center;
  margin-bottom: 24px;
}

.detail-score-value {
  font-size: 48px;
  font-weight: 700;
  color: #4F6EF7;
  line-height: 1;
}

.detail-score-label {
  font-size: 16px;
  color: #666;
  margin-top: 8px;
}

.skill-detail-stats {
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
}

.detail-stat {
  text-align: center;
  flex: 1;
}

.detail-stat-value {
  font-size: 24px;
  font-weight: 600;
}

.detail-stat-label {
  font-size: 14px;
  color: #666;
  margin-top: 4px;
}

.skill-improvement {
  background-color: #f9f9f9;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 24px;
}

.skill-improvement h5 {
  margin: 0 0 12px 0;
  font-size: 16px;
  font-weight: 600;
}

.improvement-content {
  font-size: 14px;
  line-height: 1.6;
}

.skill-actions {
  display: flex;
  gap: 12px;
}

.practice-btn, .resource-btn {
  flex: 1;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.practice-btn {
  background-color: #4F6EF7;
  color: white;
  border: none;
}

.practice-btn:hover {
  background-color: #3D5CE5;
}

.resource-btn {
  background-color: white;
  color: #4F6EF7;
  border: 1px solid #4F6EF7;
}

.resource-btn:hover {
  background-color: #f0f5ff;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .overview-cards {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .two-column-section {
    grid-template-columns: 1fr;
  }
}

/* 添加加载状态样式 */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #4F6EF7;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.view-more {
  color: #4F6EF7;
  text-decoration: none;
  font-weight: 500;
  font-size: 14px;
}

.generate-btn {
  display: flex;
  align-items: center;
  gap: 6px;
}

.generate-btn i {
  transition: transform 0.3s ease;
}

.generate-btn:hover i {
  transform: rotate(90deg);
}

/* 添加技能历史图表样式 */
.skill-history {
  margin-bottom: 24px;
}

.skill-history h5 {
  margin: 0 0 12px 0;
  font-size: 16px;
  font-weight: 600;
}

/* 改进互动效果 */
.generate-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: #4F6EF7;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.generate-btn:hover {
  background-color: #3D5CE5;
}

.generate-btn i {
  transition: transform 0.3s ease;
}

.generate-btn:hover i {
  transform: rotate(90deg);
}

/* 添加匹配分数动画 */
@keyframes progressFill {
  from { width: 0; }
  to { width: var(--score-width); }
}

.match-progress {
  height: 100%;
  background-color: #4F6EF7;
  border-radius: 3px;
  animation: progressFill 1s ease-out forwards;
}

/* 改进学习计划项样式 */
.plan-item {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  gap: 16px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.plan-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
}

/* 改进响应式布局 */
@media (max-width: 992px) {
  .two-column-section {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .job-grid, .plan-items {
    grid-template-columns: repeat(auto-fill, minmax(100%, 1fr));
  }
}

@media (max-width: 768px) {
  .overview-cards {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .skills-grid {
    grid-template-columns: repeat(auto-fill, minmax(100%, 1fr));
  }
  
  .skill-card {
    padding: 12px;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .skill-filter {
    width: 100%;
    overflow-x: auto;
    padding-bottom: 8px;
  }
}

@media (max-width: 576px) {
  .overview-cards {
    grid-template-columns: 1fr;
  }
  
  .skill-modal {
    width: 95vw;
  }
}

/* 添加职位推荐刷新按钮样式 */
.action-buttons {
  display: flex;
  align-items: center;
  gap: 16px;
}

.refresh-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  color: #4F6EF7;
  font-size: 14px;
  cursor: pointer;
  padding: 4px 8px;
}

.refresh-btn:disabled {
  color: #9e9e9e;
  cursor: not-allowed;
}

.rotating {
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 添加局部加载样式 */
.section-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 0;
  gap: 12px;
  color: #666;
}

.small-spinner {
  width: 24px;
  height: 24px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #4F6EF7;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* 增强职位匹配条动画 */
.match-bar {
  height: 6px;
  background-color: #eee;
  border-radius: 3px;
  overflow: hidden;
  margin-top: 4px;
}

.match-progress {
  height: 100%;
  background-color: #4F6EF7;
  border-radius: 3px;
  animation: progressFill 1s ease-out forwards;
}

/* 添加悬停效果到面试项 */
.interview-item {
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.interview-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* 改进技能详情模态窗口 */
.skill-modal {
  max-height: 90vh;
  overflow-y: auto;
}

/* 优化空状态样式 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  color: #d9d9d9;
}

.empty-state p {
  margin-bottom: 20px;
  color: #666;
}

.start-btn {
  padding: 10px 20px;
  background-color: #4F6EF7;
  color: white;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.3s ease;
}

/* 错误消息样式 */
.error-message {
  background-color: #fff2f0;
  border: 1px solid #ffccc7;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.error-message i {
  color: #ff4d4f;
  font-size: 20px;
}

.error-message p {
  color: #434343;
  margin: 0;
  flex-grow: 1;
}

.retry-btn {
  background-color: #ff4d4f;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  cursor: pointer;
}

.retry-btn:hover {
  background-color: #cf1322;
}

.overview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.overview-tips {
  color: #8c8c8c;
  font-size: 14px;
}
</style> 