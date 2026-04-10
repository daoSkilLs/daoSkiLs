/**
 * 兼容性测试脚本
 * 用于测试优化后的 deep-research 技能与现有系统的兼容性
 */

const fs = require('fs');
const path = require('path');

// 测试配置
const testConfig = {
  testTopic: '人工智能在医疗领域的应用',
  testDepth: 'summary',
  testTemplate: 'standard',
  timeout: 60000 // 60秒超时
};

// 测试结果
const testResults = {
  tests: [],
  passed: 0,
  failed: 0,
  total: 0
};

/**
 * 测试函数
 * @param {string} testName - 测试名称
 * @param {Function} testFunction - 测试函数
 */
async function runTest(testName, testFunction) {
  testResults.total++;
  console.log(`\n=== 测试: ${testName} ===`);
  
  try {
    const result = await testFunction();
    console.log(`✅ 测试通过: ${testName}`);
    testResults.tests.push({ name: testName, status: 'passed', result });
    testResults.passed++;
  } catch (error) {
    console.log(`❌ 测试失败: ${testName}`);
    console.log(`错误信息: ${error.message}`);
    testResults.tests.push({ name: testName, status: 'failed', error: error.message });
    testResults.failed++;
  }
}

/**
 * 测试 1: 检查技能文件结构
 */
function testFileStructure() {
  return new Promise((resolve, reject) => {
    const requiredFiles = [
      'SKILL.md',
      'index.js',
      'config/data-sources.yaml',
      'references/api-reference.md',
      'references/execution-flow.md',
      'references/data-collection.md',
      'references/analysis-processing.md',
      'references/report-generation.md',
      'references/error-codes.md',
      'utils/error-handler.js'
    ];
    
    const missingFiles = [];
    
    for (const file of requiredFiles) {
      const filePath = path.join(__dirname, '..', file);
      if (!fs.existsSync(filePath)) {
        missingFiles.push(file);
      }
    }
    
    if (missingFiles.length > 0) {
      reject(new Error(`缺少必要文件: ${missingFiles.join(', ')}`));
    } else {
      resolve('所有必要文件都存在');
    }
  });
}

/**
 * 测试 2: 检查 SKILL.md 配置
 */
function testSkillConfig() {
  return new Promise((resolve, reject) => {
    const skillMdPath = path.join(__dirname, '..', 'SKILL.md');
    
    if (!fs.existsSync(skillMdPath)) {
      reject(new Error('SKILL.md 文件不存在'));
      return;
    }
    
    const skillContent = fs.readFileSync(skillMdPath, 'utf8');
    
    // 检查必要的配置项
    const requiredFields = [
      'name:',
      'description:',
      'version:',
      'author:',
      'input:',
      'output:'
    ];
    
    const missingFields = [];
    for (const field of requiredFields) {
      if (!skillContent.includes(field)) {
        missingFields.push(field);
      }
    }
    
    if (missingFields.length > 0) {
      reject(new Error(`SKILL.md 缺少必要配置项: ${missingFields.join(', ')}`));
    } else {
      resolve('SKILL.md 配置完整');
    }
  });
}

/**
 * 测试 3: 检查数据源配置
 */
function testDataSourceConfig() {
  return new Promise((resolve, reject) => {
    const configPath = path.join(__dirname, '..', 'config', 'data-sources.yaml');
    
    if (!fs.existsSync(configPath)) {
      reject(new Error('数据源配置文件不存在'));
      return;
    }
    
    const configContent = fs.readFileSync(configPath, 'utf8');
    
    // 检查必要的配置项
    const requiredSections = [
      'data_sources:',
      'source_types:',
      'selection_strategy:',
      'access_config:',
      'quality_assessment:',
      'data_processing:'
    ];
    
    const missingSections = [];
    for (const section of requiredSections) {
      if (!configContent.includes(section)) {
        missingSections.push(section);
      }
    }
    
    if (missingSections.length > 0) {
      reject(new Error(`数据源配置缺少必要部分: ${missingSections.join(', ')}`));
    } else {
      resolve('数据源配置完整');
    }
  });
}

/**
 * 测试 4: 检查错误处理模块
 */
function testErrorHandler() {
  return new Promise((resolve, reject) => {
    try {
      const errorHandlerPath = path.join(__dirname, '..', 'utils', 'error-handler.js');
      
      if (!fs.existsSync(errorHandlerPath)) {
        reject(new Error('错误处理模块不存在'));
        return;
      }
      
      const { ERROR_CODES, DeepResearchError, ErrorHandler } = require(errorHandlerPath);
      
      // 测试错误码定义
      if (!ERROR_CODES || Object.keys(ERROR_CODES).length === 0) {
        reject(new Error('错误码定义不完整'));
        return;
      }
      
      // 测试错误类
      const testError = new DeepResearchError(ERROR_CODES.INPUT_ERROR, '测试错误');
      if (!testError || testError.code !== 'INPUT_ERROR') {
        reject(new Error('错误类实现有问题'));
        return;
      }
      
      // 测试错误处理类
      const errorHandler = new ErrorHandler();
      if (!errorHandler || typeof errorHandler.handleError !== 'function') {
        reject(new Error('错误处理类实现有问题'));
        return;
      }
      
      resolve('错误处理模块工作正常');
    } catch (error) {
      reject(new Error(`错误处理模块测试失败: ${error.message}`));
    }
  });
}

/**
 * 测试 5: 检查主模块导入
 */
function testMainModule() {
  return new Promise((resolve, reject) => {
    try {
      const mainModulePath = path.join(__dirname, '..', 'index.js');
      
      if (!fs.existsSync(mainModulePath)) {
        reject(new Error('主模块文件不存在'));
        return;
      }
      
      // 尝试导入主模块
      const mainModule = require(mainModulePath);
      
      if (!mainModule || (typeof mainModule !== 'function' && typeof mainModule !== 'object')) {
        reject(new Error('主模块导出有问题'));
        return;
      }
      
      resolve('主模块导入成功');
    } catch (error) {
      reject(new Error(`主模块测试失败: ${error.message}`));
    }
  });
}

/**
 * 运行所有测试
 */
async function runAllTests() {
  console.log('开始兼容性测试...');
  
  await runTest('文件结构检查', testFileStructure);
  await runTest('SKILL.md 配置检查', testSkillConfig);
  await runTest('数据源配置检查', testDataSourceConfig);
  await runTest('错误处理模块检查', testErrorHandler);
  await runTest('主模块导入检查', testMainModule);
  
  // 输出测试结果
  console.log('\n=== 测试结果汇总 ===');
  console.log(`总测试数: ${testResults.total}`);
  console.log(`通过测试: ${testResults.passed}`);
  console.log(`失败测试: ${testResults.failed}`);
  console.log(`测试通过率: ${((testResults.passed / testResults.total) * 100).toFixed(2)}%`);
  
  if (testResults.failed > 0) {
    console.log('\n失败的测试:');
    for (const test of testResults.tests) {
      if (test.status === 'failed') {
        console.log(`- ${test.name}: ${test.error}`);
      }
    }
    process.exit(1);
  } else {
    console.log('\n🎉 所有测试通过！兼容性验证成功。');
    process.exit(0);
  }
}

// 运行测试
runAllTests();