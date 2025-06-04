# 腾讯云语音翻译 API 文档

**最近更新时间：** 2025-04-25 02:03:56

## 1. 接口描述

**接口请求域名：** tmt.tencentcloudapi.com

本接口提供上传音频，将音频进行语音识别并翻译成文本的服务，目前开放中英互译的语音翻译服务。

待识别和翻译的音频文件可以是 pcm、mp3和speex 格式，其中支持流式传输的只有pcm格式，pcm采样率要求16kHz、位深16bit、单声道，音频内语音清晰。

如果采用流式传输的方式，要求每个分片时长200ms~500ms；如果采用非流式的传输方式，要求音频时长不超过8s。注意最后一个分片的IsEnd参数设置为1。

> **提示：** 对于一般开发者，我们建议优先使用SDK接入简化开发。SDK使用介绍请直接查看 5. 开发者资源部分。

**默认接口请求频率限制：** 5次/秒。

## 2. 输入参数

以下请求参数列表仅列出了接口请求参数和部分公共参数，完整公共参数列表见公共请求参数。

| 参数名称 | 必选 | 类型 | 描述 |
| --- | --- | --- | --- |
| Action | 是 | String | 公共参数，本接口取值：SpeechTranslate |
| Version | 是 | String | 公共参数，本接口取值：2018-03-21 |
| Region | 是 | String | 公共参数，详见产品支持的地域列表 |
| SessionUuid | 是 | String | 一段完整的语音对应一个SessionUuid<br>示例值：sid-1516105689129 |
| Source | 是 | String | 音频中的语言类型，支持语言列表<br>zh : 中文<br>en : 英文<br>示例值：zh |
| Target | 是 | String | 翻译目标语言类型，支持的语言列表<br>zh : 中文<br>en : 英文<br>示例值：en |
| AudioFormat | 是 | Integer | pcm : 146<br>speex : 16779154<br>mp3 : 83886080<br>示例值：83886080 |
| Seq | 是 | Integer | 语音分片的序号，从0开始<br>示例值：0 |
| IsEnd | 是 | Integer | 是否最后一片语音分片，0-否，1-是<br>示例值：1 |
| Data | 是 | String | 语音分片内容进行 Base64 编码后的字符串。音频内容需包含有效并可识别的文本信息。<br>示例值：%2F%2FtQxAA......OkolgkGSpWK |
| ProjectId | 否 | Integer | 项目ID，可以根据控制台-账号中心-项目管理中的配置填写，如无配置请填写默认项目ID:0<br>示例值：0 |

## 3. 输出参数

| 参数名称 | 类型 | 描述 |
| --- | --- | --- |
| SessionUuid | String | 请求的SessionUuid直接返回<br>示例值：sid-1516105689129 |
| RecognizeStatus | Integer | 语音识别状态 1-进行中 0-完成<br>示例值：0 |
| SourceText | String | 识别出的原文<br>示例值：你好。 |
| TargetText | String | 翻译出的译文<br>示例值：Hello. |
| Seq | Integer | 第几个语音分片<br>示例值：0 |
| Source | String | 原语言<br>示例值：zh |
| Target | String | 目标语言<br>示例值：en |
| VadSeq | Integer | 当请求的Mode参数填写bvad是，启动VadSeq。此时Seq会被设置为后台vad（静音检测）后的新序号，而VadSeq代表客户端原始Seq值<br>示例值：0 |
| RequestId | String | 唯一请求 ID，由服务端生成，每次请求都会返回（若请求因其他原因未能抵达服务端，则该次请求不会获得 RequestId）。定位问题时需要提供该次请求的 RequestId。 |

## 4. 示例

### 示例1: API调用

#### 输入示例

```http
POST / HTTP/1.1
Host: tmt.tencentcloudapi.com
Content-Type: application/json
X-TC-Action: SpeechTranslate
<公共请求参数>

{
    "Target": "en",
    "Seq": 0,
    "ProjectId": 0,
    "SessionUuid": "sid-1516105689129",
    "Source": "zh",
    "AudioFormat": 83886080,
    "Data": "=%2F%2FtQxAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\n......\nMGCwUAU4UeWgJDOGmC2JgzouqHJQBsZiKUicVTU5UGTZ6mVJYlri5s9geZdCjBnExqtEsaw%2F5rtShQ6UOkolgkGSpWK",
    "IsEnd": 1
}
```

#### 输出示例

```json
{
    "Response": {
        "RecognizeStatus": 0,
        "RequestId": "6e698139-615a-4d42-8dea-6bfada24e83c",
        "Seq": 0,
        "SessionUuid": "sid-1516105689129",
        "Source": "zh",
        "SourceText": "你好。",
        "Target": "en",
        "TargetText": "Hello.",
        "VadSeq": 0
    }
}
```

