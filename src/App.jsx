import { useState, useEffect } from 'react'

function App() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedBrand, setSelectedBrand] = useState(null)

  useEffect(() => {
    fetch('/news-data.json')
      .then(res => res.json())
      .then(json => {
        setData(json)
        if (json.brands && json.brands.length > 0) {
          setSelectedBrand(0)
        }
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load news data:', err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-slate-400 animate-pulse">加载中...</div>
      </div>
    )
  }

  if (!data || !data.brands) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-400">数据加载失败</div>
      </div>
    )
  }

  const brand = data.brands[selectedBrand]

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              品牌资讯
            </h1>
            <span className="text-xs text-slate-500">
              更新于 {data.lastUpdated ? data.lastUpdated.slice(0, 10) : ''}
            </span>
          </div>
          {/* Brand Tabs */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
            {data.brands.map((b, i) => (
              <button
                key={b.brandKey}
                onClick={() => setSelectedBrand(i)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  selectedBrand === i
                    ? 'text-white shadow-lg'
                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                }`}
                style={selectedBrand === i ? { backgroundColor: b.brandColor } : {}}
              >
                {b.brandName}
                <span className="ml-2 text-xs opacity-80">({b.news.length})</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* News List */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {brand && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: brand.brandColor }}
              />
              <h2 className="text-lg font-semibold text-slate-200">{brand.brandName} 资讯</h2>
              <span className="text-sm text-slate-500">共 {brand.news.length} 条</span>
            </div>
            {brand.news.length === 0 ? (
              <div className="text-center text-slate-500 py-12">暂无资讯</div>
            ) : (
              <div className="space-y-3">
                {brand.news.map((item) => (
                  <a
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 rounded-xl p-4 transition-all group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-slate-200 group-hover:text-white font-medium leading-snug transition-colors line-clamp-2">
                          {item.title}
                        </h3>
                        <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                          <span>{item.source}</span>
                          <span>{item.publishedAt ? item.publishedAt.slice(0, 16).replace('T', ' ') : ''}</span>
                        </div>
                      </div>
                      <svg
                        className="w-4 h-4 text-slate-600 group-hover:text-slate-400 mt-1 flex-shrink-0 transition-colors"
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-slate-600 py-6">
        Brand Pulse · 品牌资讯每日更新
      </footer>
    </div>
  )
}

export default App
