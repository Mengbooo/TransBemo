import { View, StyleSheet } from "react-native";
import TranslateBase from "@/components/global/TranslateBase";
import InputComponent from "@/components/translate/InputBox";
import OutputTextComponent from "@/components/translate/OutputBox";
import TranslateButton from "@/components/translate/TranslateButton";
import LanguageSwitcher from "@/components/translate/LanguageSwitcher";
import { useTranslateStore } from "@/store/translateStore";

export default function textTransPage() {
  const {
    textTranslate,
    setTextInputText,
    handleTextLanguageChange,
    translateText
  } = useTranslateStore();
  
  const { inputText, outputText, sourceLanguage, targetLanguage } = textTranslate;

  return (
    <TranslateBase>
      <View style={styles.textContainer}>
        <InputComponent inputText={inputText} setInputText={setTextInputText} />
        <OutputTextComponent inputText={outputText} />
        <TranslateButton onPress={translateText} />
        <View style={styles.switcherContainer}>
          <LanguageSwitcher
            sourceLanguage={sourceLanguage}
            targetLanguage={targetLanguage}
            onLanguageChange={handleTextLanguageChange}
          />
        </View>
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
  switcherContainer: {
    marginTop: "auto",
    paddingVertical: 5,
    overflow: "hidden",
    width: "100%",
  },
});
