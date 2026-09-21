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
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-gray-500">加载中...</div>
      </div>
    )
  }

  if (!data || !data.brands) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-red-500">数据加载失败</div>
      </div>
    )
  }

  const currentBrand = data.brands[activeBrand]

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800">品牌资讯 Brand Pulse</h1>
          <p className="text-sm text-gray-500 mt-1">
            更新时间：{data.lastUpdated ? new Date(data.lastUpdated).toLocaleString('zh-CN') : '-'}
          </p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex gap-3 mb-6 flex-wrap">
          {data.brands.map((brand, idx) => (
            <button
              key={brand.brandKey}
              onClick={() => setActiveBrand(idx)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                idx === activeBrand
                  ? 'text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
              }`}
              style={idx === activeBrand ? { backgroundColor: brand.brandColor } : {}}
            >
              {brand.brandName}
              <span className="ml-1.5 opacity-75">({brand.news.length})</span>
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: currentBrand.brandColor }}
            />
            <h2 className="text-lg font-semibold text-gray-800">{currentBrand.brandName} 资讯</h2>
          </div>
          <ul className="divide-y divide-gray-50">
            {currentBrand.news.length === 0 && (
              <li className="px-6 py-8 text-center text-gray-400">暂无资讯</li>
            )}
            {currentBrand.news.map((item) => (
              <li key={item.id} className="px-6 py-3.5 hover:bg-gray-50 transition-colors">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <div className="text-sm text-gray-800 hover:text-blue-600 leading-relaxed">
                    {item.title}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {item.source} · {item.publishedAt ? new Date(item.publishedAt).toLocaleString('zh-CN') : ''}
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default App
