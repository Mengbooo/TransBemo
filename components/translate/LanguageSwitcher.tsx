import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
} from "react-native";

import { Colors } from "@/constants/Colors";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

// 导入 languagesLabelTemp
import { languagesLabelTemp } from "../../constants/Languages";

// 辅助函数，根据语言值获取对应的键
const getLanguageKey = (languageValue: string) => {
  for (const key in languagesLabelTemp) {
    if (languagesLabelTemp[key] === languageValue) {
      return key;
    }
  }
  return null;
};

const LanguageSwitcher = () => {
  // 管理源语言和目标语言的状态
  const [sourceLanguage, setSourceLanguage] = useState("中文");
  const [targetLanguage, setTargetLanguage] = useState("英语");
  // 管理语言选择模态框的显示状态
  const [isModalVisible, setIsModalVisible] = useState(false);
  // 标记当前是选择源语言还是目标语言
  const [isSelectingSource, setIsSelectingSource] = useState(true);
  // 搜索语言的关键词
  const [searchTerm, setSearchTerm] = useState("");

  // 获取源语言和目标语言的 key
  const sourceLanguageKey = getLanguageKey(sourceLanguage);
  const targetLanguageKey = getLanguageKey(targetLanguage);

  console.log("sourceLanguageKey:", sourceLanguageKey); // 输出源语言的 key
  console.log("targetLanguageKey:", targetLanguageKey); // 输出目标语言的 key

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
    setSearchTerm("");
  };

  // 获取 languagesLabelTemp 的所有 value
  const allLanguages = Object.values(languagesLabelTemp);
  // 过滤语言列表，根据搜索关键词
  const filteredLanguages = allLanguages.filter((lang) =>
    lang.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 渲染语言选择项
  const renderLanguageItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      onPress={() => handleSelectLanguage(item)}
      style={styles.languageItem}
    >
      <Text style={styles.languageItemText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          setIsSelectingSource(true);
          setIsModalVisible(true);
        }}
        style={styles.languageButton}
      >
        <Text style={styles.languageText}>{sourceLanguage}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleSwapLanguages}
        style={styles.arrowContainer}
      >
        <FontAwesome5 name="arrows-alt-h" size={24} color="white" />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          setIsSelectingSource(false);
          setIsModalVisible(true);
        }}
        style={styles.languageButton}
      >
        <Text style={styles.languageText}>{targetLanguage}</Text>
      </TouchableOpacity>

      <Modal visible={isModalVisible} animationType="slide" transparent={false}>
        <View style={styles.modalContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="搜索语言"
            placeholderTextColor="white"
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
          <FlatList
            data={filteredLanguages}
            renderItem={renderLanguageItem}
            keyExtractor={(item) => item}
          />
          <TouchableOpacity
            onPress={() => setIsModalVisible(false)}
            style={styles.closeButton}
          >
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
    marginTop:5,
    borderRadius: 10,
    overflow: "hidden",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "white",
  },
  languageText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    textAlign: "center", 
  },
  arrowText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  arrowContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  languageButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "black",
    flex: 1,
    padding: 20,
  },
  searchInput: {
    height: 40,
    borderColor: "gray",
    color: "white", 
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  languageItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  languageItemText: {
    color: "white",
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default LanguageSwitcher;
