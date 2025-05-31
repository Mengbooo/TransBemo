# TransBemo 架构设计文档

## 目录
- [1. 总体架构](#1-总体架构)
- [2. 前端架构](#2-前端架构)
- [3. 后端架构](#3-后端架构)
- [4. 数据流](#4-数据流)
- [5. 组件通信](#5-组件通信)
- [6. 状态管理](#6-状态管理)

## 1. 总体架构

TransBemo是一个基于Expo开发的多语言翻译应用，支持文本翻译、图片翻译和语音翻译功能。整个应用采用前后端分离的架构设计，通过RESTful API进行通信。

### 1.1 系统架构图

```
┌─────────────────────────────────────────────────────────────┐
│                      客户端 (Expo/React Native)              │
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐      │
│  │  文本翻译模块  │    │  图片翻译模块  │    │  语音翻译模块  │      │
│  └─────────────┘    └─────────────┘    └─────────────┘      │
│            │               │                │               │
│            └───────────────┼────────────────┘               │
│                            │                                │
│                     ┌──────────────┐                        │
│                     │   状态管理层   │                        │
│                     │   (Zustand)  │                        │
│                     └──────────────┘                        │
│                            │                                │
│                     ┌──────────────┐                        │
│                     │   API 接口层   │                        │
│                     └──────────────┘                        │
└─────────────────────────│───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                       服务端 (Express.js)                    │
│                                                             │
│   ┌────────────────┐     ┌─────────────────────────────┐    │
│   │   路由控制层     │────▶│         控制器层            │    │
│   └────────────────┘     └─────────────────────────────┘    │
│                                      │                      │
│                                      ▼                      │
│                          ┌─────────────────────────────┐    │
│                          │          服务层             │    │
│                          └─────────────────────────────┘    │
│                                      │                      │
│                                      ▼                      │
│                          ┌─────────────────────────────┐    │
│                          │   外部API集成(百度翻译API等)  │    │
│                          └─────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 技术栈概览

- **前端**：
  - 框架：React Native + Expo
  - 状态管理：Zustand
  - 路由：Expo Router
  - 网络请求：Axios
  - UI组件：自定义组件 + React Native内置组件
  
- **后端**：
  - 框架：Express.js
  - 中间件：CORS, body-parser
  - 外部API集成：百度翻译API

## 2. 前端架构

### 2.1 目录结构

```
TransBemo/
├── app/                  # 应用页面和路由
│   ├── (translate)/      # 翻译相关页面
│   └── _layout.tsx       # 布局组件
├── components/           # 可复用组件
│   ├── global/           # 全局通用组件
│   └── translate/        # 翻译功能相关组件
├── api/                  # API请求相关
├── utils/                # 工具函数
├── store/                # 状态管理
├── constants/            # 常量定义
└── styles/               # 样式定义
```

### 2.2 组件设计

TransBemo采用组件化设计思想，将UI拆分为多个独立、可复用的组件。主要组件类型包括：

1. **页面组件**：位于`app/`目录，代表应用的各个页面
   - 文本翻译页面(`textTrans.tsx`)
   - 图片翻译页面(`imageTrans.tsx`)
   - 语音翻译页面(`speechTrans.tsx`)

2. **功能组件**：位于`components/translate/`目录，实现特定功能
   - 输入组件：`SpeechInput.tsx`, `imageContainer.tsx`等
   - 输出组件：`OutputBox.tsx`
   - 控制组件：`SpeechButtonBox.tsx`, `ImageButtonBox.tsx`等

3. **通用组件**：位于`components/global/`目录，可在多处复用
   - 基础按钮：`Button.tsx`
   - 翻译基础布局：`TranslateBase.tsx`
   - 语言切换器：`LanguageSwitcher.tsx`

### 2.3 路由设计

TransBemo使用Expo Router进行路由管理，采用文件系统路由方式。主要路由包括：

- `/` - 首页/引导页
- `/(translate)/textTrans` - 文本翻译页面
- `/(translate)/imageTrans` - 图片翻译页面
- `/(translate)/speechTrans` - 语音翻译页面

## 3. 后端架构

### 3.1 目录结构

```
backend/
├── server.js             # 服务器入口文件
├── routes/               # 路由定义
│   ├── textTransRoutes.js
│   ├── imageTransRoutes.js
│   └── speechTransRoutes.js
├── controllers/          # 控制器
│   ├── textTransController.js
│   └── recordController.js
└── config/               # 配置文件
```

### 3.2 API设计

后端API遵循RESTful设计原则，主要提供以下端点：

1. **文本翻译API**
   - 端点：`/api/translateText`
   - 方法：POST
   - 参数：
     - `q`: 待翻译文本
     - `from`: 源语言代码
     - `to`: 目标语言代码

2. **图片翻译API**
   - 端点：`/api/image-trans/translate`
   - 方法：POST
   - 参数：
     - `image`: 图片Base64数据
     - `from`: 源语言代码
     - `to`: 目标语言代码

3. **语音翻译API**
   - 端点：`/api/speech-trans/translate`
   - 方法：POST
   - 参数：
     - `voice`: 语音文件Base64数据
     - `from`: 源语言代码
     - `to`: 目标语言代码
     - `format`: 音频格式

### 3.3 中间件

后端使用以下中间件来增强功能和安全性：

1. **CORS中间件**：允许跨域请求，支持前端与后端的通信
2. **Body Parser中间件**：解析请求体，支持JSON数据和大文件上传
3. **错误处理中间件**：统一处理API错误，提供一致的错误响应格式

## 4. 数据流

### 4.1 前端数据流

TransBemo在前端采用单向数据流模型，数据流向如下：

```
用户交互 → 组件事件处理 → 状态更新(Zustand) → 组件重新渲染
```

### 4.2 前后端通信数据流

前后端通信采用异步请求模式，数据流向如下：

```
用户操作 → 前端发起API请求 → 后端处理请求 → 后端调用外部API → 后端返回结果 → 前端更新状态 → UI更新
```

### 4.3 数据流程图

```
┌──────────┐     ┌───────────┐     ┌───────────┐     ┌────────────┐
│  用户输入  │────▶│ 组件状态更新 │────▶│ API请求发送 │────▶│ 后端处理请求 │
└──────────┘     └───────────┘     └───────────┘     └────────────┘
                                                             │
┌──────────┐     ┌───────────┐     ┌───────────┐             │
│  UI更新   │◀────│ 全局状态更新 │◀────│ 处理API响应 │◀────────────┘
└──────────┘     └───────────┘     └───────────┘
```

## 5. 组件通信

TransBemo中的组件通信主要通过以下几种方式实现：

### 5.1 Props传递

用于父组件向子组件传递数据和回调函数。例如：

```tsx
// 父组件
<SpeechInput 
  speechText={speechText} 
  recordingStatus={recordingStatus} 
/>

// 子组件
interface SpeechInputProps {
  speechText: string;
  recordingStatus: 'idle' | 'recording' | 'processing';
}
```

### 5.2 Zustand状态共享

使用Zustand实现跨组件的状态共享和通信，避免复杂的Props传递。例如：

```tsx
// 在组件中使用store
const { 
  speechTranslate,
  startSpeechRecording,
  stopSpeechRecording
} = useTranslateStore();

// 调用方法更新状态
await startSpeechRecording();
```

### 5.3 事件回调

通过回调函数实现子组件向父组件的通信。例如：

```tsx
// 父组件定义回调函数并传递给子组件
const handleImageSelected = (uri: string) => {
  // 处理选中的图片
};

<ImageContainer onImageSelected={handleImageSelected} />

// 子组件调用回调函数
if (onImageSelected) {
  onImageSelected(result.uri);
}
```

## 6. 状态管理

TransBemo使用Zustand作为状态管理库，实现了一个集中式的状态管理方案。

### 6.1 状态设计

状态被划分为以下几个主要部分：

```tsx
// 基础翻译状态接口
interface BaseTranslateState {
  sourceLanguage: string;
  targetLanguage: string;
  outputText: string;
}

// 文本翻译状态
interface TextTranslateState extends BaseTranslateState {
  inputText: string;
}

// 图片翻译状态
interface ImageTranslateState extends BaseTranslateState {
  imageUri: string | null;
}

// 语音翻译状态
interface SpeechTranslateState extends BaseTranslateState {
  speechText: string;
  recordingStatus: 'idle' | 'recording' | 'processing';
  audioUri: string | null;
  targetAudioBase64: string | null;
}

// 完整状态类型定义
type TranslateState = {
  textTranslate: TextTranslateState;
  imageTranslate: ImageTranslateState;
  speechTranslate: SpeechTranslateState;
  translationHistory: HistoryItem[];
  // ...方法定义
};
```

### 6.2 状态更新

状态更新通过Zustand提供的setter函数实现：

```tsx
// 直接更新状态
setTextInputText: (text) => set((state) => ({
  textTranslate: { ...state.textTranslate, inputText: text }
})),

// 异步更新状态
translateText: async () => {
  // ...异步逻辑
  set((state) => ({
    textTranslate: { ...state.textTranslate, outputText: translatedText }
  }));
}
```

### 6.3 状态访问

组件通过自定义Hook访问状态：

```tsx
const { 
  textTranslate, 
  translateText, 
  setTextInputText 
} = useTranslateStore();

const { inputText, outputText } = textTranslate;
```

这种状态管理方式使得组件之间的通信更加简洁，状态更新更加可控，同时也便于实现更复杂的状态逻辑和异步操作。 