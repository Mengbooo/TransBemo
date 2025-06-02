import mongoose from 'mongoose';

const recordSchema = mongoose.Schema(
  {
    source: {
      type: String,
      required: true,
    },
    target: {
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
    type: {
      type: String,
      enum: ['text', 'image', 'speech'],
      required: true,
    },
    timestamp: {
      type: Number,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Record = mongoose.model('Record', recordSchema);

export default Record; 