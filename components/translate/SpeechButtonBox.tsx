import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Button from '../global/Button';
import SoundWave from '@/components/animation/SoundWave';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';


const SpeechButtonBox: React.FC = () => {
  const SpeechIcon = <FontAwesome5 name="microphone-alt" size={24} color="white" />

  const [isRecording, setIsRecording] = useState(false);

  const handlePressIn = () => {
    setIsRecording(true);
    // 这里可以添加开始录音的逻辑
  };

  const handlePressOut = () => {
    setIsRecording(false);
    // 这里可以添加停止录音的逻辑
  };

  return (
    <View style={styles.container}>
      {isRecording && <SoundWave isRecording={isRecording} />}
      <Button
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        icon={SpeechIcon}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    color: 'white',
    fontSize: 20,
  },
});

export default SpeechButtonBox;