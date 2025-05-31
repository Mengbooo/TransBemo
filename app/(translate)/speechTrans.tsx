import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import TranslateBase from "@/components/global/TranslateBase";
import OutputTextComponent from "@/components/translate/OutputBox";
import SpeechButtonBox from "@/components/translate/SpeechButtonBox";
import SpeechInput from "@/components/translate/SpeechInput";
import LanguageSwitcher from "@/components/translate/LanguageSwitcher";
import { useTranslateStore } from "@/store/translateStore";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

export default function SpeechTransPage() {
  const {
    speechTranslate,
    handleSpeechLanguageChange,
    playTranslatedAudio
  } = useTranslateStore();
  
  const { 
    speechText,
    outputText, 
    sourceLanguage, 
    targetLanguage, 
    recordingStatus,
    targetAudioBase64
  } = speechTranslate;

  return (
    <TranslateBase>
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <SpeechInput 
            speechText={speechText} 
            recordingStatus={recordingStatus} 
          />
          
          <OutputTextComponent inputText={outputText} />
          
          {targetAudioBase64 && (
            <TouchableOpacity 
              style={styles.translatedAudioButton} 
              onPress={playTranslatedAudio}
            >
              <FontAwesome5 name="play" size={18} color="white" />
              <Text style={styles.audioButtonText}>播放译文语音</Text>
            </TouchableOpacity>
          )}
          
          <SpeechButtonBox />
          
          <View style={styles.switcherContainer}>
            <LanguageSwitcher
              sourceLanguage={sourceLanguage}
              targetLanguage={targetLanguage}
              onLanguageChange={handleSpeechLanguageChange}
            />
          </View>
        </View>
      </View>
    </TranslateBase>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
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
  translatedAudioButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    marginVertical: 5,
  },
  audioButtonText: {
    color: "white",
    marginLeft: 8,
    fontWeight: "500",
  },
});
