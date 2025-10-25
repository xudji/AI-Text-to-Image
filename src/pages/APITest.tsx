import { useState, useEffect } from 'react'
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
  Table,
  Tag,
  message
} from 'antd'
import { 
  ApiOutlined, 
  ExclamationCircleOutlined
} from '@ant-design/icons'
import { imageService } from '../api/imageService'

const { Content } = Layout
const { Title, Text } = Typography
const { TextArea } = Input
const { Option } = Select

const APITest = () => {
  const [prompt, setPrompt] = useState('一只可爱的小猫')
  const [size, setSize] = useState('1328*1328')
  const [model, setModel] = useState('qwen-image-plus')
  const [useFullAPI, setUseFullAPI] = useState(false)
  const [negativePrompt, setNegativePrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [testHistory, setTestHistory] = useState<any[]>([])

  // 表格列定义
  const columns = [
    {
      title: '状态',
      dataIndex: 'success',
      key: 'success',
      width: 80,
      render: (success: boolean) => (
        <Tag color={success ? 'success' : 'error'}>
          {success ? '成功' : '失败'}
        </Tag>
      )
    },
    {
      title: '响应数据',
      dataIndex: 'responseData',
      key: 'responseData',
      width: 400,
      ellipsis: true,
      render: (data: any) => {
        if (!data) return '-'
        
        // 直接展示JSON数据
        const jsonString = JSON.stringify(data, null, 2)
        return (
          <pre style={{
            margin: 0,
            padding: '4px 8px',
            fontSize: '12px',
            fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
            backgroundColor: '#f5f5f5',
            border: '1px solid #d9d9d9',
            borderRadius: '4px',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all',
            maxHeight: '100px',
            overflowY: 'auto',
            overflowX: 'auto'
          }}>
            {jsonString}
          </pre>
        )
      }
    },
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 150,
      render: (timestamp: string) => new Date(timestamp).toLocaleString()
    },
    {
      title: '提示词',
      dataIndex: 'prompt',
      key: 'prompt',
      width: 200,
      ellipsis: true,
      render: (text: string) => <span title={text}>{text}</span>
    },
    {
      title: '图片数量',
      dataIndex: 'imageCount',
      key: 'imageCount',
      width: 90,
      render: (count: number) => <span>{count} 张</span>
    },
    {
      title: '模式',
      dataIndex: 'type',
      key: 'type',
      width: 90,
      render: (type: string) => <Tag color={type === '简化模式' ? 'blue' : 'green'}>{type}</Tag>
    },
    {
      title: '模型',
      dataIndex: 'model',
      key: 'model',
      width: 120,
      render: (model: string) => <Tag>{model}</Tag>
    }
  ]

  // 加载测试历史记录
  useEffect(() => {
    const savedHistory = localStorage.getItem('apiTestHistory')
    if (savedHistory) {
      try {
        setTestHistory(JSON.parse(savedHistory))
      } catch (error) {
        console.error('加载测试历史失败:', error)
      }
    }
  }, [])

  // 保存测试历史记录
  const saveTestHistory = (testResult: any) => {
    const newHistory = [testResult, ...testHistory]
    setTestHistory(newHistory)
    localStorage.setItem('apiTestHistory', JSON.stringify(newHistory))
  }

  const handleTestSimpleAPI = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await imageService.generateImageSimple({
        prompt,
        size,
        model
      })
      
      // 显示成功消息
      message.success('API测试成功！')
      
      // 保存测试结果到历史记录
      const testResult = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        type: '简化模式',
        prompt,
        size,
        model,
        success: response.success,
        message: response.message,
        imageCount: response.imageUrls?.length || 0,
        requestId: response.requestId,
        generatedAt: response.generatedAt,
        responseData: response
      }
      saveTestHistory(testResult)
    } catch (err) {
      setError(err instanceof Error ? err.message : '测试失败')
    } finally {
      setLoading(false)
    }
  }

  const handleTestFullAPI = async () => {
    setLoading(true)
    setError(null)
    
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
      
      // 显示成功消息
      message.success('API测试成功！')
      
      // 保存测试结果到历史记录
      const testResult = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        type: '完整模式',
        prompt,
        size,
        model,
        success: response.success,
        message: response.message,
        imageCount: response.imageUrls?.length || 0,
        requestId: response.requestId,
        generatedAt: response.generatedAt,
        responseData: response
      }
      saveTestHistory(testResult)
    } catch (err) {
      setError(err instanceof Error ? err.message : '测试失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Content style={{ padding: '24px', minHeight: 'calc(100vh - 64px)', background: '#fafafa' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Title level={3} style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '4px'
          }}>
            <ApiOutlined /> API 接口测试
          </Title>
          <Text type="secondary" style={{ fontSize: '16px' }}>
            测试新的图像生成API接口
          </Text>
        </div>

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={8}>
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

          <Col xs={24} lg={16}>
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


              <div style={{ marginBottom: '16px' }}>
                <Table
                  columns={columns}
                  dataSource={testHistory}
                  rowKey="id"
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条记录`
                  }}
                  scroll={{ x: 800 }}
                  size="small"
                />
              </div>

            </Card>
          </Col>
        </Row>
      </div>
    </Content>
  )
}

export default APITest
