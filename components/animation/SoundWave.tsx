import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';

const SoundWave: React.FC<{ isRecording: boolean }> = ({ isRecording }) => {
  const animation = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animation, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(animation, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      animation.stopAnimation();
      animation.setValue(0);
    }
  }, [isRecording]);

  const waveHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [10, 50],
  });

  return (
    <View style={styles.container}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Animated.View
          key={index}
          style={[
            styles.wave,
            {
              height: waveHeight,
              // 使用 interpolate 方法实现除以 2 的效果
              marginTop: waveHeight.interpolate({
                inputRange: [0, 50],
                outputRange: [0, -25],
              }),
              left: index * 20,
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wave: {
    position: 'absolute',
    width: 10,
    backgroundColor: 'blue',
    borderRadius: 5,
  },
});

export default SoundWave;