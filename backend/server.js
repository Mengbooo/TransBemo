import express from 'express';
import cors from 'cors';
// import connectDB from './config/db.js';
import recordRoutes from './routes/recordRoutes.js';
import textTransRoutes from './routes/textTransRoutes.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// 连接数据库
// connectDB();

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/records', recordRoutes);
app.use('/api', textTransRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});