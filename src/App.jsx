import { useState, useEffect } from 'react'

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatUpdateDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function App() {
  const [data, setData] = useState(null)
  const [activeBrand, setActiveBrand] = useState(null)
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
        if (json.brands && json.brands.length > 0) {
          setActiveBrand(json.brands[0].brandKey)
        }
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
        <div className="text-gray-500 text-lg">加载中...</div>
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

  const currentBrand = data?.brands?.find((b) => b.brandKey === activeBrand)

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-5 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h1 className="text-2xl font-bold text-gray-900">品牌资讯</h1>
            {data?.lastUpdated && (
              <p className="text-sm text-gray-500">
                更新于 {formatUpdateDate(data.lastUpdated)}
              </p>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-6 sm:px-6">
        {/* Brand Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {data?.brands?.map((brand) => {
            const isActive = activeBrand === brand.brandKey
            const count = brand.news?.length || 0
            return (
              <button
                key={brand.brandKey}
                onClick={() => setActiveBrand(brand.brandKey)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
                style={{
                  backgroundColor: isActive ? brand.brandColor : '#f3f4f6',
                  color: isActive ? '#ffffff' : '#4b5563',
                  boxShadow: isActive
                    ? `0 2px 8px ${brand.brandColor}40`
                    : 'none',
                }}
              >
                {brand.brandName}
                <span
                  className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-semibold"
                  style={{
                    backgroundColor: isActive
                      ? 'rgba(255,255,255,0.25)'
                      : '#e5e7eb',
                    color: isActive ? '#ffffff' : '#6b7280',
                  }}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* News List */}
        <div className="space-y-3">
          {currentBrand && currentBrand.news && currentBrand.news.length > 0 ? (
            currentBrand.news.map((item) => (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white rounded-lg p-4 sm:p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-200 group"
              >
                <div className="flex flex-col gap-2">
                  <h3 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  {item.summary && (
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {item.summary}
                    </p>
                  )}
                  <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                    <span>{formatDate(item.publishedAt)}</span>
                    {item.source && (
                      <>
                        <span className="inline-block w-1 h-1 rounded-full bg-gray-300" />
                        <span>{item.source}</span>
                      </>
                    )}
                  </div>
                </div>
              </a>
            ))
          ) : (
            <div className="text-center py-16 text-gray-400">
              <div className="text-4xl mb-3">📭</div>
              <p className="text-base">暂无相关资讯</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 text-center text-xs text-gray-400 border-t border-gray-100">
        品牌资讯 · 数据仅供参考
      </footer>
    </div>
  )
}

export default App
