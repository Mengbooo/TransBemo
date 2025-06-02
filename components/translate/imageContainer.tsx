//! 图片容器组件，用于显示图片,但是直接复制的outputbox.tsx,需要修改

import React, { useState } from "react";
import { View, Image, StyleSheet, Text, TouchableOpacity, ActivityIndicator, Modal } from "react-native";
import { pickImageFromLibrary, captureImageWithCamera } from "@/utils/imageUtils";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useTranslateStore } from "@/store/translateStore";

interface ImageContainerProps {
  onImageSelected?: (uri: string) => void;
}

const ImageContainer: React.FC<ImageContainerProps> = ({ onImageSelected }) => {
  const { imageTranslate, setImageUri } = useTranslateStore();
  const { imageUri } = imageTranslate;
  
  const [loading, setLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handlePickImage = async () => {
    try {
      setLoading(true);
      const result = await pickImageFromLibrary();
      
      if (result && result.uri) {
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

  const handleCaptureImage = async () => {
    try {
      setLoading(true);
      const result = await captureImageWithCamera();
      
      if (result && result.uri) {
        if (onImageSelected) {
          onImageSelected(result.uri);
        }
      }
    } catch (error) {
      console.error("拍摄图片失败:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleClearImage = () => {
    setImageUri(null);
    setShowMenu(false);
  };
  
  const handleRetranslate = () => {
    if (imageUri && onImageSelected) {
      onImageSelected(imageUri);
    }
    setShowMenu(false);
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.processingContainer}>
          <ActivityIndicator size="small" color="white" />
          <Text style={styles.processingText}>正在处理图片...</Text>
        </View>
      ) : imageUri ? (
        <View style={styles.contentContainer}>
          <Image 
            source={{ uri: imageUri }} 
            style={styles.image} 
            resizeMode="contain"
          />
          <TouchableOpacity 
            style={styles.menuButton}
            onPress={() => setShowMenu(true)}
            activeOpacity={0.7}
          >
            <FontAwesome5 name="ellipsis-v" size={16} color="white" />
          </TouchableOpacity>
          
          <Modal
            transparent={true}
            visible={showMenu}
            animationType="fade"
            onRequestClose={() => setShowMenu(false)}
          >
            <TouchableOpacity 
              style={styles.modalOverlay}
              activeOpacity={1}
              onPress={() => setShowMenu(false)}
            >
              <View style={styles.menuContainer}>
                <TouchableOpacity 
                  style={styles.menuItem}
                  onPress={handlePickImage}
                >
                  <FontAwesome5 name="image" size={16} color="white" />
                  <Text style={styles.menuText}>从相册选择</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.menuItem}
                  onPress={handleCaptureImage}
                >
                  <FontAwesome5 name="camera" size={16} color="white" />
                  <Text style={styles.menuText}>拍摄照片</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.menuItem}
                  onPress={handleRetranslate}
                >
                  <FontAwesome5 name="sync" size={16} color="white" />
                  <Text style={styles.menuText}>重新翻译</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.menuItem}
                  onPress={handleClearImage}
                >
                  <FontAwesome5 name="trash" size={16} color="white" />
                  <Text style={styles.menuText}>清除图片</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Modal>
        </View>
      ) : (
        <View style={styles.optionsContainer}>
          <TouchableOpacity 
            style={styles.optionButton}
            onPress={handlePickImage}
            activeOpacity={0.7}
          >
            <FontAwesome5 name="image" size={24} color="rgba(255, 255, 255, 0.7)" />
            <Text style={styles.optionText}>从相册选择</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.optionButton}
            onPress={handleCaptureImage}
            activeOpacity={0.7}
          >
            <FontAwesome5 name="camera" size={24} color="rgba(255, 255, 255, 0.7)" />
            <Text style={styles.optionText}>拍摄照片</Text>
          </TouchableOpacity>
        </View>
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
    justifyContent: "center",
    height: '100%',
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
  optionsContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 20,
  },
  optionButton: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 10,
    width: 120,
  },
  optionText: {
    color: "white",
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
  menuButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 8,
    borderRadius: 20,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  menuContainer: {
    backgroundColor: "#333",
    borderRadius: 10,
    padding: 10,
    width: "80%",
    maxWidth: 300,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  menuText: {
    color: "white",
    marginLeft: 10,
    fontSize: 16,
  },
});

export default ImageContainer;
