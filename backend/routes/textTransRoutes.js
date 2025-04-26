import express from 'express';
import axios from 'axios';
import md5 from 'md5';

const router = express.Router();

// 从环境变量中获取 appid 和 appkey
const appid = process.env.APPID;
const appkey = process.env.APPKEY;

router.post('/translate', async (req, res) => {
  try {
    const { q, from, to } = req.body;
    const salt = Date.now().toString();

    // 生成签名
    const signStr = appid + q + salt + appkey;
    const sign = md5(signStr).toLowerCase();

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
      if (key === 'q') {
        encodedParams.append(key, encodeURIComponent(value.toString()));
      } else {
        encodedParams.append(key, value.toString());
      }
    }

    // 调用百度翻译 API
    const response = await axios.post(
      'https://fanyi-api.baidu.com/api/trans/vip/translate',
      encodedParams.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('翻译请求出错:', error);
    res.status(500).json({ error: '翻译请求出错' });
  }
});

export default router;