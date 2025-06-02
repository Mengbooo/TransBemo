import express from 'express';
import axios from 'axios';
import md5 from 'md5';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const router = express.Router();

// 从环境变量中获取 appid 和 appkey
const appid = process.env.APPID;
const appkey = process.env.APPKEY;

// 语音翻译接口
router.post("/translateSpeech", async (req, res) => {
  console.log("【调试】后端语音翻译 - 收到请求");
  console.log("【调试】后端语音翻译 - 请求方法:", req.method);
  console.log("【调试】后端语音翻译 - 请求URL:", req.originalUrl);
  console.log("【调试】后端语音翻译 - 请求头:", req.headers);
  
  try {
    // 从请求体中获取参数
    const { from, to, voice, format } = req.body;
    
    console.log("【调试】后端语音翻译 - 请求体参数:", { 
      from, 
      to, 
      format, 
      voiceLength: voice ? voice.length : 0,
      voiceBase64Prefix: voice ? voice.substring(0, 30) + '...' : 'undefined'
    });
    
    // 验证请求体参数
    if (!from || !to || !voice || !format) {
      console.error("【错误】后端语音翻译 - 参数验证失败:", { from, to, hasVoice: !!voice, format });
      return res.status(400).json({ 
        code: 10001, 
        msg: "必填参数为空或固定参数有误" 
      });
    }
    
    // 生成时间戳 - 使用秒级时间戳
    const timestamp = Math.floor(Date.now() / 1000).toString();
    console.log("【调试】后端语音翻译 - 时间戳:", timestamp);
    
    // 根据百度API文档计算签名
    // 签名计算方法：hmac_sha256(appid+timestamp+voice, appkey)，并进行base64编码
    console.log("【调试】后端语音翻译 - 签名计算参数:", { 
      appid, 
      timestamp, 
      voiceLength: voice.length ,
      type: typeof voice
    });
    
    // 拼接签名字符串
    const signStr = appid + timestamp + voice;
    
    // 使用hmac_sha256算法生成签名
    const hmac = crypto.createHmac('sha256', appkey);
    hmac.update(signStr);
    const sign = hmac.digest('base64');
    
    console.log("【调试】后端语音翻译 - 生成签名:", sign.substring(0, 20) + '...');
    
    // 设置百度API请求头
    const headers = {
      "Content-Type": "application/json",
      "X-Appid": appid,
      "X-Timestamp": timestamp,
      "X-Sign": sign
    };
    
    console.log("【调试】后端语音翻译 - 发送到百度API的请求头:", {
      "Content-Type": "application/json",
      "X-Appid": appid,
      "X-Timestamp": timestamp,
      "X-Sign": sign
    });
    
    // 构建请求体
    const requestBody = {
      from,
      to,
      voice,
      format
    };
    
    console.log("【调试】后端语音翻译 - 请求体:", { 
      from, 
      to, 
      format,
      voiceLength: voice.length
    });
    
    console.log("【调试】后端语音翻译 - 发送请求到百度API");
    console.log("【调试】后端语音翻译 - 请求URL: https://fanyi-api.baidu.com/api/trans/v2/voicetrans");
    
    // 调用百度API
    const startTime = Date.now();
    console.log("【调试】后端语音翻译 - 开始请求百度API, 时间:", new Date(startTime).toISOString());
    
    const response = await axios.post(
      "https://fanyi-api.baidu.com/api/trans/v2/voicetrans",
      requestBody,
      { headers }
    );
    
    const endTime = Date.now();
    console.log(`【调试】后端语音翻译 - 百度API请求耗时: ${endTime - startTime}ms`);
    console.log("【调试】后端语音翻译 - 百度API响应状态:", response.status);
    console.log("【调试】后端语音翻译 - 百度API响应头:", response.headers);
    console.log("【调试】后端语音翻译 - 百度API响应数据:", response.data);
    
    // 返回翻译结果
    res.json(response.data);
  } catch (error) {
    console.error("【错误】后端语音翻译请求出错:", error.message);
    
    // 如果有错误响应信息，则转发
    if (error.response && error.response.data) {
      console.error("【错误】后端语音翻译 - 百度API错误响应:", {
        status: error.response.status,
        headers: error.response.headers,
        data: error.response.data
      });
      return res.status(error.response.status).json(error.response.data);
    }
    
    // 通用错误处理
    res.status(500).json({ 
      code: 20200, 
      msg: "语音翻译请求失败",
      error: error.message
    });
  }
});

export default router; 