import { useState, useEffect } from 'react'

function App() {
  const [newsData, setNewsData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeBrand, setActiveBrand] = useState(null)

  useEffect(() => {
    fetch('/news-data.json')
      .then(res => {
        if (!res.ok) throw new Error('数据加载失败')
        return res.json()
      })
      .then(data => {
        setNewsData(data)
        if (data.brands && data.brands.length > 0) {
          setActiveBrand(data.brands[0].brandKey)
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-500">加载中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-2">加载失败</p>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    )
  }

  const currentBrand = newsData?.brands?.find(b => b.brandKey === activeBrand)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800">品牌资讯</h1>
          <p className="text-sm text-gray-400 mt-1">更新时间：{newsData?.lastUpdated || '-'}</p>
        </div>
      </header>

      {/* Brand Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto">
            {newsData?.brands?.map(brand => (
              <button
                key={brand.brandKey}
                onClick={() => setActiveBrand(brand.brandKey)}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeBrand === brand.brandKey
                    ? 'border-current text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                style={activeBrand === brand.brandKey ? { borderColor: brand.brandColor, color: brand.brandColor } : {}}
              >
                {brand.brandName}
                <span className="ml-1.5 text-xs text-gray-400">({brand.news?.length || 0})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* News List */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {currentBrand && currentBrand.news?.length > 0 ? (
          <div className="space-y-3">
            {currentBrand.news.map(item => (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-gray-800 font-medium text-sm leading-relaxed line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-400 text-xs mt-1.5">{item.summary}</p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <span className="text-xs text-gray-400">{item.source}</span>
                    <p className="text-xs text-gray-300 mt-1">{item.publishedAt?.slice(0, 16).replace('T', ' ')}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400">暂无资讯数据</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
