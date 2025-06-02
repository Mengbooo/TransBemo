import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    // 尝试连接MongoDB
    console.log('正在连接MongoDB...');
    
    // 使用标准连接方法
    const conn = await mongoose.connect(process.env.MONGO_URI);
    
    console.log(`MongoDB 连接成功: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB 连接错误: ${error.message}`);
    console.error('请确保MongoDB服务已启动或连接字符串正确');
    process.exit(1);
  }
};

export default connectDB;