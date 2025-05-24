/**
 * 知识图谱与学习路径推荐系统
 * 
 * 这个系统提供以下功能：
 * 1. 构建编程知识图谱 - 建立知识点之间的关联
 * 2. 学习路径生成 - 基于知识依赖关系推荐最优学习路径
 * 3. 知识点识别与映射 - 将用户学习记录映射到知识图谱
 * 4. 个性化推荐 - 基于用户已掌握知识推荐下一步学习内容
 */

// 知识点节点类
class KnowledgeNode {
  constructor(id, properties = {}) {
    this.id = id
    this.properties = {
      name: properties.name || id,
      category: properties.category || 'general',
      difficulty: properties.difficulty || 'medium',
      description: properties.description || '',
      prerequisites: properties.prerequisites || [],
      relatedConcepts: properties.relatedConcepts || [],
      ...properties
    }
    this.outgoingEdges = [] // 出边 - 指向需要此知识点的其他知识点
    this.incomingEdges = [] // 入边 - 指向此知识点的前置知识点
  }
  
  // 添加出边
  addOutgoingEdge(edge) {
    if (!this.outgoingEdges.some(e => e.target === edge.target)) {
      this.outgoingEdges.push(edge)
    }
  }
  
  // 添加入边
  addIncomingEdge(edge) {
    if (!this.incomingEdges.some(e => e.source === edge.source)) {
      this.incomingEdges.push(edge)
    }
  }
  
  // 获取所有前置节点ID
  getPrerequisiteIds() {
    return this.incomingEdges.map(edge => edge.source)
  }
  
  // 获取所有后续节点ID
  getNextNodeIds() {
    return this.outgoingEdges.map(edge => edge.target)
  }
}

// 知识边类
class KnowledgeEdge {
  constructor(source, target, properties = {}) {
    this.source = source // 源节点ID
    this.target = target // 目标节点ID
    this.properties = {
      type: properties.type || 'requires', // 默认类型: 需要
      weight: properties.weight || 1.0, // 权重/重要性
      ...properties
    }
  }
}

// 知识图谱类
export class KnowledgeGraph {
  constructor() {
    this.nodes = new Map() // 节点集合, key为节点ID
    this.edges = new Map() // 边集合, key为"sourceId-targetId"
    this.categories = new Set() // 知识分类集合
    this.difficultyLevels = ['beginner', 'easy', 'medium', 'hard', 'expert']
  }
  
  /**
   * 添加知识点节点
   * @param {string} id - 节点唯一标识符
   * @param {Object} properties - 节点属性
   * @returns {KnowledgeNode} 创建的节点
   */
  addNode(id, properties = {}) {
    if (!this.nodes.has(id)) {
      const node = new KnowledgeNode(id, properties)
      this.nodes.set(id, node)
      
      // 添加分类到分类集合
      if (properties.category) {
        this.categories.add(properties.category)
      }
      
      return node
    }
    return this.nodes.get(id)
  }
  
  /**
   * 添加知识关联边
   * @param {string} sourceId - 源节点ID
   * @param {string} targetId - 目标节点ID
   * @param {Object} properties - 边属性
   * @returns {KnowledgeEdge} 创建的边
   */
  addEdge(sourceId, targetId, properties = {}) {
    const edgeKey = `${sourceId}-${targetId}`
    
    if (!this.edges.has(edgeKey)) {
      // 确保节点存在
      if (!this.nodes.has(sourceId)) {
        this.addNode(sourceId)
      }
      
      if (!this.nodes.has(targetId)) {
        this.addNode(targetId)
      }
      
      const edge = new KnowledgeEdge(sourceId, targetId, properties)
      this.edges.set(edgeKey, edge)
      
      // 更新节点的边信息
      const sourceNode = this.nodes.get(sourceId)
      const targetNode = this.nodes.get(targetId)
      
      sourceNode.addOutgoingEdge(edge)
      targetNode.addIncomingEdge(edge)
      
      return edge
    }
    
    return this.edges.get(edgeKey)
  }
  
  /**
   * 获取节点
   * @param {string} id - 节点ID
   * @returns {KnowledgeNode|null} 知识点节点
   */
  getNode(id) {
    return this.nodes.get(id) || null
  }
  
