import { View, Text, StyleSheet } from "react-native";
import { useState } from "react";

import TranslateBase from "@/components/global/TranslateBase";
import InputComponent from "@/components/translate/InputBox";
import OutputTextComponent from "@/components/translate/OutputBox";
import SpeechButtonBox from "@/components/translate/SpeechButtonBox";
import LanguageSwitcher from "@/components/translate/LanguageSwitcher";

export default function speechTransPage() {
  const [inputText, setInputText] = useState("");
  const [sourceLanguage, setSourceLanguage] = useState("中文");
  const [targetLanguage, setTargetLanguage] = useState("英语");

  const handleLanguageChange = (newSource: string, newTarget: string) => {
    setSourceLanguage(newSource);
    setTargetLanguage(newTarget);
  };

  return (
    <TranslateBase>
      <View style={styles.textContainer}>
        <InputComponent inputText={inputText} setInputText={setInputText}  ></InputComponent>
        <OutputTextComponent inputText={inputText}></OutputTextComponent>
        <SpeechButtonBox></SpeechButtonBox>
        <View style={styles.switcherContainer}>
          <LanguageSwitcher
            sourceLanguage={sourceLanguage}
            targetLanguage={targetLanguage}
            onLanguageChange={handleLanguageChange}
          />
        </View>
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
  switcherContainer: {
    marginTop: "auto",
    paddingVertical: 5,
    overflow: "hidden",
    width: "100%",
  },
});
