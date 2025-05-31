import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import Button from '../global/Button';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useTranslateStore } from '@/store/translateStore';

interface ImageButtonBoxProps {
  onImageCapture?: (uri: string) => void;
}

const ImageButtonBox: React.FC<ImageButtonBoxProps> = ({ onImageCapture }) => {
  const [isPickingImage, setIsPickingImage] = useState(false);
  const [isCapturingImage, setIsCapturingImage] = useState(false);
  
  const { 
    pickAndTranslateImage,
    captureAndTranslateImage 
  } = useTranslateStore();

  const handlePickImage = async () => {
    try {
      setIsPickingImage(true);
      await pickAndTranslateImage();
    } catch (error) {
      Alert.alert('错误', '选择图片失败: ' + (error as Error).message);
    } finally {
      setIsPickingImage(false);
    }
  };

  const handleCaptureImage = async () => {
    try {
      setIsCapturingImage(true);
      await captureAndTranslateImage();
    } catch (error) {
      Alert.alert('错误', '拍摄图片失败: ' + (error as Error).message);
    } finally {
      setIsCapturingImage(false);
    }
  };

  const ImageIcon = <FontAwesome5 name="image" size={24} color="white" />
  const CameraIcon = <FontAwesome5 name="camera" size={24} color="white" />

  return (
    <View style={styles.container}>
      <Button
        icon={ImageIcon}
        onPress={handlePickImage}
        isPressed={isPickingImage}
      />
      <Button
        icon={CameraIcon}
        onPress={handleCaptureImage}
        isPressed={isCapturingImage}
      />
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
});

export default ImageButtonBox;