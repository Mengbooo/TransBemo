# 短语音识别标准版API

**更新时间：** 2025-03-28

## 接口描述

将60秒以内的语音精准识别为文字，可适用于手机语音输入、智能语音交互、语音指令、语音搜索等短语音交互场景。

## 调用流程

1. **前置准备：** 注册百度智能云账号，完成实名认证，并获取鉴权凭证。您可以在access_token或API Key两种鉴权方式中选择一种，获取方式请参考鉴权认证
2. **创建识别请求：** POST 方式，音频可通过 JSON 和 RAW 两种方式提交。JSON 方式音频数据由于 base64 编码，数据会增大1/3。其他填写具体请求参数，详见"请求说明"。
3. **短语音识别请求地址：** `http://vop.baidu.com/server_api`
4. **返回识别结果：** 识别结果会即刻返回，采用 JSON 格式封装，如果识别成功，识别结果放在 JSON 的 "result" 字段中，统一采用 utf-8 方式编码。详见"返回说明"。

## 音频格式

格式支持：pcm（不压缩）、wav（不压缩，pcm编码）、amr（压缩格式）、m4a（压缩格式）。推荐pcm 采样率：16000、8000（仅支持普通话模型）固定值。编码：16bit 位深的单声道。

百度服务端会将非pcm格式，转为pcm格式，因此使用wav、amr、m4a会有额外的转换耗时。

