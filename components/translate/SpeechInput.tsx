import React from "react";
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useTranslateStore } from "@/store/translateStore";

interface SpeechInputProps {
  speechText: string;
  recordingStatus: 'idle' | 'recording' | 'processing';
}

const SpeechInput: React.FC<SpeechInputProps> = ({ 
  speechText, 
  recordingStatus 
}) => {
  const { 
    speechTranslate,
    playOriginalAudio 
  } = useTranslateStore();

  const { audioUri } = speechTranslate;
  
  return (
    <View style={styles.container}>
      {recordingStatus === 'recording' ? (
        <View style={styles.recordingContainer}>
          <ActivityIndicator size="small" color="#FF4A4A" />
          <Text style={styles.recordingText}>正在录音...</Text>
        </View>
      ) : recordingStatus === 'processing' ? (
        <View style={styles.processingContainer}>
          <ActivityIndicator size="small" color="white" />
          <Text style={styles.processingText}>正在处理语音...</Text>
        </View>
      ) : speechText ? (
        <View style={styles.contentContainer}>
          <Text style={styles.text}>{speechText}</Text>
          
          {audioUri && (
            <>
              <View style={styles.divider} />
              <TouchableOpacity 
                style={styles.playButton} 
                onPress={playOriginalAudio}
              >
                <FontAwesome5 name="play-circle" size={20} color="white" />
              </TouchableOpacity>
            </>
          )}
        </View>
      ) : (
        <View style={styles.placeholderContainer}>
          <FontAwesome5 name="microphone" size={24} color="rgba(255, 255, 255, 0.5)" />
          <Text style={styles.placeholder}>点击下方按钮开始录音</Text>
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
    marginVertical: 5,
    justifyContent: "center",
    minHeight: 100,
  },
  contentContainer: {
    flex: 1,
    position: "relative",
  },
  text: {
    color: "white",
    fontSize: 16,
    textAlign: "left",
    marginBottom: 25, // 为播放按钮留出空间
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
  recordingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  recordingText: {
    color: "#FF4A4A",
    marginLeft: 10,
    fontWeight: "bold",
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
  divider: {
    position: "absolute",
    bottom: 5,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    marginBottom: 30,
  },
  playButton: {
    position: "absolute",
    bottom: 5,
    left: 5,
    padding: 3,
  },
});

export default SpeechInput; 