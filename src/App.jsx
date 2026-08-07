import { useState, useEffect } from 'react'

function App() {
  const [newsData, setNewsData] = useState(null)
  const [activeBrand, setActiveBrand] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-400">加载中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-400">
          <p className="text-xl mb-2">加载失败</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    )
  }

  const currentBrand = newsData?.brands?.find(b => b.brandKey === activeBrand)

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Brand Pulse</h1>
              <p className="text-sm text-gray-400 mt-0.5">品牌资讯 · 每日更新</p>
            </div>
            {newsData?.lastUpdated && (
              <div className="text-xs text-gray-500">
                更新于 {new Date(newsData.lastUpdated).toLocaleString('zh-CN')}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Brand Tabs */}
      <div className="max-w-7xl mx-auto px-4 pt-6">
        <div className="flex gap-3 flex-wrap">
          {newsData?.brands?.map(brand => (
            <button
              key={brand.brandKey}
              onClick={() => setActiveBrand(brand.brandKey)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                activeBrand === brand.brandKey
                  ? 'text-white shadow-lg scale-105'
                  : 'bg-slate-800 text-gray-400 hover:bg-slate-700 hover:text-gray-200'
              }`}
              style={activeBrand === brand.brandKey ? { backgroundColor: brand.brandColor } : {}}
            >
              {brand.brandName}
              <span className="ml-1.5 text-xs opacity-75">({brand.news?.length || 0})</span>
            </button>
          ))}
        </div>
      </div>

      {/* News List */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {currentBrand && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: currentBrand.brandColor }}
              />
              <h2 className="text-lg font-semibold text-gray-200">
                {currentBrand.brandName} 最新资讯
              </h2>
            </div>

            {currentBrand.news?.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                <p className="text-lg">暂无资讯数据</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {currentBrand.news?.map((item, index) => (
                  <a
                    key={item.id || index}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-slate-800/60 rounded-xl p-5 hover:bg-slate-800 transition-all duration-200 border border-slate-700/50 hover:border-slate-600 group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-gray-200 font-medium group-hover:text-white transition-colors line-clamp-2">
                          {item.title}
                        </h3>
                        {item.summary && item.summary !== item.title && (
                          <p className="text-sm text-gray-500 mt-1.5 line-clamp-1">{item.summary}</p>
                        )}
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <div className="text-xs text-gray-500">
                          {item.publishedAt && new Date(item.publishedAt).toLocaleDateString('zh-CN')}
                        </div>
                        <div className="text-xs text-gray-600 mt-0.5">
                          {item.publishedAt && new Date(item.publishedAt).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-3">
                      <span className="text-xs text-gray-600">{item.source}</span>
                      <span className="text-gray-700">·</span>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: currentBrand.brandColor + '20',
                          color: currentBrand.brandColor
                        }}
                      >
                        {currentBrand.brandName}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-xs text-gray-600">
          Brand Pulse · 数据来源：新浪财经 · 自动采集更新
        </div>
      </footer>
    </div>
  )
}

export default App
