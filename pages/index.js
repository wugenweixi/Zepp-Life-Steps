import { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Input, Button, message, Card, Typography, Space, Switch, Select, Slider, Tooltip, Divider, Row, Col, Modal, List, Tag, Spin } from 'antd';
import { UserOutlined, LockOutlined, NumberOutlined, SyncOutlined, HistoryOutlined, SettingOutlined, QuestionCircleOutlined, GithubOutlined, WechatOutlined, AlipayOutlined } from '@ant-design/icons';
import Head from 'next/head';

const { Text, Link, Title, Paragraph } = Typography;
const { Option } = Select;

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [form] = Form.useForm();
  const [platform, setPlatform] = useState('wechat');
  const [randomSteps, setRandomSteps] = useState(10000);

  // 从 localStorage 加载历史记录和主题设置
  useEffect(() => {
    const savedHistory = localStorage.getItem('stepsHistory');
    const savedTheme = localStorage.getItem('darkMode');
    const savedPlatform = localStorage.getItem('platform');
    
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
    
    if (savedTheme) {
      setDarkMode(savedTheme === 'true');
    }
    
    if (savedPlatform) {
      setPlatform(savedPlatform);
    }
  }, []);

  // 保存历史记录到 localStorage
  useEffect(() => {
    localStorage.setItem('stepsHistory', JSON.stringify(history));
  }, [history]);

  // 保存主题设置到 localStorage
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    document.body.className = darkMode ? 'dark-mode' : '';
  }, [darkMode]);

  // 保存平台选择到 localStorage
  useEffect(() => {
    localStorage.setItem('platform', platform);
  }, [platform]);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/update-steps', {
        ...values,
        platform
      });
      
      if (response.data.success) {
        message.success('步数更新成功！');
        
        // 添加到历史记录
        const newHistoryItem = {
          id: Date.now(),
          account: values.account,
          steps: values.steps,
          platform,
          date: new Date().toLocaleString()
        };
        
        setHistory([newHistoryItem, ...history]);
      } else {
        message.error(response.data.message || '更新失败');
      }
    } catch (error) {
      message.error('请求失败：' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const generateRandomSteps = () => {
    const min = 5000;
    const max = 50000;
    const random = Math.floor(Math.random() * (max - min + 1)) + min;
    setRandomSteps(random);
    form.setFieldsValue({ steps: random });
  };

  const clearHistory = () => {
    Modal.confirm({
      title: '确认清空历史记录',
      content: '确定要清空所有历史记录吗？此操作不可恢复。',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        setHistory([]);
        message.success('历史记录已清空');
      }
    });
  };

  const deleteHistoryItem = (id) => {
    setHistory(history.filter(item => item.id !== id));
    message.success('记录已删除');
  };

  return (
    <>
      <Head>
        <title>Zepp Life 步数修改工具</title>
        <meta name="description" content="修改 Zepp Life 步数并同步到微信、支付宝运动" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className={`app-container ${darkMode ? 'dark-mode' : ''}`}>
        <div className="content-wrapper">
          <Card className="glass-card" bordered={false}>
            <div className="card-header">
              <Title level={2} className="glass-title">Zepp Life 步数修改</Title>
              <div className="header-actions">
                <Tooltip title="切换暗黑模式">
                  <Switch 
                    checked={darkMode} 
                    onChange={setDarkMode} 
                    checkedChildren="🌙" 
                    unCheckedChildren="☀️" 
                  />
                </Tooltip>
                <Tooltip title="查看历史记录">
                  <Button 
                    icon={<HistoryOutlined />} 
                    onClick={() => setShowHistory(true)}
                    shape="circle"
                  />
                </Tooltip>
                <Tooltip title="项目源码">
                  <Button 
                    icon={<GithubOutlined />} 
                    href="https://github.com/miloce/Zepp-Life-Steps" 
                    target="_blank"
                    shape="circle"
                  />
                </Tooltip>
              </div>
            </div>
            
            <Form
              form={form}
              name="steps"
              onFinish={onFinish}
              layout="vertical"
              size="large"
              initialValues={{ steps: randomSteps }}
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
                label="同步平台"
                name="platform"
                initialValue={platform}
              >
                <Select 
                  onChange={setPlatform}
                  className="glass-select"
                >
                  <Option value="wechat">
                    <Space>
                      <WechatOutlined style={{ color: '#07C160' }} />
                      微信运动
                    </Space>
                  </Option>
                  <Option value="alipay">
                    <Space>
                      <AlipayOutlined style={{ color: '#1677FF' }} />
                      支付宝运动
                    </Space>
                  </Option>
                </Select>
              </Form.Item>

              <Form.Item
                label={
                  <Space>
                    步数
                    <Tooltip title="建议步数范围：5000-50000">
                      <QuestionCircleOutlined />
                    </Tooltip>
                  </Space>
                }
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
                <Slider 
                  min={1000} 
                  max={100000} 
                  value={randomSteps} 
                  onChange={setRandomSteps}
                  tooltip={{ formatter: value => `${value} 步` }}
                  className="steps-slider"
                />
              </Form.Item>

              <Form.Item>
                <Row gutter={16}>
                  <Col span={12}>
                    <Button 
                      icon={<SyncOutlined />}
                      onClick={generateRandomSteps}
                      block
                      className="random-button"
                    >
                      随机步数
                    </Button>
                  </Col>
                  <Col span={12}>
                    <Button 
                      type="primary" 
                      htmlType="submit" 
                      loading={loading} 
                      block
                      className="submit-button"
                    >
                      更新步数
                    </Button>
                  </Col>
                </Row>
              </Form.Item>
            </Form>
            
            <Divider />
            
            <div className="tips-section">
              <Title level={4}>使用说明</Title>
              <Paragraph>
                1. 下载并注册 Zepp Life（原小米运动）应用
              </Paragraph>
              <Paragraph>
                2. 在微信/支付宝中启用运动功能
              </Paragraph>
              <Paragraph>
                3. 在 Zepp Life 中将账户与微信/支付宝运动绑定
              </Paragraph>
              <Paragraph>
                4. 输入账号密码和想要修改的步数，点击更新
              </Paragraph>
            </div>
          </Card>
          
          <div className="glass-footer">
            <Text type="secondary">
              基于 <Link href="https://github.com/miloce/Zepp-Life-Steps" target="_blank">Zepp-Life-Steps</Link> 开发
            </Text>
          </div>
        </div>
      </div>

      <Modal
        title="历史记录"
        visible={showHistory}
        onCancel={() => setShowHistory(false)}
        footer={[
          <Button key="clear" danger onClick={clearHistory}>
            清空记录
          </Button>,
          <Button key="close" onClick={() => setShowHistory(false)}>
            关闭
          </Button>
        ]}
        width={700}
      >
        {history.length === 0 ? (
          <div className="empty-history">
            <Text type="secondary">暂无历史记录</Text>
          </div>
        ) : (
          <List
            dataSource={history}
            renderItem={item => (
              <List.Item
                actions={[
                  <Button 
                    type="text" 
                    danger 
                    onClick={() => deleteHistoryItem(item.id)}
                  >
                    删除
                  </Button>
                ]}
              >
                <List.Item.Meta
                  title={`账号: ${item.account}`}
                  description={`时间: ${item.date}`}
                />
                <div>
                  <Tag color={item.platform === 'wechat' ? 'green' : 'blue'}>
                    {item.platform === 'wechat' ? '微信运动' : '支付宝运动'}
                  </Tag>
                  <Tag color="purple">{item.steps} 步</Tag>
                </div>
              </List.Item>
            )}
          />
        )}
      </Modal>
    </>
  );
} 