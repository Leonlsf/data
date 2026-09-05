import { useState, useEffect, useRef } from 'react'

const BRAND_CONFIG = {
  popmart: { name: '泡泡玛特', color: '#FFD700', icon: '🎨' },
  masterkong: { name: '康师傅', color: '#E4002B', icon: '🍜' },
  yili: { name: '伊利', color: '#00A650', icon: '🥛' },
  threesquirrels: { name: '三只松鼠', color: '#FF6B00', icon: '🐿️' },
}

function App() {
  const [data, setData] = useState(null)
  const [activeBrand, setActiveBrand] = useState('popmart')
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const scrollRef = useRef(null)

  useEffect(() => {
    fetch('/news-data.json')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
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
  const currentBrand = brands.find(b => b.brandKey === activeBrand) || brands[0]
  const config = BRAND_CONFIG[currentBrand.brandKey] || {}

  let filteredNews = currentBrand.news || []
  if (searchTerm) {
    filteredNews = filteredNews.filter(n =>
      n.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  const totalNews = brands.reduce((sum, b) => sum + (b.news?.length || 0), 0)

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return `${d.getMonth()+1}月${d.getDate()}日`
  }

  const formatTime = (dateStr) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center text-xl font-bold text-slate-900">BP</div>
              <div>
                <h1 className="text-xl font-bold text-white">品牌脉搏</h1>
                <p className="text-xs text-slate-500">Brand Pulse Daily</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-sm text-slate-400">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span>{totalNews} 条资讯</span>
              </div>
              <div className="text-xs text-slate-500">
                {data.date ? `更新于 ${data.date}` : ''}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Brand Tabs */}
      <div className="bg-slate-900/50 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto py-2 scrollbar-hide" ref={scrollRef}>
            {brands.map(brand => {
              const bc = BRAND_CONFIG[brand.brandKey] || {}
              const isActive = activeBrand === brand.brandKey
              return (
                <button
                  key={brand.brandKey}
                  onClick={() => { setActiveBrand(brand.brandKey); setSearchTerm('') }}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? 'text-white shadow-lg'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                  style={isActive ? { backgroundColor: bc.color + '20', borderBottom: `2px solid ${bc.color}` } : {}}
                >
                  <span>{bc.icon}</span>
                  <span>{bc.name || brand.brandName}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white/10' : 'bg-slate-800'}`}>
                    {brand.news?.length || 0}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="max-w-7xl mx-auto px-4 pt-4">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="搜索资讯..."
            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2.5 pl-10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-slate-600"
          />
          <svg className="absolute left-3 top-3 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* News Stats */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {brands.map(brand => {
            const bc = BRAND_CONFIG[brand.brandKey] || {}
            return (
              <div key={brand.brandKey} className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{bc.icon}</span>
                  <span className="text-sm font-medium text-slate-300">{bc.name || brand.brandName}</span>
                </div>
                <div className="text-2xl font-bold" style={{ color: bc.color }}>{brand.news?.length || 0}</div>
                <div className="text-xs text-slate-500 mt-1">条资讯</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* News List */}
      <main className="max-w-7xl mx-auto px-4 pb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <span className="w-1 h-6 rounded-full" style={{ backgroundColor: config.color }}></span>
            {config.name || currentBrand.brandName} 最新资讯
            <span className="text-sm font-normal text-slate-500">({filteredNews.length})</span>
          </h2>
        </div>

        {filteredNews.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-500 text-lg">暂无资讯</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNews.map((news, idx) => (
              <a
                key={news.id || idx}
                href={news.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-slate-800/30 border border-slate-700/50 rounded-xl p-4 hover:bg-slate-800/60 hover:border-slate-600/50 transition-all group"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold mt-0.5" style={{ backgroundColor: config.color + '20', color: config.color }}>
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors line-clamp-2 leading-relaxed">
                      {news.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                      <span>{news.source}</span>
                      <span>{formatDate(news.publishedAt)}</span>
                      <span>{formatTime(news.publishedAt)}</span>
                    </div>
                  </div>
                  <svg className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </a>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900/50 border-t border-slate-800 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-600">
          品牌脉搏 Brand Pulse &copy; {new Date().getFullYear()} · 数据来源：新浪财经
        </div>
      </footer>
    </div>
  )
}

export default App
