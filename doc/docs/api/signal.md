# 签名方法 v3

**最近更新时间：** 2024-12-25 02:06:35

## 目录

- [签名方法 v3](#签名方法-v3)
  - [目录](#目录)
  - [为什么要进行签名](#为什么要进行签名)
  - [申请安全凭证](#申请安全凭证)
  - [签名版本 v3 签名过程](#签名版本-v3-签名过程)
    - [1. 拼接规范请求串](#1-拼接规范请求串)
    - [2. 拼接待签名字符串](#2-拼接待签名字符串)
    - [3. 计算签名](#3-计算签名)
    - [4. 拼接 Authorization](#4-拼接-authorization)
  - [签名演示](#签名演示)
    - [各语言实现](#各语言实现)

> 以下文档说明了签名方法 v3 的签名过程，但仅在您编写自己的代码来调用腾讯云 API 时才有用。我们推荐您使用[腾讯云 API Explorer](https://console.cloud.tencent.com/api/explorer)，腾讯云 SDK 和腾讯云命令行工具（TCCLI）等开发者工具，从而无需学习如何对 API 请求进行签名。

**推荐使用 API Explorer：**
- 点击调试
- 您可以通过 API Explorer 的【签名串生成】模块查看每个接口签名的生成过程。

腾讯云 API 会对每个请求进行身份验证，用户需要使用安全凭证，经过特定的步骤对请求进行签名（Signature），每个请求都需要在公共参数中指定该签名结果并以指定的方式和格式发送请求。

## 为什么要进行签名

签名通过以下方式帮助保护请求：

1. **验证请求者的身份**
   - 签名确保请求是由持有有效访问密钥的人发送的。请参阅控制台[云 API 密钥](https://console.cloud.tencent.com/cam/capi)页面获取密钥相关信息。

2. **保护传输中的数据**
   - 为了防止请求在传输过程中被篡改，腾讯云 API 会使用请求参数来计算请求的哈希值，并将生成的哈希值加密后作为请求的一部分，发送到腾讯云 API 服务器。服务器会使用收到的请求参数以同样的过程计算哈希值，并验证请求中的哈希值。如果请求被篡改，将导致哈希值不一致，腾讯云 API 将拒绝本次请求。

签名方法 v3（TC3-HMAC-SHA256）功能上覆盖了以前的签名方法 v1，而且更安全，支持更大的请求，支持 JSON 格式，POST 请求支持传空数组和空字符串，性能有一定提升，推荐使用该签名方法计算签名。

首次接触，建议使用 API Explorer 中的"签名串生成"功能，选择签名版本为"API 3.0 签名 v3"，可以对生成签名过程进行验证，也可直接生成 SDK 代码。推荐使用腾讯云 API 配套的 8 种常见的编程语言 SDK，已经封装了签名和请求过程，均已开源，支持 Python、Java、PHP、Go、NodeJS、.NET、C++、Ruby。

## 申请安全凭证

本文使用的安全凭证为密钥，密钥包括 SecretId 和 SecretKey。每个用户最多可以拥有两对密钥。

- **SecretId**：用于标识 API 调用者身份，可以简单类比为用户名。
- **SecretKey**：用于验证 API 调用者的身份，可以简单类比为密码。

> **重要提示**：用户必须严格保管安全凭证，避免泄露，否则将危及财产安全。如已泄露，请立刻禁用该安全凭证。

申请安全凭证的具体步骤如下：

1. 登录[腾讯云管理中心控制台](https://console.cloud.tencent.com/)。
2. 前往[云API密钥](https://console.cloud.tencent.com/cam/capi)的控制台页面。
3. 在云API密钥页面，单击【新建密钥】创建一对密钥。

## 签名版本 v3 签名过程

云 API 支持 GET 和 POST 请求。对于GET方法，只支持 Content-Type: application/x-www-form-urlencoded 协议格式。对于POST方法，目前支持 Content-Type: application/json 以及 Content-Type: multipart/form-data 两种协议格式，json 格式绝大多数接口均支持，multipart 格式只有特定接口支持，此时该接口不能使用 json 格式调用，参考具体业务接口文档说明。推荐使用 POST 请求，因为两者的结果并无差异，但 GET 请求只支持 32 KB 以内的请求包。

下面以云服务器查询广州区实例列表作为例子，分步骤介绍签名的计算过程。我们选择该接口是因为：

- 云服务器默认已开通，该接口很常用；
- 该接口是只读的，不会改变现有资源的状态；
- 接口覆盖的参数种类较全，可以演示包含数据结构的数组如何使用。

在示例中，不论公共参数或者接口的参数，我们尽量选择容易犯错的情况。在实际调用接口时，请根据实际情况来，每个接口的参数并不相同，不要照抄这个例子的参数和值。此外，这里只展示了部分公共参数和接口输入参数，用户可以根据实际需要添加其他参数，例如 Language 和 Token 公共参数（在 HTTP 头部设置，添加 X-TC- 前缀）。

假设用户的 SecretId 和 SecretKey 分别是：AKID******************************** 和 ********************************。用户想查看广州区云服务器名为"未命名"的主机状态，只返回一条数据。则请求可能为：

```bash
curl -X POST https://cvm.tencentcloudapi.com \
-H "Authorization: TC3-HMAC-SHA256 Credential=AKID********************************/2019-02-25/cvm/tc3_request, SignedHeaders=content-type;host;x-tc-action, Signature=10b1a37a7301a02ca19a647ad722d5e43b4b3cff309d421d85b46093f6ab6c4f" \
-H "Content-Type: application/json; charset=utf-8" \
-H "Host: cvm.tencentcloudapi.com" \
-H "X-TC-Action: DescribeInstances" \
-H "X-TC-Timestamp: 1551113065" \
-H "X-TC-Version: 2017-03-12" \
-H "X-TC-Region: ap-guangzhou" \
-d '{"Limit": 1, "Filters": [{"Values": ["\u672a\u547d\u540d"], "Name": "instance-name"}]}'
```

下面详细解释签名计算过程。

### 1. 拼接规范请求串

按如下伪代码格式拼接规范请求串（CanonicalRequest）：

```
CanonicalRequest =
    HTTPRequestMethod + '\n' +
    CanonicalURI + '\n' +
    CanonicalQueryString + '\n' +
    CanonicalHeaders + '\n' +
    SignedHeaders + '\n' +
    HashedRequestPayload
```

| 字段名称 | 解释 |
| --- | --- |
| HTTPRequestMethod | HTTP 请求方法（GET、POST）。此示例取值为 POST。 |
| CanonicalURI | URI 参数，API 3.0 固定为正斜杠（/）。 |
| CanonicalQueryString | 发起 HTTP 请求 URL 中的查询字符串，对于 POST 请求，固定为空字符串""，对于 GET 请求，则为 URL 中问号（?）后面的字符串内容，例如：Limit=10&Offset=0。<br>**注意**：CanonicalQueryString 需要参考 RFC3986 进行 URLEncode 编码（特殊字符编码后需大写字母），字符集 UTF-8。推荐使用编程语言标准库进行编码。 |
| CanonicalHeaders | 参与签名的头部信息，至少包含 host 和 content-type 两个头部，也可加入其他头部参与签名以提高自身请求的唯一性和安全性，此示例额外增加了接口名头部。<br>拼接规则：<br>- 头部 key 和 value 统一转成小写，并去掉首尾空格，按照 key:value\n 格式拼接；<br>- 多个头部，按照头部 key（小写）的 ASCII 升序进行拼接。<br>此示例计算结果是 `content-type:application/json; charset=utf-8\nhost:cvm.tencentcloudapi.com\nx-tc-action:describeinstances\n`。<br>**注意**：content-type 必须和实际发送的相符合，有些编程语言网络库即使未指定也会自动添加 charset 值，如果签名时和发送时不一致，服务器会返回签名校验失败。 |
| SignedHeaders | 参与签名的头部信息，说明此次请求有哪些头部参与了签名，和 CanonicalHeaders 包含的头部内容是一一对应的。content-type 和 host 为必选头部。<br>拼接规则：<br>- 头部 key 统一转成小写；<br>- 多个头部 key（小写）按照 ASCII 升序进行拼接，并且以分号（;）分隔。<br>此示例为 `content-type;host;x-tc-action` |
| HashedRequestPayload | 请求正文（payload，即 body，此示例为 `{"Limit": 1, "Filters": [{"Values": ["\u672a\u547d\u540d"], "Name": "instance-name"}]}`）的哈希值，计算伪代码为 Lowercase(HexEncode(Hash.SHA256(RequestPayload)))，即对 HTTP 请求正文做 SHA256 哈希，然后十六进制编码，最后编码串转换成小写字母。对于 GET 请求，RequestPayload 固定为空字符串。此示例计算结果是 `35e9c5b0e3ae67532d3c9f17ead6c90222632e5b1ff7f6e89887f1398934f064`。 |

根据以上规则，示例中得到的规范请求串如下：

```
POST
/

content-type:application/json; charset=utf-8
host:cvm.tencentcloudapi.com
x-tc-action:describeinstances

content-type;host;x-tc-action
35e9c5b0e3ae67532d3c9f17ead6c90222632e5b1ff7f6e89887f1398934f064
```

### 2. 拼接待签名字符串

按如下格式拼接待签名字符串：

```
StringToSign =
    Algorithm + "\n" +
    RequestTimestamp + "\n" +
    CredentialScope + "\n" +
    HashedCanonicalRequest
```

| 字段名称 | 解释 |
| --- | --- |
| Algorithm | 签名算法，目前固定为 TC3-HMAC-SHA256。 |
| RequestTimestamp | 请求时间戳，即请求头部的公共参数 X-TC-Timestamp 取值，取当前时间 UNIX 时间戳，精确到秒。此示例取值为 1551113065。 |
| CredentialScope | 凭证范围，格式为 Date/service/tc3_request，包含日期、所请求的服务和终止字符串（tc3_request）。Date 为 UTC 标准时间的日期，取值需要和公共参数 X-TC-Timestamp 换算的 UTC 标准时间日期一致；service 为产品名，必须与调用的产品域名一致。此示例计算结果是 2019-02-25/cvm/tc3_request。 |
| HashedCanonicalRequest | 前述步骤拼接所得规范请求串的哈希值，计算伪代码为 Lowercase(HexEncode(Hash.SHA256(CanonicalRequest)))。此示例计算结果是 7019a55be8395899b900fb5564e4200d984910f34794a27cb3fb7d10ff6a1e84。 |

> **注意**：
> 
> - Date 必须从时间戳 X-TC-Timestamp 计算得到，且时区为 UTC+0。如果加入系统本地时区信息，例如东八区，将导致白天和晚上调用成功，但是凌晨时调用必定失败。假设时间戳为 1551113065，在东八区的时间是 2019-02-26 00:44:25，但是计算得到的 Date 取 UTC+0 的日期应为 2019-02-25，而不是 2019-02-26。
> - Timestamp 必须是当前系统时间，且需确保系统时间和标准时间是同步的，如果相差超过五分钟则必定失败。如果长时间不和标准时间同步，可能运行一段时间后，请求失败，返回签名过期错误。

根据以上规则，示例中得到的待签名字符串如下：

```
TC3-HMAC-SHA256
1551113065
2019-02-25/cvm/tc3_request
7019a55be8395899b900fb5564e4200d984910f34794a27cb3fb7d10ff6a1e84
```

### 3. 计算签名

1）计算派生签名密钥，伪代码如下：

```
SecretKey = "********************************"
SecretDate = HMAC_SHA256("TC3" + SecretKey, Date)
SecretService = HMAC_SHA256(SecretDate, Service)
SecretSigning = HMAC_SHA256(SecretService, "tc3_request")
```

派生出的密钥 SecretDate、SecretService 和 SecretSigning 是二进制的数据，可能包含不可打印字符，将其转为十六进制字符串打印的输出分别为：
- SecretDate: `da98fb70dcf6b112dc21038d1eeeb3a95c74b4dcb12c1131f864f6066bd02be0`
- SecretService: `8d70cbefb03939f929db64d32dc2ba89b1095620119fe3e050e2b18c5bd2752f`
- SecretSigning: `b596b923aad85185e2d1f6659d2a062e0a86731226e021e61bfe06f7ed05f5af`

> **请注意**：不同的编程语言，HMAC 库函数中参数顺序可能不一样，请以实际情况为准。此处的伪代码密钥参数 key 在前，消息参数 data 在后。通常标准库函数会提供二进制格式的返回值，也可能会提供打印友好的十六进制格式的返回值，此处使用的是二进制格式。

| 字段名称 | 解释 |
| --- | --- |
| SecretKey | 原始的 SecretKey，即 ********************************。 |
| Date | 即 Credential 中的 Date 字段信息。此示例取值为 2019-02-25。 |
| Service | 即 Credential 中的 Service 字段信息。此示例取值为 cvm。 |

2）计算签名，伪代码如下：

```
Signature = HexEncode(HMAC_SHA256(SecretSigning, StringToSign))
```

此示例计算结果是 `10b1a37a7301a02ca19a647ad722d5e43b4b3cff309d421d85b46093f6ab6c4f`。

### 4. 拼接 Authorization

按如下格式拼接 Authorization：

```
Authorization =
    Algorithm + ' ' +
    'Credential=' + SecretId + '/' + CredentialScope + ', ' +
    'SignedHeaders=' + SignedHeaders + ', ' +
    'Signature=' + Signature
```

| 字段名称 | 解释 |
| --- | --- |
| Algorithm | 签名方法，固定为 TC3-HMAC-SHA256。 |
| SecretId | 密钥对中的 SecretId，即 AKID********************************。 |
| CredentialScope | 见上文，凭证范围。此示例计算结果是 2019-02-25/cvm/tc3_request。 |
| SignedHeaders | 见上文，参与签名的头部信息。此示例取值为 content-type;host;x-tc-action。 |
| Signature | 签名值。此示例计算结果是 10b1a37a7301a02ca19a647ad722d5e43b4b3cff309d421d85b46093f6ab6c4f。 |

根据以上规则，示例中得到的值为：

```
TC3-HMAC-SHA256 Credential=AKID********************************/2019-02-25/cvm/tc3_request, SignedHeaders=content-type;host;x-tc-action, Signature=10b1a37a7301a02ca19a647ad722d5e43b4b3cff309d421d85b46093f6ab6c4f
```

最终完整的调用信息如下：

```http
POST https://cvm.tencentcloudapi.com/
Authorization: TC3-HMAC-SHA256 Credential=AKID********************************/2019-02-25/cvm/tc3_request, SignedHeaders=content-type;host;x-tc-action, Signature=10b1a37a7301a02ca19a647ad722d5e43b4b3cff309d421d85b46093f6ab6c4f
Content-Type: application/json; charset=utf-8
Host: cvm.tencentcloudapi.com
X-TC-Action: DescribeInstances
X-TC-Version: 2017-03-12
X-TC-Timestamp: 1551113065
X-TC-Region: ap-guangzhou

{"Limit": 1, "Filters": [{"Values": ["\u672a\u547d\u540d"], "Name": "instance-name"}]}
```

> **注意**：请求发送时的 HTTP 头部（Header）和请求体（Payload）必须和签名计算过程中的内容完全一致，否则会返回签名不一致错误。可以通过打印实际请求内容，网络抓包等方式对比排查。

## 签名演示

在实际调用 API 3.0 时，推荐使用配套的腾讯云 SDK 3.0，SDK 封装了签名的过程，开发时只关注产品提供的具体接口即可。详细信息参见 [SDK 中心](https://cloud.tencent.com/document/sdk)。

### 各语言实现

当前支持的编程语言有：

- [Python](https://github.com/TencentCloud/tencentcloud-sdk-python)
- [Java](https://github.com/TencentCloud/tencentcloud-sdk-java)
- [PHP](https://github.com/TencentCloud/tencentcloud-sdk-php)
- [Go](https://github.com/TencentCloud/tencentcloud-sdk-go)
- [NodeJS](https://github.com/TencentCloud/tencentcloud-sdk-nodejs)
- [.NET](https://github.com/TencentCloud/tencentcloud-sdk-dotnet)
- [C++](https://github.com/TencentCloud/tencentcloud-sdk-cpp)
- [Ruby](https://github.com/TencentCloud/tencentcloud-sdk-ruby)