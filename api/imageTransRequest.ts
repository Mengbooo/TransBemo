import axios from 'axios';
import { IMAGE_TRANSLATE_API } from '../utils/apiConfig';

/**
 * 发送图片翻译请求
 * @param imageData 图片数据（Blob、File或Base64字符串）
 * @param from 源语言代码
 * @param to 目标语言代码
 * @param pasteType 贴合类型：0-关闭文字贴合 1-整图贴合 2-块区贴合
 * @returns 翻译结果
 */
export const translateImageRequest = async (
  imageData: Blob | File | string,
  from: string,
  to: string,
  pasteType: number = 1 // 默认使用整图贴合
) => {
  try {
    console.log('【调试】图片翻译 - 开始处理请求');
    console.log('【调试】图片翻译 - 参数:', { 
      imageType: typeof imageData, 
      from, 
      to, 
      pasteType 
    });
    
    // 创建FormData对象
    const formData = new FormData();

    // 如果imageData是字符串(base64)，需要先转成Blob
    if (typeof imageData === 'string') {
      console.log('【调试】图片翻译 - 处理Base64图片数据');
      // 移除可能存在的data:image/jpeg;base64,前缀
      const base64Data = imageData.split(',')[1] || imageData;
      console.log('【调试】图片翻译 - Base64数据长度:', base64Data.length);
      
      try {
        const blob = await fetch(`data:image/jpeg;base64,${base64Data}`).then(res => res.blob());
        console.log('【调试】图片翻译 - 成功转换为Blob:', { size: blob.size, type: blob.type });
        formData.append('image', blob, 'image.jpg');
      } catch (blobError) {
        console.error('【错误】图片翻译 - 转换Base64到Blob失败:', blobError);
        throw blobError;
      }
    } else {
      // 直接添加Blob或File对象
      console.log('【调试】图片翻译 - 处理Blob/File对象');
      if (imageData instanceof File) {
        console.log('【调试】图片翻译 - File对象:', { 
          name: imageData.name, 
          size: imageData.size, 
          type: imageData.type 
        });
      } else {
        console.log('【调试】图片翻译 - Blob对象:', { 
          size: imageData.size, 
          type: imageData.type 
        });
      }
      formData.append('image', imageData);
    }

    // 添加其他参数
    formData.append('from', from);
    formData.append('to', to);
    formData.append('paste', pasteType.toString());
    
    console.log('【调试】图片翻译 - FormData已创建');
    console.log('【调试】图片翻译 - 请求URL:', IMAGE_TRANSLATE_API);

    // 发送POST请求到后端
    console.log('【调试】图片翻译 - 发送请求');
    const response = await axios.post(
      `${IMAGE_TRANSLATE_API}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    console.log('【调试】图片翻译 - 响应状态:', response.status);
    console.log('【调试】图片翻译 - 响应数据:', response.data);
    return response;
  } catch (error) {
    console.error('【错误】图片翻译请求出错:', error);
    
    if (axios.isAxiosError(error)) {
      console.error('【错误】图片翻译 - 请求配置:', error.config);
      console.error('【错误】图片翻译 - 响应状态:', error.response?.status);
      console.error('【错误】图片翻译 - 响应数据:', error.response?.data);
    }
    
    throw error;
  }
}; 