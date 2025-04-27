import { StyleSheet } from 'react-native';

const translateCommonStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  logo: {
    width: 50, 
    height: 50, 
    resizeMode: 'contain', 
    marginTop: 10,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default translateCommonStyles;