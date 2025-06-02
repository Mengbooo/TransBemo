/**
 * 音频处理工具类
 * 提供录音、播放和格式转换功能
 */
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

// 录音配置
const recordingOptions = {
  android: {
    extension: '.pcm',
    outputFormat: Audio.AndroidOutputFormat.DEFAULT,
    audioEncoder: Audio.AndroidAudioEncoder.DEFAULT,
    sampleRate: 16000,
    numberOfChannels: 1,
    bitRate: 16000 * 16,
  },
  ios: {
    extension: '.pcm',
    audioQuality: Audio.IOSAudioQuality.HIGH,
    sampleRate: 16000,
    numberOfChannels: 1,
    bitRate: 16000 * 16,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
    outputFormat: Audio.IOSOutputFormat.LINEARPCM,
  },
  web: {
    mimeType: 'audio/webm',
    audioBitsPerSecond: 16000 * 16,
  }
};

// 存储录音实例
let recording: Audio.Recording | null = null;

/**
 * 检查平台是否支持录音功能
 * @returns 是否支持
 */
export const isRecordingSupported = (): boolean => {
  // Web平台暂不支持录音
  if (Platform.OS === 'web') {
    return false;
  }
  return true;
};

/**
 * 请求录音权限
 * @returns 权限授予状态
 */
export const requestPermissions = async (): Promise<boolean> => {
  try {
    // Web平台特殊处理
    if (Platform.OS === 'web') {
      console.warn('Web平台暂不支持录音功能');
      return false;
    }
    
    const { granted } = await Audio.requestPermissionsAsync();
    
    // 音频会话配置
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
      staysActiveInBackground: false,
    });
    
    return granted;
  } catch (error) {
    console.error('权限请求错误:', error);
    return false;
  }
};

/**
 * 开始录音
 * @returns 录音对象
 */
export const startRecording = async (): Promise<Audio.Recording | null> => {
  try {
    // Web平台特殊处理
    if (Platform.OS === 'web') {
      console.warn('Web平台暂不支持录音功能');
      return null;
    }
    
    // 请求权限
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      console.warn('未获得录音权限');
      return null;
    }
    
    // 如果有正在进行的录音，先停止
    if (recording) {
      await stopRecording();
    }
    
    // 开始新的录音
    recording = new Audio.Recording();
    
    // 根据平台选择不同的录音选项
    let recordingConfig;
    if (Platform.OS === 'ios') {
      recordingConfig = {
        ...Audio.RecordingOptionsPresets.HIGH_QUALITY,
        ...recordingOptions.ios
      };
    } else if (Platform.OS === 'android') {
      recordingConfig = {
        ...Audio.RecordingOptionsPresets.HIGH_QUALITY,
        ...recordingOptions.android
      };
    } else {
      recordingConfig = Audio.RecordingOptionsPresets.HIGH_QUALITY;
    }
    
    await recording.prepareToRecordAsync(recordingConfig);
    await recording.startAsync();
    
    return recording;
  } catch (error) {
    console.error('录音开始失败:', error);
    return null;
  }
};

/**
 * 停止录音
 * @returns 录音文件URI
 */
export const stopRecording = async (): Promise<string | null> => {
  try {
    // Web平台特殊处理
    if (Platform.OS === 'web') {
      console.warn('Web平台暂不支持录音功能');
      return null;
    }
    
    if (!recording) {
      console.warn('没有正在进行的录音');
      return null;
    }
    
    // 停止录音
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    recording = null;
    
    return uri;
  } catch (error) {
    console.error('录音停止失败:', error);
    return null;
  }
};

/**
 * 将音频文件转换为Base64
 * @param uri 音频文件URI
 * @returns Base64编码的音频数据
 */
export const audioToBase64 = async (uri: string): Promise<string | null> => {
  try {
    if (Platform.OS === 'web') {
      // Web平台处理
      const response = await fetch(uri);
      const blob = await response.blob();
      return await blobToBase64(blob);
    } else {
      // 移动平台处理
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return base64;
    }
  } catch (error) {
    console.error('音频转Base64失败:', error);
    return null;
  }
};

/**
 * 播放音频
 * @param uri 音频文件URI或Base64编码的音频数据
 * @returns 音频播放器实例
 */
export const playAudio = async (uri: string, isBase64: boolean = false): Promise<Audio.Sound | null> => {
  try {
    // 确保音频模块已加载
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
    });
    
    let source;
    if (isBase64) {
      // 处理Base64编码的音频
      source = { uri: `data:audio/mp3;base64,${uri}` };
    } else {
      // 处理文件URI
      source = { uri };
    }
    
    // 创建并加载音频
    const { sound } = await Audio.Sound.createAsync(source);
    
    // 播放音频
    await sound.playAsync();
    
    // 返回音频实例，以便于外部控制（例如暂停或停止）
    return sound;
  } catch (error) {
    console.error('音频播放失败:', error);
    return null;
  }
};

/**
 * Blob转Base64工具函数（主要用于Web平台）
 */
const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // 去掉 "data:audio/webm;base64," 前缀
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}; 