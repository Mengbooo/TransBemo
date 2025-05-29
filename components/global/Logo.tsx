import React, { useState } from 'react';
import { Image, Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import logo from "@/assets/images/logo.png";

interface LogoProps {
  style?: any;
  errorMessage?: string;
}

const Logo: React.FC<LogoProps> = ({ style, errorMessage }) => {
  const [showModal, setShowModal] = useState(!!errorMessage);

  return (
    <>
      <Image 
        source={logo} 
        style={style} 
        onError={() => setShowModal(true)}
      />
      <Modal
        transparent
        visible={showModal}
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      > 
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              {errorMessage || '加载图片时出现问题'}
            </Text>
            <TouchableOpacity 
              style={styles.modalButton}
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.buttonText}>关闭</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'white',
  },
  modalText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 15,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Logo; 