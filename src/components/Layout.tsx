import { ReactNode } from 'react'
import { Layout as AntLayout, Typography } from 'antd'
import Header from './Header'
import Footer from './Footer'

const { Content } = AntLayout
const { Text } = Typography

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <AntLayout style={{ minHeight: '100vh', background: 'transparent' }}>
      <Header />
      <Content style={{ background: 'transparent' }}>
        {children}
      </Content>
      <Footer />
    </AntLayout>
  )
}

export default Layout
