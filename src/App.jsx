import { useState, useEffect } from 'react'

function App() {
  const [data, setData] = useState(null)
  const [activeBrand, setActiveBrand] = useState(0)
  const [loading, setLoading] = useState(true)

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
        <div className="text-xl text-slate-400">加载中...</div>
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

  const brand = data.brands[activeBrand]

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-slate-800/50 border-b border-slate-700">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-white mb-1">品牌资讯</h1>
          <p className="text-slate-400 text-sm">更新于 {data.date}</p>
        </div>
      </div>

      {/* Brand Tabs */}
      <div className="max-w-6xl mx-auto px-4 mt-6">
        <div className="flex flex-wrap gap-3">
          {data.brands.map((b, i) => (
            <button
              key={b.brandKey}
              onClick={() => setActiveBrand(i)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                i === activeBrand
                  ? 'text-white shadow-lg'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
              style={i === activeBrand ? { backgroundColor: b.brandColor } : {}}
            >
              {b.brandName}({b.news.length})
            </button>
          ))}
        </div>
      </div>

      {/* News List */}
      <div className="max-w-6xl mx-auto px-4 mt-6 pb-12">
        <h2 className="text-xl font-semibold text-white mb-4" style={{ color: brand.brandColor }}>
          {brand.brandName} 资讯
        </h2>
        <div className="space-y-4">
          {brand.news.map(item => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-slate-800/60 border border-slate-700/50 rounded-lg p-4 hover:bg-slate-800 hover:border-slate-600 transition-all group"
            >
              <h3 className="text-base font-medium text-slate-200 group-hover:text-white mb-2 line-clamp-2">
                {item.title}
              </h3>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span>{item.publishedAt.slice(0, 10)}</span>
                <span>{item.publishedAt.slice(11, 16)}</span>
                <span>{item.source}</span>
              </div>
            </a>
          ))}
        </div>
        {brand.news.length === 0 && (
          <div className="text-center text-slate-500 py-12">暂无资讯</div>
        )}
      </div>
    </div>
  )
}

export default App
