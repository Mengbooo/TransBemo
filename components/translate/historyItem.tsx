import React, { ReactNode } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

// 定义历史记录项的类型
type HistoryItemProps = {
  sourceLanguage: string;
  targetLanguage: string;
  inputText: string;
  outputText: string;
  translationMethod: ReactNode;
  timestamp?: number; // 添加可选的时间戳属性
  onDelete?: () => void; // 添加可选的删除回调
};

// 格式化时间戳
const formatTimestamp = (timestamp?: number): string => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  // 判断是今天、昨天还是更早
  if (date.toDateString() === today.toDateString()) {
    return `今天 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  } else if (date.toDateString() === yesterday.toDateString()) {
    return `昨天 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  } else {
    return `${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  }
};

const HistoryItem: React.FC<HistoryItemProps> = ({
  sourceLanguage,
  targetLanguage,
  inputText,
  outputText,
  translationMethod,
  timestamp,
  onDelete,
}) => {
  const formattedTime = formatTimestamp(timestamp);
  
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
      {timestamp && (
        <Text style={styles.timestamp}>{formattedTime}</Text>
      )}
      {onDelete && (
        <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
          <MaterialCommunityIcons name="delete" size={20} color="white" />
        </TouchableOpacity>
      )}
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
    width: "90%",
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
    width: '100%',
  },
  separator: {
    width: '100%', // 分割线宽度占满父容器
    height: 1, // 分割线高度
    backgroundColor: '#52525b', // 分割线颜色
    marginVertical: 5, // 分割线上下的外边距
  },
  timestamp: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  deleteButton: {
    position: 'absolute',
    top: 15,
    right: 10,
  },
});

export default HistoryItem;
