import { useState, useEffect } from 'react'

const BRAND_CONFIG = {
  popmart: { name: '泡泡玛特', color: '#FFD700', icon: '🎨' },
  masterkong: { name: '康师傅', color: '#E4002B', icon: '🍜' },
  yili: { name: '伊利', color: '#00A650', icon: '🥛' },
  threesquirrels: { name: '三只松鼠', color: '#FF6B00', icon: '🐿️' },
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `${d.getMonth() + 1}月${d.getDate()}日`
}

function formatTime(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

function timeAgo(dateStr) {
  if (!dateStr) return ''
  const now = new Date()
  const d = new Date(dateStr)
  const diff = Math.floor((now - d) / 1000)
  if (diff < 60) return '刚刚'
  if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`
  if (diff < 86400) return `${Math.floor(diff / 3600)}小时前`
  if (diff < 2592000) return `${Math.floor(diff / 86400)}天前`
  return formatDate(dateStr)
}

function App() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeBrand, setActiveBrand] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/news-data.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load data')
        return res.json()
      })
      .then(json => {
        setData(json)
        if (json.brands && json.brands.length > 0) {
          setActiveBrand(json.brands[0].brandKey)
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
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-slate-400">加载品牌资讯中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-400">加载失败: {error}</p>
      </div>
    )
  }

  const brands = data?.brands || []
  const activeBrandData = brands.find(b => b.brandKey === activeBrand)

  const totalNews = brands.reduce((sum, b) => sum + (b.news?.length || 0), 0)

  return (
    <div className="min-h-screen bg-[#0f172a]">
      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">BP</div>
            <h1 className="text-lg font-semibold text-white">Brand Pulse</h1>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-400">
            <span>{data?.date}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{totalNews} 条资讯</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Brand Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {brands.map(brand => {
            const config = BRAND_CONFIG[brand.brandKey] || {}
            const isActive = activeBrand === brand.brandKey
            return (
              <button
                key={brand.brandKey}
                onClick={() => setActiveBrand(brand.brandKey)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'text-white shadow-lg'
                    : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 hover:text-slate-300'
                }`}
                style={isActive ? { backgroundColor: brand.brandColor, boxShadow: `0 4px 14px ${brand.brandColor}40` } : {}}
              >
                <span>{config.icon}</span>
                <span>{config.name || brand.brandName}</span>
                <span className={`ml-1 px-1.5 py-0.5 rounded-md text-xs ${
                  isActive ? 'bg-white/20' : 'bg-slate-700/50'
                }`}>
                  {brand.news?.length || 0}
                </span>
              </button>
            )
          })}
        </div>

        {/* Active Brand News */}
        {activeBrandData && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-1 h-6 rounded-full"
                style={{ backgroundColor: activeBrandData.brandColor }}
              ></div>
              <h2 className="text-xl font-semibold text-white">
                {BRAND_CONFIG[activeBrandData.brandKey]?.name || activeBrandData.brandName} 最新资讯
              </h2>
            </div>

            {activeBrandData.news && activeBrandData.news.length > 0 ? (
              <div className="grid gap-3">
                {activeBrandData.news.map((item, idx) => (
                  <a
                    key={item.id || idx}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block bg-slate-800/40 border border-slate-700/40 rounded-xl p-4 hover:bg-slate-800/70 hover:border-slate-600/50 transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors line-clamp-2 mb-1.5">
                          {item.title}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-1">
                          {item.summary}
                        </p>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <div className="text-xs text-slate-500 mb-0.5">{formatDate(item.publishedAt)}</div>
                        <div className="text-xs text-slate-600">{formatTime(item.publishedAt)}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-slate-600">{item.source}</span>
                      <span className="text-xs text-slate-700">·</span>
                      <span className="text-xs text-slate-600">{timeAgo(item.publishedAt)}</span>
                      <svg className="w-3 h-3 text-slate-600 group-hover:text-slate-400 ml-auto transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500">
                暂无资讯
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 mt-8">
        <div className="max-w-6xl mx-auto px-4 py-4 text-center text-xs text-slate-600">
          Brand Pulse · 数据更新于 {data?.lastUpdated?.replace('T', ' ').replace('+08:00', '')}
        </div>
      </footer>
    </div>
  )
}

export default App
