import axios from 'axios';

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
    // 创建FormData对象
    const formData = new FormData();

    // 如果imageData是字符串(base64)，需要先转成Blob
    if (typeof imageData === 'string') {
      // 移除可能存在的data:image/jpeg;base64,前缀
      const base64Data = imageData.split(',')[1] || imageData;
      const blob = await fetch(`data:image/jpeg;base64,${base64Data}`).then(res => res.blob());
      formData.append('image', blob, 'image.jpg');
    } else {
      // 直接添加Blob或File对象
      formData.append('image', imageData);
    }

    // 添加其他参数
    formData.append('from', from);
    formData.append('to', to);
    formData.append('paste', pasteType.toString());

    // 发送POST请求到后端
    const response = await axios.post(
      'http://localhost:5000/api/translateImage',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    console.log('图片翻译响应:', response);
    return response;
  } catch (error) {
    console.error('图片翻译请求出错:', error);
    throw error;
  }
}; 