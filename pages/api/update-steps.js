import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: '方法不允许' });
  }

  const { account, password, steps, platform = 'wechat' } = req.body;

  if (!account || !password || !steps) {
    return res.status(400).json({ success: false, message: '缺少必要参数' });
  }

  try {
    // 验证步数范围
    const stepsNum = parseInt(steps);
    if (isNaN(stepsNum) || stepsNum < 1000 || stepsNum > 100000) {
      return res.status(400).json({ 
        success: false, 
        message: '步数必须在 1000-100000 之间' 
      });
    }

    // 调用 Zepp Life API 更新步数
    const response = await axios.post('https://api.zepp-life.com/v1/sport/upload', {
      account,
      password,
      steps: stepsNum,
      platform
    }, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Zepp-Life-Steps/1.0'
      }
    });

    if (response.data && response.data.success) {
      return res.status(200).json({ 
        success: true, 
        message: '步数更新成功',
        data: {
          steps: stepsNum,
          platform,
          timestamp: new Date().toISOString()
        }
      });
    } else {
      return res.status(500).json({ 
        success: false, 
        message: response.data?.message || '更新失败，请检查账号密码是否正确' 
      });
    }
  } catch (error) {
    console.error('步数更新错误:', error);
    
    // 处理特定错误
    if (error.response) {
      // 服务器响应了，但状态码不在 2xx 范围内
      const status = error.response.status;
      let message = '更新失败';
      
      if (status === 401) {
        message = '账号或密码错误';
      } else if (status === 429) {
        message = '请求过于频繁，请稍后再试';
      } else if (status === 500) {
        message = '服务器内部错误，请稍后再试';
      }
      
      return res.status(status).json({ success: false, message });
    } else if (error.request) {
      // 请求已发出，但没有收到响应
      return res.status(503).json({ 
        success: false, 
        message: '无法连接到服务器，请检查网络连接' 
      });
    } else {
      // 设置请求时发生错误
      return res.status(500).json({ 
        success: false, 
        message: '请求处理过程中发生错误' 
      });
    }
  }
} 