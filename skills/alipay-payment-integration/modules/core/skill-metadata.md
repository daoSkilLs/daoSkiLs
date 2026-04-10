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

## 文档访问规范

访问支付宝在线文档时，直接使用 curl 获取内容：

```bash
# 示例：获取当面付文档
curl -sL "https://ideservice.alipay.com/cms/site/0izcu3"
```

### 递归访问

文档页面内包含的链接需要递归访问以获取完整内容。访问流程：

1. 首先访问主文档 URL
2. 解析文档中的链接（产品介绍、接入准备、接口文档等）
3. 递归访问这些链接获取详细内容

```bash
# 访问当面付子链接示例
curl -sL "https://ideservice.alipay.com/cms/site/0izal0"   # 产品介绍
curl -sL "https://ideservice.alipay.com/cms/site/0izal1"   # 接入准备
```
