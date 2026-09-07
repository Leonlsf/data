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
          setActiveBrand(json.brands[0].brandKey)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-slate-400">加载中...</div>
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

  const currentBrand = data.brands.find(b => b.brandKey === activeBrand)

  return (
    <div className="min-h-screen bg-slate-900">
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
            Brand Pulse
          </h1>
          <span className="text-xs text-slate-500">
            更新于 {data.lastUpdated ? data.lastUpdated.slice(0, 10) : ''}
          </span>
        </div>
      </header>

      <nav className="max-w-6xl mx-auto px-4 py-4 flex gap-3 overflow-x-auto">
        {data.brands.map(brand => (
          <button
            key={brand.brandKey}
            onClick={() => setActiveBrand(brand.brandKey)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
              activeBrand === brand.brandKey
                ? 'text-white shadow-lg scale-105'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
            style={activeBrand === brand.brandKey ? { backgroundColor: brand.brandColor } : {}}
          >
            {brand.brandName}
            <span className="ml-2 text-xs opacity-75">
              ({brand.news.length})
            </span>
          </button>
        ))}
      </nav>

      <main className="max-w-6xl mx-auto px-4 pb-12">
        {currentBrand && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: currentBrand.brandColor }}
              />
              <h2 className="text-xl font-semibold">
                {currentBrand.brandName} 资讯
              </h2>
            </div>

            {currentBrand.news.length === 0 ? (
              <div className="text-slate-500 text-center py-12">暂无资讯数据</div>
            ) : (
              <div className="space-y-3">
                {currentBrand.news.map(item => (
                  <a
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 hover:bg-slate-800 hover:border-slate-600 transition-all group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-slate-200 group-hover:text-white transition-colors font-medium leading-snug">
                          {item.title}
                        </h3>
                        <p className="text-slate-500 text-sm mt-1 line-clamp-1">
                          {item.summary}
                        </p>
                      </div>
                      <span className="text-xs text-slate-600 whitespace-nowrap mt-1">
                        {item.publishedAt ? item.publishedAt.slice(0, 10) : ''}
                      </span>
                    </div>
                    <div className="mt-2 text-xs text-slate-600">
                      {item.source}
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default App
