import { useState, useEffect } from 'react'

function App() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedBrand, setSelectedBrand] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetch('/news-data.json')
      .then(res => res.json())
      .then(json => {
        setData(json)
        setSelectedBrand(json.brands?.[0]?.brandKey || null)
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
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-slate-400 text-lg">加载资讯中...</p>
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

  const currentBrand = data.brands.find(b => b.brandKey === selectedBrand)
  const filteredNews = currentBrand?.news?.filter(item =>
    !searchQuery || item.title?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || []

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">品牌资讯</h1>
              <p className="text-sm text-slate-400 mt-1">
                更新时间：{data.lastUpdated ? new Date(data.lastUpdated).toLocaleString('zh-CN') : '—'}
              </p>
            </div>
            <div className="w-64">
              <input
                type="text"
                placeholder="搜索资讯..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white placeholder-slate-400 border border-slate-600 focus:outline-none focus:border-yellow-400 text-sm"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Brand Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex gap-2 flex-wrap">
          {data.brands.map(brand => (
            <button
              key={brand.brandKey}
              onClick={() => { setSelectedBrand(brand.brandKey); setSearchQuery(''); }}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                selectedBrand === brand.brandKey
                  ? 'text-white shadow-lg scale-105'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
              style={selectedBrand === brand.brandKey ? { backgroundColor: brand.brandColor } : {}}
            >
              {brand.brandName}
              <span className="ml-2 opacity-75">({brand.news?.length || 0})</span>
            </button>
          ))}
        </div>
      </div>

      {/* News List */}
      <main className="max-w-7xl mx-auto px-4 pb-12">
        {currentBrand && (
          <>
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: currentBrand.brandColor }}
              ></div>
              <h2 className="text-xl font-semibold text-white">{currentBrand.brandName} 资讯</h2>
              <span className="text-slate-400 text-sm">共 {filteredNews.length} 条</span>
            </div>

            {filteredNews.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <p className="text-lg">暂无资讯</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {filteredNews.map(item => (
                  <a
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 hover:bg-slate-800 hover:border-slate-600 transition-all group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-medium group-hover:text-yellow-300 transition-colors line-clamp-2 text-sm">
                          {item.title}
                        </h3>
                        {item.summary && item.summary !== item.title && (
                          <p className="text-slate-400 text-xs mt-1 line-clamp-1">{item.summary}</p>
                        )}
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <span className="text-slate-500 text-xs">
                          {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }) : ''}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-700/80 text-slate-400">
                        {item.source || '新浪财经'}
                      </span>
                      <span className="text-xs text-slate-500">
                        {item.publishedAt ? new Date(item.publishedAt).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 text-center text-slate-500 text-sm">
        Brand Pulse &copy; {new Date().getFullYear()} — 品牌资讯每日更新
      </footer>
    </div>
  )
}

export default App
