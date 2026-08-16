import { useState, useEffect } from 'react'

function App() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedBrand, setSelectedBrand] = useState(null)

  useEffect(() => {
    fetch('/news-data.json')
      .then(r => r.json())
      .then(d => {
        setData(d)
        setSelectedBrand(d?.brands?.[0]?.brandKey || null)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-400">加载中...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">暂无数据</p>
      </div>
    )
  }

  const currentBrand = data.brands.find(b => b.brandKey === selectedBrand)

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Header */}
      <header className="border-b border-white/5 backdrop-blur-xl bg-black/40 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-white">品牌资讯</h1>
            <span className="text-xs text-gray-500 ml-2">Brand Pulse</span>
          </div>
          <div className="text-xs text-gray-500">
            更新于 {data.lastUpdated?.replace('T', ' ').slice(0, 19)}
          </div>
        </div>
      </header>

      {/* Brand Tabs */}
      <div className="border-b border-white/5 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex gap-1 overflow-x-auto py-2 scrollbar-hide">
            {data.brands.map(brand => (
              <button
                key={brand.brandKey}
                onClick={() => setSelectedBrand(brand.brandKey)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  selectedBrand === brand.brandKey
                    ? 'text-white shadow-lg'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                }`}
                style={selectedBrand === brand.brandKey ? { backgroundColor: brand.brandColor + '20', borderLeft: `3px solid ${brand.brandColor}` } : {}}
              >
                {brand.brandName}
                <span className="ml-2 text-xs opacity-60">({brand.news.length})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* News List */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {currentBrand && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: currentBrand.brandColor }}></div>
              <h2 className="text-lg font-semibold text-white">{currentBrand.brandName} 资讯</h2>
              <span className="text-sm text-gray-500">共 {currentBrand.news.length} 条</span>
            </div>
            <div className="grid gap-3">
              {currentBrand.news.map(item => (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">{item.summary}</p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <div className="text-xs text-gray-600">{item.publishedAt?.slice(0, 10)}</div>
                      <div className="text-xs text-gray-700">{item.publishedAt?.slice(11, 16)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-gray-500">{item.source}</span>
                    <svg className="w-3 h-3 text-gray-600 group-hover:text-gray-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                </a>
              ))}
              {currentBrand.news.length === 0 && (
                <div className="text-center py-12 text-gray-500">暂无资讯</div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-6 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center text-xs text-gray-600">
          数据来源：新浪财经 · 自动采集更新
        </div>
      </footer>
    </div>
  )
}

export default App
