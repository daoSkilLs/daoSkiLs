# 缓存机制实现

## 概述

本文档介绍支付宝支付集成技能的缓存机制实现，包括缓存策略、缓存结构和缓存管理。

## 缓存策略

### 1. 内存缓存

- **实现方式**：使用内存中的哈希表存储最近访问的文档内容
- **缓存大小**：限制缓存大小为100MB，超过后使用LRU（最近最少使用）策略淘汰
- **缓存键**：使用文档URL作为缓存键
- **缓存值**：存储文档内容和元数据（如访问时间、过期时间等）

### 2. 磁盘缓存

- **实现方式**：使用本地文件系统存储常用文档
- **存储路径**：`./cache`目录
- **缓存格式**：使用压缩格式存储，减少存储空间
- **缓存清理**：定期清理过期的缓存文件

### 3. 缓存失效策略

- **时间失效**：缓存默认有效期为24小时，超过后自动失效
- **内容失效**：当检测到文档内容发生变化时，强制更新缓存
- **手动失效**：提供手动清除缓存的机制

## 缓存结构

### 1. 内存缓存结构

```javascript
const memoryCache = {
  // 缓存数据
  data: new Map(),
  // 缓存大小
  size: 0,
  // 最大缓存大小（字节）
  maxSize: 100 * 1024 * 1024, // 100MB
  // 缓存过期时间（毫秒）
  expiryTime: 24 * 60 * 60 * 1000, // 24小时
  
  // 添加缓存
  set(key, value) {
    // 计算值的大小
    const valueSize = JSON.stringify(value).length;
    
    // 检查缓存大小
    while (this.size + valueSize > this.maxSize) {
      // 淘汰最久未使用的缓存
      const oldestKey = [...this.data.keys()][0];
      const oldestValue = this.data.get(oldestKey);
      this.size -= JSON.stringify(oldestValue).length;
      this.data.delete(oldestKey);
    }
    
    // 添加缓存
    this.data.set(key, {
      value,
      timestamp: Date.now(),
      size: valueSize
    });
    this.size += valueSize;
  },
  
  // 获取缓存
  get(key) {
    const item = this.data.get(key);
    if (!item) return null;
    
    // 检查是否过期
    if (Date.now() - item.timestamp > this.expiryTime) {
      this.data.delete(key);
      this.size -= item.size;
      return null;
    }
    
    // 更新访问时间
    item.timestamp = Date.now();
    this.data.set(key, item);
    
    return item.value;
  },
  
  // 清除缓存
  clear() {
    this.data.clear();
    this.size = 0;
  }
};
```

### 2. 磁盘缓存结构

```javascript
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const diskCache = {
  // 缓存目录
  cacheDir: './cache',
  
  // 初始化缓存目录
  init() {
    if (!fs.existsSync(this.cacheDir)) {
      fs.mkdirSync(this.cacheDir, { recursive: true });
    }
  },
  
  // 生成缓存文件路径
  getCachePath(key) {
    const hash = require('crypto').createHash('md5').update(key).digest('hex');
    return path.join(this.cacheDir, `${hash}.json.gz`);
  },
  
  // 添加缓存
  async set(key, value) {
    this.init();
    const cachePath = this.getCachePath(key);
    const data = {
      value,
      timestamp: Date.now()
    };
    const jsonData = JSON.stringify(data);
    const compressedData = zlib.gzipSync(jsonData);
    fs.writeFileSync(cachePath, compressedData);
  },
  
  // 获取缓存
  async get(key) {
    this.init();
    const cachePath = this.getCachePath(key);
    if (!fs.existsSync(cachePath)) {
      return null;
    }
    
    try {
      const compressedData = fs.readFileSync(cachePath);
      const jsonData = zlib.gunzipSync(compressedData).toString();
      const data = JSON.parse(jsonData);
      
      // 检查是否过期（24小时）
      if (Date.now() - data.timestamp > 24 * 60 * 60 * 1000) {
        fs.unlinkSync(cachePath);
        return null;
      }
      
      return data.value;
    } catch (error) {
      // 缓存文件损坏，删除
      if (fs.existsSync(cachePath)) {
        fs.unlinkSync(cachePath);
      }
      return null;
    }
  },
  
  // 清除缓存
  clear() {
    this.init();
    const files = fs.readdirSync(this.cacheDir);
    for (const file of files) {
      fs.unlinkSync(path.join(this.cacheDir, file));
    }
  }
};
```

## 缓存管理

### 1. 缓存使用流程

```javascript
async function getDocument(url) {
  // 首先尝试从内存缓存获取
  let content = memoryCache.get(url);
  if (content) {
    return content;
  }
  
  // 然后尝试从磁盘缓存获取
  content = await diskCache.get(url);
  if (content) {
    // 将磁盘缓存加载到内存缓存
    memoryCache.set(url, content);
    return content;
  }
  
  // 最后从网络获取
  content = await fetchDocument(url);
  
  // 存入内存缓存
  memoryCache.set(url, content);
  
  // 存入磁盘缓存
  await diskCache.set(url, content);
  
  return content;
}
```

### 2. 缓存监控

- **缓存命中率**：监控缓存命中情况，优化缓存策略
- **缓存大小**：监控缓存使用情况，避免内存溢出
- **缓存过期**：监控缓存过期情况，及时更新缓存

### 3. 缓存清理

- **定期清理**：定期清理过期的缓存文件
- **手动清理**：提供手动清理缓存的接口
- **自动清理**：当缓存大小超过阈值时，自动清理最久未使用的缓存

## 性能优化效果

### 1. 响应时间优化

- **未使用缓存**：每次请求都需要访问网络，响应时间较长
- **使用缓存**：大部分请求可以从缓存获取，响应时间显著减少

### 2. 网络请求优化

- **未使用缓存**：每个请求都需要发起网络请求，网络开销大
- **使用缓存**：减少重复的网络请求，网络开销显著减少

### 3. 资源使用优化

- **未使用缓存**：每次都需要解析文档，CPU使用率高
- **使用缓存**：直接使用缓存的文档内容，CPU使用率显著降低

## 最佳实践

- **合理设置缓存大小**：根据系统资源和使用情况，设置合适的缓存大小
- **定期清理缓存**：定期清理过期的缓存，避免缓存膨胀
- **监控缓存性能**：监控缓存命中率和性能指标，优化缓存策略
- **结合预加载**：预加载常用文档，提高缓存命中率

## 结论

通过实现内存缓存和磁盘缓存机制，可以显著提高支付宝支付集成技能的性能，减少响应时间，降低网络开销和资源使用。缓存机制的实现是性能优化的重要手段，对于提高用户体验和系统稳定性具有重要意义。