  /**
   * 获取边
   * @param {string} sourceId - 源节点ID
   * @param {string} targetId - 目标节点ID
   * @returns {KnowledgeEdge|null} 知识关联边
   */
  getEdge(sourceId, targetId) {
    return this.edges.get(`${sourceId}-${targetId}`) || null
  }
  
  /**
   * 获取指定分类的所有节点
   * @param {string} category - 知识分类
   * @returns {Array<KnowledgeNode>} 节点数组
   */
  getNodesByCategory(category) {
    const result = []
    for (const node of this.nodes.values()) {
      if (node.properties.category === category) {
        result.push(node)
      }
    }
    return result
  }
  
  /**
   * 获取指定难度的所有节点
   * @param {string} difficulty - 难度级别
   * @returns {Array<KnowledgeNode>} 节点数组
   */
  getNodesByDifficulty(difficulty) {
    const result = []
    for (const node of this.nodes.values()) {
      if (node.properties.difficulty === difficulty) {
        result.push(node)
      }
    }
    return result
  }
  
  /**
   * 获取节点的所有前置知识点
   * @param {string} nodeId - 节点ID
   * @returns {Array<KnowledgeNode>} 前置知识点数组
   */
  getPrerequisites(nodeId) {
    const node = this.getNode(nodeId)
    if (!node) return []
    
    return node.getPrerequisiteIds().map(id => this.getNode(id))
  }
  
  /**
   * 获取依赖指定知识点的所有后续知识点
   * @param {string} nodeId - 节点ID
   * @returns {Array<KnowledgeNode>} 后续知识点数组
   */
  getDependentNodes(nodeId) {
    const node = this.getNode(nodeId)
    if (!node) return []
    
    return node.getNextNodeIds().map(id => this.getNode(id))
  }
  
  /**
   * 检查知识点之间是否存在依赖路径
   * @param {string} startId - 起始节点ID
   * @param {string} endId - 目标节点ID
   * @returns {boolean} 是否存在路径
   */
  hasPath(startId, endId) {
    const visited = new Set()
    const queue = [startId]
    
    while (queue.length > 0) {
      const currentId = queue.shift()
      
      if (currentId === endId) {
        return true
      }
      
      if (!visited.has(currentId)) {
        visited.add(currentId)
        
        const node = this.getNode(currentId)
        if (node) {
          queue.push(...node.getNextNodeIds())
        }
      }
    }
    
    return false
  }
  
  /**
   * 查找两个知识点之间的最短路径
   * @param {string} startId - 起始节点ID
   * @param {string} endId - 目标节点ID
   * @returns {Array<string>} 节点ID路径
   */
  findShortestPath(startId, endId) {
    // 使用广度优先搜索(BFS)找最短路径
    const visited = new Set()
    const queue = [[startId]] // 队列元素是路径数组
    
    while (queue.length > 0) {
      const path = queue.shift()
      const currentId = path[path.length - 1]
      
      if (currentId === endId) {
        return path
      }
      
      if (!visited.has(currentId)) {
        visited.add(currentId)
        
        const node = this.getNode(currentId)
        if (node) {
          for (const nextId of node.getNextNodeIds()) {
            if (!visited.has(nextId)) {
              queue.push([...path, nextId])
            }
          }
        }
      }
    }
    
    return [] // 没有找到路径
  }
  
