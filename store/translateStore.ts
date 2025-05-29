import { create } from 'zustand';
import { translateTextRequest } from '@/api/textTransRequest';
import { languagesLabelTemp } from '@/constants/Languages';

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
}

// 语音翻译状态
interface SpeechTranslateState extends BaseTranslateState {
  speechText: string;
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
  setImageSourceLanguage: (lang: string) => void;
  setImageTargetLanguage: (lang: string) => void;
  handleImageLanguageChange: (newSource: string, newTarget: string) => void;
  translateImage: (imageUri: string) => Promise<void>;
  
  // 语音翻译方法
  setSpeechText: (text: string) => void;
  setSpeechOutputText: (text: string) => void;
  setSpeechSourceLanguage: (lang: string) => void;
  setSpeechTargetLanguage: (lang: string) => void;
  handleSpeechLanguageChange: (newSource: string, newTarget: string) => void;
  translateSpeech: (speechText: string) => Promise<void>;
  
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
  },
  
  speechTranslate: {
    speechText: '',
    outputText: '',
    sourceLanguage: '中文',
    targetLanguage: '英语',
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
  
  // 通用方法
  getLanguageKey: (languageValue) => {
    for (const key in languagesLabelTemp) {
      if (languagesLabelTemp[key] === languageValue) {
        return key;
      }
    }
    return null;
  },
  
  // 翻译功能
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
      
      // 图片翻译功能将在后续实现
      // 目前只是保存图片URI并模拟翻译结果
      set((state) => ({
        imageTranslate: { 
          ...state.imageTranslate, 
          imageUri,
          outputText: "这是图片翻译的示例结果" // 模拟翻译结果
        }
      }));
      
      // 添加到历史记录
      get().addToHistory({
        source: sourceLanguage,
        target: targetLanguage,
        inputText: `图片: ${imageUri.substring(0, 30)}...`,
        outputText: "这是图片翻译的示例结果",
        type: 'image'
      });
    } catch (error) {
      console.error('图片翻译失败:', error);
    }
  },
  
  translateSpeech: async (speechText) => {
    try {
      const { speechTranslate, getLanguageKey } = get();
      const { sourceLanguage, targetLanguage } = speechTranslate;
      
      if (!speechText.trim()) {
        console.error('语音文本不能为空');
        return;
      }
      
      const sourceLanguageKey = getLanguageKey(sourceLanguage) as string;
      const targetLanguageKey = getLanguageKey(targetLanguage) as string;
      
      const result = await translateTextRequest(
        speechText,
        sourceLanguageKey,
        targetLanguageKey
      );
      
      if (result.data.trans_result && result.data.trans_result[0].dst) {
        const translatedText = result.data.trans_result[0].dst;
        
        set((state) => ({
          speechTranslate: { 
            ...state.speechTranslate, 
            speechText,
            outputText: translatedText 
          }
        }));
        
        // 添加到历史记录
        get().addToHistory({
          source: sourceLanguage,
          target: targetLanguage,
          inputText: speechText,
          outputText: translatedText,
          type: 'speech'
        });
      }
    } catch (error) {
      console.error('语音翻译失败:', error);
    }
  },
  
  addToHistory: (item) => set((state) => ({
    translationHistory: [
      { ...item, timestamp: Date.now() },
      ...state.translationHistory
    ]
  })),
}));
