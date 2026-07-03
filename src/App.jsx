import { useState, useEffect } from 'react'

function formatTime(isoString) {
  if (!isoString) return ''
  const d = new Date(isoString)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function App() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/news-data.json')
      .then((res) => {
        if (!res.ok) throw new Error('数据加载失败')
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-400 text-lg">加载中...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    )
  }

  const { lastUpdated, brands } = data || {}

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* 页面标题 & 更新时间 */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">品牌资讯</h1>
        {lastUpdated && (
          <p className="text-sm text-gray-400">
            最后更新：{formatTime(lastUpdated)}
          </p>
        )}
      </header>

      {/* 品牌卡片列表 */}
      {brands && brands.length > 0 ? (
        <div className="space-y-8">
          {brands.map((brand) => (
            <BrandCard key={brand.brandKey} brand={brand} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-400 py-20">暂无品牌资讯</div>
      )}
    </div>
  )
}

function BrandCard({ brand }) {
  const { brandName, brandColor, news } = brand

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* 品牌头部 */}
      <div
        className="px-6 py-4 flex items-center gap-3"
        style={{ borderBottom: `3px solid ${brandColor}` }}
      >
        <span
          className="w-3 h-3 rounded-full shrink-0"
          style={{ backgroundColor: brandColor }}
        />
        <h2 className="text-xl font-semibold text-gray-800">{brandName}</h2>
      </div>

      {/* 新闻列表 */}
      <ul className="divide-y divide-gray-50">
        {news && news.length > 0 ? (
          news.map((item) => (
            <li key={item.id}>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-base font-medium text-gray-700 mb-1 leading-snug">
                  {item.title}
                </h3>
                {item.summary && (
                  <p className="text-sm text-gray-400 mb-2 line-clamp-2">
                    {item.summary}
                  </p>
                )}
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  {item.publishedAt && (
                    <span>{formatTime(item.publishedAt)}</span>
                  )}
                  {item.source && (
                    <>
                      <span>·</span>
                      <span>{item.source}</span>
                    </>
                  )}
                </div>
              </a>
            </li>
          ))
        ) : (
          <li className="px-6 py-6 text-center text-gray-300 text-sm">
            暂无新闻
          </li>
        )}
      </ul>
    </div>
  )
}

export default App
