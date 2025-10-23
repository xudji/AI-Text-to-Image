import { useState } from 'react'
import { imageService, GenerateImageRequest } from '../api/imageService'
import { GenerationResult } from '../types'

const Generate = () => {
  const [prompt, setPrompt] = useState('')
  const [width, setWidth] = useState(512)
  const [height, setHeight] = useState(512)
  const [quality, setQuality] = useState<'standard' | 'hd'>('standard')
  const [generationResult, setGenerationResult] = useState<GenerationResult>({
    status: 'idle',
    images: [],
  })

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    
    setGenerationResult({ status: 'generating', images: [] })
    
    try {
      const requestData: GenerateImageRequest = {
        prompt: prompt.trim(),
        width,
        height,
        numImages: 1,
        quality,
      }
      
      const response = await imageService.generateImage(requestData)
      
      if (response.success) {
        setGenerationResult({
          status: 'success',
          images: response.data,
        })
      } else {
        setGenerationResult({
          status: 'error',
          images: [],
          error: response.message || '生成失败',
        })
      }
    } catch (error) {
      setGenerationResult({
        status: 'error',
        images: [],
        error: error instanceof Error ? error.message : '生成失败',
      })
    }
  }

  const isGenerating = generationResult.status === 'generating'

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">生成图片</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
              描述您想要的图片
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="例如：一只可爱的小猫在花园里玩耍"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
            />
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                图片尺寸
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                  className="w-20 p-2 border border-gray-300 rounded-md"
                  placeholder="宽度"
                />
                <span className="flex items-center">×</span>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-20 p-2 border border-gray-300 rounded-md"
                  placeholder="高度"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                图片质量
              </label>
              <select
                value={quality}
                onChange={(e) => setQuality(e.target.value as 'standard' | 'hd')}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="standard">标准</option>
                <option value="hd">高清</option>
              </select>
            </div>
          </div>
        </div>
        
        <button
          onClick={handleGenerate}
          disabled={!prompt.trim() || isGenerating}
          className="w-full mt-6 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isGenerating ? '生成中...' : '生成图片'}
        </button>
      </div>

      {/* 生成结果展示 */}
      {generationResult.status === 'success' && generationResult.images.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">生成结果</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {generationResult.images.map((image: any, index: number) => (
              <div key={index} className="border rounded-lg overflow-hidden">
                <img
                  src={image.url}
                  alt={image.prompt}
                  className="w-full h-64 object-cover"
                />
                <div className="p-4">
                  <p className="text-sm text-gray-600 mb-2">{image.prompt}</p>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{image.width} × {image.height}</span>
                    <span>{new Date(image.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 错误信息展示 */}
      {generationResult.status === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">生成失败</h3>
              <div className="mt-2 text-sm text-red-700">
                {generationResult.error}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Generate
