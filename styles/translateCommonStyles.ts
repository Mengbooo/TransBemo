import { StyleSheet } from 'react-native';

const translateCommonStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  switcherContainer: {
    marginTop: 'auto', 
    marginHorizontal: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    overflow: 'hidden' ,
    width: '100%', 
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