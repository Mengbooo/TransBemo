import axios from 'axios';
import md5 from 'md5';

/**
 * 语音翻译请求函数
 * @param voiceBase64 语音文件的base64编码
 * @param from 源语言代码
 * @param to 目标语言代码
 * @param format 音频格式 (pcm, wav, amr, m4a)
 * @returns 返回翻译结果的Promise
 */
export const translateSpeechRequest = async (
  voiceBase64: string,
  from: string,
  to: string,
  format: 'pcm' | 'wav' | 'amr' | 'm4a' = 'pcm'
) => {
  try {
    // 获取时间戳，用于签名
    const timestamp = Math.floor(Date.now() / 1000).toString();
    
    // 从环境变量中获取APPID和密钥(实际项目中应从后端获取)
    const appid = process.env.EXPO_PUBLIC_BAIDU_APPID || '';
    const appkey = process.env.EXPO_PUBLIC_BAIDU_APPKEY || '';
    
    // 计算签名
    const signStr = appid + timestamp + voiceBase64;
    const sign = md5(signStr + appkey).toLowerCase();
    
    // 设置请求头
    const headers = {
      'Content-Type': 'application/json',
      'X-Appid': appid,
      'X-Timestamp': timestamp,
      'X-Sign': sign
    };
    
    // 构建请求体
    const requestBody = {
      from,
      to,
      voice: voiceBase64,
      format
    };
    
    // 发起POST请求到后端接口
    const response = await axios.post(
      'http://localhost:5000/api/speech-trans/translate', 
      requestBody,
      { headers }
    );
    
    return response.data;
  } catch (error) {
    console.error('语音翻译请求出错:', error);
    throw error;
  }
}; 