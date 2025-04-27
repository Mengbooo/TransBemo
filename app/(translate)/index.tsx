import { View, StyleSheet } from "react-native";
import TranslateBase from "@/components/global/TranslateBase";
import InputComponent from "@/components/translate/InputBox";
import OutputTextComponent from "@/components/translate/OutputBox";
import TranslateButton from "@/components/translate/TranslateButton";
import LanguageSwitcher from "@/components/translate/LanguageSwitcher";
import { useState } from "react";
import { translateTextRequest } from "@/api/textTransRequest";
import { languagesLabelTemp } from "@/constants/Languages";

export default function textTransPage() {
  const [inputText, setInputText] = useState("翻译内容");
  const [outputText, setOutputText] = useState("");
  const [sourceLanguage, setSourceLanguage] = useState("中文");
  const [targetLanguage, setTargetLanguage] = useState("英语");

  const getLanguageKey = (languageValue: string) => {
    for (const key in languagesLabelTemp) {
      if (languagesLabelTemp[key] === languageValue) {
        return key;
      }
    }
    return null;
  };

  const sourceLanguageKey = getLanguageKey(sourceLanguage) as string;
  const targetLanguageKey = getLanguageKey(targetLanguage) as string;

  const handleTranslate = async () => {
    try {
      const params = {
        q: inputText,
        from: sourceLanguageKey,
        to: targetLanguageKey,
      };
      const result = await translateTextRequest(
        params.q,
        params.from,
        params.to
      );
      console.log("翻译结果1:", result);
      console.log("翻译结果2:", result.data.trans_result[0].dst);

      if (result.data.trans_result[0].dst) {
        setOutputText(result.data.trans_result[0].dst);
      }
      
    } catch (error) {
      console.error("翻译失败:", error);
    }
  };

  const handleLanguageChange = (newSource: string, newTarget: string) => {
    setSourceLanguage(newSource);
    setTargetLanguage(newTarget);
  };

  return (
    <TranslateBase>
      <View style={styles.textContainer}>
        <InputComponent inputText={inputText} setInputText={setInputText} />
        <OutputTextComponent inputText={outputText} />
        <TranslateButton onPress={handleTranslate} />
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
