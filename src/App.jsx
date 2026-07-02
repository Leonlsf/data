import { useState, useEffect } from 'react'

function App() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetch('/news-data.json')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(d => { setData(d); setLoading(false) })
      .catch(e => { setError(e.message); setLoading(false) })
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-gray-600 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-gray-400 text-lg">加载中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950">
        <div className="bg-red-900/30 border border-red-700 rounded-xl p-8 max-w-md text-center">
          <p className="text-red-400 text-xl mb-2">加载失败</p>
          <p className="text-red-300/70">{error}</p>
        </div>
      </div>
    )
  }

  const brands = filter === 'all' ? data.brands : data.brands.filter(b => b.brandKey === filter)

  const formatDate = (d) => {
    try {
      return new Date(d).toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
    } catch { return d }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                品牌资讯 <span className="text-blue-400">Brand Pulse</span>
              </h1>
              {data.lastUpdated && (
                <p className="text-sm text-gray-500 mt-1">最后更新：{formatDate(data.lastUpdated)}</p>
              )}
            </div>
            <p className="text-xs text-gray-600">{data.date}</p>
          </div>
          <nav className="flex flex-wrap gap-2 mt-5">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                filter === 'all'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
              }`}
            >
              全部
            </button>
            {data.brands.map(b => (
              <button
                key={b.brandKey}
                onClick={() => setFilter(b.brandKey)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  filter === b.brandKey
                    ? 'text-white shadow-lg'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
                }`}
                style={filter === b.brandKey ? { backgroundColor: b.brandColor, boxShadow: `0 10px 25px -5px ${b.brandColor}40` } : {}}
              >
                {b.brandName}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {brands.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-lg">暂无匹配品牌</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {brands.map(brand => (
              <BrandCard key={brand.brandKey} brand={brand} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

function BrandCard({ brand }) {
  const { brandName, brandColor, news } = brand

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden transition-all hover:border-gray-700">
      <div className="px-6 py-4 flex items-center gap-3 border-b border-gray-800">
        <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: brandColor }} />
        <h2 className="text-lg font-semibold">{brandName}</h2>
        <span className="ml-auto text-xs text-gray-500">{news.length} 条资讯</span>
      </div>
      <div className="divide-y divide-gray-800/60">
        {news.length === 0 ? (
          <div className="px-6 py-10 text-center text-gray-600 text-sm">暂无资讯</div>
        ) : (
          news.map((item, i) => (
            <article key={i} className="px-6 py-4 hover:bg-gray-800/40 transition-colors">
              <a href={item.url || '#'} target="_blank" rel="noopener noreferrer" className="block group">
                <h3 className="font-medium group-hover:underline underline-offset-2 transition-colors" style={{ color: brandColor }}>
                  {item.title}
                </h3>
              </a>
              {item.summary && <p className="text-sm text-gray-400 mt-1.5 line-clamp-2">{item.summary}</p>}
              <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                {item.source && <span>{item.source}</span>}
                {item.publishedAt && <span>{new Date(item.publishedAt).toLocaleDateString('zh-CN')}</span>}
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  )
}

export default App
