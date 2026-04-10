/**
 * 性能测试脚本
 * 用于测试优化后的 deep-research 技能的执行速度和性能
 */

const DeepResearch = require('../index');

// 测试配置
const testConfig = {
  testTopics: [
    '人工智能在医疗领域的应用',
    '区块链技术的发展趋势',
    '可再生能源的未来发展',
    '元宇宙的概念与应用',
    '量子计算的现状与挑战'
  ],
  testDepths: ['summary', 'standard', 'detailed'],
  iterations: 3, // 每个测试运行的次数
  timeout: 60000 // 60秒超时
};

// 性能测试结果
const performanceResults = {
  tests: [],
  totalTime: 0,
  averageTime: 0,
  maxTime: 0,
  minTime: Infinity
};

/**
 * 运行性能测试
 * @param {string} topic - 测试主题
 * @param {string} depth - 测试深度
 * @returns {Promise<Object>} 测试结果
 */
async function runPerformanceTest(topic, depth) {
  const deepResearch = new DeepResearch();
  const results = [];
  
  console.log(`\n=== 测试: ${topic} (${depth}) ===`);
  
  for (let i = 0; i < testConfig.iterations; i++) {
    console.log(`  运行测试 ${i + 1}/${testConfig.iterations}...`);
    
    const startTime = Date.now();
    
    try {
      const result = await deepResearch.research({
        topic,
        depth,
        template: 'standard'
      });
      
      const endTime = Date.now();
      const executionTime = endTime - startTime;
      
      results.push(executionTime);
      console.log(`  ✅ 测试 ${i + 1} 完成，用时: ${executionTime}ms`);
    } catch (error) {
      console.log(`  ❌ 测试 ${i + 1} 失败: ${error.message}`);
    }
  }
  
  // 计算统计数据
  if (results.length > 0) {
    const totalTime = results.reduce((sum, time) => sum + time, 0);
    const averageTime = totalTime / results.length;
    const maxTime = Math.max(...results);
    const minTime = Math.min(...results);
    
    return {
      topic,
      depth,
      iterations: results.length,
      totalTime,
      averageTime,
      maxTime,
      minTime,
      results
    };
  } else {
    return {
      topic,
      depth,
      iterations: 0,
      totalTime: 0,
      averageTime: 0,
      maxTime: 0,
      minTime: 0,
      results: []
    };
  }
}

/**
 * 运行所有性能测试
 */
async function runAllPerformanceTests() {
  console.log('开始性能测试...');
  console.log(`测试配置: 每个主题运行 ${testConfig.iterations} 次`);
  
  const allResults = [];
  
  // 运行所有测试
  for (const topic of testConfig.testTopics) {
    for (const depth of testConfig.testDepths) {
      const result = await runPerformanceTest(topic, depth);
      allResults.push(result);
    }
  }
  
  // 计算总体统计数据
  const allExecutionTimes = allResults.flatMap(result => result.results);
  if (allExecutionTimes.length > 0) {
    performanceResults.totalTime = allExecutionTimes.reduce((sum, time) => sum + time, 0);
    performanceResults.averageTime = performanceResults.totalTime / allExecutionTimes.length;
    performanceResults.maxTime = Math.max(...allExecutionTimes);
    performanceResults.minTime = Math.min(...allExecutionTimes);
  }
  
  performanceResults.tests = allResults;
  
  // 输出测试结果
  console.log('\n=== 性能测试结果汇总 ===');
  console.log(`总测试次数: ${allExecutionTimes.length}`);
  console.log(`总执行时间: ${performanceResults.totalTime}ms`);
  console.log(`平均执行时间: ${performanceResults.averageTime.toFixed(2)}ms`);
  console.log(`最长执行时间: ${performanceResults.maxTime}ms`);
  console.log(`最短执行时间: ${performanceResults.minTime}ms`);
  
  console.log('\n=== 详细测试结果 ===');
  for (const result of allResults) {
    console.log(`\n主题: ${result.topic}`);
    console.log(`深度: ${result.depth}`);
    console.log(`运行次数: ${result.iterations}`);
    console.log(`总时间: ${result.totalTime}ms`);
    console.log(`平均时间: ${result.averageTime.toFixed(2)}ms`);
    console.log(`最长时间: ${result.maxTime}ms`);
    console.log(`最短时间: ${result.minTime}ms`);
    console.log(`详细结果: ${result.results.join(', ')}ms`);
  }
  
  // 性能评估
  console.log('\n=== 性能评估 ===');
  const summaryAverage = allResults
    .filter(result => result.depth === 'summary')
    .reduce((sum, result) => sum + result.averageTime, 0) / 
    allResults.filter(result => result.depth === 'summary').length;
  
  const standardAverage = allResults
    .filter(result => result.depth === 'standard')
    .reduce((sum, result) => sum + result.averageTime, 0) / 
    allResults.filter(result => result.depth === 'standard').length;
  
  const detailedAverage = allResults
    .filter(result => result.depth === 'detailed')
    .reduce((sum, result) => sum + result.averageTime, 0) / 
    allResults.filter(result => result.depth === 'detailed').length;
  
  console.log(`摘要版平均时间: ${summaryAverage.toFixed(2)}ms`);
  console.log(`标准版平均时间: ${standardAverage.toFixed(2)}ms`);
  console.log(`详细版平均时间: ${detailedAverage.toFixed(2)}ms`);
  
  // 性能优化建议
  console.log('\n=== 性能优化建议 ===');
  if (summaryAverage > 2000) {
    console.log('⚠️  摘要版执行时间较长，建议优化信息收集和分析处理流程');
  }
  
  if (standardAverage > 5000) {
    console.log('⚠️  标准版执行时间较长，建议优化报告生成和数据处理流程');
  }
  
  if (detailedAverage > 15000) {
    console.log('⚠️  详细版执行时间较长，建议优化并行处理和缓存机制');
  }
  
  console.log('\n🎉 性能测试完成！');
  
  // 生成性能测试报告
  generatePerformanceReport();
}

