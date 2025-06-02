import axios from 'axios';
import { TRANSLATE_API } from '../utils/apiConfig';

// 定义翻译请求函数
export const translateTextRequest = async (
  q: string,
  from: string,
  to: string
) => {
  try {
    // 构建请求体
    const requestBody = {
      q,
      from,
      to
    };

    // 发起 POST 请求到后端接口
    const response = await axios.post(`${TRANSLATE_API}`, requestBody);
    console.log(response);
    return response;

  } catch (error) {
    console.error('翻译请求出错:', error);
    throw error;
  }
};
