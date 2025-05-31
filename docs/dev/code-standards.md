# TransBemo 代码规范文档

## 目录
- [1. 命名规范](#1-命名规范)
- [2. 代码格式规范](#2-代码格式规范)
- [3. 文件组织规范](#3-文件组织规范)
- [4. 代码注释规范](#4-代码注释规范)
- [5. Git提交规范](#5-git提交规范)
- [6. TypeScript类型规范](#6-typescript类型规范)

## 1. 命名规范

### 1.1 文件命名

- **React组件文件**: 使用PascalCase(首字母大写)
  ```
  Button.tsx
  SpeechInput.tsx
  TranslateBase.tsx
  ```

- **非组件TypeScript文件**: 使用camelCase(首字母小写)
  ```
  imageUtils.ts
  audioUtils.ts
  translateStore.ts
  ```

- **样式文件**: 与对应组件同名，后缀为`.styles.ts`
  ```
  Button.styles.ts
  SpeechInput.styles.ts
  ```

- **测试文件**: 与被测试文件同名，后缀为`.test.ts`或`.spec.ts`
  ```
  Button.test.tsx
  audioUtils.spec.ts
  ```

### 1.2 组件命名

- **组件名称**: 使用PascalCase，具有描述性
  ```tsx
  // 好的例子
  function ImageButtonBox() { ... }
  const SpeechInput: React.FC<SpeechInputProps> = () => { ... }
  
  // 避免
  function imgBtn() { ... }
  const Speech = () => { ... }
  ```

- **组件Props类型**: 以组件名 + `Props` 命名
  ```tsx
  interface ButtonProps { ... }
  interface ImageContainerProps { ... }
  ```

### 1.3 变量命名

- **变量**: 使用camelCase，具有描述性
  ```typescript
  // 好的例子
  const userInputText = '...';
  let isLoading = false;
  
  // 避免
  const txt = '...';
  let l = false;
  ```

- **常量**: 使用全大写的SNAKE_CASE
  ```typescript
  const API_BASE_URL = 'https://api.example.com';
  const MAX_RETRY_COUNT = 3;
  ```

- **布尔变量**: 使用`is`、`has`、`should`等前缀
  ```typescript
  const isRecording = true;
  const hasPermission = false;
  const shouldRefresh = true;
  ```

### 1.4 函数命名

- **函数**: 使用camelCase，动词开头
  ```typescript
  // 好的例子
  function translateText() { ... }
  const handleSubmit = () => { ... }
  
  // 避免
  function textTranslation() { ... }
  const submit = () => { ... }
  ```

- **事件处理函数**: 使用`handle`前缀
  ```typescript
  const handleButtonClick = () => { ... }
  const handleInputChange = (e) => { ... }
  ```

- **异步函数**: 可以使用`async`前缀或动词形式
  ```typescript
  const fetchTranslation = async () => { ... }
  async function loadUserData() { ... }
  ```

## 2. 代码格式规范

### 2.1 缩进与空格

- 使用**2个空格**作为缩进
- 运算符前后添加空格
- 逗号后添加空格
- 花括号内部添加空格

```typescript
// 正确
const sum = a + b;
const arr = [1, 2, 3];
const obj = { key: 'value' };

// 避免
const sum=a+b;
const arr=[1,2,3];
const obj={key:'value'};
```

### 2.2 分号与括号

- 语句末尾**使用分号**
- 条件语句和循环语句的括号周围添加空格
- 函数调用括号前不添加空格

```typescript
// 正确
const value = getValue();
if (condition) {
  doSomething();
}

// 避免
const value = getValue()
if(condition){
  doSomething()
}
```

### 2.3 代码行长度与换行

- 单行代码不超过**100个字符**
- 过长的代码应当合理换行，缩进为2个空格
- 运算符应当在换行后的行首

```typescript
// 正确
const longVariableName = someFunction(
  firstArgument,
  secondArgument,
  thirdArgument
);

// 或者
const longVariableName = 
  firstValue
  + secondValue
  + thirdValue;

// 避免
const longVariableName = someFunction(firstArgument, secondArgument, thirdArgument);
const longVariableName = firstValue + secondValue + thirdValue;
```

### 2.4 组件格式规范

- 每个组件只定义一个React组件
- 组件的Props类型定义紧跟在组件声明之前
- 组件内部结构按照以下顺序组织：
  1. Imports
  2. Types/Interfaces
  3. Component declaration
  4. State & Hooks
  5. Helper functions
  6. Effects
  7. Render logic
  8. Styles (if inline)

```tsx
// 组件格式示例
import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';

interface ButtonProps {
  onPress: () => void;
  title: string;
}

const Button: React.FC<ButtonProps> = ({ onPress, title }) => {
  // State hooks
  const [isPressed, setIsPressed] = useState(false);
  
  // Helper functions
  const handlePress = () => {
    setIsPressed(true);
    onPress();
  };
  
  // Effects
  useEffect(() => {
    if (isPressed) {
      const timer = setTimeout(() => setIsPressed(false), 200);
      return () => clearTimeout(timer);
    }
  }, [isPressed]);
  
  // Render
  return (
    <View style={[styles.button, isPressed && styles.buttonPressed]}>
      <Text style={styles.text}>{title}</Text>
    </View>
  );
};

const styles = {
  button: { /* ... */ },
  buttonPressed: { /* ... */ },
  text: { /* ... */ },
};

export default Button;
```

## 3. 文件组织规范

### 3.1 项目目录结构

TransBemo项目应遵循以下目录结构：

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
├── styles/               # 样式定义
├── assets/               # 静态资源
│   ├── images/           # 图片资源
│   └── fonts/            # 字体资源
├── hooks/                # 自定义Hooks
├── types/                # 类型定义
└── tests/                # 测试文件
```

### 3.2 文件内容组织

每个文件应该只有一个主要职责，避免过大的文件。文件内容应按以下顺序组织：

1. Imports (分组排序)
   - React/React Native相关
   - 第三方库
   - 项目内部模块
   - 样式、类型、常量等

2. 类型定义 (Types/Interfaces)

3. 常量定义 (Constants)

4. 辅助函数 (Helper Functions)

5. 主要组件/函数定义

6. 样式定义 (如果适用)

7. 导出语句

```tsx
// 文件组织示例
// 1. Imports
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Audio } from 'expo-av';

import { useTranslateStore } from '@/store/translateStore';
import { requestPermissions } from '@/utils/audioUtils';

// 2. Types
interface RecordButtonProps {
  onRecordingComplete: (uri: string) => void;
}

// 3. Constants
const RECORDING_OPTIONS = {
  android: { /* ... */ },
  ios: { /* ... */ },
};

// 4. Helper Functions
const formatTime = (ms: number): string => {
  // ...
};

// 5. Component
const RecordButton: React.FC<RecordButtonProps> = ({ onRecordingComplete }) => {
  // ...component implementation
};

// 6. Styles
const styles = {
  // ...style definitions
};

// 7. Export
export default RecordButton;
```

### 3.3 导入与导出规范

- 使用ES6模块语法进行导入和导出
- 优先使用命名导出，除非组件/函数是文件的主要内容
- 导入路径使用别名简化路径复杂度

```typescript
// 好的例子
import { Button } from '@/components/global/Button';
import { useTranslateStore } from '@/store/translateStore';

export const formatText = () => { /* ... */ };
export default TranslateScreen;

// 避免
import Button from '../../../components/global/Button';
import useTranslateStore from '../../../store/translateStore';

const formatText = () => { /* ... */ };
export { formatText, TranslateScreen };
```

## 4. 代码注释规范

### 4.1 注释类型与格式

- **文件头注释**: 描述文件的主要功能和职责
  ```typescript
  /**
   * 音频处理工具类
   * 提供录音、播放和格式转换功能
   */
  ```

- **函数/方法注释**: 描述函数的功能、参数和返回值
  ```typescript
  /**
   * 将音频文件转换为Base64
   * @param uri 音频文件URI
   * @returns Base64编码的音频数据
   */
  export const audioToBase64 = async (uri: string): Promise<string | null> => {
    // ...
  };
  ```

- **复杂逻辑注释**: 解释复杂的代码逻辑
  ```typescript
  // 根据平台选择不同的录音选项
  let recordingConfig;
  if (Platform.OS === 'ios') {
    // iOS使用高质量WAV格式
    recordingConfig = { /* ... */ };
  } else if (Platform.OS === 'android') {
    // Android使用M4A格式以提高兼容性
    recordingConfig = { /* ... */ };
  }
  ```

### 4.2 注释原则

- 代码应当是自解释的，只在必要时添加注释
- 注释应当解释"为什么"这样做，而不仅仅是"做了什么"
- 保持注释的简洁性和准确性
- 定期更新注释，确保与代码保持同步

```typescript
// 好的注释
// 由于Web平台的File API限制，需要特殊处理文件上传
if (Platform.OS === 'web') {
  // ...
}

// 避免的注释
// 检查平台
if (Platform.OS === 'web') {
  // ...
}
```

## 5. Git提交规范

### 5.1 提交消息格式

TransBemo项目采用Angular提交规范，格式如下：

```
<类型>(<作用域>): <主题>

<正文>

<尾注>
```

- **类型**: 必须，用于说明commit的类别
  - `feat`: 新功能
  - `fix`: Bug修复
  - `docs`: 文档更改
  - `style`: 代码风格更改(不影响代码运行的变动)
  - `refactor`: 重构(既不是新增功能，也不是修改bug的代码变动)
  - `perf`: 性能优化
  - `test`: 增加测试
  - `chore`: 构建过程或辅助工具的变动

- **作用域**: 可选，用于说明commit影响的范围
  - `text`: 文本翻译功能
  - `image`: 图片翻译功能
  - `speech`: 语音翻译功能
  - `ui`: UI组件
  - `store`: 状态管理
  - `api`: API相关

- **主题**: 必须，简短描述提交的变更

### 5.2 提交消息示例

```
feat(speech): 添加语音录制功能

实现了语音录制和播放功能，支持以下特性：
- 录音时间显示
- 录音波形可视化
- 录音完成后自动播放

修复 #123
```

```
fix(api): 修复请求超时问题

将API请求超时时间从5秒增加到15秒，解决在网络不稳定情况下的请求失败问题。

修复 #456
```

### 5.3 分支管理规范

- **master/main**: 主分支，保持稳定可发布状态
- **develop**: 开发分支，最新的开发状态
- **feature/xxx**: 功能分支，用于开发新功能
- **bugfix/xxx**: 修复分支，用于修复bug
- **release/x.x.x**: 发布分支，用于准备发布

### 5.4 Pull Request规范

- PR标题应遵循与提交消息相同的格式
- PR描述应包含以下内容：
  - 变更内容摘要
  - 相关的issue链接
  - 测试方法和结果
  - 截图或视频(如适用)

## 6. TypeScript类型规范

### 6.1 类型定义

- 使用TypeScript接口定义对象结构
- 使用类型别名定义联合类型或交叉类型
- 导出公共类型定义以便复用

```typescript
// 定义接口
interface User {
  id: string;
  name: string;
  email: string;
}

// 定义类型别名
type Status = 'idle' | 'loading' | 'success' | 'error';

// 导出供外部使用
export interface TranslateResult {
  sourceText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
}
```

### 6.2 函数类型

- 明确函数参数和返回值的类型
- 使用函数类型声明定义回调函数

```typescript
// 函数参数和返回值类型
function translateText(text: string, from: string, to: string): Promise<string> {
  // ...
}

// 回调函数类型
type OnTranslateComplete = (result: TranslateResult) => void;

function startTranslation(callback: OnTranslateComplete): void {
  // ...
}
```

### 6.3 React组件类型

- 使用React.FC或React.FunctionComponent定义函数组件
- 使用泛型参数传递Props类型

```typescript
interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ title, onPress, disabled }) => {
  // ...
};
```

### 6.4 类型推断与断言

- 尽可能依赖TypeScript的类型推断
- 只在必要时使用类型断言，优先使用as语法

```typescript
// 好的例子 - 依赖类型推断
const [text, setText] = useState('');

// 必要时使用类型断言
const userInput = event.target.value as string;

// 避免过度使用断言
const user = {} as User; // 避免这种写法
```

遵循以上代码规范可以帮助TransBemo项目团队保持代码的一致性和可维护性，提高开发效率和代码质量。定期审查和更新这些规范也是必要的，以适应项目的发展和新的最佳实践。 