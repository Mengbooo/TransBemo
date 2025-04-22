import { View, Text, StyleSheet } from 'react-native';

import LanguageSwitcher from '@/components/translate/LanguageSwitcher';

export default function speechTransPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>speechTransPage</Text>
      <View style={styles.switcherContainer}>
        <LanguageSwitcher />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text:{
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  switcherContainer: {
    marginTop: 'auto', 
    marginHorizontal: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    overflow: 'hidden' ,
    width: '100%', 
  },
});
