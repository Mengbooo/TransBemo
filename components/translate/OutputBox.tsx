import React from "react";
import { Text, StyleSheet, View } from "react-native";

interface OutputTextComponentProps {
  inputText: string;
  hasAudio?: boolean;
  playButton?: React.ReactNode;
}

const OutputTextComponent = ({ 
  inputText = "翻译内容",
  hasAudio = false,
  playButton
}: OutputTextComponentProps) => {
  return (
    <View style={styles.container}>
      <Text style={[styles.textBox, hasAudio && styles.textWithAudio]}>
        {inputText}
      </Text>
      
      {hasAudio && playButton && (
        <>
          <View style={styles.divider} />
          <View style={styles.playButton}>{playButton}</View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    position: 'relative',
    minHeight: 100,
  },
  textBox: {
    color: 'white',
    fontSize: 16,
    textAlignVertical: 'top', 
    textAlign: 'left',
  },
  textWithAudio: {
    marginBottom: 25,
  },
  divider: {
    position: "absolute",
    bottom: 5,
    left: 10,
    right: 10,
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    marginBottom: 30,
  },
  playButton: {
    position: "absolute",
    bottom: 0,
    left: 10,
    right: 10,
  },
});

export default OutputTextComponent;