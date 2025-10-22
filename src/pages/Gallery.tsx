const Gallery = () => {
  // TODO: 从API获取图片数据
  const images = []

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">图片画廊</h1>
      
      {images.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">暂无图片</p>
          <p className="text-gray-400">开始生成您的第一张图片吧！</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src={image.url}
                alt={image.prompt}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <p className="text-gray-600 text-sm">{image.prompt}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Gallery
