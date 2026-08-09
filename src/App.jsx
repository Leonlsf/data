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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-400">加载中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-2">加载失败</p>
          <p className="text-gray-500">{error}</p>
        </div>
      </div>
    )
  }

  const currentBrand = newsData?.brands?.find(b => b.brandKey === activeBrand)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700/50 backdrop-blur-sm bg-slate-900/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">BP</span>
              </div>
              <h1 className="text-xl font-bold text-white">品牌资讯</h1>
            </div>
            <div className="text-sm text-gray-400">
              更新于 {newsData?.lastUpdated?.slice(0, 10) || '-'}
            </div>
          </div>
        </div>
      </header>

      {/* Brand Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
          {newsData?.brands?.map(brand => (
            <button
              key={brand.brandKey}
              onClick={() => setActiveBrand(brand.brandKey)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                activeBrand === brand.brandKey
                  ? 'text-white shadow-lg scale-105'
                  : 'bg-slate-700/50 text-gray-300 hover:bg-slate-700'
              }`}
              style={activeBrand === brand.brandKey ? { backgroundColor: brand.brandColor } : {}}
            >
              {brand.brandName}
              <span className="ml-2 text-xs opacity-80">({brand.news?.length || 0})</span>
            </button>
          ))}
        </div>

        {/* News List */}
        {currentBrand && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: currentBrand.brandColor }}
              ></div>
              <h2 className="text-lg font-semibold text-white">{currentBrand.brandName} 资讯</h2>
            </div>

            {currentBrand.news?.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                暂无资讯数据
              </div>
            ) : (
              currentBrand.news?.map((item, index) => (
                <a
                  key={item.id || index}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:border-slate-600 hover:bg-slate-800 transition-all group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-gray-100 font-medium group-hover:text-white transition-colors line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-500 text-sm mt-1 line-clamp-1">{item.summary}</p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <div className="text-xs text-gray-500">{item.publishedAt?.slice(0, 10)}</div>
                      <div className="text-xs text-gray-600 mt-0.5">{item.publishedAt?.slice(11, 16)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-700/50 text-gray-400">
                      {item.source}
                    </span>
                    <svg className="w-3 h-3 text-gray-600 group-hover:text-gray-400 transition-colors ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </a>
              ))
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-sm text-gray-600">
          Brand Pulse &copy; {new Date().getFullYear()} - 品牌资讯数据来源于新浪财经
        </div>
      </footer>
    </div>
  )
}

export default App
