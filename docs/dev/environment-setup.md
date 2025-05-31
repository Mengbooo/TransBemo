# TransBemo 环境配置文档

## 目录
- [1. 开发环境配置](#1-开发环境配置)
- [2. 测试环境配置](#2-测试环境配置)
- [3. 生产环境配置](#3-生产环境配置)
- [4. 环境变量说明](#4-环境变量说明)
- [5. 网络请求配置](#5-网络请求配置)
- [6. 跨平台开发注意事项](#6-跨平台开发注意事项)
- [7. 常见问题解决](#7-常见问题解决)

## 1. 开发环境配置

### 1.1 开发环境要求

TransBemo项目开发需要以下软件环境：

- **Node.js**: 16.x 或更高版本
- **npm**: 8.x 或更高版本
- **Expo CLI**: 最新版本
- **编辑器**: 推荐使用Visual Studio Code

### 1.2 初始化开发环境

按照以下步骤配置开发环境：

1. **安装Node.js和npm**

   从[Node.js官网](https://nodejs.org/)下载并安装适合您操作系统的Node.js版本。

2. **安装Expo CLI**

   ```bash
   npm install -g expo-cli
   ```

3. **克隆项目仓库**

   ```bash
   git clone https://github.com/yourusername/TransBemo.git
   cd TransBemo
   ```

4. **安装项目依赖**

   ```bash
   npm install
   ```

5. **设置编辑器**

   推荐使用Visual Studio Code，并安装以下扩展：
   - ESLint
   - Prettier
   - React Native Tools
   - TypeScript React code snippets

### 1.3 启动开发环境

1. **启动后端服务器**

   ```bash
   cd TransBemo/backend
   npm start
   ```

   后端服务器将在http://localhost:5000上运行。

2. **启动前端开发服务器**

   ```bash
   cd TransBemo
   npm start
   ```

   或者使用Expo CLI：

   ```bash
   expo start
   ```

   这将启动Expo开发服务器，并显示一个QR码。

3. **在设备上运行应用**

   - **Android模拟器**: 按`a`键
   - **iOS模拟器**: 按`i`键（仅限macOS）
   - **网页浏览器**: 按`w`键
   - **实体设备**: 使用Expo Go应用扫描QR码

## 2. 测试环境配置

### 2.1 测试环境特点

测试环境是介于开发环境和生产环境之间的中间环境，具有以下特点：

- 数据与生产环境隔离
- 配置尽可能接近生产环境
- 用于功能测试和验证

### 2.2 配置测试环境

1. **创建测试环境配置文件**

   在项目根目录创建`.env.test`文件：

   ```
   # API配置
   EXPO_PUBLIC_API_URL=https://test-api.transbemo.com
   EXPO_PUBLIC_API_VERSION=v1
   
   # 百度翻译API配置
   EXPO_PUBLIC_BAIDU_APPID=your_test_appid
   EXPO_PUBLIC_BAIDU_APPKEY=your_test_appkey
   
   # 调试配置
   EXPO_PUBLIC_ENABLE_LOGGING=true
   ```

2. **使用测试环境变量启动应用**

   ```bash
   npm run start:test
   ```

   或手动加载环境变量：

   ```bash
   expo start --config app.config.test.js
   ```

### 2.3 测试环境的API访问

在测试环境中，应用将使用以下API端点：

- 文本翻译: `https://test-api.transbemo.com/api/translateText`
- 图片翻译: `https://test-api.transbemo.com/api/image-trans/translate`
- 语音翻译: `https://test-api.transbemo.com/api/speech-trans/translate`

## 3. 生产环境配置

### 3.1 生产环境特点

生产环境是面向最终用户的环境，具有以下特点：

- 高可用性和稳定性
- 优化的性能
- 严格的安全措施
- 真实的数据

### 3.2 配置生产环境

1. **创建生产环境配置文件**

   在项目根目录创建`.env.production`文件：

   ```
   # API配置
   EXPO_PUBLIC_API_URL=https://api.transbemo.com
   EXPO_PUBLIC_API_VERSION=v1
   
   # 百度翻译API配置
   EXPO_PUBLIC_BAIDU_APPID=your_production_appid
   EXPO_PUBLIC_BAIDU_APPKEY=your_production_appkey
   
   # 调试配置
   EXPO_PUBLIC_ENABLE_LOGGING=false
   ```

2. **构建生产版本**

   ```bash
   npm run build:android  # 构建Android版本
   npm run build:ios      # 构建iOS版本
   ```

   或使用Expo CLI：

   ```bash
   expo build:android
   expo build:ios
   ```

### 3.3 生产环境的部署

#### Android应用部署

1. 生成APK或AAB文件：
   ```bash
   expo build:android -t apk  # 生成APK文件
   expo build:android -t app-bundle  # 生成AAB文件
   ```

2. 上传到Google Play商店：
   - 登录[Google Play Console](https://play.google.com/console)
   - 创建或选择应用
   - 上传构建的APK或AAB文件
   - 填写应用信息并发布

#### iOS应用部署

1. 生成IPA文件：
   ```bash
   expo build:ios
   ```

2. 上传到App Store：
   - 使用Application Loader或Xcode上传IPA文件
   - 登录[App Store Connect](https://appstoreconnect.apple.com/)
   - 填写应用信息并提交审核

## 4. 环境变量说明

TransBemo项目使用环境变量来管理不同环境的配置。以下是主要的环境变量及其说明：

| 环境变量 | 描述 | 示例值 |
|---------|------|--------|
| EXPO_PUBLIC_API_URL | API服务器的基础URL | http://localhost:5000 |
| EXPO_PUBLIC_API_VERSION | API版本 | v1 |
| EXPO_PUBLIC_BAIDU_APPID | 百度翻译API的APPID | your_appid |
| EXPO_PUBLIC_BAIDU_APPKEY | 百度翻译API的密钥 | your_appkey |
| EXPO_PUBLIC_ENABLE_LOGGING | 是否启用日志记录 | true/false |
| EXPO_PUBLIC_DEFAULT_SOURCE_LANG | 默认源语言 | zh |
| EXPO_PUBLIC_DEFAULT_TARGET_LANG | 默认目标语言 | en |

### 4.1 环境变量的使用

在React Native/Expo应用中，可以通过`process.env`访问这些环境变量：

```typescript
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
const appid = process.env.EXPO_PUBLIC_BAIDU_APPID;
```

### 4.2 配置不同环境的环境变量

可以为不同的环境创建不同的环境变量文件：

- `.env.development`：开发环境
- `.env.test`：测试环境
- `.env.production`：生产环境

然后使用适当的命令加载对应的环境变量文件。

## 5. 网络请求配置

### 5.1 API基础URL配置

TransBemo项目使用集中配置的方式管理API URL，避免硬编码。创建`utils/apiConfig.ts`文件：

```typescript
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// 获取本机IP地址（开发时需手动设置）
// 请将YOUR_LOCAL_IP替换为你电脑的本地IP地址（如192.168.1.100）
const LOCAL_IP = 'YOUR_LOCAL_IP';

// 获取API基础URL
export const getApiBaseUrl = () => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  
  // 如果有配置环境变量，优先使用环境变量
  if (apiUrl) {
    return apiUrl;
  }
  
  // 根据环境提供不同的默认值
  if (__DEV__) {
    // 开发环境
    if (Platform.OS === 'web') {
      // Web平台在开发环境中使用localhost
      return 'http://localhost:5000/api';
    } else {
      // 真机需要使用本地IP地址
      return `http://${LOCAL_IP}:5000/api`;
    }
  } else {
    // 生产环境
    return 'https://api.transbemo.com/api';
  }
};

// 获取特定API的完整URL
export const getTranslateTextUrl = () => `${getApiBaseUrl()}/translateText`;
export const getImageTranslateUrl = () => `${getApiBaseUrl()}/image-trans/translate`;
export const getSpeechTranslateUrl = () => `${getApiBaseUrl()}/speech-trans/translate`;
```

### 5.2 配置Axios

创建一个全局的Axios实例，统一管理请求配置：

```typescript
// api/axiosConfig.ts
import axios from 'axios';
import { getApiBaseUrl } from '@/utils/apiConfig';

const instance = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 可以在这里添加认证信息等
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 统一处理错误
    console.error('API请求错误:', error);
    return Promise.reject(error);
  }
);

export default instance;
```

### 5.3 真机测试的网络配置

在真机上测试应用时，由于不能直接访问开发机器的localhost，需要特殊处理：

1. **找出开发机器的局域网IP地址**：
   - Windows: `ipconfig` 命令
   - macOS: `ifconfig` 命令
   - Linux: `ip addr` 命令

2. **更新apiConfig.ts中的LOCAL_IP变量**：
   ```typescript
   const LOCAL_IP = '192.168.1.xxx'; // 替换为您的实际IP
   ```

3. **确保开发机器的防火墙允许端口访问**：
   - 允许5000端口的入站连接

4. **确保手机和开发机器在同一个网络**：
   - 连接到同一个WiFi网络

### 5.4 使用ngrok进行外网测试

如果需要在不同网络的设备上测试，可以使用ngrok创建一个临时的公网URL：

1. **安装ngrok**：
   - 访问[ngrok官网](https://ngrok.com/)下载并安装

2. **启动ngrok**：
   ```bash
   ngrok http 5000
   ```

3. **更新apiConfig.ts**：
   ```typescript
   const NGROK_URL = 'https://your-ngrok-url.ngrok.io';
   
   export const getApiBaseUrl = () => {
     // 使用ngrok URL替代本地IP
     if (__DEV__ && Platform.OS !== 'web') {
       return `${NGROK_URL}/api`;
     }
     // ...其他逻辑保持不变
   };
   ```

## 6. 跨平台开发注意事项

TransBemo是一个跨平台应用，需要注意不同平台之间的差异。

### 6.1 平台特定代码

使用`Platform.OS`检测当前平台并提供不同的实现：

```typescript
import { Platform } from 'react-native';

if (Platform.OS === 'ios') {
  // iOS特定代码
} else if (Platform.OS === 'android') {
  // Android特定代码
} else if (Platform.OS === 'web') {
  // Web特定代码
}
```

### 6.2 平台特定组件

对于平台之间差异较大的功能，可以创建平台特定的组件：

```
components/
├── MyComponent.android.tsx  // Android版本
├── MyComponent.ios.tsx      // iOS版本
└── MyComponent.web.tsx      // Web版本
```

然后统一导入：

```typescript
import MyComponent from './components/MyComponent';
```

React Native会根据当前平台自动选择正确的文件。

### 6.3 平台特定API的处理

对于只在特定平台可用的API，应进行适当的检查和降级处理：

```typescript
// utils/platformUtils.ts
import { Platform } from 'react-native';

export const isRecordingSupported = (): boolean => {
  // Web平台暂不支持录音
  if (Platform.OS === 'web') {
    return false;
  }
  return true;
};

export const isImagePickerSupported = (): boolean => {
  // 所有平台都支持图片选择，但实现方式不同
  return true;
};
```

### 6.4 Web平台的特殊处理

Web平台有一些特殊的限制和差异：

1. **文件系统访问**：Web平台没有直接的文件系统访问能力
   ```typescript
   // 使用条件导入
   const saveFile = async (data: Blob, filename: string) => {
     if (Platform.OS === 'web') {
       // 使用浏览器的下载API
       const url = URL.createObjectURL(data);
       const a = document.createElement('a');
       a.href = url;
       a.download = filename;
       a.click();
     } else {
       // 使用React Native的文件系统API
       const path = `${FileSystem.documentDirectory}${filename}`;
       await FileSystem.writeAsStringAsync(path, data, { encoding: 'base64' });
     }
   };
   ```

2. **权限处理**：Web平台的权限模型与移动平台不同
   ```typescript
   const requestCameraPermission = async () => {
     if (Platform.OS === 'web') {
       // Web平台使用浏览器的媒体API请求权限
       try {
         await navigator.mediaDevices.getUserMedia({ video: true });
         return true;
       } catch (err) {
         console.error('未获得相机权限:', err);
         return false;
       }
     } else {
       // 移动平台使用Expo的权限API
       const { status } = await Camera.requestPermissionsAsync();
       return status === 'granted';
     }
   };
   ```

## 7. 常见问题解决

### 7.1 网络请求问题

**问题**: 在真机上无法连接到开发服务器

**解决方案**:
1. 确保手机和电脑在同一网络
2. 使用电脑的局域网IP地址替代localhost
3. 检查防火墙设置
4. 尝试使用ngrok创建公网URL

**示例**:
```typescript
// 错误的方式
const API_URL = 'http://localhost:5000/api';

// 正确的方式
const API_URL = Platform.OS === 'web' 
  ? 'http://localhost:5000/api'
  : 'http://192.168.1.xxx:5000/api'; // 替换为您的IP
```

### 7.2 跨域问题(CORS)

**问题**: Web版本请求API时遇到CORS错误

**解决方案**:
1. 在后端服务器配置适当的CORS头
2. 确保允许所有必要的请求方法和头部

**示例**:
```javascript
// backend/server.js
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Appid', 
    'X-Timestamp', 
    'X-Sign'
  ]
}));
```

### 7.3 环境变量问题

**问题**: 无法访问环境变量

**解决方案**:
1. 确保环境变量以`EXPO_PUBLIC_`开头
2. 检查环境变量文件是否正确加载
3. 在Expo项目中，确保app.json中已配置extra字段

**示例**:
```json
// app.json
{
  "expo": {
    "extra": {
      "apiUrl": "https://api.example.com"
    }
  }
}
```

```typescript
// 访问环境变量
import Constants from 'expo-constants';
const apiUrl = Constants.expoConfig?.extra?.apiUrl || 'default-url';
```

### 7.4 应用构建问题

**问题**: 构建应用时出现错误

**解决方案**:
1. 检查依赖项是否兼容
2. 确保所有原生模块都正确配置
3. 查看Expo构建日志获取详细错误信息

**命令**:
```bash
# 清理缓存并重新构建
expo r -c
expo build:android
```

通过正确配置不同的环境并遵循这些跨平台开发最佳实践，TransBemo项目可以在多个平台上提供一致的用户体验，同时最大限度地复用代码。 