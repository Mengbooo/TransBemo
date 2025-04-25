import { TextInput, StyleSheet } from "react-native";

const InputComponent = ({ inputText, setInputText }: { inputText: string; setInputText: (text: string) => void }) => {
    return (
      <TextInput
        style={styles.textBox}
        value={inputText}
        onChangeText={(text) => setInputText(text)}
        placeholder="输入文本"
        placeholderTextColor="white"
        multiline
        numberOfLines={4}
      />
    );
  };

const styles = StyleSheet.create({
    textBox: {
        flex: 1,
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 10,
        padding: 10,
        marginVertical: 5,
        color: 'white',
        fontSize: 20,
        textAlignVertical: 'top', 
        textAlign: 'left', 
    },
})

export default InputComponent;