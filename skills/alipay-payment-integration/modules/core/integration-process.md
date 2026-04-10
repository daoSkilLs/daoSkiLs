# 集成流程约束

## 步骤1. 集成信息收集

接入前根据用户输入必须阅读下列文档：
- **SDK选择**：根据开发语言选择通用版或Easy版SDK来进行集成。[下载地址](https://ideservice.alipay.com/cms/site/0j0cjj)
- **加签方式**：签名支持 RSA 和 RSA2，推荐使用 RSA2（SHA256WithRSA）。[加签说明](https://ideservice.alipay.com/cms/site/02mriz)

## 步骤2. 获取产品集成文档

- **根据路由到的产品文档获取完整集成信息**：必须阅读快速接入、完整的接口文档列表、异步通知说明、注意事项等。根据用户输入和接入诉求尽可能多的收集信息，使用curl指令访问文档。

- **必须阅读接入规范与常见陷阱**：[接入规范](https://ideservice.alipay.com/cms/site/0j0kl2)

- **公共错误码说明**：此处为公共错误码说明，开发者在接入过程中遇到其他报错信息，可以参考所调用接口的 API 文档的 **业务错误码** 部分。[错误码说明](https://ideservice.alipay.com/cms/site/02km9f)

## 步骤3. 集成校验

在集成过程中及发布上线前进行校验，确保签名验签、异步通知、异常处理等符合规范。校验结果供参考，开发者务必按照支付宝最新开放平台文档进行检查。详见：[集成校验清单](../references/checklist.md)
