import { useState, useEffect } from 'react'

function App() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeBrand, setActiveBrand] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetch('/news-data.json')
      .then(res => res.json())
      .then(json => {
        setData(json)
        setLoading(false)
      })
      .catch(() => setLoading(false))
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

  const brands = data.brands
  const currentBrand = brands[activeBrand]
  const filteredNews = currentBrand
    ? currentBrand.news.filter(n =>
        !searchQuery || n.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : []

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              品牌脉搏
            </h1>
            <div className="text-sm text-slate-400">
              更新于 {data.lastUpdated?.split('T')[0] || '—'}
            </div>
          </div>
          {/* Brand Tabs */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
            {brands.map((brand, i) => (
              <button
                key={brand.brandKey}
                onClick={() => { setActiveBrand(i); setSearchQuery('') }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  i === activeBrand
                    ? 'text-white shadow-lg'
                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                }`}
                style={i === activeBrand ? { backgroundColor: brand.brandColor } : {}}
              >
                {brand.brandName}
                <span className="ml-1.5 text-xs opacity-80">({brand.news.length})</span>
              </button>
            ))}
          </div>
          {/* Search */}
          <div className="mt-3">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="搜索资讯..."
              className="w-full max-w-md px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-slate-500"
            />
          </div>
        </div>
      </header>

      {/* News List */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {currentBrand && (
          <>
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: currentBrand.brandColor }}
              />
              <h2 className="text-xl font-semibold text-slate-200">
                {currentBrand.brandName} 资讯
              </h2>
              <span className="text-sm text-slate-500">
                共 {filteredNews.length} 条
              </span>
            </div>
            <div className="space-y-3">
              {filteredNews.map(item => (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-slate-800/60 border border-slate-700/50 rounded-lg p-4 hover:bg-slate-800 hover:border-slate-600 transition-all group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-slate-200 font-medium group-hover:text-white transition-colors line-clamp-2">
                        {item.title}
                      </h3>
                      {item.summary && item.summary !== item.title && (
                        <p className="text-sm text-slate-400 mt-1 line-clamp-1">
                          {item.summary}
                        </p>
                      )}
                    </div>
                    <div className="flex-shrink-0 text-xs text-slate-500 mt-1">
                      {item.publishedAt?.split('T')[0]}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                    <span>{item.source}</span>
                    <span>·</span>
                    <span>{item.publishedAt?.split('T')[1]?.split('+')[0]}</span>
                  </div>
                </a>
              ))}
            </div>
            {filteredNews.length === 0 && (
              <div className="text-center text-slate-500 py-12">
                暂无匹配的资讯
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 text-center text-sm text-slate-500">
        品牌脉搏 — 数据来源：新浪财经
      </footer>
    </div>
  )
}

export default App
