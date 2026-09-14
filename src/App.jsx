import { useState, useEffect } from 'react'

function App() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeBrand, setActiveBrand] = useState(0)

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

  const brands = data.brands
  const currentBrand = brands[activeBrand]

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-white">品牌资讯 Brand Pulse</h1>
          <p className="text-sm text-slate-400 mt-1">
            数据更新: {data.lastUpdated ? new Date(data.lastUpdated).toLocaleString('zh-CN') : '-'}
          </p>
        </div>
      </header>

      {/* Brand Tabs */}
      <div className="max-w-7xl mx-auto px-4 mt-6">
        <div className="flex gap-3 flex-wrap">
          {brands.map((brand, idx) => (
            <button
              key={brand.brandKey}
              onClick={() => setActiveBrand(idx)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                idx === activeBrand
                  ? 'text-white shadow-lg'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
              style={idx === activeBrand ? { backgroundColor: brand.brandColor } : {}}
            >
              {brand.brandName}
              <span className="ml-2 opacity-80">({brand.news?.length || 0})</span>
            </button>
          ))}
        </div>
      </div>

      {/* News List */}
      <div className="max-w-7xl mx-auto px-4 mt-6 pb-12">
        {currentBrand && currentBrand.news && currentBrand.news.length > 0 ? (
          <div className="space-y-3">
            {currentBrand.news.map((item) => (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-slate-800 rounded-lg p-4 hover:bg-slate-750 border border-slate-700 hover:border-slate-600 transition-all group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-slate-100 font-medium group-hover:text-white transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-slate-400 text-sm mt-1 line-clamp-1">{item.summary}</p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: currentBrand.brandColor + '20', color: currentBrand.brandColor }}>
                      {item.source}
                    </span>
                  </div>
                </div>
                <div className="text-slate-500 text-xs mt-2">
                  {new Date(item.publishedAt).toLocaleString('zh-CN')}
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center text-slate-400 py-20">暂无资讯</div>
        )}
      </div>
    </div>
  )
}

export default App
