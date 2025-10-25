import axios from 'axios'

// 通过Vite代理调用阿里云DashScope API
const client = axios.create({
  baseURL: '', // 使用相对路径，通过Vite代理
  timeout: 60000, // 图像生成可能需要更长时间
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
client.interceptors.request.use(
  (config) => {
    // 设置DashScope API Key  在这里替换成自己的阿里云百炼apikey即可使用
    const apiKey = 'xxx'
    if (apiKey) {
      config.headers.Authorization = `Bearer ${apiKey}`
      console.log('设置API Key:', apiKey.substring(0, 10) + '...')
    }
    
    // 也可以从localStorage获取token（备用）
    const token = localStorage.getItem('token')
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
client.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // 统一错误处理
    console.error('API请求错误:', error)
    
    if (error.response?.status === 401) {
      // 处理未授权 - 不跳转，显示错误信息
      const errorMessage = error.response?.data?.message || 'API Key无效或已过期'
      console.error('401错误详情:', error.response?.data)
      throw new Error(`认证失败: ${errorMessage}`)
    } else if (error.response?.status === 400) {
      // 处理400错误，提供更详细的错误信息
      const errorMessage = error.response?.data?.message || error.response?.data?.error || '请求参数错误'
      console.error('400错误详情:', error.response?.data)
      throw new Error(`请求参数错误: ${errorMessage}`)
    } else if (error.response?.status === 500) {
      throw new Error('服务器内部错误，请稍后重试')
    } else if (error.code === 'ECONNREFUSED') {
      throw new Error('无法连接到服务器，请检查网络连接')
    } else if (error.message.includes('timeout')) {
      throw new Error('请求超时，请稍后重试')
    } else if (error.code === 'ERR_NETWORK') {
      throw new Error('网络错误，请检查网络连接')
    }
    
    return Promise.reject(error)
  }
)

export default client
