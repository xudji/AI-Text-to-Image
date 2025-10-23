import client from './client'

// 图像生成请求参数
export interface GenerateImageRequest {
  prompt: string
  width?: number
  height?: number
  numImages?: number
  quality?: 'standard' | 'hd'
}

// 图像生成响应
export interface GenerateImageResponse {
  success: boolean
  data: {
    id: string
    url: string
    prompt: string
    width: number
    height: number
    createdAt: string
  }[]
  message?: string
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
  // 生成图片
  generateImage: async (data: GenerateImageRequest): Promise<GenerateImageResponse> => {
    const response = await client.post('/api/v1/images/generate', data)
    return response.data
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
