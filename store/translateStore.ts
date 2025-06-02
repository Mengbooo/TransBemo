import { create } from 'zustand';
import { translateTextRequest } from '@/api/textTransRequest';
import { translateImageRequest } from '@/api/imageTransRequest';
import { translateSpeechRequest } from '@/api/speechTransRequest';
import { languagesLabelTemp } from '@/constants/Languages';
import { pickImageFromLibrary, captureImageWithCamera, uriToBlob } from '@/utils/imageUtils';
import { startRecording, stopRecording, audioToBase64, playAudio, isRecordingSupported } from '@/utils/audioUtils';
import { Audio } from 'expo-av';
import { Platform } from 'react-native';

type TranslationType = 'text' | 'image' | 'speech';

// 基础翻译状态接口
interface BaseTranslateState {
  sourceLanguage: string;
  targetLanguage: string;
  outputText: string;
}

// 文本翻译状态
interface TextTranslateState extends BaseTranslateState {
  inputText: string;
}

// 图片翻译状态
interface ImageTranslateState extends BaseTranslateState {
  imageUri: string | null;
  sourceText: string;
}

// 语音翻译状态
interface SpeechTranslateState extends BaseTranslateState {
  speechText: string;
  recordingStatus: 'idle' | 'recording' | 'processing';
  audioUri: string | null;
  targetAudioBase64: string | null;
}

// 翻译历史记录项
interface HistoryItem {
  source: string;
  target: string;
  inputText: string;
  outputText: string;
  timestamp: number;
  type: TranslationType;
}

// 完整状态类型定义
type TranslateState = {
  // 各页面独立状态
  textTranslate: TextTranslateState;
  imageTranslate: ImageTranslateState;
  speechTranslate: SpeechTranslateState;
  
  // 翻译历史
  translationHistory: HistoryItem[];
  
  // 文本翻译方法
  setTextInputText: (text: string) => void;
  setTextOutputText: (text: string) => void;
  setTextSourceLanguage: (lang: string) => void;
  setTextTargetLanguage: (lang: string) => void;
  handleTextLanguageChange: (newSource: string, newTarget: string) => void;
  translateText: () => Promise<void>;
  
  // 图片翻译方法
  setImageUri: (uri: string | null) => void;
  setImageOutputText: (text: string) => void;
  setImageSourceText: (text: string) => void;
  setImageSourceLanguage: (lang: string) => void;
  setImageTargetLanguage: (lang: string) => void;
  handleImageLanguageChange: (newSource: string, newTarget: string) => void;
  translateImage: (imageUri: string) => Promise<void>;
  pickAndTranslateImage: () => Promise<void>;
  captureAndTranslateImage: () => Promise<void>;
  
  // 语音翻译方法
  setSpeechText: (text: string) => void;
  setSpeechOutputText: (text: string) => void;
  setSpeechSourceLanguage: (lang: string) => void;
  setSpeechTargetLanguage: (lang: string) => void;
  handleSpeechLanguageChange: (newSource: string, newTarget: string) => void;
  setRecordingStatus: (status: 'idle' | 'recording' | 'processing') => void;
  setAudioUri: (uri: string | null) => void;
  setTargetAudioBase64: (base64: string | null) => void;
  startSpeechRecording: () => Promise<void>;
  stopSpeechRecording: () => Promise<void>;
  translateSpeech: (audioUri: string) => Promise<void>;
  playOriginalAudio: () => Promise<void>;
  playTranslatedAudio: () => Promise<void>;
  
  // 通用方法
  getLanguageKey: (languageValue: string) => string | null;
  addToHistory: (item: Omit<HistoryItem, 'timestamp'>) => void;
};

