import mongoose from 'mongoose';

const recordSchema = new mongoose.Schema({
  sourceLanguage: {
    type: String,
    required: true,
  },
  targetLanguage: {
    type: String,
    required: true,
  },
  inputText: {
    type: String,
    required: true,
  },
  outputText: {
    type: String,
    required: true,
  },
  methodType: {
    type: Date,
    default: Date.now,
  },
});

const Record = mongoose.model('Record', recordSchema);

export default Record;