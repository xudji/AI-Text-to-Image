import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-gray-800">
            AI Text to Image
          </Link>
          <div className="flex space-x-6">
            <Link
              to="/"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              首页
            </Link>
            <Link
              to="/generate"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              生成图片
            </Link>
            <Link
              to="/gallery"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              画廊
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}

export default Header
