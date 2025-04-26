import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

import HistoryItem from '@/components/translate/HistoryItem';
import logo from "@/assets/images/logo.png";
import translateCommonStyles from '@/styles/translateCommonStyles';
import Entypo from '@expo/vector-icons/Entypo';

const icon = <Entypo name="camera" size={20} color="white" />

// 模拟数据
const mockHistoryData = Array.from({ length: 10 }, (_, index) => ({
  sourceLanguage: `源语言${index + 1}`,
  targetLanguage: `目标语言${index + 1}`,
  inputText: `输入文本${index + 1}`,
  outputText: `输出文本${index + 1}`,
  translationMethod: icon,
}));

export default function historyScreen() {

  return (
    <SafeAreaView style={styles.container}>
      <Image source={logo} style={translateCommonStyles.logo} />
      <ScrollView style={styles.scrollView}>
        {mockHistoryData.map((item, index) => (
          <HistoryItem 
            key={index}
            sourceLanguage={item.sourceLanguage}
            targetLanguage={item.targetLanguage}
            inputText={item.inputText}
            outputText={item.outputText}
            translationMethod={item.translationMethod}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black'
  },
  scrollView: {
    marginTop: 20,
    flex: 1,
    width: '95%' 
  }
});
