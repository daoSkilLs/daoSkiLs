---
name: alipay-payment-integration
description: >-
  支付宝开放平台支付产品接入最佳实践。涵盖当面付、订单码支付、App支付、
  JSAPI支付、手机网站支付、电脑网站支付、预授权支付、商家扣款等全场景产品选型与集成指导。
  当用户提到"接入支付宝"、"集成支付宝支付"、"对接支付"、"支付宝收款"、
  "加个支付功能"、"支付宝下单"、"H5支付"、"小程序支付"、"预授权"、
  "付款码"、"扫码支付"、"网页支付"、"PC支付"、"周期扣款"、"自动续费"、
  "会员订阅"、"连续包月"、"代扣"时使用此 Skill。

---

# 支付宝支付集成技能

## 概述

本技能提供支付宝开放平台全场景支付产品的接入指导，包括产品选型、接口调用、安全规范等。通过模块化的文档结构，为开发者提供清晰、系统的集成指南。

## 核心模块

### 基础信息
- [技能元数据](modules/core/skill-metadata.md)
- [接入环境说明](modules/core/environment.md)
- [注意事项](modules/core/notes.md)

### 集成流程
- [集成流程约束](modules/core/integration-process.md)
- [接入路由表](modules/core/routing-table.md)
- [快速决策树](modules/core/decision-tree.md)
- [场景关键词匹配](modules/core/keyword-matching.md)
- [澄清话术](modules/core/clarification-script.md)

### 安全规范
- [安全红线](modules/core/security-guidelines.md)
- [集成校验清单](references/checklist.md)

## 产品模块

### 线下支付
- [当面付](modules/products/face-to-face-payment.md)
- [订单码支付](modules/products/order-code-payment.md)

### 线上支付
- [App支付](modules/products/app-payment.md)
- [JSAPI支付](modules/products/jsapi-payment.md)
- [手机网站支付](modules/products/mobile-web-payment.md)
- [电脑网站支付](modules/products/pc-web-payment.md)

### 特殊场景
- [预授权支付](modules/products/pre-authorization.md)
- [商家扣款](modules/products/merchant-debit.md)

## 工具模块

- [文档访问工具](modules/utils/document-access.md)
- [错误处理工具](modules/utils/error-handling.md)
- [性能优化工具](modules/utils/performance-optimization.md)

## 文档模块

- [架构设计](modules/docs/architecture.md)
- [使用指南](modules/docs/usage-guide.md)
- [维护手册](modules/docs/maintenance-guide.md)
