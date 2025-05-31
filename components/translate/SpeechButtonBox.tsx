import React, { useState } from 'react';
import { View, StyleSheet, Alert, Text, Platform } from 'react-native';
import Button from '../global/Button';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useTranslateStore } from '@/store/translateStore';

const SpeechButtonBox: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { 
    speechTranslate,
    startSpeechRecording,
    stopSpeechRecording
  } = useTranslateStore();

  const { recordingStatus } = speechTranslate;

  const handleRecordPress = async () => {
    try {
      if (recordingStatus === 'idle') {
        setIsRecording(true);
        await startSpeechRecording();
      } else if (recordingStatus === 'recording') {
        setIsRecording(false);
        setIsProcessing(true);
        await stopSpeechRecording();
      }
    } catch (error) {
      Alert.alert('错误', '录音处理失败: ' + (error as Error).message);
    } finally {
      setIsProcessing(false);
    }
  };

  const MicrophoneIcon = <FontAwesome5 name="microphone" size={24} color="white" />;
  const StopIcon = <FontAwesome5 name="stop-circle" size={24} color="white" />;
  
  // 检查是否是Web平台
  const isWeb = Platform.OS === 'web';

  return (
    <View style={styles.container}>
      {isWeb ? (
        <Text style={styles.webUnsupportedText}>
          浏览器暂不支持语音录制功能，请使用移动应用
        </Text>
      ) : (
        <Button
          icon={recordingStatus === 'recording' ? StopIcon : MicrophoneIcon}
          onPress={handleRecordPress}
          isPressed={isProcessing}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', 
    justifyContent: 'space-around',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
  },
  webUnsupportedText: {
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    padding: 10,
  }
});

export default SpeechButtonBox;