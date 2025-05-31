# 图片翻译API接入文档

本文档是百度翻译开放平台图片翻译API的用户指南，描述了图片翻译相关接口的说明。API接入方式对于IOS端、Android端、Web端均适用。新版本不再提供图片翻译SDK服务，已经接入的用户可下拉至本文档末尾查看SDK错误码列表。

## API接入方式（IOS端、Android端、Web端均适用）

### 如何使用图片翻译API

1. 使用您的百度账号登录百度翻译开放平台；
2. 注册成为开发者，获得APPID；
3. 进行开发者认证；
4. 开通图片翻译API服务：[开通链接](#)；
5. 参考技术文档和Demo编写代码。

## 接入方式

图片翻译API HTTPS地址：

```
https://fanyi-api.baidu.com/api/trans/sdk/picture
```

## 集成指南

### 请求url示例

```
https://fanyi-api.baidu.com/api/trans/sdk/picture?from=zh&to=en&appid=20180905000111111&salt=1435660288&sign=bf7303b9be4191726f62c19115c9a165&cuid=APICUID&mac=mac&version=3
```

### 请求方式：
POST/GET

### 输入参数

| 字段名 | 类型 | 是否必填 | 描述 |
|--------|------|----------|------|
| image | files | 是 | 请求翻译的图片数据 |
| from | string | 是 | 目前源语种方向，参考附录1 |
| to | string | 是 | 译文语种方向，参考附录2 |
| appid | string | 是 | APP ID，可在管理控制台查看 |
| salt | string | 是 | 随机数 |
| cuid | string | 是 | 固定值：APICUID |
| mac | string | 是 | 固定值：mac |
| version | integer | 是 | 固定值：3 |
| paste | integer | 否 | 图片贴合类型：0 - 关闭文字贴合 1 - 返回整图贴合 2 - 返回块区贴合 |
| sign | string | 是 | 签名，32位小写 |
| needIntervene | int | 否 | 判断是否需要使用自定义术语库干预；0-否 1-是 |

**注**：
1. 支持jpg、jpeg、png图片格式，注意均为小写。图片大小不超过4M，最短边至少30px，最长边最大4096px，长宽比3：1以内。
2. 签名规则：sign = md5(appid+md5(image)+salt+cuid+mac+密钥)。
3. md5(image) 中的image是原始图片数据，不加任何编码，32位小写。
4. image图片上传Content-Type=multipart/form-data。

### 输出参数

| 字段名 | 描述 | 备注 |
|--------|------|------|
| error_code | 错误码 | 详见错误码列表 |
| error_msg | 错误信息 | 以错误码54001为例，其返回的错误信息是Invalid Sign |
| data | 返回数据集合 | data是一个对象 |
| from | 源语种方向 | 参考支持语种列表 |
| to | 目标语种方向 | 参考支持语种列表 |
| content | 分段内容 | Content内部是一个数组形式，每个数据格式见下方详细说明 |
| sumSrc | 未分段翻译原文 | 接入举例中的"这是一个测试 这是一个例子" |
| sumDst | 未分段翻译译文 | 接入举例中的"This is a test. This is an example." |
| pasteImg | 图片贴合 (整屏贴合) | paste=1有效，base64格式 |

**注**：Content内部是一个数组形式，详情如下：

| 字段名 | 类型 | 描述 | 备注 |
|--------|------|------|------|
| src | STRING | 分段翻译的原文 | |
| dst | STRING | 分段翻译的译文 | |
| rect | STRING | 表示识别出的文字的位置 | 坐标为左上角，依次是left、top、width、height |
| lineCount | INT | 表示该分段信息是原文的多少行合并在一起 | |
| points | ARRAY | 译文矩形坐标 | 坐标为左上角，坐标顺序左上，右上，右下，左下 |
| pasteImg | STRING | 图片贴合 (分块贴合) | 分段贴合图片，paste=2有效，base64格式 |

格式：
```json
[
  {"x": 254,"y": 280},
  {"x": 506,"y": 278},
  {"x": 506,"y": 303},
  {"x": 254,"y": 305}
]
```

## 语种列表

### 源语种支持方向：

| 语言简写 | 名称 |
|----------|------|
| auto | 自动检测 |
| zh | 中文 |
| en | 英语 |
| jp | 日语 |
| kor | 韩语 |
| fra | 法语 |
| spa | 西班牙语 |
| ru | 俄语 |
| pt | 葡萄牙语 |
| de | 德语 |
| it | 意大利语 |
| dan | 丹麦语 |
| nl | 荷兰语 |
| may | 马来语 |
| swe | 瑞典语 |
| id | 印尼语 |
| pl | 波兰语 |
| rom | 罗马尼亚语 |
| tr | 土耳其语 |
| el | 希腊语 |
| hu | 匈牙利语 |

### 目标语种支持方向：

| 语言简写 | 名称 |
|----------|------|
| zh | 中文 |
| en | 英语 |
| jp | 日语 |
| kor | 韩语 |
| fra | 法语 |
| spa | 西班牙语 |
| ru | 俄语 |
| pt | 葡萄牙语 |
| de | 德语 |
| it | 意大利语 |
| dan | 丹麦语 |
| nl | 荷兰语 |
| may | 马来语 |
| swe | 瑞典语 |
| id | 印尼语 |
| pl | 波兰语 |
| rom | 罗马尼亚语 |
| tr | 土耳其语 |
| el | 希腊语 |
| hu | 匈牙利语 |

## 错误码列表

## 举例：（以下为传入的图片）

返回内容如下：

```json
{
    "error_code":"0",
    "error_msg":"success",
    "data":{
        "from":"zh",
        "to":"en",
        "content":[
            {
                "src":"这是一个测试 ",
                "dst":"This is a test.",
                "rect":"79 23 246 43",
                "lineCount":1,
                "pasteImg":"xxx",
                "points":[
                    {
                        "x":0,
                        "y":0
                    },
                    {
                        "x":0,
                        "y":0
                    },
                    {
                        "x":20,
                        "y":20
                    },
                    {
                        "x":10,
                        "y":10
                    }
                ]
            },
            {
                "src":"这是一个例子 ",
                "dst":"This is an example.",
                "rect":"79 122 201 37",
                "lineCount":1,
                "pasteImg":"xxx",
                "points":[
                    {
                        "x":50,
                        "y":50
                    },
                    {
                        "x":50,
                        "y":50
                    },
                    {
                        "x":20,
                        "y":20
                    },
                    {
                        "x":10,
                        "y":10
                    }
                ]
            }
        ],
        "sumSrc":"这是一个测试 这是一个例子 ",
        "sumDst":"This is a test. This is an example.",
        "pasteImg":"xxx"
    }
}

