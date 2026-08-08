import { useState, useEffect } from 'react'

function App() {
  const [newsData, setNewsData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedBrand, setSelectedBrand] = useState(null)

  useEffect(() => {
    fetch('/news-data.json')
      .then(res => {
        if (!res.ok) throw new Error('数据加载失败')
        return res.json()
      })
      .then(data => {
        setNewsData(data)
        if (data.brands && data.brands.length > 0) {
          setSelectedBrand(data.brands[0].brandKey)
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
        <div className="text-xl text-slate-400">加载中...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-400">{error}</div>
      </div>
    )
  }

  const currentBrand = newsData.brands.find(b => b.brandKey === selectedBrand)

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Brand Pulse</h1>
              <p className="text-sm text-slate-400 mt-1">品牌资讯每日速递</p>
            </div>
            <div className="text-sm text-slate-500">
              更新于: {newsData.lastUpdated?.replace('T', ' ').slice(0, 19)}
            </div>
          </div>
        </div>
      </header>

      {/* Brand Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex gap-2 flex-wrap">
          {newsData.brands.map(brand => (
            <button
              key={brand.brandKey}
              onClick={() => setSelectedBrand(brand.brandKey)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedBrand === brand.brandKey
                  ? 'text-white shadow-lg'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
              style={selectedBrand === brand.brandKey ? { backgroundColor: brand.brandColor } : {}}
            >
              {brand.brandName}
              <span className="ml-2 text-xs opacity-75">({brand.news.length})</span>
            </button>
          ))}
        </div>
      </div>

      {/* News List */}
      <main className="max-w-7xl mx-auto px-4 pb-12">
        {currentBrand && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: currentBrand.brandColor }}
              />
              <h2 className="text-xl font-semibold text-white">{currentBrand.brandName} 资讯</h2>
            </div>
            {currentBrand.news.length === 0 ? (
              <div className="text-center py-12 text-slate-500">暂无资讯数据</div>
            ) : (
              <div className="space-y-3">
                {currentBrand.news.map(item => (
                  <a
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 rounded-xl p-4 transition-all group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-slate-200 group-hover:text-white font-medium line-clamp-2 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-sm text-slate-500 mt-1 line-clamp-1">{item.summary}</p>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <div className="text-xs text-slate-500">{item.date || item.publishedAt?.slice(0, 10)}</div>
                        <div className="text-xs text-slate-600 mt-1">{item.source}</div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 text-center text-sm text-slate-600">
        Brand Pulse &copy; {new Date().getFullYear()} - 数据来源：新浪财经
      </footer>
    </div>
  )
}

export default App