- [16k 采样率 pcm 文件样例下载](#)
- [16k 采样率 wav 文件样例下载](#)
- [16k 采样率 amr 文件样例下载](#)
- [16k 采样率 m4a 文件样例下载](#)

### m4a 格式说明

目前普通版、极速版均支持m4a格式。主要针对微信小程序的录音。

#### m4a 格式（AAC 编码）

- 仅支持单声道
- 采样率支持 16000、8000（仅支持普通话模型）
- CBR bitrates 24000-96000，推荐 48000
- 仅支持 AAC-LC，不支持例如 HE-AAC，LD，ELD 等
- brand 仅支持 mp42:0, mini Version 0, 不支持 M4A

#### 微信小程序录音设置

微信小程序录音设置，见[微信官方文档](#)

微信小程序录音参数，请重点关注并设置以下必填字段：

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| ---- | ---- | ------ | ---- | ---- |
| duration | number | 60000 | 否 | 百度语音restapi最大支持 60s，即这个值不能超过60000 |
| sampleRate | number | 16000 | 是 | 可设为16000或8000 |
| numberOfChannels | number | 1 | 是 | 比如设为1，单声道 |
| encodeBitRate | number | 48000 | 否 | 默认值即可，建议48000，可设为24000-96000。该值越大的话，生成文件越大 |
| format | string | aac | 否 | 默认值即可，只支持aac，不支持mp3 |

## 在线调试&示例代码

您可以在[示例代码中心](#)中调试该接口，可进行签名验证、查看在线调用的请求内容和返回结果、示例代码的自动生成。

示例代码见： https://github.com/Baidu-AIP/speech-demo

包含通过bash_shell，C，Java，Python，Php，Postman进行API请求的相关示例demo代码。

## 请求说明

语音数据上传 POST 方式有 2 种：

1. JSON 格式 POST 上传本地音频文件。
2. RAW 格式 POST 上传本地音频文件。

两种方式均需鉴权认证通过才能使用。如您使用的是API Key鉴权方式，在请求的Header头域中的Authorization字段，需要包含API Key的鉴权信息。注意:填入鉴权信息时，需要在API Key或短期API Key前面加上Bearer

### 请求头域

| 参数 | 示例 |
| ---- | ---- |
| Authorization | Bearer bce-v3/ALTAK-DaIdq27UJ9Y2UEDIWx1EF/1c518f0576wee39sd59fd73983749109qq8ciq37 |

如您使用的是access_token鉴权方式，需要按照下文的token参数填写要求，填在对应的位置上。

两种鉴权方式二选其一即可，请不要同时使用两种鉴权方式，以免调用出错。

### JSON 方式

- 音频文件，读取二进制内容后，进行 base64 编码后放在 speech 参数内。
- 音频文件的原始大小, 即二进制内容的字节数，填写 "len" 字段
- 由于使用 json 格式，header 为：

```
Content-Type:application/json
```

> 注意：由于 base64 编码后，数据会增大 1/3。

### RAW方式

- 音频文件，读取二进制内容后，直接放在 body 中。
- Content-Length 的值即为音频文件的大小。（一般代码会自动生成）。
- 由于使用 raw 方式，采样率和文件格式需要填写在 Content-Type 中

```
Content-Type: audio/pcm;rate=16000
```

### JSON方式上传音频

语音数据和其他参数通过标准 JSON 格式串行化 POST 上传，JSON 里包括的参数：

| 字段名 | 类型 | 可需 | 描述 |
| ------ | ---- | ---- | ---- |
| format | string | 必填 | 语音文件的格式，pcm/wav/amr/m4a。不区分大小写。推荐pcm文件 |
| rate | int | 必填 | 采样率，16000、8000，固定值 |
| channel | int | 必填 | 声道数，仅支持单声道，请填写固定值 1 |
| cuid | string | 必填 | 用户唯一标识，用来区分用户，计算UV值。建议填写能区分用户的机器 MAC 地址或 IMEI 码，长度为60字符以内。 |
| token | string | 和API Key二选一 | access_token鉴权信息，获取方式见鉴权认证 |
| dev_pid | int | 选填 | 不填写lan参数生效，都不填写，默认1537（普通话 输入法模型），见本节识别模型dev_pid参数 |
| lm_id | int | 选填 | 自训练平台模型id，填dev_pid = 1537生效 |
| lan | string | 选填，废弃参数 | 历史兼容参数，已不再使用 |
| speech | string | 必填 | 本地语音文件的二进制语音数据，需要进行base64 编码。与len参数连一起使用。 |
| len | int | 必填 | 本地语音文件的的字节数，单位字节 |

#### 上传示例

**JSON 格式 POST 上传本地文件**

固定头部 header：

```
Content-Type:application/json
```

请求示例：

```
POST http://vop.baidu.com/server_api 
```

speech 参数填写为文件内容 base64 后的结果：

```json
{
    "format":"pcm",
    "rate":16000,
    "dev_pid":1537,
    "channel":1,
    "token":"xxx",
    "cuid":"baidu_workshop",
    "len":4096,
    "speech":"xxx" // xxx为 base64（FILE_CONTENT）
}
```

返回示例：

```json
{"corpus_no":"6433214037620997779","err_msg":"success.","err_no":0,"result":["北京科技馆，"],"sn":"371191073711497849365"}
```

**注意事项**

len 字段表示原始语音大小字节数，不是 base64 编码之后的长度。

### RAW 方式上传音频

语音数据直接放在 HTTP BODY 中，控制参数以及相关统计信息通过 header 和 url 里参数传递。

#### Header 参数说明

| 字段名 | 数据类型 | 可需 | 描述 |
| ------ | -------- | ---- | ---- |
| format | string（格式见下面示例） | 必填 | 语音格式，pcm/wav/amr/(m4a仅支持极速版)。不区分大小写，推荐使用pcm文件 |
| rate | int（格式见下面示例） | 必填 | 采样率 16000、8000，固定值 |

语音数据的采样率和压缩格式在 HTTP-HEADER 里的 Content-Type 表明，例：

```
Content-Type: audio/pcm;rate=16000
```

#### URL 参数说明

| 字段名 | 可需 | 描述 |
| ------ | ---- | ---- |
| cuid | 必填 | 用户唯一标识，用来区分用户，计算 UV 值。建议填写能区分用户的机器 MAC 地址或 IMEI 码，长度为 60 字符以内。 |
| token | 必填 | access_token鉴权信息，获取方式见鉴权认证 |
| dev_pid | 选填 | 不填写 lan 参数生效，都不填写，默认 1537（普通话 输入法模型），dev_pid 参数见本节开头的表格 |
| lm_id | 选填 | 自训练平台模型id |
| lan | 选填，废弃参数 | 历史兼容参数，已不再使用。 |

URL 示例：

```
POST http://vop.baidu.com/server_api?dev_pid=1537&cuid=******&token=1.a6b7dbd428f731035f771b8d********.86400.1292922000-2346678-124328

// 或者使用自训练平台

POST http://vop.baidu.com/server_api?dev_pid=1537&lm_id=1234&cuid=******&token=1.a6b7dbd428f731035f771b8d********.86400.1292922000-2346678-124328 
```

raw 方式测试示例：

```bash
curl -i -X POST -H "Content-Type: audio/pcm;rate=16000" "http://vop.baidu.com/server_api?dev_pid=1537&cuid=xxxxx&token=1.a6b7dbd428f731035f771b8d********.86400.1292922000-2346678-124328" --data-binary "@/home/test/test.pcm"
```

## 识别模型 dev_pid 参数

### dev_pid 参数列表

#### 短语音识别

请求地址: http://vop.baidu.com/server_api

| dev_pid | 语言 | 模型 | 是否有标点 | 备注 |
| ------- | ---- | ---- | ---------- | ---- |
| 1537 | 普通话(纯中文识别) | 语音近场识别模型 | 有标点 | 支持自定义词库 |
| 1737 | 英语 | 英语模型 | 无标点 | 不支持自定义词库 |
| 1637 | 粤语 | 粤语模型 | 有标点 | 不支持自定义词库 |
| 1837 | 四川话 | 四川话模型 | 有标点 | 不支持自定义词库 |

#### 自训练平台

请求地址: http://vop.baidu.com/server_api

| lm_id | 语言 | 模型 | 是否有标点 | 备注 |
| ----- | ---- | ---- | ---------- | ---- |
| 自训练平台获取 | 中文普通话 | 输入法模型 | 有逗号 | 使用自训练平台训练，不需要自定义词库 |

> 如果您在百度云购买服务器，可以通过内网域名vop.baidubce.com替换vop.baidu.com访问。该域名可免外网流量费用，且返回识别结果速度更快

## 自定义词库

自定义词库功能，可对部分专有业务名词进行识别优化。自定义词库在您网页申请的应用内设置（具体位置参见下图）。

![自定义词库设置位置](图片链接)

自定义词库适合短句，保证词库中一模一样的短句可以被识别出，词库中的分词优先级较高。自定义词库仅对普通话 dev_pid = 1537 生效，并且原始音频的采用率为 16K 或 8k。最好在 1万 行以内。

## 返回说明

两种上传方式都返回统一的结果，采用 JSON 格式封装，如果识别成功，识别结果放在 JSON 的 "result" 字段中，统一采用 utf-8 方式编码。

| 字段名 | 数据类型 | 可需 | 描述 |
| ------ | -------- | ---- | ---- |
| err_no | int | 必填 | 错误码 |
| err_msg | string | 必填 | 错误码描述 |
| sn | string | 必填 | 语音数据唯一标识，系统内部产生。如果反馈及 debug 请提供 sn。 |
| result | array ([string,string,...]) | 选填 | 识别结果数组，返回1个最优候选结果。utf-8 编码。 |

### 识别成功返回示例

```json
{
  "err_no": 0,
  "err_msg": "success.",
  "corpus_no": "15984125203285346378",
  "sn": "481D633F-73BA-726F-49EF-8659ACCC2F3D",
  "result": ["北京天气"]
}
```

### 识别错误返回示例

```json
{
  "err_no": 2000,
  "err_msg": "data empty.",
  "sn": "481D633F-73BA-726F-49EF-8659ACCC2F3D"
}
```