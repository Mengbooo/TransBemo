//! 图片容器组件，用于显示图片,但是直接复制的outputbox.tsx,需要修改

import React, { useState } from "react";
import { View, Image, StyleSheet, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { pickImageFromLibrary } from "@/utils/imageUtils";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

interface ImageContainerProps {
  onImageSelected?: (uri: string) => void;
}

const ImageContainer: React.FC<ImageContainerProps> = ({ onImageSelected }) => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePickImage = async () => {
    try {
      setLoading(true);
      const result = await pickImageFromLibrary();
      
      if (result && result.uri) {
        setImage(result.uri);
        
        if (onImageSelected) {
          onImageSelected(result.uri);
        }
      }
    } catch (error) {
      console.error("选择图片失败:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.processingContainer}>
          <ActivityIndicator size="small" color="white" />
          <Text style={styles.processingText}>正在处理图片...</Text>
        </View>
      ) : image ? (
        <View style={styles.contentContainer}>
          <Image 
            source={{ uri: image }} 
            style={styles.image} 
            resizeMode="contain"
          />
        </View>
      ) : (
        <TouchableOpacity 
          style={styles.touchableArea}
          onPress={handlePickImage}
          activeOpacity={0.7}
        >
          <View style={styles.placeholderContainer}>
            <FontAwesome5 name="image" size={24} color="rgba(255, 255, 255, 0.5)" />
            <Text style={styles.placeholder}>点击选择或拍摄图片</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    justifyContent: "center",
    minHeight: 100,
  },
  contentContainer: {
    flex: 1,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  touchableArea: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  placeholder: {
    color: "rgba(255, 255, 255, 0.5)",
    marginTop: 10,
    textAlign: "center",
  },
  processingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  processingText: {
    color: "white",
    marginLeft: 10,
  },
});

export default ImageContainer;
