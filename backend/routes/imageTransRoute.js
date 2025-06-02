import express from 'express';
import axios from 'axios';
import md5 from 'md5';
import dotenv from 'dotenv';
import multer from 'multer';
import fs from 'fs';
import FormData from 'form-data';

dotenv.config();

const router = express.Router();

// 从环境变量中获取 appid 和 appkey
const appid = process.env.APPID;
const appkey = process.env.APPKEY;

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
    
    console.log("【调试】后端图片翻译 - 请求参数:", { 
      from, 
      to, 
      paste,
      imageSize: imageFile ? `${(imageFile.size / 1024).toFixed(2)}KB` : '无图片'
    });
    
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
    console.log("【调试】后端图片翻译 - 图片Base64长度:", imageBase64.length);
    
    // 生成随机数作为salt
    const salt = Date.now().toString();
    
    // 根据文档，签名规则：sign = md5(appid+md5(image)+salt+cuid+mac+密钥)
    const cuid = "APICUID";
    const mac = "mac";
    
    // 先计算图片的md5 - 使用原始图片数据，不加任何编码
    const imageMd5 = md5(imageFile.buffer);
    console.log("【调试】后端图片翻译 - 图片MD5:", imageMd5);
    
    // 然后计算最终签名
    const signStr = appid + imageMd5 + salt + cuid + mac + appkey;
    const sign = md5(signStr).toLowerCase();
    console.log("【调试】后端图片翻译 - 签名生成:", { 
      appid, 
      imageMd5: imageMd5.substring(0, 10) + '...', 
      salt, 
      sign: sign.substring(0, 10) + '...' 
    });
    
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
    
    console.log("【调试】后端图片翻译 - 发送请求到百度API:", {
      from,
      to,
      appid,
      salt: salt.substring(0, 5) + '...',
      sign: sign.substring(0, 10) + '...',
      cuid: "APICUID",
      mac: "mac",
      version: "3",
      paste: paste || "1",
      imageSize: `${(imageFile.size / 1024).toFixed(2)}KB`
    });
    
    // 调用百度API
    const startTime = Date.now();
    
    // 创建FormData对象用于multipart/form-data格式
    const formData = new FormData();
    
    // 添加所有参数
    formData.append('from', from);
    formData.append('to', to);
    formData.append('appid', appid);
    formData.append('salt', salt);
    formData.append('sign', sign);
    formData.append('cuid', 'APICUID');
    formData.append('mac', 'mac');
    formData.append('version', '3');
    formData.append('paste', paste || '1');
    
    // 添加图片数据
    // 直接使用原始的Buffer对象
    formData.append('image', imageFile.buffer, {
      filename: 'image.jpg',
      contentType: 'image/jpeg'
    });
    
    console.log("【调试】后端图片翻译 - 请求体已格式化为FormData");
    
    const response = await axios.post(
      "https://fanyi-api.baidu.com/api/trans/sdk/picture",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      }
    );
    const endTime = Date.now();
    
    console.log(`【调试】后端图片翻译 - 百度API请求耗时: ${endTime - startTime}ms`);
    console.log("【调试】后端图片翻译 - 百度API响应状态:", response.status);
    
    if (response.data && response.data.error_code === "0") {
      console.log("【调试】后端图片翻译 - 翻译成功:", {
        sumSrcLength: response.data.data.sumSrc?.length || 0,
        sumDstLength: response.data.data.sumDst?.length || 0,
        hasPasteImg: !!response.data.data.pasteImg
      });
    } else {
      console.error("【错误】后端图片翻译 - 百度API返回错误:", {
        error_code: response.data.error_code,
        error_msg: response.data.error_msg
      });
    }
    
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

