/**
 * 图片处理工具类
 * 提供图片选择、拍摄、压缩和格式转换功能
 */
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

// 图片选择配置
const imagePickerOptions = {
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  allowsEditing: true,
  aspect: [4, 3],
  quality: 0.8,
};

/**
 * 请求相机和相册权限
 * @returns 权限授予状态
 */
export const requestPermissions = async (): Promise<boolean> => {
  try {
    // 请求相机权限
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    
    // 请求相册权限
    const libraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    return cameraPermission.granted && libraryPermission.granted;
  } catch (error) {
    console.error('权限请求错误:', error);
    return false;
  }
};

/**
 * 从相册选择图片
 * @returns 选择的图片结果
 */
export const pickImageFromLibrary = async (): Promise<{
  uri: string;
  base64: string | null;
  width: number;
  height: number;
} | null> => {
  try {
    // 先请求权限
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      console.warn('未获得相册访问权限');
      return null;
    }

    // 选择图片
    const result = await ImagePicker.launchImageLibraryAsync({
      ...imagePickerOptions,
      base64: false, // 不直接获取base64，避免大图片造成内存问题
    });

    // 用户取消选择
    if (result.canceled || !result.assets || result.assets.length === 0) {
      return null;
    }

    const selectedImage = result.assets[0];
    
    // 处理图片（确保尺寸和大小合适）
    return await processImage(selectedImage.uri);
  } catch (error) {
    console.error('选择图片错误:', error);
    return null;
  }
};

/**
 * 使用相机拍摄图片
 * @returns 拍摄的图片结果
 */
export const captureImageWithCamera = async (): Promise<{
  uri: string;
  base64: string | null;
  width: number;
  height: number;
} | null> => {
  try {
    // 先请求权限
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      console.warn('未获得相机访问权限');
      return null;
    }

    // 启动相机
    const result = await ImagePicker.launchCameraAsync({
      ...imagePickerOptions,
      base64: false, // 不直接获取base64，避免大图片造成内存问题
    });

    // 用户取消拍照
    if (result.canceled || !result.assets || result.assets.length === 0) {
      return null;
    }

    const capturedImage = result.assets[0];
    
    // 处理图片（确保尺寸和大小合适）
    return await processImage(capturedImage.uri);
  } catch (error) {
    console.error('拍摄图片错误:', error);
    return null;
  }
};

/**
 * 处理图片（压缩、调整大小等）
 * @param uri 图片URI
 * @returns 处理后的图片信息
 */
export const processImage = async (uri: string): Promise<{
  uri: string;
  base64: string | null;
  width: number;
  height: number;
} | null> => {
  try {
    // 获取图片信息
    const fileInfo = await FileSystem.getInfoAsync(uri, { size: true });
    
    // 检查文件大小，如果超过3.5MB则压缩
    const needsCompression = fileInfo.exists && 'size' in fileInfo && fileInfo.size > 3.5 * 1024 * 1024;
    
    let processedUri = uri;
    let width = 0;
    let height = 0;
    
    if (needsCompression) {
      // 压缩图片
      const compressedImage = await manipulateAsync(
        uri,
        [{ resize: { width: 1200 } }], // 调整尺寸，保持宽高比
        { compress: 0.7, format: SaveFormat.JPEG }
      );
      
      processedUri = compressedImage.uri;
      width = compressedImage.width;
      height = compressedImage.height;
    } else {
      // 获取图片尺寸
      const imageSize = await getImageSize(uri);
      width = imageSize.width;
      height = imageSize.height;
    }
    
    // 检查图片比例是否符合要求（长宽比不超过3:1）
    const aspectRatio = Math.max(width, height) / Math.min(width, height);
    if (aspectRatio > 3) {
      console.warn('图片长宽比超过3:1，可能影响翻译质量');
    }
    
    // 读取图片base64，用于预览
    let base64 = null;
    // 仅在需要时获取base64
    // base64 = await FileSystem.readAsStringAsync(processedUri, {
    //   encoding: FileSystem.EncodingType.Base64,
    // });
    
    return {
      uri: processedUri,
      base64,
      width,
      height,
    };
  } catch (error) {
    console.error('处理图片错误:', error);
    return null;
  }
};

/**
 * 获取图片尺寸
 * @param uri 图片URI
 * @returns 图片宽高
 */
export const getImageSize = async (uri: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    if (Platform.OS === 'web') {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.onerror = reject;
      img.src = uri;
    } else {
      // 使用默认尺寸，实际应用中可能需要使用第三方库如react-native-image-size
      resolve({ width: 800, height: 600 });
    }
  });
};

/**
 * 将图片URI转换为Blob对象（主要用于Web）
 * @param uri 图片URI
 * @returns Blob对象
 */
export const uriToBlob = async (uri: string): Promise<Blob> => {
  try {
    if (Platform.OS === 'web') {
      // Web平台直接fetch
      const response = await fetch(uri);
      return await response.blob();
    } else {
      // React Native需要先读取文件再转换
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      
      // 在Web环境中（如果使用React Native Web）
      const response = await fetch(`data:image/jpeg;base64,${base64}`);
      return await response.blob();
    }
  } catch (error) {
    console.error('URI转Blob错误:', error);
    throw error;
  }
};

/**
 * 将base64字符串转换为Blob对象
 * @param base64 Base64字符串
 * @param mimeType MIME类型
 * @returns Blob对象
 */
export const base64ToBlob = (base64: string, mimeType: string = 'image/jpeg'): Blob => {
  // 解码base64
  const byteCharacters = atob(base64.split(',')[1] || base64);
  const byteArrays = [];
  
  for (let i = 0; i < byteCharacters.length; i += 512) {
    const slice = byteCharacters.slice(i, i + 512);
    
    const byteNumbers = new Array(slice.length);
    for (let j = 0; j < slice.length; j++) {
      byteNumbers[j] = slice.charCodeAt(j);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  
  return new Blob(byteArrays, { type: mimeType });
}; 