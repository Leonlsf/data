import { useState, useEffect } from 'react'

function App() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState(0)

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

  const brand = data.brands[activeTab]

  return (
    <div className="min-h-screen bg-slate-900">
      <header className="bg-slate-800/50 border-b border-slate-700 sticky top-0 z-10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">品牌资讯</h1>
          <span className="text-sm text-slate-400">
            更新于 {data.lastUpdated ? new Date(data.lastUpdated).toLocaleString('zh-CN') : '-'}
          </span>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 pt-6">
        <div className="flex gap-2 flex-wrap">
          {data.brands.map((b, i) => (
            <button
              key={b.brandKey}
              onClick={() => setActiveTab(i)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                activeTab === i
                  ? 'text-white shadow-lg'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
              }`}
              style={activeTab === i ? { backgroundColor: b.brandColor } : {}}
            >
              {b.brandName}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {brand && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: brand.brandColor }}></div>
              <h2 className="text-lg font-semibold text-white">
                {brand.brandName}
                <span className="ml-2 text-sm font-normal text-slate-400">{brand.news.length} 条资讯</span>
              </h2>
            </div>
            <div className="space-y-3">
              {brand.news.map(item => (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-slate-800/60 rounded-lg p-4 hover:bg-slate-700/60 transition-colors border border-slate-700/50 hover:border-slate-600"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-slate-100 font-medium leading-snug line-clamp-2">{item.title}</h3>
                      <p className="text-slate-500 text-sm mt-1 line-clamp-1">{item.summary}</p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <div className="text-xs text-slate-500">{item.source}</div>
                      <div className="text-xs text-slate-600 mt-1">
                        {new Date(item.publishedAt).toLocaleDateString('zh-CN')}
                      </div>
                    </div>
                  </div>
                </a>
              ))}
              {brand.news.length === 0 && (
                <div className="text-center text-slate-500 py-12">暂无资讯</div>
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-slate-800 mt-12 py-6 text-center text-sm text-slate-600">
        Brand Pulse &copy; {new Date().getFullYear()}
      </footer>
    </div>
  )
}

export default App
