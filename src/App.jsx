import { useState, useEffect } from 'react'

function App() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeBrand, setActiveBrand] = useState(0)
  const [expandedBrand, setExpandedBrand] = useState(null)

  useEffect(() => {
    fetch('/news-data.json')
      .then(res => res.json())
      .then(json => {
        setData(json)
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

  const formatDate = (dateStr) => {
    return dateStr.replace(/T.+$/, '')
  }

  const formatTime = (publishedAt) => {
    const match = publishedAt.match(/T(\d{2}:\d{2})/)
    return match ? match[1] : ''
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-white">品牌资讯</h1>
          <p className="text-sm text-slate-400 mt-1">
            更新于 {data.date || data.lastUpdated?.split('T')[0]}
          </p>
        </div>
      </header>

      {/* Brand Tabs */}
      <div className="max-w-6xl mx-auto px-4 mt-4">
        <div className="flex flex-wrap gap-2">
          {data.brands.map((brand, index) => (
            <button
              key={brand.brandKey}
              onClick={() => setActiveBrand(index)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeBrand === index
                  ? 'text-white shadow-lg'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
              style={activeBrand === index ? { backgroundColor: brand.brandColor } : {}}
            >
              {brand.brandName}({brand.news?.length || 0})
            </button>
          ))}
        </div>
      </div>

      {/* News List */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {data.brands.map((brand, brandIndex) => (
          <div
            key={brand.brandKey}
            className={activeBrand === brandIndex ? 'block' : 'hidden'}
          >
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full inline-block"
                style={{ backgroundColor: brand.brandColor }}
              ></span>
              {brand.brandName} 资讯
            </h2>

            <div className="space-y-3">
              {brand.news?.map((item) => (
                <article
                  key={item.id}
                  className="bg-slate-800 rounded-lg p-4 hover:bg-slate-750 transition-colors border border-slate-700 hover:border-slate-600"
                >
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <h3 className="text-base font-semibold text-slate-100 hover:text-blue-400 transition-colors leading-snug">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                      <span>{formatDate(item.publishedAt)}</span>
                      <span>{formatTime(item.publishedAt)}</span>
                      <span className="text-slate-600">|</span>
                      <span>{item.source}</span>
                    </div>
                  </a>
                </article>
              ))}
            </div>

            {(!brand.news || brand.news.length === 0) && (
              <div className="text-center text-slate-500 py-12">暂无资讯</div>
            )}
          </div>
        ))}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 mt-8 py-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-slate-600">
          Brand Pulse - 品牌资讯每日更新
        </div>
      </footer>
    </div>
  )
}

export default App
