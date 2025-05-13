import React, { useState, useRef } from 'react';
import { View, StyleSheet, Animated, Alert } from 'react-native';
import { Audio } from 'expo-av';
import Button from '../global/Button';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import * as FileSystem from 'expo-file-system';

const SpeechButtonBox: React.FC = () => {
  const SpeechIcon = <FontAwesome5 name="microphone-alt" size={24} color="white" />;

  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  
  // 创建动画值
  const animatedValue = useRef(new Animated.Value(0)).current;

  // 背景颜色插值
  const containerBackground = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['transparent', 'white']
  });

  // 请求麦克风权限并开始录音
  const startRecording = async () => {
    try {
      // 请求权限
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('需要麦克风权限', '请在设置中允许应用使用麦克风');
        return;
      }

      // 配置录音
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // 创建新的录音实例
      const newRecording = new Audio.Recording();
      await newRecording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await newRecording.startAsync();
      
      setRecording(newRecording);
    } catch (error) {
      console.error('录音开始失败', error);
      Alert.alert('错误', '无法开始录音');
    }
  };

  // 停止录音并保存文件
  const stopRecording = async () => {
    try {
      if (!recording) return;

      // 停止录音
      await recording.stopAndUnloadAsync();
      
      // 获取录音 URI
      const uri = recording.getURI();
      
      if (uri) {
        // 使用 FileSystem 获取文件信息
        const fileInfo = await FileSystem.getInfoAsync(uri);
        console.log('录音文件信息:', fileInfo);
        
        Alert.alert('录音完成', `录音文件已保存：${uri}`);
      }

      // 重置录音状态
      setRecording(null);
    } catch (error) {
      console.error('录音停止失败', error);
      Alert.alert('错误', '无法停止录音');
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