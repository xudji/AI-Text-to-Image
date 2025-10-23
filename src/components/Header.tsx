import { Layout, Menu, Typography, Space } from 'antd'
import { Link, useLocation } from 'react-router-dom'
import { 
  RocketOutlined, 
  PictureOutlined, 
  ApiOutlined
} from '@ant-design/icons'

const { Header: AntHeader } = Layout
const { Title } = Typography

const Header = () => {
  const location = useLocation()
  
  const menuItems = [
    {
      key: '/generate',
      icon: <RocketOutlined />,
      label: <Link to="/generate">生成图片</Link>,
    },
    {
      key: '/gallery',
      icon: <PictureOutlined />,
      label: <Link to="/gallery">画廊</Link>,
    },
    {
      key: '/test',
      icon: <ApiOutlined />,
      label: <Link to="/test">API测试</Link>,
    },
  ]

  return (
    <AntHeader style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      padding: '0 24px',
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
    }}>
      <Link to="/generate" style={{ textDecoration: 'none' }}>
        <Space>
          <Title 
            level={3} 
            style={{ 
              margin: 0,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold'
            }}
          >
            🎨 AI Text to Image
          </Title>
        </Space>
      </Link>
      
      <Menu
        mode="horizontal"
        selectedKeys={[location.pathname]}
        items={menuItems}
        style={{ 
          background: 'transparent',
          border: 'none',
          minWidth: '400px',
          justifyContent: 'flex-end'
        }}
      />
    </AntHeader>
  )
}

export default Header
