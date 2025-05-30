const express = require('express');
const cors = require('cors');
// const connectDB = require('./config/db.js');
const recordRoutes = require('./routes/recordRoutes.js');
const textTransRoutes = require('./routes/textTransRoutes.js');
const speechTransRoutes = require('./routes/speechTransRoutes.js');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

dotenv.config();

const app = express();

// 连接数据库
// connectDB();

// 中间件
app.use(cors({
  origin: '*', // 允许所有来源
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// 路由
app.use('/api/records', recordRoutes);
app.use('/api', textTransRoutes);
app.use('/api/speech-trans', speechTransRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});module.exports = app;

