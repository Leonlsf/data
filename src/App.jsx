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

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div style={{ fontSize: '1.25rem', color: '#94a3b8' }}>加载中...</div>
      </div>
    )
  }

  if (!data || !data.brands) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div style={{ fontSize: '1.25rem', color: '#94a3b8' }}>暂无数据</div>
      </div>
    )
  }

  const brands = data.brands
  const currentBrand = brands[activeBrand]

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a' }}>
      {/* Header */}
      <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #1e293b' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
            品牌资讯 Brand Pulse
          </h1>
          <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
            更新于 {data.lastUpdated ? new Date(data.lastUpdated).toLocaleString('zh-CN') : data.date}
          </div>
        </div>
      </div>

      {/* Brand Tabs */}
      <div style={{ padding: '1rem 2rem', borderBottom: '1px solid #1e293b' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {brands.map((brand, idx) => (
            <button
              key={brand.brandKey}
              onClick={() => setActiveBrand(idx)}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: idx === activeBrand ? '600' : '400',
                background: idx === activeBrand ? brand.brandColor : '#1e293b',
                color: idx === activeBrand ? '#0f172a' : '#e2e8f0',
                transition: 'all 0.2s',
              }}
            >
              {brand.brandName}
            </button>
          ))}
        </div>
      </div>

      {/* News List */}
      <div style={{ padding: '1.5rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.125rem', fontWeight: '600', color: currentBrand.brandColor }}>
              {currentBrand.brandName}
            </span>
            <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
              {currentBrand.news.length} 条资讯
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {currentBrand.news.map((item) => (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'block',
                  padding: '1rem 1.25rem',
                  borderRadius: '0.75rem',
                  background: '#1e293b',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'background 0.2s',
                  borderLeft: `3px solid ${currentBrand.brandColor}`,
                }}
              >
                <div style={{ fontSize: '1rem', fontWeight: '500', marginBottom: '0.375rem', lineHeight: '1.5' }}>
                  {item.title}
                </div>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: '#94a3b8' }}>
                  <span>{item.source}</span>
                  <span>{item.publishedAt ? new Date(item.publishedAt).toLocaleString('zh-CN') : ''}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
