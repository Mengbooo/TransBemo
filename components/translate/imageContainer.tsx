//! 图片容器组件，用于显示图片,但是直接复制的outputbox.tsx,需要修改

import React, { useState } from "react";
import { View, Image, StyleSheet, Text, TouchableOpacity } from "react-native";
import * as ImagePicker from 'expo-image-picker';

interface ImageContainerProps {
  onImageSelected?: (uri: string) => void;
}

const ImageContainer: React.FC<ImageContainerProps> = ({ onImageSelected }) => {
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    try {
      // 模拟图片选择，实际应用中将使用ImagePicker
      const tempImageUri = "https://c-ssl.dtstatic.com/uploads/blog/202207/01/20220701162816_cb3cf.thumb.1000_0.jpeg";
      setImage(tempImageUri);
      
      if (onImageSelected) {
        onImageSelected(tempImageUri);
      }
    } catch (error) {
      console.error("选择图片失败:", error);
    }
  };

  return (
    <View style={styles.box}>
      {image ? (
        <View style={styles.imageContainer}>
          <Text style={styles.text}>已选择图片: {image}</Text>
        </View>
      ) : (
        <TouchableOpacity onPress={pickImage} style={styles.imagePlaceholder}>
          <Text style={styles.text}>点击选择图片</Text>
        </TouchableOpacity>
      )}
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
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ImageContainer;
