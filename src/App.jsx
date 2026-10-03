import { useState, useEffect } from 'react'

const BRAND_ICONS = {
  popmart: '🎰',
  masterkong: '🍜',
  yili: '🥛',
  threesquirrels: '🐿️',
}

function App() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeBrand, setActiveBrand] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetch('/news-data.json')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white text-xl animate-pulse">加载中...</div>
      </div>
    )
  }

  if (!data || !data.brands) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-red-400 text-xl">数据加载失败</div>
      </div>
    )
  }

  const brands = data.brands
  const currentBrand = brands[activeBrand]
  const filteredNews = currentBrand
    ? currentBrand.news.filter(n =>
        !searchTerm || n.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : []

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              品牌资讯 Brand Pulse
            </h1>
            <div className="text-sm text-gray-400">
              更新于 {data.lastUpdated ? data.lastUpdated.slice(0, 10) : '-'}
            </div>
          </div>
          {/* Brand Tabs */}
          <div className="flex gap-2 mt-4 overflow-x-auto">
            {brands.map((brand, i) => (
              <button
                key={brand.brandKey}
                onClick={() => { setActiveBrand(i); setSearchTerm(''); }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  i === activeBrand
                    ? 'bg-white/10 text-white shadow-lg'
                    : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                }`}
                style={i === activeBrand ? { borderBottom: `2px solid ${brand.brandColor}` } : {}}
              >
                <span className="mr-1">{BRAND_ICONS[brand.brandKey] || '📌'}</span>
                {brand.brandName}
                <span className="ml-2 text-xs opacity-60">({brand.news.length})</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {currentBrand && (
          <>
            {/* Brand Header */}
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                style={{ backgroundColor: currentBrand.brandColor + '22', border: `1px solid ${currentBrand.brandColor}44` }}
              >
                {BRAND_ICONS[currentBrand.brandKey] || '📌'}
              </div>
              <div>
                <h2 className="text-xl font-semibold" style={{ color: currentBrand.brandColor }}>
                  {currentBrand.brandName}
                </h2>
                <p className="text-sm text-gray-500">
                  共 {currentBrand.news.length} 条资讯
                  {searchTerm && ` · 筛选结果: ${filteredNews.length} 条`}
                </p>
              </div>
            </div>

            {/* Search */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="搜索资讯..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full max-w-md bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-gray-500"
              />
            </div>

            {/* News List */}
            <div className="space-y-3">
              {filteredNews.length === 0 ? (
                <div className="text-center text-gray-500 py-12">暂无资讯</div>
              ) : (
                filteredNews.map(item => (
                  <a
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-gray-900/60 border border-gray-800 rounded-lg p-4 hover:bg-gray-900 hover:border-gray-700 transition-all group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">{item.summary}</p>
                      </div>
                      <div className="flex-shrink-0 text-xs text-gray-500 whitespace-nowrap">
                        {item.publishedAt ? item.publishedAt.slice(0, 16).replace('T', ' ') : ''}
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-600">{item.source}</div>
                  </a>
                ))
              )}
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-xs text-gray-600">
          Brand Pulse · 数据来源：新浪财经 · 自动采集更新
        </div>
      </footer>
    </div>
  )
}

export default App
