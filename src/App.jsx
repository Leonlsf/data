import { useState, useEffect } from 'react'

function App() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeBrand, setActiveBrand] = useState(null)

  useEffect(() => {
    fetch('/news-data.json')
      .then(res => {
        if (!res.ok) throw new Error('数据加载失败')
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
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-slate-400">加载中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-400">
          <p className="text-xl mb-2">加载失败</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    )
  }

  const activeBrandData = data?.brands?.find(b => b.brandKey === activeBrand)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/5 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">BP</div>
            <h1 className="text-xl font-bold text-white">品牌资讯</h1>
          </div>
          <div className="text-xs text-slate-500">
            更新于 {data?.lastUpdated ? new Date(data.lastUpdated).toLocaleString('zh-CN') : '-'}
          </div>
        </div>
      </header>

      {/* Brand Tabs */}
      <div className="max-w-7xl mx-auto px-4 pt-6">
        <div className="flex gap-3 flex-wrap">
          {data?.brands?.map(brand => (
            <button
              key={brand.brandKey}
              onClick={() => setActiveBrand(brand.brandKey)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeBrand === brand.brandKey
                  ? 'text-white shadow-lg scale-105'
                  : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 hover:text-slate-300'
              }`}
              style={activeBrand === brand.brandKey ? { backgroundColor: brand.brandColor, boxShadow: `0 4px 14px ${brand.brandColor}40` } : {}}
            >
              {brand.brandName}
              <span className="ml-2 text-xs opacity-70">({brand.news?.length || 0})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Brand Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeBrandData && (
          <div className="brand-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: activeBrandData.brandColor }}></div>
              <h2 className="text-lg font-semibold text-white">{activeBrandData.brandName} 资讯</h2>
            </div>
            <div className="space-y-0">
              {activeBrandData.news && activeBrandData.news.length > 0 ? (
                activeBrandData.news.map((item, idx) => (
                  <div key={item.id || idx} className="news-item">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: activeBrandData.brandColor }}></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="block text-sm leading-relaxed">
                          {item.title}
                        </a>
                        <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                          <span>{item.source}</span>
                          <span>{item.publishedAt ? new Date(item.publishedAt).toLocaleString('zh-CN') : ''}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-slate-500">
                  <p>暂无资讯数据</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-xs text-slate-600">
          Brand Pulse - 品牌资讯每日更新
        </div>
      </footer>
    </div>
  )
}

export default App
