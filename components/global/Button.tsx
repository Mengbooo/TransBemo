import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import type { PressableProps } from "react-native";

// 定义组件的属性类型
type ButtonProps = PressableProps & {
  icon: React.ReactNode;
  onPressIn?: () => void;
  onPressOut?: () => void;
};

const Button: React.FC<ButtonProps> = ({ icon }) => {
  return (
    <Pressable style={styles.button}>
      <View style={styles.iconContainer}>{icon}</View>
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
