import Record from '../models/recordModel.js';

// @desc    保存翻译记录
// @route   POST /api/records
// @access  Public
export const saveRecord = async (req, res) => {
  try {
    const { source, target, inputText, outputText, type, timestamp } = req.body;

    // 验证必填字段
    if (!source || !target || !inputText || !outputText || !type) {
      return res.status(400).json({ message: '请提供所有必填字段' });
    }

    // 创建新记录
    const record = new Record({
      source,
      target,
      inputText,
      outputText,
      type,
      timestamp: timestamp || Date.now(),
    });

    // 保存记录
    const savedRecord = await record.save();

    res.status(201).json(savedRecord);
  } catch (error) {
    console.error('保存翻译记录失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// @desc    获取所有翻译记录
// @route   GET /api/records
// @access  Public
export const getRecords = async (req, res) => {
  try {
    // 按时间戳降序排列，最新的记录在前
    const records = await Record.find({}).sort({ timestamp: -1 });
    res.json(records);
  } catch (error) {
    console.error('获取翻译记录失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// @desc    删除翻译记录
// @route   DELETE /api/records/:id
// @access  Public
export const deleteRecord = async (req, res) => {
  try {
    const record = await Record.findById(req.params.id);

    if (!record) {
      return res.status(404).json({ message: '记录不存在' });
    }

    await record.deleteOne();
    res.json({ message: '记录已删除' });
  } catch (error) {
    console.error('删除翻译记录失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// @desc    清空所有翻译记录
// @route   DELETE /api/records
// @access  Public
export const clearRecords = async (req, res) => {
  try {
    await Record.deleteMany({});
    res.json({ message: '所有记录已清空' });
  } catch (error) {
    console.error('清空翻译记录失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};