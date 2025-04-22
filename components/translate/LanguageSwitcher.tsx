import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, TextInput } from 'react-native';

import { Colors } from '@/constants/Colors';

// 假设支持的语言列表
const languages = [
  '中文',
  '英语',
  '日语',
  '韩语',
  '法语',
  '西班牙语',
];

const LanguageSwitcher = () => {
  // 管理源语言和目标语言的状态
  const [sourceLanguage, setSourceLanguage] = useState('源语言');
  const [targetLanguage, setTargetLanguage] = useState('目标语言');
  // 管理语言选择模态框的显示状态
  const [isModalVisible, setIsModalVisible] = useState(false);
  // 标记当前是选择源语言还是目标语言
  const [isSelectingSource, setIsSelectingSource] = useState(true);
  // 搜索语言的关键词
  const [searchTerm, setSearchTerm] = useState('');

  // 处理箭头点击事件，交换源语言和目标语言
  const handleSwapLanguages = () => {
    const temp = sourceLanguage;
    setSourceLanguage(targetLanguage);
    setTargetLanguage(temp);
  };

  // 处理选择语言的事件
  const handleSelectLanguage = (language: string) => {
    if (isSelectingSource) {
      setSourceLanguage(language);
    } else {
      setTargetLanguage(language);
    }
    setIsModalVisible(false);
    setSearchTerm('');
  };

  // 过滤语言列表，根据搜索关键词
  const filteredLanguages = languages.filter(lang =>
    lang.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 渲染语言选择项
  const renderLanguageItem = ({ item }: { item: string }) => (
    <TouchableOpacity onPress={() => handleSelectLanguage(item)} style={styles.languageItem}>
      <Text>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => {
        setIsSelectingSource(true);
        setIsModalVisible(true);
      }}>
        <Text style={styles.languageText}>{sourceLanguage}</Text>
      </TouchableOpacity>
      {/* 应用新样式 */}
      <TouchableOpacity onPress={handleSwapLanguages} style={styles.arrowContainer}>
        <Text style={styles.arrowText}>⇅</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => {
        setIsSelectingSource(false);
        setIsModalVisible(true);
      }}>
        <Text style={styles.languageText}>{targetLanguage}</Text>
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={false}
      >
        <View style={styles.modalContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="搜索语言"
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
          <FlatList
            data={filteredLanguages}
            renderItem={renderLanguageItem}
            keyExtractor={(item) => item}
          />
          <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>关闭</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    marginBottom: 5,
    borderRadius: 10, 
    overflow: 'hidden' ,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.55)'
  },
  languageText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  // 让箭头文本在 TouchableOpacity 内部居中
  arrowText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  // 新增样式，让 TouchableOpacity 组件在父容器中居中
  arrowContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    padding: 20,
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  languageItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default LanguageSwitcher;
