import { Text, StyleSheet } from "react-native";


const OutputTextComponent = ({ inputText = "翻译内容" }: { inputText: string }) => {
    return (
      <Text style={styles.textBox}>
        {inputText}
      </Text>
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

export default OutputTextComponent;