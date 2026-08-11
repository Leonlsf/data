import { useState, useEffect } from 'react'

function App() {
  const [newsData, setNewsData] = useState(null)
  const [activeBrand, setActiveBrand] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/news-data.json')
      .then(res => {
        if (!res.ok) throw new Error('数据加载失败')
        return res.json()
      })
      .then(data => {
        setNewsData(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>
        <div style={{ textAlign: 'center', color: '#666' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
          <div>加载中...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>
        <div style={{ textAlign: 'center', color: '#e74c3c' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>❌</div>
          <div>{error}</div>
        </div>
      </div>
    )
  }

  const brands = newsData?.brands || []
  const currentBrand = brands[activeBrand]

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '24px 16px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <header style={{ marginBottom: 32, textAlign: 'center' }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1a1a2e', margin: 0 }}>品牌资讯 Brand Pulse</h1>
        <p style={{ fontSize: 14, color: '#999', marginTop: 8 }}>
          数据更新于 {newsData?.lastUpdated?.replace('T', ' ').replace('+08:00', '') || '未知'}
        </p>
      </header>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
        {brands.map((brand, idx) => (
          <button
            key={brand.brandKey}
            onClick={() => setActiveBrand(idx)}
            style={{
              padding: '10px 24px',
              border: 'none',
              borderRadius: 24,
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
              backgroundColor: activeBrand === idx ? brand.brandColor : '#f0f0f0',
              color: activeBrand === idx ? '#fff' : '#333',
              boxShadow: activeBrand === idx ? `0 2px 8px ${brand.brandColor}40` : 'none',
            }}
          >
            {brand.brandName}
          </button>
        ))}
      </div>

      {currentBrand && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: currentBrand.brandColor }} />
            <h2 style={{ fontSize: 20, fontWeight: 600, color: '#1a1a2e', margin: 0 }}>
              {currentBrand.brandName}
            </h2>
            <span style={{ fontSize: 13, color: '#999' }}>
              {currentBrand.news.length} 条资讯
            </span>
          </div>

          {currentBrand.news.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>暂无资讯</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {currentBrand.news.map(item => (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'block',
                    padding: '16px 20px',
                    backgroundColor: '#fff',
                    borderRadius: 12,
                    textDecoration: 'none',
                    border: '1px solid #eee',
                    transition: 'box-shadow 0.2s, transform 0.1s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 4px 16px ${currentBrand.brandColor}20`; e.currentTarget.style.transform = 'translateY(-1px)' }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none' }}
                >
                  <div style={{ fontSize: 16, fontWeight: 500, color: '#1a1a2e', lineHeight: 1.5, marginBottom: 8 }}>
                    {item.title}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13, color: '#999' }}>{item.source}</span>
                    <span style={{ fontSize: 13, color: '#999' }}>
                      {item.publishedAt?.replace('T', ' ').replace('+08:00', '') || ''}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default App
