/**
 * 错误处理模块
 * 负责处理 deep-research 技能中的各种错误
 */

// 错误码定义
const ERROR_CODES = {
  // 系统级错误
  SYSTEM_ERROR: {
    code: 'SYSTEM_ERROR',
    message: '系统内部错误',
    level: 'error'
  },
  
  // 配置错误
  CONFIG_ERROR: {
    code: 'CONFIG_ERROR',
    message: '配置错误',
    level: 'error'
  },
  
  // 数据源错误
  DATA_SOURCE_ERROR: {
    code: 'DATA_SOURCE_ERROR',
    message: '数据源错误',
    level: 'error'
  },
  
  // 信息收集错误
  DATA_COLLECTION_ERROR: {
    code: 'DATA_COLLECTION_ERROR',
    message: '信息收集错误',
    level: 'error'
  },
  
  // 分析处理错误
  ANALYSIS_ERROR: {
    code: 'ANALYSIS_ERROR',
    message: '分析处理错误',
    level: 'error'
  },
  
  // 报告生成错误
  REPORT_GENERATION_ERROR: {
    code: 'REPORT_GENERATION_ERROR',
    message: '报告生成错误',
    level: 'error'
  },
  
  // 输入参数错误
  INPUT_ERROR: {
    code: 'INPUT_ERROR',
    message: '输入参数错误',
    level: 'warning'
  },
  
  // 超时错误
  TIMEOUT_ERROR: {
    code: 'TIMEOUT_ERROR',
    message: '操作超时',
    level: 'warning'
  },
  
  // 资源不足错误
  RESOURCE_ERROR: {
    code: 'RESOURCE_ERROR',
    message: '资源不足',
    level: 'warning'
  },
  
  // 网络错误
  NETWORK_ERROR: {
    code: 'NETWORK_ERROR',
    message: '网络错误',
    level: 'warning'
  }
};

/**
 * 自定义错误类
 */
class DeepResearchError extends Error {
  constructor(errorCode, message, details = {}) {
    super(message || errorCode.message);
    this.name = 'DeepResearchError';
    this.code = errorCode.code;
    this.level = errorCode.level;
    this.details = details;
    this.timestamp = new Date().toISOString();
  }
}

/**
 * 错误处理类
 */
class ErrorHandler {
  constructor() {
    this.errorLog = [];
  }
  
  /**
   * 创建错误
   * @param {Object} errorCode - 错误码对象
   * @param {string} message - 错误消息
   * @param {Object} details - 错误详情
   * @returns {DeepResearchError} 自定义错误对象
   */
  createError(errorCode, message, details = {}) {
    return new DeepResearchError(errorCode, message, details);
  }
  
  /**
   * 处理错误
   * @param {Error} error - 错误对象
   * @param {string} context - 错误上下文
   * @returns {Object} 错误处理结果
   */
  handleError(error, context = '') {
    // 记录错误
    this.logError(error, context);
    
    // 根据错误类型和级别进行处理
    switch (error.level) {
      case 'error':
        return this.handleCriticalError(error, context);
      case 'warning':
        return this.handleWarning(error, context);
      default:
        return this.handleUnknownError(error, context);
    }
  }
  
  /**
   * 处理严重错误
   * @param {Error} error - 错误对象
   * @param {string} context - 错误上下文
   * @returns {Object} 错误处理结果
   */
  handleCriticalError(error, context) {
    console.error(`[CRITICAL ERROR] ${context}:`, error);
    
    // 对于严重错误，我们可以尝试降级处理或使用备用方案
    return {
      success: false,
      error: {
        code: error.code,
        message: error.message,
        details: error.details
      },
      fallback: this.getFallbackStrategy(error.code)
    };
  }
  
  /**
   * 处理警告
   * @param {Error} error - 错误对象
   * @param {string} context - 错误上下文
   * @returns {Object} 错误处理结果
   */
  handleWarning(error, context) {
    console.warn(`[WARNING] ${context}:`, error);
    
    // 对于警告，我们可以继续执行，同时记录警告
    return {
      success: true,
      warning: {
        code: error.code,
        message: error.message,
        details: error.details
      }
    };
  }
  
