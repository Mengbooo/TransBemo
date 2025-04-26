import React from 'react';
import { Text, View, StyleSheet } from 'react-native';


const TranslateButtonBox: React.FC = () => {

  return (
    <View style={styles.container}>
        <Text style={styles.text}>翻译</Text>
    </View>
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