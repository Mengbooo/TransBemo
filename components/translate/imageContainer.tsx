//! 图片容器组件，用于显示图片,但是直接复制的outputbox.tsx,需要修改

import { View, Text, StyleSheet } from "react-native";

const ImageContainer = () => {
  return (
    <View style={styles.box}>
      <Text style={styles.text}>ImageBox</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    flex: 1,
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    color: "white",
    fontSize: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
});

export default ImageContainer;