## 5. 开发者资源

### 腾讯云 API 平台

腾讯云 API 平台是综合 API 文档、错误码、API Explorer 及 SDK 等资源的统一查询平台，方便您从同一入口查询及使用腾讯云提供的所有 API 服务。

### API Inspector

用户可通过 API Inspector 查看控制台每一步操作关联的 API 调用情况，并自动生成各语言版本的 API 代码，也可前往 API Explorer 进行在线调试。

### SDK

云 API 3.0 提供了配套的开发工具集（SDK），支持多种编程语言，能更方便的调用 API。

- Tencent Cloud SDK 3.0 for Python: [GitHub](https://github.com/TencentCloud/tencentcloud-sdk-python), [Gitee](https://gitee.com/tencentcloud/tencentcloud-sdk-python)
- Tencent Cloud SDK 3.0 for Java: [GitHub](https://github.com/TencentCloud/tencentcloud-sdk-java), [Gitee](https://gitee.com/tencentcloud/tencentcloud-sdk-java)
- Tencent Cloud SDK 3.0 for PHP: [GitHub](https://github.com/TencentCloud/tencentcloud-sdk-php), [Gitee](https://gitee.com/tencentcloud/tencentcloud-sdk-php)
- Tencent Cloud SDK 3.0 for Go: [GitHub](https://github.com/TencentCloud/tencentcloud-sdk-go), [Gitee](https://gitee.com/tencentcloud/tencentcloud-sdk-go)
- Tencent Cloud SDK 3.0 for Node.js: [GitHub](https://github.com/TencentCloud/tencentcloud-sdk-nodejs), [Gitee](https://gitee.com/tencentcloud/tencentcloud-sdk-nodejs)
- Tencent Cloud SDK 3.0 for .NET: [GitHub](https://github.com/TencentCloud/tencentcloud-sdk-dotnet), [Gitee](https://gitee.com/tencentcloud/tencentcloud-sdk-dotnet)
- Tencent Cloud SDK 3.0 for C++: [GitHub](https://github.com/TencentCloud/tencentcloud-sdk-cpp), [Gitee](https://gitee.com/tencentcloud/tencentcloud-sdk-cpp)
- Tencent Cloud SDK 3.0 for Ruby: [GitHub](https://github.com/TencentCloud/tencentcloud-sdk-ruby), [Gitee](https://gitee.com/tencentcloud/tencentcloud-sdk-ruby)

### 命令行工具

- Tencent Cloud CLI 3.0

## 6. 错误码

以下仅列出了接口业务逻辑相关的错误码，其他错误码详见公共错误码。

| 错误码 | 描述 |
| --- | --- |
| FailedOperation.ErrorUserArea | 用户区域与请求服务区域不一致。 |
| FailedOperation.NoFreeAmount | 本月免费额度已用完，如需继续使用您可以在机器翻译控制台升级为付费使用。 |
| FailedOperation.ServiceIsolate | 账号因为欠费停止服务，请在腾讯云账户充值。 |
| FailedOperation.StopUsing | 账号已停服。 |
| FailedOperation.UserNotRegistered | 服务未开通，请在腾讯云官网机器翻译控制台开通服务。 |
| InternalError | 内部错误。 |
| InternalError.BackendTimeout | 后台服务超时，请稍后重试。 |
| InternalError.ErrorUnknown | 未知错误。 |
| InternalError.RequestFailed | 请求失败。 |
| InvalidParameter | 参数错误。 |
| InvalidParameter.DuplicatedSessionIdAndSeq | 重复的SessionUuid和Seq组合。 |
| InvalidParameter.MissingParameter | 参数错误。 |
| InvalidParameter.SeqIntervalTooLarge | Seq之间的间隙请不要大于2000。 |
| LimitExceeded | 超过配额限制。 |
| LimitExceeded.LimitedAccessFrequency | 超出请求频率。 |
| MissingParameter | 缺少参数错误。 |
| UnauthorizedOperation.ActionNotFound | 请填写正确的Action字段名称。 |
| UnsupportedOperation | 操作不支持。 |
| UnsupportedOperation.AudioDurationExceed | 音频分片长度超过限制，请保证分片长度小于8s。 |
| UnsupportedOperation.TextTooLong | 单次请求text超过长度限制。 |
| UnsupportedOperation.UnSupportedTargetLanguage | 不支持的目标语言，请参照语言列表。 |
| UnsupportedOperation.UnsupportedLanguage | 不支持的语言，请参照语言列表。 |
| UnsupportedOperation.UnsupportedSourceLanguage | 不支持的源语言，请参照语言列表。 |