  /**
   * 处理未知错误
   * @param {Error} error - 错误对象
   * @param {string} context - 错误上下文
   * @returns {Object} 错误处理结果
   */
  handleUnknownError(error, context) {
    console.error(`[UNKNOWN ERROR] ${context}:`, error);
    
    // 对于未知错误，我们可以尝试使用默认的错误处理策略
    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: '未知错误',
        details: {
          originalError: error.message,
          stack: error.stack
        }
      },
      fallback: this.getFallbackStrategy('UNKNOWN_ERROR')
    };
  }
  
  /**
   * 记录错误
   * @param {Error} error - 错误对象
   * @param {string} context - 错误上下文
   */
  logError(error, context) {
    const errorEntry = {
      timestamp: new Date().toISOString(),
      context,
      code: error.code || 'UNKNOWN_ERROR',
      message: error.message,
      details: error.details,
      stack: error.stack
    };
    
    this.errorLog.push(errorEntry);
    
    // 限制错误日志的大小
    if (this.errorLog.length > 1000) {
      this.errorLog.shift();
    }
  }
  
  /**
   * 获取错误日志
   * @returns {Array} 错误日志数组
   */
  getErrorLog() {
    return this.errorLog;
  }
  
  /**
   * 清空错误日志
   */
  clearErrorLog() {
    this.errorLog = [];
  }
  
  /**
   * 获取降级策略
   * @param {string} errorCode - 错误码
   * @returns {Object} 降级策略
   */
  getFallbackStrategy(errorCode) {
    const fallbackStrategies = {
      // 系统错误 - 使用简化模式
      SYSTEM_ERROR: {
        mode: 'simplified',
        message: '系统错误，使用简化模式继续执行'
      },
      
      // 配置错误 - 使用默认配置
      CONFIG_ERROR: {
        mode: 'default_config',
        message: '配置错误，使用默认配置继续执行'
      },
      
      // 数据源错误 - 跳过该数据源
      DATA_SOURCE_ERROR: {
        mode: 'skip_source',
        message: '数据源错误，跳过该数据源继续执行'
      },
      
      // 信息收集错误 - 使用缓存数据
      DATA_COLLECTION_ERROR: {
        mode: 'use_cache',
        message: '信息收集错误，使用缓存数据继续执行'
      },
      
      // 分析处理错误 - 使用简化分析
      ANALYSIS_ERROR: {
        mode: 'simplified_analysis',
        message: '分析处理错误，使用简化分析继续执行'
      },
      
      // 报告生成错误 - 使用简化报告
      REPORT_GENERATION_ERROR: {
        mode: 'simplified_report',
        message: '报告生成错误，使用简化报告继续执行'
      },
      
      // 超时错误 - 减少处理量
      TIMEOUT_ERROR: {
        mode: 'reduce_workload',
        message: '操作超时，减少处理量继续执行'
      },
      
      // 资源不足错误 - 释放资源
      RESOURCE_ERROR: {
        mode: 'release_resources',
        message: '资源不足，释放资源继续执行'
      },
      
      // 网络错误 - 重试或使用备用网络
      NETWORK_ERROR: {
        mode: 'retry_or_alternate',
        message: '网络错误，重试或使用备用网络继续执行'
      },
      
      // 未知错误 - 使用安全模式
      UNKNOWN_ERROR: {
        mode: 'safe_mode',
        message: '未知错误，使用安全模式继续执行'
      }
    };
    
    return fallbackStrategies[errorCode] || fallbackStrategies.UNKNOWN_ERROR;
  }
  
  /**
   * 重试操作
   * @param {Function} operation - 要重试的操作
   * @param {number} maxRetries - 最大重试次数
   * @param {number} delay - 重试延迟（毫秒）
   * @returns {Promise} 操作结果
   */
  async retry(operation, maxRetries = 3, delay = 1000) {
    let lastError;
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        
        // 只有网络错误和超时错误才重试
        if (error.code !== 'NETWORK_ERROR' && error.code !== 'TIMEOUT_ERROR') {
          throw error;
        }
        
        // 等待一段时间后重试
        if (i < maxRetries - 1) {
          console.log(`[RETRY] 操作失败，${delay}ms 后重试 (${i + 1}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    throw lastError;
  }
  
  /**
   * 批量错误处理
   * @param {Array} operations - 操作数组
   * @returns {Array} 操作结果数组
   */
  async handleBatchOperations(operations) {
    const results = [];
    
    for (const operation of operations) {
      try {
        const result = await operation();
        results.push({ success: true, data: result });
      } catch (error) {
        const handledError = this.handleError(error, 'Batch operation');
        results.push({ success: false, error: handledError });
      }
    }
    
    return results;
  }
}

// 导出错误处理模块
module.exports = {
  ERROR_CODES,
  DeepResearchError,
  ErrorHandler
};