  /**
   * 基于已有知识推荐下一步学习内容
   * @param {Array<string>} knownNodeIds - 已掌握的知识点ID数组
   * @param {Object} options - 推荐选项
   * @returns {Array<KnowledgeNode>} 推荐的知识点数组
   */
  recommendNextNodes(knownNodeIds, options = {}) {
    const {
      limit = 5,
      category = null,
      maxDifficulty = null
    } = options
    
    const candidates = new Map() // 候选节点及其得分
    const knownSet = new Set(knownNodeIds)
    
    // 遍历已知节点，查找可学习的后续节点
    for (const knownId of knownNodeIds) {
      const node = this.getNode(knownId)
      if (!node) continue
      
      for (const edge of node.outgoingEdges) {
        const nextId = edge.target
        
        // 跳过已知节点
        if (knownSet.has(nextId)) continue
        
        const nextNode = this.getNode(nextId)
        if (!nextNode) continue
        
        // 应用分类过滤
        if (category && nextNode.properties.category !== category) continue
        
        // 应用难度过滤
        if (maxDifficulty) {
          const difficultyIndex = this.difficultyLevels.indexOf(nextNode.properties.difficulty)
          const maxDifficultyIndex = this.difficultyLevels.indexOf(maxDifficulty)
          if (difficultyIndex > maxDifficultyIndex) continue
        }
        
        // 检查前置条件是否满足
        const prerequisites = nextNode.getPrerequisiteIds()
        const missingPrerequisites = prerequisites.filter(id => !knownSet.has(id))
        
        if (missingPrerequisites.length > 0) {
          // 如果缺少前置知识，可以降低推荐分数但不完全排除
          const completionRatio = 1 - (missingPrerequisites.length / prerequisites.length)
          candidates.set(nextId, (candidates.get(nextId) || 0) + edge.properties.weight * completionRatio * 0.5)
        } else {
          // 所有前置条件都满足，增加推荐分数
          candidates.set(nextId, (candidates.get(nextId) || 0) + edge.properties.weight)
        }
      }
    }
    
    // 排序并返回推荐的节点
    return Array.from(candidates.entries())
      .sort((a, b) => b[1] - a[1]) // 按得分降序排序
      .slice(0, limit) // 限制结果数量
      .map(([id, score]) => ({
        ...this.getNode(id),
        recommendationScore: score
      }))
  }
  
  /**
   * 生成从初学者到专家的学习路径
   * @param {string} category - 知识分类
   * @returns {Array<Array<KnowledgeNode>>} 分阶段学习路径
   */
  generateLearningPath(category) {
    const path = []
    
    // 按难度等级分组节点
    for (const difficulty of this.difficultyLevels) {
      const nodesForLevel = this.getNodesByCategory(category)
        .filter(node => node.properties.difficulty === difficulty)
      
      if (nodesForLevel.length > 0) {
        // 对同一难度级别的节点进行排序
        // 尽量保证前置节点在后续节点之前
        const sortedNodes = this.topologicalSort(nodesForLevel)
        path.push(sortedNodes)
      }
    }
    
    return path
  }
  
  /**
   * 对节点进行拓扑排序
   * @param {Array<KnowledgeNode>} nodes - 节点数组
   * @returns {Array<KnowledgeNode>} 排序后的节点
   */
  topologicalSort(nodes) {
    const result = []
    const visited = new Set()
    const visiting = new Set()
    
    // 深度优先搜索函数
    const dfs = (nodeId) => {
      if (visiting.has(nodeId)) {
        // 检测到环，简单处理直接跳过
        return
      }
      
      if (visited.has(nodeId)) {
        return
      }
      
      visiting.add(nodeId)
      
      const node = this.getNode(nodeId)
      if (node) {
        for (const prerequisiteId of node.getPrerequisiteIds()) {
          dfs(prerequisiteId)
        }
      }
      
      visiting.delete(nodeId)
      visited.add(nodeId)
      result.unshift(node) // 前置节点在前，所以使用unshift
    }
    
    // 对每个节点执行DFS
    for (const node of nodes) {
      if (!visited.has(node.id)) {
        dfs(node.id)
      }
    }
    
    return result.filter(node => nodes.some(n => n.id === node.id))
  }
  
  /**
   * 生成完整的知识图谱数据(可用于可视化)
   * @returns {Object} 可视化数据
   */
  generateGraphData() {
    const nodes = Array.from(this.nodes.values()).map(node => ({
      id: node.id,
      label: node.properties.name,
      category: node.properties.category,
      difficulty: node.properties.difficulty,
      description: node.properties.description
    }))
    
    const edges = Array.from(this.edges.values()).map(edge => ({
      source: edge.source,
      target: edge.target,
      type: edge.properties.type,
      weight: edge.properties.weight
    }))
    
    return { nodes, edges, categories: Array.from(this.categories) }
  }
  
  /**
   * 从JSON加载知识图谱
   * @param {Object} data - 图谱数据
   * @returns {KnowledgeGraph} 知识图谱实例
   */
  static fromJson(data) {
    const graph = new KnowledgeGraph()
    
    // 先添加所有节点
    if (data.nodes) {
      for (const nodeData of data.nodes) {
        graph.addNode(nodeData.id, nodeData.properties || {})
      }
    }
    
    // 再添加所有边
    if (data.edges) {
      for (const edgeData of data.edges) {
        graph.addEdge(
          edgeData.source,
          edgeData.target,
          edgeData.properties || {}
        )
      }
    }
    
    return graph
  }
  
