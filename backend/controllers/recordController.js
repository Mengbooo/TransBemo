import Record from '../models/record.js';

// 保存记录
const saveRecord = async (req, res) => {
  try {
    const record = new Record(req.body);
    await record.save();
    res.status(201).json(record);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 获取所有记录
const getRecords = async (req, res) => {
  try {
    const records = await Record.find();
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { saveRecord, getRecords };