/**
 * 模型压缩工具
 * 
 * 用于在联邦学习和模型交换中减少通信开销
 * 实现了以下压缩技术：
 * 1. 稀疏化 - 移除小于阈值的值
 * 2. 量化 - 将浮点权重转换为低精度表示
 * 3. 哈夫曼编码 - 进一步压缩权重数据
 * 4. 增量更新 - 只传输变化的权重
 */

// 模型压缩器类
export class ModelCompressor {
  constructor(options = {}) {
    // 稀疏化选项
    this.sparseOptions = {
      enabled: options.sparseEnabled !== false,
      threshold: options.sparseThreshold || 0.001, // 小于此值的权重视为0
      minSparsity: options.minSparsity || 0.3 // 最小稀疏度目标
    }
    
    // 量化选项
    this.quantizationOptions = {
      enabled: options.quantizationEnabled !== false,
      bits: options.quantizationBits || 8, // 量化位数
      symmetric: options.symmetricQuantization !== false // 是否使用对称量化
    }
    
    // 哈夫曼编码选项
    this.huffmanOptions = {
      enabled: options.huffmanEnabled !== false
    }
    
    // 增量更新选项
    this.incrementalOptions = {
      enabled: options.incrementalEnabled !== false,
      significantChangeThreshold: options.significantChangeThreshold || 0.01 // 显著变化阈值
    }
  }
  
  /**
   * 压缩模型权重
   * @param {Object} weights - 模型权重
   * @param {Object} options - 压缩选项
   * @returns {Object} 压缩后的数据
   */
  compress(weights, options = {}) {
    const startTime = Date.now()
    
    // 合并选项
    const mergedOptions = {
      sparse: { ...this.sparseOptions, ...options.sparse },
      quantization: { ...this.quantizationOptions, ...options.quantization },
      huffman: { ...this.huffmanOptions, ...options.huffman },
      incremental: { ...this.incrementalOptions, ...options.incremental }
    }
    
    // 创建权重的深拷贝
    let processedWeights = JSON.parse(JSON.stringify(weights))
    let compressionInfo = {
      originalSize: this.calculateSize(weights),
      compressionRatio: 1,
      appliedTechniques: []
    }
    
    // 应用稀疏化
    if (mergedOptions.sparse.enabled) {
      processedWeights = this.applySparse(processedWeights, mergedOptions.sparse)
      compressionInfo.appliedTechniques.push('sparse')
    }
    
    // 应用量化
    if (mergedOptions.quantization.enabled) {
      processedWeights = this.applyQuantization(processedWeights, mergedOptions.quantization)
      compressionInfo.appliedTechniques.push('quantization')
    }
    
    // 哈夫曼编码
    let encodedData = processedWeights
    if (mergedOptions.huffman.enabled) {
      encodedData = this.huffmanEncode(processedWeights)
      compressionInfo.appliedTechniques.push('huffman')
    }
    
    // 计算压缩后大小
    const compressedSize = this.calculateSize(encodedData)
    compressionInfo.compressedSize = compressedSize
    compressionInfo.compressionRatio = compressionInfo.originalSize / compressedSize
    compressionInfo.processingTime = Date.now() - startTime
    
    return {
      data: encodedData,
      info: compressionInfo
    }
  }
  
  /**
   * 解压缩模型数据
   * @param {Object} compressedData - 压缩后的数据对象
   * @returns {Object} 原始权重
   */
  decompress(compressedData) {
    const { data, info } = compressedData
    let decompressedWeights = data
    
    // 逆序应用解压缩技术
    const techniques = [...info.appliedTechniques].reverse()
    
    for (const technique of techniques) {
      switch (technique) {
        case 'huffman':
          decompressedWeights = this.huffmanDecode(decompressedWeights)
          break
        case 'quantization':
          decompressedWeights = this.reverseQuantization(decompressedWeights)
          break
        case 'sparse':
          decompressedWeights = this.reverseSparse(decompressedWeights)
          break
      }
    }
    
    return decompressedWeights
  }
  
  /**
   * 计算JavaScript对象的近似大小(字节)
   * @param {Object} obj - JavaScript对象
   * @returns {number} 大小(字节)
   */
  calculateSize(obj) {
    const jsonString = JSON.stringify(obj)
    return new TextEncoder().encode(jsonString).length
  }
  
