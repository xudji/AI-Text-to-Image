import { useState, useEffect } from 'react'
import { imageService } from '../api/imageService'
import { HealthCheckResponse, AppInfoResponse } from '../api/imageService'

const SystemStatus = () => {
  const [healthStatus, setHealthStatus] = useState<HealthCheckResponse | null>(null)
  const [appInfo, setAppInfo] = useState<AppInfoResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSystemStatus = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const [healthData, appData] = await Promise.all([
          imageService.healthCheck(),
          imageService.getAppInfo()
        ])
        
        setHealthStatus(healthData)
        setAppInfo(appData)
      } catch (err) {
        setError(err instanceof Error ? err.message : '获取系统状态失败')
      } finally {
        setLoading(false)
      }
    }

    fetchSystemStatus()
  }, [])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">系统状态</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">系统状态</h1>
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">连接失败</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 健康状态 */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">服务健康状态</h2>
          {healthStatus ? (
            <div className="space-y-3">
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-700 w-20">状态:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  healthStatus.status === 'UP' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {healthStatus.status}
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-700 w-20">时间:</span>
                <span className="text-sm text-gray-600">
                  {new Date(healthStatus.timestamp).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-700 w-20">运行时间:</span>
                <span className="text-sm text-gray-600">
                  {Math.floor(healthStatus.uptime / 3600)}小时
                </span>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">无法获取健康状态</p>
          )}
        </div>

        {/* 应用信息 */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">应用信息</h2>
          {appInfo ? (
            <div className="space-y-3">
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-700 w-20">名称:</span>
                <span className="text-sm text-gray-600">{appInfo.name}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-700 w-20">版本:</span>
                <span className="text-sm text-gray-600">{appInfo.version}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-700 w-20">描述:</span>
                <span className="text-sm text-gray-600">{appInfo.description}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-700 w-20">构建时间:</span>
                <span className="text-sm text-gray-600">
                  {new Date(appInfo.buildTime).toLocaleString()}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">无法获取应用信息</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default SystemStatus
