import axios from 'axios';
import { SPEECH_TRANSLATE_API } from '@/utils/apiConfig';

/**
 * 有道语音翻译请求函数
 * @param audioBase64 音频的Base64编码
 * @param fromLang 源语言代码
 * @param toLang 目标语言代码
 * @param format 音频格式 (wav/mp3)
 * @returns 翻译结果
 */
export const youdaoTranslateSpeechRequest = async (
  audioBase64: string,
  fromLang: string,
  toLang: string,
  format: string = 'wav'
) => {
  try {
    console.log(`【调试】有道语音翻译请求 - 开始`, {
      fromLang,
      toLang,
      format,
      audioLength: audioBase64.length
    });
    
    const response = await axios.post(SPEECH_TRANSLATE_API, {
      from: fromLang,
      to: toLang,
      voice: audioBase64, // 使用voice作为参数名称
      format: format
    });
    
    // 将有道API的响应格式转换为统一的格式
    if (response.data && response.data.errorCode === '0') {
      // 成功响应
      const result = {
        code: 0,
        msg: 'success',
        data: {
          source: response.data.tSpeakUrl ? response.data.query : '',
          target: response.data.translation ? response.data.translation[0] : '',
          target_tts: response.data.tSpeakUrl || null
        }
      };
      
      console.log(`【调试】有道语音翻译请求 - 成功`, {
        source: result.data.source.substring(0, 30) + (result.data.source.length > 30 ? '...' : ''),
        target: result.data.target,
        hasTTS: !!result.data.target_tts
      });
      
      return result;
    } else {
      // 错误响应
      console.error(`【错误】有道语音翻译请求 - API返回错误`, {
        errorCode: response.data.errorCode,
        errorMsg: response.data.msg || '未知错误'
      });
      
      return {
        code: parseInt(response.data.errorCode) || 500,
        msg: response.data.msg || '语音翻译失败',
        data: null
      };
    }
  } catch (error: any) {
    console.error(`【错误】有道语音翻译请求 - 异常`, error);
    
    return {
      code: error.response?.status || 500,
      msg: error.response?.data?.msg || error.message || '语音翻译请求失败',
      data: null
    };
  }
}; 