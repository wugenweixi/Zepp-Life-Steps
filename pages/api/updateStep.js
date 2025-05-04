import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: '仅支持 GET 请求' });
  }

  const { account, password, steps } = req.query;

  // 检查必要参数
  if (!account || !password || !steps) {
    return res.status(400).json({ success: false, message: '缺少必要参数' });
  }

  try {
    // 模拟调用第三方接口更新步数
    const values = {
        account: account,
        password: password,
        steps: steps
      };
    const response = await axios.post('/api/update-steps', values);

    if (response.data.success) {
      return res.status(200).json({ success: true, message: '步数更新成功' });
    } else {
      return res.status(500).json({ success: false, message: '步数更新失败' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }

}
