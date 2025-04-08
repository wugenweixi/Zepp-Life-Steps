import { useState } from 'react';
import axios from 'axios';
import { Form, Input, Button, message, Card, Typography, Space } from 'antd';
import { UserOutlined, LockOutlined, NumberOutlined } from '@ant-design/icons';

const { Text, Link, Title } = Typography;

export default function Home() {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/update-steps', values);
      if (response.data.success) {
        message.success('步数更新成功！');
      } else {
        message.error(response.data.message || '更新失败');
      }
    } catch (error) {
      message.error('请求失败：' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      maxWidth: 600, 
      margin: '40px auto', 
      padding: '0 20px',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }}>
      <Card className="glass-card" bordered={false}>
        <Title level={2} className="glass-title">小米运动步数修改</Title>
        <Form
          name="steps"
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            label="账号"
            name="account"
            rules={[{ required: true, message: '请输入账号' }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="请输入手机号或邮箱" 
              className="glass-input"
            />
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="请输入密码" 
              className="glass-input"
            />
          </Form.Item>

          <Form.Item
            label="步数"
            name="steps"
            rules={[{ required: true, message: '请输入步数' }]}
          >
            <Input 
              prefix={<NumberOutlined />} 
              type="number" 
              placeholder="请输入想要修改的步数" 
              className="glass-input"
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading} 
              block
              className="glass-button"
            >
              更新步数
            </Button>
          </Form.Item>
        </Form>
      </Card>
      
      <div className="glass-footer">
        <Text type="secondary">
          基于 <Link href="https://github.com/miloce/Zepp-Life-Steps" target="_blank">Zepp-Life-Steps</Link> 开发
        </Text>
      </div>
    </div>
  );
} 