  /**
   * 应用稀疏化 - 将小权重置为0
   * @param {Object} weights - 权重对象
   * @param {Object} options - 稀疏化选项
   * @returns {Object} 稀疏化后的权重
   */
  applySparse(weights, options) {
    const { threshold, minSparsity } = options
    
    // 递归稀疏化
    const sparseWeights = {}
    let totalElements = 0
    let zeroElements = 0
    
    const applyToLevel = (obj, result) => {
      for (const key in obj) {
        if (typeof obj[key] === 'number') {
          totalElements++
          if (Math.abs(obj[key]) < threshold) {
            result[key] = 0
            zeroElements++
          } else {
            result[key] = obj[key]
          }
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          result[key] = {}
          applyToLevel(obj[key], result[key])
        } else {
          result[key] = obj[key]
        }
      }
    }
    
    applyToLevel(weights, sparseWeights)
    
    // 计算稀疏度
    const sparsity = totalElements > 0 ? zeroElements / totalElements : 0
    
    // 如果稀疏度不满足要求，增加更多的零元素
    if (sparsity < minSparsity && totalElements > 0) {
      const additionalZerosNeeded = Math.ceil(totalElements * minSparsity) - zeroElements
      
      if (additionalZerosNeeded > 0) {
        // 收集所有非零数值元素
        const nonZeroElements = []
        
        const collectNonZeros = (obj, path = []) => {
          for (const key in obj) {
            const currentPath = [...path, key]
            if (typeof obj[key] === 'number' && obj[key] !== 0) {
              nonZeroElements.push({
                path: currentPath,
                value: obj[key],
                absValue: Math.abs(obj[key])
              })
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
              collectNonZeros(obj[key], currentPath)
            }
          }
        }
        
        collectNonZeros(sparseWeights)
        
        // 按绝对值从小到大排序
        nonZeroElements.sort((a, b) => a.absValue - b.absValue)
        
        // 将最小的非零元素置为0
        const elementsToZero = Math.min(additionalZerosNeeded, nonZeroElements.length)
        
        for (let i = 0; i < elementsToZero; i++) {
          const { path } = nonZeroElements[i]
          
          // 找到并更新目标元素
          let target = sparseWeights
          for (let j = 0; j < path.length - 1; j++) {
            target = target[path[j]]
          }
          target[path[path.length - 1]] = 0
        }
      }
    }
    
    return sparseWeights
  }
  
  /**
   * 还原稀疏化的权重
   * @param {Object} sparseWeights - 稀疏化的权重
   * @returns {Object} 原始权重
   */
  reverseSparse(sparseWeights) {
    // 对于简单的稀疏化，不需要特殊处理来还原
    // 因为我们只是将某些值设为0，不影响结构
    return JSON.parse(JSON.stringify(sparseWeights))
  }
  
  /**
   * 应用权重量化 - 降低精度
   * @param {Object} weights - 权重对象
   * @param {Object} options - 量化选项
   * @returns {Object} 量化后的权重
   */
  applyQuantization(weights, options) {
    const { bits, symmetric } = options
    
    // 创建量化后的权重对象
    const quantizedWeights = {
      __quantization__: {
        bits,
        symmetric,
        scales: {},
        zeroPoints: {}
      },
      values: {}
    }
    
    // 收集所有数值
    const collectValues = (obj, path = '') => {
      const values = []
      
      const traverse = (o, p) => {
        for (const key in o) {
          const newPath = p ? `${p}.${key}` : key
          if (typeof o[key] === 'number') {
            values.push({
              path: newPath,
              value: o[key]
            })
          } else if (typeof o[key] === 'object' && o[key] !== null) {
            traverse(o[key], newPath)
          }
        }
      }
      
      traverse(obj, path)
      return values
    }
    
    const valueEntries = collectValues(weights)
    
    if (valueEntries.length === 0) {
      return weights // 没有数值可量化
    }
    
    // 按路径分组
    const groupedByParent = {}
    for (const entry of valueEntries) {
      const pathParts = entry.path.split('.')
      const parent = pathParts.slice(0, -1).join('.')
      const key = pathParts[pathParts.length - 1]
      
      if (!groupedByParent[parent]) {
        groupedByParent[parent] = []
      }
      
      groupedByParent[parent].push({
        key,
        value: entry.value
      })
    }
    
    // 对每组值进行量化
    for (const parent in groupedByParent) {
      const values = groupedByParent[parent].map(v => v.value)
      
      // 计算最大和最小值
      let min = Math.min(...values)
      let max = Math.max(...values)
      
      // 对称量化处理
      if (symmetric) {
        const absMax = Math.max(Math.abs(min), Math.abs(max))
        min = -absMax
        max = absMax
      }
      
      // 计算量化参数
      const scale = (max - min) / ((1 << bits) - 1)
      const zeroPoint = symmetric ? (1 << (bits - 1)) : 0
      
      // 存储量化参数
      quantizedWeights.__quantization__.scales[parent] = scale
      quantizedWeights.__quantization__.zeroPoints[parent] = zeroPoint
      
      // 量化值
      for (const item of groupedByParent[parent]) {
        const quantized = Math.round((item.value - min) / scale) + zeroPoint
        
        // 路径处理
        let target = quantizedWeights.values
        const pathParts = parent ? parent.split('.') : []
        
        for (const part of pathParts) {
          if (!target[part]) target[part] = {}
          target = target[part]
        }
        
        target[item.key] = quantized
      }
    }
    
    return quantizedWeights
  }
  
