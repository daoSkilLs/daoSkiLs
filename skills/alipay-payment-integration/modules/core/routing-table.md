# 接入路由表

根据用户的业务场景，路由到对应的产品文档：

| 场景 | 推荐产品 | 核心 API | 在线文档 |
| --- | --- | --- | --- |
| 线下门店，用户出示付款码，商家扫码枪扫码收款 | 当面付 | `alipay.trade.pay` | [当面付文档](https://ideservice.alipay.com/cms/site/0izcu3) |
| 商家生成二维码，用户打开支付宝扫码付款 | 订单码支付 | `alipay.trade.precreate` | [订单码支付文档](https://ideservice.alipay.com/cms/site/0izg0z) |
| 手机浏览器 H5 页面内唤起支付宝付款 | 手机网站支付 | `alipay.trade.wap.pay` | [手机网站支付文档](https://ideservice.alipay.com/cms/site/0izne3) |
| 电脑浏览器网页内跳转支付宝收银台 | 电脑网站支付 | `alipay.trade.page.pay` | [电脑网站支付文档](https://ideservice.alipay.com/cms/site/0iztfv) |
| 支付宝小程序内调起支付 | JSAPI 支付 | `alipay.trade.create` + `my.tradePay` | [JSAPI 支付文档](https://ideservice.alipay.com/cms/site/0izg0f) |
| 原生 iOS/Android/鸿蒙 App 内调起支付宝付款 | App 支付 | `alipay.trade.app.pay` | [App 支付文档](https://ideservice.alipay.com/cms/site/0izsn4) |
| 押金冻结、信用住、免押租赁 | 预授权支付 | `alipay.fund.auth.order.app.freeze` | [预授权支付文档](https://ideservice.alipay.com/cms/site/0j0lyx) |
| 周期扣款、自动续费、会员订阅、连续包月 | 商家扣款 | `alipay.trade.app.pay`（支付并签约）+ `alipay.trade.pay`（后续扣款） | [商家扣款文档](https://ideservice.alipay.com/cms/site/0j0g6k) |

回答任何接入问题或编写代码前，先通过 curl 阅读上表中对应的在线文档链接。文档内包含最新的接口参数、代码示例和注意事项。
