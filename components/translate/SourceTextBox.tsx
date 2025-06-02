import React from "react";
import { Text, StyleSheet, View } from "react-native";

interface SourceTextBoxProps {
  sourceText: string;
}

const SourceTextBox = ({ 
  sourceText = "原文内容",
}: SourceTextBoxProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.textBox}>
        {sourceText}
      </Text>
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
    position: 'relative',
    height: '100%',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  headerText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    marginLeft: 5,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    marginBottom: 10,
  },
  textBox: {
    color: 'white',
    fontSize: 16,
    textAlignVertical: 'top', 
    textAlign: 'left',
  },
});

export default SourceTextBox; 