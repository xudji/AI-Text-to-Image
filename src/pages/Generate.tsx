import { useState, useEffect } from 'react'
import { 
  Layout, 
  Card, 
  Input, 
  Button, 
  Select, 
  Row, 
  Col, 
  Typography, 
  Space, 
  Spin, 
  Alert,
  Image,
  Tag
} from 'antd'
import { 
  RocketOutlined, 
  PictureOutlined, 
  SettingOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  DownloadOutlined,
} from '@ant-design/icons'
import { imageService, GenerateImageSimpleRequest, GenerateImageRequest } from '../api/imageService'
import { GenerationResult } from '../types'
import { downloadService } from '../services/downloadService'
import { sessionService, SessionFormData } from '../services/sessionService'
import { storageService, StoredImage } from '../services/storageService'

const { TextArea } = Input
const { Text } = Typography
const { Option } = Select

const Generate = () => {
  const [prompt, setPrompt] = useState('')
  const [size, setSize] = useState('1328*1328')
  const [model, setModel] = useState('qwen-image-plus')
  const [useFullAPI, setUseFullAPI] = useState(false)
  const [negativePrompt, setNegativePrompt] = useState('')
  const [watermark, setWatermark] = useState(false)
  const [promptExtend, setPromptExtend] = useState(true)
  const [generationResult, setGenerationResult] = useState<GenerationResult>({
    status: 'idle',
    images: [],
  })
  const [allImages, setAllImages] = useState<StoredImage[]>([])

  // 页面加载时恢复保存的数据
  useEffect(() => {
    const savedResult = sessionService.getGenerationResult()
    const savedFormData = sessionService.getFormData()

    if (savedResult) {
      console.log('恢复生成结果:', savedResult)
      setGenerationResult(savedResult)
    }

    if (savedFormData) {
      console.log('恢复表单数据:', savedFormData)
      setPrompt(savedFormData.prompt)
      setSize(savedFormData.size)
      setModel(savedFormData.model)
      setUseFullAPI(savedFormData.useFullAPI)
      setNegativePrompt(savedFormData.negativePrompt)
      setWatermark(savedFormData.watermark)
      setPromptExtend(savedFormData.promptExtend)
    }

    // 加载所有保存的图片
    loadAllImages()
  }, [])

  // 加载所有保存的图片
  const loadAllImages = () => {
    try {
      const images = storageService.getAllImages()
      setAllImages(images)
      console.log('加载所有图片:', images.length)
    } catch (error) {
      console.error('加载图片失败:', error)
    }
  }

  // 保存表单数据到会话存储
  const saveFormData = () => {
    const formData: SessionFormData = {
      prompt,
      size,
      model,
      useFullAPI,
      negativePrompt,
      watermark,
      promptExtend
    }
    sessionService.saveFormData(formData)
  }

  // 表单值变化时自动保存
  useEffect(() => {
    saveFormData()
  }, [prompt, size, model, useFullAPI, negativePrompt, watermark, promptExtend])

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    
    setGenerationResult({ status: 'generating', images: [] })
    
    try {
      let response
      
      if (useFullAPI) {
        // 使用完整版API
        const requestData: GenerateImageRequest = {
          model: model,
          input: {
            messages: [
              {
                role: 'user',
                content: [
                  {
                    text: prompt.trim()
                  }
                ]
              }
            ]
          },
          parameters: {
            negative_prompt: negativePrompt,
            size: size,
            n: 1,
            prompt_extend: promptExtend,
            watermark: watermark
          }
        }
        response = await imageService.generateImageFull(requestData)
      } else {
        // 使用简化版API
        const requestData: GenerateImageSimpleRequest = {
          prompt: prompt.trim(),
          size: size,
          model: model,
          negativePrompt: negativePrompt,
          watermark: watermark,
          promptExtend: promptExtend,
        }
        response = await imageService.generateImageSimple(requestData)
      }
      
      if (response.success) {
        // 将imageUrls转换为Image格式
        const images = response.imageUrls.map((url, index) => ({
          id: `${response.requestId}-${index}`,
          url: url,
          prompt: prompt.trim(),
          width: parseInt(size.split('*')[0]),
          height: parseInt(size.split('*')[1]),
          createdAt: response.generatedAt,
        }))
        
        const result = {
          status: 'success' as const,
          images: images,
        }
        
        setGenerationResult(result)
        // 保存生成结果到会话存储
        sessionService.saveGenerationResult(result)
        // 重新加载所有图片
        loadAllImages()
      } else {
        const result = {
          status: 'error' as const,
          images: [],
          error: response.message || '生成失败',
        }
        
        setGenerationResult(result)
        // 保存错误结果到会话存储
        sessionService.saveGenerationResult(result)
      }
    } catch (error) {
      const result = {
        status: 'error' as const,
        images: [],
        error: error instanceof Error ? error.message : '生成失败',
      }
      
      setGenerationResult(result)
      // 保存错误结果到会话存储
      sessionService.saveGenerationResult(result)
    }
  }

  const isGenerating = generationResult.status === 'generating'

  // 下载图片处理函数
  const handleDownloadImage = async (image: StoredImage, index: number) => {
    try {
      const filename = downloadService.generateFilename(
        image.prompt, 
        index, 
        image.model
      )
      
      await downloadService.downloadImage(image.url, filename)
      
      // 显示成功消息
      console.log('图片下载成功:', filename)
    } catch (error) {
      console.error('下载失败:', error)
      // 这里可以添加错误提示
    }
  }

  // 清除所有数据
  const handleClearAll = () => {
    sessionService.clearAll()
    storageService.clearAllImages() // 也清除本地存储的图片
    setPrompt('')
    setSize('1328*1328')
    setModel('qwen-image-plus')
    setUseFullAPI(false)
    setNegativePrompt('')
    setWatermark(false)
    setPromptExtend(true)
    setGenerationResult({
      status: 'idle',
      images: [],
    })
    setAllImages([]) // 清空显示的图片
    console.log('所有数据已清除')
  }

  return (
    <Layout.Content style={{ padding: '0', minHeight: 'calc(100vh - 64px)' }}>
      <div style={{ display: 'flex', height: 'calc(100vh - 64px)' }}>
        {/* 左侧设置面板 */}
        <div style={{ 
          width: '600px', 
          minWidth: '600px',
          background: '#fafafa',
          borderRight: '1px solid #e8e8e8',
          padding: '24px',
          height: 'calc(100vh - 64px)',
          overflowY: 'auto'
        }}>
          {/* 清除数据按钮 */}
          {sessionService.hasSavedData() && (
            <div style={{ marginBottom: '16px' }}>
              <Button 
                type="text" 
                size="small"
                onClick={handleClearAll}
                style={{ color: '#999' }}
              >
                清除所有数据
              </Button>
            </div>
          )}

          {/* 生成表单 */}
          <Card 
            title={
              <Space>
                <SettingOutlined />
                <span>生成设置</span>
              </Space>
            }
            style={{ marginBottom: '16px' }}
            size="small"
          >
            <div 
              style={{ 
                maxHeight: '400px', 
                overflowY: 'scroll',
                paddingRight: '8px',
                scrollbarWidth: 'thin',
                scrollbarColor: '#d9d9d9 #f0f0f0'
              }}
              className="custom-scrollbar"
            >
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <div>
                  <Text strong style={{ display: 'block', marginBottom: '8px' }}>
                    ✨ 描述您想要的图片
                  </Text>
                  <TextArea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="例如：一只可爱的小猫在花园里玩耍，阳光明媚，色彩鲜艳，细节丰富，高清画质"
                    rows={4}
                    style={{ fontSize: '14px' }}
                  />
                </div>
                
                <div>
                  <Text strong style={{ display: 'block', marginBottom: '8px' }}>
                    📐 图片尺寸
                  </Text>
                  <Select
                    value={size}
                    onChange={(value) => setSize(value)}
                    style={{ width: '100%' }}
                  >
                    <Option value="1024*1024">1024×1024</Option>
                    <Option value="1328*1328">1328×1328 (推荐)</Option>
                    <Option value="1536*1536">1536×1536</Option>
                    <Option value="2048*2048">2048×2048</Option>
                  </Select>
                </div>
                
                <div>
                  <Text strong style={{ display: 'block', marginBottom: '8px' }}>
                    🤖 AI模型
                  </Text>
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
                  <Text strong style={{ display: 'block', marginBottom: '8px' }}>
                    ⚙️ API模式
                  </Text>
                  <Select
                    value={useFullAPI}
                    onChange={(value) => setUseFullAPI(value)}
                    style={{ width: '100%' }}
                  >
                    <Option value={false}>简化模式 (推荐)</Option>
                    <Option value={true}>完整模式</Option>
                  </Select>
                </div>

                <div>
                  <Text strong style={{ display: 'block', marginBottom: '8px' }}>
                    🚫 负面提示词
                  </Text>
                  <TextArea
                    value={negativePrompt}
                    onChange={(e) => setNegativePrompt(e.target.value)}
                    placeholder="例如：模糊、低质量、变形、多余的手指、比例失调"
                    rows={2}
                    style={{ fontSize: '14px' }}
                  />
                </div>

                <div>
                  <Text strong style={{ display: 'block', marginBottom: '8px' }}>
                    ⚙️ 高级选项
                  </Text>
                  <Row gutter={[8, 8]}>
                    <Col span={12}>
                      <Button
                        type={watermark ? 'primary' : 'default'}
                        size="small"
                        onClick={() => setWatermark(!watermark)}
                        style={{ width: '100%' }}
                      >
                        {watermark ? '✓ 水印' : '○ 水印'}
                      </Button>
                    </Col>
                    <Col span={12}>
                      <Button
                        type={promptExtend ? 'primary' : 'default'}
                        size="small"
                        onClick={() => setPromptExtend(!promptExtend)}
                        style={{ width: '100%' }}
                      >
                        {promptExtend ? '✓ 智能改写' : '○ 智能改写'}
                      </Button>
                    </Col>
                  </Row>
                </div>
              </Space>
            </div>
          </Card>
          
          <Button
            type="primary"
            size="large"
            icon={<RocketOutlined />}
            onClick={handleGenerate}
            loading={isGenerating}
            disabled={!prompt.trim()}
            style={{ 
              width: '100%', 
              height: '48px',
              fontSize: '16px',
              fontWeight: '500'
            }}
          >
            {isGenerating ? 'AI正在创作中...' : '开始生成图片'}
          </Button>

        </div>

        {/* 右侧图片展示面板 */}
        <div style={{ 
          flex: 1,
          padding: '24px',
          overflowY: 'auto',
          background: '#fff'
        }}>
          {/* 成功消息 */}
          {generationResult.status === 'success' && (
            <Alert
              message="生成成功！"
              description={`已成功生成 ${generationResult.images.length} 张图片`}
              type="success"
              icon={<CheckCircleOutlined />}
              showIcon
              style={{ marginBottom: '24px' }}
            />
          )}

          {/* 错误信息展示 */}
          {generationResult.status === 'error' && (
            <Alert
              message="生成失败"
              description={generationResult.error || '未知错误'}
              type="error"
              icon={<ExclamationCircleOutlined />}
              showIcon
              style={{ marginBottom: '24px' }}
            />
          )}

          {/* 所有图片展示 */}
          {allImages.length > 0 ? (
            <Card 
              title={
                <Space>
                  <PictureOutlined />
                  <span>我的作品</span>
                  <Tag color="blue">{allImages.length} 张图片</Tag>
                </Space>
              }
              style={{ marginBottom: '24px' }}
            >
              <Row gutter={[16, 16]}>
                {allImages.map((image: StoredImage, index: number) => (
                  <Col xs={24} sm={12} md={8} lg={6} key={index}>
                    <Card
                      hoverable
                      cover={
                        <Image
                          src={image.url}
                          alt={image.prompt}
                          style={{ height: '200px' , width: '200px',objectFit: 'cover' }}
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
                      style={{ 
                        width: '200px',
                        margin: '0 auto'
                      }}
                      bodyStyle={{ 
                        padding: '12px',
                        width: '200px'
                      }}
                    >
                       <div style={{ width: '100%' }}>
                         <div style={{ fontSize: '12px', fontWeight: '500', marginBottom: '6px', textAlign: 'left' }}>
                           <Text ellipsis={{ tooltip: image.prompt }}>
                             {image.prompt}
                           </Text>
                         </div>
                         <div style={{ fontSize: '10px', lineHeight: '1.3', color: '#666' }}>
                           <div style={{ marginBottom: '3px' }}>
                             <Text type="secondary">{image.width}×{image.height}</Text>
                           </div>
                           <div style={{ marginBottom: '3px' }}>
                             <Text type="secondary">{image.model}</Text>
                           </div>
                           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                             <Text type="secondary">{new Date(image.createdAt).toLocaleDateString()}</Text>
                             <Button
                               type="text"
                               size="small"
                               icon={<DownloadOutlined />}
                               onClick={() => handleDownloadImage(image, index)}
                               style={{ 
                                 fontSize: '10px',
                                 height: '22px',
                                 padding: '0 8px',
                                 minWidth: 'auto'
                               }}
                             >
                               下载
                             </Button>
                           </div>
                         </div>
                       </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card>
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '60px 20px',
              color: '#999'
            }}>
              <PictureOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
              <div style={{ fontSize: '16px', marginBottom: '8px' }}>暂无图片</div>
              <div style={{ fontSize: '14px' }}>开始生成您的第一张图片吧！</div>
            </div>
          )}
        </div>
      </div>
    </Layout.Content>
  )
}

export default Generate
