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
          
          <OutputTextComponent 
            inputText={outputText} 
            hasAudio={!!targetAudioBase64}
            playButton={
              targetAudioBase64 ? (
                <TouchableOpacity 
                  style={styles.playButton} 
                  onPress={playTranslatedAudio}
                >
                  <FontAwesome5 name="play-circle" size={20} color="white" />
                </TouchableOpacity>
              ) : undefined
            }
          />
          
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
  playButton: {
    position: "absolute",
    bottom: 5,
    left: 5,
    padding: 3,
  },
});
