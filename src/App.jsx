import { useState, useEffect } from 'react'

const BRAND_CONFIG = {
  popmart: { name: '泡泡玛特', color: '#FFD700', icon: '🎨' },
  masterkong: { name: '康师傅', color: '#E4002B', icon: '🍜' },
  yili: { name: '伊利', color: '#00A650', icon: '🥛' },
  threesquirrels: { name: '三只松鼠', color: '#FF6B00', icon: '🐿️' },
}

function formatRelativeTime(publishedAt) {
  if (!publishedAt) return ''
  const now = new Date()
  const pub = new Date(publishedAt)
  const diffMs = now - pub
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  if (diffMins < 1) return '刚刚'
  if (diffMins < 60) return `${diffMins}分钟前`
  if (diffHours < 24) return `${diffHours}小时前`
  if (diffDays < 30) return `${diffDays}天前`
  return publishedAt.slice(0, 10)
}

function App() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/news-data.json')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      setData(json)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-sky-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400 text-lg">加载品牌资讯中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center bg-red-900/20 border border-red-800 rounded-xl p-8 max-w-md">
          <p className="text-red-400 text-lg mb-4">数据加载失败</p>
          <p className="text-red-300 text-sm mb-4">{error}</p>
          <button onClick={fetchData} className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition">重试</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800/80 backdrop-blur border-b border-slate-700 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">品牌脉搏</h1>
            <p className="text-slate-400 text-sm mt-0.5">
              {data?.lastUpdated ? `最近更新: ${data.lastUpdated.replace('T', ' ').slice(0, 19)}` : 'Brand Pulse'}
            </p>
          </div>
          <button onClick={fetchData} className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 rounded-lg text-white text-sm transition flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            刷新
          </button>
        </div>
      </header>

      {/* Brand Cards */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data?.brands?.map((brand) => {
            const config = BRAND_CONFIG[brand.brandKey] || {}
            return (
              <div key={brand.brandKey} className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden hover:border-slate-600 transition">
                {/* Brand Header */}
                <div className="px-5 py-4 border-b border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-8 rounded-full" style={{ backgroundColor: brand.brandColor || config.color }}></div>
                    <div>
                      <h2 className="text-lg font-semibold text-white">{brand.brandName}</h2>
                      <p className="text-slate-400 text-xs mt-0.5">{config.icon || '📊'} {brand.brandKey}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 text-xs font-medium rounded-full" style={{ backgroundColor: `${brand.brandColor || config.color}20`, color: brand.brandColor || config.color }}>
                    {brand.news?.length || 0} 条资讯
                  </span>
                </div>
                {/* News List */}
                <div className="px-5 py-3">
                  {(brand.news || []).slice(0, 5).map((item) => (
                    <a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer"
                       className="block py-3 border-b border-slate-700/50 last:border-0 hover:bg-slate-700/30 -mx-5 px-5 transition group">
                      <p className="text-sm text-slate-200 group-hover:text-white transition line-clamp-2 mb-1.5">{item.title}</p>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="px-1.5 py-0.5 bg-slate-700 rounded text-slate-400">{item.source}</span>
                        <span>{formatRelativeTime(item.publishedAt)}</span>
                      </div>
                    </a>
                  ))}
                  {(!brand.news || brand.news.length === 0) && (
                    <p className="text-slate-500 text-sm py-6 text-center">暂无资讯</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 mt-8">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-slate-500 text-sm">
          品牌脉搏 Brand Pulse · 数据来源: 新浪财经
        </div>
      </footer>
    </div>
  )
}

export default App
