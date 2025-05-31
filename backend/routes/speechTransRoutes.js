import express from 'express';
import axios from 'axios';
import md5 from 'md5';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// 从环境变量中获取 appid 和 appkey
const appid = process.env.APPID;
const appkey = process.env.APPKEY;

// 检查环境变量是否设置
if (!appid || !appkey) {
  console.error("APPID 或 APPKEY 未设置，请检查环境变量");
}

// 语音识别和翻译相关路由
router.post('/recognize', async (req, res) => {
  try {
    // 这里是语音识别的处理逻辑
    // 待实现
    res.json({ message: '语音识别功能待实现' });
  } catch (error) {
    console.error('语音识别出错:', error);
    res.status(500).json({ error: '语音识别请求出错' });
  }
});

// 语音翻译接口
router.post("/translate", async (req, res) => {
  try {
    // 从请求体中获取参数
    const { from, to, voice, format } = req.body;
    
    // 请求头中的参数
    const timestamp = req.headers["x-timestamp"];
    const clientSign = req.headers["x-sign"];
    
    // 验证请求体参数
    if (!from || !to || !voice || !format) {
      return res.status(400).json({ 
        code: 10001, 
        msg: "必填参数为空或固定参数有误" 
      });
    }
    
    // 生成签名（在实际项目中应该再次验证请求签名）
    
    // 设置百度API请求头
    const headers = {
      "Content-Type": "application/json",
      "X-Appid": appid,
      "X-Timestamp": timestamp || Math.floor(Date.now() / 1000).toString(),
      "X-Sign": clientSign || "dummy-sign-for-testing"
    };
    
    // 构建请求体
    const requestBody = {
      from,
      to,
      voice,
      format
    };
    
    // 调用百度API
    const response = await axios.post(
      "https://fanyi-api.baidu.com/api/trans/v2/voicetrans",
      requestBody,
      { headers }
    );
    
    // 返回翻译结果
    res.json(response.data);
  } catch (error) {
    console.error("语音翻译请求出错:", error);
    
    // 如果有错误响应信息，则转发
    if (error.response && error.response.data) {
      return res.status(error.response.status).json(error.response.data);
    }
    
    // 通用错误处理
    res.status(500).json({ 
      code: 20200, 
      msg: "语音翻译请求失败" 
    });
  }
});

export default router; 