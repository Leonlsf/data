import { useState, useEffect } from 'react'

const BRAND_COLORS = {
  popmart: '#FFD700',
  masterkong: '#E4002B',
  yili: '#00A650',
  threesquirrels: '#FF6B00',
}

function formatDate(dateStr) {
  const d = new Date(dateStr)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function formatTime(dateStr) {
  const d = new Date(dateStr)
  const h = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')
  const sec = String(d.getSeconds()).padStart(2, '0')
  return `${h}:${min}:${sec}`
}

function App() {
  const [data, setData] = useState(null)
  const [activeBrand, setActiveBrand] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/news-data.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load data')
        return res.json()
      })
      .then((json) => {
        setData(json)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-400 text-lg">加载中...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    )
  }

  const brands = data.brands || []
  const currentBrand = brands[activeBrand]
  const brandColor = currentBrand ? BRAND_COLORS[currentBrand.brandKey] || '#333' : '#333'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="text-2xl font-bold tracking-tight"
                style={{ color: brandColor }}
              >
                BP
              </span>
              <span className="text-gray-500 text-sm">|</span>
              <span className="text-gray-700 font-medium">品牌资讯</span>
            </div>
            {data.date && (
              <span className="text-gray-400 text-sm">
                更新于 {data.date}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Brand Tabs */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto py-2">
            {brands.map((brand, index) => {
              const color = BRAND_COLORS[brand.brandKey] || '#333'
              const isActive = index === activeBrand
              return (
                <button
                  key={brand.brandKey}
                  onClick={() => setActiveBrand(index)}
                  className={`
                    flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium
                    transition-all duration-200 cursor-pointer
                    ${
                      isActive
                        ? 'text-white shadow-sm'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }
                  `}
                  style={isActive ? { backgroundColor: color } : {}}
                >
                  {brand.brandName}
                  <span
                    className={`ml-1 text-xs ${
                      isActive ? 'text-white/80' : 'text-gray-400'
                    }`}
                  >
                    ({brand.news?.length || 0})
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* News List */}
      <main className="max-w-4xl mx-auto px-4 py-4">
        {currentBrand && (
          <div>
            <h2
              className="text-lg font-bold mb-4 pb-2 border-b-2"
              style={{ borderColor: brandColor, color: brandColor }}
            >
              {currentBrand.brandName} 资讯
            </h2>
            <div className="space-y-0">
              {currentBrand.news?.map((item) => (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-white rounded-lg px-4 py-3 mb-2 hover:shadow-md transition-shadow duration-200 border border-gray-100 hover:border-gray-200"
                >
                  <h3 className="text-gray-800 font-medium text-base leading-snug mb-1.5 line-clamp-2">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span>{formatDate(item.publishedAt)}</span>
                    <span>{formatTime(item.publishedAt)}</span>
                    <span className="text-gray-300">|</span>
                    <span
                      className="font-medium"
                      style={{ color: brandColor }}
                    >
                      {item.source}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-300 text-xs">
        Brand Pulse
      </footer>
    </div>
  )
}

export default App
