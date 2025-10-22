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
  style?: string
  size: string
  createdAt: string
  updatedAt: string
}

export interface GenerateImageParams {
  prompt: string
  style?: 'realistic' | 'artistic' | 'cartoon' | 'anime'
  size?: '256x256' | '512x512' | '1024x1024'
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
