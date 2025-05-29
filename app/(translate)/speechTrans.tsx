import { View, StyleSheet } from "react-native";
import TranslateBase from "@/components/global/TranslateBase";
import SpeechInput from "@/components/translate/SpeechInput";
import OutputTextComponent from "@/components/translate/OutputBox";
import SpeechButtonBox from "@/components/translate/SpeechButtonBox";
import LanguageSwitcher from "@/components/translate/LanguageSwitcher";
import { useTranslateStore } from "@/store/translateStore";

export default function speechTransPage() {
  const {
    speechTranslate,
    setSpeechText,
    translateSpeech,
    handleSpeechLanguageChange
  } = useTranslateStore();
  
  const { speechText, outputText, sourceLanguage, targetLanguage } = speechTranslate;

  // 这个函数将在实现语音识别功能后调用
  const handleSpeechRecognized = (text: string) => {
    setSpeechText(text);
    translateSpeech(text);
  };

  return (
    <TranslateBase>
      <View style={styles.textContainer}>
        <SpeechInput 
          inputText={speechText} 
          setInputText={setSpeechText} 
        />
        <OutputTextComponent inputText={outputText} />
        <SpeechButtonBox onSpeechRecognized={handleSpeechRecognized} />
        <View style={styles.switcherContainer}>
          <LanguageSwitcher
            sourceLanguage={sourceLanguage}
            targetLanguage={targetLanguage}
            onLanguageChange={handleSpeechLanguageChange}
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
