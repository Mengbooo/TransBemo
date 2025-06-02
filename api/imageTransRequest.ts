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
      // 移除可能存在的data:image/jpeg;base64,前缀
      const base64Data = imageData.split(',')[1] || imageData;
      
      try {
        const blob = await fetch(`data:image/jpeg;base64,${base64Data}`).then(res => res.blob());
        console.log('【调试】图片翻译 - 图片数据:', { 
          format: 'base64转blob', 
          size: `${(blob.size / 1024).toFixed(2)}KB`, 
          type: blob.type 
        });
        formData.append('image', blob, 'image.jpg');
      } catch (blobError) {
        console.error('【错误】图片翻译 - 转换Base64到Blob失败:', blobError);
        throw blobError;
      }
    } else {
      // 处理Blob或File对象
      const size = imageData.size;
      const type = imageData.type;
      
      // 检查是否是我们自定义的"伪Blob"对象(来自移动平台)
      if ('text' in imageData && typeof imageData.text === 'function') {
        try {
          // 获取base64数据
          const base64 = await (imageData as any).text();
          console.log('【调试】图片翻译 - 处理移动平台图片数据:', { 
            format: '自定义Blob', 
            size: `${(size / 1024).toFixed(2)}KB`,
            base64Length: base64.length
          });
          
          // 直接添加base64数据
          formData.append('from', from);
          formData.append('to', to);
          formData.append('paste', pasteType.toString());
          formData.append('image_base64', base64);
          
          // 发送POST请求到后端
          console.log('【调试】图片翻译 - 发送请求到:', IMAGE_TRANSLATE_API);
          const startTime = Date.now();
          
          // 使用不同的API端点处理base64数据
          const response = await axios.post(
            `${IMAGE_TRANSLATE_API}/base64`,
            {
              from,
              to,
              paste: pasteType.toString(),
              image_base64: base64
            },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
          
          const endTime = Date.now();
          console.log(`【调试】图片翻译 - 请求耗时: ${endTime - startTime}ms`);
          console.log('【调试】图片翻译 - 响应状态:', response.status);
          
          if (response.data && response.data.error_code === "0") {
            console.log('【调试】图片翻译 - 翻译成功:', { 
              sumSrcLength: response.data.data?.sumSrc?.length || 0,
              sumDstLength: response.data.data?.sumDst?.length || 0,
              hasPasteImg: !!response.data.data?.pasteImg
            });
          } else {
            console.error('【错误】图片翻译 - API返回错误:', {
              error_code: response.data?.error_code,
              error_msg: response.data?.error_msg
            });
          }
          
          return response;
        } catch (textError) {
          console.error('【错误】图片翻译 - 读取自定义Blob数据失败:', textError);
          throw textError;
        }
      } else {
        // 标准Blob或File对象
        const name = imageData instanceof File ? imageData.name : 'blob.jpg';
        
        console.log('【调试】图片翻译 - 图片数据:', { 
          format: imageData instanceof File ? 'File' : 'Blob', 
          size: `${(size / 1024).toFixed(2)}KB`, 
          type,
          name
        });
        formData.append('image', imageData);
      }
    }

    // 添加其他参数
    formData.append('from', from);
    formData.append('to', to);
    formData.append('paste', pasteType.toString());
    
    // 发送POST请求到后端
    console.log('【调试】图片翻译 - 发送请求到:', IMAGE_TRANSLATE_API);
    const startTime = Date.now();
    
    const response = await axios.post(
      `${IMAGE_TRANSLATE_API}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    const endTime = Date.now();
    console.log(`【调试】图片翻译 - 请求耗时: ${endTime - startTime}ms`);
    console.log('【调试】图片翻译 - 响应状态:', response.status);
    
    if (response.data && response.data.error_code === "0") {
      console.log('【调试】图片翻译 - 翻译成功:', { 
        sumSrcLength: response.data.data?.sumSrc?.length || 0,
        sumDstLength: response.data.data?.sumDst?.length || 0,
        hasPasteImg: !!response.data.data?.pasteImg
      });
    } else {
      console.error('【错误】图片翻译 - API返回错误:', {
        error_code: response.data?.error_code,
        error_msg: response.data?.error_msg
      });
    }
    
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