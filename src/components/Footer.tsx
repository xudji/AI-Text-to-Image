import { Layout, Typography, Space } from 'antd'
import { HeartOutlined } from '@ant-design/icons'

const { Footer: AntFooter } = Layout
const { Text } = Typography

const Footer = () => {
  return (
    <AntFooter style={{ 
      textAlign: 'center', 
      background: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      padding: '24px 0'
    }}>
      <Space direction="vertical" size="small">
        <Text style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
          Made with <HeartOutlined style={{ color: '#ff4d4f' }} /> by AI Text to Image
        </Text>
        <Text style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px' }}>
          © 2025 AI Text to Image. All rights reserved.
        </Text>
      </Space>
    </AntFooter>
  )
}

export default Footer
