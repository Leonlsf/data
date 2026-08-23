import { useState, useEffect, useRef } from 'react'

const BRAND_COLORS = {
  popmart: '#FFD700',
  masterkong: '#E4002B',
  yili: '#00A650',
  threesquirrels: '#FF6B00',
}

const BRAND_NAMES = {
  popmart: '泡泡玛特',
  masterkong: '康师傅',
  yili: '伊利',
  threesquirrels: '三只松鼠',
}

const BRAND_STOCK = {
  popmart: '09992.HK',
  masterkong: '00322.HK',
  yili: '600887.SH',
  threesquirrels: '300783.SZ',
}

function App() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeBrand, setActiveBrand] = useState('popmart')
  const [searchTerm, setSearchTerm] = useState('')
  const scrollRef = useRef(null)

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
        <div className="text-2xl text-slate-400 animate-pulse">加载中...</div>
      </div>
    )
  }

  if (!data || !data.brands) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-red-400">数据加载失败</div>
      </div>
    )
  }

  const activeData = data.brands.find(b => b.brandKey === activeBrand)
  const filteredNews = activeData
    ? activeData.news.filter(n =>
        !searchTerm || n.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : []

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-amber-400 to-red-500 animate-pulse" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-red-400 bg-clip-text text-transparent">
                品牌脉搏
              </h1>
              <span className="text-xs text-slate-500 hidden sm:inline">Brand Pulse</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-400">
              <span>更新于 {data.lastUpdated?.slice(0, 10)}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Brand Tabs */}
      <div className="max-w-7xl mx-auto px-4 pt-6">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {data.brands.map(brand => (
            <button
              key={brand.brandKey}
              onClick={() => { setActiveBrand(brand.brandKey); setSearchTerm('') }}
              className={`flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeBrand === brand.brandKey
                  ? 'text-white shadow-lg'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
              style={activeBrand === brand.brandKey ? { backgroundColor: brand.brandColor } : {}}
            >
              {brand.brandName}
              <span className="ml-2 opacity-70 text-xs">({brand.news.length})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="max-w-7xl mx-auto px-4 pt-4">
        <input
          type="text"
          placeholder="搜索资讯..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50 text-sm"
        />
      </div>

      {/* News List */}
      <div className="max-w-7xl mx-auto px-4 py-6" ref={scrollRef}>
        <div className="space-y-3">
          {filteredNews.map((news, i) => (
            <a
              key={news.id || i}
              href={news.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-amber-500/30 hover:bg-slate-800 transition-all group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-slate-200 group-hover:text-amber-300 transition-colors font-medium text-sm leading-relaxed line-clamp-2">
                    {news.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                    <span style={{ color: BRAND_COLORS[activeBrand] }}>{news.source}</span>
                    <span>{news.publishedAt?.slice(0, 10)}</span>
                    <span>{news.publishedAt?.slice(11, 16)}</span>
                  </div>
                </div>
                <span className="text-slate-600 group-hover:text-amber-500 transition-colors text-lg flex-shrink-0 mt-1">→</span>
              </div>
            </a>
          ))}
        </div>
        {filteredNews.length === 0 && (
          <div className="text-center py-20 text-slate-500">暂无资讯</div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 text-center text-xs text-slate-600">
        品牌脉搏 Brand Pulse · 数据来源：新浪财经
      </footer>
    </div>
  )
}

export default App
