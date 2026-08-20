import { useState, useEffect } from 'react'

function App() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeBrand, setActiveBrand] = useState(null)

  useEffect(() => {
    fetch('/news-data.json')
      .then(res => res.json())
      .then(json => {
        setData(json)
        if (json.brands && json.brands.length > 0) {
          setActiveBrand(0)
        }
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

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return `${d.getMonth() + 1}月${d.getDate()}日`
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800/80 backdrop-blur border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              品牌资讯
            </h1>
            {data.lastUpdated && (
              <span className="text-sm text-slate-400">
                更新于 {data.lastUpdated.slice(0, 16).replace('T', ' ')}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Brand Tabs */}
      <div className="max-w-6xl mx-auto px-4 mt-6">
        <div className="flex gap-3 flex-wrap">
          {data.brands.map((brand, idx) => (
            <button
              key={brand.brandKey}
              onClick={() => setActiveBrand(idx)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                activeBrand === idx
                  ? 'text-white shadow-lg scale-105'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
              style={activeBrand === idx ? { backgroundColor: brand.brandColor } : {}}
            >
              {brand.brandName}
              <span className="ml-2 text-xs opacity-80">({brand.news?.length || 0})</span>
            </button>
          ))}
        </div>
      </div>

      {/* News List */}
      <main className="max-w-6xl mx-auto px-4 mt-6 pb-12">
        {activeBrand !== null && data.brands[activeBrand] && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: data.brands[activeBrand].brandColor }}
              />
              <h2 className="text-lg font-semibold text-slate-200">
                {data.brands[activeBrand].brandName} 最新资讯
              </h2>
            </div>

            {data.brands[activeBrand].news && data.brands[activeBrand].news.length > 0 ? (
              <div className="space-y-3">
                {data.brands[activeBrand].news.map((item) => (
                  <a
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 rounded-xl p-4 transition-all group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-slate-200 group-hover:text-white font-medium leading-snug line-clamp-2 transition-colors">
                          {item.title}
                        </h3>
                        <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                          <span>{item.source}</span>
                          <span>{formatDate(item.publishedAt)}</span>
                          {item.publishedAt && (
                            <span>{item.publishedAt.slice(11, 16)}</span>
                          )}
                        </div>
                      </div>
                      <svg
                        className="w-4 h-4 text-slate-500 group-hover:text-slate-300 mt-1 flex-shrink-0 transition-colors"
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <div className="text-center text-slate-400 py-12">暂无资讯数据</div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default App
