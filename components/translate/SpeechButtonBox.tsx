import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, Alert, Platform } from 'react-native';
import { Audio } from 'expo-av';
import Button from '../global/Button';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';

interface SpeechButtonBoxProps {
  onTranslate: (sourceText: string, translatedText: string) => void;
  sourceLanguage: string;
  targetLanguage: string;
}

const SpeechButtonBox: React.FC<SpeechButtonBoxProps> = ({ 
  onTranslate, 
  sourceLanguage, 
  targetLanguage 
}) => {
  const SpeechIcon = <FontAwesome5 name="microphone-alt" size={24} color="white" />;

  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  // 创建动画值
  const animatedValue = useRef(new Animated.Value(0)).current;

  // 背景颜色插值
  const containerBackground = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['transparent', 'white']
  });

  // 语言映射
  const languageMap: { [key: string]: string } = {
    '中文': 'zh',
    '英语': 'en',
    '日语': 'jp',
    '韩语': 'kor',
    '粤语': 'yue',
    '俄语': 'ru',
    '德语': 'de',
    '法语': 'fra',
    '泰语': 'th',
    '葡萄牙语': 'pt',
    '西班牙语': 'spa',
    '阿拉伯语': 'ara'
  };

  // Web 端录音处理
  const startWebRecording = () => {
    return new Promise<void>((resolve, reject) => {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
          const mediaRecorder = new MediaRecorder(stream);
          mediaRecorderRef.current = mediaRecorder;
          audioChunksRef.current = [];

          mediaRecorder.ondataavailable = (event) => {
            audioChunksRef.current.push(event.data);
          };

          mediaRecorder.onstop = () => {
            stream.getTracks().forEach(track => track.stop());
          };

          mediaRecorder.start();
          resolve();
        })
        .catch((error) => {
          console.error('Web录音权限错误:', error);
          reject(error);
        });
    });
  };

  // 请求麦克风权限并开始录音
  const startRecording = async () => {
    try {
      if (Platform.OS === 'web') {
        await startWebRecording();
      } else {
        // 移动端原有逻辑
        const { status } = await Audio.requestPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('需要麦克风权限', '请在设置中允许应用使用麦克风');
          return;
        }

        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        const newRecording = new Audio.Recording();
        await newRecording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
        await newRecording.startAsync();
        
        setRecording(newRecording);
      }
    } catch (error) {
      console.error('录音开始失败', error);
      Alert.alert('错误', '无法开始录音');
    }
  };

  // 停止录音并翻译
  const stopRecording = async () => {
    try {
      let base64Audio = '';

      if (Platform.OS === 'web') {
        // Web 端录音处理
        if (mediaRecorderRef.current) {
          mediaRecorderRef.current.stop();
          
          // 等待录音数据
          await new Promise(resolve => setTimeout(resolve, 100));
          
          // 合并音频数据
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          
          // 转换为 Base64
          base64Audio = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              const base64 = (reader.result as string).split(',')[1];
              resolve(base64);
            };
            reader.onerror = reject;
            reader.readAsDataURL(audioBlob);
          });
        }
      } else {
        // 移动端原有逻辑
        if (!recording) return;
        await recording.stopAndUnloadAsync();
        
        const uri = recording.getURI();
        if (uri) {
          base64Audio = await FileSystem.readAsStringAsync(uri, { 
            encoding: FileSystem.EncodingType.Base64 
          });
        }
      }

      // 发送翻译请求
      const response = await axios.post('/api/speech-trans', {
        audioBase64: base64Audio,
        from: languageMap[sourceLanguage],
        to: languageMap[targetLanguage]
      });

      // 调用回调函数传递翻译结果
      onTranslate(response.data.source, response.data.target);

      Alert.alert('录音完成', `原文：${response.data.source}\n译文：${response.data.target}`);

      // 重置录音状态
      setRecording(null);
      mediaRecorderRef.current = null;
      audioChunksRef.current = [];
    } catch (error) {
      console.error('录音停止失败', error);
      Alert.alert('错误', '无法停止录音或翻译');
    }
  };

  const handlePressIn = () => {
    // 动画到按下状态
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false
    }).start();

    setIsRecording(true);
    startRecording();
  };

  const handlePressOut = () => {
    // 动画返回原始状态
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false
    }).start();

    setIsRecording(false);
    stopRecording();
  };

  return (
    <Animated.View 
      style={[
        styles.container, 
        { backgroundColor: containerBackground }
      ]}
    >
      <Button
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        icon={SpeechIcon}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
  },
});

export default SpeechButtonBox;