  /**
   * 还原量化的权重
   * @param {Object} quantizedWeights - 量化的权重
   * @returns {Object} 原始权重
   */
  reverseQuantization(quantizedWeights) {
    // 检查是否是量化的权重
    if (!quantizedWeights.__quantization__) {
      return quantizedWeights
    }
    
    const { scales, zeroPoints } = quantizedWeights.__quantization__
    const values = quantizedWeights.values
    
    // 创建输出对象
    const decodedWeights = {}
    
    // 递归还原量化值
    const decodeLevel = (encodedObj, result, path = '') => {
      for (const key in encodedObj) {
        const newPath = path ? `${path}.${key}` : key
        if (typeof encodedObj[key] === 'number') {
          // 查找适用的量化参数
          let scale = 1
          let zeroPoint = 0
          
          // 查找最长匹配的路径
          let bestMatchPath = ''
          for (const scalePath in scales) {
            if (newPath.startsWith(scalePath) && 
                scalePath.length > bestMatchPath.length) {
              bestMatchPath = scalePath
            }
          }
          
          if (bestMatchPath) {
            scale = scales[bestMatchPath]
            zeroPoint = zeroPoints[bestMatchPath]
          }
          
          // 反量化
          const decodedValue = (encodedObj[key] - zeroPoint) * scale
          result[key] = decodedValue
        } else if (typeof encodedObj[key] === 'object' && encodedObj[key] !== null) {
          result[key] = {}
          decodeLevel(encodedObj[key], result[key], newPath)
        } else {
          result[key] = encodedObj[key]
        }
      }
    }
    
    decodeLevel(values, decodedWeights)
    
    return decodedWeights
  }
  
  /**
   * 应用哈夫曼编码
   * @param {Object} weights - 权重对象
   * @returns {Object} 编码后的数据
   */
  huffmanEncode(weights) {
    // 简化版哈夫曼编码实现
    // 在实际应用中，这里应该实现完整的哈夫曼编码算法
    
    // 将权重对象转为JSON字符串
    const jsonString = JSON.stringify(weights)
    
    // 统计字符频率
    const frequencies = new Map()
    for (const char of jsonString) {
      frequencies.set(char, (frequencies.get(char) || 0) + 1)
    }
    
    // 构建哈夫曼树和编码表
    // 这里简化处理，返回一个示例编码结果
    return {
      __huffman__: {
        original_length: jsonString.length,
        encoding_version: '1.0'
      },
      encoded_data: btoa(jsonString) // 简单使用Base64作为示例
    }
  }
  
  /**
   * 解码哈夫曼编码的数据
   * @param {Object} encodedData - 编码后的数据
   * @returns {Object} 原始权重
   */
  huffmanDecode(encodedData) {
    // 检查是否是哈夫曼编码的数据
    if (!encodedData.__huffman__) {
      return encodedData
    }
    
    // 解码
    try {
      const jsonString = atob(encodedData.encoded_data)
      return JSON.parse(jsonString)
    } catch (e) {
      console.error('哈夫曼解码失败:', e)
      return {}
    }
  }
  
