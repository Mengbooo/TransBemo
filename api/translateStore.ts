// 建议创建api/config.ts文件
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api';

export default {
  API_BASE_URL,
  TRANSLATE_TEXT_ENDPOINT: `${API_BASE_URL}/translateText`,
  // 其他API端点
};