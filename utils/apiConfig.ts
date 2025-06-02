// API配置文件，用于管理前后端API地址

// 局域网IP地址
const LOCAL_IP = '10.19.133.156';

// port
const PORT = 5000;

// API基础URL
export const API_BASE_URL = `http://${LOCAL_IP}:${PORT}`;

// 翻译API地址
export const TRANSLATE_API = `${API_BASE_URL}/api/translateText`;

// 图像翻译API地址
export const IMAGE_TRANSLATE_API = `${API_BASE_URL}/api/translateImage`;

// 语音翻译API地址
export const SPEECH_TRANSLATE_API = `${API_BASE_URL}/api/translateSpeech`;

// 历史记录API地址
export const HISTORY_API = `${API_BASE_URL}/api/records`;

// 是否使用本地IP (用于调试)
export const USE_LOCAL_IP = true;

// 获取基础URL
export const getApiBaseUrl = () => {
  return API_BASE_URL;
}; 