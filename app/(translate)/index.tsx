import { View, StyleSheet, Image, Text, TextInput } from "react-native";

import TranslateBase from "@/components/global/TranslateBase";
import InputComponent from "@/components/translate/InputBox";
import OutputTextComponent from "@/components/translate/OutputBox";
import TranslateButton from "@/components/translate/TranslateButton";

import { useState } from "react";

export default function textTransPage() {
  const [inputText, setInputText] = useState("翻译内容");

  return (
    <TranslateBase>
      <View style={styles.textContainer}>
        <InputComponent inputText={inputText} setInputText={setInputText} />
        <OutputTextComponent inputText={inputText} />
        <TranslateButton />
      </View>
    </TranslateBase>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#000000",
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
  logo: {
    width: 50,
    height: 50,
    resizeMode: "contain",
    marginTop: 10,
  },
  textContainer: {
    flex: 1,
    width: "90%",
    marginTop: 20,
    justifyContent: "space-between",
  },
});
