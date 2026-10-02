import { useState, useEffect } from 'react'

function App() {
  const [data, setData] = useState(null)
  const [activeBrand, setActiveBrand] = useState(null)
  const [loading, setLoading] = useState(true)

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

  const currentBrand = data.brands.find(b => b.brandKey === activeBrand)

  return (
    <div className="min-h-screen bg-slate-900">
      <header className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
            品牌资讯 Brand Pulse
          </h1>
          <div className="text-sm text-slate-400">
            更新于 {data.lastUpdated ? data.lastUpdated.replace('T', ' ').slice(0, 19) : '-'}
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 mt-6">
        <div className="flex gap-3 flex-wrap">
          {data.brands.map(brand => (
            <button
              key={brand.brandKey}
              onClick={() => setActiveBrand(brand.brandKey)}
              className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 border-2 ${
                activeBrand === brand.brandKey
                  ? 'text-white shadow-lg scale-105'
                  : 'bg-slate-800 text-slate-300 border-slate-600 hover:bg-slate-700'
              }`}
              style={
                activeBrand === brand.brandKey
                  ? { backgroundColor: brand.brandColor, borderColor: brand.brandColor }
                  : {}
              }
            >
              {brand.brandName}
              <span className="ml-2 text-xs opacity-80">({brand.news.length})</span>
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-6 pb-12">
        {currentBrand && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: currentBrand.brandColor }}
              />
              <h2 className="text-lg font-semibold text-slate-200">
                {currentBrand.brandName} 最新资讯
              </h2>
            </div>

            {currentBrand.news.length === 0 ? (
              <div className="text-slate-500 py-8 text-center">暂无资讯</div>
            ) : (
              <div className="space-y-3">
                {currentBrand.news.map(item => (
                  <a
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-slate-800 border border-slate-700 rounded-lg p-4 hover:bg-slate-750 hover:border-slate-600 transition-all duration-200 group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-slate-200 font-medium group-hover:text-white transition-colors line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="text-slate-500 text-sm mt-1 line-clamp-1">
                          {item.summary}
                        </p>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <div className="text-xs text-slate-500">
                          {item.publishedAt?.slice(0, 10)}
                        </div>
                        <div className="text-xs text-slate-600 mt-1">
                          {item.publishedAt?.slice(11, 16)}
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <span
                        className="inline-block px-2 py-0.5 rounded text-xs font-medium"
                        style={{
                          backgroundColor: currentBrand.brandColor + '20',
                          color: currentBrand.brandColor,
                        }}
                      >
                        {item.source}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default App
