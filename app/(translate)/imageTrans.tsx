import { View, Text, StyleSheet } from "react-native";
import { useState } from "react";

import TranslateBase from "@/components/global/TranslateBase";
import OutputTextComponent from "@/components/translate/OutputBox";
import ImageButtonBox from "@/components/translate/ImageButtonBox";
import ImageContainer from "@/components/translate/imageContainer";

export default function imageTransPage() {
  const [inputText, setInputText] = useState("");

  return (
    <TranslateBase>
      <View style={styles.textContainer}>
        <OutputTextComponent inputText={inputText}></OutputTextComponent>
        <ImageContainer></ImageContainer>
        <ImageButtonBox></ImageButtonBox>
      </View>
    </TranslateBase>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  textContainer: {
    flex: 1,
    width: "90%",
    marginTop: 20,
    justifyContent: "space-between",
  },
});
