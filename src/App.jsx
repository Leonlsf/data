import { useState, useEffect, useRef } from 'react'

const BRANDS = [
  { brandName: '泡泡玛特', brandKey: 'popmart', brandColor: '#FFD700' },
  { brandName: '康师傅', brandKey: 'masterkong', brandColor: '#E4002B' },
  { brandName: '伊利', brandKey: 'yili', brandColor: '#00A650' },
  { brandName: '三只松鼠', brandKey: 'threesquirrels', brandColor: '#FF6B00' },
]

function App() {
  const [data, setData] = useState(null)
  const [activeBrand, setActiveBrand] = useState('popmart')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const scrollRef = useRef(null)

  useEffect(() => {
    fetch('/news-data.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load data')
        return res.json()
      })
      .then(json => {
        setData(json)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  const currentBrand = BRANDS.find(b => b.brandKey === activeBrand)
  const brandNews = data?.brands?.find(b => b.brandKey === activeBrand)?.news || []

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400">加载中...</p>
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

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="text-2xl">📊</span> 品牌脉搏
              </h1>
              <p className="text-xs text-gray-400 mt-1">
                {data?.date && `数据更新: ${data.date}`}
              </p>
            </div>
            <span className="text-xs text-gray-500">Brand Pulse</span>
          </div>
          {/* Brand Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {BRANDS.map(brand => (
              <button
                key={brand.brandKey}
                onClick={() => setActiveBrand(brand.brandKey)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  activeBrand === brand.brandKey
                    ? 'text-white shadow-lg'
                    : 'bg-slate-800 text-gray-400 hover:bg-slate-700 hover:text-gray-300'
                }`}
                style={activeBrand === brand.brandKey ? { backgroundColor: brand.brandColor } : {}}
              >
                {brand.brandName}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Brand Summary */}
        <div className="mb-6 flex items-center gap-3">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: currentBrand?.brandColor }}
          ></div>
          <h2 className="text-lg font-semibold text-white">{currentBrand?.brandName}</h2>
          <span className="text-sm text-gray-400">{brandNews.length} 条资讯</span>
        </div>

        {/* News List */}
        <div className="space-y-3" ref={scrollRef}>
          {brandNews.length === 0 ? (
            <div className="text-center py-12 text-gray-500">暂无资讯</div>
          ) : (
            brandNews.map(item => (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 hover:bg-slate-800 hover:border-slate-600 transition-all group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    {item.summary && item.summary !== item.title && (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">{item.summary}</p>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap mt-0.5">
                    {item.publishedAt?.slice(0, 10)}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span
                    className="inline-block w-2 h-2 rounded-full"
                    style={{ backgroundColor: currentBrand?.brandColor }}
                  ></span>
                  <span className="text-xs text-gray-500">{item.source}</span>
                </div>
              </a>
            ))
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-xs text-gray-600">
        Brand Pulse · 品牌资讯实时追踪
      </footer>
    </div>
  )
}

export default App
