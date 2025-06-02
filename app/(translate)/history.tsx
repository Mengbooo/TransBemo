import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useState } from 'react';

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
  const { translationHistory, isLoadingHistory, loadHistory, deleteHistoryItem, clearHistory } = useTranslateStore();
  
  // 加载历史记录
  useEffect(() => {
    loadHistory();
  }, []);
  
  // 删除单条记录
  const handleDeleteItem = (id: string) => {
    Alert.alert(
      "删除记录",
      "确定要删除这条记录吗？",
      [
        {
          text: "取消",
          style: "cancel"
        },
        { 
          text: "确定", 
          onPress: () => deleteHistoryItem(id),
          style: "destructive"
        }
      ]
    );
  };
  
  // 清空所有记录
  const handleClearAll = () => {
    Alert.alert(
      "清空记录",
      "确定要清空所有翻译记录吗？此操作不可恢复。",
      [
        {
          text: "取消",
          style: "cancel"
        },
        { 
          text: "确定", 
          onPress: () => clearHistory(),
          style: "destructive"
        }
      ]
    );
  };
  
  // 如果没有历史记录，显示空状态
  const isEmpty = translationHistory.length === 0;

  return (
    <SafeAreaView style={styles.container}>
      <Image source={logo} style={translateCommonStyles.logo} />
      
      {/* 标题和清空按钮 */}
      <View style={styles.headerContainer}>
        <View style={styles.headerTitleContainer}>
          <MaterialCommunityIcons name="history" size={20} color="white" />
          <Text style={styles.headerTitle}>翻译历史</Text>
        </View>
        {!isEmpty && (
          <TouchableOpacity 
            style={styles.clearButton} 
            onPress={handleClearAll}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="delete-sweep" size={20} color="black" />
            <Text style={styles.clearButtonText}>清空</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {/* 加载中状态 */}
      {isLoadingHistory ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="white" />
          <Text style={styles.loadingText}>加载历史记录中...</Text>
        </View>
      ) : isEmpty ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="history" size={60} color="rgba(255,255,255,0.3)" />
          <Text style={styles.emptyText}>暂无翻译历史记录</Text>
          <Text style={styles.emptySubText}>您的翻译记录将会显示在这里</Text>
        </View>
      ) : (
        <ScrollView style={styles.scrollView}>
          {translationHistory.map((item, index) => (
            <HistoryItem 
              key={item._id || index}
              sourceLanguage={item.source}
              targetLanguage={item.target}
              inputText={item.inputText}
              outputText={item.outputText}
              translationMethod={getTranslationIcon(item.type)}
              timestamp={item.timestamp}
              onDelete={() => item._id && handleDeleteItem(item._id)}
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
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
    paddingVertical: 15,
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    color: 'grey',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  clearButtonText: {
    color: 'black',
    fontSize: 14,
    marginLeft: 4,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    fontSize: 14,
    marginTop: 10,
  },
});
