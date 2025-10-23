// 会话存储服务 - 管理生成页面的临时状态
export interface SessionGenerationResult {
  status: 'idle' | 'generating' | 'success' | 'error'
  images: Array<{
    id: string
    url: string
    prompt: string
    width: number
    height: number
    createdAt: string
  }>
  error?: string
}

export interface SessionFormData {
  prompt: string
  size: string
  model: string
  useFullAPI: boolean
  negativePrompt: string
  watermark: boolean
  promptExtend: boolean
}

export const sessionService = {
  // 保存生成结果到会话存储
  saveGenerationResult: (result: SessionGenerationResult): void => {
    try {
      sessionStorage.setItem('generation_result', JSON.stringify(result))
      console.log('生成结果已保存到会话存储')
    } catch (error) {
      console.error('保存生成结果失败:', error)
    }
  },

  // 获取生成结果
  getGenerationResult: (): SessionGenerationResult | null => {
    try {
      const stored = sessionStorage.getItem('generation_result')
      return stored ? JSON.parse(stored) : null
    } catch (error) {
      console.error('获取生成结果失败:', error)
      return null
    }
  },

  // 清除生成结果
  clearGenerationResult: (): void => {
    try {
      sessionStorage.removeItem('generation_result')
      console.log('生成结果已清除')
    } catch (error) {
      console.error('清除生成结果失败:', error)
    }
  },

  // 保存表单数据
  saveFormData: (formData: SessionFormData): void => {
    try {
      sessionStorage.setItem('form_data', JSON.stringify(formData))
      console.log('表单数据已保存')
    } catch (error) {
      console.error('保存表单数据失败:', error)
    }
  },

  // 获取表单数据
  getFormData: (): SessionFormData | null => {
    try {
      const stored = sessionStorage.getItem('form_data')
      return stored ? JSON.parse(stored) : null
    } catch (error) {
      console.error('获取表单数据失败:', error)
      return null
    }
  },

  // 清除表单数据
  clearFormData: (): void => {
    try {
      sessionStorage.removeItem('form_data')
      console.log('表单数据已清除')
    } catch (error) {
      console.error('清除表单数据失败:', error)
    }
  },

  // 清除所有会话数据
  clearAll: (): void => {
    try {
      sessionStorage.removeItem('generation_result')
      sessionStorage.removeItem('form_data')
      console.log('所有会话数据已清除')
    } catch (error) {
      console.error('清除会话数据失败:', error)
    }
  },

  // 检查是否有保存的数据
  hasSavedData: (): boolean => {
    return !!(sessionStorage.getItem('generation_result') || sessionStorage.getItem('form_data'))
  }
}
