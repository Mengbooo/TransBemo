<div align="center">
  <img src="./assets/images/logo.png" alt="logo" style="width: 100px;">
  <h3>TransBemo</h3>
  <p>一款用户友好的多功能翻译软件，拥有极简界面，基于Expo开发。</p>
</div>

## 项目概述

TransBemo是一个功能丰富的翻译应用，支持文本翻译、语音翻译和图像翻译，提供简洁直观的用户界面和全面的翻译功能。

### 主要功能

- **文本翻译**：支持多语言之间的文本互译
- **语音翻译**：支持语音输入和语音播放翻译结果
- **图像翻译**：支持拍照或从相册选择图片进行翻译
- **翻译历史**：保存翻译记录，方便查看和管理历史翻译内容
- **多语言支持**：支持多种语言之间的互译

## 技术栈

- **前端框架**：React Native 0.76.9 + Expo 52.0.46
- **路由系统**：expo-router 4.0.20（基于文件的路由）
- **状态管理**：Zustand 5.0.3
- **HTTP请求**：Axios 1.9.0
- **后端**：Express.js + MongoDB
- **多媒体**：expo-av、expo-image-picker
- **语言**：TypeScript

## 快速开始

### 前端开发

1. 安装依赖

   ```bash
   npm install
   ```

2. 启动应用

   ```bash
   npx expo start
   ```

在输出中，你将找到在以下环境中打开应用的选项：

- [开发版本](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android模拟器](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS模拟器](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go)，Expo应用开发的有限沙盒环境

### 后端服务

1. 进入后端目录

   ```bash
   cd backend
   ```

2. 安装依赖

   ```bash
   npm install
   ```

3. 启动服务器

   ```bash
   npm start
   ```

## 项目结构

```
TransBemo/
├── app/                   # 应用主要路由和页面
│   └── (translate)/       # 翻译相关页面
├── components/            # 组件目录
│   ├── translate/         # 翻译功能相关组件
│   ├── global/            # 全局组件
│   └── ui/                # UI通用组件
├── api/                   # API请求相关代码
├── store/                 # 状态管理（使用Zustand）
├── utils/                 # 工具函数
├── constants/             # 常量定义
├── styles/                # 样式文件
├── assets/                # 静态资源
├── backend/               # 后端服务
│   ├── routes/            # API路由
│   ├── controllers/       # 控制器
│   ├── models/            # 数据模型
│   └── config/            # 配置文件
└── expo/                  # Expo配置文件
```

## 开发指南

你可以通过编辑**app**目录中的文件开始开发。该项目使用[基于文件的路由](https://docs.expo.dev/router/introduction)。

### 获取全新项目

当你准备好开始时，运行：

```bash
npm run reset-project
```

此命令将把初始代码移至**app-example**目录，并创建一个空白的**app**目录，你可以在其中开始开发。

## 配置

在使用前需要配置后端服务：

1. 在项目根目录中创建`.env`文件
2. 配置MongoDB连接和其他必要设置
3. 在`utils/apiConfig.ts`中设置正确的API地址

## 了解更多

要了解更多关于使用Expo开发项目的信息，请查看以下资源：

- [Expo文档](https://docs.expo.dev/)：学习基础知识，或通过[指南](https://docs.expo.dev/guides)深入了解高级主题。
- [Expo学习教程](https://docs.expo.dev/tutorial/introduction/)：按照逐步教程创建可在Android、iOS和Web上运行的项目。

## 加入社区

加入我们创建通用应用的开发者社区。

- [GitHub上的Expo](https://github.com/expo/expo)：查看我们的开源平台并做出贡献。
- [Discord社区](https://chat.expo.dev)：与Expo用户聊天并提问。

## 贡献指南

欢迎对TransBemo项目做出贡献！如果你想参与，请：

1. Fork项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启Pull Request

## 许可证

本项目采用MIT许可证 - 详情请参阅LICENSE文件。
