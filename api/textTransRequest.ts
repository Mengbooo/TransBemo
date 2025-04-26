import axios from 'axios';

interface textTransParams  {
  q: string; // 待翻译文本
  from: string; // 源语言
  to: string; // 目标语言
}

export async function textTransRequest(params: textTransParams) {
  try {
    const response = await axios.post('/api/translate', params);
    return response.data;
  } catch (error) {
    console.error('前端翻译请求出错:', error);
    throw error;
  }
}