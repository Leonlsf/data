import { useState, useEffect } from 'react'

const brandColors = {
  popmart: '#FFD700',
  masterkong: '#E4002B',
  yili: '#00A650',
  threesquirrels: '#FF6B00',
}

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

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-red-400">数据加载失败</div>
      </div>
    )
  }

  const currentBrand = data.brands?.find(b => b.brandKey === activeBrand)

  return (
    <div className="min-h-screen bg-slate-900">
      <header className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <h1 className="text-2xl font-bold text-white">
          Brand Pulse{' '}
          <span className="text-slate-400 font-normal text-lg">品牌资讯</span>
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          数据更新: {data.lastUpdated || '-'}
        </p>
      </header>

      <nav className="flex gap-2 px-6 py-3 bg-slate-800/50 border-b border-slate-700/50 overflow-x-auto">
        {data.brands?.map(brand => (
          <button
            key={brand.brandKey}
            onClick={() => setActiveBrand(brand.brandKey)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              activeBrand === brand.brandKey
                ? 'text-white shadow-lg'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
            style={
              activeBrand === brand.brandKey
                ? { backgroundColor: brandColors[brand.brandKey] }
                : {}
            }
          >
            {brand.brandName}
            <span className="ml-2 text-xs opacity-75">
              ({brand.news?.length || 0})
            </span>
          </button>
        ))}
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-6">
        {currentBrand && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: brandColors[currentBrand.brandKey] }}
              />
              <h2 className="text-xl font-semibold text-white">
                {currentBrand.brandName}
              </h2>
            </div>
            {currentBrand.news && currentBrand.news.length > 0 ? (
              <ul className="space-y-3">
                {currentBrand.news.map(item => (
                  <li
                    key={item.id}
                    className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition-colors"
                  >
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <div className="text-white font-medium hover:underline">
                        {item.title}
                      </div>
                      <div className="flex items-center gap-3 mt-2 text-sm text-slate-400">
                        <span>{item.source}</span>
                        <span>{item.publishedAt}</span>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-400 text-center py-8">暂无资讯</p>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default App
