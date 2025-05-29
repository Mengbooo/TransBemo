import React from "react";
import { TextInput, StyleSheet, View, Text } from "react-native";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

interface SpeechInputProps {
  inputText: string;
  setInputText: (text: string) => void;
  placeholder?: string;
}

const SpeechInput: React.FC<SpeechInputProps> = ({ 
  inputText, 
  setInputText,
  placeholder = "语音识别内容将显示在这里..." 
}) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textBox}
        value={inputText}
        onChangeText={(text) => setInputText(text)}
        placeholder={placeholder}
        placeholderTextColor="grey"
        multiline
        numberOfLines={3}
        editable={true} // 允许手动编辑
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 5,
  },
  label: {
    color: 'white',
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '500',
  },
  textBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 10,
    padding: 10,
    color: 'white',
    fontSize: 18,
    textAlignVertical: 'top',
    textAlign: 'left',
    backgroundColor: 'rgba(255, 255, 255, 0)', // 稍微明显一点的背景
  },
});

export default SpeechInput; 