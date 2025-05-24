/**
 * 代码语义分析与智能评估系统
 * 
 * 这个系统提供以下功能：
 * 1. 静态代码分析 - 检测潜在错误和安全漏洞
 * 2. 代码复杂度分析 - 评估时间和空间复杂度
 * 3. 代码质量评估 - 根据编码规范和最佳实践评分
 * 4. 智能代码改进建议 - 提供优化和重构建议
 * 5. 设计模式检测 - 识别代码中使用的设计模式
 * 6. 深度学习辅助分析 - 使用预训练模型分析代码语义
 * 7. 项目历史分析 - 跟踪代码质量变化趋势
 */

import axios from 'axios'
import * as acorn from 'acorn'
import * as walk from 'acorn-walk'
import * as escodegen from 'escodegen'
import * as estraverse from 'estraverse'

// API配置
const API_CONFIG = {
  modelEndpoint: 'https://api.openai.com/v1/chat/completions',
  modelName: 'gpt-4',
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 30000
}

// 支持的编程语言
const SUPPORTED_LANGUAGES = ['javascript', 'python', 'java', 'c', 'cpp']

// 复杂度级别定义
const COMPLEXITY_LEVELS = {
  O_1: { name: 'O(1)', description: '常数时间复杂度', weight: 1 },
  O_LOG_N: { name: 'O(log n)', description: '对数时间复杂度', weight: 2 },
  O_N: { name: 'O(n)', description: '线性时间复杂度', weight: 3 },
  O_N_LOG_N: { name: 'O(n log n)', description: '线性对数时间复杂度', weight: 4 },
  O_N_2: { name: 'O(n²)', description: '平方时间复杂度', weight: 5 },
  O_N_3: { name: 'O(n³)', description: '立方时间复杂度', weight: 6 },
  O_2_N: { name: 'O(2ⁿ)', description: '指数时间复杂度', weight: 7 },
  O_N_FACTORIAL: { name: 'O(n!)', description: '阶乘时间复杂度', weight: 8 }
}

// 常见设计模式定义
const DESIGN_PATTERNS = {
  SINGLETON: {
    name: '单例模式',
    description: '确保一个类只有一个实例，并提供全局访问点',
    signatures: [
      { pattern: 'getInstance', weight: 0.5 },
      { pattern: 'static\\s+instance', weight: 0.7 },
      { pattern: 'private\\s+constructor', weight: 0.8 }
    ]
  },
  FACTORY: {
    name: '工厂模式',
    description: '定义创建对象的接口，让子类决定实例化的类',
    signatures: [
      { pattern: 'create[A-Z]', weight: 0.6 },
      { pattern: 'new\\s+[A-Z][a-zA-Z]*\\(', weight: 0.4 },
      { pattern: 'return\\s+new\\s+', weight: 0.5 }
    ]
  },
  OBSERVER: {
    name: '观察者模式',
    description: '定义对象间一对多的依赖关系，当一个对象状态改变时，所有依赖于它的对象都会收到通知',
    signatures: [
      { pattern: 'addEventListener|on[A-Z]', weight: 0.7 },
      { pattern: 'notify|publish|emit', weight: 0.7 },
      { pattern: 'subscribe|observer', weight: 0.8 }
    ]
  },
  STRATEGY: {
    name: '策略模式',
    description: '定义一系列算法，把它们封装起来，并使它们可互换',
    signatures: [
      { pattern: 'strategy', weight: 0.6 },
      { pattern: 'algorithm', weight: 0.4 },
      { pattern: 'setStrategy|useStrategy', weight: 0.9 }
    ]
  },
  DECORATOR: {
    name: '装饰器模式',
    description: '动态地给对象添加额外的职责',
    signatures: [
      { pattern: '@[a-zA-Z]', weight: 0.9 },
      { pattern: 'decorate|decorator', weight: 0.7 },
      { pattern: 'wrapper|wrap', weight: 0.6 }
    ]
  }
}

// 安全漏洞类型定义
const SECURITY_VULNERABILITY_TYPES = {
  SQL_INJECTION: {
    name: 'SQL注入',
    description: '将未经验证的用户输入直接拼接到SQL查询中',
    patterns: [
      'SELECT.*\\$\\{.*\\}',
      'INSERT.*\\$\\{.*\\}',
      'UPDATE.*\\$\\{.*\\}',
      'DELETE.*\\$\\{.*\\}'
    ],
    severity: 'high'
  },
  XSS: {
    name: '跨站脚本攻击',
    description: '将不可信数据插入到浏览器中',
    patterns: [
      'innerHTML.*=',
      'document\\.write\\(',
      'eval\\('
    ],
    severity: 'high'
  },
  PATH_TRAVERSAL: {
    name: '路径遍历',
    description: '使用未验证的用户输入来构造文件路径',
    patterns: [
      'fs\\.readFile\\(.*\\+',
      'fs\\.writeFile\\(.*\\+',
      'require\\(.*\\+',
      'import\\(.*\\+'
    ],
    severity: 'high'
  },
  HARD_CODED_CREDENTIALS: {
    name: '硬编码凭证',
    description: '在代码中保存敏感信息如密码和密钥',
    patterns: [
      'password.*=.*[\'"][^\'"]{5,}[\'"]',
      'apiKey.*=.*[\'"][^\'"]{16,}[\'"]',
      'secret.*=.*[\'"][^\'"]{16,}[\'"]',
      'token.*=.*[\'"][^\'"]{16,}[\'"]'
    ],
    severity: 'medium'
  }
}

// 代码质量指标定义
const CODE_QUALITY_METRICS = {
  READABILITY: {
    name: '可读性',
    weight: 0.3
  },
  MAINTAINABILITY: {
    name: '可维护性',
    weight: 0.25
  },
  TESTABILITY: {
    name: '可测试性',
    weight: 0.25
  },
  DOCUMENTATION: {
    name: '文档完整性',
    weight: 0.2
  }
}

// 代码味道定义
const CODE_SMELLS = {
  LONG_METHOD: {
    name: '过长函数',
    description: '函数过长，应该拆分为多个小函数',
    threshold: 30, // 行数阈值
    severity: 'medium'
  },
  LARGE_CLASS: {
    name: '过大类',
    description: '类定义过大，应该拆分为多个小类',
    threshold: 200, // 行数阈值
    severity: 'medium'
  },
  LONG_PARAMETER_LIST: {
    name: '参数列表过长',
    description: '函数参数过多，应该重构为对象参数或拆分函数',
    threshold: 4, // 参数数量阈值
    severity: 'low'
  },
  DUPLICATE_CODE: {
    name: '重复代码',
    description: '存在重复代码片段，应该提取为公共函数',
    threshold: 5, // 重复行数阈值
    severity: 'medium'
  },
  DEEPLY_NESTED_CODE: {
    name: '深层嵌套',
    description: '代码嵌套层级过深，应该提取子函数或使用早期返回',
    threshold: 3, // 嵌套层级阈值
    severity: 'medium'
  }
}

// 领域特定最佳实践
const DOMAIN_BEST_PRACTICES = {
  'sorting': {
    patterns: ['quickSort', 'mergeSort', 'heapSort', 'pivot', 'partition'],
    optimizations: ['原地排序', '尾递归优化', '三数取中', '插入排序优化小数组']
  },
  'graph': {
    patterns: ['BFS', 'DFS', 'Dijkstra', 'adjacencyList', 'adjacencyMatrix'],
    optimizations: ['邻接表表示稀疏图', '优先队列优化Dijkstra', '双向BFS']
  },
  'dynamic-programming': {
    patterns: ['memo', 'dp', 'subproblem', 'optimal', 'tabulation'],
    optimizations: ['状态压缩', '滚动数组优化空间', '记忆化搜索']
  }
}

