import { useState, useEffect } from 'react'

const BRAND_COLORS = {
  popmart: '#FFD700',
  masterkong: '#E4002B',
  yili: '#00A650',
  threesquirrels: '#FF6B00',
}

function App() {
  const [data, setData] = useState(null)
  const [activeBrand, setActiveBrand] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/news-data.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch news data')
        return res.json()
      })
      .then(json => {
        setData(json)
        if (json.brands && json.brands.length > 0) {
          setActiveBrand(json.brands[0].brandKey)
        }
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-400">加载中...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-400">加载失败: {error}</div>
      </div>
    )
  }

  const currentBrand = data?.brands?.find(b => b.brandKey === activeBrand)

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Brand Pulse</h1>
            <span className="text-sm text-slate-400">
              更新于 {data?.lastUpdated?.replace('T', ' ').replace('+08:00', '') || '-'}
            </span>
          </div>
          {/* Brand Tabs */}
          <div className="flex gap-2 mt-4">
            {data?.brands?.map(brand => (
              <button
                key={brand.brandKey}
                onClick={() => setActiveBrand(brand.brandKey)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeBrand === brand.brandKey
                    ? 'text-white shadow-lg'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
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
        {currentBrand && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: currentBrand.brandColor }}
              />
              <h2 className="text-xl font-semibold text-white">{currentBrand.brandName} 资讯</h2>
              <span className="text-slate-400 text-sm">({currentBrand.news?.length || 0} 条)</span>
            </div>

            {!currentBrand.news || currentBrand.news.length === 0 ? (
              <div className="text-center py-12 text-slate-400">暂无资讯数据</div>
            ) : (
              <div className="space-y-3">
                {currentBrand.news.map(item => (
                  <a
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-slate-800 border border-slate-700 rounded-lg p-4 hover:border-slate-500 hover:bg-slate-750 transition-all group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-medium group-hover:text-blue-300 transition-colors line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="text-slate-400 text-sm mt-1 line-clamp-1">{item.summary}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-slate-500 text-xs">{item.date || item.publishedAt?.split('T')[0]}</div>
                        <div className="text-slate-600 text-xs mt-1">{item.source}</div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 mt-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-slate-500 text-sm">
          Brand Pulse - 品牌资讯每日更新
        </div>
      </footer>
    </div>
  )
}

export default App
