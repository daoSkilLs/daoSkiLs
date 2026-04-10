# 错误处理机制实现

## 概述

本文档介绍支付宝支付集成技能的错误处理机制实现，包括错误类型定义、错误处理策略和错误日志记录。

## 错误类型定义

### 1. 网络错误

| 错误码 | 错误类型 | 描述 | 处理策略 |
| --- | --- | --- | --- |
| 10001 | NETWORK_ERROR | 网络连接错误 | 检查网络连接，重试请求 |
| 10002 | TIMEOUT_ERROR | 请求超时错误 | 增加超时时间，重试请求 |
| 10003 | DNS_ERROR | DNS解析错误 | 检查DNS配置，重试请求 |
| 10004 | SSL_ERROR | SSL证书错误 | 检查SSL配置，使用HTTPS |

### 2. 文档访问错误

| 错误码 | 错误类型 | 描述 | 处理策略 |
| --- | --- | --- | --- |
| 20001 | DOCUMENT_NOT_FOUND | 文档不存在 | 检查URL是否正确，返回友好错误信息 |
| 20002 | DOCUMENT_ACCESS_DENIED | 文档访问被拒绝 | 检查权限，返回友好错误信息 |
| 20003 | DOCUMENT_PARSE_ERROR | 文档解析错误 | 检查文档格式，使用备选解析方式 |
| 20004 | DOCUMENT_EMPTY | 文档内容为空 | 返回友好错误信息，建议用户检查网络 |

### 3. 业务逻辑错误

| 错误码 | 错误类型 | 描述 | 处理策略 |
| --- | --- | --- | --- |
| 30001 | INVALID_PARAMETER | 参数错误 | 检查输入参数，返回友好错误信息 |
| 30002 | ROUTING_ERROR | 路由错误 | 检查路由规则，返回友好错误信息 |
| 30003 | INVALID_SIGNATURE | 签名验证失败 | 检查签名配置，返回友好错误信息 |
| 30004 | TRANSACTION_ERROR | 交易错误 | 检查交易参数，返回友好错误信息 |

### 4. 系统错误

| 错误码 | 错误类型 | 描述 | 处理策略 |
| --- | --- | --- | --- |
| 40001 | INTERNAL_ERROR | 内部错误 | 记录错误日志，返回友好错误信息 |
| 40002 | MEMORY_ERROR | 内存错误 | 检查内存使用，释放资源 |
| 40003 | CACHE_ERROR | 缓存错误 | 清除缓存，重试操作 |
| 40004 | RATE_LIMIT_ERROR | 速率限制错误 | 延迟请求，重试操作 |

## 错误处理策略

### 1. 错误捕获与处理

```javascript
async function fetchDocument(url) {
  try {
    const response = await fetch(url, {
      timeout: 10000, // 10秒超时
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('DOCUMENT_NOT_FOUND');
      } else if (response.status === 403) {
        throw new Error('DOCUMENT_ACCESS_DENIED');
      } else {
        throw new Error('NETWORK_ERROR');
      }
    }
    
    const content = await response.text();
    if (!content) {
      throw new Error('DOCUMENT_EMPTY');
    }
    
    return content;
  } catch (error) {
    // 错误分类与处理
    switch (error.message) {
      case 'DOCUMENT_NOT_FOUND':
        return handleDocumentNotFound(url);
      case 'DOCUMENT_ACCESS_DENIED':
        return handleDocumentAccessDenied(url);
      case 'DOCUMENT_EMPTY':
        return handleDocumentEmpty(url);
      case 'NETWORK_ERROR':
        return handleNetworkError(url);
      default:
        if (error.name === 'AbortError') {
          return handleTimeoutError(url);
        } else {
          return handleInternalError(error);
        }
    }
  }
}
```

### 2. 错误重试机制

```javascript
async function fetchWithRetry(url, maxRetries = 3) {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fetchDocument(url);
    } catch (error) {
      lastError = error;
      // 只有网络错误才重试
      if (!isNetworkError(error)) {
        break;
      }
      // 指数退避策略
      const delay = Math.pow(2, i) * 1000;
      console.log(`Retry ${i + 1}/${maxRetries} after ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}

