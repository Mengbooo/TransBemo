import React, { useState, useRef } from "react";
import { Pressable, StyleSheet, View, Animated } from "react-native";
import type { PressableProps } from "react-native";

// 定义组件的属性类型
type ButtonProps = PressableProps & {
  icon: React.ReactNode;
  onPressIn?: () => void;
  onPressOut?: () => void;
};

const Button: React.FC<ButtonProps> = ({ 
  icon, 
  onPressIn, 
  onPressOut, 
  ...rest 
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['transparent', 'black']
  });

  const handlePressIn = () => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 100,
      useNativeDriver: false
    }).start();
    onPressIn && onPressIn();
  };

  const handlePressOut = () => {
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 100,
      useNativeDriver: false
    }).start();
    onPressOut && onPressOut();
  };

  return (
    <Pressable 
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      {...rest}
    >
      <Animated.View style={[
        styles.button, 
        { backgroundColor }
      ]}>
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
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Button;
