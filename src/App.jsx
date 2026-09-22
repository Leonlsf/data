import { useState, useEffect } from 'react'

function formatTime(isoStr) {
  if (!isoStr) return ''
  const d = new Date(isoStr)
  if (isNaN(d.getTime())) return isoStr
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hour = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')
  return `${month}-${day} ${hour}:${min}`
}

function formatLastUpdated(isoStr) {
  if (!isoStr) return ''
  const d = new Date(isoStr)
  if (isNaN(d.getTime())) return isoStr
  return d.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
}

function BrandSection({ brand }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
      {/* brand header */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
        <span
          className="inline-block w-3 h-3 rounded-full shrink-0"
          style={{ backgroundColor: brand.brandColor }}
        />
        <h2 className="text-lg font-semibold text-gray-900">{brand.brandName}</h2>
      </div>

      {/* news list */}
      <div className="flex-1 overflow-y-auto max-h-[420px] min-h-[120px]">
        {brand.news.length === 0 ? (
          <div className="px-5 py-8 text-sm text-gray-400 text-center">
            暂无资讯
          </div>
        ) : (
          <ul className="divide-y divide-gray-50">
            {brand.news.map((item, idx) => (
              <li key={idx} className="px-5 py-3 hover:bg-gray-50/60 transition-colors">
                <a
                  href={item.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-gray-800 hover:text-blue-600 hover:underline line-clamp-2 leading-snug"
                >
                  {item.title}
                </a>
                <div className="mt-1.5 flex items-center gap-2 text-xs text-gray-400">
                  <span>{item.source}</span>
                  <span>·</span>
                  <span>{formatTime(item.publishTime)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

function App() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/news-data.json')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-gray-500">加载中…</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-sm border border-red-100 px-8 py-6 max-w-md text-center">
          <div className="text-red-500 text-3xl mb-3">⚠</div>
          <p className="text-sm text-gray-700 mb-1">数据加载失败</p>
          <p className="text-xs text-gray-400">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* top header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">
              B
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
              品牌资讯
            </h1>
            <span className="text-xs text-gray-400 font-medium ml-1 hidden sm:inline">
              Brand Pulse
            </span>
          </div>
          {data.lastUpdated && (
            <div className="text-xs text-gray-400">
              更新于 {formatLastUpdated(data.lastUpdated)}
            </div>
          )}
        </div>
      </header>

      {/* brand grid */}
      <main className="max-w-6xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {data.brands.map((brand) => (
            <BrandSection key={brand.brandKey} brand={brand} />
          ))}
        </div>
      </main>

      {/* footer */}
      <footer className="border-t border-gray-100 mt-8">
        <div className="max-w-6xl mx-auto px-6 py-4 text-center text-xs text-gray-400">
          Brand Pulse · 品牌资讯看板
        </div>
      </footer>
    </div>
  )
}

export default App
