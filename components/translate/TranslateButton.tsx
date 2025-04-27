import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';

interface TranslateButtonProps {
  onPress: () => void;
}

const TranslateButtonBox: React.FC<TranslateButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Text style={styles.text}>翻译</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', 
    justifyContent: 'space-around',
    alignItems: 'center',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    backgroundColor: 'white',
  },
  text: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TranslateButtonBox;