export const useTranslateStore = create<TranslateState>((set, get) => ({
  // 初始状态
  textTranslate: {
    inputText: '',
    outputText: '',
    sourceLanguage: '中文',
    targetLanguage: '英语',
  },
  
  imageTranslate: {
    imageUri: null,
    outputText: '',
    sourceLanguage: '中文',
    targetLanguage: '英语',
    sourceText: '',
  },
  
  speechTranslate: {
    speechText: '',
    outputText: '',
    sourceLanguage: '中文',
    targetLanguage: '英语',
    recordingStatus: 'idle',
    audioUri: null,
    targetAudioBase64: null,
  },
  
  translationHistory: [],
  
  // 文本翻译方法
  setTextInputText: (text) => set((state) => ({
    textTranslate: { ...state.textTranslate, inputText: text }
  })),
  
  setTextOutputText: (text) => set((state) => ({
    textTranslate: { ...state.textTranslate, outputText: text }
  })),
  
  setTextSourceLanguage: (lang) => set((state) => ({
    textTranslate: { ...state.textTranslate, sourceLanguage: lang }
  })),
  
  setTextTargetLanguage: (lang) => set((state) => ({
    textTranslate: { ...state.textTranslate, targetLanguage: lang }
  })),
  
  handleTextLanguageChange: (newSource, newTarget) => set((state) => ({
    textTranslate: { 
      ...state.textTranslate, 
      sourceLanguage: newSource, 
      targetLanguage: newTarget 
    }
  })),
  
  // 图片翻译方法
  setImageUri: (uri) => set((state) => ({
    imageTranslate: { ...state.imageTranslate, imageUri: uri }
  })),
  
  setImageOutputText: (text) => set((state) => ({
    imageTranslate: { ...state.imageTranslate, outputText: text }
  })),
  
  setImageSourceText: (text) => set((state) => ({
    imageTranslate: { ...state.imageTranslate, sourceText: text }
  })),
  
  setImageSourceLanguage: (lang) => set((state) => ({
    imageTranslate: { ...state.imageTranslate, sourceLanguage: lang }
  })),
  
  setImageTargetLanguage: (lang) => set((state) => ({
    imageTranslate: { ...state.imageTranslate, targetLanguage: lang }
  })),
  
  handleImageLanguageChange: (newSource, newTarget) => set((state) => ({
    imageTranslate: { 
      ...state.imageTranslate, 
      sourceLanguage: newSource, 
      targetLanguage: newTarget 
    }
  })),
  
  // 语音翻译方法
  setSpeechText: (text) => set((state) => ({
    speechTranslate: { ...state.speechTranslate, speechText: text }
  })),
  
  setSpeechOutputText: (text) => set((state) => ({
    speechTranslate: { ...state.speechTranslate, outputText: text }
  })),
  
  setSpeechSourceLanguage: (lang) => set((state) => ({
    speechTranslate: { ...state.speechTranslate, sourceLanguage: lang }
  })),
  
  setSpeechTargetLanguage: (lang) => set((state) => ({
    speechTranslate: { ...state.speechTranslate, targetLanguage: lang }
  })),
  
  handleSpeechLanguageChange: (newSource, newTarget) => set((state) => ({
    speechTranslate: { 
      ...state.speechTranslate, 
      sourceLanguage: newSource, 
      targetLanguage: newTarget 
    }
  })),
  
  setRecordingStatus: (status) => set((state) => ({
    speechTranslate: { ...state.speechTranslate, recordingStatus: status }
  })),
  
  setAudioUri: (uri) => set((state) => ({
    speechTranslate: { ...state.speechTranslate, audioUri: uri }
  })),
  
  setTargetAudioBase64: (base64) => set((state) => ({
    speechTranslate: { ...state.speechTranslate, targetAudioBase64: base64 }
  })),
  
  startSpeechRecording: async () => {
    const { setRecordingStatus } = get();
    
    // 检查平台是否支持录音
    if (Platform.OS === 'web') {
      console.warn('Web平台暂不支持录音功能');
      return;
    }
    
    // 设置录音状态
    setRecordingStatus('recording');
    
    // 开始录音
    await startRecording();
  },
  
  stopSpeechRecording: async () => {
    const { setRecordingStatus, setAudioUri, translateSpeech } = get();
    
    // 检查平台是否支持录音
    if (Platform.OS === 'web') {
      console.warn('Web平台暂不支持录音功能');
      return;
    }
    
    // 设置处理状态
    setRecordingStatus('processing');
    
    // 停止录音
    const audioUri = await stopRecording();
    
    if (audioUri) {
      // 保存录音URI
      setAudioUri(audioUri);
      
      // 翻译录音
      await translateSpeech(audioUri);
    }
    
    // 重置状态为空闲
    setRecordingStatus('idle');
  },
  
  translateSpeech: async (audioUri) => {
    try {
      // 检查平台是否支持
      if (Platform.OS === 'web') {
        console.warn('Web平台暂不支持语音翻译功能');
        return;
      }
      
      const { 
        speechTranslate, 
        setSpeechText, 
        setSpeechOutputText, 
        setTargetAudioBase64,
        getLanguageKey,
        addToHistory
      } = get();
      
      const { sourceLanguage, targetLanguage } = speechTranslate;
      
      // 转换语言代码
      const fromLang = getLanguageKey(sourceLanguage) || 'zh';
      const toLang = getLanguageKey(targetLanguage) || 'en';
      
      // 将音频转为Base64
      const base64Audio = await audioToBase64(audioUri);
      
      if (!base64Audio) {
        console.error('音频转Base64失败');
        return;
      }
      
      // 获取音频格式
      const format = 'pcm'; // 强制使用PCM格式，与audioUtils设置匹配
      
      // 发送语音翻译请求
      const response = await translateSpeechRequest(base64Audio, fromLang, toLang, format);
      
      if (response && response.code === 0) {
        const { source, target, target_tts } = response.data;
        
        // 更新语音识别文本和翻译结果
        setSpeechText(source);
        setSpeechOutputText(target);
        setTargetAudioBase64(target_tts);
        
        // 添加到历史记录
        addToHistory({
          source: sourceLanguage,
          target: targetLanguage,
          inputText: source,
          outputText: target,
          type: 'speech'
        });
      } else {
        console.error('语音翻译失败:', response?.msg || '未知错误');
      }
    } catch (error) {
      console.error('语音翻译错误:', error);
    }
  },
  
  playOriginalAudio: async () => {
    try {
      const { speechTranslate } = get();
      
      if (speechTranslate.audioUri) {
        await playAudio(speechTranslate.audioUri);
      }
    } catch (error) {
      console.error('播放原始音频失败:', error);
    }
  },
  
  playTranslatedAudio: async () => {
    try {
      const { speechTranslate } = get();
      
      if (speechTranslate.targetAudioBase64) {
        await playAudio(speechTranslate.targetAudioBase64, true);
      }
    } catch (error) {
      console.error('播放翻译音频失败:', error);
    }
  },
  
  // 从相册选择图片并翻译
  pickAndTranslateImage: async () => {
    try {
      const result = await pickImageFromLibrary();
      if (result && result.uri) {
        await get().translateImage(result.uri);
      }
    } catch (error) {
      console.error('选择并翻译图片失败:', error);
    }
  },
  
  // 拍摄照片并翻译
  captureAndTranslateImage: async () => {
    try {
      const result = await captureImageWithCamera();
      if (result && result.uri) {
        await get().translateImage(result.uri);
      }
    } catch (error) {
      console.error('拍摄并翻译图片失败:', error);
    }
  },
  
  translateText: async () => {
    try {
      const { textTranslate, getLanguageKey } = get();
      const { inputText, sourceLanguage, targetLanguage } = textTranslate;
      
      if (!inputText.trim()) {
        console.error('翻译内容不能为空');
        return;
      }
      
      const sourceLanguageKey = getLanguageKey(sourceLanguage) as string;
      const targetLanguageKey = getLanguageKey(targetLanguage) as string;
      
      const result = await translateTextRequest(
        inputText,
        sourceLanguageKey,
        targetLanguageKey
      );
      
      if (result.data.trans_result && result.data.trans_result[0].dst) {
        const translatedText = result.data.trans_result[0].dst;
        
        set((state) => ({
          textTranslate: { ...state.textTranslate, outputText: translatedText }
        }));
        
        // 添加到历史记录
        get().addToHistory({
          source: sourceLanguage,
          target: targetLanguage,
          inputText: inputText,
          outputText: translatedText,
          type: 'text'
        });
      }
    } catch (error) {
      console.error('翻译失败:', error);
    }
  },
  
  translateImage: async (imageUri) => {
    try {
      const { imageTranslate, getLanguageKey } = get();
      const { sourceLanguage, targetLanguage } = imageTranslate;

      if (!imageUri) {
        console.error('【错误】图片翻译 - 图片URI不能为空');
        return;
      }
      
      console.log('【调试】图片翻译 - 开始处理:', { 
        sourceLanguage, 
        targetLanguage,
        imageUriPrefix: imageUri.substring(0, 30) + '...'
      });
      
      // 设置加载状态
      set((state) => ({
        imageTranslate: { 
          ...state.imageTranslate, 
          imageUri,
          outputText: "正在翻译中..." // 设置加载提示
        }
      }));
      
      const sourceLanguageKey = getLanguageKey(sourceLanguage) as string;
      const targetLanguageKey = getLanguageKey(targetLanguage) as string;
      
      // 将图片URI转换为Blob
      const imageBlob = await uriToBlob(imageUri);
      console.log('【调试】图片翻译 - 图片转换为Blob:', { 
        size: `${(imageBlob.size / 1024).toFixed(2)}KB`,
        type: imageBlob.type
      });
      
      // 调用图片翻译API
      const startTime = Date.now();
      const result = await translateImageRequest(
        imageBlob,
        sourceLanguageKey,
        targetLanguageKey,
        1 // 使用整图贴合模式
      );
      const endTime = Date.now();
      console.log(`【调试】图片翻译 - 总耗时: ${endTime - startTime}ms`);
      
      if (result.data.error_code === "0" && result.data.data) {
        // 获取翻译结果
        const { sumSrc, sumDst, pasteImg } = result.data.data;
        console.log('【调试】图片翻译 - 翻译成功');
        
        set((state) => ({
          imageTranslate: { 
            ...state.imageTranslate, 
            outputText: sumDst,
            sourceText: sumSrc || "",
            // 如果有贴合图片，可以保存
            // pasteImgBase64: pasteImg
          }
        }));
        
        // 添加到历史记录
        get().addToHistory({
          source: sourceLanguage,
          target: targetLanguage,
          inputText: sumSrc || `图片: ${imageUri.substring(0, 30)}...`,
          outputText: sumDst,
          type: 'image'
        });
      } else {
        // 处理错误
        const errorMessage = result.data.error_msg || "图片翻译失败";
        console.error('【错误】图片翻译 - API返回错误:', {
          error_code: result.data.error_code,
          error_msg: errorMessage
        });
        
        set((state) => ({
          imageTranslate: { 
            ...state.imageTranslate, 
            outputText: `错误: ${errorMessage}`
          }
        }));
      }
    } catch (error) {
      console.error('【错误】图片翻译失败:', error);
      set((state) => ({
        imageTranslate: { 
          ...state.imageTranslate, 
          outputText: "翻译过程中出现错误，请重试"
        }
      }));
    }
  },
  
  // 通用方法
  getLanguageKey: (languageValue) => {
    for (const key in languagesLabelTemp) {
      if (languagesLabelTemp[key] === languageValue) {
        return key;
      }
    }
    return null;
  },
  
  addToHistory: (item) => set((state) => ({
    translationHistory: [
      { ...item, timestamp: Date.now() },
      ...state.translationHistory
    ]
  })),
}));
