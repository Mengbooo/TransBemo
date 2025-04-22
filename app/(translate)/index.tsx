import { View, StyleSheet, Image } from "react-native";

import LanguageSwitcher from "@/components/translate/LanguageSwitcher";

import image from "@/assets/images/logo.png";

export default function textTransPage() {
  return (
    <View style={styles.container}>
      <Image source={image} style={styles.image}></Image>
      <View style={styles.switcherContainer}>
        <LanguageSwitcher />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  switcherContainer: {
    marginTop: "auto",
    marginHorizontal: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    overflow: "hidden",
    width: "100%",
  },
  image: {
    width: 50, 
    height: 50, 
    resizeMode: 'contain', 
    marginTop: 10,
  },
});
