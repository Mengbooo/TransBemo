import axios from 'axios';
import { HISTORY_API } from '../utils/apiConfig';

// 获取所有记录
export const getRecordsRequest = async () => {
  try {
    const response = await axios.get(HISTORY_API);
    return response.data;
  } catch (error) {
    console.error('获取记录失败:', error);
    throw error;
  }
};

// 保存记录
export const saveRecordRequest = async (record: {
  source: string;
  target: string;
  inputText: string;
  outputText: string;
  type: 'text' | 'image' | 'speech';
  timestamp?: number;
}) => {
  try {
    const response = await axios.post(HISTORY_API, record);
    return response.data;
  } catch (error) {
    console.error('保存记录失败:', error);
    throw error;
  }
};

// 删除记录
export const deleteRecordRequest = async (id: string) => {
  try {
    const response = await axios.delete(`${HISTORY_API}/${id}`);
    return response.data;
  } catch (error) {
    console.error('删除记录失败:', error);
    throw error;
  }
};

// 清空所有记录
export const clearRecordsRequest = async () => {
  try {
    const response = await axios.delete(HISTORY_API);
    return response.data;
  } catch (error) {
    console.error('清空记录失败:', error);
    throw error;
  }
}; 