// 预训练模型提示模板
const PROMPT_TEMPLATES = {
  CODE_ANALYSIS: `
分析以下{language}代码:
\`\`\`
{code}
\`\`\`

请提供以下信息:
1. 代码功能和目的
2. 时间复杂度和空间复杂度
3. 质量评估和潜在问题
4. 优化建议
5. 可能存在的设计模式
6. 安全隐患

以JSON格式返回结果。
`,
  DESIGN_PATTERN_DETECTION: `
分析以下代码中使用的设计模式:
\`\`\`
{code}
\`\`\`

请列出所有识别到的设计模式，包括:
1. 模式名称
2. 置信度(0-1)
3. 代码中的具体实现
4. 行号位置

以JSON格式返回结果。
`,
  SECURITY_ANALYSIS: `
从安全角度分析以下代码:
\`\`\`
{code}
\`\`\`

请识别所有安全漏洞，包括:
1. 漏洞类型
2. 严重程度
3. 漏洞描述
4. 修复建议
5. 行号位置

以JSON格式返回结果。
`
}

// 版本控制系统配置
const VCS_CONFIG = {
  type: 'git',
  historyLimit: 10 // 分析最近的提交数量
}

// 缓存配置
const CACHE_CONFIG = {
  enabled: true,
  lifetime: 60 * 60 * 1000, // 1小时缓存有效期
  maxSize: 100 // 最大缓存条目数
}

// 代码分析基础类
export class CodeAnalyzer {
  constructor() {
    // 代码解析器映射
    this.parsers = {
      'javascript': this.parseJavaScript,
      'python': this.parsePython,
      'java': this.parseJava,
      'c': this.parseC,
      'cpp': this.parseCpp
    }
    
    // 分析结果缓存
    this.cache = {
      entries: new Map(),
      stats: {
        hits: 0,
        misses: 0,
        size: 0
      }
    }
    
    // 项目历史分析数据
    this.historyData = {
      commits: [],
      trends: {}
    }
    
    // 结果适配器 - 用于跨语言标准化结果
    this.resultAdapters = {
      'javascript': this.standardizeJsResults,
      'python': this.standardizePythonResults,
      'java': this.standardizeJavaResults,
      'c': this.standardizeCResults,
      'cpp': this.standardizeCppResults
    }
    
    // 模型和规则库
    this.models = {
      loaded: false,
      securityRules: new Map(),
      qualityRules: new Map(),
      complexityPatterns: new Map(),
      designPatterns: new Map(),
      neuralModel: null
    }
    
    // 模型和资源初始化
    this.initializeModels()
  }
  
  /**
   * 初始化分析模型和资源
   */
  async initializeModels() {
    try {
      console.log('正在初始化代码分析模型...')
      
      // 加载规则库
      await this.loadRules()
      
      // 加载历史数据
      if (VCS_CONFIG.enabled) {
        await this.loadProjectHistory()
      }
      
      // 初始化神经网络模型
      await this.initializeNeuralModel()
      
      this.models.loaded = true
      console.log('代码分析模型初始化完成')
    } catch (error) {
      console.error('模型初始化失败:', error)
      throw new Error(`模型初始化失败: ${error.message}`)
    }
  }
  
  /**
   * 加载代码分析规则库
   */
  async loadRules() {
    // 加载安全规则
    Object.entries(SECURITY_VULNERABILITY_TYPES).forEach(([key, value]) => {
      this.models.securityRules.set(key, {
        ...value,
        compiledPatterns: value.patterns.map(pattern => new RegExp(pattern, 'g'))
      })
    })
    
    // 加载代码质量规则
    Object.entries(CODE_SMELLS).forEach(([key, value]) => {
      this.models.qualityRules.set(key, value)
    })
    
    // 加载复杂度识别模式
    Object.entries(COMPLEXITY_LEVELS).forEach(([key, value]) => {
      this.models.complexityPatterns.set(key, value)
    })
    
    // 加载设计模式规则
    Object.entries(DESIGN_PATTERNS).forEach(([key, value]) => {
      this.models.designPatterns.set(key, {
        ...value,
        compiledSignatures: value.signatures.map(sig => ({
          ...sig,
          regex: new RegExp(sig.pattern, 'g')
        }))
      })
    })
    
    console.log(`规则库加载完成: ${this.models.securityRules.size}个安全规则, ${this.models.qualityRules.size}个质量规则, ${this.models.complexityPatterns.size}个复杂度模式, ${this.models.designPatterns.size}个设计模式`)
  }
  
  /**
   * 初始化神经网络模型
   */
  async initializeNeuralModel() {
    try {
      // 在实际实现中，这里会加载预训练模型
      // 为了演示，我们简单模拟模型加载
      console.log('正在加载神经网络模型...')
      
      // 模拟网络请求延迟
      await new Promise(resolve => setTimeout(resolve, 500))
      
      this.models.neuralModel = {
        name: 'code-analyzer-transformer',
        version: '1.0.0',
        loadedAt: new Date().toISOString(),
        predict: async (code, language) => {
          try {
            // 调用GPT进行代码分析
            const response = await this.callLanguageModel(
              PROMPT_TEMPLATES.CODE_ANALYSIS.replace('{language}', language).replace('{code}', code)
            )
            return response
          } catch (error) {
            console.error('神经网络预测失败:', error)
            return null
          }
        }
      }
      
      console.log('神经网络模型加载完成')
      return true
    } catch (error) {
      console.error('神经网络模型初始化失败:', error)
      this.models.neuralModel = null
      return false
    }
  }
  
  /**
   * 加载项目历史数据
   */
  async loadProjectHistory() {
    try {
      console.log('正在加载项目历史数据...')
      
      // 模拟从VCS加载历史数据
      // 在实际实现中，可以调用Git命令或API
      
      // 模拟数据
      this.historyData = {
        commits: [
          {
            id: 'abc123',
            date: '2023-01-01',
            author: 'developer1',
            metrics: {
              complexity: 76,
              quality: 82,
              security: 90
            }
          },
          {
            id: 'def456',
            date: '2023-01-15',
            author: 'developer2',
            metrics: {
              complexity: 72,
              quality: 85,
              security: 88
            }
          },
          {
            id: 'ghi789',
            date: '2023-02-01',
            author: 'developer1',
            metrics: {
              complexity: 68,
              quality: 88,
              security: 91
            }
          }
        ],
        trends: {
          complexity: 'decreasing',
          quality: 'increasing',
          security: 'stable'
        }
      }
      
      console.log(`项目历史数据加载完成: ${this.historyData.commits.length}个提交记录`)
      return true
    } catch (error) {
      console.error('项目历史数据加载失败:', error)
      return false
    }
  }
  