/**
 * 生成性能测试报告
 */
function generatePerformanceReport() {
  const report = `# 性能测试报告

## 测试配置
- 测试主题: ${testConfig.testTopics.join(', ')}
- 测试深度: ${testConfig.testDepths.join(', ')}
- 每个测试运行次数: ${testConfig.iterations}
- 测试时间: ${new Date().toISOString()}

## 总体性能
- 总测试次数: ${performanceResults.tests.flatMap(test => test.results).length}
- 总执行时间: ${performanceResults.totalTime}ms
- 平均执行时间: ${performanceResults.averageTime.toFixed(2)}ms
- 最长执行时间: ${performanceResults.maxTime}ms
- 最短执行时间: ${performanceResults.minTime}ms

## 详细性能

${performanceResults.tests.map(test => `### ${test.topic} (${test.depth})
- 运行次数: ${test.iterations}
- 总时间: ${test.totalTime}ms
- 平均时间: ${test.averageTime.toFixed(2)}ms
- 最长时间: ${test.maxTime}ms
- 最短时间: ${test.minTime}ms
- 详细结果: ${test.results.join(', ')}ms
`).join('\n')}

## 性能评估
- 摘要版平均时间: ${performanceResults.tests.filter(test => test.depth === 'summary').reduce((sum, test) => sum + test.averageTime, 0) / performanceResults.tests.filter(test => test.depth === 'summary').length || 0}ms
- 标准版平均时间: ${performanceResults.tests.filter(test => test.depth === 'standard').reduce((sum, test) => sum + test.averageTime, 0) / performanceResults.tests.filter(test => test.depth === 'standard').length || 0}ms
- 详细版平均时间: ${performanceResults.tests.filter(test => test.depth === 'detailed').reduce((sum, test) => sum + test.averageTime, 0) / performanceResults.tests.filter(test => test.depth === 'detailed').length || 0}ms

## 优化建议
- 优化信息收集流程，减少网络请求时间
- 实现并行处理，提高多数据源的处理速度
- 增加缓存机制，避免重复计算
- 优化报告生成算法，减少模板渲染时间
- 考虑使用更高效的数据结构和算法
`;
  
  // 保存报告到文件
  const fs = require('fs');
  const path = require('path');
  const reportPath = path.join(__dirname, '..', 'performance-report.md');
  
  fs.writeFileSync(reportPath, report);
  console.log(`\n性能测试报告已保存到: ${reportPath}`);
}

// 运行性能测试
runAllPerformanceTests();