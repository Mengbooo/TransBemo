const axios = require('axios');
const crypto = require('crypto');

class SpeechTransController {
  static async translateSpeech(req, res) {
    console.log('收到语音翻译请求:', req.body);
    
    try {
      const { audioBase64, from, to } = req.body;

      // 验证输入
      if (!audioBase64 || !from || !to) {
        console.error('缺少必要参数', { audioBase64: !!audioBase64, from, to });
        return res.status(400).json({ 
          error: '缺少必要参数',
          details: { audioBase64: !!audioBase64, from, to }
        });
      }

      // 百度翻译API配置
      const appid = process.env.APPID;
      const secretKey = process.env.APPKEY;
      const timestamp = Math.floor(Date.now() / 1000).toString();

      // 生成签名
      const signString = appid + timestamp + audioBase64;
      const sign = crypto
        .createHmac('sha256', secretKey)
        .update(signString)
        .digest('base64');

      console.log('准备发送请求到百度翻译API', { from, to });

      // 发送请求到百度翻译API
      const response = await axios.post('https://fanyi-api.baidu.com/api/trans/v2/voicetrans', 
        {
          from,
          to,
          voice: audioBase64,
          format: 'pcm'
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Appid': appid,
            'X-Timestamp': timestamp,
            'X-Sign': sign
          }
        }
      );

      console.log('百度翻译API响应:', response.data);

      // 处理API响应
      if (response.data.code === 0) {
        res.json({
          source: response.data.data.source,
          target: response.data.data.target
        });
      } else {
        console.error('百度翻译API错误:', response.data);
        throw new Error(response.data.msg);
      }
    } catch (error) {
      console.error('语音翻译错误:', error);
      res.status(500).json({ 
        error: '语音翻译失败', 
        details: error.message,
        stack: error.stack
      });
    }
  }
}

module.exports = SpeechTransController;