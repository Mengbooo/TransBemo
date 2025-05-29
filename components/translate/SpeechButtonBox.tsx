import React, { useRef, useState } from 'react';
import { View, StyleSheet, Animated, Easing, Text } from 'react-native';
import Button from '../global/Button';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

interface SpeechButtonBoxProps {
  onSpeechRecognized?: (text: string) => void;
}

const SpeechButtonBox: React.FC<SpeechButtonBoxProps> = ({ onSpeechRecognized }) => {
  const MicrophoneIcon = <FontAwesome5 name="microphone" size={24} color="white" />;
  const [isPressed, setIsPressed] = useState(false);
  const animatedValue = useRef(new Animated.Value(0)).current;
  
  // 计算背景颜色的插值
  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(0, 0, 0, 0)', 'rgb(255, 255, 255)']
  });
  
  const handlePress = () => {
    // 这里将来会集成语音识别功能
    // 暂时模拟识别结果
    if (onSpeechRecognized) {
      onSpeechRecognized("语音识别测试文本");
    }
  };
  
  const handlePressIn = () => {
    setIsPressed(true);
    // 启动渐变动画：透明到白色
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: false, // 背景色动画不能使用原生驱动
    }).start();
  };
  
  const handlePressOut = () => {
    setIsPressed(false);
    // 启动渐变动画：白色到透明
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: false, // 背景色动画不能使用原生驱动
    }).start();
  };
  
  // 自定义按钮样式
  const customButtonStyle = {
    backgroundColor: isPressed ? 'black' : 'transparent',
  };
  
  return (
    <View style={styles.outerContainer}>
      <Animated.View 
        style={[
          styles.container,
          { backgroundColor }
        ]}
      >
        <Button
          icon={MicrophoneIcon}
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          isPressed={isPressed}
          buttonStyle={customButtonStyle}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    marginVertical: 5,
    alignItems: 'center',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 10,
    padding: 10,
    width: '100%',
  },
  recordingText: {
    color: 'black',
    fontWeight: 'bold',
    marginRight: 15,
    fontSize: 16,
  },
});

export default SpeechButtonBox;