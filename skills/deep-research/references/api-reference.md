# API 参考文档

本文档详细描述 Deep Research 技能的 API 接口规范，包括输入参数、输出格式、调用示例和最佳实践。

## 目录

- [1. 基本调用方式](#1-基本调用方式)
- [2. 输入参数详解](#2-输入参数详解)
- [3. 输出格式](#3-输出格式)
- [4. 详细程度选项](#4-详细程度选项)
- [5. 模板变体](#5-模板变体)
- [6. 语言风格](#6-语言风格)
- [7. 错误处理](#7-错误处理)
- [8. 调用示例](#8-调用示例)

## 1. 基本调用方式

Deep Research 技能支持三种调用方式：

### 1.1 自然语言调用

直接使用自然语言描述研究需求：

```bash
请研究 [主题]，并提供详细的研究报告
```

### 1.2 命令式调用

使用特定命令格式进行调用：

```bash
/research [主题] [详细程度]
```

### 1.3 参数化调用

使用结构化参数进行调用：

```json
{
  "topic": "研究主题",
  "detail_level": "standard",
  "template": "standard",
  "language": "zh-CN",
  "focus_areas": ["重点1", "重点2"],
  "source_types": ["academic", "industry", "news"]
}
```

## 2. 输入参数详解

| 参数名 | 类型 | 是否必填 | 默认值 | 说明 |
|-------|------|---------|--------|------|
| `topic` | string | 是 | - | 研究主题，长度不超过 500 字符 |
| `detail_level` | string | 否 | "standard" | 详细程度，可选值："summary", "standard", "detailed" |
| `template` | string | 否 | "standard" | 模板变体，可选值："standard", "academic", "industry", "policy" |
| `language` | string | 否 | "zh-CN" | 输出语言，可选值："zh-CN", "en-US" |
| `focus_areas` | array | 否 | [] | 重点关注领域，最多 10 个 |
| `source_types` | array | 否 | ["academic", "industry", "news"] | 来源类型，可选值："academic", "industry", "news", "official", "expert" |
| `time_range` | object | 否 | {"start": "", "end": ""} | 时间范围，格式：YYYY-MM-DD |
| `citation_style` | string | 否 | "numbered" | 引用风格，可选值："numbered", "author-year" |
| `output_format` | string | 否 | "markdown" | 输出格式，可选值："markdown", "json" |
| `max_sources` | number | 否 | 10 | 最大引用来源数量，1-20 |

## 3. 输出格式

### 3.1 Markdown 格式

默认输出为 Markdown 格式，包含以下部分：

- **执行摘要**：2-3 句概述关键发现
- **关键发现**：3-5 个核心发现，带引用
- **详细分析**：按子主题组织的深入分析，带引用
- **共识领域**：不同来源一致认同的观点
- **争议领域**：存在分歧的观点和不确定性
- **来源**：完整的来源列表，带可信度评估
- **研究空白**：需要进一步研究的领域

### 3.2 JSON 格式

当 `output_format` 设置为 "json" 时，输出为结构化 JSON：

```json
{
  "metadata": {
    "generated_at": "2026-04-10T00:00:00Z",
    "topic": "研究主题",
    "detail_level": "standard",
    "template": "standard",
    "language": "zh-CN"
  },
  "executive_summary": "执行摘要内容",
  "key_findings": [
    {
      "finding": "关键发现内容",
      "sources": [1, 2]
    }
  ],
  "detailed_analysis": [
    {
      "subtopic": "子主题1",
      "content": "分析内容",
      "sources": [1, 3]
    }
  ],
  "areas_of_consensus": [
    "共识内容"
  ],
  "areas_of_debate": [
    "争议内容"
  ],
  "sources": [
    {
      "id": 1,
      "citation": "完整引用",
      "credibility": "高",
      "type": "academic"
    }
  ],
  "gaps_and_further_research": [
    "研究空白内容"
  ]
}
```

## 4. 详细程度选项

| 详细程度 | 适用场景 | 包含内容 | 预计篇幅 | 生成时间 |
|---------|---------|---------|---------|---------|
| **summary** (摘要版) | 快速了解、决策参考 | 执行摘要 + 关键发现 + 来源列表 | 500-800 字 | 1-2 分钟 |
| **standard** (标准版) | 常规研究、报告撰写 | 完整结构，中等详细程度 | 3000-5000 字 | 3-5 分钟 |
| **detailed** (详细版) | 深度研究、学术论文 | 完整结构，高度详细，包含更多图表和数据 | 8000-15000 字 | 8-15 分钟 |

## 5. 模板变体

| 模板变体 | 适用场景 | 特点 |
|---------|---------|------|
| **standard** (标准模板) | 通用研究场景 | 平衡的结构和内容深度 |
| **academic** (学术模板) | 学术研究、文献综述 | 更注重学术引用和理论分析 |
| **industry** (行业模板) | 行业分析、市场研究 | 更注重市场数据和行业案例 |
| **policy** (政策模板) | 政策研究、合规分析 | 更注重法规解读和政策影响 |

## 6. 语言风格

| 语言风格 | 特点 | 适用场景 |
|---------|------|---------|
| **professional** (专业风格) | 正式、客观、学术化 | 学术报告、正式文档 |
| **accessible** (易懂风格) | 清晰、简洁、通俗 | 大众阅读、非专业人士 |
| **technical** (技术风格) | 精确、详细、专业术语 | 技术研究、专业领域 |

## 7. 错误处理

| 错误码 | 错误类型 | 描述 | 处理建议 |
|-------|---------|------|---------|
| E001 | 缺少必要参数 | 未提供研究主题 | 提供明确的研究主题 |
| E002 | 参数格式错误 | 输入参数格式无效 | 检查参数格式是否正确 |
| E003 | 主题过于宽泛 | 研究主题范围过大 | 缩小研究范围，明确具体方向 |
| E004 | 语言不支持 | 不支持的语言选项 | 使用支持的语言：zh-CN, en-US |
| E005 | 详细程度无效 | 无效的详细程度选项 | 使用支持的详细程度：summary, standard, detailed |
| E010 | 信息不足 | 无法收集足够的相关信息 | 尝试调整研究主题或增加时间范围 |
| E011 | 来源不可用 | 无法访问某些数据源 | 尝试使用其他来源类型或调整时间范围 |
| E020 | 分析失败 | 分析过程中出现错误 | 稍后重试或调整研究参数 |
| E030 | 报告生成失败 | 报告生成过程中出现错误 | 稍后重试或使用不同的输出格式 |

## 8. 调用示例

### 8.1 自然语言调用示例

**输入**：
```
请研究人工智能在医疗健康领域的应用趋势，并提供详细的研究报告
```

**输出**：
```markdown
## 执行摘要
人工智能在医疗健康领域的应用正在快速发展，特别是在诊断、药物研发和个性化医疗方面展现出巨大潜力。然而，监管合规和数据隐私仍是主要挑战。

## 关键发现
- **AI辅助诊断**：AI系统在医学影像分析方面已达到或超过人类专家水平，准确率超过90% [1]
- **药物研发**：AI可将药物发现时间缩短40%，成本降低30% [2]
- **个性化医疗**：基于基因组数据的AI模型能够预测疾病风险和治疗响应 [3]
- **监管挑战**：FDA和其他监管机构正在制定AI医疗应用的监管框架 [4]

## 详细分析

### AI辅助诊断
AI在医学影像分析中的应用最为成熟，包括CT、MRI和X光片的分析。研究表明，AI系统在肺癌、乳腺癌和糖尿病视网膜病变的诊断中表现优异。

### 药物研发
AI通过分析大量生物医学数据，能够预测分子结构和药物靶点，加速药物发现过程。例如，DeepMind的AlphaFold已经成功预测了几乎所有已知蛋白质的结构。

## 共识领域
- AI在医学影像分析中的有效性已得到广泛认可
- 个性化医疗是未来发展方向
- 数据隐私和安全是重要考虑因素

## 争议领域
- AI医疗决策的责任归属问题
- 算法偏见和公平性问题
- 监管框架的最佳设计

## 来源
[1] Topol, E. J. (2019). Deep Medicine: How Artificial Intelligence Can Make Healthcare Human Again. Basic Books.
[2] Insilico Medicine. (2023). AI-powered drug discovery platform.
[3] Harvard Medical School. (2022). Personalized medicine initiative.
[4] FDA. (2023). AI/ML Framework for Medical Devices.

## 研究空白
- 长期临床效果评估
- 跨机构数据共享的标准化
- AI与人类医生的最佳协作模式
```

### 8.2 参数化调用示例

**输入**：
```json
{
  "topic": "人工智能在医疗健康领域的应用趋势",
  "detail_level": "detailed",
  "template": "industry",
  "language": "zh-CN",
  "focus_areas": ["AI辅助诊断", "药物研发", "个性化医疗"],
  "source_types": ["academic", "industry", "official"],
  "time_range": {"start": "2020-01-01", "end": "2026-04-10"},
  "citation_style": "numbered",
  "output_format": "markdown",
  "max_sources": 15
}
```

**输出**：
```markdown
## 执行摘要
人工智能在医疗健康领域的应用正在快速发展，特别是在诊断、药物研发和个性化医疗方面展现出巨大潜力。市场规模预计从2020年的146亿美元增长到2026年的1027亿美元，年复合增长率达40.2%。

## 关键发现
- **AI辅助诊断**：AI系统在医学影像分析方面已达到或超过人类专家水平，准确率超过90% [1]
- **药物研发**：AI可将药物发现时间缩短40%，成本降低30% [2]
- **个性化医疗**：基于基因组数据的AI模型能够预测疾病风险和治疗响应 [3]
- **市场增长**：医疗AI市场预计到2026年达到1027亿美元 [4]
- **监管进展**：FDA和其他监管机构正在制定AI医疗应用的监管框架 [5]

## 详细分析

### AI辅助诊断
AI在医学影像分析中的应用最为成熟，包括CT、MRI和X光片的分析。研究表明，AI系统在肺癌、乳腺癌和糖尿病视网膜病变的诊断中表现优异。

#### 技术进展
- 深度学习模型，特别是卷积神经网络(CNN)，在医学影像分析中取得了显著进展
- 多模态AI系统能够整合不同类型的医学影像和临床数据
- 实时AI辅助诊断系统正在医院中部署，提高诊断效率

#### 市场应用
- 主要供应商：Arterys、Enlitic、GE Healthcare
- 应用场景：放射科、病理科、皮肤科
- 商业化程度：高，已有多款AI诊断系统获得FDA批准

### 药物研发
AI通过分析大量生物医学数据，能够预测分子结构和药物靶点，加速药物发现过程。

#### 技术进展
- 生成式AI模型能够设计新的分子结构
- 预测性模型能够评估药物的安全性和有效性
- 自动化实验室系统能够验证AI预测的结果

#### 市场应用
- 主要公司：Insilico Medicine、BenevolentAI、Atomwise
- 合作模式：制药公司与AI公司合作开发新药
- 成功案例：AI发现的候选药物进入临床试验阶段

### 个性化医疗
基于基因组数据的AI模型能够预测疾病风险和治疗响应，实现个性化医疗。

#### 技术进展
- 全基因组测序成本降低，使得大规模基因组数据可用
- AI模型能够分析基因组数据与临床结果的关联
- 数字孪生技术能够模拟个体对不同治疗方案的响应

#### 市场应用
- 主要公司：23andMe、AncestryDNA、Tempus
- 应用场景：癌症治疗、慢性病管理、预防医学
- 挑战：数据隐私、临床验证、保险覆盖

## 共识领域
- AI在医学影像分析中的有效性已得到广泛认可
- 个性化医疗是未来发展方向
- 数据隐私和安全是重要考虑因素
- 医疗AI市场将持续快速增长

## 争议领域
- AI医疗决策的责任归属问题
- 算法偏见和公平性问题
- 监管框架的最佳设计
- 医疗AI的成本效益分析

## 来源
[1] Topol, E. J. (2019). Deep Medicine: How Artificial Intelligence Can Make Healthcare Human Again. Basic Books.
[2] Insilico Medicine. (2023). AI-powered drug discovery platform.
[3] Harvard Medical School. (2022). Personalized medicine initiative.
[4] Grand View Research. (2023). Medical AI Market Report.
[5] FDA. (2023). AI/ML Framework for Medical Devices.
[6] McKinsey. (2022). AI in Healthcare: The State of Play.
[7] World Health Organization. (2023). AI for Health Strategy.

## 研究空白
- 长期临床效果评估
- 跨机构数据共享的标准化
- AI与人类医生的最佳协作模式
- 医疗AI的成本效益分析
- 全球医疗资源分配的公平性
```