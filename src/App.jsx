import { useState, useEffect, useCallback } from 'react'

function App() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeBrand, setActiveBrand] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedNews, setExpandedNews] = useState({})

  useEffect(() => {
    fetch('/news-data.json')
      .then(res => res.json())
      .then(json => {
        setData(json)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const toggleExpand = useCallback((id) => {
    setExpandedNews(prev => ({ ...prev, [id]: !prev[id] }))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400 text-lg">加载品牌资讯中...</p>
        </div>
      </div>
    )
  }

  if (!data || !data.brands) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-400 text-lg">数据加载失败</p>
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
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-2xl font-bold text-white">品牌脉搏</h1>
              <p className="text-slate-400 text-sm">Brand Pulse · 每日品牌资讯</p>
            </div>
            {data.lastUpdated && (
              <div className="text-right text-xs text-slate-500">
                <p>更新于</p>
                <p>{new Date(data.lastUpdated).toLocaleString('zh-CN')}</p>
              </div>
            )}
          </div>
          {/* Brand Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {brands.map((brand, idx) => (
              <button
                key={brand.brandKey}
                onClick={() => { setActiveBrand(idx); setSearchQuery('') }}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  idx === activeBrand
                    ? 'text-white shadow-lg'
                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                }`}
                style={idx === activeBrand ? { backgroundColor: brand.brandColor } : {}}
              >
                {brand.brandName}
                <span className="ml-1.5 text-xs opacity-80">({brand.news.length})</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="搜索资讯..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full max-w-md px-4 py-2 rounded-lg bg-slate-800 border border-slate-600 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {brands.map((brand, idx) => (
            <div
              key={brand.brandKey}
              className={`p-3 rounded-xl border transition-all cursor-pointer ${
                idx === activeBrand
                  ? 'border-opacity-50 bg-slate-800/80'
                  : 'border-slate-700 bg-slate-800/40 hover:bg-slate-800/60'
              }`}
              style={idx === activeBrand ? { borderColor: brand.brandColor } : {}}
              onClick={() => { setActiveBrand(idx); setSearchQuery('') }}
            >
              <div className="flex items-center gap-2 mb-1">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: brand.brandColor }}
                ></div>
                <span className="text-sm font-medium text-slate-200">{brand.brandName}</span>
              </div>
              <p className="text-2xl font-bold" style={{ color: brand.brandColor }}>
                {brand.news.length}
              </p>
              <p className="text-xs text-slate-500">条资讯</p>
            </div>
          ))}
        </div>

        {/* News List */}
        {currentBrand && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: currentBrand.brandColor }}
              ></div>
              <h2 className="text-lg font-semibold text-white">{currentBrand.brandName} 最新资讯</h2>
              <span className="text-sm text-slate-400">({filteredNews.length})</span>
            </div>

            {filteredNews.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <p className="text-lg">暂无匹配的资讯</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredNews.map((news, idx) => {
                  const isExpanded = expandedNews[news.id]
                  const dateStr = new Date(news.publishedAt).toLocaleDateString('zh-CN', {
                    month: '2-digit',
                    day: '2-digit',
                  })
                  const timeStr = new Date(news.publishedAt).toLocaleTimeString('zh-CN', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })

                  return (
                    <div
                      key={news.id}
                      className="group bg-slate-800/60 rounded-xl border border-slate-700/50 hover:border-slate-600 transition-all overflow-hidden"
                    >
                      <div
                        className="p-4 cursor-pointer"
                        onClick={() => toggleExpand(news.id)}
                      >
                        <div className="flex items-start gap-3">
                          <span
                            className="text-xs font-mono text-slate-600 mt-1 shrink-0"
                          >
                            {String(idx + 1).padStart(2, '0')}
                          </span>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors leading-relaxed">
                              {news.title}
                            </h3>
                            <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                              <span>{news.source}</span>
                              <span>{dateStr}</span>
                              <span>{timeStr}</span>
                            </div>
                          </div>
                          <svg
                            className={`w-4 h-4 text-slate-500 shrink-0 mt-1 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                            fill="none" viewBox="0 0 24 24" stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                      {isExpanded && (
                        <div className="px-4 pb-4 pt-0 border-t border-slate-700/50">
                          <p className="text-sm text-slate-400 mt-3">{news.summary || news.title}</p>
                          <a
                            href={news.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 mt-3 text-xs font-medium transition-colors"
                            style={{ color: currentBrand.brandColor }}
                          >
                            阅读原文
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-xs text-slate-600">
          <p>品牌脉搏 Brand Pulse · 数据来源：新浪财经</p>
        </div>
      </footer>
    </div>
  )
}

export default App
