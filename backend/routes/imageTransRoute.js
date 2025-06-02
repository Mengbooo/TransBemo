import express from 'express';
import axios from 'axios';
import md5 from 'md5';
import dotenv from 'dotenv';
import multer from 'multer';
import fs from 'fs';

dotenv.config();

const router = express.Router();

// 从环境变量中获取 appid 和 appkey
const appid = process.env.APPID;
const appkey = process.env.APPKEY;

// 检查环境变量是否设置
if (!appid || !appkey) {
  console.error("APPID 或 APPKEY 未设置，请检查环境变量");
} else {
  console.log("【调试】后端图片翻译 - 环境变量已设置:", { 
    appid: appid ? '已设置' : '未设置', 
    appkey: appkey ? '已设置' : '未设置'
  });
}

// 配置multer用于处理文件上传
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 限制10MB
});

// 图像翻译接口
router.post("/translateImage", upload.single('image'), async (req, res) => {
  console.log("【调试】后端图片翻译 - 收到请求");
  
  try {
    // 从请求中获取参数
    const { from, to, paste } = req.body;
    const imageFile = req.file;
    
    console.log("【调试】后端图片翻译 - 请求体参数:", { from, to, paste });
    console.log("【调试】后端图片翻译 - 文件信息:", imageFile ? {
      fieldname: imageFile.fieldname,
      originalname: imageFile.originalname,
      mimetype: imageFile.mimetype,
      size: imageFile.size
    } : '未上传文件');
    
    // 验证请求参数
    if (!from || !to || !imageFile) {
      console.error("【错误】后端图片翻译 - 参数验证失败:", { from, to, hasImageFile: !!imageFile });
      return res.status(400).json({ 
        code: 10001, 
        msg: "必填参数为空或固定参数有误" 
      });
    }
    
    // 获取图片的base64编码
    const imageBase64 = imageFile.buffer.toString('base64');
    console.log("【调试】后端图片翻译 - Base64编码长度:", imageBase64.length);
    
    // 生成随机数作为salt
    const salt = Date.now().toString();
    
    // 生成签名
    const signStr = appid + imageBase64 + salt + appkey;
    const sign = md5(signStr).toLowerCase();
    console.log("【调试】后端图片翻译 - 生成签名:", sign.substring(0, 10) + '...');
    
    // 构建请求体
    const requestBody = {
      from,
      to,
      appid,
      salt,
      sign,
      cuid: "APICUID",
      mac: "mac",
      version: "3",
      paste: paste || "1", // 默认使用整图贴合
      image: imageBase64
    };
    
    console.log("【调试】后端图片翻译 - 请求体已构建:", {
      from,
      to,
      appid,
      salt,
      sign: sign.substring(0, 10) + '...',
      cuid: "APICUID",
      mac: "mac",
      version: "3",
      paste: paste || "1",
      imageLength: imageBase64.length
    });
    
    console.log("【调试】后端图片翻译 - 发送请求到百度API");
    
    // 调用百度API
    const response = await axios.post(
      "https://fanyi-api.baidu.com/api/trans/sdk/picture",
      requestBody,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        }
      }
    );
    
    console.log("【调试】后端图片翻译 - 百度API响应状态:", response.status);
    console.log("【调试】后端图片翻译 - 百度API响应数据:", response.data);
    
    // 返回翻译结果
    res.json(response.data);
  } catch (error) {
    console.error("【错误】后端图片翻译请求出错:", error.message);
    
    // 如果有错误响应信息，则转发
    if (error.response && error.response.data) {
      console.error("【错误】后端图片翻译 - 百度API错误响应:", {
        status: error.response.status,
        data: error.response.data
      });
      return res.status(error.response.status).json(error.response.data);
    }
    
    // 通用错误处理
    res.status(500).json({ 
      code: 20300, 
      msg: "图像翻译请求失败",
      error: error.message
    });
  }
});

export default router;