// 处理base64格式图片的翻译接口
router.post("/translateImage/base64", async (req, res) => {
  console.log("【调试】后端图片翻译(Base64) - 收到请求");
  
  try {
    // 从请求中获取参数
    const { from, to, paste, image_base64 } = req.body;
    
    console.log("【调试】后端图片翻译(Base64) - 请求参数:", { 
      from, 
      to, 
      paste,
      base64Length: image_base64 ? image_base64.length : 0
    });
    
    // 验证请求参数
    if (!from || !to || !image_base64) {
      console.error("【错误】后端图片翻译(Base64) - 参数验证失败:", { 
        from, 
        to, 
        hasBase64: !!image_base64 
      });
      return res.status(400).json({ 
        code: 10001, 
        msg: "必填参数为空或固定参数有误" 
      });
    }
    
    // 生成随机数作为salt
    const salt = Date.now().toString();
    
    // 根据文档，签名规则：sign = md5(appid+md5(image)+salt+cuid+mac+密钥)
    const cuid = "APICUID";
    const mac = "mac";
    
    // 先将base64转换为Buffer，再计算md5
    const imageBuffer = Buffer.from(image_base64, 'base64');
    console.log("【调试】后端图片翻译(Base64) - 图片Buffer:", imageBuffer);
    const imageMd5 = md5(imageBuffer);
    console.log("【调试】后端图片翻译(Base64) - 图片MD5:", imageMd5);
    
    // 然后计算最终签名
    const signStr = appid + imageMd5 + salt + cuid + mac + appkey;
    const sign = md5(signStr).toLowerCase();
    console.log("【调试】后端图片翻译(Base64) - 签名生成:", { 
      appid, 
      imageMd5: imageMd5.substring(0, 10) + '...', 
      salt, 
      sign: sign.substring(0, 10) + '...' 
    });
    
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
      image: image_base64
    };
    
    console.log("【调试】后端图片翻译(Base64) - 发送请求到百度API:", {
      from,
      to,
      appid,
      salt: salt.substring(0, 5) + '...',
      sign: sign.substring(0, 10) + '...',
      cuid: "APICUID",
      mac: "mac",
      version: "3",
      paste: paste || "1",
      base64Length: image_base64.length
    });
    
    // 调用百度API
    const startTime = Date.now();
    
    // 创建FormData对象用于multipart/form-data格式
    const formData = new FormData();
    
    // 添加所有参数
    formData.append('from', from);
    formData.append('to', to);
    formData.append('appid', appid);
    formData.append('salt', salt);
    formData.append('sign', sign);
    formData.append('cuid', 'APICUID');
    formData.append('mac', 'mac');
    formData.append('version', '3');
    formData.append('paste', paste || '1');
    
    // 添加图片数据
    // 使用之前创建的Buffer
    formData.append('image', imageBuffer, {
      filename: 'image.jpg',
      contentType: 'image/jpeg'
    });
    
    console.log("【调试】后端图片翻译(Base64) - 请求体已格式化为FormData");
    
    const response = await axios.post(
      "https://fanyi-api.baidu.com/api/trans/sdk/picture",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      }
    );
    const endTime = Date.now();
    
    console.log(`【调试】后端图片翻译(Base64) - 百度API请求耗时: ${endTime - startTime}ms`);
    console.log("【调试】后端图片翻译(Base64) - 百度API响应状态:", response.status);
    
    if (response.data && response.data.error_code === "0") {
      console.log("【调试】后端图片翻译(Base64) - 翻译成功:", {
        sumSrcLength: response.data.data.sumSrc?.length || 0,
        sumDstLength: response.data.data.sumDst?.length || 0,
        hasPasteImg: !!response.data.data.pasteImg
      });
    } else {
      console.error("【错误】后端图片翻译(Base64) - 百度API返回错误:", {
        error_code: response.data.error_code,
        error_msg: response.data.error_msg
      });
    }
    
    // 返回翻译结果
    res.json(response.data);
  } catch (error) {
    console.error("【错误】后端图片翻译(Base64)请求出错:", error.message);
    
    // 如果有错误响应信息，则转发
    if (error.response && error.response.data) {
      console.error("【错误】后端图片翻译(Base64) - 百度API错误响应:", {
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
