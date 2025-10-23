import { useState } from 'react'
import { 
  Layout, 
  Card, 
  Button, 
  Input, 
  Select, 
  Row, 
  Col, 
  Typography, 
  Space, 
  Alert,
  Divider,
  Tag
} from 'antd'
import { 
  ApiOutlined, 
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons'
import { imageService } from '../api/imageService'

const { Content } = Layout
const { Title, Text, Paragraph } = Typography
const { TextArea } = Input
const { Option } = Select

const APITest = () => {
  const [prompt, setPrompt] = useState('一只可爱的小猫')
  const [size, setSize] = useState('1328*1328')
  const [model, setModel] = useState('qwen-image-plus')
  const [useFullAPI, setUseFullAPI] = useState(false)
  const [negativePrompt, setNegativePrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleTestSimpleAPI = async () => {
    setLoading(true)
    setError(null)
    setResult(null)
    
    try {
      const response = await imageService.generateImageSimple({
        prompt,
        size,
        model
      })
      setResult(response)
    } catch (err) {
      setError(err instanceof Error ? err.message : '测试失败')
    } finally {
      setLoading(false)
    }
  }

  const handleTestFullAPI = async () => {
    setLoading(true)
    setError(null)
    setResult(null)
    
    try {
      const response = await imageService.generateImageFull({
        model,
        input: {
          messages: [
            {
              role: 'user',
              content: [
                {
                  text: prompt
                }
              ]
            }
          ]
        },
        parameters: {
          negative_prompt: negativePrompt,
          size,
          n: 1,
          prompt_extend: true,
          watermark: false
        }
      })
      setResult(response)
    } catch (err) {
      setError(err instanceof Error ? err.message : '测试失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Content style={{ padding: '24px', minHeight: 'calc(100vh - 64px)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Title level={1} style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '16px'
          }}>
            <ApiOutlined /> API 接口测试
          </Title>
          <Text type="secondary" style={{ fontSize: '16px' }}>
            测试新的图像生成API接口
          </Text>
        </div>

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={12}>
            <Card title="测试参数">
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <div>
                  <Text strong>提示词</Text>
                  <TextArea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="输入图片描述"
                    rows={3}
                  />
                </div>

                <div>
                  <Text strong>图片尺寸</Text>
                  <Select
                    value={size}
                    onChange={(value) => setSize(value)}
                    style={{ width: '100%' }}
                  >
                    <Option value="1024*1024">1024×1024</Option>
                    <Option value="1328*1328">1328×1328</Option>
                    <Option value="1536*1536">1536×1536</Option>
                    <Option value="2048*2048">2048×2048</Option>
                  </Select>
                </div>

                <div>
                  <Text strong>AI模型</Text>
                  <Select
                    value={model}
                    onChange={(value) => setModel(value)}
                    style={{ width: '100%' }}
                  >
                    <Option value="qwen-image-plus">Qwen Image Plus (推荐)</Option>
                    <Option value="qwen-image">Qwen Image</Option>
                  </Select>
                </div>

                <div>
                  <Text strong>API模式</Text>
                  <Select
                    value={useFullAPI}
                    onChange={(value) => setUseFullAPI(value)}
                    style={{ width: '100%' }}
                  >
                    <Option value={false}>简化模式</Option>
                    <Option value={true}>完整模式</Option>
                  </Select>
                </div>

                {useFullAPI && (
                  <div>
                    <Text strong>负面提示词</Text>
                    <TextArea
                      value={negativePrompt}
                      onChange={(e) => setNegativePrompt(e.target.value)}
                      placeholder="描述不想要的内容"
                      rows={2}
                    />
                  </div>
                )}

                <Divider />

                <Space>
                  <Button
                    type="primary"
                    onClick={handleTestSimpleAPI}
                    loading={loading && !useFullAPI}
                    disabled={useFullAPI}
                  >
                    测试简化API
                  </Button>
                  <Button
                    type="primary"
                    onClick={handleTestFullAPI}
                    loading={loading && useFullAPI}
                    disabled={!useFullAPI}
                  >
                    测试完整API
                  </Button>
                </Space>
              </Space>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card title="测试结果">
              {error && (
                <Alert
                  message="测试失败"
                  description={error}
                  type="error"
                  icon={<ExclamationCircleOutlined />}
                  showIcon
                  style={{ marginBottom: '16px' }}
                />
              )}

              {result && (
                <Alert
                  message="测试成功"
                  description="API调用成功"
                  type="success"
                  icon={<CheckCircleOutlined />}
                  showIcon
                  style={{ marginBottom: '16px' }}
                />
              )}

              {result && (
                <div>
                  <Title level={4}>响应数据</Title>
                  <Card size="small" style={{ backgroundColor: '#f5f5f5' }}>
                    <pre style={{ whiteSpace: 'pre-wrap', fontSize: '12px' }}>
                      {JSON.stringify(result, null, 2)}
                    </pre>
                  </Card>

                  {result.imageUrls && result.imageUrls.length > 0 && (
                    <div style={{ marginTop: '16px' }}>
                      <Title level={4}>生成的图片</Title>
                      <Row gutter={[8, 8]}>
                        {result.imageUrls.map((url: string, index: number) => (
                          <Col span={12} key={index}>
                            <Card size="small" hoverable>
                              <img
                                src={url}
                                alt={`Generated ${index + 1}`}
                                style={{ width: '100%', height: '120px', objectFit: 'cover' }}
                              />
                              <div style={{ textAlign: 'center', marginTop: '8px' }}>
                                <Tag color="blue">图片 {index + 1}</Tag>
                              </div>
                            </Card>
                          </Col>
                        ))}
                      </Row>
                    </div>
                  )}
                </div>
              )}
            </Card>
          </Col>
        </Row>
      </div>
    </Content>
  )
}

export default APITest
