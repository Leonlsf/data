import { useState, useEffect } from 'react'

function App() {
  const [newsData, setNewsData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeBrand, setActiveBrand] = useState(0)

  useEffect(() => {
    fetch('/news-data.json')
      .then(res => {
        if (!res.ok) throw new Error('数据加载失败')
        return res.json()
      })
      .then(data => {
        setNewsData(data)
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

  const brands = newsData?.brands || []
  const currentBrand = brands[activeBrand]

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 border-b border-slate-700/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">品牌资讯</h1>
            <span className="text-sm text-slate-400">
              更新于 {newsData?.lastUpdated?.slice(0, 10) || '-'}
            </span>
          </div>
        </div>
      </header>

      {/* Brand Tabs */}
      <div className="max-w-6xl mx-auto px-4 mt-6">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {brands.map((brand, index) => (
            <button
              key={brand.brandKey}
              onClick={() => setActiveBrand(index)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                activeBrand === index
                  ? 'text-white shadow-lg'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
              style={
                activeBrand === index
                  ? { backgroundColor: brand.brandColor }
                  : {}
              }
            >
              {brand.brandName}
            </button>
          ))}
        </div>
      </div>

      {/* News List */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {currentBrand && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: currentBrand.brandColor }}
              />
              <h2 className="text-xl font-semibold text-white">
                {currentBrand.brandName}
              </h2>
              <span className="text-sm text-slate-400">
                {currentBrand.news.length} 条资讯
              </span>
            </div>

            {currentBrand.news.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                暂无资讯数据
              </div>
            ) : (
              <div className="space-y-3">
                {currentBrand.news.map((item) => (
                  <a
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 hover:bg-slate-800 hover:border-slate-600 transition-all group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-slate-200 group-hover:text-white font-medium line-clamp-2 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-slate-500 text-sm mt-1 line-clamp-1">
                          {item.summary}
                        </p>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <div className="text-xs text-slate-500">
                          {item.publishedAt?.slice(0, 10)}
                        </div>
                        <div className="text-xs text-slate-600 mt-1">
                          {item.source}
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default App