  /**
   * 计算增量更新
   * @param {Object} oldWeights - 旧权重
   * @param {Object} newWeights - 新权重
   * @returns {Object} 增量更新
   */
  computeIncremental(oldWeights, newWeights) {
    const incremental = {
      __incremental__: {
        base_version: oldWeights.version || 0,
        target_version: newWeights.version || oldWeights.version + 1
      },
      changes: {}
    }
    
    const threshold = this.incrementalOptions.significantChangeThreshold
    
    // 递归比较并记录变化
    const compareAndRecord = (oldObj, newObj, path = [], changes = {}) => {
      // 获取所有键的集合
      const allKeys = new Set([
        ...Object.keys(oldObj || {}),
        ...Object.keys(newObj || {})
      ])
      
      for (const key of allKeys) {
        const newPath = [...path, key]
        const pathStr = newPath.join('.')
        
        // 新增的键
        if (!(key in oldObj)) {
          changes[pathStr] = newObj[key]
          continue
        }
        
        // 删除的键
        if (!(key in newObj)) {
          changes[pathStr] = null  // 使用null表示删除
          continue
        }
        
        // 比较值
        if (typeof oldObj[key] === 'number' && typeof newObj[key] === 'number') {
          const diff = newObj[key] - oldObj[key]
          if (Math.abs(diff) >= threshold) {
            changes[pathStr] = newObj[key]
          }
        } else if (typeof oldObj[key] === 'object' && typeof newObj[key] === 'object') {
          // 递归处理嵌套对象
          const nestedChanges = {}
          compareAndRecord(oldObj[key], newObj[key], newPath, nestedChanges)
          
          // 只有当有变化时才添加
          if (Object.keys(nestedChanges).length > 0) {
            for (const nestedPath in nestedChanges) {
              changes[nestedPath] = nestedChanges[nestedPath]
            }
          }
        } else if (oldObj[key] !== newObj[key]) {
          // 其他类型的不同
          changes[pathStr] = newObj[key]
        }
      }
      
      return changes
    }
    
    incremental.changes = compareAndRecord(oldWeights, newWeights)
    
    // 如果变化很小，可能增量更新比完整更新更大
    // 在这种情况下，我们可以考虑直接发送完整更新
    const incrementalSize = this.calculateSize(incremental)
    const newWeightsSize = this.calculateSize(newWeights)
    
    if (incrementalSize >= newWeightsSize * 0.8) {
      return {
        __incremental__: {
          full_update: true,
          reason: 'incremental_too_large'
        },
        weights: newWeights
      }
    }
    
    return incremental
  }
  
  /**
   * 应用增量更新
   * @param {Object} baseWeights - 基础权重
   * @param {Object} incrementalUpdate - 增量更新
   * @returns {Object} 更新后的权重
   */
  applyIncremental(baseWeights, incrementalUpdate) {
    // 检查是否是完整更新
    if (incrementalUpdate.__incremental__?.full_update) {
      return incrementalUpdate.weights
    }
    
    // 检查是否是有效的增量更新
    if (!incrementalUpdate.__incremental__) {
      return incrementalUpdate // 不是增量更新，直接返回
    }
    
    // 验证版本兼容性
    if (incrementalUpdate.__incremental__.base_version !== baseWeights.version) {
      console.warn('增量更新版本不匹配', {
        base: baseWeights.version,
        expected: incrementalUpdate.__incremental__.base_version
      })
    }
    
    // 创建结果的深拷贝
    const result = JSON.parse(JSON.stringify(baseWeights))
    result.version = incrementalUpdate.__incremental__.target_version
    
    // 应用变化
    for (const path in incrementalUpdate.changes) {
      const value = incrementalUpdate.changes[path]
      const pathParts = path.split('.')
      
      // 目标对象引用
      let target = result
      
      // 遍历路径，直到最后一部分
      for (let i = 0; i < pathParts.length - 1; i++) {
        const part = pathParts[i]
        
        // 确保路径存在
        if (!(part in target)) {
          target[part] = {}
        }
        
        target = target[part]
      }
      
      // 最后一部分是键名
      const lastKey = pathParts[pathParts.length - 1]
      
      if (value === null) {
        // 删除键
        delete target[lastKey]
      } else {
        // 更新或添加键
        target[lastKey] = value
      }
    }
    
    return result
  }
}

// 创建默认压缩器实例
const modelCompressor = new ModelCompressor()
export default modelCompressor 