import client from './client'

export interface GenerateImageRequest {
  prompt: string
  style?: string
  size?: '256x256' | '512x512' | '1024x1024'
}

export interface GenerateImageResponse {
  id: string
  url: string
  prompt: string
  createdAt: string
}

export interface ImageGalleryItem {
  id: string
  url: string
  prompt: string
  createdAt: string
}

export const imageService = {
  // 生成图片
  generateImage: async (data: GenerateImageRequest): Promise<GenerateImageResponse> => {
    const response = await client.post('/images/generate', data)
    return response.data
  },

  // 获取图片列表
  getImages: async (page = 1, limit = 20): Promise<ImageGalleryItem[]> => {
    const response = await client.get('/images', {
      params: { page, limit }
    })
    return response.data
  },

  // 删除图片
  deleteImage: async (id: string): Promise<void> => {
    await client.delete(`/images/${id}`)
  },

  // 下载图片
  downloadImage: async (id: string): Promise<Blob> => {
    const response = await client.get(`/images/${id}/download`, {
      responseType: 'blob'
    })
    return response.data
  }
}
