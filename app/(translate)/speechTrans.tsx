import { View, Text, StyleSheet } from "react-native";
import { useState } from "react";

import TranslateBase from "@/components/global/TranslateBase";
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
        <OutputTextComponent inputText={inputText}></OutputTextComponent>
        <SpeechButtonBox></SpeechButtonBox>
        <LanguageSwitcher
            sourceLanguage={sourceLanguage}
            targetLanguage={targetLanguage}
            onLanguageChange={handleLanguageChange}
          />
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
