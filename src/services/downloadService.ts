// 图片下载服务
export const downloadService = {
  // 下载单张图片
  downloadImage: async (url: string, filename: string): Promise<void> => {
    try {
      // 创建一个临时的a标签来触发下载
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      link.target = '_blank'
      
      // 添加到DOM，点击，然后移除
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      console.log('图片下载已开始:', filename)
    } catch (error) {
      console.error('下载图片失败:', error)
      throw new Error('下载失败，请重试')
    }
  },

  // 批量下载图片
  downloadImages: async (images: Array<{url: string, filename: string}>): Promise<void> => {
    try {
      for (let i = 0; i < images.length; i++) {
        const { url, filename } = images[i]
        
        // 添加延迟避免浏览器阻止多个下载
        if (i > 0) {
          await new Promise(resolve => setTimeout(resolve, 500))
        }
        
        await downloadService.downloadImage(url, filename)
      }
      
      console.log(`批量下载完成，共${images.length}张图片`)
    } catch (error) {
      console.error('批量下载失败:', error)
      throw new Error('批量下载失败，请重试')
    }
  },

  // 生成文件名
  generateFilename: (prompt: string, index: number = 0, model: string = 'qwen-image-plus'): string => {
    // 清理提示词，移除特殊字符
    const cleanPrompt = prompt
      .replace(/[^\u4e00-\u9fa5a-zA-Z0-9\s]/g, '') // 只保留中文、英文、数字和空格
      .replace(/\s+/g, '_') // 空格替换为下划线
      .substring(0, 20) // 限制长度
    
    const timestamp = new Date().toISOString().slice(0, 10) // YYYY-MM-DD
    const indexStr = index > 0 ? `_${index + 1}` : ''
    
    return `${cleanPrompt}_${model}_${timestamp}${indexStr}.png`
  },

  // 下载图片并保存到本地存储
  downloadAndSave: async (image: {
    url: string
    prompt: string
    model: string
    width: number
    height: number
    size: string
  }, index: number = 0): Promise<void> => {
    try {
      const filename = downloadService.generateFilename(image.prompt, index, image.model)
      
      // 下载图片
      await downloadService.downloadImage(image.url, filename)
      
      // 标记为已下载
      const images = JSON.parse(localStorage.getItem('generated_images') || '[]')
      const targetImage = images.find((img: any) => img.url === image.url)
      if (targetImage) {
        targetImage.downloaded = true
        targetImage.downloadedAt = new Date().toISOString()
        localStorage.setItem('generated_images', JSON.stringify(images))
      }
      
      console.log('图片下载并保存完成:', filename)
    } catch (error) {
      console.error('下载并保存失败:', error)
      throw error
    }
  }
}
