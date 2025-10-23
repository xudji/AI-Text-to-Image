// 通用类型定义
export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}

export interface PaginationParams {
  page: number
  limit: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// 图片相关类型
export interface Image {
  id: string
  url: string
  prompt: string
  width: number
  height: number
  quality?: 'standard' | 'hd'
  createdAt: string
}

export interface GenerateImageParams {
  prompt: string
  size?: string
  model?: string
  negativePrompt?: string
  useFullAPI?: boolean
}

// 生成状态类型
export type GenerationStatus = 'idle' | 'generating' | 'success' | 'error'

// 生成结果类型
export interface GenerationResult {
  status: GenerationStatus
  images: Image[]
  error?: string
  progress?: number
}

// 用户相关类型
export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  createdAt: string
}

// 错误类型
export interface ApiError {
  message: string
  code: string
  details?: Record<string, any>
}

// 健康检查类型
export interface HealthStatus {
  status: 'UP' | 'DOWN'
  timestamp: string
  uptime: number
}

// 应用信息类型
export interface AppInfo {
  name: string
  version: string
  description: string
  buildTime: string
}
