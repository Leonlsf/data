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

  const currentBrand = data.brands.find(b => b.brandKey === activeBrand)

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 border-b border-slate-700/50 sticky top-0 z-10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Brand Pulse
              </span>
              <span className="text-slate-400 text-lg ml-2">品牌资讯</span>
            </h1>
            <div className="text-sm text-slate-400">
              更新于: {data.lastUpdated ? new Date(data.lastUpdated).toLocaleString('zh-CN') : '-'}
            </div>
          </div>
        </div>
      </header>

      {/* Brand Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex gap-3 flex-wrap">
          {data.brands.map(brand => (
            <button
              key={brand.brandKey}
              onClick={() => setActiveBrand(brand.brandKey)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                activeBrand === brand.brandKey
                  ? 'text-white shadow-lg scale-105'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
              style={activeBrand === brand.brandKey ? { backgroundColor: brand.brandColor } : {}}
            >
              {brand.brandName}
              <span className="ml-2 text-xs opacity-75">({brand.news.length})</span>
            </button>
          ))}
        </div>
      </div>

      {/* News List */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
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
            <div className="grid gap-3">
              {currentBrand.news.map((item, index) => (
                <a
                  key={item.id || index}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-slate-800/60 border border-slate-700/50 rounded-lg p-4 hover:bg-slate-800 hover:border-slate-600 transition-all duration-200 group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-slate-200 font-medium group-hover:text-white transition-colors line-clamp-2">
                        {item.title}
                      </h3>
                      {item.summary && item.summary !== item.title && (
                        <p className="text-slate-400 text-sm mt-1 line-clamp-1">{item.summary}</p>
                      )}
                    </div>
                    <div className="flex-shrink-0 text-xs text-slate-500 whitespace-nowrap">
                      {item.publishedAt && new Date(item.publishedAt).toLocaleDateString('zh-CN')}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-slate-500">{item.source}</span>
                  </div>
                </a>
              ))}
              {currentBrand.news.length === 0 && (
                <div className="text-center py-12 text-slate-500">暂无资讯</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
