import '../styles/globals.css';
import { ConfigProvider, theme } from 'antd';

export default function MyApp({ Component, pageProps }) {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#8b5cf6',
          borderRadius: 8,
        },
        components: {
          Card: {
            colorBgContainer: 'rgba(255, 255, 255, 0.15)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
            borderRadius: 16,
            border: '1px solid rgba(255, 255, 255, 0.18)',
          },
          Input: {
            colorBgContainer: 'rgba(255, 255, 255, 0.1)',
            colorBorder: 'rgba(255, 255, 255, 0.2)',
            colorText: '#fff',
            activeBorderColor: 'rgba(255, 255, 255, 0.3)',
            hoverBorderColor: 'rgba(255, 255, 255, 0.3)',
          },
          Button: {
            colorPrimary: 'rgba(255, 255, 255, 0.2)',
            colorPrimaryHover: 'rgba(255, 255, 255, 0.3)',
            colorPrimaryActive: 'rgba(255, 255, 255, 0.4)',
            colorTextLightSolid: '#fff',
            borderColor: 'rgba(255, 255, 255, 0.3)',
          },
          Typography: {
            colorText: '#fff',
          },
        },
      }}
    >
      <Component {...pageProps} />
    </ConfigProvider>
  );
} 