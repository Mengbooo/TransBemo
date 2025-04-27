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
import { languagesLabelTemp } from "@/constants/Languages";

const getLanguageKey = (languageValue: string) => {
  for (const key in languagesLabelTemp) {
    if (languagesLabelTemp[key] === languageValue) {
      return key;
    }
  }
  return null;
};

interface LanguageSwitcherProps {
  sourceLanguage: string;
  targetLanguage: string;
  onLanguageChange: (newSource: string, newTarget: string) => void;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  sourceLanguage,
  targetLanguage,
  onLanguageChange,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSelectingSource, setIsSelectingSource] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSwapLanguages = () => {
    const temp = sourceLanguage;
    const newSource = targetLanguage;
    const newTarget = temp;
    onLanguageChange(newSource, newTarget);
  };

  const handleSelectLanguage = (language: string) => {
    if (isSelectingSource) {
      onLanguageChange(language, targetLanguage);
    } else {
      onLanguageChange(sourceLanguage, language);
    }
    setIsModalVisible(false);
    setSearchTerm("");
  };

  const allLanguages = Object.values(languagesLabelTemp);
  const filteredLanguages = allLanguages.filter((lang) =>
    lang.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <TouchableOpacity onPress={handleSwapLanguages} style={styles.arrowContainer}>
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
    marginTop: 5,
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
