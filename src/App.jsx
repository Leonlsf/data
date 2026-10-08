import { useState, useEffect } from 'react'

function App() {
  const [data, setData] = useState(null)
  const [activeBrand, setActiveBrand] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/news-data.json')
      .then(res => res.json())
      .then(json => {
        setData(json)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="min-h-screen bg-gray-950 flex items-center justify-center"><p className="text-white text-xl">加载中...</p></div>
  if (!data) return <div className="min-h-screen bg-gray-950 flex items-center justify-center"><p className="text-red-400 text-xl">数据加载失败</p></div>

  const brands = data.brands || []
  const currentBrand = brands[activeBrand]

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800 px-6 py-4">
        <h1 className="text-2xl font-bold">Brand Pulse <span className="text-gray-400 font-normal text-lg">品牌资讯</span></h1>
        {data.lastUpdated && <p className="text-sm text-gray-500 mt-1">更新于 {data.lastUpdated}</p>}
      </header>
      <nav className="flex gap-2 px-6 py-3 border-b border-gray-800 overflow-x-auto">
        {brands.map((brand, i) => (
          <button
            key={brand.brandKey}
            onClick={() => setActiveBrand(i)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${i === activeBrand ? 'text-white' : 'text-gray-400 hover:text-gray-200'}`}
            style={i === activeBrand ? { backgroundColor: brand.brandColor, color: '#fff' } : {}}
          >
            {brand.brandName}
          </button>
        ))}
      </nav>
      <main className="px-6 py-4 max-w-4xl mx-auto">
        {currentBrand && (
          <>
            <h2 className="text-xl font-semibold mb-4" style={{ color: currentBrand.brandColor }}>{currentBrand.brandName} 资讯</h2>
            {currentBrand.news && currentBrand.news.length > 0 ? (
              <ul className="space-y-3">
                {currentBrand.news.map(item => (
                  <li key={item.id} className="bg-gray-900 rounded-lg p-4 border border-gray-800 hover:border-gray-700 transition-colors">
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 font-medium text-base leading-snug">
                      {item.title}
                    </a>
                    <div className="flex gap-3 mt-2 text-xs text-gray-500">
                      <span>{item.source}</span>
                      <span>{item.publishedAt}</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">暂无资讯</p>
            )}
          </>
        )}
      </main>
    </div>
  )
}

export default App