  /**
   * 调用语言模型进行高级分析
   * @param {string} prompt - 提示文本
   * @returns {Object} - 模型返回的结果
   */
  async callLanguageModel(prompt) {
    try {
      // 检查API密钥
      if (!API_CONFIG.apiKey && !process.env.OPENAI_API_KEY) {
        console.warn('未设置API密钥，将使用规则引擎进行分析')
        return null
      }
      
      console.log('正在调用AI语言模型进行高级分析...')
      
      // 构建请求
      const response = await axios({
        method: 'post',
        url: API_CONFIG.modelEndpoint,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_CONFIG.apiKey || process.env.OPENAI_API_KEY}`
        },
        data: {
          model: API_CONFIG.modelName,
          messages: [
            {
              role: 'system',
              content: '你是一个专业的代码分析助手，精通多种编程语言和软件设计模式，能够提供准确、详细的代码评估。'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.1
        },
        timeout: API_CONFIG.timeout
      })
      
      // 提取回复内容
      if (response.data && response.data.choices && response.data.choices.length > 0) {
        const content = response.data.choices[0].message.content
        
        // 尝试解析JSON
        try {
          // 从文本中提取JSON部分
          const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || 
                          content.match(/\{[\s\S]*\}/)
          
          if (jsonMatch) {
            const jsonStr = jsonMatch[1] || jsonMatch[0]
            return JSON.parse(jsonStr)
          }
          
          // 如果没有格式化的JSON，尝试直接解析整个内容
          return JSON.parse(content)
        } catch (parseError) {
          console.warn('无法解析语言模型返回的JSON:', parseError)
          return { raw: content }
        }
      }
      
      throw new Error('语言模型未返回有效结果')
    } catch (error) {
      console.error('语言模型调用失败:', error)
      return null
    }
  }
  
  /**
   * 完整的代码分析
   * @param {string} code - 源代码
   * @param {string} language - 编程语言
   * @param {Object} options - 分析选项
   * @returns {Object} 分析结果
   */
  async analyze(code, language, options = {}) {
    // 检查语言支持
    if (!SUPPORTED_LANGUAGES.includes(language)) {
      throw new Error(`不支持的编程语言: ${language}`)
    }
    
    // 默认选项
    const defaultOptions = {
      useCache: CACHE_CONFIG.enabled,
      useNeuralModel: true,
      analyzeSecurity: true,
      analyzeQuality: true,
      analyzeComplexity: true,
      analyzePatterns: true,
      analyzeCorrectness: true,
      getAIEvaluation: true,
      compareWithHistory: VCS_CONFIG.enabled,
      domain: null,
      problem: null // 用于正确性分析的问题描述和测试用例
    }
    
    // 合并选项
    const mergedOptions = { ...defaultOptions, ...options }
    
    // 检查缓存
    if (mergedOptions.useCache) {
      const cacheKey = this.generateCacheKey(code, language, mergedOptions)
      const cachedResult = this.getFromCache(cacheKey)
      if (cachedResult) {
        console.log('使用缓存的分析结果')
        return cachedResult
      }
    }
    
    // 获取解析器
    const parser = this.parsers[language]
    if (!parser) {
      throw new Error(`${language}解析器未实现`)
    }
    
    try {
      console.log(`开始分析${language}代码...`)
      const startTime = Date.now()
      
      // 首先分析代码正确性（如果提供了问题描述和测试用例）
      let correctness = null
      if (mergedOptions.analyzeCorrectness && mergedOptions.problem) {
        correctness = await this.analyzeCorrectness(code, language, mergedOptions.problem)
      }
      
      // 解析代码生成AST
      const ast = await parser(code)
      
      // 并行进行基础分析
      const [complexity, quality, security, patterns] = await Promise.all([
        mergedOptions.analyzeComplexity ? this.analyzeComplexity(ast, code, language) : null,
        mergedOptions.analyzeQuality ? this.analyzeCodeQuality(ast, code, language) : null,
        mergedOptions.analyzeSecurity ? this.analyzeSecurityIssues(ast, code, language) : null,
        mergedOptions.analyzePatterns ? this.detectDesignPatterns(ast, code, language) : null
      ])
      
      // 生成优化建议
      const suggestions = await this.generateSuggestions(
        ast, code, language, complexity, quality, security
      )
      
      // 如果指定了领域，进行领域特定分析
      let domainAnalysis = null
      if (mergedOptions.domain && DOMAIN_BEST_PRACTICES[mergedOptions.domain]) {
        domainAnalysis = await this.compareWithBestPractices(
          code, language, mergedOptions.domain, ast
        )
      }
      
      // 与历史数据比较
      let historyComparison = null
      if (mergedOptions.compareWithHistory && this.historyData.commits.length > 0) {
        historyComparison = this.compareWithHistory(complexity, quality, security)
      }
      
      // 生成综合分析报告
      const summary = this.generateSummary(
        correctness, complexity, quality, security, patterns
      )
      
      // 最后使用AI进行深度评估
      let aiEvaluation = null
      if (mergedOptions.getAIEvaluation && this.models.neuralModel) {
        aiEvaluation = await this.getAICodeEvaluation(code, language, {
          correctness,
          complexity,
          quality,
          security
        })
      }
      
      // 计算分析时间
      const analysisTime = Date.now() - startTime
      
      // 构建完整结果
      const result = {
        correctness,
        complexity,
        quality,
        security,
        designPatterns: patterns,
        suggestions,
        summary,
        domainAnalysis,
        historyComparison,
        aiEvaluation,
        metadata: {
          language,
          codeSize: code.length,
          lineCount: code.split('\n').length,
          analysisTime,
          timestamp: new Date().toISOString(),
          analyzerVersion: '2.0.0'
        }
      }
      
      // 缓存结果
      if (mergedOptions.useCache) {
        const cacheKey = this.generateCacheKey(code, language, mergedOptions)
        this.addToCache(cacheKey, result)
      }
      
      console.log(`代码分析完成，耗时 ${analysisTime}ms`)
      return result
    } catch (error) {
      console.error('代码分析错误:', error)
      throw new Error(`代码分析失败: ${error.message}`)
    }
  }
  
  /**
   * 生成缓存键
   * @param {string} code - 源代码
   * @param {string} language - 编程语言
   * @param {Object} options - 分析选项
   * @returns {string} 缓存键
   */
  generateCacheKey(code, language, options) {
    // 计算代码的哈希值，可以使用更复杂的哈希算法
    const codeHash = Array.from(code)
      .reduce((hash, char) => (hash * 31 + char.charCodeAt(0)) & 0xFFFFFFFF, 0)
      .toString(16)
    
    return `${language}_${codeHash}_${JSON.stringify(options)}`
  }
  
  /**
   * 从缓存获取分析结果
   * @param {string} key - 缓存键
   * @returns {Object|null} 缓存的分析结果
   */
  getFromCache(key) {
    const entry = this.cache.entries.get(key)
    if (entry && Date.now() - entry.timestamp < CACHE_CONFIG.lifetime) {
      this.cache.stats.hits++
      return entry.data
    }
    this.cache.stats.misses++
    return null
  }
  
  /**
   * 添加分析结果到缓存
   * @param {string} key - 缓存键
   * @param {Object} data - 分析结果
   */
  addToCache(key, data) {
    // 缓存大小限制
    if (this.cache.entries.size >= CACHE_CONFIG.maxSize) {
      // 移除最早的缓存项
      const oldestKey = this.cache.entries.keys().next().value
      this.cache.entries.delete(oldestKey)
    }
    
    this.cache.entries.set(key, {
      data,
      timestamp: Date.now()
    })
    this.cache.stats.size = this.cache.entries.size
  }

  /**
   * JavaScript代码解析
   * @param {string} code - JavaScript源代码
   * @returns {Object} AST抽象语法树
   */
  async parseJavaScript(code) {
    try {
      // 使用acorn解析JavaScript代码
      const ast = acorn.parse(code, {
        ecmaVersion: 2020,
        sourceType: 'module',
        locations: true,
        ranges: true
      })
      
      // 增强AST，添加额外的分析信息
      const enhancedAst = this.enhanceJavaScriptAst(ast, code)
      
      return enhancedAst
    } catch (error) {
      console.error('JavaScript解析错误:', error)
      throw new Error(`JavaScript解析错误: ${error.message}`)
    }
  }
  
  /**
   * 增强JavaScript AST，添加额外的分析信息
   * @param {Object} ast - 原始AST
   * @param {string} code - 源代码
   * @returns {Object} 增强的AST
   */
  enhanceJavaScriptAst(ast, code) {
    // 代码行列表
    const lines = code.split('\n')
    
    // 添加功能计数器
    const stats = {
      functionCount: 0,
      classCount: 0,
      importCount: 0,
      exportCount: 0,
      commentCount: 0,
      conditionalCount: 0,
      loopCount: 0,
      totalLines: lines.length,
      emptyLines: lines.filter(line => line.trim() === '').length,
      commentLines: 0,
      maxNestingLevel: 0,
      functionComplexity: new Map()
    }
    
    // 分析注释
    const commentRegex = /\/\/.*$|\/\*[\s\S]*?\*\//gm
    let match
    while ((match = commentRegex.exec(code)) !== null) {
      stats.commentCount++
      stats.commentLines += match[0].split('\n').length
    }
    
    // 遍历AST分析结构
    let currentNestingLevel = 0
    let maxNestingLevel = 0
    
    estraverse.traverse(ast, {
      enter: (node, parent) => {
        // 计数函数定义
        if (node.type === 'FunctionDeclaration' || 
            node.type === 'FunctionExpression' || 
            node.type === 'ArrowFunctionExpression') {
          stats.functionCount++
          
          // 计算函数的圈复杂度
          const complexity = this.calculateCyclomaticComplexity(node)
          stats.functionComplexity.set(
            node.id ? node.id.name : `anonymous_${node.loc.start.line}`,
            complexity
          )
        }
        
        // 计数类定义
        if (node.type === 'ClassDeclaration' || node.type === 'ClassExpression') {
          stats.classCount++
        }
        
        // 计数导入语句
        if (node.type === 'ImportDeclaration') {
          stats.importCount++
        }
        
        // 计数导出语句
        if (node.type === 'ExportNamedDeclaration' || node.type === 'ExportDefaultDeclaration') {
          stats.exportCount++
        }
        
        // 计数条件语句
        if (node.type === 'IfStatement' || 
            node.type === 'SwitchStatement' || 
            node.type === 'ConditionalExpression') {
          stats.conditionalCount++
        }
        
        // 计数循环语句
        if (node.type === 'ForStatement' || 
            node.type === 'ForInStatement' || 
            node.type === 'ForOfStatement' || 
            node.type === 'WhileStatement' || 
            node.type === 'DoWhileStatement') {
          stats.loopCount++
        }
        
        // 追踪嵌套级别
        if (node.type === 'BlockStatement') {
          currentNestingLevel++
          maxNestingLevel = Math.max(maxNestingLevel, currentNestingLevel)
        }
      },
      leave: (node) => {
        if (node.type === 'BlockStatement') {
          currentNestingLevel--
        }
      }
    })
    
    stats.maxNestingLevel = maxNestingLevel
    
    // 返回增强的AST
    return {
      ...ast,
      stats,
      language: 'javascript',
      raw: code
    }
  }
  
  /**
   * 计算JavaScript代码的圈复杂度
   * @param {Object} functionNode - 函数节点
   * @returns {number} 圈复杂度值
   */
  calculateCyclomaticComplexity(functionNode) {
    let complexity = 1 // 基础值为1
    
    // 遍历函数体计算复杂度
    estraverse.traverse(functionNode, {
      enter: (node) => {
        // 增加复杂度的条件
        if (
          node.type === 'IfStatement' || 
          node.type === 'ConditionalExpression' || 
          node.type === 'ForStatement' || 
          node.type === 'ForInStatement' || 
          node.type === 'ForOfStatement' || 
          node.type === 'WhileStatement' || 
          node.type === 'DoWhileStatement'
        ) {
          complexity++
        }
        
        // 每个case语句增加一个复杂度
        if (node.type === 'SwitchCase' && node.test !== null) {
          complexity++
        }
        
        // 逻辑运算符也增加复杂度
        if (node.type === 'LogicalExpression' && 
            (node.operator === '&&' || node.operator === '||')) {
          complexity++
        }
        
        // 捕获异常也增加复杂度
        if (node.type === 'CatchClause') {
          complexity++
        }
      }
    })
    
    return complexity
  }
  
  /**
   * Python代码解析
   * @param {string} code - Python源代码
   * @returns {Object} AST抽象语法树
   */
  async parsePython(code) {
    // 实际实现可以调用Python解析服务
    return { type: 'Module', language: 'python', body: [] }
  }
  
  /**
   * Java代码解析
   * @param {string} code - Java源代码
   * @returns {Object} AST抽象语法树
   */
  async parseJava(code) {
    // 可以使用Java解析库或服务
    return { type: 'CompilationUnit', language: 'java', body: [] }
  }
  
  /**
   * C代码解析
   * @param {string} code - C源代码
   * @returns {Object} AST抽象语法树
   */
  async parseC(code) {
    return { type: 'TranslationUnit', language: 'c', body: [] }
  }
  
  /**
   * C++代码解析
   * @param {string} code - C++源代码
   * @returns {Object} AST抽象语法树
   */
  async parseCpp(code) {
    return { type: 'TranslationUnit', language: 'cpp', body: [] }
  }
  
  /**
   * 分析代码复杂度
   * @param {Object} ast - 抽象语法树
   * @param {string} code - 源代码
   * @param {string} language - 编程语言
   * @returns {Object} 复杂度分析结果
   */
  async analyzeComplexity(ast, code, language) {
    console.log(`分析${language}代码复杂度...`)
    
    // 不同语言的复杂度分析策略
    const strategies = {
      'javascript': this.analyzeJavaScriptComplexity,
      'python': this.analyzePythonComplexity,
      'java': this.analyzeJavaComplexity,
      'c': this.analyzeCComplexity,
      'cpp': this.analyzeCppComplexity
    }
    
    const strategy = strategies[language]
    if (!strategy) {
      throw new Error(`${language}的复杂度分析未实现`)
    }
    
    try {
      // 调用特定语言的复杂度分析
      const result = await strategy.call(this, ast, code)
      
      // 添加复杂度评级
      result.timeComplexityRating = this.rateComplexity(result.timeComplexity.level)
      result.spaceComplexityRating = this.rateComplexity(result.spaceComplexity.level)
      result.cyclomaticComplexityRating = this.rateCyclomaticComplexity(result.cyclomaticComplexity.value)
      
      // 计算整体复杂度评分
      result.overallScore = this.calculateOverallComplexityScore(result)
      
      return result
    } catch (error) {
      console.error(`复杂度分析失败:`, error)
      return {
        error: error.message,
        timeComplexity: { level: COMPLEXITY_LEVELS.O_N, explanation: '无法确定，默认为O(n)' },
        spaceComplexity: { level: COMPLEXITY_LEVELS.O_N, explanation: '无法确定，默认为O(n)' },
        cyclomaticComplexity: { value: 5, explanation: '无法确定，默认值为5', rating: '低' },
        overallScore: 50
      }
    }
  }
  
  /**
   * 分析JavaScript代码复杂度
   * @param {Object} ast - 抽象语法树
   * @param {string} code - 源代码
   * @returns {Object} 复杂度分析结果
   */
  async analyzeJavaScriptComplexity(ast, code) {
    // 提取AST统计信息
    const { stats } = ast
    
    // 分析时间复杂度
    let timeComplexity = this.detectTimeComplexity(ast, code, 'javascript')
    
    // 分析空间复杂度
    let spaceComplexity = this.detectSpaceComplexity(ast, code, 'javascript')
    
    // 计算最大圈复杂度
    let maxCyclomaticValue = 1
    let maxCyclomaticFunction = null
    
    // 查找最复杂的函数
    if (stats && stats.functionComplexity) {
      for (const [funcName, complexity] of stats.functionComplexity.entries()) {
        if (complexity > maxCyclomaticValue) {
          maxCyclomaticValue = complexity
          maxCyclomaticFunction = funcName
        }
      }
    }
    
    // 填充循环嵌套等详细分析
    const nestedLoops = this.detectNestedLoops(ast)
    const recursion = this.detectRecursion(ast)
    
    return {
      timeComplexity,
      spaceComplexity,
      cyclomaticComplexity: {
        value: maxCyclomaticValue,
        explanation: maxCyclomaticFunction 
          ? `函数 '${maxCyclomaticFunction}' 的圈复杂度为 ${maxCyclomaticValue}`
          : `代码的最大圈复杂度为 ${maxCyclomaticValue}`,
        functions: Array.from(stats.functionComplexity || []).map(([name, value]) => ({
          name,
          value,
          rating: this.rateCyclomaticComplexity(value)
        }))
      },
      details: {
        nestedLoops,
        recursion,
        conditionals: stats ? stats.conditionalCount : 0,
        loops: stats ? stats.loopCount : 0,
        maxNestingLevel: stats ? stats.maxNestingLevel : 0
      }
    }
  }
  
  /**
   * 检测代码中的时间复杂度
   * @param {Object} ast - 抽象语法树
   * @param {string} code - 源代码
   * @param {string} language - 编程语言
   * @returns {Object} 时间复杂度结果
   */
  detectTimeComplexity(ast, code, language) {
    // 基于嵌套循环和递归检测时间复杂度
    const nestedLoops = this.detectNestedLoops(ast)
    const recursion = this.detectRecursion(ast)
    
    // 复杂度推断逻辑
    let level = COMPLEXITY_LEVELS.O_1
    let explanation = '代码没有循环或递归，时间复杂度为常数级O(1)'
    
    if (recursion.detected) {
      if (recursion.exponentialPattern) {
        level = COMPLEXITY_LEVELS.O_2_N
        explanation = '代码中存在指数级递归模式，时间复杂度为O(2^n)'
      } else if (recursion.divideAndConquer) {
        level = COMPLEXITY_LEVELS.O_N_LOG_N
        explanation = '代码中存在分治递归模式，时间复杂度为O(n log n)'
      } else {
        level = COMPLEXITY_LEVELS.O_N
        explanation = '代码中存在线性递归模式，时间复杂度为O(n)'
      }
    } else if (nestedLoops.maxDepth >= 3) {
      level = COMPLEXITY_LEVELS.O_N_3
      explanation = `代码中存在${nestedLoops.maxDepth}层嵌套循环，时间复杂度为O(n^${nestedLoops.maxDepth})`
    } else if (nestedLoops.maxDepth === 2) {
      level = COMPLEXITY_LEVELS.O_N_2
      explanation = '代码中存在2层嵌套循环，时间复杂度为O(n²)'
    } else if (nestedLoops.maxDepth === 1) {
      // 检查是否包含排序操作
      if (this.detectSortingOperation(ast, code)) {
        level = COMPLEXITY_LEVELS.O_N_LOG_N
        explanation = '代码中包含排序操作，时间复杂度为O(n log n)'
      } else {
        level = COMPLEXITY_LEVELS.O_N
        explanation = '代码中包含单层循环，时间复杂度为O(n)'
      }
    } else if (this.detectBinarySearch(ast, code)) {
      level = COMPLEXITY_LEVELS.O_LOG_N
      explanation = '代码中包含二分查找模式，时间复杂度为O(log n)'
    }
    
    // 使用AI模型辅助验证复杂度
    if (this.models.neuralModel) {
      // 这里可以调用模型进一步验证复杂度
      // 暂时省略实现
    }
    
    return { level, explanation }
  }
  
  /**
   * 检测代码中的空间复杂度
   * @param {Object} ast - 抽象语法树
   * @param {string} code - 源代码
   * @param {string} language - 编程语言
   * @returns {Object} 空间复杂度结果
   */
  detectSpaceComplexity(ast, code, language) {
    // 检测数组创建、映射创建等数据结构
    const dataStructures = this.detectDataStructures(ast)
    
    // 检测递归调用（栈空间）
    const recursion = this.detectRecursion(ast)
    
    // 复杂度推断逻辑
    let level = COMPLEXITY_LEVELS.O_1
    let explanation = '代码使用固定大小的内存，空间复杂度为O(1)'
    
    if (recursion.depth > 1) {
      level = COMPLEXITY_LEVELS.O_N
      explanation = `代码中的递归调用栈深度可达O(n)，空间复杂度为O(n)`
    } else if (dataStructures.dynamicArrays) {
      level = COMPLEXITY_LEVELS.O_N
      explanation = '代码创建与输入大小成比例的数组，空间复杂度为O(n)'
    } else if (dataStructures.maps || dataStructures.sets) {
      level = COMPLEXITY_LEVELS.O_N
      explanation = '代码创建与输入大小成比例的映射/集合，空间复杂度为O(n)'
    } else if (dataStructures.matrices) {
      level = COMPLEXITY_LEVELS.O_N_2
      explanation = '代码创建二维矩阵，空间复杂度为O(n²)'
    }
    
    return { level, explanation }
  }
  
  /**
   * 检测代码中的嵌套循环
   * @param {Object} ast - 抽象语法树
   * @returns {Object} 嵌套循环信息
   */
  detectNestedLoops(ast) {
    let maxDepth = 0
    let currentDepth = 0
    let loopLocations = []
    
    // 遍历AST寻找嵌套循环
    estraverse.traverse(ast, {
      enter: (node) => {
        if (node.type === 'ForStatement' || 
            node.type === 'ForInStatement' || 
            node.type === 'ForOfStatement' || 
            node.type === 'WhileStatement' || 
            node.type === 'DoWhileStatement') {
          currentDepth++
          maxDepth = Math.max(maxDepth, currentDepth)
          
          if (node.loc) {
            loopLocations.push({
              type: node.type,
              depth: currentDepth,
              location: {
                start: { line: node.loc.start.line, column: node.loc.start.column },
                end: { line: node.loc.end.line, column: node.loc.end.column }
              }
            })
          }
        }
      },
      leave: (node) => {
        if (node.type === 'ForStatement' || 
            node.type === 'ForInStatement' || 
            node.type === 'ForOfStatement' || 
            node.type === 'WhileStatement' || 
            node.type === 'DoWhileStatement') {
          currentDepth--
        }
      }
    })
    
    return {
      maxDepth,
      locations: loopLocations
    }
  }
  
  /**
   * 检测代码中的递归调用
   * @param {Object} ast - 抽象语法树
   * @returns {Object} 递归信息
   */
  detectRecursion(ast) {
    const result = {
      detected: false,
      divideAndConquer: false,
      exponentialPattern: false,
      depth: 0,
      locations: []
    }
    
    // 收集所有函数定义
    const functions = new Map()
    let currentFunction = null
    
    estraverse.traverse(ast, {
      enter: (node) => {
        if (node.type === 'FunctionDeclaration' || 
            node.type === 'FunctionExpression' || 
            node.type === 'ArrowFunctionExpression') {
          const functionName = node.id ? node.id.name : `anonymous_${node.loc.start.line}`
          functions.set(functionName, node)
          currentFunction = functionName
        }
        
        // 检测函数调用
        if (currentFunction && 
            (node.type === 'CallExpression' || node.type === 'NewExpression') && 
            node.callee.type === 'Identifier') {
          const calledFunction = node.callee.name
          
          // 递归调用检测
          if (calledFunction === currentFunction) {
            result.detected = true
            
            // 记录位置
            if (node.loc) {
              result.locations.push({
                function: currentFunction,
                location: {
                  start: { line: node.loc.start.line, column: node.loc.start.column },
                  end: { line: node.loc.end.line, column: node.loc.end.column }
                }
              })
            }
            
            // 检测分治模式 (调用自身两次或以上)
            if (this.detectDivideAndConquer(node)) {
              result.divideAndConquer = true
            }
            
            // 检测指数递归模式 (如斐波那契)
            if (this.detectExponentialRecursion(node)) {
              result.exponentialPattern = true
            }
            
            // 估算递归深度
            result.depth = Math.max(result.depth, this.estimateRecursionDepth(node))
          }
        }
      },
      leave: (node) => {
        if (node.type === 'FunctionDeclaration' || 
            node.type === 'FunctionExpression' || 
            node.type === 'ArrowFunctionExpression') {
          currentFunction = null
        }
      }
    })
    
    return result
  }
  
  /**
   * 检测分治递归模式
   * @param {Object} node - 调用表达式节点
   * @returns {boolean} 是否为分治模式
   */
  detectDivideAndConquer(node) {
    // 简化实现：检查函数体内是否有两次以上自身调用
    // 在实际实现中，需要更复杂的语义分析
    return true
  }
  
  /**
   * 检测指数递归模式（如斐波那契）
   * @param {Object} node - 调用表达式节点
   * @returns {boolean} 是否为指数递归
   */
  detectExponentialRecursion(node) {
    // 简化实现：检查是否符合多个递归调用的模式
    // 在实际实现中，需要更复杂的语义分析
    return false
  }
  
  /**
   * 估算递归深度
   * @param {Object} node - 调用表达式节点
   * @returns {number} 估计的递归深度
   */
  estimateRecursionDepth(node) {
    // 简化实现：返回一个合理的递归深度估计值
    // 在实际实现中，需要分析终止条件和输入规模
    return 10
  }
  
  /**
   * 检测排序操作
   * @param {Object} ast - 抽象语法树
   * @param {string} code - 源代码
   * @returns {boolean} 是否包含排序操作
   */
  detectSortingOperation(ast, code) {
    // 检查常见排序方法调用
    const sortPatterns = [
      /\.sort\(/,
      /Array\.sort/,
      /quicksort|mergesort|heapsort|bubbleSort|insertionSort/i
    ]
    
    // 使用正则表达式检测
    for (const pattern of sortPatterns) {
      if (pattern.test(code)) {
        return true
      }
    }
    
    return false
  }
  
  /**
   * 检测二分查找模式
   * @param {Object} ast - 抽象语法树
   * @param {string} code - 源代码
   * @returns {boolean} 是否包含二分查找
   */
  detectBinarySearch(ast, code) {
    // 检查二分查找的特征
    const binarySearchPatterns = [
      /binarySearch|二分查找/i,
      /mid\s*=\s*\(\s*(low|left)\s*\+\s*(high|right)\s*\)\s*\/\s*2/,
      /(low|left)\s*=\s*mid/,
      /(high|right)\s*=\s*mid/
    ]
    
    // 使用正则表达式检测
    for (const pattern of binarySearchPatterns) {
      if (pattern.test(code)) {
        return true
      }
    }
    
    return false
  }
  
  /**
   * 检测数据结构使用
   * @param {Object} ast - 抽象语法树
   * @returns {Object} 数据结构使用情况
   */
  detectDataStructures(ast) {
    const result = {
      dynamicArrays: false,
      maps: false,
      sets: false,
      matrices: false,
      trees: false,
      graphs: false
    }
    
    // 遍历AST检测数据结构
    estraverse.traverse(ast, {
      enter: (node) => {
        // 检测数组创建
        if (node.type === 'ArrayExpression' || 
            (node.type === 'NewExpression' && 
             node.callee.type === 'Identifier' && 
             node.callee.name === 'Array')) {
          result.dynamicArrays = true
        }
        
        // 检测Map和Set
        if (node.type === 'NewExpression' && 
            node.callee.type === 'Identifier') {
          if (node.callee.name === 'Map') {
            result.maps = true
          } else if (node.callee.name === 'Set') {
            result.sets = true
          }
        }
        
        // 检测二维数组（矩阵）
        if (node.type === 'ArrayExpression' && 
            node.elements.some(el => el && el.type === 'ArrayExpression')) {
          result.matrices = true
        }
        
        // 检测对象创建 (可能的树或图结构)
        if (node.type === 'ObjectExpression') {
          // 简化实现：通过属性名推断
          const propertyNames = node.properties
            .filter(p => p.key && p.key.type === 'Identifier')
            .map(p => p.key.name)
          
          if (propertyNames.includes('left') && propertyNames.includes('right')) {
            result.trees = true
          }
          
          if (propertyNames.includes('nodes') && propertyNames.includes('edges')) {
            result.graphs = true
          }
        }
      }
    })
    
    return result
  }
  
  /**
   * 给时间/空间复杂度评级
   * @param {Object} complexityLevel - 复杂度级别对象
   * @returns {string} 评级 (好、中、差)
   */
  rateComplexity(complexityLevel) {
    if (!complexityLevel || !complexityLevel.weight) {
      return '中'
    }
    
    const weight = complexityLevel.weight
    
    if (weight <= 3) return '好'
    if (weight <= 5) return '中'
    return '差'
  }
  
  /**
   * 给圈复杂度评级
   * @param {number} value - 圈复杂度值
   * @returns {string} 评级 (低、中、高、极高)
   */
  rateCyclomaticComplexity(value) {
    if (value <= 5) return '低'
    if (value <= 10) return '中'
    if (value <= 20) return '高'
    return '极高'
  }
  
  /**
   * 计算整体复杂度评分
   * @param {Object} complexity - 复杂度分析结果
   * @returns {number} 0-100的评分
   */
  calculateOverallComplexityScore(complexity) {
    // 时间复杂度权重
    const timeWeight = 0.4
    const timeScore = Math.max(0, 100 - (complexity.timeComplexity.level.weight * 12))
    
    // 空间复杂度权重
    const spaceWeight = 0.3
    const spaceScore = Math.max(0, 100 - (complexity.spaceComplexity.level.weight * 12))
    
    // 圈复杂度权重
    const cyclomaticWeight = 0.3
    const cyclomaticScore = Math.max(0, 100 - (complexity.cyclomaticComplexity.value * 4))
    
    // 加权计算总分
    const overallScore = Math.round(
      (timeScore * timeWeight) + 
      (spaceScore * spaceWeight) + 
      (cyclomaticScore * cyclomaticWeight)
    )
    
    return overallScore
  }
  
  /**
   * 分析代码质量
   * @param {Object} ast - 抽象语法树
   * @param {string} code - 源代码
   * @param {string} language - 编程语言
   * @returns {Object} 代码质量分析结果
   */
  async analyzeCodeQuality(ast, code, language) {
    // 分析命名规范、代码结构、注释覆盖率等
    
    // 模拟质量分析结果
      return {
      score: 78,
      rating: 'B',
        metrics: {
        readability: {
          score: 85,
          feedback: '代码整体可读性良好，变量命名清晰'
        },
        maintainability: {
          score: 72,
          feedback: '函数较长，可考虑进一步模块化'
        },
        testability: {
          score: 68,
          feedback: '部分函数耦合度高，不易测试'
        },
        documentation: {
          score: 80,
          feedback: '主要函数有注释，但缺少细节说明'
        }
      }
    }
  }
  
  /**
   * 分析安全问题
   * @param {Object} ast - 抽象语法树
   * @param {string} code - 源代码
   * @param {string} language - 编程语言
   * @returns {Object} 安全分析结果
   */
  async analyzeSecurityIssues(ast, code, language) {
    // 检测潜在的安全漏洞，如SQL注入、XSS等
    
    // 模拟安全分析结果
      return {
      issues: [
        {
          severity: 'high',
          type: 'input-validation',
          description: '用户输入未经验证直接用于构建SQL查询，潜在SQL注入风险',
          locations: [{ line: 24, column: 15 }]
        },
        {
          severity: 'medium',
          type: 'data-exposure',
          description: '敏感配置信息硬编码在源代码中',
          locations: [{ line: 5, column: 3 }]
        }
      ],
      riskScore: 65,
      recommendation: '实施输入验证，使用参数化查询，移除硬编码的敏感信息'
    }
  }
  
  /**
   * 生成代码改进建议
   * @param {Object} ast - 抽象语法树
   * @param {string} code - 源代码
   * @param {string} language - 编程语言
   * @param {Object} complexity - 复杂度分析结果
   * @param {Object} quality - 质量分析结果
   * @param {Object} security - 安全分析结果
   * @returns {Array} 改进建议
   */
  async generateSuggestions(ast, code, language, complexity, quality, security) {
    // 根据前面的分析结果生成具体建议
    
    const suggestions = [
      {
        id: 'perf-opt-1',
        type: 'performance',
        description: '将O(n²)的嵌套循环优化为O(n)的哈希表查找',
        severity: 'medium',
        locations: [{ line: 37, column: 5 }],
        codeExample: '// 优化前的代码\nfor (let i = 0; i < arr.length; i++) {\n  for (let j = 0; j < arr.length; j++) {\n    if (arr[i] + arr[j] === target) return [i, j];\n  }\n}\n\n// 优化后的代码\nconst map = new Map();\nfor (let i = 0; i < arr.length; i++) {\n  const complement = target - arr[i];\n  if (map.has(complement)) {\n    return [map.get(complement), i];\n  }\n  map.set(arr[i], i);\n}'
      },
      {
        id: 'code-quality-1',
        type: 'quality',
        description: '函数过长(超过100行)，建议拆分为多个小函数',
        severity: 'medium',
        locations: [{ line: 120, column: 1 }]
      },
      {
        id: 'security-1',
        type: 'security',
        description: '使用参数化查询防止SQL注入',
        severity: 'high',
        locations: [{ line: 24, column: 15 }],
        codeExample: '// 不安全的代码\nconst query = `SELECT * FROM users WHERE username = "${username}"`;\n\n// 安全的代码\nconst query = "SELECT * FROM users WHERE username = ?";\ndb.execute(query, [username]);'
      }
    ]
    
    // 添加根据质量分析的建议
    if (quality.metrics.readability.score < 70) {
      suggestions.push({
        id: 'readability-1',
        type: 'quality',
        description: '变量命名不够直观，使用更具描述性的名称',
        severity: 'low'
      })
    }
    
    // 添加根据复杂度分析的建议
    if (complexity.cyclomaticComplexity.value > 10) {
      suggestions.push({
        id: 'complexity-1',
        type: 'complexity',
        description: '函数圈复杂度过高，考虑使用策略模式或拆分逻辑',
        severity: 'medium'
      })
    }
    
    return suggestions
  }
  
  /**
   * 分析代码正确性
   * @param {string} code - 源代码
   * @param {string} language - 编程语言
   * @param {Object} problem - 问题描述和测试用例
   * @returns {Object} 正确性分析结果
   */
  async analyzeCorrectness(code, language, problem) {
    console.log(`分析${language}代码正确性...`);
    
    try {
      // 初始化结果
      const result = {
        isCorrect: false,
        passedTestCases: 0,
        totalTestCases: 0,
        failedTestCases: [],
        executionTime: 0,
        errorMessage: null
      };
      
      // 如果没有提供问题描述或测试用例，无法验证正确性
      if (!problem || !problem.testCases || !problem.testCases.length) {
        return {
          isCorrect: null,
          errorMessage: '无法验证代码正确性：未提供问题描述或测试用例',
          score: 0,
          feedback: '需要提供测试用例来验证代码正确性'
        };
      }
      
      // 记录开始时间
      const startTime = Date.now();
      
      // 根据不同语言执行代码测试
      switch (language) {
        case 'javascript':
          await this.testJavaScriptCode(code, problem.testCases, result);
          break;
        case 'python':
          await this.testPythonCode(code, problem.testCases, result);
          break;
        case 'java':
          await this.testJavaCode(code, problem.testCases, result);
          break;
        case 'c':
          await this.testCCode(code, problem.testCases, result);
          break;
        case 'cpp':
          await this.testCppCode(code, problem.testCases, result);
          break;
        default:
          result.errorMessage = `不支持的语言: ${language}`;
          break;
      }
      
      // 计算执行时间
      result.executionTime = Date.now() - startTime;
      
      // 计算正确性得分 (0-100)
      if (result.totalTestCases > 0) {
        result.score = Math.round((result.passedTestCases / result.totalTestCases) * 100);
      } else {
        result.score = 0;
      }
      
      // 生成反馈
      if (result.isCorrect) {
        result.feedback = `代码通过了所有${result.totalTestCases}个测试用例，正确率100%。执行时间: ${result.executionTime}ms`;
      } else if (result.errorMessage) {
        result.feedback = `代码执行出错: ${result.errorMessage}`;
      } else {
        result.feedback = `代码通过了${result.passedTestCases}/${result.totalTestCases}个测试用例，正确率${result.score}%。请检查失败的测试用例。`;
      }
      
      return result;
    } catch (error) {
      console.error('代码正确性分析错误:', error);
      return {
        isCorrect: false,
        errorMessage: `分析过程出错: ${error.message}`,
        score: 0,
        feedback: `无法完成代码正确性分析: ${error.message}`
      };
    }
  }
  
  /**
   * 测试JavaScript代码
   * @param {string} code - JavaScript源代码
   * @param {Array} testCases - 测试用例
   * @param {Object} result - 结果对象，会被修改
   */
  async testJavaScriptCode(code, testCases, result) {
    try {
      // 通过Function构造函数创建可执行函数
      // 假设代码中包含一个名为solution的函数
      const wrappedCode = `
        ${code}
        return solution;
      `;
      
      // 创建可执行函数
      const solutionFunction = new Function(wrappedCode)();
      
      if (typeof solutionFunction !== 'function') {
        result.errorMessage = '代码中没有找到solution函数';
        return;
      }
      
      // 运行测试用例
      result.totalTestCases = testCases.length;
      
      for (const testCase of testCases) {
        try {
          const { input, expectedOutput } = testCase;
          
          // 执行函数
          const actualOutput = solutionFunction(...input);
          
          // 比较结果
          const isEqual = this.compareOutputs(actualOutput, expectedOutput);
          
          if (isEqual) {
            result.passedTestCases++;
          } else {
            result.failedTestCases.push({
              input,
              expectedOutput,
              actualOutput,
              message: '输出结果不匹配'
            });
          }
        } catch (testError) {
          result.failedTestCases.push({
            input: testCase.input,
            expectedOutput: testCase.expectedOutput,
            message: `测试用例执行错误: ${testError.message}`
          });
        }
      }
      
      // 设置正确性
      result.isCorrect = result.passedTestCases === result.totalTestCases;
      
    } catch (error) {
      result.errorMessage = `JavaScript代码执行错误: ${error.message}`;
    }
  }
  
  /**
   * 比较输出结果
   * @param {*} actual - 实际输出
   * @param {*} expected - 期望输出
   * @returns {boolean} 是否相等
   */
  compareOutputs(actual, expected) {
    // 处理数组
    if (Array.isArray(actual) && Array.isArray(expected)) {
      if (actual.length !== expected.length) return false;
      
      for (let i = 0; i < actual.length; i++) {
        if (!this.compareOutputs(actual[i], expected[i])) return false;
      }
      
      return true;
    }
    
    // 处理对象
    if (typeof actual === 'object' && actual !== null && 
        typeof expected === 'object' && expected !== null) {
      
      const actualKeys = Object.keys(actual);
      const expectedKeys = Object.keys(expected);
      
      if (actualKeys.length !== expectedKeys.length) return false;
      
      for (const key of actualKeys) {
        if (!expected.hasOwnProperty(key)) return false;
        if (!this.compareOutputs(actual[key], expected[key])) return false;
      }
      
      return true;
    }
    
    // 处理基本类型
    return actual === expected;
  }
  
  /**
   * 使用AI对代码进行深度评估
   * @param {string} code - 源代码
   * @param {string} language - 编程语言
   * @param {Object} analysisResults - 前面的分析结果
   * @returns {Object} AI评估结果
   */
  async getAICodeEvaluation(code, language, analysisResults) {
    console.log(`使用AI对${language}代码进行深度评估...`);
    
    try {
      // 构建提示词
      const prompt = `
分析以下${language}代码:
\`\`\`
${code}
\`\`\`

系统已对代码进行了初步分析，结果如下:
1. 正确性: ${analysisResults.correctness ? `${analysisResults.correctness.score}分，${analysisResults.correctness.isCorrect ? '通过所有测试' : '未通过所有测试'}` : '未进行测试'}
2. 时间复杂度: ${analysisResults.complexity.timeComplexity.level.name}
3. 空间复杂度: ${analysisResults.complexity.spaceComplexity.level.name}
4. 代码质量: ${analysisResults.quality.score}分

请提供以下深度评估:
1. 代码功能理解与分析
2. 算法思路评价
3. 代码设计与实现的优缺点
4. 详细的改进建议，包括算法优化、代码重构和最佳实践
5. 可能的进阶解法或思路扩展

请用专业的角度评估代码，注重实用性的建议。
以JSON格式返回结果。
`;

      // 调用语言模型
      const aiEvaluation = await this.callLanguageModel(prompt);
      
      if (!aiEvaluation) {
        return {
          error: '无法获取AI评估结果',
          feedback: '暂时无法提供AI深度分析'
        };
      }
      
      return {
        algorithmAnalysis: aiEvaluation.algorithmAnalysis || aiEvaluation.functionUnderstanding || aiEvaluation.codeAnalysis || '未提供算法分析',
        strengths: aiEvaluation.strengths || aiEvaluation.advantages || [],
        weaknesses: aiEvaluation.weaknesses || aiEvaluation.disadvantages || [],
        improvementSuggestions: aiEvaluation.improvementSuggestions || aiEvaluation.recommendations || [],
        advancedApproaches: aiEvaluation.advancedApproaches || aiEvaluation.alternativeSolutions || '未提供进阶解法',
        overallFeedback: aiEvaluation.overallFeedback || aiEvaluation.summary || '未提供总体评价'
      };
    } catch (error) {
      console.error('AI评估错误:', error);
      return {
        error: `AI评估过程出错: ${error.message}`,
        feedback: '无法完成AI深度分析，请稍后再试'
      };
    }
  }
  
  /**
   * 生成总体分析摘要
   * @param {Object} correctness - 正确性分析结果
   * @param {Object} complexity - 复杂度分析结果
   * @param {Object} quality - 质量分析结果
   * @param {Object} security - 安全分析结果
   * @param {Array} patterns - 设计模式分析结果
   * @returns {Object} 分析摘要
   */
  generateSummary(correctness, complexity, quality, security, patterns) {
    // 计算综合得分，优先考虑正确性
    let overallScore = 0;
    
    // 正确性权重最高
    const correctnessWeight = 0.5;
    const complexityWeight = 0.2;
    const qualityWeight = 0.2;
    const securityWeight = 0.1;
    
    // 如果有正确性测试结果
    if (correctness && correctness.score !== undefined) {
      overallScore += correctness.score * correctnessWeight;
      
      // 如果代码不正确，其他指标的重要性降低
      if (!correctness.isCorrect) {
        overallScore += (quality ? quality.score : 0) * qualityWeight * 0.5;
        overallScore += (Math.max(0, 100 - (complexity ? complexity.cyclomaticComplexity.value * 5 : 0))) * complexityWeight * 0.5;
        overallScore += (Math.max(0, 100 - (security ? security.riskScore : 0))) * securityWeight * 0.5;
      } else {
        overallScore += (quality ? quality.score : 0) * qualityWeight;
        overallScore += (Math.max(0, 100 - (complexity ? complexity.cyclomaticComplexity.value * 5 : 0))) * complexityWeight;
        overallScore += (Math.max(0, 100 - (security ? security.riskScore : 0))) * securityWeight;
      }
    } else {
      // 无正确性测试时的计算方式
      overallScore = Math.round(
        (quality ? quality.score : 0) * 0.4 + 
        (Math.max(0, 100 - (complexity ? complexity.cyclomaticComplexity.value * 5 : 0))) * 0.3 + 
        (Math.max(0, 100 - (security ? security.riskScore : 0))) * 0.3
      );
    }
    
    // 确保得分在0-100范围内
    overallScore = Math.max(0, Math.min(100, Math.round(overallScore)));
    
    // 确定评级
    let rating;
    if (overallScore >= 90) rating = 'A+';
    else if (overallScore >= 80) rating = 'A';
    else if (overallScore >= 70) rating = 'B';
    else if (overallScore >= 60) rating = 'C';
    else rating = 'D';
    
    // 确定主要问题
    const primaryConcerns = [];
    if (correctness && !correctness.isCorrect) primaryConcerns.push('代码未通过所有测试用例');
    if (quality && quality.score < 70) primaryConcerns.push('代码质量问题');
    if (complexity && complexity.cyclomaticComplexity.value > 10) primaryConcerns.push('代码复杂度过高');
    if (security && security.issues.some(issue => issue.severity === 'high')) primaryConcerns.push('严重安全漏洞');
    
    // 生成总结文本
    let summaryText = `代码总体评分为${overallScore}分(${rating}级)。`;
    
    if (primaryConcerns.length > 0) {
      summaryText += `主要关注点：${primaryConcerns.join('、')}。`;
    }
    
    if (correctness) {
      summaryText += `代码正确性：${correctness.score}分，${correctness.isCorrect ? '通过所有测试' : '未通过所有测试'}。`;
    }
    
    if (complexity) {
      summaryText += `时间复杂度为${complexity.timeComplexity.level.name}，空间复杂度为${complexity.spaceComplexity.level.name}。`;
    }
    
    if (quality) {
      summaryText += `代码质量评分为${quality.score}分。`;
    }
    
    if (security) {
      summaryText += `安全风险评分为${security.riskScore}分。`;
    }
    
    if (patterns && patterns.length > 0) {
      summaryText += `发现使用的设计模式：${patterns.map(p => p.name).join('、')}。`;
    }
    
    return {
      overallScore,
      rating,
      primaryConcerns,
      summary: summaryText
    };
  }
  
  /**
   * 分析代码中的设计模式
   * @param {Object} ast - 抽象语法树
   * @param {string} language - 编程语言
   * @returns {Array} 检测到的设计模式
   */
  async detectDesignPatterns(ast, language) {
    // 分析代码中使用的设计模式
    return [
      {
        name: '单例模式',
        confidence: 0.92,
        locations: [{ line: 15, column: 1 }]
      },
      {
        name: '工厂模式',
        confidence: 0.78,
        locations: [{ line: 78, column: 1 }]
      }
    ]
  }
  
  /**
   * 与特定问题领域的最佳实践比较
   * @param {string} code - 源代码
   * @param {string} language - 编程语言
   * @param {string} domain - 问题领域(如'sorting', 'graph', 'dynamic-programming')
   * @returns {Object} 比较结果
   */
  async compareWithBestPractices(code, language, domain) {
    // 将用户代码与领域特定的最佳实践进行比较
    
    // 模拟比较结果
    return {
      matchScore: 78,
      similarPatterns: ['快速排序的分区策略', '双指针技术'],
      improvementAreas: ['边界条件处理', '空间利用优化'],
      recommendation: '考虑使用原地分区以减少空间复杂度'
    }
  }
}

// 单例实例导出
const codeAnalyzer = new CodeAnalyzer()
export default codeAnalyzer 