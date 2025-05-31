import { View, StyleSheet, ActivityIndicator } from "react-native";
import TranslateBase from "@/components/global/TranslateBase";
import OutputTextComponent from "@/components/translate/OutputBox";
import ImageButtonBox from "@/components/translate/ImageButtonBox";
import ImageContainer from "@/components/translate/imageContainer";
import LanguageSwitcher from "@/components/translate/LanguageSwitcher";
import { useTranslateStore } from "@/store/translateStore";
import { useState } from "react";

export default function imageTransPage() {
  const {
    imageTranslate,
    setImageUri,
    handleImageLanguageChange,
    translateImage
  } = useTranslateStore();
  
  const { outputText, sourceLanguage, targetLanguage, imageUri } = imageTranslate;
  const [isTranslating, setIsTranslating] = useState(false);

  const handleImageSelected = async (uri: string) => {
    setImageUri(uri);
    setIsTranslating(true);
    try {
      await translateImage(uri);
    } catch (error) {
      console.error("翻译图片出错:", error);
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <TranslateBase>
      <View style={styles.textContainer}>
        <OutputTextComponent inputText={isTranslating ? "正在翻译中..." : outputText} />
        <ImageContainer onImageSelected={handleImageSelected} />
        <ImageButtonBox />
        <View style={styles.switcherContainer}>
          <LanguageSwitcher
            sourceLanguage={sourceLanguage}
            targetLanguage={targetLanguage}
            onLanguageChange={handleImageLanguageChange}
          />
        </View>
        
        {isTranslating && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="white" />
          </View>
        )}
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
    position: "relative",
  },
  switcherContainer: {
    marginTop: "auto",
    paddingVertical: 5,
    overflow: "hidden",
    width: "100%",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
});
