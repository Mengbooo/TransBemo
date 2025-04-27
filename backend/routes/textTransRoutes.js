import express from "express";
import axios from "axios";
import md5 from "md5";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// 从环境变量中获取 appid 和 appkey
const appid = process.env.APPID;
const appkey = process.env.APPKEY;

console.log("appid:", appid);
console.log("appkey:", appkey);

// 检查环境变量是否设置
if (!appid || !appkey) {
  console.error("APPID 或 APPKEY 未设置，请检查环境变量");
}

router.post("/translateText", async (req, res) => {
  try {
    const { q, from, to } = req.body;

    // 验证请求体参数
    if (!q || !from || !to) {
      return res.status(400).json({ error: "请求体缺少必要参数: q, from, to" });
    }

    const salt = Date.now().toString();

    // 生成签名
    const signStr = appid + q + salt + appkey;
    const sign = md5(signStr).toLowerCase();

    // console.log("sign:", sign);
    // console.log("signStr:", signStr);

    // 构建请求参数
    const requestParams = {
      q,
      from,
      to,
      appid,
      salt,
      sign,
    };

    // 对 q 进行 URL 编码
    const encodedParams = new URLSearchParams();
    for (const [key, value] of Object.entries(requestParams)) {
      if (value !== undefined && value !== null) {
        encodedParams.append(key, value.toString());
      }
    }
    
    // console.log("q:", q);
    console.log("encodedParams:", encodedParams.toString());

    const translateURL =
      "https://fanyi-api.baidu.com/api/trans/vip/translate?" +
      encodedParams.toString();

    // console.log("translateURL:", translateURL);
    // 调用百度翻译 API
    const response = await axios.post(translateURL, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error("翻译请求出错:", error);
    res.status(500).json({ error: "翻译请求出错" });
  }
});

export default router;