  /**
   * 导出为JSON
   * @returns {Object} 图谱JSON表示
   */
  toJson() {
    return {
      nodes: Array.from(this.nodes.values()).map(node => ({
        id: node.id,
        properties: node.properties
      })),
      edges: Array.from(this.edges.values()).map(edge => ({
        source: edge.source,
        target: edge.target,
        properties: edge.properties
      })),
      categories: Array.from(this.categories)
    }
  }
}

// 初始化基础知识图谱
export const initializeKnowledgeGraph = () => {
  const graph = new KnowledgeGraph()
  
  // 算法基础知识点
  graph.addNode('algo-intro', {
    name: '算法导论',
    category: 'algorithm',
    difficulty: 'beginner',
    description: '算法的基本概念、复杂度分析'
  })
  
  graph.addNode('data-structures', {
    name: '基本数据结构',
    category: 'algorithm',
    difficulty: 'beginner',
    description: '数组、链表、栈、队列'
  })
  
  graph.addNode('recursion', {
    name: '递归',
    category: 'algorithm',
    difficulty: 'easy',
    description: '递归原理和基本应用'
  })
  
  graph.addNode('sorting', {
    name: '排序算法',
    category: 'algorithm',
    difficulty: 'easy',
    description: '冒泡排序、插入排序、选择排序、归并排序、快速排序'
  })
  
  graph.addNode('searching', {
    name: '搜索算法',
    category: 'algorithm',
    difficulty: 'easy',
    description: '顺序搜索、二分搜索'
  })
  
  graph.addNode('adv-data-structures', {
    name: '高级数据结构',
    category: 'algorithm',
    difficulty: 'medium',
    description: '树、图、堆、哈希表'
  })
  
  graph.addNode('graph-algo', {
    name: '图算法',
    category: 'algorithm',
    difficulty: 'medium',
    description: 'BFS、DFS、最短路径、最小生成树'
  })
  
  graph.addNode('dynamic-programming', {
    name: '动态规划',
    category: 'algorithm',
    difficulty: 'hard',
    description: '动态规划原理和应用'
  })
  
  graph.addNode('greedy', {
    name: '贪心算法',
    category: 'algorithm',
    difficulty: 'medium',
    description: '贪心策略与应用场景'
  })
  
  graph.addNode('divide-conquer', {
    name: '分治算法',
    category: 'algorithm',
    difficulty: 'medium',
    description: '问题分解与合并'
  })
  
  graph.addNode('advanced-algo', {
    name: '高级算法思想',
    category: 'algorithm',
    difficulty: 'expert',
    description: '回溯、分支限界、近似算法'
  })
  
  // 添加知识依赖关系
  graph.addEdge('algo-intro', 'data-structures', { weight: 1.0 })
  graph.addEdge('data-structures', 'recursion', { weight: 0.8 })
  graph.addEdge('data-structures', 'sorting', { weight: 0.9 })
  graph.addEdge('data-structures', 'searching', { weight: 0.9 })
  graph.addEdge('recursion', 'adv-data-structures', { weight: 0.7 })
  graph.addEdge('sorting', 'adv-data-structures', { weight: 0.6 })
  graph.addEdge('searching', 'adv-data-structures', { weight: 0.6 })
  graph.addEdge('adv-data-structures', 'graph-algo', { weight: 0.9 })
  graph.addEdge('recursion', 'dynamic-programming', { weight: 0.8 })
  graph.addEdge('adv-data-structures', 'dynamic-programming', { weight: 0.7 })
  graph.addEdge('adv-data-structures', 'greedy', { weight: 0.7 })
  graph.addEdge('sorting', 'divide-conquer', { weight: 0.8 })
  graph.addEdge('recursion', 'divide-conquer', { weight: 0.9 })
  graph.addEdge('dynamic-programming', 'advanced-algo', { weight: 0.8 })
  graph.addEdge('greedy', 'advanced-algo', { weight: 0.7 })
  graph.addEdge('divide-conquer', 'advanced-algo', { weight: 0.7 })
  graph.addEdge('graph-algo', 'advanced-algo', { weight: 0.8 })
  
  return graph
}

// 默认导出初始化的知识图谱
const knowledgeGraph = initializeKnowledgeGraph()
export default knowledgeGraph 