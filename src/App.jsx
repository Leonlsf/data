import { useState, useEffect } from 'react'

function App() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeBrand, setActiveBrand] = useState(null)

  useEffect(() => {
    fetch('/news-data.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch')
        return res.json()
      })
      .then(json => {
        setData(json)
        if (json.brands && json.brands.length > 0) {
          setActiveBrand(json.brands[0].brandKey)
        }
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white text-xl animate-pulse">加载中...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-red-400 text-xl">加载失败: {error}</div>
      </div>
    )
  }

  const activeBrandData = data.brands.find(b => b.brandKey === activeBrand)

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                BP
              </h1>
              <p className="text-sm text-gray-400 mt-0.5">品牌资讯</p>
            </div>
            <div className="text-sm text-gray-500">
              更新于 {data.date}
            </div>
          </div>
        </div>
      </header>

      {/* Brand Tabs */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex flex-wrap gap-2">
          {data.brands.map(brand => (
            <button
              key={brand.brandKey}
              onClick={() => setActiveBrand(brand.brandKey)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeBrand === brand.brandKey
                  ? 'text-white shadow-lg'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
              }`}
              style={activeBrand === brand.brandKey ? { backgroundColor: brand.brandColor } : {}}
            >
              {brand.brandName}({brand.news.length})
            </button>
          ))}
        </div>
      </div>

      {/* News List */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 pb-12">
        {activeBrandData && (
          <div>
            <h2 className="text-xl font-semibold mb-4" style={{ color: activeBrandData.brandColor }}>
              {activeBrandData.brandName} 资讯
            </h2>
            <div className="space-y-4">
              {activeBrandData.news.map(item => (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-gray-900 border border-gray-800 rounded-lg p-4 hover:bg-gray-800 hover:border-gray-700 transition-all"
                >
                  <h3 className="text-white font-medium text-base leading-relaxed">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                    <span>{item.publishedAt.split('T')[0]}</span>
                    <span>{item.publishedAt.split('T')[1]?.split('+')[0]}</span>
                    <span>{item.source}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
