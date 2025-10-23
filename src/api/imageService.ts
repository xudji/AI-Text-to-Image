import client from './client'
import { storageService, StoredImage } from '../services/storageService'

// 阿里云DashScope API请求参数
export interface GenerateImageRequest {
  model: string
  input: {
    messages: Array<{
      role: string
      content: Array<{
        text: string
      }>
    }>
  }
  parameters: {
    negative_prompt?: string
    size?: string
    n?: number
    prompt_extend?: boolean
    watermark?: boolean
    seed?: number
  }
}

// 简化版图像生成请求参数（兼容旧接口）
export interface GenerateImageSimpleRequest {
  prompt: string
  size?: string
  model?: string
  negativePrompt?: string
  watermark?: boolean
  promptExtend?: boolean
}

// 图像生成响应
export interface GenerateImageResponse {
  success: boolean
  message: string
  imageUrls: string[]
  generatedAt: string
  requestId: string
}

// 健康检查响应
export interface HealthCheckResponse {
  status: string
  timestamp: string
  uptime: number
}

// 应用信息响应
export interface AppInfoResponse {
  name: string
  version: string
  description: string
  buildTime: string
}

export const imageService = {
  // 通过Vite代理调用阿里云DashScope API
  generateImage: async (data: GenerateImageRequest): Promise<any> => {
    const response = await client.post('/api/v1/services/aigc/multimodal-generation/generation', data)
    return response.data
  },

  // 简化版生成图片（转换为DashScope格式）
  generateImageSimple: async (data: GenerateImageSimpleRequest): Promise<GenerateImageResponse> => {
    try {
      const dashScopeRequest: GenerateImageRequest = {
        model: data.model || 'qwen-image-plus',
        input: {
          messages: [
            {
              role: 'user',
              content: [
                {
                  text: data.prompt
                }
              ]
            }
          ]
        },
        parameters: {
          negative_prompt: data.negativePrompt || '',
          size: data.size || '1328*1328',
          n: 1,
          prompt_extend: data.promptExtend !== false, // 默认开启
          watermark: data.watermark || false
        }
      }

      console.log('调用DashScope API:', dashScopeRequest)
      
      const response = await imageService.generateImage(dashScopeRequest)
      console.log('DashScope API完整响应:', JSON.stringify(response, null, 2))
      
      // 转换响应格式以兼容现有代码
      if (response.output && response.output.choices && response.output.choices.length > 0) {
        console.log('找到choices:', response.output.choices.length)
        
        const imageUrls = response.output.choices.map((choice: any, index: number) => {
          console.log(`处理choice ${index}:`, choice)
          
          // 检查不同的可能路径
          let imageUrl = null
          if (choice.message && choice.message.content && choice.message.content[0]) {
            // 情况1: image是字符串URL (实际API响应格式)
            if (typeof choice.message.content[0].image === 'string') {
              imageUrl = choice.message.content[0].image
            }
            // 情况2: image是对象，包含url属性
            else if (choice.message.content[0].image && choice.message.content[0].image.url) {
              imageUrl = choice.message.content[0].image.url
            }
            // 情况3: 直接是url属性
            else if (choice.message.content[0].url) {
              imageUrl = choice.message.content[0].url
            }
          } else if (choice.image) {
            // 情况4: image在根级别
            if (typeof choice.image === 'string') {
              imageUrl = choice.image
            } else if (choice.image.url) {
              imageUrl = choice.image.url
            }
          } else if (choice.url) {
            // 情况5: url在根级别
            imageUrl = choice.url
          }
          
          console.log(`提取的图片URL ${index}:`, imageUrl)
          return imageUrl
        }).filter((url: any) => url) // 过滤掉空值
        
        console.log('最终图片URLs:', imageUrls)
        
        // 保存图片到本地存储
        const generatedAt = new Date().toISOString()
        const requestId = response.request_id || Date.now().toString()
        
        imageUrls.forEach((url: string, index: number) => {
          const storedImage: StoredImage = {
            id: `${requestId}-${index}`,
            url: url,
            prompt: data.prompt,
            width: parseInt(data.size?.split('*')[0] || '1328'),
            height: parseInt(data.size?.split('*')[1] || '1328'),
            model: data.model || 'qwen-image-plus',
            size: data.size || '1328*1328',
            createdAt: generatedAt
          }
          
          storageService.saveImage(storedImage)
        })
        
        return {
          success: true,
          message: '生成成功',
          imageUrls: imageUrls,
          generatedAt: generatedAt,
          requestId: requestId
        }
      } else {
        console.log('未找到有效的choices，完整响应:', response)
        return {
          success: false,
          message: response.message || '生成失败，未找到图片数据',
          imageUrls: [],
          generatedAt: new Date().toISOString(),
          requestId: response.request_id || Date.now().toString()
        }
      }
    } catch (error: any) {
      console.error('DashScope API调用失败:', error)
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'API调用失败',
        imageUrls: [],
        generatedAt: new Date().toISOString(),
        requestId: Date.now().toString()
      }
    }
  },

  // 完整版生成图片（直接使用DashScope格式）
  generateImageFull: async (data: GenerateImageRequest): Promise<GenerateImageResponse> => {
    try {
      console.log('调用DashScope API (完整版):', data)
      
      const response = await imageService.generateImage(data)
      console.log('DashScope API完整响应 (完整版):', JSON.stringify(response, null, 2))
      
      // 转换响应格式
      if (response.output && response.output.choices && response.output.choices.length > 0) {
        console.log('找到choices (完整版):', response.output.choices.length)
        
        const imageUrls = response.output.choices.map((choice: any, index: number) => {
          console.log(`处理choice ${index} (完整版):`, choice)
          
          // 检查不同的可能路径
          let imageUrl = null
          if (choice.message && choice.message.content && choice.message.content[0]) {
            // 情况1: image是字符串URL (实际API响应格式)
            if (typeof choice.message.content[0].image === 'string') {
              imageUrl = choice.message.content[0].image
            }
            // 情况2: image是对象，包含url属性
            else if (choice.message.content[0].image && choice.message.content[0].image.url) {
              imageUrl = choice.message.content[0].image.url
            }
            // 情况3: 直接是url属性
            else if (choice.message.content[0].url) {
              imageUrl = choice.message.content[0].url
            }
          } else if (choice.image) {
            // 情况4: image在根级别
            if (typeof choice.image === 'string') {
              imageUrl = choice.image
            } else if (choice.image.url) {
              imageUrl = choice.image.url
            }
          } else if (choice.url) {
            // 情况5: url在根级别
            imageUrl = choice.url
          }
          
          console.log(`提取的图片URL ${index} (完整版):`, imageUrl)
          return imageUrl
        }).filter((url: any) => url) // 过滤掉空值
        
        console.log('最终图片URLs (完整版):', imageUrls)
        
        // 保存图片到本地存储
        const generatedAt = new Date().toISOString()
        const requestId = response.request_id || Date.now().toString()
        
        imageUrls.forEach((url: string, index: number) => {
          const storedImage: StoredImage = {
            id: `${requestId}-${index}`,
            url: url,
            prompt: data.input.messages[0].content[0].text,
            width: parseInt(data.parameters?.size?.split('*')[0] || '1328'),
            height: parseInt(data.parameters?.size?.split('*')[1] || '1328'),
            model: data.model,
            size: data.parameters?.size || '1328*1328',
            createdAt: generatedAt
          }
          
          storageService.saveImage(storedImage)
        })
        
        return {
          success: true,
          message: '生成成功',
          imageUrls: imageUrls,
          generatedAt: generatedAt,
          requestId: requestId
        }
      } else {
        console.log('未找到有效的choices (完整版)，完整响应:', response)
        return {
          success: false,
          message: response.message || '生成失败，未找到图片数据',
          imageUrls: [],
          generatedAt: new Date().toISOString(),
          requestId: response.request_id || Date.now().toString()
        }
      }
    } catch (error: any) {
      console.error('DashScope API调用失败:', error)
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'API调用失败',
        imageUrls: [],
        generatedAt: new Date().toISOString(),
        requestId: Date.now().toString()
      }
    }
  },

  // 健康检查
  healthCheck: async (): Promise<HealthCheckResponse> => {
    const response = await client.get('/api/v1/images/health')
    return response.data
  },

  // 获取应用信息
  getAppInfo: async (): Promise<AppInfoResponse> => {
    const response = await client.get('/actuator/info')
    return response.data
  },

  // 获取应用健康状态
  getAppHealth: async (): Promise<{ status: string }> => {
    const response = await client.get('/actuator/health')
    return response.data
  }
}
