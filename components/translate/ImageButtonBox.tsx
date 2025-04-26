import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Button from '../global/Button';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';


const ImageButtonBox: React.FC = () => {
  const ImageIcon = <FontAwesome5 name="image" size={24} color="white" />
  const CameraIcon = <FontAwesome5 name="camera" size={24} color="white" />

  return (
    <View style={styles.container}>
      <Button
        icon={ImageIcon}
      />
      <Button
        icon={CameraIcon}
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