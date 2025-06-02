import axios from 'axios';
import { SPEECH_TRANSLATE_API } from '../utils/apiConfig';

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
  format: 'pcm' | 'wav' | 'amr' | 'm4a' = 'pcm'  // 默认使用pcm格式
) => {
  try {
    console.log('【调试】语音翻译 - 开始请求');
    // 强制使用pcm格式
    const audioFormat = 'pcm';
    
    // 构建请求体
    const requestBody = {
      from,
      to,
      voice: voiceBase64,
      format: audioFormat
    };
    
    // 详细的请求信息
    console.log('【调试】语音翻译 - 请求URL:', SPEECH_TRANSLATE_API);
    console.log('【调试】语音翻译 - 请求方法: POST');
    console.log('【调试】语音翻译 - 请求头:', {
      'Content-Type': 'application/json'
    });
    console.log('【调试】语音翻译 - 请求参数:', { 
      from, 
      to, 
      format: audioFormat,
      voiceLength: voiceBase64.length,
      voiceBase64Prefix: voiceBase64.substring(0, 30) + '...' // 只显示前30个字符
    });
    
    // 发起POST请求到后端接口
    console.log('【调试】语音翻译 - 发送请求...');
    const startTime = Date.now();
    
    const response = await axios.post(
      `${SPEECH_TRANSLATE_API}`, 
      requestBody
    );
    
    const endTime = Date.now();
    console.log(`【调试】语音翻译 - 请求耗时: ${endTime - startTime}ms`);
    console.log('【调试】语音翻译 - 响应状态:', response.status);
    console.log('【调试】语音翻译 - 响应头:', response.headers);
    console.log('【调试】语音翻译 - 响应数据:', response.data);
    
    if (response.data && response.data.code !== 0) {
      console.error('【错误】语音翻译 - 业务错误:', {
        code: response.data.code,
        msg: response.data.msg
      });
    }
    
    return response.data;
  } catch (error) {
    console.error('【错误】语音翻译请求出错:', error);
    
    if (axios.isAxiosError(error)) {
      console.error('【错误】语音翻译 - 请求配置:', {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers
      });
      console.error('【错误】语音翻译 - 响应状态:', error.response?.status);
      console.error('【错误】语音翻译 - 响应头:', error.response?.headers);
      console.error('【错误】语音翻译 - 响应数据:', error.response?.data);
    }
    
    throw error;
  }
}; 