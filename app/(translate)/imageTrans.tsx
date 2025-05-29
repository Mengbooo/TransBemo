import { View, StyleSheet } from "react-native";
import TranslateBase from "@/components/global/TranslateBase";
import OutputTextComponent from "@/components/translate/OutputBox";
import ImageButtonBox from "@/components/translate/ImageButtonBox";
import ImageContainer from "@/components/translate/imageContainer";
import LanguageSwitcher from "@/components/translate/LanguageSwitcher";
import { useTranslateStore } from "@/store/translateStore";

export default function imageTransPage() {
  const {
    imageTranslate,
    setImageUri,
    handleImageLanguageChange,
    translateImage
  } = useTranslateStore();
  
  const { outputText, sourceLanguage, targetLanguage } = imageTranslate;

  const handleImageSelected = (uri: string) => {
    setImageUri(uri);
    translateImage(uri);
  };

  return (
    <TranslateBase>
      <View style={styles.textContainer}>
        <OutputTextComponent inputText={outputText} />
        <ImageContainer onImageSelected={handleImageSelected} />
        <ImageButtonBox />
        <View style={styles.switcherContainer}>
          <LanguageSwitcher
            sourceLanguage={sourceLanguage}
            targetLanguage={targetLanguage}
            onLanguageChange={handleImageLanguageChange}
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
