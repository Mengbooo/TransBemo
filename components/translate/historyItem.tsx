import React, { ReactNode } from "react";
import { View, Text, StyleSheet } from "react-native";

// 定义历史记录项的类型
type HistoryItemProps = {
  sourceLanguage: string;
  targetLanguage: string;
  inputText: string;
  outputText: string;
  translationMethod:ReactNode;
};

const HistoryItem: React.FC<HistoryItemProps> = ({
  sourceLanguage,
  targetLanguage,
  inputText,
  outputText,
  translationMethod,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.Info}>
        <View style={styles.languageInfo}>
          <Text style={styles.languageText}>
            {sourceLanguage} → {targetLanguage}
          </Text>
        </View>
        <View style={styles.methodInfo}>
          <View>{translationMethod}</View>
        </View>
      </View>
      <View style={styles.contentInfo}>
        <Text style={styles.content}>{inputText}</Text>
        <View style={styles.separator} />
        <Text style={styles.content}>{outputText}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 5,
    padding: 15,
    backgroundColor: "black",
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 10,
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    shadowColor: "#000",
  },
  Info: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    alignItems: "center", 
    justifyContent: "space-between", 
  },
  languageInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 10,
  },
  languageText: {
    fontWeight: "bold",
    color: "white",
  },
  methodInfo: {
    marginBottom: 10,
  },
  content: {
    fontSize: 14,
    color: "white",
  },
  contentInfo: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  separator: {
    width: '100%', // 分割线宽度占满父容器
    height: 1, // 分割线高度
    backgroundColor: '#52525b', // 分割线颜色
    marginVertical: 5, // 分割线上下的外边距
  },
});

export default HistoryItem;
