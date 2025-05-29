import React, { useRef, useState } from "react";
import { Pressable, StyleSheet, View, Animated, Easing, ViewStyle } from "react-native";
import type { PressableProps } from "react-native";

// 定义组件的属性类型
type ButtonProps = PressableProps & {
  icon: React.ReactNode;
  onPress?: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
  buttonStyle?: ViewStyle;
  isPressed?: boolean;
};

const Button: React.FC<ButtonProps> = ({ 
  icon, 
  onPress, 
  onPressIn, 
  onPressOut, 
  buttonStyle,
  isPressed,
  ...props 
}) => {
  // 创建动画值
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  // 处理按下事件
  const handlePressIn = () => {
    // 启动缩放动画
    Animated.timing(scaleAnim, {
      toValue: 0.9,
      duration: 150,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
    
    // 调用父组件传入的 onPressIn
    if (onPressIn) onPressIn();
  };
  
  // 处理释放事件
  const handlePressOut = () => {
    // 恢复原始大小
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 150,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
    
    // 调用父组件传入的 onPressOut
    if (onPressOut) onPressOut();
  };
  
  return (
    <Pressable 
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      {...props}
    >
      <Animated.View 
        style={[
          styles.button,
          buttonStyle,
          isPressed && styles.buttonPressed,
          { transform: [{ scale: scaleAnim }] }
        ]}
      >
        <View style={styles.iconContainer}>{icon}</View>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
    width: 60,
    height: 60, 
    borderRadius: 30, 
    borderColor: 'white',
    borderWidth: 2,
  },
  buttonPressed: {
    backgroundColor: 'black',
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Button;
