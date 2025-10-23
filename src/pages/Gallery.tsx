import { useState, useEffect } from 'react'
import { Layout, Typography, Card, Row, Col, Empty, Button, Space, Tag, Image, Spin, Statistic, message, Modal } from 'antd'
import { Link } from 'react-router-dom'
import { 
  PictureOutlined, 
  RocketOutlined, 
  CalendarOutlined,
  DownloadOutlined,
  DeleteOutlined,
  ClearOutlined
} from '@ant-design/icons'
import { storageService, StoredImage } from '../services/storageService'
import { downloadService } from '../services/downloadService'

const { Content } = Layout
const { Title, Text } = Typography

const Gallery = () => {
  const [images, setImages] = useState<StoredImage[]>([])
  const [, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    thisWeek: 0
  })

  // 加载图片数据
  useEffect(() => {
    const loadImages = () => {
      try {
        const storedImages = storageService.getAllImages()
        setImages(storedImages)
        setStats(storageService.getStats())
        setLoading(false)
      } catch (error) {
        console.error('加载图片失败:', error)
        setLoading(false)
      }
    }

    loadImages()
  }, [])

  // 下载图片
  const handleDownload = async (image: StoredImage) => {
    try {
      const filename = downloadService.generateFilename(image.prompt, 0, image.model)
      await downloadService.downloadImage(image.url, filename)
      message.success('下载成功！')
    } catch (error) {
      message.error('下载失败，请重试')
    }
  }

  // 删除图片
  const handleDelete = (imageId: string) => {
    storageService.deleteImage(imageId)
    setImages(storageService.getAllImages())
    setStats(storageService.getStats())
    message.success('删除成功！')
  }

  // 清空所有图片
  const handleClearAll = () => {
    Modal.confirm({
      title: '确认清空所有图片',
      content: '此操作将删除所有已保存的图片，且无法恢复。确定要继续吗？',
      okText: '确定删除',
      cancelText: '取消',
      okType: 'danger',
      onOk() {
        storageService.clearAllImages()
        setImages([])
        setStats(storageService.getStats())
        message.success('已清空所有图片！')
      },
    })
  }

  return (
    <Content style={{ padding: '24px', minHeight: 'calc(100vh - 64px)', background: '#fafafa' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Title level={1} style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '16px'
          }}>
            <PictureOutlined /> 图片画廊
          </Title>
          <Text type="secondary" style={{ fontSize: '16px' }}>
            展示您生成的所有精美图片
          </Text>
        </div>

        {/* 统计信息 */}
        <Card style={{ marginBottom: '24px' }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={8}>
              <Statistic
                title="总图片数"
                value={stats.total}
                prefix={<PictureOutlined />}
              />
            </Col>
            <Col xs={24} sm={8}>
              <Statistic
                title="今日生成"
                value={stats.today}
                prefix={<CalendarOutlined />}
              />
            </Col>
            <Col xs={24} sm={8}>
              <Statistic
                title="本周生成"
                value={stats.thisWeek}
                prefix={<RocketOutlined />}
              />
            </Col>
          </Row>
        </Card>
        
        {images.length === 0 ? (
          <Card style={{ textAlign: 'center', padding: '48px' }}>
            <Empty
              image={<PictureOutlined style={{ fontSize: '64px', color: '#d9d9d9' }} />}
              description={
                <Space direction="vertical" size="middle">
                  <div>
                    <Text type="secondary" style={{ fontSize: '18px' }}>暂无图片</Text>
                  </div>
                  <div>
                    <Text type="secondary">开始生成您的第一张图片吧！</Text>
                  </div>
                  <Button 
                    type="primary" 
                    size="large" 
                    icon={<RocketOutlined />}
                    style={{ marginTop: '16px' }}
                  >
                    <Link to="/generate" style={{ color: 'inherit' }}>开始生成</Link>
                  </Button>
                </Space>
              }
            />
          </Card>
        ) : (
          <Card 
            title={
              <Space>
                <PictureOutlined />
                <span>我的作品</span>
                <Tag color="blue">{images.length} 张图片</Tag>
                <Button 
                  type="text" 
                  danger
                  icon={<ClearOutlined />} 
                  onClick={handleClearAll}
                  style={{ marginLeft: 'auto' }}
                >
                  清空所有
                </Button>
              </Space>
            }
            style={{
              maxHeight: 'calc(100vh - 200px)',
              display: 'flex',
              flexDirection: 'column'
            }}
            bodyStyle={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px'
            }}
            className="custom-scrollbar"
          >
            <Row gutter={[16, 16]}>
              {images.map((image: any, index: number) => (
                <Col xs={24} sm={12} md={8} lg={6} key={index}>
                  <Card
                    hoverable
                    cover={
                      <Image
                        src={image.url}
                        alt={image.prompt}
                        style={{ height: '200px', objectFit: 'cover' }}
                        placeholder={
                          <div style={{ 
                            height: '200px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            backgroundColor: '#f5f5f5'
                          }}>
                            <Spin />
                          </div>
                        }
                      />
                    }
                    actions={[
                      <Button 
                        key="download" 
                        type="text" 
                        icon={<DownloadOutlined />} 
                        title="下载图片"
                        onClick={() => handleDownload(image)}
                      />,
                      <Button 
                        key="delete" 
                        type="text" 
                        danger
                        icon={<DeleteOutlined />} 
                        title="删除图片"
                        onClick={() => handleDelete(image.id)}
                      />,
                    ]}
                    style={{ height: '100%' }}
                  >
                    <Card.Meta
                      title={
                        <Text ellipsis={{ tooltip: image.prompt }}>
                          {image.prompt}
                        </Text>
                      }
                      description={
                        <Space direction="vertical" size="small">
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            {image.width} × {image.height}
                          </Text>
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            <CalendarOutlined /> {new Date(image.createdAt).toLocaleString()}
                          </Text>
                        </Space>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        )}
      </div>
    </Content>
  )
}

export default Gallery
