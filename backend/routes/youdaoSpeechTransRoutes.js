import express from 'express';
import axios from 'axios';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const router = express.Router();

// 从环境变量中获取有道API的应用ID和密钥
const appKey = process.env.YOUDAO_APPKEY;
const appSecret = process.env.YOUDAO_SECRET;

// 有道语音翻译接口
router.post("/youdaoTranslateSpeech", async (req, res) => {
  console.log("【调试】后端有道语音翻译 - 收到请求");
  console.log("【调试】后端有道语音翻译 - 请求方法:", req.method);
  console.log("【调试】后端有道语音翻译 - 请求URL:", req.originalUrl);
  console.log("【调试】后端有道语音翻译 - 请求头:", req.headers);
  
  try {
    // 从请求体中获取参数
    const { from, to, voice, format } = req.body;
    
    console.log("【调试】后端有道语音翻译 - 请求体参数:", { 
      from, 
      to, 
      format, 
      voiceLength: voice ? voice.length : 0,
      voiceBase64Prefix: voice ? voice.substring(0, 30) + '...' : 'undefined'
    });
    
    // 验证请求体参数
    if (!from || !to || !voice || !format) {
      console.error("【错误】后端有道语音翻译 - 参数验证失败:", { from, to, hasVoice: !!voice, format });
      return res.status(400).json({ 
        errorCode: "101", 
        msg: "必填参数为空" 
      });
    }
    
    // 验证环境变量
    if (!appKey || !appSecret) {
      console.error("【错误】后端有道语音翻译 - 缺少API密钥配置");
      return res.status(500).json({
        errorCode: "108",
        msg: "应用ID或密钥未配置"
      });
    }
    
    // 生成盐值(UUID)
    const salt = uuidv4();
    console.log("【调试】后端有道语音翻译 - 盐值:", salt);
    
    // 生成当前时间戳，单位秒
    const curtime = Math.floor(Date.now() / 1000).toString();
    console.log("【调试】后端有道语音翻译 - 时间戳:", curtime);
    
    // 计算input值
    let input = '';
    if (voice.length <= 20) {
      input = voice;
    } else {
      input = voice.substring(0, 10) + voice.length + voice.substring(voice.length - 10);
    }
    
    // 计算签名
    // sign=sha256(应用ID+input+salt+curtime+应用密钥)
    const signStr = appKey + input + salt + curtime + appSecret;
    const sign = crypto.createHash('sha256').update(signStr).digest('hex');
    
    console.log("【调试】后端有道语音翻译 - 生成签名:", sign.substring(0, 20) + '...');
    
    // 构建请求体
    const requestBody = {
      q: voice,  // 注意：这里是q而不是voice
      from: from,
      to: to,
      appKey: appKey,
      salt: salt,
      sign: sign,
      signType: 'v3',
      curtime: curtime,
      format: format,
      rate: 16000,
      channel: 1,
      type: 1,
      ext: 'mp3',
      version: 'v1'
    };
    
    console.log("【调试】后端有道语音翻译 - 请求体:", { 
      from, 
      to, 
      format,
      appKey,
      salt,
      signType: 'v3',
      curtime,
      rate: 16000,
      channel: 1,
      type: 1,
      ext: 'mp3',
      version: 'v1'
    });
    
    console.log("【调试】后端有道语音翻译 - 发送请求到有道API");
    console.log("【调试】后端有道语音翻译 - 请求URL: https://openapi.youdao.com/speechtransapi");
    
    // 调用有道API
    const startTime = Date.now();
    console.log("【调试】后端有道语音翻译 - 开始请求有道API, 时间:", new Date(startTime).toISOString());
    
    const response = await axios.post(
      "https://openapi.youdao.com/speechtransapi",
      requestBody,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    
    const endTime = Date.now();
    console.log(`【调试】后端有道语音翻译 - 有道API请求耗时: ${endTime - startTime}ms`);
    console.log("【调试】后端有道语音翻译 - 有道API响应状态:", response.status);
    console.log("【调试】后端有道语音翻译 - 有道API响应头:", response.headers);
    console.log("【调试】后端有道语音翻译 - 有道API响应数据:", response.data);
    
    // 返回翻译结果
    res.json(response.data);
  } catch (error) {
    console.error("【错误】后端有道语音翻译请求出错:", error.message);
    
    // 如果有错误响应信息，则转发
    if (error.response && error.response.data) {
      console.error("【错误】后端有道语音翻译 - 有道API错误响应:", {
        status: error.response.status,
        headers: error.response.headers,
        data: error.response.data
      });
      return res.status(error.response.status).json(error.response.data);
    }
    
    // 通用错误处理
    res.status(500).json({ 
      errorCode: "303", 
      msg: "语音翻译请求失败",
      error: error.message
    });
  }
});

export default router; 