import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">
        欢迎使用 AI 文本转图像
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        通过简单的文字描述，让AI为您生成精美的图像
      </p>
      <div className="flex justify-center space-x-4">
        <Link
          to="/generate"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          开始生成
        </Link>
        <Link
          to="/gallery"
          className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
        >
          查看画廊
        </Link>
      </div>
    </div>
  )
}

export default Home