function isNetworkError(error) {
  return [
    'NETWORK_ERROR',
    'TIMEOUT_ERROR',
    'DNS_ERROR'
  ].includes(error.message);
}
```

### 3. 错误信息格式化

```javascript
function formatError(error, context = {}) {
  const errorMap = {
    'NETWORK_ERROR': { code: '10001', message: '网络连接错误' },
    'TIMEOUT_ERROR': { code: '10002', message: '请求超时错误' },
    'DNS_ERROR': { code: '10003', message: 'DNS解析错误' },
    'SSL_ERROR': { code: '10004', message: 'SSL证书错误' },
    'DOCUMENT_NOT_FOUND': { code: '20001', message: '文档不存在' },
    'DOCUMENT_ACCESS_DENIED': { code: '20002', message: '文档访问被拒绝' },
    'DOCUMENT_PARSE_ERROR': { code: '20003', message: '文档解析错误' },
    'DOCUMENT_EMPTY': { code: '20004', message: '文档内容为空' },
    'INVALID_PARAMETER': { code: '30001', message: '参数错误' },
    'ROUTING_ERROR': { code: '30002', message: '路由错误' },
    'INVALID_SIGNATURE': { code: '30003', message: '签名验证失败' },
    'TRANSACTION_ERROR': { code: '30004', message: '交易错误' },
    'INTERNAL_ERROR': { code: '40001', message: '内部错误' },
    'MEMORY_ERROR': { code: '40002', message: '内存错误' },
    'CACHE_ERROR': { code: '40003', message: '缓存错误' },
    'RATE_LIMIT_ERROR': { code: '40004', message: '速率限制错误' }
  };
  
  const errorInfo = errorMap[error.message] || errorMap['INTERNAL_ERROR'];
  
  return {
    code: errorInfo.code,
    message: errorInfo.message,
    detail: error.message,
    timestamp: new Date().toISOString(),
    context: context
  };
}
```

## 错误日志记录

### 1. 日志级别

- **DEBUG**：详细的调试信息，仅在开发环境使用
- **INFO**：一般信息，如请求开始、结束等
- **WARN**：警告信息，如缓存过期、重试操作等
- **ERROR**：错误信息，如网络错误、文档解析错误等
- **FATAL**：致命错误，如系统崩溃、内存溢出等

### 2. 日志记录实现

```javascript
const fs = require('fs');
const path = require('path');

class Logger {
  constructor(logDir = './logs') {
    this.logDir = logDir;
    this.init();
  }
  
  init() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }
  
  getLogFilePath() {
    const today = new Date().toISOString().split('T')[0];
    return path.join(this.logDir, `${today}.log`);
  }
  
  log(level, message, context = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      context
    };
    
    const logString = JSON.stringify(logEntry) + '\n';
    
    // 写入文件
    fs.appendFileSync(this.getLogFilePath(), logString);
    
    // 控制台输出
    if (level === 'ERROR' || level === 'FATAL') {
      console.error(logString);
    } else if (level === 'WARN') {
      console.warn(logString);
    } else {
      console.log(logString);
    }
  }
  
  debug(message, context = {}) {
    this.log('DEBUG', message, context);
  }
  
  info(message, context = {}) {
    this.log('INFO', message, context);
  }
  
  warn(message, context = {}) {
    this.log('WARN', message, context);
  }
  
  error(message, context = {}) {
    this.log('ERROR', message, context);
  }
  
  fatal(message, context = {}) {
    this.log('FATAL', message, context);
  }
}

// 导出单例
const logger = new Logger();
module.exports = logger;
```

### 3. 错误日志使用

```javascript
async function fetchDocument(url) {
  logger.info('开始访问文档', { url });
  
  try {
    const content = await fetchWithRetry(url);
    logger.info('文档访问成功', { url, length: content.length });
    return content;
  } catch (error) {
    const formattedError = formatError(error, { url });
    logger.error('文档访问失败', formattedError);
    throw formattedError;
  }
}
```

## 错误处理最佳实践

### 1. 错误预防

- **参数校验**：在函数入口处校验参数，避免无效参数导致的错误
- **网络检查**：在发起网络请求前检查网络连接状态
- **资源检查**：在使用资源前检查资源是否可用
- **边界检查**：检查数组、对象等的边界条件，避免越界访问

### 2. 错误捕获

- **精确捕获**：只捕获预期的错误类型，避免捕获所有异常
- **层次捕获**：在适当的层次捕获错误，避免错误被过早捕获
- **错误转换**：将底层错误转换为上层可理解的错误类型
- **错误传递**：将错误传递给适当的处理层，避免在错误处理中引入新的错误

### 3. 错误恢复

- **重试机制**：对网络错误等临时性错误实现重试机制
- **降级策略**：当主要功能失败时，使用备用方案
- **资源释放**：在错误处理中确保资源被正确释放
- **状态恢复**：在错误处理后恢复系统到正常状态

### 4. 错误监控

- **实时监控**：实时监控系统的错误率和错误类型
- **告警机制**：当错误率超过阈值时触发告警
- **错误分析**：定期分析错误日志，找出常见错误和潜在问题
- **持续改进**：根据错误分析结果，持续改进错误处理机制

## 错误处理流程

1. **错误发生**：系统运行过程中发生错误
2. **错误捕获**：使用try-catch捕获错误
3. **错误分类**：根据错误类型进行分类
4. **错误处理**：根据错误类型采取相应的处理策略
5. **错误日志**：记录错误信息，便于问题排查
6. **错误响应**：向用户返回友好的错误信息
7. **错误监控**：监控错误率和错误类型，持续改进

## 结论

通过实现完善的错误处理机制，可以显著提高支付宝支付集成技能的可靠性和稳定性。错误处理机制不仅能够处理各种异常场景，还能够提供清晰、友好的错误信息给用户，同时通过错误日志记录和监控，便于问题排查和系统优化。
