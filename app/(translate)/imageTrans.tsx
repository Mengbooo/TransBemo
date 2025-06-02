import { View, StyleSheet, ActivityIndicator } from "react-native";
import TranslateBase from "@/components/global/TranslateBase";
import OutputTextComponent from "@/components/translate/OutputBox";
import SourceTextBox from "@/components/translate/SourceTextBox";
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
  
  const { outputText, sourceText, sourceLanguage, targetLanguage, imageUri } = imageTranslate;
  const [isTranslating, setIsTranslating] = useState(false);

  const handleImageSelected = async (uri: string) => {
    setImageUri(uri);
    setIsTranslating(true);
    console.log('【调试】图片翻译 - 开始处理图片:', uri.substring(0, 30) + '...');
    try {
      await translateImage(uri);
    } catch (error) {
      console.error("【错误】图片翻译失败:", error);
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <TranslateBase>
      <View style={styles.container}>
        <View style={styles.textSection}>
          <View style={styles.sourceTextWrapper}>
            <SourceTextBox 
              sourceText={isTranslating ? "识别中..." : (sourceText || "未识别到文字")} 
            />
          </View>
          <View style={styles.outputTextWrapper}>
            <OutputTextComponent inputText={isTranslating ? "正在翻译中..." : outputText} />
          </View>
        </View>
        <View style={styles.imageSection}>
          <ImageContainer onImageSelected={handleImageSelected} />
        </View>
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
  container: {
    flex: 1,
    width: "90%",
    marginTop: 20,
    justifyContent: "space-between",
    position: "relative",
  },
  textSection: {
  },
  sourceTextWrapper: {
    height: 80,
    marginBottom: 5,
  },
  outputTextWrapper: {
    height: 100,
    marginBottom: 5,
  },
  imageSection: {
    flex: 1.5,
    marginBottom: 5,
  },
  switcherContainer: {
    height: 50,
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
