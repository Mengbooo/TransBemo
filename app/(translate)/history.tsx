import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import React from 'react';

import HistoryItem from '@/components/translate/HistoryItem';
import logo from "@/assets/images/logo.png";
import translateCommonStyles from '@/styles/translateCommonStyles';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useTranslateStore } from '@/store/translateStore';

// 定义不同类型翻译的图标
const textIcon = <MaterialCommunityIcons name="translate" size={20} color="white" />
const speechIcon = <MaterialCommunityIcons name="text-to-speech" size={20} color="white" />
const imageIcon = <MaterialCommunityIcons name="image-multiple" size={20} color="white" />

// 获取对应类型的图标
const getTranslationIcon = (type: string) => {
  switch (type) {
    case 'text':
      return textIcon;
    case 'speech':
      return speechIcon;
    case 'image':
      return imageIcon;
    default:
      return textIcon;
  }
};

export default function historyScreen() {
  // 从状态库获取翻译历史
  const { translationHistory } = useTranslateStore();
  
  // 如果没有历史记录，显示空状态
  const isEmpty = translationHistory.length === 0;

  return (
    <SafeAreaView style={styles.container}>
      <Image source={logo} style={translateCommonStyles.logo} />
      {isEmpty ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="history" size={60} color="rgba(255,255,255,0.3)" />
          <Text style={styles.emptyText}>暂无翻译历史记录</Text>
          <Text style={styles.emptySubText}>您的翻译记录将会显示在这里</Text>
        </View>
      ) : (
        <ScrollView style={styles.scrollView}>
          {translationHistory.map((item, index) => (
            <HistoryItem 
              key={index}
              sourceLanguage={item.source}
              targetLanguage={item.target}
              inputText={item.inputText}
              outputText={item.outputText}
              translationMethod={getTranslationIcon(item.type)}
              timestamp={item.timestamp}
            />
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'black'
  },
  scrollView: {
    marginTop: 20,
    flex: 1,
    width: '95%' 
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  emptyText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
  emptySubText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
    marginTop: 10,
  }
});
