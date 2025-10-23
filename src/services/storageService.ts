// 图片存储服务
export interface StoredImage {
  id: string
  url: string
  prompt: string
  width: number
  height: number
  model: string
  size: string
  createdAt: string
  downloaded?: boolean
}

export const storageService = {
  // 获取所有存储的图片
  getAllImages: (): StoredImage[] => {
    try {
      const stored = localStorage.getItem('generated_images')
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('获取存储图片失败:', error)
      return []
    }
  },

  // 保存图片
  saveImage: (image: StoredImage): void => {
    try {
      const images = storageService.getAllImages()
      images.unshift(image) // 添加到开头，最新的在前面
      
      // 限制存储数量，最多保存100张图片
      if (images.length > 100) {
        images.splice(100)
      }
      
      localStorage.setItem('generated_images', JSON.stringify(images))
      console.log('图片已保存:', image.id)
    } catch (error) {
      console.error('保存图片失败:', error)
    }
  },

  // 删除图片
  deleteImage: (id: string): void => {
    try {
      const images = storageService.getAllImages()
      const filteredImages = images.filter(img => img.id !== id)
      localStorage.setItem('generated_images', JSON.stringify(filteredImages))
      console.log('图片已删除:', id)
    } catch (error) {
      console.error('删除图片失败:', error)
    }
  },

  // 清空所有图片
  clearAllImages: (): void => {
    try {
      localStorage.removeItem('generated_images')
      console.log('所有图片已清空')
    } catch (error) {
      console.error('清空图片失败:', error)
    }
  },

  // 获取图片统计信息
  getStats: () => {
    const images = storageService.getAllImages()
    return {
      total: images.length,
      today: images.filter(img => {
        const today = new Date().toDateString()
        const imageDate = new Date(img.createdAt).toDateString()
        return today === imageDate
      }).length,
      thisWeek: images.filter(img => {
        const now = new Date()
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        return new Date(img.createdAt) >= weekAgo
      }).length
    }
  },

  // 按模型分组统计
  getModelStats: () => {
    const images = storageService.getAllImages()
    const stats: Record<string, number> = {}
    
    images.forEach(img => {
      stats[img.model] = (stats[img.model] || 0) + 1
    })
    
    return stats
  }
}
